import { asmLibraryArg, GOTHandler } from "./imports";
import { UTF8ToString, stringToUTF8 } from "./utils/text"
import { Fetch, fetchLoadCachedData, fetchXHR } from "./utils/fetch"
import { callUserCallback } from "./utils/functions"

import { _emscripten_start_fetch } from "./imports/_emscripten_start_fetch";
import { __emscripten_fetch_free } from "./imports/__emscripten_fetch_free";

class Common {
    exports_with: any;
    exports_using: any;
    _stringToUTF8: any;

    using_wasm_module: WebAssembly.Module;


    constructor(using_wasm_module: WebAssembly.Module, with_wasm: WebAssembly.WebAssemblyInstantiatedSource) {
        this.exports_with = with_wasm.instance.exports;
        this.using_wasm_module = using_wasm_module;
    }

    init() {
        var wasmTable = new WebAssembly.Table({
            'initial': 5442,
            'element': 'anyfunc'
        });

        var INITIAL_MEMORY = 16777216;
        var wasmMemory = new WebAssembly.Memory({
            'initial': INITIAL_MEMORY / 65536,
            'maximum': INITIAL_MEMORY / 65536,
            'shared': false
        });

        const info: WebAssembly.Imports = {
            'env': asmLibraryArg,
            'wasi_snapshot_preview1': asmLibraryArg,
            'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
            'GOT.func': new Proxy(asmLibraryArg, GOTHandler)
        };

        const mem: Record<string, Function | RelativeIndexable<number> | WebAssembly.Table | Fetch> = {
            'HEAP8': new Int8Array(wasmMemory.buffer),
            'HEAP16': new Int16Array(wasmMemory.buffer),
            'HEAP32': new Int32Array(wasmMemory.buffer),
            'HEAPU8': new Uint8Array(wasmMemory.buffer),
            'HEAPU16': new Uint16Array(wasmMemory.buffer),
            'HEAPU32': new Uint32Array(wasmMemory.buffer),
            'HEAPF32': new Float32Array(wasmMemory.buffer),
            'HEAPF64': new Float64Array(wasmMemory.buffer),
            'wasmTable': wasmTable
        }


        this._stringToUTF8 = stringToUTF8.bind(mem);

        mem["UTF8ToString"] = UTF8ToString.bind(mem);
        mem["stringToUTF8"] = this._stringToUTF8;
        mem["Fetch"] = new Fetch(mem);
        mem["fetchLoadCachedData"] = fetchLoadCachedData.bind(mem);
        mem["fetchXHR"] = fetchXHR.bind(mem);
        mem["callUserCallback"] = callUserCallback.bind(mem);

        info.env["emscripten_start_fetch"] = _emscripten_start_fetch.bind(mem);
        info.env["_emscripten_fetch_free"] = __emscripten_fetch_free.bind(mem);

        info.env["njInit"] = this.exports_with.njInit;
        info.env["njDecode"] = this.exports_with.njDecode;
        info.env["njGetImage"] = this.exports_with.njGetImage;
        info.env["njGetImageSize"] = this.exports_with.njGetImageSize;
        info.env["njGetWidth"] = this.exports_with.njGetWidth;
        info.env["njGetHeight"] = this.exports_with.njGetHeight;

        info.env["__indirect_function_table"] = wasmTable;
        info.env["memory"] = wasmMemory;

        return new Promise((resolve, reject) => {
            WebAssembly.instantiate(this.using_wasm_module, info).then((using_wasm) => {
                this.exports_using = using_wasm.exports;
                mem["_malloc"] = this.exports_using.stackAlloc;
                resolve(this);
            });
        });
    }

    stringToUTF8(str: string) : number {
        const len = (str.length << 2) + 1;
        const mem = this.exports_using.stackAlloc(len);
        this._stringToUTF8(str, mem, len);

        return mem;
    } 
}

export { Common }