import { asmLibraryArg, GOTHandler } from "./imports";
import { Common } from "./common"

class MainModule {

    mainModule: WebAssembly.Module;
    instance: WebAssembly.Instance;

    common: Common;

    entry: number;
    main_constructor: Function;

    constructor(mainModule: WebAssembly.Module, common: Common) {
        this.mainModule = mainModule;
        this.common = common;
    }

    init(): Promise<WebAssembly.Instance> {
        return new Promise((resolve, reject) => {
            const env: WebAssembly.ModuleImports = {
                "memory": this.common.wasmMemory,
                "__stack_pointer": this.common.stackPointer,
                "__memory_base": this.common.memory_base,
                "__table_base": this.common.table_base,
                "__indirect_function_table": this.common.wasmTable
            }



            const info = {
                'env': env,
                'wasi_snapshot_preview1': asmLibraryArg,
                'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
                'GOT.func': new Proxy(asmLibraryArg, GOTHandler)
            };

            WebAssembly.instantiate(this.mainModule, info).then().then(instance => {
                this.instance = instance;
                const stackAlloc = instance.exports.stackAlloc as Function;

                this.main_constructor = instance.exports.constructor as Function;
                resolve(instance);
            });
        });
    }
}


export { MainModule }