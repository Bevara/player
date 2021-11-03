//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { asmLibraryArg, GOTHandler } from "./imports";

class UniversalImage extends HTMLImageElement {
    using : string;

    connectedCallback() {
        let self = this;
        
        let downloads : {[key: string]: Promise<Response>} = {};

        function flushImage(responses : Response[]) : void {
            const img_response = responses[promises.indexOf(downloads["src"])];
            const using_response = responses[promises.indexOf(downloads["using"])];
            const with_response = responses[promises.indexOf(downloads["with"])];

            let blobs : [Promise<ArrayBuffer>, 
                Promise<WebAssembly.Module>,
                Promise<WebAssembly.WebAssemblyInstantiatedSource>] = [img_response.arrayBuffer(), 
                                                                        WebAssembly.compileStreaming(using_response),
                                                                        WebAssembly.instantiateStreaming(with_response)];
            Promise.all(blobs).then(async (result) => {
                const img_array = result[0];
                const using_wasm_module = result[1];
                const with_wasm = result[2];

                const exports_with : any = with_wasm.instance.exports;

                var wasmTable = new WebAssembly.Table({
                    'initial': 5442,
                    'element': 'anyfunc'
                  });
                 
                var INITIAL_MEMORY = 16777216;
                var wasmMemory = new WebAssembly.Memory({
                  'initial': INITIAL_MEMORY / 65536,
                  'maximum': INITIAL_MEMORY / 65536,
                  'shared': false
                });
                
                const info: WebAssembly.Imports = {
                    'env': asmLibraryArg,
                    'wasi_snapshot_preview1': asmLibraryArg,
                    'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
                    'GOT.func': new Proxy(asmLibraryArg, GOTHandler)
                };
                
                info.env["njInit"] = exports_with.njInit;
                info.env["njDecode"] = exports_with.njDecode;
                info.env["njGetImage"] = exports_with.njGetImage;
                info.env["njGetImageSize"] = exports_with.njGetImageSize;
                info.env["njGetWidth"] = exports_with.njGetWidth;
                info.env["njGetHeight"] = exports_with.njGetHeight;
               
                info.env["__indirect_function_table"] = wasmTable;
                info.env["memory"] = wasmMemory;


               const using_wasm = await WebAssembly.instantiate(using_wasm_module, info);
               const exports_using : any = using_wasm.exports;
                
                const ret = exports_using.stackAlloc(img_array.byteLength);
                const memory = new Uint8Array(exports_with.memory.buffer);
                memory.set(new Uint8Array(img_array), ret);

                const test = exports_using.constructor(ret, img_array.byteLength);
                if(test != 0){
                    //exports._free(ret);
                    console.log("Error decoding the input file.\n")
                    return;
                }
                
                const njGetImage = exports_using.getImage();
                const njGetImageSize = exports_using.getSize();
                const width = exports_using.getWidth();
                const height = exports_using.getHeight();

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
            });
        }

        for (var i = 0, atts = self.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            switch(nodeName){
                case 'using':
                case 'src':
                case 'with':
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