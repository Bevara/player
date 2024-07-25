import JSZip = require("jszip");
import { addScriptDirectoryAndExtIfNeeded, launchNoWorker, sendMessageNoWorker, UniversalFn} from "./UniversalFns";
const version = require("../version.js").version;
import '@ungap/custom-elements';

class UniversalCanvas extends HTMLCanvasElement implements UniversalFn {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string = "";
    with_attribute: string[] = [];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "mp4";
    scriptDirectory = document.currentScript ? this.initScriptDirectory((document.currentScript as any).src) : "";
    script = null;
    core = null;
    src = "";

    urlToRevoke = [];

    private _decodingPromise: Promise<string>;
    private _messageHandlerNoWorker = null;

    private initScriptDirectory(src: string) {
        if (src.indexOf('blob:') !== 0) {
            return src.substr(0, src.replace(/[?#].*/, "").lastIndexOf('/') + 1);
        } else {
            return '';
        }
    }


    get decodingPromise() {
        return this._decodingPromise;
    }

    get volume() {
        const message = {
            event: "get_properties",
            properties: ["volume"]
        };

        return sendMessageNoWorker(this, message);
    }

    set volume(volume) {
        const message = {
            event: "set_properties",
            properties: { "volume": volume }
        };

        sendMessageNoWorker(this, message);
    }

    set muted(muted) {
        const message = {
            event: "set_properties",
            properties: { "muted": muted }
        };

        sendMessageNoWorker(this, message);
    }

    get muted() {
        const message = {
            event: "get_properties",
            properties: ["muted"]
        };

        return sendMessageNoWorker(this, message);
    }

     get connected() {
        const message = {
             event: "get_properties",
             properties: ["connected"]
         };

         return sendMessageNoWorker(this, message)["connected"];
     }

     set enable_reporting(value :boolean){
        const message = {
            event: "set_properties",
            properties: { "enable_reporting": value }
        };

        sendMessageNoWorker(this, message);
     }

     properties(props : string[]){
        const message = {
            event: "get_properties",
            properties: props
        };

        return sendMessageNoWorker(this, message);
     }

    play(): void {
        const message = {
            event: "set_properties",
            properties: { "play": true }
        };

        sendMessageNoWorker(this, message);
    }

    pause(): void {
        const message = {
            event: "set_properties",
            properties: { "pause": true }
        };

        sendMessageNoWorker(this, message);
    }

    load(): void {
        console.log("load");
    }

    canPlayType(type: string): CanPlayTypeResult {
        return "";
    }

    processMessages(self, core, resolve) {
        function clear_text(text) {
            return text
                .replaceAll("[37m", '')
                .replaceAll("[0m", '');
        }

        if (core.print) {
            if (self.print_attribute) {
                (self.print_attribute as any).value += clear_text(core.print) + "\n";
            } else {
                console.log(core.print);
            }
        }

        if (core.printErr) {
            if (self.error_attribute) {
                (self.error_attribute as any).value += clear_text(core.printErr) + "\n";
            } else {
                console.log(core.printErr);
            }

        }

    }

    async universal_decode(): Promise<string> {
        return new Promise(async (main_resolve, main_reject) => {
            let mime = "";
            try {
                const parsed_url = new URL(this.src);
                if (parsed_url.protocol === 'blob:') {
                    // We can't fetch head of a blob
                    const response = await fetch(this.src);
                    mime = response.headers.get("Content-Type");
                } else if (parsed_url.protocol === 'http:' || parsed_url.protocol === 'https:') {
                    const response = await fetch(this.src, { method: 'HEAD' });
                    mime = response.headers.get("Content-Type");
                }
            } catch {
                console.log("failed to fetch head of the content " + this.src);
                return;
            }



            let src = this.src;
            let js = null;
            let wasmBinaryFile = null;
            let dynamicLibraries: string[] = [];

            if ((this.src && this.src.endsWith(".bvr")) || mime == "application/x-bevara") {
                const jszip = new JSZip();
                const fetched_bvr = await fetch(this.src);

                if (!fetched_bvr.ok) {
                    main_reject();
                    return;
                }

                const zip = await jszip.loadAsync(fetched_bvr.blob());
                const metadata = await zip.file("meta.json").async("string");
                const json_meta = JSON.parse(metadata);
                this.core = json_meta.core;

                const getURLData = async (name) => {
                    if (Array.isArray(name)) {
                        const blobs = await Promise.all(name.map(x => zip.file(x).async("blob")));
                        const urls = blobs.map(x => URL.createObjectURL(x));
                        this.urlToRevoke = this.urlToRevoke.concat(urls);
                        return urls;
                    } else if (typeof name == 'string') {
                        const blob = await zip.file(name).async("blob");
                        const url = URL.createObjectURL(blob);
                        this.urlToRevoke.push(url);
                        return url;
                    }
                    return null;
                };

                src = (await getURLData(json_meta.source) as string);
                js = await getURLData(json_meta.core + ".js");
                wasmBinaryFile = await getURLData(json_meta.core + ".wasm");
                dynamicLibraries = (await getURLData(json_meta.decoders.map(x => x + ".wasm")) as string[]);
            }
            const scriptDirectory = this.getAttribute("script-directory") ? this.getAttribute("script-directory") : "";

            if (this.getAttribute("using")) {
                this.core = this.getAttribute("using");
                js = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("using"), ".js");
                wasmBinaryFile = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("using"), ".wasm");
            }

            if (this.getAttribute("js")) {
                //Overwrite js attribute
                js = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("js"), "");
            }

            if (this.getAttribute("with")) {
                const all_using = await Promise.all(this.getAttribute("with").split(';').map(x => addScriptDirectoryAndExtIfNeeded(scriptDirectory, x, ".wasm")));
                dynamicLibraries = dynamicLibraries.concat(all_using);
            }

            const message = {
                event: "init",
                self: this,
                module: {
                    dynamicLibraries: dynamicLibraries,
                    canvas: document.getElementById("canvas"),
                    noInitialRun: true,
                    noExitRuntime: true

                },
                wasmBinaryFile: wasmBinaryFile,
                src: this.getAttribute("data-url"),
                useWebcodec: this.getAttribute("use-webcodec") == "",
                showStats: this.getAttribute("stats"),
                showGraph: this.getAttribute("graph"),
                showReport: this.getAttribute("report"),
                showLogs: this.getAttribute("logs"),
                print:this.getAttribute("print"),
                printErr:this.getAttribute("printErr"),
                noCleanupOnExit:this.getAttribute("noCleanupOnExit"),
                loop:this.getAttribute("noloop") == ""?false:true,
                width:this.getAttribute("width"),
                height:this.getAttribute("height")
            };

            if (!js) {
                console.log("Warning! no accessor is used on the universal, using a usual tag instead...");
                main_reject(this.src);
                return;
            }

            try {
                launchNoWorker(this, js, message, main_resolve);
            }catch(e){
                main_reject();
            }
        });
    }


    connectedCallback() {
        this.setAttribute("id", "canvas");
        this.src = this.getAttribute("data-url");
        this._decodingPromise = this.universal_decode();
    }

    disconnectedCallback() {
        this.urlToRevoke.forEach(x => URL.revokeObjectURL(x));

        if (this.script) {
            const core = this.getAttribute("using");
            document.head.removeChild(this.script);
            this.script = null;
            if ((window as any)[core]) {
                (window as any)[core] = null;
            }

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
            case 'script-directory':
                this.scriptDirectory = this.getAttribute("script-directory");
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'progress', 'script-directory', "debug", "js", "use-webcodec"]; }
}

if (!customElements.get('universal-canvas_'+version)) {
    customElements.define('universal-canvas_'+version, UniversalCanvas, { extends: 'canvas' });
}

export { UniversalCanvas };
