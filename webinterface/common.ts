import { asmLibraryArg, GOTHandler } from "./imports";
import { UTF8ToString, stringToUTF8 } from "./utils/text"
import { Fetch, fetchLoadCachedData, fetchXHR } from "./utils/fetch"
import { callUserCallback } from "./utils/functions"

import { _emscripten_start_fetch } from "./imports/_emscripten_start_fetch";
import { __emscripten_fetch_free } from "./imports/__emscripten_fetch_free";

import {convertJsFunctionToWasm} from "./utils/functions";

import {memcpy,malloc,memset,free} from "./utils/memory"
import {Filters} from "./filters"

type Common_mem = Record<string, Function | RelativeIndexable<number> | WebAssembly.Table | Fetch>

class Common {
    exports_using: any;
    _stringToUTF8: any;
    _UTF8ToString: any;
    wasmTable :WebAssembly.Table;
    wasmMemory:WebAssembly.Memory;

    using_wasm_module: WebAssembly.Module;

    mem : Common_mem;
    info : WebAssembly.Imports;
    filters: Filters;

    constructor() {
        this.wasmTable = new WebAssembly.Table({
            'initial': 5442,
            'element': 'anyfunc'
        });

        var INITIAL_MEMORY = 16777216;
        this.wasmMemory = new WebAssembly.Memory({
            'initial': INITIAL_MEMORY / 65536,
            'maximum': INITIAL_MEMORY / 65536,
            'shared': false
        });
        this.info = {
            'env': asmLibraryArg,
            'wasi_snapshot_preview1': asmLibraryArg,
            'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
            'GOT.func': new Proxy(asmLibraryArg, GOTHandler)
        };

        this.mem = {
            'HEAP8': new Int8Array(this.wasmMemory.buffer),
            'HEAP16': new Int16Array(this.wasmMemory.buffer),
            'HEAP32': new Int32Array(this.wasmMemory.buffer),
            'HEAPU8': new Uint8Array(this.wasmMemory.buffer),
            'HEAPU16': new Uint16Array(this.wasmMemory.buffer),
            'HEAPU32': new Uint32Array(this.wasmMemory.buffer),
            'HEAPF32': new Float32Array(this.wasmMemory.buffer),
            'HEAPF64': new Float64Array(this.wasmMemory.buffer),
            'wasmTable': this.wasmTable
        }

                
        this._stringToUTF8 = stringToUTF8.bind(this.mem);
        this._UTF8ToString = UTF8ToString.bind(this.mem);
        
        this.mem["stringToUTF8"] = this._stringToUTF8;
        this.mem["UTF8ToString"] = this._UTF8ToString;

        this.mem["fetchLoadCachedData"] = fetchLoadCachedData.bind(this.mem);
        this.mem["fetchXHR"] = fetchXHR.bind(this.mem);
        this.mem["callUserCallback"] = callUserCallback.bind(this.mem);

        this.info.env["emscripten_start_fetch"] = _emscripten_start_fetch.bind(this.mem);
        this.info.env["_emscripten_fetch_free"] = __emscripten_fetch_free.bind(this.mem);

        /*this.info.env["memcpy"] = memcpy.bind(this);
        this.info.env["malloc"] = malloc.bind(this);
        this.info.env["memset"] = memset.bind(this);
        this.info.env["free"] = free.bind(this);*/

        this.info.env["__indirect_function_table"] = this.wasmTable;
        this.info.env["memory"] = this.wasmMemory;
    }

    init(using_wasm_module: WebAssembly.Module, with_wasm: WebAssembly.Module) {
        let that = this;
        
        this.filters = new Filters(with_wasm);
        this.using_wasm_module = using_wasm_module;
   

        let compile_promise = this.compileModule(this.using_wasm_module, this.info, this.mem);
        let filters_promise = this.filters.init();

        let fetch_promise = new Fetch(this.mem).init();

        return new Promise((resolve, reject) => {
            Promise.all([fetch_promise, compile_promise, filters_promise]).then((values) => {
                that.mem["Fetch"] = values[0] as Fetch;
                resolve(this);
              });
        });

    }

    compileModule(module : WebAssembly.Module, info : WebAssembly.Imports, mem : Common_mem):Promise<WebAssembly.Instance>{
        let that = this;
        
        return new Promise((resolve, reject) => {
            WebAssembly.instantiate(module, info).then((using_wasm) => {
                this.exports_using = using_wasm.exports;
                mem["_malloc"] = this.exports_using.stackAlloc;
                resolve(using_wasm);
            });
        });
    }

    stringToUTF8(str: string) : number {
        const len = (str.length << 2) + 1;
        const mem = this.exports_using.stackAlloc(len);
        this._stringToUTF8(str, mem, len);

        return mem;
    }
    
    UTF8ToString(pointer: number) : string {
        return this._UTF8ToString(pointer);
    }

    addToTable(jsFunction:any, signature:string) : number {
        const index = this.wasmTable.length;
        this.wasmTable.grow(1);
        this.wasmTable.set(index,
        convertJsFunctionToWasm(jsFunction, signature));
        return index;
    }

}

export { Common }