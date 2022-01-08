//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module, using_file } from "./simple-img.js"

//declare var Module: any;

class UniversalImage extends HTMLImageElement {
    using: string;
    common: Common;
    memory: Uint8Array;

    with: string;

    instance: any;
    entry: any;
    module: any;

    private _decodingPromise: Promise<String>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    static flush_image(entry: number): void {
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

        if (json_parsed.getImage == 0) return;

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
        const using_attribute = self.getAttribute("using");
        const with_attribute = self.getAttribute("with");
        let args: any = {};

        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            switch (nodeName) {
                case 'src':
                    downloads[nodeName] = fetch(atts[i].nodeValue);

                default:
                    args[nodeName] = atts[i].nodeValue;
            }
        }

        //var _scriptDir = typeof document !== 'undefined' && document.currentScript ? (document.currentScript as any).src : undefined;
        //if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
/*
        if (!_scriptDir) {
            if (document.currentScript) {
                _scriptDir = (document.currentScript as any).src;
            } else {
                _scriptDir = "/base/build/dist/"; //FIXME : for testing purpose
            }
        }

        const scriptDirectory = _scriptDir.substr(0, _scriptDir.lastIndexOf('/') + 1)
*/
        using_file.location = using_attribute;
        downloads["module"] = new (Module as any)({
            dynamicLibraries: [with_attribute]
        });

        this._decodingPromise = new Promise((main_resolve, main_reject) => {
            function decode(responses: Response[]): void {
                const img_response = responses[promises.indexOf(downloads["src"])];
                const module = responses[promises.indexOf(downloads["module"])];
                self.module = module;

                let blobs: [Promise<ArrayBuffer>] = [img_response.arrayBuffer()];

                Promise.all(blobs).then((result) => {
                    const img_array = result[0];
                    self.entry = self.module._constructor();

                    const ptr = self.module.stackAlloc(img_array.byteLength);
                    self.module.HEAPU8.set(new Uint8Array(img_array), ptr);
                    args["buffer"] = { pointer: ptr, size: img_array.byteLength };
                    const json_args = JSON.stringify(args);

                    const len_args = (json_args.length << 2) + 1;
                    const ptr_args = self.module.stackAlloc(len_args);
                    self.module.stringToUTF8(json_args, ptr_args, len_args);

                    self.module._set(self.entry, ptr_args);

                    const props = [
                        "getImage", "getSize", "getWidth", "getHeight"
                    ]
                    if (self.hasAttribute("connections")) {
                        props.push("connections");
                    }

                    const get_args = JSON.stringify(props);

                    if ("_nanojpeg_register" in self.module) {
                        const test_function = self.module["_nanojpeg_register"];
                        console.log(test_function);
                    }

                    const get_args_len = (get_args.length << 2) + 1;
                    const ptr_get_args = self.module.stackAlloc(get_args_len);

                    self.module.stringToUTF8(get_args, ptr_get_args, get_args_len);

                    const ptr_data = self.module._get(self.entry, ptr_get_args);
                    const json_res = self.module.UTF8ToString(ptr_data);
                    const json_res_parsed = JSON.parse(json_res);

                    const image = self.module.HEAPU8.slice(json_res_parsed.getImage, json_res_parsed.getImage + json_res_parsed.getSize);
                    const blob = new Blob([image]);
                    self.srcset = URL.createObjectURL(blob);
                    main_resolve(self.srcset);
                });
            }

            let promises: Promise<Response>[] = Object.values(downloads);

            Promise.all(promises).then(decode);
        });
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