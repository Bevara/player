(() => {
	const ENVIRONMENT_IS_WEB = typeof window == 'object';
	const ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	async function init(m) {
		const params = m.data.module?m.data.module:{};
		let args = [];

		params["locateFile"] = function (path, scriptDirectory) {
			if (path == "solver.wasm" && m.data.wasmBinaryFile) {
				return m.data.wasmBinaryFile;
			} 
			return path;
		};

		const module_parameters = m.data.module;
		if (m.data.print) {
			params["print"] = function () {
				return function (t) {
					postMessage({ print: t, ref: m.data.args});
				};
			}();
		}

		if (m.data.printErr) {
			params["printErr"] = function () {
				return function (t) {
					postMessage({ printErr: t, ref: m.data.args });
				};
			}();
		}

		let register_fns = [];
		params["gf_fs_reg_all"] = (fsess, a_sess)=> {
			const filters = register_fns.map(filter => module[filter](a_sess));
			filters.map(filter => module.ccall('gf_fs_add_filter_register',null,['number','number'],[fsess, filter]));
		};
		
		let on_done_resolve = null;
		let on_done_reject = null;

		params["gpac_done"] = (code)=> {
			if (code) console.log('(exit code ' + code +')');
			if(m.data.dst){
				const res = FS.readFile(m.data.dst, { encoding: "binary" });
				const blob = new Blob([res], { type: "application/octet-stream" });
				if (ENVIRONMENT_IS_WORKER) {
					postMessage({ blob: blob});
				} else if (ENVIRONMENT_IS_WEB){
					on_done_resolve(blob);
				}
		  	}
		};

		const module = await libgpac(params);
		const FS = module['FS'];
		 

		// Reframer and resampler
		register_fns.push("_reframer_register");
		register_fns.push("_resample_register");
		register_fns.push("_compositor_register");

		if(m.data.src){
			register_fns.push("_fin_register");
			const src = m.data.src;
			const response = await fetch(src);
			var fname = src.split('/').pop();
			const data = await response.arrayBuffer();
			FS.writeFile(fname, new Uint8Array(data));
			args.push("-i");
			args.push(fname);
		}

		if(m.data.transcode){
			args = args.concat(m.data.transcode);
		}

		
		if(m.data.dst){
			register_fns.push("_writegen_register");
			register_fns.push("_fout_register");
			args.push("-o");
			args.push(m.data.dst);
		}else{
			register_fns.push("_aout_register");
			register_fns.push("_vout_register");
			args.push("aout");
			args.push("vout");
		}

		if (m.data.useWebcodec){
			register_fns.push("_wcdec_register");
			register_fns.push("_wcenc_register");
			register_fns.push("_webgrab_register");	
		}

		register_fns = register_fns.concat(Object.keys(module).filter(x => x.startsWith("dynCall_") && x.endsWith("_register")));

		if (m.data.showStats){
			args.push("-stats");
		}

		if (m.data.showGraph){
			args.push("-graph");
		}

		if (m.data.showReport){
			args.push("-r");
		}

		function getProperty(props){
			const json_str = JSON.stringify(props);
			var res = module.ccall('get', // name of C function
			'string', // return type
			['number', 'string'], // argument types
			[entry, json_str]);
			return JSON.parse(res);
		}

		function setProperty(props){
			const json_str = JSON.stringify(props);
			var res = module.ccall('set', // name of C function
			'number', // return type
			['number', 'string'], // argument types
			[entry, json_str]);
			return JSON.parse(res);
		}
		const GPAC = {};
		
		//setProperty(args);
		function call_gpac() {
			GPAC.stack = module.stackSave();
			args.unshift("gpac");
			var argc = args.length;
			var argv = module.stackAlloc((argc + 1) * 4);
			var argv_ptr = argv >> 2;
			args.forEach(arg => {
				module.HEAP32[argv_ptr++] = module.allocateUTF8OnStack(arg);
			});
			module.HEAP32[argv_ptr] = 0;
			
			const gpac_em_sig_handler = module.cwrap('gpac_em_sig_handler', null, ['number']);
            gpac_em_sig_handler(4);
			try {
				module["_main"](argc, argv);
			} catch (e) {
			 //unwind thrown by emscripten main 
			 if (e != 'unwind') {
			 console.log(e);
			 }
			}          
		  };
		  call_gpac();

		if (ENVIRONMENT_IS_WEB) {
			return new Promise((resolve, reject) => {
				on_done_resolve = resolve;
				on_done_reject = reject;
			});
		}
	};


	if (ENVIRONMENT_IS_WORKER) {
		addEventListener("message", init);
	} else if (ENVIRONMENT_IS_WEB) {
		window.solver = init;
	}
})();