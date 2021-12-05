//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"


declare var Module: any;

class UniversalImage extends HTMLImageElement {
    using: string;
    common: Common;
    memory :Uint8Array;

    with:string;

    instance:any;
    entry:any;
    module:any;

    static flush_image(entry: number) {
        let self = this as any;

        const get_args = JSON.stringify([
            "getImage", "getSize", "getWidth", "getHeight"
        ]);
        const get_args_len = (get_args.length << 2) + 1;
        const ptr_get_args = self.instance.stackAlloc(get_args_len);

        self.instance.stringToUTF8(get_args, ptr_get_args, get_args_len);
        
        const ptr_data = self.instance._get(self.entry, ptr_get_args);

        const json = self.instance.UTF8ToString(ptr_data);
        const json_parsed = JSON.parse(json);

        if (json_parsed.getImage == 0 ) return;
        
        const image = self.instance.HEAPU8.slice(json_parsed.getImage, json_parsed.getImage + json_parsed.getSize);

        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        var imageData = ctx.createImageData(json_parsed.getWidth, json_parsed.getHeight);
        canvas.setAttribute('width', json_parsed.getWidth);
        canvas.setAttribute('height', json_parsed.getHeight);
        const data = imageData.data;
        const len = data.length;
        var i = 0;
        var t = 0;

        for (; i < len; i += 4) {
            data[i] = image[t];
            data[i + 1] = image[t + 1];
            data[i + 2] = image[t + 2];
            data[i + 3] = 255;

            t += 3;
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(function (blob) {
            self.srcset = URL.createObjectURL(blob);
        })
    }
    

    connectedCallback() {
        const self = this;
        const downloads: { [key: string]: Promise<Response> } = {};
        const with_attribute = self.getAttribute("with");
        let args : any = {};

        function decode(responses: Response[]): void{
            const img_response = responses[promises.indexOf(downloads["src"])];
            const module = responses[promises.indexOf(downloads["module"])];
            
            let blobs: [Promise<ArrayBuffer>] = [img_response.arrayBuffer()];

            Promise.all(blobs).then( (result) => {
                const img_array = result[0];
                self.entry = self.module._constructor();

                const ptr = self.module.stackAlloc(img_array.byteLength);
                self.module.HEAPU8.set(new Uint8Array(img_array), ptr);
                args["buffer"] = {pointer : ptr, size : img_array.byteLength};
                const json_args = JSON.stringify(args);

                const len_args = (json_args.length << 2) + 1;
                const ptr_args = self.module.stackAlloc(len_args);
                self.module.stringToUTF8(json_args, ptr_args, len_args);

                self.module._set(self.entry, ptr_args);

                const get_args = JSON.stringify([
                    "getImage", "getSize", "getWidth", "getHeight"
                ]);

                const get_args_len = (get_args.length << 2) + 1;
                const ptr_get_args = self.module.stackAlloc(get_args_len);

                self.module.stringToUTF8(get_args, ptr_get_args, get_args_len);

                const ptr_data = self.module._get(self.entry, ptr_get_args);
                const json_res = self.module.UTF8ToString(ptr_data);
                const json_res_parsed = JSON.parse(json_res);

                const image = self.module.HEAPU8.slice(json_res_parsed.getImage, json_res_parsed.getImage + json_res_parsed.getSize);
                const blob = new Blob([image]);
                self.srcset = URL.createObjectURL(blob);

            });

            self.module = module;


        }


        

        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            switch (nodeName) {
                case 'src':
                    downloads[nodeName] = fetch(atts[i].nodeValue);

                default:
                args[nodeName] = atts[i].nodeValue;
            }
        }

        downloads["module"] = new Module({
            dynamicLibraries: [with_attribute]
            });

        let promises: Promise<Response>[] = Object.values(downloads);

        Promise.all(promises).then(decode);
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

export { UniversalImage }