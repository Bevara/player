//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"
import { Module, location, memio } from "./simple-img.js"

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

                default:
                    args[nodeName] = atts[i].nodeValue;
            }
        }

        let buf_in = {
            numBytes : 0,
            p : 0,
            remaining : 0,
            buffer_in : null,
            module:null
        } 
        
        memio["read"] = function (fileio, buffer, bytes) {
            this.remaining = this.numBytes - this.p;

            if (bytes > this.remaining) {
                buf_in.module.HEAPU8.set(this.buffer_in.slice(this.p, this.p + this.remaining), buffer);
                this.p += this.remaining;
                return this.remaining;
            }

            buf_in.module.HEAPU8.set(this.buffer_in.slice(this.p, this.p + bytes), buffer);
            this.p += bytes;
            console.log("numBytes: " + this.numBytes + ", bytes: " + bytes + ", remaining =" + this.remaining);
            return bytes;
        }.bind(buf_in);

        memio["read"].sig = ['i', 'i', 'i','i'];

        memio["write"] = function (fileio, buffer, bytes) {
            
        }
        memio["write"].sig = ['i', 'i', 'i','i'];

        const SEEK_SET = 0;
        const SEEK_CUR = 1;
        const SEEK_END = 2;
        memio["seek"] = function (fileio, offset, whence) {
            switch (whence) {
                case SEEK_SET:
                case SEEK_CUR:
                    this.p += Number(offset);
                    break;
                case SEEK_END:
                    this.p = this.numBytes + Number(offset);
                    break;
            }
            return 0;
        }.bind(buf_in);
        memio["seek"].sig = ['i', 'i', 'j','i'];

        memio["tell"] = function (fileio) {
            return BigInt(this.p);
        }.bind(buf_in);
        memio["tell"].sig = ['j', 'i'];

        memio["eof"] = function (fileio) {
            return this.p == this.numBytes;
        }.bind(buf_in);
        memio["eof"].sig = ['i', 'i'];

        memio["printf"] = function (fileio, format, args) {
            console.log("memio printf has to be implemented");
            return 0;
        }
        memio["printf"].sig = ['i','i','i', 'i'];

        memio["open"] = function (fileio_ref, url, mode, out_err) {
            buf_in.module._gf_fileio_set_stats_u32(fileio_ref, this.numBytes,this.numBytes, 1, 0);
            buf_in.module.HEAP32[((out_err)>>2)] = 0; //GF_OK
            return fileio_ref;
        }.bind(buf_in);
        memio["open"].sig = ['i','i','i','i', 'i'];

        function make_fileio(){
            const source = self.getAttribute("src");
            const len_source_str = (source.length << 2) + 1;
            const ptr_source_str = self.module.stackAlloc(len_source_str);
            self.module.stringToUTF8(source, ptr_source_str, len_source_str);
            

            const fio = self.module._gf_fileio_new(ptr_source_str, 0, 
                memio["open"].value, 
                memio["seek"].value, 
                memio["read"].value, 
                memio["write"].value, 
                memio["tell"].value,
                memio["eof"].value,
                memio["printf"].value);
            

            return self.module._gf_fileio_url(fio);
        }

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
                    buf_in.buffer_in = new Uint8Array(img_array);
                    self.entry = self.module._constructor();
                    
                    buf_in.numBytes = img_array.byteLength;
                    buf_in.remaining = buf_in.numBytes;
                    buf_in.module = self.module;

                    const fio_url_ptr = make_fileio();
                    const fio_url = self.module.UTF8ToString(fio_url_ptr);

                    // Set input buffer
                    /*
                    const ptr_buffer_in = self.module.stackAlloc(img_array.byteLength);
                    self.module.HEAPU8.set(buffer_in, ptr_buffer_in);
                    args["buffer"] = { pointer: ptr_buffer_in, size: img_array.byteLength };*/
                    args["buffer"] = fio_url;

                    // Set output format
                    args["dst"] = "out.png";

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