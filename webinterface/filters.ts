import {paquetsLibrary} from "./utils/paquets"

class Filters {
     filter : WebAssembly.Module;
     
     HEAPU8 : Uint8Array;


    constructor(filter: WebAssembly.Module){
        this.filter = filter;
    }

    init(): Promise<WebAssembly.Instance>{
        const info = {
            'env': paquetsLibrary
        };


        return WebAssembly.instantiate(this.filter, info);
    }

}

export{Filters}