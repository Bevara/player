import {
    gf_filter_get_udta,
    gf_filter_pid_get_packet,
    gf_filter_pck_get_data,
    gf_filter_pid_set_property,
    gf_filter_pck_new_alloc,
    gf_filter_pck_send
} from "./utils/paquets"

import { Common } from "./common"

class Filters {
    filter: WebAssembly.Module;
    common: Common;

    instance: WebAssembly.Instance;

    stackPointer:WebAssembly.Global;
    wasmTable :WebAssembly.Table;
    wasmMemory:WebAssembly.Memory;
    table_base: number;
    memory_base: number;

    constructor(filter: WebAssembly.Module, common: Common) {
        this.filter = filter;
        this.common = common;
        this.stackPointer = new WebAssembly.Global({value:'i32', mutable:true}, 5515136);
        this.table_base = 1;
        this.memory_base = 1024;
        this.wasmTable = new WebAssembly.Table({
            'initial': 5442,
            'element': 'anyfunc'
        });
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
    }

    init(main: Promise<WebAssembly.Instance>): Promise<WebAssembly.Instance> {
        return new Promise((resolve, reject) => {
            Promise.all([main]).then((main) => {
                const main_instance = main[0];

                const env: WebAssembly.ModuleImports = {
                    "memory": this.wasmMemory,
                    "__stack_pointer": this.common.stackPointer,
                    "__memory_base": this.common.memory_base,
                    "__table_base": this.common.table_base,
                    "__indirect_function_table": this.common.wasmTable,
                    "gf_filter_get_udta": gf_filter_get_udta.bind(this.common),
                    "gf_filter_pid_get_packet": gf_filter_pid_get_packet.bind(this.common),
                    "gf_filter_pck_get_data": gf_filter_pck_get_data.bind(this.common),
                    "gf_filter_pid_set_property": gf_filter_pid_set_property.bind(this.common),
                    "gf_filter_pck_new_alloc": gf_filter_pck_new_alloc.bind(this.common),
                    "gf_filter_pck_send": gf_filter_pck_send.bind(this.common),
                    "memcpy": main_instance.exports.memcpy,
                    "memset": main_instance.exports.memset,
                    "free": main_instance.exports.free,
                    "malloc": main_instance.exports.malloc
                }
                const info = {
                    'env': env
                };

                WebAssembly.instantiate(this.filter, info).then(instance => {
                    this.instance = instance;
                    resolve(instance);
                }
                )

            });
        });
    }

}

export { Filters }