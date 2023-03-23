addEventListener("message", async m => {
	var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	if (!ENVIRONMENT_IS_WORKER){
		//Filter messages since multiple universal tag can work at the same time
		if (!m.data.tag || !m.data.tag.using || !m.data.tag.using.endsWith("core-audio")) {
			return;
		};
	}


	class buffer {
		buffer;
		buffer_u8;
		file_io;
		p = 0;
		nb_refs = 0;
		src;
		src_ptr;
		write;
	
		constructor(src, src_ptr, write) {
			this.src = src;
			this.src_ptr = src_ptr;
			this.write = write;
		}
	
		open(mode) {
			switch (mode[0]) {
				case "r":
					this.buffer_u8 = new Uint8Array(this.buffer);
					break;
	
				case "w":
					this.buffer_u8 = new Uint8Array(0);
					break;
			}
		}
	
		size() {
			return this.buffer_u8.length;
		}
	
		get HEAPU8() {
			return this.buffer_u8 ? new Uint8Array(this.buffer_u8.buffer) : new Uint8Array();
		}
	
		get HEAP32() {
			return this.buffer_u8 ? new Int32Array(this.buffer_u8.buffer) : new Int32Array();
		}
	
	}
	
	class fileio {
		io_ctxs = {};
		io_ctxs_idx = 0;
		module;
		read;
		write;
		seek;
		tell;
		eof;
		printf;
		open;
	
	
		in_url;
		out_url;
		_with_attribute = [];
	
		buffer_in;
	
		SEEK_SET = 0;
		SEEK_CUR = 1;
		SEEK_END = 2;
	
		print;
		print_progress;
	
		constructor(in_url, in_buffer, out_url, module, print, print_progress) {
			this.in_url = in_url;
			this.in_buffer = in_buffer;
			this.out_url = out_url;
			this.module = module;
			this.print = print;
			this.print_progress = print_progress;
			this.createIO();
		}
	
		createIO() {
			this.read = function (fileio, buffer, bytes) {
				const ioctx_id = this.module._gf_fileio_get_udta(fileio);
				const mem = this.io_ctxs[ioctx_id];
				if (this.print_progress) {
					this.print("Reading from " + mem.p + " to " + (mem.p + bytes) + " of " + mem.buffer_u8.length + " bytes in total.");
				}
	
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
	
			this.read.sig = ['i', 'i', 'i', 'i'];
			this.read.value = this.module.addFunction(this.read, this.read.sig);
	
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
	
				if (this.print_progress) {
					this.print("Writing from " + mem.p + " to " + (mem.p + bytes) + " of " + mem.buffer_u8.length + " bytes in total.");
				}
	
				mem.buffer_u8.set(this.module.HEAPU8.slice(buffer, buffer + bytes), mem.p);
				mem.p += bytes;
				return bytes;
			}.bind(this);
			this.write.sig = ['i', 'i', 'i', 'i'];
			this.write.value = this.module.addFunction(this.write, this.write.sig);
	
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
			this.seek.sig = ['i', 'i', 'j', 'i'];
			this.seek.value = this.module.addFunction(this.seek, this.seek.sig);
	
			this.tell = function (fileio) {
				const ioctx_id = this.module._gf_fileio_get_udta(fileio);
				const mem = this.io_ctxs[ioctx_id];
	
				//console.log("tell : " + mem.p);
				return BigInt(mem.p);
			}.bind(this);
			this.tell.sig = ['j', 'i'];
			this.tell.value = this.module.addFunction(this.tell, this.tell.sig);
	
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
			this.eof.value = this.module.addFunction(this.eof, this.eof.sig);
	
			this.printf = function (fileio, format, args) {
				console.log("printf  ");
				console.log("memio printf has to be implemented");
				return 0;
			}
			this.printf.sig = ['i', 'i', 'i', 'i'];
			this.printf.value = this.module.addFunction(this.printf, this.printf.sig);
	
			this.open = function (fileio_ref, url_ptr, mode_ptr, out_err) {
				//console.log("open  ");
	
				const mode = this.module.UTF8ToString(mode_ptr);
				const url = this.module.UTF8ToString(url_ptr);
				const ioctx_id = this.module._gf_fileio_get_udta(fileio_ref);
				const cur_buffer = this.io_ctxs[ioctx_id];
	
				this.module.HEAP32[((out_err) >> 2)] = 0; //GF_OK
	
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
					this.io_ctxs[this.io_ctxs_idx++] = new_buffer;
	
					const gfio = this.module._gf_fileio_new(path_ptr, this.io_ctxs_idx - 1,
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
					if (!this.module._gf_file_exists(url_ptr)) {
						this.module.HEAP32[((out_err) >> 2)] = -12; //GF_URL_ERROR
					}
					return 0;
				}
	
				if (!url_ptr) {
	
					if (!cur_buffer.nb_refs) {
						//delete this.io_ctxs[ioctx_id]; FIXME
					}
					return 0;
				}
	
				//file handle not opened, we can use the current gfio
				if (!cur_buffer.buffer_u8 && url.startsWith("gfio://") || url == cur_buffer.src) {
					cur_buffer.open(mode);
	
					//in test mode we want to use our ftell and fseek wrappers
					if (mode[0] == 'r') {
						this.module._gf_fileio_set_stats_u32(fileio_ref, cur_buffer.size(), cur_buffer.size(), 1, 0);
					}
					return fileio_ref;
				}
	
				let gfio = null;
				let ioctx = null;
				let ioctx_idx = 0;
				let no_concatenate = false;
				let new_buffer = null;
				for (let i = 0; i < this.io_ctxs.length; i++) {
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
						if (no_concatenate) {
							path_ptr = this.module._gf_strdup(url_ptr);
						}
						else {
							path_ptr = this.module._gf_url_concatenate(cur_buffer.src_ptr, url_ptr);
						}
	
					} else {
						path_ptr = this.module.gf_strdup(cur_buffer.src_ptr);
					}
	
					new_buffer = new buffer(url, path_ptr, cur_buffer.is_input);
					new_buffer.buffer = cur_buffer.buffer;
					new_buffer.open(mode);
					this.io_ctxs[this.io_ctxs_idx++] = new_buffer;
					gfio = this.module._gf_fileio_new(path_ptr, this.io_ctxs_idx - 1,
						this.open.value,
						this.seek.value,
						this.read.value,
						this.write.value,
						this.tell.value,
						this.eof.value,
						this.printf.value);
					if (mode[0] == 'r') {
						this.module._gf_fileio_set_stats_u32(fileio_ref, cur_buffer.size(), cur_buffer.size(), 1, 0);
					}
				}
	
				return gfio;
			}.bind(this);
			this.open.sig = ['i', 'i', 'i', 'i', 'i'];
			this.open.value = this.module.addFunction(this.open, this.open.sig);
		}
	
		get fileio_in() {
			const len_source_str = (this.in_url.length << 2) + 1;
			const ptr_source_str = this.module.stackAlloc(len_source_str);
			this.module.stringToUTF8(this.in_url, ptr_source_str, len_source_str);
	
			const new_buffer = new buffer(this.in_url, ptr_source_str, true);
			this.io_ctxs[this.io_ctxs_idx++] = new_buffer;
	
			const fio = this.module._gf_fileio_new(ptr_source_str, this.io_ctxs_idx - 1,
				this.open.value,
				this.seek.value,
				this.read.value,
				this.write.value,
				this.tell.value,
				this.eof.value,
				this.printf.value);
	
			const fio_url_ptr = this.module._gf_fileio_url(fio);
	
			new_buffer.buffer = this.in_buffer;
			new_buffer.file_io = this.module.UTF8ToString(fio_url_ptr);
	
			return new_buffer;
		}
	
		get with_attribute() {
			return this._with_attribute;
		}
	
		get fileio_out() {
			const len_source_str = (this.out_url.length << 2) + 1;
			const ptr_source_str = this.module.stackAlloc(len_source_str);
			this.module.stringToUTF8(this.out_url, ptr_source_str, len_source_str);
	
			const new_buffer = new buffer(this.out_url, ptr_source_str, false);
			this.io_ctxs[this.io_ctxs_idx++] = new_buffer;
	
			const fio = this.module._gf_fileio_new(ptr_source_str, this.io_ctxs_idx - 1,
				this.open.value,
				this.seek.value,
				this.read.value,
				this.write.value,
				this.tell.value,
				this.eof.value,
				this.printf.value);
	
			const fio_url_ptr = this.module._gf_fileio_url(fio);
			new_buffer.file_io = this.module.UTF8ToString(fio_url_ptr);
	
			return new_buffer;
		}
	}

	m.data.tag.module["locateFile"] = function (path, scriptDirectory) {
		if (path.startsWith("blob")){
			return path;
		}else if(path == "core-audio.wasm" && m.data.tag.core){
			return m.data.tag.core;
		}
		return scriptDirectory + path;
	};

	const module = await Module(m.data.tag.module);

	if (!m.data.tag.in){
		postMessage({core:{ ref: m.data.tag.ref}});
	}

	const io = new fileio(m.data.tag.in.src, m.data.tag.in.buffer, "out." + m.data.tag.out, module);
	const entry = module._constructor();
	const buffer_in = io.fileio_in;
	const buffer_out = io.fileio_out;
	const register_fns = Object.keys(module).filter(x => x.endsWith("_register"));

	const args = m.data.tag.args? m.data.tag.args : {};
	const props = m.data.tag.props? m.data.tag.props : [];

	args["io_in"] = buffer_in.file_io;
	args["io_out"] = buffer_out.file_io;
	args["filters"] = register_fns.map(entry => module[entry](0));

	// Convert json to string buffer
	const json_args = JSON.stringify(args);
	const len_args = (json_args.length << 2) + 1;
	const ptr_args = module.stackAlloc(len_args);
	module.stringToUTF8(json_args, ptr_args, len_args);
	module._set(entry, ptr_args);

	const get_args = JSON.stringify(props);
	const get_args_len = (get_args.length << 2) + 1;
	const ptr_get_args = module.stackAlloc(get_args_len);
	module.stringToUTF8(get_args, ptr_get_args, get_args_len);

	const ptr_data = module._get(entry, ptr_get_args);
	const json_res = module.UTF8ToString(ptr_data);
	const json_res_parsed = JSON.parse(json_res);
	
	postMessage({ core:{blob: new Blob([buffer_out.HEAPU8], { type: m.data.tag.type }), ref: m.data.tag.ref }});
});