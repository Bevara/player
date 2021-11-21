//import {HEAPU8, asmLibraryArg, writeArrayToMemory, initRuntime, stackCheckInit, Module, wasmTable, wasmMemory, stringToUTF8, stackAlloc} from './player'
import { Common } from "./common"

class UniversalImage extends HTMLImageElement {
    using: string;
    common: Common;
    memory :Uint8Array;

    static test(entry: number) {
        let self = this as any;

        const get_json = self.common.stringToUTF8(JSON.stringify([
            "getImage", "getSize", "getWidth", "getHeight"
        ]));
        
        const json = self.common.exports_using.get(entry, get_json);
        const response = self.common.UTF8ToString(json);
        const json_parsed = JSON.parse(response);

        if (json_parsed.getImage ==0) return;

        const image = self.common.mem.HEAPU8.slice(json_parsed.getImage, json_parsed.getImage + json_parsed.getSize);

        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        var imageData = ctx.createImageData(json_parsed.getWidth, json_parsed.getHeight);
        canvas.setAttribute('width', json_parsed.getWidth);
        canvas.setAttribute('height', json_parsed.getHeight);
        const data = imageData.data;
        const len = data.length;
        var i = 0;
        var t = 0;

        for (; i < len; i += 4) {
            data[i] = image[t];
            data[i + 1] = image[t + 1];
            data[i + 2] = image[t + 2];
            data[i + 3] = 255;

            t += 3;
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(function (blob) {
            self.srcset = URL.createObjectURL(blob);
        })
    }
    

    connectedCallback() {
        let self = this;

        let downloads: { [key: string]: Promise<Response> } = {};

        function flushImage(responses: Response[]): void {
            const img_response = responses[promises.indexOf(downloads["src"])];
            const using_response = responses[promises.indexOf(downloads["using"])];
            const with_response = responses[promises.indexOf(downloads["with"])];

            self.common = new Common();

            let blobs: [Promise<ArrayBuffer>,
                Promise<WebAssembly.Module>,
                Promise<WebAssembly.Module>] = [img_response.arrayBuffer(),
                WebAssembly.compileStreaming(using_response),
                WebAssembly.compileStreaming(with_response)];
            Promise.all(blobs).then(async (result) => {
                const img_array = result[0];

                await self.common.init(result[1], result[2]);
/*
                const ret = self.common.exports_using.stackAlloc(img_array.byteLength);
                const mem = self.common.mem.HEAPU8 as Uint8Array;
                mem.set(new Uint8Array(img_array), ret);*/


                //self.memory = new Uint8Array(self.common.exports_with.memory.buffer);
                //self.memory.set(new Uint8Array(img_array), ret);

                const entry = self.common.exports_using.constructor();

                const args: Record<string, string | number> = {};
                for (var i = 0, atts = self.attributes, n = atts.length, arr = []; i < n; i++) {
                    args[atts[i].nodeName] = atts[i].nodeValue;
                }

                const bind_test = UniversalImage.test.bind(self);
                const C_pointer = self.common.addToTable(bind_test, 'vi');

                args["downloadCallback"] = C_pointer;

                const ret2 = self.common.stringToUTF8(JSON.stringify(args));

                self.common.exports_using.set(entry, ret2);
            });
        }

        for (var i = 0, atts = self.attributes, n = atts.length, arr = []; i < n; i++) {
            const nodeName = atts[i].nodeName;
            switch (nodeName) {
                case 'using':
                case 'src':
                case 'with':
                    downloads[nodeName] = fetch(atts[i].nodeValue);
                    break;
            }
        }

        let promises: Promise<Response>[] = Object.values(downloads);

        Promise.all(promises).then(flushImage);
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                break;
            case 'with':
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with']; }
}

export { UniversalImage }