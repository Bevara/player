import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { GOTHandler } from "./imports";

const info: WebAssembly.Imports = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
    'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
    'GOT.func': new Proxy(asmLibraryArg, GOTHandler)
};
//info.env["__indirect_function_table"] = self.wasmTable;
//info.env["memory"] = self.wasmMemory;

info.env["__indirect_function_table"] = wasmTable;
info.env["memory"] = wasmMemory;

class UniversalImage extends HTMLImageElement {
    using : string;

    connectedCallback() {
        let self = this;
        
        let downloads : {[key: string]: Promise<Response>} = {};

        function flushImage(responses : Response[]) : void {
            const img_response = responses[promises.indexOf(downloads["src"])];
            const using_response = responses[promises.indexOf(downloads["using"])];

            let blobs : [Promise<WebAssembly.WebAssemblyInstantiatedSource>, Promise<ArrayBuffer>] = [WebAssembly.instantiateStreaming(using_response, info), img_response.arrayBuffer()];
            Promise.all(blobs).then((result) => {
                const img_array = result[1];
                const using_wasm = result[0];
                const exports : any = using_wasm.instance.exports;
                
                const ret = exports.stackAlloc(img_array.byteLength);
                const memory = new Uint8Array(exports.memory.buffer)
                
                memory.set(new Uint8Array(img_array), ret);
                
                exports.njInit();
                const test = exports.njDecode(ret, img_array.byteLength);
                if(test != 0){
                    //exports._free(ret);
                    console.log("Error decoding the input file.\n")
                    return;
                }
                //exports._free(ret);

                const width = exports.njGetWidth();
                const height = exports.njGetHeight();
                const njIsColor = exports.njIsColor();
                const njGetImage = exports.njGetImage();
                const njGetImageSize = exports.njGetImageSize();
                const image = memory.slice(njGetImage, njGetImage+ njGetImageSize);

                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                var imageData = ctx.createImageData(width, height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                const data = imageData.data;
                const len = data.length; 
                var i = 0;
                var t = 0;

                for(; i < len; i += 4) {
                    data[i]     = image[t];    
                    data[i + 1] = image[t + 1];
                    data[i + 2] = image[t + 2];
                    data[i + 3] = 255;         
                
                    t += 3;
                }
                
                ctx.putImageData(imageData, 0, 0);

                canvas.toBlob(function (blob){
                    self.srcset = URL.createObjectURL(blob);
                })                

                exports.njDone();
            });
        }

        for (var i = 0, atts = self.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            switch(nodeName){
                case 'using':
                case 'src':
                    downloads[nodeName] = fetch(atts[i].nodeValue);
                    break;
            }
        }

        let promises : Promise<Response>[] = Object.values(downloads);

        Promise.all(promises).then(flushImage);
    }

    disconnectedCallback() {
        
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                break;
            case 'with':
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

export {UniversalImage}