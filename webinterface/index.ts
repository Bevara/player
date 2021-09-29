

import { info } from "./imports";
//import { err } from "./outputs";
//import { receiveInstantiationResult } from "./imports/receiveInstantiationResult";
//import { instantiateArrayBuffer } from "./imports/instantiateArrayBuffer";


class UniversalImage extends HTMLImageElement {
    loadDecoder(src: string): void {
        let self = this;
        console.log("loading decoder");
        fetch(src).then(function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then((result) => {
                const exports :any = result.instance.exports;
                const value = exports.setup_acc(17);
                console.log(value);
            });
        })
    }

    connectedCallback(): void {

    }

    disconnectedCallback() {
        console.log('Img has been removed from page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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