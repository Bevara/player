

import { info, wasmMemory } from "./imports";
import {stringToUTF8Array, UTF8ArrayToString} from "./utils/strings";
//import { err } from "./outputs";
//import { receiveInstantiationResult } from "./imports/receiveInstantiationResult";
//import { instantiateArrayBuffer } from "./imports/instantiateArrayBuffer";


class UniversalImage extends HTMLImageElement {
    
    HEAP : number = null;
    buffer : ArrayBuffer = null;
    HEAP8 : Int8Array = null;
    HEAPU8 : Uint8Array = null;
    HEAP16 : Int16Array = null;
    HEAPU16 : Uint16Array = null;
    HEAP32 : Int32Array = null;
    HEAPU32 : Uint32Array = null;
    HEAPF32 : Float32Array = null;
    HEAPF64 : Float64Array = null;
    decoder: number = null;

    updateGlobalBufferAndViews(buf: ArrayBuffer) : void {
        this.buffer = buf;
        this.HEAP8 = new Int8Array(buf);
        this.HEAP16 = new Int16Array(buf);
        this.HEAP32 = new Int32Array(buf);
        this.HEAPU8 = new Uint8Array(buf);
        this.HEAPU16 = new Uint16Array(buf);
        this.HEAPU32 = new Uint32Array(buf);
        this.HEAPF32 = new Float32Array(buf);
        this.HEAPF64 = new Float64Array(buf);
      }

    loadDecoder(src: string): void {
        let self = this;
        console.log("loading decoder");
        fetch(src).then(function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then((result) => {
                const exports :any = result.instance.exports;
                const json = "{}";
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
        this.updateGlobalBufferAndViews(wasmMemory.buffer);
    }

    disconnectedCallback() {
        console.log('Img has been removed from page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(name+ ":" +oldValue + "->"+newValue);
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                this.loadDecoder(newValue);
                break;
            case 'with':
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

customElements.define('universal-img', UniversalImage, { extends: 'img' });