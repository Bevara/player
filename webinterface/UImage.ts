import JSZip = require("jszip");

class UniversalImage extends HTMLImageElement {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string = "";
    with_attribute: string[] = [];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "png";
    scriptDirectory = "";
    useCache = false;
    useWorker = true;
    printProgess = false;
    cache = null;
    worker = null;
    script = null;
    core = null;

    private _decodingPromise: Promise<string>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    dataURLToSrc(blob, cached) {
        if (!blob) return;
        if (this.useCache && this.cache && !cached) {
            this.cache.put(this.src, new Response(blob));
        }

        this.srcset = URL.createObjectURL(blob);
    }

    processMessages(self, core, resolve){
        if(core.blob){
            self.dataURLToSrc(core.blob, false);
            resolve(self.srcset);
        }

        function clear_text(text) {
            return text
                .replaceAll("[37m", '')
                .replaceAll("[0m", '');
        }

        if(core.print){
            if (self.print_attribute){
                (self.print_attribute as any).value += clear_text(core.print) + "\n";
            }else{
                console.log(core.print);
            }
        }

        if(core.printErr){
            if (self.error_attribute){
                (self.error_attribute as any).value += clear_text(core.printErr) + "\n";
            }else{
                console.log(core.printErr);
            }
            
        }

    }


    launchWorker(initMessage, script, resolve) {
        const worker = new Worker(script);
        if (worker) {
            worker.postMessage(initMessage);

            worker.addEventListener('message', m => {
                if (m.data.core) {
                    this.processMessages(this, m.data.core, resolve);
                }
            });
        }

        this.worker = worker;
    }

    launchNoWorker(initMessage, script, ref, resolve) {
        const self = this;

        function addLoadEvent(script, func) {
            var oldonload = script.onload;
            if (typeof script.onload != 'function') {
                script.onload = func;
            } else {
                script.onload = function () {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                };
            }
        }

        function init() {
            postMessage(initMessage);

            function processResult(m) {
                if (m.data.core && m.data.core.ref == ref) {
                    self.processMessages(self, m.data.core, resolve);

                    if(m.data.core.blob){
                        removeEventListener('message', processResult);
                    }
                }
            }

            window.addEventListener('message', processResult);
        }

        const scripts = document.querySelectorAll(`script[src$="${script}"]`);

        if (scripts.length > 0) {
            addLoadEvent(scripts[0], init);
        } else {
            const script_elt = document.createElement('script');
            script_elt.src = script;
            addLoadEvent(script_elt, init);
            document.head.appendChild(script_elt);
            this.script = script_elt;            
        }
    }

    launch(script, src, buffer, args, props, resolve) {
        const ref = JSON.stringify(this);

        const initMessage = {
            tag: {
                in: { src: src, buffer: buffer },
                out: this.out,
                module: {
                    dynamicLibraries: this.with_attribute,
                    INITIAL_MEMORY: 16777216 * 10
                },
                type: "image/" + this.out,
                using:this.using_attribute,
                args: args,
                props: props,
                core: this.core,
                scriptDirectory:this.scriptDirectory,
                ref: ref,
                print:this.print_attribute?true:false,
                printErr:this.error_attribute?true:false,
                print_progress:this.printProgess
            }
        };

        if (this.useWorker) {
            this.launchWorker(initMessage, script, resolve);
        } else {
            this.launchNoWorker(initMessage, script, ref, resolve);
        }
    }

