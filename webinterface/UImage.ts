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

            let blobs : [Promise<Blob>, Promise<WebAssembly.WebAssemblyInstantiatedSource>] = [img_response.blob(), WebAssembly.instantiateStreaming(using_response, info)];
            Promise.all(blobs).then((result) => {
                const img_blob = result[0];
                const using_wasm = result[1];
                const exports = using_wasm.instance.exports;

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