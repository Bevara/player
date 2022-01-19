import { memio } from "./simple-img.js"

class fileio{
    src:string;
    buffer:Uint8Array;
    p:number = 0;
    module:any;
    read:any;
    write:any;
    seek:any;
    tell:any;
    eof:any;
    printf:any;
    open:any;
    readonly SEEK_SET = 0;
    readonly SEEK_CUR = 1;
    readonly SEEK_END = 2;

    constructor(src:string) {
        this.src = src;
        this.createIO();
    }

    createIO(){
        this.read = function (fileio, buffer, bytes) {
            let remaining = this.buffer.length - this.p;
        
            if (bytes > remaining) {
                this.module.HEAPU8.set(this.buffer.slice(this.p, this.p + remaining), buffer);
                this.p += remaining;
                return remaining;
            }
        
            this.module.HEAPU8.set(this.buffer.slice(this.p, this.p + bytes), buffer);
            this.p += bytes;
            console.log("numBytes: " + this.buffer.length + ", bytes: " + bytes + ", remaining =" + remaining);
            return bytes;
        }.bind(this);

        this.read.sig = ['i', 'i', 'i','i'];

        this.write = function (fileio, buffer, bytes) {
    
        }
        this.write.sig = ['i', 'i', 'i','i'];

        this.seek = function (fileio, offset, whence) {
            switch (whence) {
                case this.SEEK_SET:
                case this.SEEK_CUR:
                    this.p += Number(offset);
                    break;
                case this.SEEK_END:
                    this.p = this.buffer.length + Number(offset);
                    break;
            }
            return 0;
        }.bind(this);
        this.seek.sig = ['i', 'i', 'j','i'];

        this.tell = function (fileio) {
            return BigInt(this.p);
        }.bind(this);
        this.tell.sig = ['j', 'i'];

        this.eof = function (fileio) {
            return this.p == this.buffer.length;
        }.bind(this);
        this.eof.sig = ['i', 'i'];

        this.printf = function (fileio, format, args) {
            console.log("memio printf has to be implemented");
            return 0;
        }
        this.printf.sig = ['i','i','i', 'i'];
        
        this.open = function (fileio_ref, url, mode, out_err) {
            this.module._gf_fileio_set_stats_u32(fileio_ref, this.buffer.length,this.buffer.length, 1, 0);
            this.module.HEAP32[((out_err)>>2)] = 0; //GF_OK
            return fileio_ref;
        }.bind(this);
        this.open.sig = ['i','i','i','i', 'i'];
        memio.push(this.read, this.write, this.open, this.seek, this.tell,this.eof,this.printf, this.open)
    }

    make_fileio (){
        const len_source_str = (this.src.length << 2) + 1;
        const ptr_source_str = this.module.stackAlloc(len_source_str);
        this.module.stringToUTF8(this.src, ptr_source_str, len_source_str);
    
        const fio = this.module._gf_fileio_new(ptr_source_str, 0, 
            this.open.value, 
            this.seek.value, 
            this.read.value, 
            this.write.value, 
            this.tell.value,
            this.eof.value,
            this.printf.value);

        const fio_url_ptr = this.module._gf_fileio_url(fio);
        return this.module.UTF8ToString(fio_url_ptr);
    }
}

export {fileio}
