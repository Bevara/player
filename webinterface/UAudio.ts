//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module, location } from "./simple-img.js"

//declare var Module: any;

class UniversalAudio extends HTMLAudioElement {
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

        location.using = using_attribute;
        location.with = with_attribute;
        downloads["module"] = new (Module as any)({
            dynamicLibraries: [with_attribute]
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

                    // Set input buffer
                    const ptr = self.module.stackAlloc(img_array.byteLength);
                    self.module.HEAPU8.set(new Uint8Array(img_array), ptr);
                    args["buffer"] = { pointer: ptr, size: img_array.byteLength };

                    // Set input filters
                    args["filters"] = self.module.filter_entries.map(entry => self.module["_" + entry]());

                    // Set output format
                    args["dst"] = "out.wav";

                    // Convert json to string buffer
                    const json_args = JSON.stringify(args);
                    const len_args = (json_args.length << 2) + 1;
                    const ptr_args = self.module.stackAlloc(len_args);
                    self.module.stringToUTF8(json_args, ptr_args, len_args);

                    // Call set function and decode
                    self.module._set(self.entry, ptr_args);

                    // Retrieve result
                    const props = [
                        "output", "size"
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

                    const image = self.module.HEAPU8.slice(json_res_parsed.output, json_res_parsed.output + json_res_parsed.size);
                    const blob = new Blob([image]);
                    var source = document.createElement('source');
                    source.src = URL.createObjectURL(blob);
                    source.type = "audio/wave";
                    self.appendChild(source);
                    main_resolve(source.src);
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

export { UniversalAudio }