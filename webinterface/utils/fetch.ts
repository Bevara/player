import { removeRunDependency } from "./dependencies"
import {assert} from "../utils/errors"

function fetchLoadCachedData(db: any, fetch: any, onsuccess: any, onerror: any) {
    let that = this;
    if (!db) {
        onerror(fetch, 0, 'IndexedDB not available!');
        return;
    }

    var fetch_attr = fetch + 112;
    var path = this.HEAPU32[fetch_attr + 64 >> 2];
    if (!path) path = this.HEAPU32[fetch + 8 >> 2];
    var pathStr = this.UTF8ToString(path);

    try {
        var transaction = db.transaction(['FILES'], 'readonly');
        var packages = transaction.objectStore('FILES');
        var getRequest = packages.get(pathStr);
        getRequest.onsuccess = function (event: any) {
            if (event.target.result) {
                var value = event.target.result;
                var len = value.byteLength || value.length;
                // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
                // freed when emscripten_fetch_close() is called.
                var ptr = that._malloc(len);
                that.HEAPU8.set(new Uint8Array(value), ptr);
                that.HEAPU32[fetch + 12 >> 2] = ptr;
                that.Fetch.setu64(fetch + 16, len);
                that.Fetch.setu64(fetch + 24, 0);
                that.Fetch.setu64(fetch + 32, len);
                that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
                that.HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
                that.stringToUTF8("OK", fetch + 44, 64);
                onsuccess(fetch, 0, value);
            } else {
                // Succeeded to load, but the load came back with the value of undefined, treat that as an error since we never store undefined in db.
                that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
                that.HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
                that.stringToUTF8("Not Found", fetch + 44, 64);
                onerror(fetch, 0, 'no data');
            }
        };
        getRequest.onerror = function (error: any) {
            that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
            that.HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
            that.stringToUTF8("Not Found", fetch + 44, 64);
            onerror(fetch, 0, error);
        };
    } catch (e) {
        onerror(fetch, 0, e);
    }
}

class Fetch {
    that:any;
    xhrs : Array<XMLHttpRequest>= [];
    
    constructor(mem:any) {
        this.that = mem;
    }

    setu64(addr:number, val:number) {
        this.that.HEAPU32[addr >> 2] = val;
        this.that.HEAPU32[addr + 4 >> 2] = (val / 4294967296)|0;
    }
};



