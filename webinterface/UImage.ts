import JSZip = require("jszip");
import { addScriptDirectoryAndExtIfNeeded, launchNoWorker, sendMessageNoWorker, UniversalFn } from "./UniversalFns";
const version = require("../version.js").version;
import '@ungap/custom-elements';

class UniversalImage extends HTMLImageElement implements UniversalFn {
  using: string;
  memory: Uint8Array;

  with: string;
  start: number;
  benchmode: boolean;

  entry: any;
  module: any;

  using_attribute: string = "";
  with_attribute: string[] = [];
  print_attribute: Element | null;
  error_attribute: Element | null;

  out = "rgb";
  scriptDirectory = document.currentScript ? this.initScriptDirectory((document.currentScript as any).src) : "";
  useCache = false;
  useWorker = false;
  printProgess = false;
  cache = null;
  worker = null;
  script = null;
  core = null;

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

  async convertWithCanvas(format, blob) {
    const res = blob;
    const props = await this.properties(["width", "height"]);

    if (this.getAttribute("noCleanupOnExit") == null) {
      const message = {
        event: "destroy"
      };

      this.sendMessage(message);
    }

    const canvas = new OffscreenCanvas(props.width, props.height);
    const data = new Uint8ClampedArray(await blob.arrayBuffer());
    const ctx = canvas.getContext('2d') as any;
    let imgData;
    switch (format) {
      case "rgba":
        imgData = new ImageData(data, props.width, props.height);
        ctx.putImageData(imgData, 0, 0);
        return await (canvas as any).convertToBlob();
      case "rgb":
        imgData = new ImageData(props.width, props.height);
        const dest = imgData.data;
        const n = 4 * props.width * props.height;
        let s = 0, d = 0;
        while (d < n) {
          dest[d++] = data[s++];
          dest[d++] = data[s++];
          dest[d++] = data[s++];
          dest[d++] = 255;    // skip alpha byte
        }

        ctx.putImageData(imgData, 0, 0);

        return await (canvas as any).convertToBlob();
    }
  }

  async dataURLToSrc(blob, cached) {
    if (!blob) return;
    if (this.useCache && this.cache && !cached) {
      this.cache.put(this.src, new Response(blob));
    }

    if (this.out == "rgb" || this.out == "rgba") {
      blob = await this.convertWithCanvas(this.out, blob);
    }

    this.srcset = URL.createObjectURL(blob);
  }

  async processMessages(self, core, resolve) {
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

    if ("exit_code" in core) {
      if (core.compileStart) {
        self.compileStart = core.compileStart;
      }

      if (core.compileEnd) {
        self.compileEnd = core.compileEnd;
      }
      if (core.decodeStart) {
        self.decodeStart = core.decodeStart;
      }

      if (core.decodeEnd) {
        self.decodeEnd = core.decodeEnd;
      }
      if (core.blob) {
        await self.dataURLToSrc(core.blob, false);
        resolve(self.srcset);
      } else {
        resolve(null);
      }
    }

  }

  properties(props: string[]) {
    const message = {
      event: "get_properties",
      properties: props
    };

    return this.sendMessage(message);
  }

  set enable_reporting(value: boolean) {
    const message = {
      event: "set_properties",
      properties: { "enable_reporting": value }
    };

    this.sendMessage(message);
  }

  sendMessage(message) {
    return this.worker ? this.sendMessageWorker(message) : sendMessageNoWorker(this, message);
  }

  sendMessageWorker(message) {
    return new Promise((resolve, reject) => {

      if (!this.worker) {
        reject();
      }
      this.worker.postMessage(message);

      this.worker.addEventListener('message', m => {
        resolve(m.data);
      });
    });
  }


  launchWorker(script, message, resolve) {
    const worker = new Worker(script);
    if (worker) {
      worker.postMessage(message);

      worker.addEventListener('message', m => {
        this.processMessages(this, m.data, resolve);
      });
    }

    this.worker = worker;
  }

  async universal_decode(): Promise<string> {
    this.start = performance.now();
    return new Promise(async (main_resolve, main_reject) => {
      if (this.useCache) {
        try {
          this.cache = this.cache || await caches.open('universal-img_' + version);
        } catch (e) { }
        const cachedImg = this.cache && await this.cache.match(this.src);
        if (cachedImg) {
          const cachedImgData = await cachedImg.blob();
          this.dataURLToSrc(cachedImgData, true);
          main_resolve(this.srcset);
          return;
        }
      }

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
        module: {
          dynamicLibraries: dynamicLibraries,
          noInitialRun: true,
          noExitRuntime: true

        },
        wasmBinaryFile: wasmBinaryFile,
        src: src,
        dst: "out." + this.out,
        useWebcodec: false,
        bench: this.benchmode,
        showStats: this.getAttribute("stats"),
        showGraph: this.getAttribute("graph"),
        showReport: this.getAttribute("report"),
        showLogs: this.getAttribute("logs"),
        get: this.out == "rgb" || this.out == "rgba" ? ["width", "height"] : [],
        print: this.getAttribute("print"),
        printErr: this.getAttribute("printErr"),
        noCleanupOnExit: this.getAttribute("noCleanupOnExit") || this.out == "rgb" || this.out == "rgba"
        //noCleanupOnExit: true
      };


      if (!js) {
        console.log("Warning! no accessor is used on the universal, using a usual tag instead...");
        main_reject(this.src);
        return;
      }
      try {
        this.getAttribute("use-worker") == "" ? this.launchWorker(js, message, main_resolve) : launchNoWorker(this, js, message, main_resolve);
      } catch (e) {
        main_reject();
      }

    });
  }


  connectedCallback() {
    this.benchmode = this.getAttribute("bench") != null;
    this._decodingPromise = this.universal_decode();
  }

  disconnectedCallback() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    } else {
      const message = {
        event: "destroy"
      };
      this.sendMessage(message);
    }

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
      case 'use-cache':
        this.useCache = true;
        break;
      case 'use-worker':
        this.useWorker = true;
        break;
      case 'progress':
        this.printProgess = true;
        break;
      case 'script-directory':
        this.scriptDirectory = this.getAttribute("script-directory");
        break;
    }
  }

  static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'use-cache', 'progress', 'script-directory', 'use-worker', "debug", "js"]; }
}

if (!customElements.get('universal-img_' + version)) {
  customElements.define('universal-img_' + version, UniversalImage, { extends: 'img' });
}

export { UniversalImage };
