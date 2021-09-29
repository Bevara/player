

import { info } from "./imports";
//import { err } from "./imports/err";
//import { receiveInstantiationResult } from "./imports/receiveInstantiationResult";
//import { instantiateArrayBuffer } from "./imports/instantiateArrayBuffer";

class UniversalImage extends HTMLImageElement {
    constructor() {
        super();
        console.log("test4");
        fetch("player.wasm").then(function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            /*return result.then(
                receiveInstantiationResult,
                function (reason) {
                    // We expect the most common failure cause to be a bad MIME type for the binary,
                    // in which case falling back to ArrayBuffer instantiation should work.
                    err('wasm streaming compile failed: ' + reason);
                    err('falling back to ArrayBuffer instantiation');
                    return instantiateArrayBuffer(receiveInstantiationResult);
                });*/
        })
    }
}

customElements.define('universal-img', UniversalImage, {extends: 'img' });