function fetchXHR(fetch: any, onsuccess: any, onerror: any, onprogress: any, onreadystatechange: any) {
    let that = this;
    var url = this.HEAPU32[fetch + 8 >> 2];
    if (!url) {
        onerror(fetch, 0, 'no url specified!');
        return;
    }
    var url_ = this.UTF8ToString(url);

    var fetch_attr = fetch + 112;
    var requestMethod = this.UTF8ToString(fetch_attr);
    if (!requestMethod) requestMethod = 'GET';
    var userData = this.HEAPU32[fetch + 4 >> 2];
    var fetchAttributes = this.HEAPU32[fetch_attr + 52 >> 2];
    var timeoutMsecs = this.HEAPU32[fetch_attr + 56 >> 2];
    var withCredentials = !!this.HEAPU32[fetch_attr + 60 >> 2];
    var destinationPath = this.HEAPU32[fetch_attr + 64 >> 2];
    var userName = this.HEAPU32[fetch_attr + 68 >> 2];
    var password = this.HEAPU32[fetch_attr + 72 >> 2];
    var requestHeaders = this.HEAPU32[fetch_attr + 76 >> 2];
    var overriddenMimeType = this.HEAPU32[fetch_attr + 80 >> 2];
    var dataPtr = this.HEAPU32[fetch_attr + 84 >> 2];
    var dataLength = this.HEAPU32[fetch_attr + 88 >> 2];

    var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
    var fetchAttrStreamData = !!(fetchAttributes & 2);
    var fetchAttrPersistFile = !!(fetchAttributes & 4);
    var fetchAttrAppend = !!(fetchAttributes & 8);
    var fetchAttrReplace = !!(fetchAttributes & 16);
    var fetchAttrSynchronous = !!(fetchAttributes & 64);
    var fetchAttrWaitable = !!(fetchAttributes & 128);

    var userNameStr = userName ? this.UTF8ToString(userName) : undefined;
    var passwordStr = password ? this.UTF8ToString(password) : undefined;
    var overriddenMimeTypeStr = overriddenMimeType ? this.UTF8ToString(overriddenMimeType) : undefined;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = withCredentials;
    xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
    if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs; // XHR timeout field is only accessible in async XHRs, and must be set after .open() but before .send().
    //xhr.url_ = url_; // Save the url for debugging purposes (and for comparing to the responseURL that server side advertised)
    assert(!fetchAttrStreamData, 'streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()');
    xhr.responseType = 'arraybuffer';

    if (overriddenMimeType) {
        xhr.overrideMimeType(overriddenMimeTypeStr);
    }
    if (requestHeaders) {
        for (; ;) {
            var key = this.HEAPU32[requestHeaders >> 2];
            if (!key) break;
            var value = this.HEAPU32[requestHeaders + 4 >> 2];
            if (!value) break;
            requestHeaders += 8;
            var keyStr = this.UTF8ToString(key);
            var valueStr = this.UTF8ToString(value);
            xhr.setRequestHeader(keyStr, valueStr);
        }
    }
    this.Fetch.xhrs.push(xhr);
    var id = this.Fetch.xhrs.length;
    this.HEAPU32[fetch + 0 >> 2] = id;
    var data = (dataPtr && dataLength) ? this.HEAPU8.slice(dataPtr, dataPtr + dataLength) : null;
    // TODO: Support specifying custom headers to the request.

    // Share the code to save the response, as we need to do so both on success
    // and on error (despite an error, there may be a response, like a 404 page).
    // This receives a condition, which determines whether to save the xhr's
    // response, or just 0.
    function saveResponse(condition: any) {
        var ptr = 0;
        var ptrLen = 0;
        if (condition) {
            ptrLen = xhr.response ? xhr.response.byteLength : 0;
            // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
            // freed when emscripten_fetch_close() is called.
            ptr = that._malloc(ptrLen);
            that.HEAPU8.set(new Uint8Array(xhr.response), ptr);
        }
        that.HEAPU32[fetch + 12 >> 2] = ptr;
        that.Fetch.setu64(fetch + 16, ptrLen);
    }

    xhr.onload = function (e) {
       saveResponse(fetchAttrLoadToMemory && !fetchAttrStreamData);
        var len = xhr.response ? xhr.response.byteLength : 0;
        that.Fetch.setu64(fetch + 24, 0);
        if (len) {
            // If the final XHR.onload handler receives the bytedata to compute total length, report that,
            // otherwise don't write anything out here, which will retain the latest byte size reported in
            // the most recent XHR.onprogress handler.
            that.Fetch.setu64(fetch + 32, len);
        }
        that.HEAPU16[fetch + 40 >> 1] = xhr.readyState;
        that.HEAPU16[fetch + 42 >> 1] = xhr.status;
        if (xhr.statusText) that.stringToUTF8(xhr.statusText, fetch + 44, 64);
        if (xhr.status >= 200 && xhr.status < 300) {
            if (onsuccess) onsuccess(fetch, xhr, e);
        } else {
            if (onerror) onerror(fetch, xhr, e);
        }
    };
    xhr.onerror = function (e) {
        saveResponse(fetchAttrLoadToMemory);
        var status = xhr.status; // XXX TODO: Overwriting xhr.status doesn't work here, so don't override anywhere else either.
        that.Fetch.setu64(fetch + 24, 0);
        that.Fetch.setu64(fetch + 32, xhr.response ? xhr.response.byteLength : 0);
        that.HEAPU16[fetch + 40 >> 1] = xhr.readyState;
        that.HEAPU16[fetch + 42 >> 1] = status;
        if (onerror) onerror(fetch, xhr, e);
    };
    xhr.ontimeout = function (e) {
        if (onerror) onerror(fetch, xhr, e);
    };
    xhr.onprogress = function (e) {
        var ptrLen = (fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response) ? xhr.response.byteLength : 0;
        var ptr = 0;
        if (fetchAttrLoadToMemory && fetchAttrStreamData) {
            assert(onprogress, 'When doing a streaming fetch, you should have an onprogress handler registered to receive the chunks!');
            // Allocate byte data in Emscripten heap for the streamed memory block (freed immediately after onprogress call)
            ptr = that._malloc(ptrLen);
            that.HEAPU8.set(new Uint8Array(xhr.response), ptr);
        }
        that.HEAPU32[fetch + 12 >> 2] = ptr;
        that.Fetch.setu64(fetch + 16, ptrLen);
        that.Fetch.setu64(fetch + 24, e.loaded - ptrLen);
        that.Fetch.setu64(fetch + 32, e.total);
        that.HEAPU16[fetch + 40 >> 1] = xhr.readyState;
        //if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) xhr.status = 200; // If loading files from a source that does not give HTTP status code, assume success if we get data bytes
        that.HEAPU16[fetch + 42 >> 1] = xhr.status;
        if (xhr.statusText) that.stringToUTF8(xhr.statusText, fetch + 44, 64);
        if (onprogress) onprogress(fetch, xhr, e);
        if (ptr) {
            that._free(ptr);
        }
    };
    xhr.onreadystatechange = function (e) {
        that.HEAPU16[fetch + 40 >> 1] = xhr.readyState;
        if (xhr.readyState >= 2) {
            that.HEAPU16[fetch + 42 >> 1] = xhr.status;
        }
        if (onreadystatechange) onreadystatechange(fetch, xhr, e);
    };
    try {
        xhr.send(data);
    } catch (e) {
        if (onerror) onerror(fetch, xhr, e);
    }
}

export { Fetch, fetchLoadCachedData, fetchXHR };