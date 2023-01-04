import { Common } from "./common"
import { Module} from "./core-player.js"

class UniversalCanvas extends HTMLCanvasElement {
    using: string;
    common: Common;
    memory: Uint8Array;

    with: string;

    instance: any;
    entry: any;
    module: any;
    src: string;

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
            self.src = URL.createObjectURL(blob);
        })
    }


    connectedCallback() {
        const self = this;
        const using_attribute = self.getAttribute("using");
        const with_attribute = self.getAttribute("with").split(';');
        let args: any = {};
        this.src = self.getAttribute("src");
        
        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            args[nodeName] = atts[i].nodeValue;
        }

        this._decodingPromise = new Promise((main_resolve, _main_reject) => {
            with_attribute.push("writegen.wasm");
            with_attribute.push("rfimg.wasm");
            with_attribute.push("compose.wasm");
            with_attribute.push("pngenc.wasm");
            with_attribute.push("fileout.wasm");
            with_attribute.push("filein.wasm");
            with_attribute.push("sdl_out.wasm");
            with_attribute.push("aout.wasm");
            with_attribute.push("httpin.wasm");
            
            new (Module as any)({
                dynamicLibraries: with_attribute,
                canvas:this
            }).then(module => {
                module['canvas'] = this;
                self.module = module;
                self.entry = self.module._constructor();

                // Set input filters
                args["filters"] = self.module.filter_entries.map(entry => self.module["_" + entry](0));
                args["modules"] = self.module.module_entries.map(entry => self.module["_" + entry]());


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

                        function call(){
                            self.module._run(self.entry);
                            setTimeout(call, 1);
                        }
                        setTimeout(call, 1);
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

export { UniversalCanvas }