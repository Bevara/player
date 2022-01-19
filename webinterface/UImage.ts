//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module, location, memio } from "./simple-img.js"
import {fileio} from "./memio"

//declare var Module: any;

class UniversalImage extends HTMLImageElement {
    using: string;
    common: Common;
    memory: Uint8Array;

    with: string;

    instance: any;
    entry: any;
    module: any;
    input : fileio;
    output : fileio;

    private _decodingPromise: Promise<String>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    static flush_image(_entry: number): void {
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
                    this.input = new fileio(atts[i].nodeValue);
                default:
                    args[nodeName] = atts[i].nodeValue;
            }
        }

        this.output = new fileio("out.png");
        location.using = using_attribute;
        location.with = with_attribute;
        downloads["module"] = new (Module as any)({
            dynamicLibraries: [with_attribute,
                "rfimg.wasm",
                "writegen.wasm",
                "pngenc.wasm"
            ]
        });

        this._decodingPromise = new Promise((main_resolve, _main_reject) => {
            function decode(responses: Response[]): void {
                const img_response = responses[promises.indexOf(downloads["src"])];
                const module = responses[promises.indexOf(downloads["module"])];
                self.module = module;

                let blobs: [Promise<ArrayBuffer>] = [img_response.arrayBuffer()];

                Promise.all(blobs).then((result) => {
                    const img_array = result[0];
                   
                    self.entry = self.module._constructor();
                    self.input.buffer = new Uint8Array(img_array);
                    self.input.module = self.module;
                    self.output.buffer = new Uint8Array(0);
                    self.output.module = self.module;

                    args["io_in"] = self.input.make_fileio();
                    args["io_out"] = self.output.make_fileio();

                    // Set input filters
                    args["filters"] = self.module.filter_entries.map(entry => self.module["_" + entry]());

                    // Convert json to string buffer
                    const json_args = JSON.stringify(args);
                    const len_args = (json_args.length << 2) + 1;
                    const ptr_args = self.module.stackAlloc(len_args);
                    self.module.stringToUTF8(json_args, ptr_args, len_args);

                    // Call set function and decode
                    self.module._set(self.entry, ptr_args);

                    // Retrieve result
                    const props = [
                    ]
                    if (self.hasAttribute("connections")) {
                        props.push("connections");
                    }

                    const get_args = JSON.stringify(props);

                    const get_args_len = (get_args.length << 2) + 1;
                    const ptr_get_args = self.module.stackAlloc(get_args_len);

                    self.module.stringToUTF8(get_args, ptr_get_args, get_args_len);

                    const ptr_data = self.module._get(self.entry, ptr_get_args);
                    const json_res = self.module.UTF8ToString(ptr_data);
                    const json_res_parsed = JSON.parse(json_res);

                    const blob = new Blob([self.output.buffer]);
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