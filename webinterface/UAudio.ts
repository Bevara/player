//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module, location } from "./core-coder.js"
import { fileio } from "./memio"

class UniversalAudio extends HTMLAudioElement {
    using: string;
    common: Common;
    memory: Uint8Array;

    with: string;

    instance: any;
    entry: any;
    module: any;
    io: fileio;

    private _decodingPromise: Promise<String>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    connectedCallback() {
        const self = this;
        const using_attribute = self.getAttribute("using");
        const with_attribute = self.getAttribute("with").split(';');
        let args: any = {};

        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            args[nodeName] = atts[i].nodeValue;
        }

        location.using = using_attribute;
        location.with = with_attribute;
        this.io = new fileio();

        this._decodingPromise = new Promise((main_resolve, _main_reject) => {
            with_attribute.push("writegen.wasm");
            with_attribute.push("fileout.wasm");
            with_attribute.push("filein.wasm");
            new (Module as any)({
                dynamicLibraries: with_attribute
            }).then(module => {
                self.module = module;
                self.io.module = module;
                self.entry = self.module._constructor();
                let buffer_in = self.io.make_fileio(self.src, true);
                let buffer_out = self.io.make_fileio("out.wav", false);
                args["io_in"] = buffer_in.file_io;
                args["io_out"] = buffer_out.file_io;

                // Set input filters
                args["filters"] = self.module.filter_entries.map(entry => self.module["_" + entry](0));

                Promise.all(self.io.fetch_promises).then(res_fetch => {
                    Promise.all(self.io.buffer_promises).then(res_buffer => {

                        // Convert json to string buffer
                        const json_args = JSON.stringify(args);
                        const len_args = (json_args.length << 2) + 1;
                        const ptr_args = self.module.stackAlloc(len_args);
                        self.module.stringToUTF8(json_args, ptr_args, len_args);

                        // Call set function and decode
                        self.module._set(self.entry, ptr_args);

                        // Retrieve result
                        const props = [];
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

                        const blob = new Blob([buffer_out.buffer_u8], {type : "audio/wave"});
                        self.src = URL.createObjectURL(blob);
                          self.load();
                        main_resolve(self.src);
                    });
                });
            });
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