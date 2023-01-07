//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module } from "./core-coder.js"
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
    using_attribute: string;
    with_attribute: string[];
    print_attribute: Element | null;
    error_attribute: Element | null;

    private _decodingPromise: Promise<string>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    connectedCallback() {
        const self = this;
        let args: any = {};

        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            args[nodeName] = atts[i].nodeValue;
        }

        this.io = new fileio(self.src, "out.wav", this.using_attribute, this.with_attribute);

        this._decodingPromise = new Promise(async (main_resolve, _main_reject) => {
            await this.io.startDownload();
            new (Module as any)({
                dynamicLibraries: this.io.with_attribute,
            }).then(module => {
                self.module = module;
                self.io.module = module;
                self.entry = self.module._constructor();
                let buffer_in = self.io.fileio_in;
                let buffer_out = self.io.fileio_out;
                args["io_in"] = buffer_in.file_io;
                args["io_out"] = buffer_out.file_io;

                // Set input filters
                args["filters"] = self.module.filter_entries.map(entry => self.module["_" + entry](0));



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

                const blob = new Blob([buffer_out.buffer_u8], { type: "audio/wave" });
                self.src = URL.createObjectURL(blob);
                self.load();
                main_resolve(self.src);
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
                this.using_attribute = this.getAttribute("using");
                break;
            case 'with':
                this.with_attribute = this.getAttribute("with").split(';');
                break;
            case 'print':
                this.print_attribute = document.querySelector(this.getAttribute("print"));
                break;
            case 'printerr':
                this.error_attribute = document.querySelector(this.getAttribute("printerr"));
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

export { UniversalAudio };