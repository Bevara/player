import { memio } from "./core-player.js"
import { Fetch } from "./utils/fetch.js";


class buffer {
    buffer:ArrayBuffer;
    buffer_u8:Uint8Array;
    file_io:string;
    p:number = 0;
    nb_refs:number = 0;
    src:string;
    src_ptr:any;
    write : Boolean;

    constructor(src:string, src_ptr:any, write:Boolean) {
        this.src = src;
        this.src_ptr = src_ptr;
        this.write = write;
    }

    open(mode:string){
        switch(mode[0]){
            case "r":
                this.buffer_u8 = new Uint8Array(this.buffer);
                break;

            case "w":
                this.buffer_u8 = new Uint8Array(0);
                break;
        }
    }

    size(){
        return this.buffer_u8.length;
    }
}

class fileio{
    fetch_promises:Promise<Response>[]= new Array();
    buffer_promises:Promise<ArrayBuffer>[]= new Array();
    io_ctxs:buffer[]= new Array();
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


    constructor() {
        this.createIO();
    }

    createIO(){
        this.read = function (fileio, buffer, bytes) {
            const ioctx_id = this.module._gf_fileio_get_udta(fileio);
            const mem = this.io_ctxs[ioctx_id];

            //console.log("reading from "+mem.p+" to "+ (mem.p+bytes));
            let remaining = mem.buffer_u8.length - mem.p;
        
            if (bytes > remaining) {
                this.module.HEAPU8.set(mem.buffer_u8.slice(mem.p, mem.p + remaining), buffer);
                mem.p += remaining;
                return remaining;
            }
        
            this.module.HEAPU8.set(mem.buffer_u8.slice(mem.p, mem.p + bytes), buffer);
            mem.p += bytes;
            return bytes;
        }.bind(this);

        this.read.sig = ['i', 'i', 'i','i'];

        this.write = function (fileio, buffer, bytes) {
            const ioctx_id = this.module._gf_fileio_get_udta(fileio);
            const mem = this.io_ctxs[ioctx_id];

            //console.log("write from "+mem.p+" to "+ (mem.p+bytes));
            let remaining = mem.buffer_u8.length - mem.p;

            if (bytes > remaining) {
                let new_size = bytes + mem.buffer_u8.length - remaining;
                let old_buffer = mem.buffer_u8;
                mem.buffer_u8 = new Uint8Array(new_size);
                mem.buffer_u8.set(old_buffer);
            }
            
            mem.buffer_u8.set(this.module.HEAPU8.slice(buffer, buffer +bytes), mem.p);
            mem.p += bytes;
            return bytes;
        }.bind(this);
        this.write.sig = ['i', 'i', 'i','i'];

        this.seek = function (fileio, offset, whence) {
            const ioctx_id = this.module._gf_fileio_get_udta(fileio);
            const mem = this.io_ctxs[ioctx_id];

            //console.log("seek from "+offset+" with "+ whence);
            switch (whence) {
                case this.SEEK_SET:
                    mem.p = Number(offset);
                    break;
                case this.SEEK_CUR:
                    mem.p += Number(offset);
                    break;
                case this.SEEK_END:
                    mem.p = mem.buffer_u8.length + Number(offset);
                    break;
            }
            return 0;
        }.bind(this);
        this.seek.sig = ['i', 'i', 'j','i'];

        this.tell = function (fileio) {
            const ioctx_id = this.module._gf_fileio_get_udta(fileio);
            const mem = this.io_ctxs[ioctx_id];

            //console.log("tell : " + mem.p);
            return BigInt(mem.p);
        }.bind(this);
        this.tell.sig = ['j', 'i'];

        this.eof = function (fileio) {
            const ioctx_id = this.module._gf_fileio_get_udta(fileio);
            const mem = this.io_ctxs[ioctx_id];

            /*if(mem.p == mem.buffer_u8.length){
                console.log("eof  : true");
            }else{
                console.log("eof  : false");
            }*/
            
            return mem.p == mem.buffer_u8.length;
        }.bind(this);
        this.eof.sig = ['i', 'i'];

        this.printf = function (fileio, format, args) {
            console.log("printf  ");
            console.log("memio printf has to be implemented");
            return 0;
        }
        this.printf.sig = ['i','i','i', 'i'];
        
        this.open = function (fileio_ref, url_ptr, mode_ptr, out_err) {
            //console.log("open  ");

            const mode = this.module.UTF8ToString(mode_ptr);
            const url = this.module.UTF8ToString(url_ptr);
            const ioctx_id = this.module._gf_fileio_get_udta(fileio_ref);
            const cur_buffer = this.io_ctxs[ioctx_id];

            this.module.HEAP32[((out_err)>>2)] = 0; //GF_OK

            if (mode == "ref") {
                cur_buffer.nb_refs++;
                return fileio_ref;
            }

            if (mode == "unref") {
                if (!cur_buffer.nb_refs) return 0;
                cur_buffer.nb_refs--;
                if (cur_buffer.nb_refs)
                    return fileio_ref;
                this.module.HEAP8[url] = 0;
            }

            if (mode == "url") {
                if (!url_ptr) return 0;
                const path_ptr = this.module._gf_url_concatenate(cur_buffer.src_ptr, url_ptr);
                const path = this.module.UTF8ToString(path_ptr);

                let new_buffer = new buffer(path, path_ptr, cur_buffer.is_input);
                let buffer_idx = this.io_ctxs.push(new_buffer);

                const gfio = this.module._gf_fileio_new(path_ptr, buffer_idx - 1, 
                    this.open.value, 
                    this.seek.value, 
                    this.read.value, 
                    this.write.value, 
                    this.tell.value,
                    this.eof.value,
                    this.printf.value);
                
                return gfio;
            }

            if (mode == "probe") {
                if (!this.module._gf_file_exists(url_ptr)){
                    this.module.HEAP32[((out_err)>>2)] = -12; //GF_URL_ERROR
                }
                return 0;
            }

            if (!url_ptr) {
        
                if (!cur_buffer.nb_refs) {
                    this.io_ctxs.splice(ioctx_id,1);
                }
                return 0;
            }

            //file handle not opened, we can use the current gfio
            if (!cur_buffer.buffer_u8 && url.startsWith("gfio://") || url == cur_buffer.src ) {
                cur_buffer.open(mode);

                //in test mode we want to use our ftell and fseek wrappers
                if (mode[0] == 'r') {
                    this.module._gf_fileio_set_stats_u32(fileio_ref, cur_buffer.size(),cur_buffer.size(), 1, 0);         
                }
                return fileio_ref;
            }

            let gfio= null;
            let ioctx= null;
            let ioctx_idx= 0;
            let no_concatenate = false;
            let new_buffer = null;
            for (let i=0; i< this.io_ctxs.length; i++) {
                ioctx = this.io_ctxs[i];
                if (ioctx.src == url) {
                    if (ioctx.buffer_u8) {
                        no_concatenate = true;
                        ioctx = null;
                    }
                    ioctx_idx = i;
                    break;
                }
                ioctx = null;
            }

            if (!ioctx) {
                let path_ptr = null;
                if (url.startsWith("gfio://")) {
                    if (no_concatenate){
                        path_ptr = this.module._gf_strdup(url_ptr);
                    }
                    else{
                        path_ptr = this.module._gf_url_concatenate(cur_buffer.src_ptr, url_ptr);
                    }
                        
                } else {
                    path_ptr = this.module.gf_strdup(cur_buffer.src_ptr);
                }

                new_buffer = new buffer(url, path_ptr, cur_buffer.is_input);
                new_buffer.buffer = cur_buffer.buffer;
                new_buffer.open(mode);
                let buffer_idx = this.io_ctxs.push(new_buffer);
                gfio = this.module._gf_fileio_new(path_ptr, buffer_idx - 1, 
                    this.open.value, 
                    this.seek.value, 
                    this.read.value, 
                    this.write.value, 
                    this.tell.value,
                    this.eof.value,
                    this.printf.value);
                if (mode[0] == 'r') {
                    this.module._gf_fileio_set_stats_u32(fileio_ref, cur_buffer.size(),cur_buffer.size(), 1, 0);         
                }
            }

            return gfio;
        }.bind(this);
        this.open.sig = ['i','i','i','i', 'i'];
        memio.push(this.read, this.write, this.open, this.seek, this.tell,this.eof,this.printf, this.open)
    }

    make_fileio (src : string, is_input : Boolean){

        const len_source_str = (src.length << 2) + 1;
        const ptr_source_str = this.module.stackAlloc(len_source_str);
        this.module.stringToUTF8(src, ptr_source_str, len_source_str);

        let new_buffer = new buffer(src, ptr_source_str, is_input);
        let buffer_idx = this.io_ctxs.push(new_buffer);
    
        const fio = this.module._gf_fileio_new(ptr_source_str, buffer_idx - 1, 
            this.open.value, 
            this.seek.value, 
            this.read.value, 
            this.write.value, 
            this.tell.value,
            this.eof.value,
            this.printf.value);

        const fio_url_ptr = this.module._gf_fileio_url(fio);

        if (is_input){
            const fetch_promise = fetch(src);
            this.fetch_promises.push(fetch_promise);
            fetch_promise.then(response => {
                const buffer_promise = response.arrayBuffer();
                this.buffer_promises.push(buffer_promise);

                buffer_promise.then( buffer =>{
                    new_buffer.buffer = buffer;
                });
            })
        }

        new_buffer.file_io = this.module.UTF8ToString(fio_url_ptr);
        return new_buffer;
    }
}

export {fileio}
