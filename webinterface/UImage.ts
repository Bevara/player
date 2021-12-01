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
        this.module = new Module({dynamicLibraries: [this.with]}).then((instance:any) => {
            this.instance = instance;
            this.entry = instance.constructor();

            const args: Record<string, string | number> = {};
            for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
                args[atts[i].nodeName] = atts[i].nodeValue;
            }

            const C_pointer = instance.addFunction(UniversalImage.flush_image.bind(this), 'vi');

            args["downloadCallback"] = C_pointer;           

            const string_args = JSON.stringify(args)
            var len = (string_args.length << 2) + 1;
            const ptr_args = instance.stackAlloc(len);
            instance.stringToUTF8(string_args, ptr_args, len);

            instance._set(this.entry, ptr_args);            
        })


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
                this.with = newValue;
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

export { UniversalImage }