import {assert} from "../utils/errors"

function fetchDeleteCachedData(db:any, fetch:any, onsuccess:any, onerror:any) {
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
      var transaction = db.transaction(['FILES'], 'readwrite');
      var packages = transaction.objectStore('FILES');
      var request = packages.delete(pathStr);
      request.onsuccess = function(event:any) {
        var value = event.target.result;
        that.HEAPU32[fetch + 12 >> 2] = 0;
        that.Fetch.setu64(fetch + 16, 0);
        that.Fetch.setu64(fetch + 24, 0);
        that.Fetch.setu64(fetch + 32, 0);
        that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        that.HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
        that.stringToUTF8("OK", fetch + 44, 64);
        onsuccess(fetch, 0, value);
      };
      request.onerror = function(error:any) {
        that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        that.HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
        that.stringToUTF8("Not Found", fetch + 44, 64);
        onerror(fetch, 0, error);
      };
    } catch(e) {
      onerror(fetch, 0, e);
    }
  }

function fetchCacheData(db:any, fetch:any, data:any, onsuccess:any, onerror:any) {
    let that = this;

    if (!db) {
      onerror(fetch, 0, 'IndexedDB not available!');
      return;
    }
  
    var fetch_attr = fetch + 112;
    var destinationPath = this.HEAPU32[fetch_attr + 64 >> 2];
    if (!destinationPath) destinationPath = this.HEAPU32[fetch + 8 >> 2];
    var destinationPathStr = this.UTF8ToString(destinationPath);
  
    try {
      var transaction = db.transaction(['FILES'], 'readwrite');
      var packages = transaction.objectStore('FILES');
      var putRequest = packages.put(data, destinationPathStr);
      putRequest.onsuccess = function(event:any) {
        that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        that.HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
        that.stringToUTF8("OK", fetch + 44, 64);
        onsuccess(fetch, 0, destinationPathStr);
      };
      putRequest.onerror = function(error:any) {
        // Most likely we got an error if IndexedDB is unwilling to store any more data for this page.
        // TODO: Can we identify and break down different IndexedDB-provided errors and convert those
        // to more HTTP status codes for more information?
        that.HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        that.HEAPU16[fetch + 42 >> 1] = 413; // Mimic XHR HTTP status code 413 "Payload Too Large"
        that.stringToUTF8("Payload Too Large", fetch + 44, 64);
        onerror(fetch, 0, error);
      };
    } catch(e) {
      onerror(fetch, 0, e);
    }
  }


function _emscripten_start_fetch(fetch: number,
    successcb: any,
    errorcb: any,
    progresscb: any,
    readystatechangecb: any) {

      let that = this;

    var fetch_attr = fetch + 112;

    var requestMethod = this.UTF8ToString(fetch_attr);
    var onsuccess = this.HEAPU32[fetch_attr + 36 >> 2];
    var onerror = this.HEAPU32[fetch_attr + 40 >> 2];
    var onprogress = this.HEAPU32[fetch_attr + 44 >> 2];
    var onreadystatechange = this.HEAPU32[fetch_attr + 48 >> 2];
    var fetchAttributes = this.HEAPU32[fetch_attr + 52 >> 2];
    var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
    var fetchAttrStreamData = !!(fetchAttributes & 2);
    var fetchAttrPersistFile = !!(fetchAttributes & 4);
    var fetchAttrNoDownload = !!(fetchAttributes & 32);
    var fetchAttrAppend = !!(fetchAttributes & 8);
    var fetchAttrReplace = !!(fetchAttributes & 16);
    var fetchAttrSynchronous = !!(fetchAttributes & 64);

    var reportSuccess = function (fetch:any, xhr:any, e:any) {

      that.callUserCallback(function () {
            if (onsuccess) that.wasmTable.get(onsuccess)(fetch);
            else if (successcb) successcb(fetch);
        }, fetchAttrSynchronous);
    };

    var reportProgress = function (fetch:any, xhr:any, e:any) {
      that.callUserCallback(function () {
            if (onprogress) that.wasmTable.get(onprogress)(fetch);
            else if (progresscb) progresscb(fetch);
        }, fetchAttrSynchronous);
    };

    var reportError = function (fetch:any, xhr:any, e:any) {

      that.callUserCallback(function () {
            if (onerror) that.wasmTable.get(onerror)(fetch);
            else if (errorcb) errorcb(fetch);
        }, fetchAttrSynchronous);
    };

    var reportReadyStateChange = function (fetch:any, xhr:any, e:any) {
      that.callUserCallback(function () {
            if (onreadystatechange) that.wasmTable.get(onreadystatechange)(fetch);
            else if (readystatechangecb) readystatechangecb(fetch);
        }, fetchAttrSynchronous);
    };

    var performUncachedXhr = function (fetch:any, xhr:any, e:any) {
        that.fetchXHR(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange);
    };

    var cacheResultAndReportSuccess = function (fetch:any, xhr:any, e:any) {
        var storeSuccess = function (fetch:any, xhr:any, e:any) {

          that.callUserCallback(function () {
                if (onsuccess) that.wasmTable.get(onsuccess)(fetch);
                else if (successcb) successcb(fetch);
            }, fetchAttrSynchronous);
        };
        var storeError = function (fetch:any, xhr:any, e:any) {

          that.callUserCallback(function () {
                if (onsuccess) that.wasmTable.get(onsuccess)(fetch);
                else if (successcb) successcb(fetch);
            }, fetchAttrSynchronous);
        };
        fetchCacheData(that.Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError);
    };

    var performCachedXhr = function (fetch:any, xhr:any, e:any) {
      that.fetchXHR(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange);
    };

    if (requestMethod === 'EM_IDB_STORE') {
        // TODO(?): Here we perform a clone of the data, because storing shared typed arrays to IndexedDB does not seem to be allowed.
        var ptr = this.HEAPU32[fetch_attr + 84 >> 2];
        that.fetchCacheData(this.Fetch.dbInstance, fetch, this.HEAPU8.slice(ptr, ptr + this.HEAPU32[fetch_attr + 88 >> 2]), reportSuccess, reportError);
    } else if (requestMethod === 'EM_IDB_DELETE') {
      that.fetchDeleteCachedData(this.Fetch.dbInstance, fetch, reportSuccess, reportError);
    } else if (!fetchAttrReplace) {
      that.fetchLoadCachedData(this.Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : (fetchAttrPersistFile ? performCachedXhr : performUncachedXhr));
    } else if (!fetchAttrNoDownload) {
      that.fetchXHR(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange);
    } else {
        return 0; // todo: free
    }
    return fetch;
}
export { _emscripten_start_fetch }
