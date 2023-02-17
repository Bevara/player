import { Module } from "./core-coder.js";
import { fileio } from "./memio";

//declare var Module: any;

class UniversalImage extends HTMLImageElement {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;
    io: fileio;
    using_attribute: string;
    with_attribute: string[];
    print_attribute: Element | null;
    error_attribute: Element | null;
    out = "png";
    useCache = false;
    cache = null;

    private _decodingPromise: Promise<string>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    private print(){
        const self = this;
        if (self.print_attribute) {
            return function (t) {
                function clear_text(text) {
                    return text
                        .replaceAll("[37m", '')
                        .replaceAll("[0m", '');
                }
                (self.print_attribute as any).value += clear_text(t) + "\n";
            };
        } else {
            return console.log.bind(console);
        }
    }

    private printErr(){
        const self = this;
        if (self.error_attribute) {
            return function (t) {
                function clear_text(text) {
                    return text
                        .replaceAll("[37m", '')
                        .replaceAll("[0m", '');
                }

                (self.error_attribute as any).value += clear_text(t) + "\n";
            };
        } else {
            return console.warn.bind(console);
        }
    }

    dataURLToSrc(self, blob, cached) {
        if (self.useCache && self.cache && !cached){
            self.cache.put(self.src, new Response(blob));
        }

        self.srcset = URL.createObjectURL(blob);
    }


    async universal_decode(self, args): Promise<string>{
        return new Promise(async (main_resolve, _main_reject) => {
            if (self.useCache) {
                try {
                  self.cache = self.cache || await caches.open('universal-img');
                } catch (e) {}
                const cachedImg = self.cache && await self.cache.match(self.src);
                if (cachedImg) {
                  const cachedImgData = await cachedImg.blob();
                  this.dataURLToSrc(self, cachedImgData, true);
                  main_resolve(self.srcset);
                  return;
                }
            }

            const print = this.print();
            const printErr = this.printErr();

            this.io = new fileio(self.src, "out."+this.out, this.using_attribute, this.with_attribute, this.print());
            print("Downloading...");
            await this.io.startDownload();
            print("Downloading complete.");
            print("Building decoder...");
            new (Module as any)({
                dynamicLibraries: this.io.with_attribute,
                print: function () {
                    return print;
                }(),
                printErr: function () {
                    return printErr;
                }()
            }).then(module => {
                print("Building complete.");
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
                print("Transcoding to "+ this.out +"...");
                self.module._set(self.entry, ptr_args);
                print("Transcoding complete.");
                
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

                if (self.out == "rgba"){
                    const canvas = document.createElement('canvas');
                    const imgData = new ImageData(new Uint8ClampedArray(buffer_out.buffer_u8), 0, 0);
                    canvas.getContext('2d').putImageData(imgData, 0, 0);
                    canvas.toBlob(blob => {
                        this.dataURLToSrc(self, blob, false);
                    });
                }else{
                    this.dataURLToSrc(self, new Blob([buffer_out.buffer_u8], { type: "image/"+this.out}), false);
                    main_resolve(self.srcset);
                }
            });
        });
    }


    connectedCallback() {
        let args: any = {};


        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            args[nodeName] = atts[i].nodeValue;
        }

        this._decodingPromise = this.universal_decode(this, args);
    }
    /*
        disconnectedCallback() {
    
        }*/

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
            case 'out':
                this.out = this.getAttribute("out");
                break;
            case 'use-cache':
                this.useCache = true;
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'use-cache']; }
}

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

export { UniversalImage };