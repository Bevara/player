function FETCH_MODULE(MODULE_HEAP, MODULE, ABORT, EXPORT_WRAPPER, STRINGTOUTF8, UTF8TOSTRING) {

    // Global function
    var HEAP,
        /** @type {!ArrayBuffer} */
        buffer,
        /** @type {!Int8Array} */
        HEAP8,
        /** @type {!Uint8Array} */
        HEAPU8,
        /** @type {!Int16Array} */
        HEAP16,
        /** @type {!Uint16Array} */
        HEAPU16,
        /** @type {!Int32Array} */
        HEAP32,
        /** @type {!Uint32Array} */
        HEAPU32,
        /** @type {!Float32Array} */
        HEAPF32,
        /** @type {!Float64Array} */
        HEAPF64;

    function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        HEAP8 = new Int8Array(buf);
        HEAP16 = new Int16Array(buf);
        HEAP32 = new Int32Array(buf);
        HEAPU8 = new Uint8Array(buf);
        HEAPU16 = new Uint16Array(buf);
        HEAPU32 = new Uint32Array(buf);
        HEAPF32 = new Float32Array(buf);
        HEAPF64 = new Float64Array(buf);
    }
    updateGlobalBufferAndViews(MODULE_HEAP);

    /** @type {function(*, string=)} */
    function assert(condition, text) {
        if (!condition) {
            abort('Assertion failed' + (text ? ': ' + text : ''));
        }
    }

    var Module = MODULE;
    var createExportWrapper = EXPORT_WRAPPER;
    var _malloc = Module["_malloc"] = createExportWrapper("malloc");
    var err = console.warn.bind(console);
    var UTF8ToString = UTF8TOSTRING;
    var stringToUTF8 = STRINGTOUTF8;

    var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

    var Fetch = {
        xhrs: [], setu64: function (addr, val) {
            HEAPU32[addr >> 2] = val;
            HEAPU32[addr + 4 >> 2] = (val / 4294967296) | 0;
        }, openDatabase: function (dbname, dbversion, onsuccess, onerror) {
            try {
                var openRequest = indexedDB.open(dbname, dbversion);
            } catch (e) { return onerror(e); }

            openRequest.onupgradeneeded = (event) => {
                var db = /** @type {IDBDatabase} */ (event.target.result);
                if (db.objectStoreNames.contains('FILES')) {
                    db.deleteObjectStore('FILES');
                }
                db.createObjectStore('FILES');
            };
            openRequest.onsuccess = (event) => onsuccess(event.target.result);
            openRequest.onerror = (error) => onerror(error);
        }, staticInit: function () {
            var isMainThread = true;

            var onsuccess = (db) => {
                Fetch.dbInstance = db;

                if (isMainThread) {
                    removeRunDependency('library_fetch_init');
                }
            };
            var onerror = () => {
                Fetch.dbInstance = false;

                if (isMainThread) {
                    removeRunDependency('library_fetch_init');
                }
            };
            Fetch.openDatabase('emscripten_filesystem', 1, onsuccess, onerror);

            if (typeof ENVIRONMENT_IS_FETCH_WORKER == 'undefined' || !ENVIRONMENT_IS_FETCH_WORKER) addRunDependency('library_fetch_init');
        }
    };

    function __emscripten_fetch_get_response_headers(id, dst, dstSizeBytes) {
        var responseHeaders = Fetch.xhrs[id - 1].getAllResponseHeaders();
        var lengthBytes = lengthBytesUTF8(responseHeaders) + 1;
        stringToUTF8(responseHeaders, dst, dstSizeBytes);
        return Math.min(lengthBytes, dstSizeBytes);
    }

    function __emscripten_fetch_get_response_headers_length(id) {
        return lengthBytesUTF8(Fetch.xhrs[id - 1].getAllResponseHeaders()) + 1;
    }

    function _emscripten_is_main_browser_thread() {
        return !ENVIRONMENT_IS_WORKER;
    }

    // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
    function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            var u = str.charCodeAt(i); // possibly a lead surrogate
            if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
            if (u <= 0x7F) ++len;
            else if (u <= 0x7FF) len += 2;
            else if (u <= 0xFFFF) len += 3;
            else len += 4;
        }
        return len;
    }


    /** @param {boolean=} synchronous */
    function callUserCallback(func, synchronous) {
        if (ABORT) {
            err('user callback triggered after runtime exited or application aborted.  Ignoring.');
            return;
        }
        // For synchronous calls, let any exceptions propagate, and don't let the runtime exit.
        if (synchronous) {
            func();
            return;
        }
        try {
            func();
        } catch (e) {
            handleException(e);
        }
    }

    function fetchLoadCachedData(db, fetch, onsuccess, onerror) {
        if (!db) {
            onerror(fetch, 0, 'IndexedDB not available!');
            return;
        }

        var fetch_attr = fetch + 112;
        var path = HEAPU32[fetch_attr + 64 >> 2];
        if (!path) path = HEAPU32[fetch + 8 >> 2];
        var pathStr = UTF8ToString(path);

        try {
            var transaction = db.transaction(['FILES'], 'readonly');
            var packages = transaction.objectStore('FILES');
            var getRequest = packages.get(pathStr);
            getRequest.onsuccess = (event) => {
                if (event.target.result) {
                    var value = event.target.result;
                    var len = value.byteLength || value.length;
                    // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
                    // freed when emscripten_fetch_close() is called.
                    var ptr = _malloc(len);
                    HEAPU8.set(new Uint8Array(value), ptr);
                    HEAPU32[fetch + 12 >> 2] = ptr;
                    Fetch.setu64(fetch + 16, len);
                    Fetch.setu64(fetch + 24, 0);
                    Fetch.setu64(fetch + 32, len);
                    HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
                    HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
                    stringToUTF8("OK", fetch + 44, 64);
                    onsuccess(fetch, 0, value);
                } else {
                    // Succeeded to load, but the load came back with the value of undefined, treat that as an error since we never store undefined in db.
                    HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
                    HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
                    stringToUTF8("Not Found", fetch + 44, 64);
                    onerror(fetch, 0, 'no data');
                }
            };
            getRequest.onerror = (error) => {
                HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
                HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
                stringToUTF8("Not Found", fetch + 44, 64);
                onerror(fetch, 0, error);
            };
        } catch (e) {
            onerror(fetch, 0, e);
        }
    }

    function fetchXHR(fetch, onsuccess, onerror, onprogress, onreadystatechange) {
        var url = HEAPU32[fetch + 8 >> 2];
        if (!url) {
            onerror(fetch, 0, 'no url specified!');
            return;
        }
        var url_ = UTF8ToString(url);

        var fetch_attr = fetch + 112;
        var requestMethod = UTF8ToString(fetch_attr);
        if (!requestMethod) requestMethod = 'GET';
        var userData = HEAPU32[fetch + 4 >> 2];
        var fetchAttributes = HEAPU32[fetch_attr + 52 >> 2];
        var timeoutMsecs = HEAPU32[fetch_attr + 56 >> 2];
        var withCredentials = !!HEAPU32[fetch_attr + 60 >> 2];
        var destinationPath = HEAPU32[fetch_attr + 64 >> 2];
        var userName = HEAPU32[fetch_attr + 68 >> 2];
        var password = HEAPU32[fetch_attr + 72 >> 2];
        var requestHeaders = HEAPU32[fetch_attr + 76 >> 2];
        var overriddenMimeType = HEAPU32[fetch_attr + 80 >> 2];
        var dataPtr = HEAPU32[fetch_attr + 84 >> 2];
        var dataLength = HEAPU32[fetch_attr + 88 >> 2];

        var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
        var fetchAttrStreamData = !!(fetchAttributes & 2);
        var fetchAttrPersistFile = !!(fetchAttributes & 4);
        var fetchAttrAppend = !!(fetchAttributes & 8);
        var fetchAttrReplace = !!(fetchAttributes & 16);
        var fetchAttrSynchronous = !!(fetchAttributes & 64);
        var fetchAttrWaitable = !!(fetchAttributes & 128);

        var userNameStr = userName ? UTF8ToString(userName) : undefined;
        var passwordStr = password ? UTF8ToString(password) : undefined;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = withCredentials;
        xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
        if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs; // XHR timeout field is only accessible in async XHRs, and must be set after .open() but before .send().
        xhr.url_ = url_; // Save the url for debugging purposes (and for comparing to the responseURL that server side advertised)
        assert(!fetchAttrStreamData, 'streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()');
        xhr.responseType = 'arraybuffer';

        if (overriddenMimeType) {
            var overriddenMimeTypeStr = UTF8ToString(overriddenMimeType);
            xhr.overrideMimeType(overriddenMimeTypeStr);
        }
        if (requestHeaders) {
            for (; ;) {
                var key = HEAPU32[requestHeaders >> 2];
                if (!key) break;
                var value = HEAPU32[requestHeaders + 4 >> 2];
                if (!value) break;
                requestHeaders += 8;
                var keyStr = UTF8ToString(key);
                var valueStr = UTF8ToString(value);
                xhr.setRequestHeader(keyStr, valueStr);
            }
        }
        Fetch.xhrs.push(xhr);
        var id = Fetch.xhrs.length;
        HEAPU32[fetch + 0 >> 2] = id;
        var data = (dataPtr && dataLength) ? HEAPU8.slice(dataPtr, dataPtr + dataLength) : null;
        // TODO: Support specifying custom headers to the request.

        // Share the code to save the response, as we need to do so both on success
        // and on error (despite an error, there may be a response, like a 404 page).
        // This receives a condition, which determines whether to save the xhr's
        // response, or just 0.
        function saveResponse(condition) {
            var ptr = 0;
            var ptrLen = 0;
            if (condition) {
                ptrLen = xhr.response ? xhr.response.byteLength : 0;
                // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
                // freed when emscripten_fetch_close() is called.
                ptr = _malloc(ptrLen);
                HEAPU8.set(new Uint8Array(/** @type{Array<number>} */(xhr.response)), ptr);
            }
            HEAPU32[fetch + 12 >> 2] = ptr;
            Fetch.setu64(fetch + 16, ptrLen);
        }

        xhr.onload = (e) => {
            saveResponse(fetchAttrLoadToMemory && !fetchAttrStreamData);
            var len = xhr.response ? xhr.response.byteLength : 0;
            Fetch.setu64(fetch + 24, 0);
            if (len) {
                // If the final XHR.onload handler receives the bytedata to compute total length, report that,
                // otherwise don't write anything out here, which will retain the latest byte size reported in
                // the most recent XHR.onprogress handler.
                Fetch.setu64(fetch + 32, len);
            }
            HEAPU16[fetch + 40 >> 1] = xhr.readyState;
            HEAPU16[fetch + 42 >> 1] = xhr.status;
            if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
            if (xhr.status >= 200 && xhr.status < 300) {
                if (onsuccess) onsuccess(fetch, xhr, e);
            } else {
                if (onerror) onerror(fetch, xhr, e);
            }
        };
        xhr.onerror = (e) => {
            saveResponse(fetchAttrLoadToMemory);
            var status = xhr.status; // XXX TODO: Overwriting xhr.status doesn't work here, so don't override anywhere else either.
            Fetch.setu64(fetch + 24, 0);
            Fetch.setu64(fetch + 32, xhr.response ? xhr.response.byteLength : 0);
            HEAPU16[fetch + 40 >> 1] = xhr.readyState;
            HEAPU16[fetch + 42 >> 1] = status;
            if (onerror) onerror(fetch, xhr, e);
        };
        xhr.ontimeout = (e) => {
            if (onerror) onerror(fetch, xhr, e);
        };
        xhr.onprogress = (e) => {
            var ptrLen = (fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response) ? xhr.response.byteLength : 0;
            var ptr = 0;
            if (fetchAttrLoadToMemory && fetchAttrStreamData) {
                assert(onprogress, 'When doing a streaming fetch, you should have an onprogress handler registered to receive the chunks!');
                // Allocate byte data in Emscripten heap for the streamed memory block (freed immediately after onprogress call)
                ptr = _malloc(ptrLen);
                HEAPU8.set(new Uint8Array(/** @type{Array<number>} */(xhr.response)), ptr);
            }
            HEAPU32[fetch + 12 >> 2] = ptr;
            Fetch.setu64(fetch + 16, ptrLen);
            Fetch.setu64(fetch + 24, e.loaded - ptrLen);
            Fetch.setu64(fetch + 32, e.total);
            HEAPU16[fetch + 40 >> 1] = xhr.readyState;
            // If loading files from a source that does not give HTTP status code, assume success if we get data bytes
            if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) xhr.status = 200;
            HEAPU16[fetch + 42 >> 1] = xhr.status;
            if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
            if (onprogress) onprogress(fetch, xhr, e);
            if (ptr) {
                _free(ptr);
            }
        };
        xhr.onreadystatechange = (e) => {
            HEAPU16[fetch + 40 >> 1] = xhr.readyState;
            if (xhr.readyState >= 2) {
                HEAPU16[fetch + 42 >> 1] = xhr.status;
            }
            if (onreadystatechange) onreadystatechange(fetch, xhr, e);
        };
        try {
            xhr.send(data);
        } catch (e) {
            if (onerror) onerror(fetch, xhr, e);
        }
    }

    function _emscripten_start_fetch(fetch, successcb, errorcb, progresscb, readystatechangecb) {
        // Avoid shutting down the runtime since we want to wait for the async
        // response.


        var fetch_attr = fetch + 112;
        var requestMethod = UTF8ToString(fetch_attr);
        var onsuccess = HEAPU32[fetch_attr + 36 >> 2];
        var onerror = HEAPU32[fetch_attr + 40 >> 2];
        var onprogress = HEAPU32[fetch_attr + 44 >> 2];
        var onreadystatechange = HEAPU32[fetch_attr + 48 >> 2];
        var fetchAttributes = HEAPU32[fetch_attr + 52 >> 2];
        var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
        var fetchAttrStreamData = !!(fetchAttributes & 2);
        var fetchAttrPersistFile = !!(fetchAttributes & 4);
        var fetchAttrNoDownload = !!(fetchAttributes & 32);
        var fetchAttrAppend = !!(fetchAttributes & 8);
        var fetchAttrReplace = !!(fetchAttributes & 16);
        var fetchAttrSynchronous = !!(fetchAttributes & 64);

        var reportSuccess = (fetch, xhr, e) => {

            callUserCallback(() => {
                if (onsuccess) getWasmTableEntry(onsuccess)(fetch);
                else if (successcb) successcb(fetch);
            }, fetchAttrSynchronous);
        };

        var reportProgress = (fetch, xhr, e) => {
            callUserCallback(() => {
                if (onprogress) getWasmTableEntry(onprogress)(fetch);
                else if (progresscb) progresscb(fetch);
            }, fetchAttrSynchronous);
        };

        var reportError = (fetch, xhr, e) => {

            callUserCallback(() => {
                if (onerror) getWasmTableEntry(onerror)(fetch);
                else if (errorcb) errorcb(fetch);
            }, fetchAttrSynchronous);
        };

        var reportReadyStateChange = (fetch, xhr, e) => {
            callUserCallback(() => {
                if (onreadystatechange) getWasmTableEntry(onreadystatechange)(fetch);
                else if (readystatechangecb) readystatechangecb(fetch);
            }, fetchAttrSynchronous);
        };

        var performUncachedXhr = (fetch, xhr, e) => {
            fetchXHR(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange);
        };

        var cacheResultAndReportSuccess = (fetch, xhr, e) => {
            var storeSuccess = (fetch, xhr, e) => {

                callUserCallback(() => {
                    if (onsuccess) getWasmTableEntry(onsuccess)(fetch);
                    else if (successcb) successcb(fetch);
                }, fetchAttrSynchronous);
            };
            var storeError = (fetch, xhr, e) => {

                callUserCallback(() => {
                    if (onsuccess) getWasmTableEntry(onsuccess)(fetch);
                    else if (successcb) successcb(fetch);
                }, fetchAttrSynchronous);
            };
            fetchCacheData(Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError);
        };

        var performCachedXhr = (fetch, xhr, e) => {
            fetchXHR(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange);
        };

        if (requestMethod === 'EM_IDB_STORE') {
            // TODO(?): Here we perform a clone of the data, because storing shared typed arrays to IndexedDB does not seem to be allowed.
            var ptr = HEAPU32[fetch_attr + 84 >> 2];
            fetchCacheData(Fetch.dbInstance, fetch, HEAPU8.slice(ptr, ptr + HEAPU32[fetch_attr + 88 >> 2]), reportSuccess, reportError);
        } else if (requestMethod === 'EM_IDB_DELETE') {
            fetchDeleteCachedData(Fetch.dbInstance, fetch, reportSuccess, reportError);
        } else if (!fetchAttrReplace) {
            fetchLoadCachedData(Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : (fetchAttrPersistFile ? performCachedXhr : performUncachedXhr));
        } else if (!fetchAttrNoDownload) {
            fetchXHR(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange);
        } else {
            return 0; // todo: free
        }
        return fetch;
    }

    function __emscripten_fetch_free(id) {
        //Note: should just be [id], but indexes off by 1 (see: #8803)
        delete Fetch.xhrs[id - 1];
    }

    var fetch_functions = {
        "emscripten_is_main_browser_thread": _emscripten_is_main_browser_thread,
        "emscripten_start_fetch": _emscripten_start_fetch,
        "_emscripten_fetch_free": __emscripten_fetch_free,
        "_emscripten_fetch_get_response_headers": __emscripten_fetch_get_response_headers,
        "_emscripten_fetch_get_response_headers_length": __emscripten_fetch_get_response_headers_length,
    }


    return fetch_functions;
}

export { FETCH_MODULE }