    async universal_decode(args): Promise<string> {
        return new Promise(async (main_resolve, _main_reject) => {
            if (this.useCache) {
                try {
                    this.cache = this.cache || await caches.open('universal-img');
                } catch (e) { }
                const cachedImg = this.cache && await this.cache.match(this.src);
                if (cachedImg) {
                    const cachedImgData = await cachedImg.blob();
                    this.dataURLToSrc(cachedImgData, true);
                    main_resolve(this.srcset);
                    return;
                }
            }


            // Retrieve result
            const props = [];
            if (this.hasAttribute("connections")) {
                props.push("connections");
            }

            if (this.out == "rgba" || this.out == "rgb") {
                props.push("width");
                props.push("height");
            }

            const response = await fetch(this.src);
            let buffer = await response.arrayBuffer();
            const mime = response.headers.get("Content-Type");
            let src = this.src;

            // Check if using is a full url
            try {
                new URL(this.using_attribute);
                this.launch(this.using_attribute, src, buffer, args, props, main_resolve);
                return;
            } catch (_) {
            }

            if (this.src.endsWith(".bvr") || mime == "application/x-bevara") {
                const jszip = new JSZip();
                const zip = await jszip.loadAsync(buffer);
                const metadata = await zip.file("meta.json").async("string");
                const bvr = JSON.parse(metadata);
                src = bvr.source;
                buffer = await zip.file(bvr.source).async("arraybuffer");

                const blob_core = await zip.file(bvr.core).async("blob");
                this.core = URL.createObjectURL(blob_core);

                if (this.using_attribute == "") {
                    const blob = await zip.file(bvr.js).async("blob");
                    this.using_attribute = URL.createObjectURL(blob);
                } else {
                    this.using_attribute = this.using_attribute + ".js";
                }

                for (const decoder of bvr.decoders) {
                    const blob = await zip.file(decoder).async("blob");
                    this.with_attribute.push(URL.createObjectURL(blob));
                }

                this.launch(this.scriptDirectory + this.using_attribute, src, buffer, args, props, main_resolve);
            } else if (this.using_attribute) {
                this.launch(this.scriptDirectory + this.using_attribute + '.js', src, buffer, args, props, main_resolve);
            }



            /*
                        const print = this.print();
                        const printErr = this.printErr();
            
                        this.io = new fileio(self.src, "out."+this.out, this.using_attribute, this.with_attribute, this.print(),this.printProgess);
            
            
            
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
                            args["filters"] = self.module.filter_entries.map(entry => self.module[entry](0));
            
            
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
            
                            if (self.out == "rgba" || self.out == "rgb"){
                                props.push("width");
                                props.push("height");
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
                                canvas.width = json_res_parsed.width;
                                canvas.height = json_res_parsed.height;
                                const imgData = new ImageData(new Uint8ClampedArray(buffer_out.HEAPU8), json_res_parsed.width, json_res_parsed.height );
                                canvas.getContext('2d').putImageData(imgData, 0, 0);
                                canvas.toBlob(blob => {
                                    this.dataURLToSrc(self, blob, false);
                                    main_resolve(self.srcset);
                                });
                            } else if (self.out == "rgb"){
                                const canvas = document.createElement('canvas');
                                canvas.width = json_res_parsed.width;
                                canvas.height = json_res_parsed.height;
                                const imgData = new ImageData(json_res_parsed.width, json_res_parsed.height );
                                
                                const dest = imgData.data;
                                const src = buffer_out.HEAPU8;
                                const n = 4 * json_res_parsed.width * json_res_parsed.height;
                                let s = 0, d = 0;
                                while (d < n) {
                                    dest[d++] = src[s++];
                                    dest[d++] = src[s++];
                                    dest[d++] = src[s++];
                                    dest[d++] = 255;    // skip alpha byte
                                }
                                
                                canvas.getContext('2d').putImageData(imgData, 0, 0);
            
                                canvas.toBlob(blob => {
                                    this.dataURLToSrc(self, blob, false);
                                    main_resolve(self.srcset);
                                });
                            }else {
                                this.dataURLToSrc(self, new Blob([buffer_out.HEAPU8], { type: "image/"+this.out}), false);
                                main_resolve(self.srcset);
                            }
                        });*/
        });
    }


    connectedCallback() {
        let args: any = {};


        for (var i = 0, atts = this.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            args[nodeName] = atts[i].nodeValue;
        }

        this._decodingPromise = this.universal_decode(args);
    }

    disconnectedCallback() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        if (this.script) {
            document.head.removeChild(this.script);
            this.script = null;
        }
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
                this.with_attribute = this.getAttribute("with").split(';').map(x => x + ".wasm");
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
            case 'no-worker':
                this.useWorker = false;
                break;
            case 'progress':
                this.printProgess = true;
                break;
            case 'script-directory':
                this.scriptDirectory = this.getAttribute("script-directory");
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'use-cache', 'progress', 'script-directory', 'no-worker']; }
}

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

export { UniversalImage };