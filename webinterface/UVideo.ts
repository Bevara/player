import JSZip = require("jszip");

class UniversalVideo extends HTMLVideoElement {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string;
    with_attribute: string[];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "mp4";
    scriptDirectory = "";
    useCache = false;
    printProgess = false;
    cache = null;
    worker = null;
    core = null;

    private _decodingPromise: Promise<string>;

    get decodingPromise() {
        return this._decodingPromise;
    }

    private print() {
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

    private printErr() {
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
        if (self.useCache && self.cache && !cached) {
            self.cache.put(self.src, new Response(blob));
        }

        self.src = URL.createObjectURL(blob);
    }

    async universal_decode(self, args): Promise<string> {
        return new Promise(async (main_resolve, _main_reject) => {
            if (self.useCache) {
                try {
                    self.cache = self.cache || await caches.open('universal-audio');
                } catch (e) { }
                const cachedImg = self.cache && await self.cache.match(self.src);
                if (cachedImg) {
                    const cachedImgData = await cachedImg.blob();
                    this.dataURLToSrc(self, cachedImgData, true);
                    main_resolve(self.src);
                    return;
                }
            }

            const props = [];
            if (self.hasAttribute("connections")) {
                props.push("connections");
            }

            args["enc"] = "enc:c=avc";

            const response = await fetch(self.src);
            let buffer = await response.arrayBuffer();
            const mime = response.headers.get("Content-Type");
            let src = self.src;

            if (self.src.endsWith(".bvr") || mime == "application/x-bevara") {
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

                self.worker = new Worker(this.scriptDirectory + this.using_attribute);
            } else if (this.using_attribute) {
                self.worker = new Worker(this.scriptDirectory + this.using_attribute + '.js');
            }

            if (self.worker) {
                self.worker.postMessage(
                    {
                        in: { src: src, buffer: buffer },
                        out: this.out,
                        module: {
                            dynamicLibraries: this.with_attribute,
                            INITIAL_MEMORY: 16777216 * 10
                        },
                        type: "video/" + this.out,
                        args: args,
                        props: props
                    });
                self.worker.addEventListener('message', m => {
                    this.dataURLToSrc(self, m.data.blob, false);
                    main_resolve(self.src);
                });
            }

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


    disconnectedCallback() {
        if (this.worker) {
            this.worker.terminate();
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
            case 'progress':
                this.printProgess = true;
                break;
            case 'script-directory':
                this.scriptDirectory = this.getAttribute("script-directory");
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'use-cache', 'progress', 'script-directory']; }
}

if (!customElements.get('universal-video')) {
    customElements.define('universal-video', UniversalVideo, { extends: 'video' });
}

export { UniversalVideo };