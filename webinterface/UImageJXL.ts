import { JxlCodecModule } from "./jxl-decoder.js";

//declare var JxlCodecModule;

const config = {
    useCache: false,
    imageType: 'jpeg' // jpeg/png/webp
  };


class UniversalImageJXL extends HTMLImageElement {
   
    dataURLToSrc(img, dataURL) {
        img.src = dataURL;
    }

    imgDataToDataURL(img, imgData) {
        const jxlSrc = img.dataset.jxlSrc;
        if (imgData instanceof Blob) {
            img.dataURLToSrc(img, URL.createObjectURL(imgData));
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = imgData.width;
            canvas.height = imgData.height;
            canvas.getContext('2d').putImageData(imgData, 0, 0);
            canvas.toBlob(blob => {
                img.dataURLToSrc(img, URL.createObjectURL(blob));
            }, 'image/' + config.imageType);
        }
    }

    async process(res, img) {
        let module, decoder, buffer, reader, timer;
        //const bufferSize = 256 * 1024;
        const buffer_in = await res.arrayBuffer();
        const buffer_u8 = new Uint8Array(buffer_in);
        const bufferSize = buffer_u8.length;
        
        /*function readChunk() {
            reader.read().then(onChunk, onError);
        }*/

        function onChunk(chunk) {
            if (chunk.done) {
                onFinish();
                return;
            }
            let offset = 0;
            while (offset < chunk.length) {
                let delta = chunk.length - offset;
                if (delta > bufferSize)
                    delta = bufferSize;
                module.HEAP8.set(chunk.slice(offset, offset + delta), buffer);
                offset += delta;
                if (!processChunk(delta))
                    onError('Processing error');
            }
            //setTimeout(readChunk, 0);
        }

        function processChunk(chunkLen) {
            const result = processInput(chunkLen);
            if (result.error)
                return false;
            if (result.wantFlush)
                module._jxlFlush(decoder);
            if (result.copyPixels) {
                let width = module.HEAP32[decoder >> 2];
                let height = module.HEAP32[(decoder + 4) >> 2];
                let start = module.HEAP32[(decoder + 8) >> 2];
                let end = start + width * height * 4;
                let src = new Uint8Array(module.HEAP8.buffer);
                let imgData = new ImageData(new Uint8ClampedArray(src.slice(start, end)), width, height);
                img.imgDataToDataURL(img, imgData);
            }
            return true;
        }

        function processInput(chunkLen) {
            const response = {
                error: false,
                wantFlush: false,
                copyPixels: false
            };
            timer = timer || performance.now();
            let result = module._jxlProcessInput(decoder, buffer, chunkLen);
            if (result === 2) {
                // More input needed
            } else if (result === 1) {
                response.wantFlush = true;
                response.copyPixels = true;
            } else if (result === 0) {
                console.log('Finished decoding', img.dataset.jxlSrc, 'in', performance.now() - timer, 'ms');
                response.wantFlush = false;
                response.copyPixels = true;
            } else {
                response.error = true;
            }
            return response;
        }

        function onError(data) {
            console.error(data);
            onFinish();
        }

        function onFinish() {
            if (module) {
                module._jxlDestroyInstance(decoder);
                module._free(buffer);
            }
            module = decoder = buffer = undefined;
        }

        module = await JxlCodecModule();
        decoder = module._jxlCreateInstance(true, 100);
        if (decoder < 4)
            return onError('Cannot create decoder');
          
        buffer = module._malloc(bufferSize);
        //reader = res.body.getReader();
        onChunk(buffer_u8);
    }

    async connectedCallback() {
        const res = await fetch(this.src);
        this.process(res, this);
    }


    disconnectedCallback() {
        console.log("disconnect");
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            /*case 'src':
                break;
            case 'using':
                this.using_attribute = this.getAttribute("using");
                break;
            case 'with':
                this.with_attribute = this.getAttribute("with").split(';');
                break;
            case 'print':
                this.print_attribute = document.querySelector(this.getAttribute("print"));
                break;
            case 'printerr':
                this.error_attribute = document.querySelector(this.getAttribute("printerr"));
                break;
            case 'out':
                this.out = this.getAttribute("out");
                break;*/
            default:
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out']; }
}

if (!customElements.get('universal-jxl')) {
    customElements.define('universal-jxl', UniversalImageJXL, { extends: 'img' });
}

export { UniversalImageJXL };