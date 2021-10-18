

import { info } from "./imports";
import { stringToUTF8Array, UTF8ArrayToString } from "./utils/strings";
import { err, assert } from "./utils/outputs";
//import { receiveInstantiationResult } from "./imports/receiveInstantiationResult";
//import { instantiateArrayBuffer } from "./imports/instantiateArrayBuffer";

var HEAP32: Int32Array = null;
var HEAPF64: Float64Array = null;

var runtimeInitialized : Boolean = false;
var runtimeExited :Boolean= false;
var runtimeKeepaliveCounter :number= 0;

/** @type {function(...*):?} */
var stackSave : Function = null;

/** @type {function(...*):?} */
var stackAlloc : Function = null;

/** @type {function(...*):?} */
var _emscripten_run_in_main_runtime_thread_js : Function = null;

/** @type {function(...*):?} */
var stackRestore : Function= null;

class UniversalImage extends HTMLImageElement {

    HEAP: number = null;
    buffer: ArrayBuffer = null;
    HEAP8: Int8Array = null;
    HEAPU8: Uint8Array = null;
    HEAP16: Int16Array = null;
    HEAPU16: Uint16Array = null;
    HEAP32: Int32Array = null;
    HEAPU32: Uint32Array = null;
    HEAPF32: Float32Array = null;
    HEAPF64: Float64Array = null;
    decoder: number = null;
    INITIAL_MEMORY: number = 16777216;
    wasmMemory: WebAssembly.Memory = null;
    wasmTable: WebAssembly.Table = null;
    using: string;
    with: string;
    exports: WebAssembly.Exports = null;

    updateGlobalBufferAndViews(buf: ArrayBuffer): void {
        this.buffer = buf;
        this.HEAP8 = new Int8Array(buf);
        this.HEAP16 = new Int16Array(buf);
        this.HEAP32 = new Int32Array(buf);
        this.HEAPU8 = new Uint8Array(buf);
        this.HEAPU16 = new Uint16Array(buf);
        this.HEAPU32 = new Uint32Array(buf);
        this.HEAPF32 = new Float32Array(buf);
        this.HEAPF64 = new Float64Array(buf);

        HEAP32 = this.HEAP32;
        HEAPF64 = this.HEAPF64;
    }

    createExportWrapper(name: string, fixedasm?:WebAssembly.Exports) : Function {
        return function () {
            var displayName :string = name;
            var asm :any = fixedasm;
            if (!fixedasm) {
                asm = this.exports;
            }
            assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
            assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
            if (!asm[name]) {
                assert(asm[name], 'exported native function `' + displayName + '` not found');
            }
            return asm[name].apply(null, arguments);
        };
    }

    initExport(){
        stackSave = this.createExportWrapper("stackSave");
        stackAlloc = this.createExportWrapper("stackAlloc");
        _emscripten_run_in_main_runtime_thread_js = this.createExportWrapper("emscripten_run_in_main_runtime_thread_js");
        stackRestore = this.createExportWrapper("stackRestore");
    }

    loadDecoder(src: string): void {
        let self = this;

        fetch(src).then(function (response) {
            self.wasmMemory = new WebAssembly.Memory({
                'initial': self.INITIAL_MEMORY / 65536,
                'maximum': self.INITIAL_MEMORY / 65536
                ,
                'shared': true
            });

            self.wasmTable = new WebAssembly.Table({
                'initial': 992 * 100,
                'element': 'anyfunc'
            });
            console.log("loading decoder");
            self.buffer = self.wasmMemory.buffer;
            self.INITIAL_MEMORY = self.buffer.byteLength;
            assert(self.INITIAL_MEMORY % 65536 === 0);
            self.updateGlobalBufferAndViews(self.buffer);
            if (self.wasmMemory) {
                self.buffer = self.wasmMemory.buffer;
            }
            info.env["__indirect_function_table"] = self.wasmTable;
            info.env["memory"] = self.wasmMemory;
            self.updateGlobalBufferAndViews(self.wasmMemory.buffer);
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then((result) => {
                self.exports = result.instance.exports;
                self.initExport();

                const exports: any = self.exports;
                const args: Record<string, string> = {};
                for (var i = 0, atts = self.attributes, n = atts.length, arr = []; i < n; i++) {
                    args[atts[i].nodeName] = atts[i].nodeValue;
                }

                const json = JSON.stringify(args);
                var len = (json.length << 2) + 1;
                const ret = exports.stackAlloc(len);
                stringToUTF8Array(json, self.HEAPU8, ret, len);
                self.decoder = exports.setup_acc(ret);
                //const test = UTF8ArrayToString(self.HEAPU8,value)
                console.log(self.decoder);
            });
        })
    }

    connectedCallback(): void {
        console.log("connectedCallback");
        this.loadDecoder(this.using);
    }

    disconnectedCallback() {
        console.log('Img has been removed from page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                this.src = newValue;
                break;
            case 'using':
                this.using = newValue;
                break;
            case 'with':
                this.with = newValue;
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

customElements.define('universal-img', UniversalImage, { extends: 'img' });

export { HEAP32, HEAPF64, stackSave, stackAlloc, stackRestore, _emscripten_run_in_main_runtime_thread_js}