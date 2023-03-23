import JSZip = require("jszip");

class UniversalVideo extends HTMLVideoElement {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string;
    with_attribute: string[] = [];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "mp4";
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

    dataURLToSrc(blob, cached) {
        if (!blob) return;
        if (this.useCache && this.cache && !cached) {
            this.cache.put(this.src, new Response(blob));
        }

        this.src = URL.createObjectURL(blob);
    }

    launchWorker(script, src, buffer, args, props, resolve) {
        const worker = new Worker(script);
        if (worker) {
            worker.postMessage({
                tag: {
                    in: { src: src, buffer: buffer },
                    out: this.out,
                    module: {
                        dynamicLibraries: this.with_attribute,
                        INITIAL_MEMORY: 16777216 * 10
                    },
                    type: "video/" + this.out,
                    args: args,
                    props: props,
                    core: this.core,
                    scriptDirectory:this.scriptDirectory
                }
            });

            worker.addEventListener('message', m => {
                if (m.data.core) {
                    this.dataURLToSrc(m.data.core.blob, false);
                    resolve(this.src);
                }
            });
        }

        this.worker = worker;
    }

    launchNoWorker(script, src, buffer, args, props, resolve) {
        const self = this;
        const ref = JSON.stringify(this);

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
            postMessage(
                {
                    tag: {
                        in: { src: src, buffer: buffer },
                        out: self.out,
                        module: {
                            dynamicLibraries: self.with_attribute,
                            INITIAL_MEMORY: 16777216 * 10
                        },
                        type: "video/" + self.out,
                        using: self.using_attribute,
                        args: args,
                        props: props,
                        core: self.core,
                        ref: ref
                    }
                });

            function processResult(m) {
                if (m.data.core && m.data.core.ref == ref) {
                    removeEventListener('message', processResult);
                    self.dataURLToSrc(m.data.core.blob, false);
                    resolve(self.src);
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
        if (this.useWorker) {
            this.launchWorker(script, src, buffer, args, props, resolve);
        } else {
            this.launchNoWorker(script, src, buffer, args, props, resolve);
        }
    }

    async universal_decode(args): Promise<string> {
        return new Promise(async (main_resolve, _main_reject) => {
            if (this.useCache) {
                try {
                    this.cache = this.cache || await caches.open('universal-audio');
                } catch (e) { }
                const cachedImg = this.cache && await this.cache.match(this.src);
                if (cachedImg) {
                    const cachedImgData = await cachedImg.blob();
                    this.dataURLToSrc(cachedImgData, true);
                    main_resolve(this.src);
                    return;
                }
            }

            const props = [];
            if (this.hasAttribute("connections")) {
                props.push("connections");
            }

            args["enc"] = "enc:c=avc";

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

if (!customElements.get('universal-video')) {
    customElements.define('universal-video', UniversalVideo, { extends: 'video' });
}

export { UniversalVideo };