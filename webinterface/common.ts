import { asmLibraryArg, GOTHandler } from "./imports";
import { stringToUTF8Array, UTF8ArrayToString } from "./utils/text"
import { Fetch, fetchLoadCachedData, fetchXHR } from "./utils/fetch"
import { callUserCallback } from "./utils/functions"

import { _emscripten_start_fetch } from "./imports/_emscripten_start_fetch";
import { __emscripten_fetch_free } from "./imports/__emscripten_fetch_free";

import {convertJsFunctionToWasm} from "./utils/functions";

import {memcpy,malloc,memset,free} from "./utils/memory"
import {Filters} from "./filters"
import {MainModule} from "./main"

type Common_mem = Record<string, Function |             
Int8Array |
Int16Array |
Int32Array |
Uint8Array |
Uint16Array |
Uint32Array |
Float32Array |
Float64Array|
WebAssembly.Table | Fetch>

class Common {
    exports_using: any;
    _UTF8ToString: any;
    wasmTable :WebAssembly.Table;
    wasmMemory:WebAssembly.Memory;
    img : Uint8Array;

    HEAPU8 : Uint8Array;
    HEAPU32 : Uint32Array;
    HEAP32 : Int32Array;

    using_wasm_module: WebAssembly.Module;

    mem : Common_mem;
    info : WebAssembly.Imports;


    filters: Filters;
    mainModule: MainModule;

    stackPointer: WebAssembly.Global;
    memory_base: number;
    table_base: number;
    

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
        this.stackPointer = new WebAssembly.Global({value:'i32', mutable:true}, 5515136);
        this.table_base = 1;
        this.memory_base = 1024;
        this.wasmTable = new WebAssembly.Table({
            'initial': 5442,
            'element': 'anyfunc'
        });

        this.HEAPU8 = new Uint8Array(this.wasmMemory.buffer);
        this.HEAPU32 = new Uint32Array(this.wasmMemory.buffer);
        this.HEAP32 = new Int32Array(this.wasmMemory.buffer);

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

    init(using_wasm_module: WebAssembly.Module, with_wasm: WebAssembly.Module, img : ArrayBuffer) {
        let that = this;
        
        this.filters = new Filters(with_wasm, this);
        this.mainModule = new MainModule(using_wasm_module, this);
        this.img = new Uint8Array(img);

        this.using_wasm_module = using_wasm_module;
   

        //let compile_promise = this.compileModule(this.using_wasm_module, this.info, this.mem);
        
        let main_promise = this.mainModule.init();
        let filters_promise = this.filters.init(main_promise);
        

        let fetch_promise = new Fetch(this.mem).init();

        return new Promise((resolve, reject) => {
            Promise.all([filters_promise]).then((values) => {
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

        const malloc = this.mainModule.instance.exports.malloc as Function;

        const len = (str.length << 2) + 1;
        const ptr = malloc(len);
        stringToUTF8Array(str, this.HEAPU8, ptr, len);;

        return ptr;
    }
    
    UTF8ToString(ptr: number) : string {
        return ptr ? UTF8ArrayToString(this.HEAPU8, ptr) : '';
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