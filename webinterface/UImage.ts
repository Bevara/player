import {asmLibraryArg, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
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

                
                exports.njInit();


                const img_blob = new Blob([new Uint8Array(img_array, 0, img_array.byteLength)]);
                self.srcset = URL.createObjectURL(img_blob); 
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