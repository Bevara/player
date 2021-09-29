class Module {
    GOT: any = {};

    constructor() {
        super();
    }


    isInternalSym(symName: string): boolean {
        // TODO: find a way to mark these in the binary or avoid exporting them.
        return [
            '__cpp_exception',
            '__wasm_apply_data_relocs',
            '__dso_handle',
            '__set_stack_limits'
        ].includes(symName)
            ;
    }

    updateGOT(exports: WebAssembly.Exports): void {
        for (var symName in exports) {
            if (this.isInternalSym(symName)) {
                continue;
            }

            var replace = false;
            var value = exports[symName];
            if (symName.startsWith('orig$')) {
                symName = symName.split('$')[1];
                replace = true;
            }

            if (!this.GOT[symName]) {
                this.GOT[symName] = new WebAssembly.Global({ 'value': 'i32', 'mutable': true });
            }
            if (replace || this.GOT[symName].value == 0) {
                if (typeof value === 'function') {
                    //this.GOT[symName].value = addFunctionWasm(value);
                } else if (typeof value === 'number') {
                    this.GOT[symName].value = value;
                } else {
                    err("unhandled export type for `" + symName + "`: " + (typeof value));
                }
            }
        }
    }

    relocateExports(exports: WebAssembly.Exports, memoryBase: number): WebAssembly.Exports {
        const relocated: WebAssembly.Exports = {};

        for (var e in exports) {
            var value: any = exports[e];
            if (typeof value === 'object') {
                // a breaking change in the wasm spec, globals are now objects
                // https://github.com/WebAssembly/mutable-global/issues/1
                value = value.value;
            }
            if (typeof value === 'number') {
                value += memoryBase;
            }
            relocated[e] = value;
        }
        this.updateGOT(relocated);
        return relocated;
    }

    receiveInstantiationResult(instance: WebAssembly.Instance, module: WebAssembly.Module): void {
        let exports = instance.exports;

        exports = this.relocateExports(exports, 1024);

        /*     var metadata = getDylinkMetadata(module);
             if (metadata.neededDynlibs) {
               dynamicLibraries = metadata.neededDynlibs.concat(dynamicLibraries);
             }
             mergeLibSymbols(exports, 'main')
         
             addOnInit(Module['asm']['__wasm_call_ctors']);
         
             removeRunDependency('wasm-instantiate');*/
    }
}

export { Module }