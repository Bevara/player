(() => {
	const ENVIRONMENT_IS_WEB = typeof window == 'object';
	const ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	let module = null;

	let statusElement = null;
	let graphElement = null;
	let reportElement = null;
	let statsElement = null;

	function get_properties(props) {
		const json_str = JSON.stringify(props);
		var res = module.ccall('get_properties', // name of C function
			'string', // return type
			['string'], // argument types
			[json_str]);
		return JSON.parse(res);
	}

	function get_property(prop) {
		return module.ccall('get_property', // name of C function
			'string', // return type
			['string'], // argument types
			[prop]);
	}

	function set_properties(props) {
		const json_str = JSON.stringify(props);
		var res = module.ccall('set_properties', // name of C function
			'string', // return type
			['string'], // argument types
			[json_str]);
		return JSON.parse(res);
	}

	async function init(m) {
		const params = m.data.module ? m.data.module : {};
		let args = [];

		params["locateFile"] = function (path, scriptDirectory) {
			if (path == "solver_1.wasm" && m.data.wasmBinaryFile) {
				return m.data.wasmBinaryFile;
			}
			return path;
		};

		const module_parameters = m.data.module;
		if (m.data.print) {
			params["print"] = function () {
				if (ENVIRONMENT_IS_WORKER) {
					return function (t) {
						postMessage({ print: t, ref: m.data.args });
					};
				} else if (ENVIRONMENT_IS_WEB) {
					var element = document.getElementById(m.data.print);
					if (element) element.value = ''; // clear browser cache
					return function(text) {
					  if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
					  // These replacements are necessary if you render to raw HTML
					  //text = text.replace(/&/g, "&amp;");
					  //text = text.replace(/</g, "&lt;");
					  //text = text.replace(/>/g, "&gt;");
					  //text = text.replace('\n', '<br>', 'g');
					 if (element) {
						element.value += text + "\n";
						element.scrollTop = element.scrollHeight; // focus on bottom
					  }
					};
				}
			}();
		}

		if (m.data.printErr) {
			params["printErr"] = function () {
				if (ENVIRONMENT_IS_WORKER) {
					return function (t) {
						postMessage({ print: t, ref: m.data.args });
					};
				} else if (ENVIRONMENT_IS_WEB) {
					var element = document.getElementById(m.data.printErr);
					if (element) element.value = ''; // clear browser cache
					return function(text) {
					  if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
					  // These replacements are necessary if you render to raw HTML
					  //text = text.replace(/&/g, "&amp;");
					  //text = text.replace(/</g, "&lt;");
					  //text = text.replace(/>/g, "&gt;");
					  //text = text.replace('\n', '<br>', 'g');
					  if (GPAC.no_log)
						console.log(text);
					  else if (element) {
						element.value += text + "\n";
						element.scrollTop = element.scrollHeight; // focus on bottom
					  }
					};
				}
			}();
		}

		let register_fns = [];
		params["gf_fs_reg_all"] = (fsess, a_sess) => {
			const filters = register_fns.map(filter => module[filter](a_sess));
			filters.map(filter => module.ccall('gf_fs_add_filter_register', null, ['number', 'number'], [fsess, filter]));
		};

		let on_done_resolve = null;
		let on_done_reject = null;

		params["gpac_done"] = (code) => {
			//const props  = getProperty(["width", "height"]);
			if (code) console.log('(exit code ' + code + ')');
			if (m.data.dst) {
				const res = FS.readFile(m.data.dst, { encoding: "binary" });
				const blob = new Blob([res], { type: "application/octet-stream" });
				if (ENVIRONMENT_IS_WORKER) {
					postMessage({ blob: blob });
				} else if (ENVIRONMENT_IS_WEB) {
					on_done_resolve({ blob: blob });
				}
			}
		};

		module = await libgpac(params);
		const FS = module['FS'];


		// Reframer and resampler
		register_fns.push("_reframer_register");
		register_fns.push("_resample_register");
		register_fns.push("_compositor_register");

		if (m.data.src) {
			register_fns.push("_fin_register");
			const src = m.data.src;
			const response = await fetch(src);
			var fname = src.split('/').pop();
			const data = await response.arrayBuffer();
			FS.writeFile(fname, new Uint8Array(data));
			args.push("-i");
			args.push(fname);
		}

		if (m.data.transcode) {
			args = args.concat(m.data.transcode);
		}


		if (m.data.dst) {
			register_fns.push("_writegen_register");
			register_fns.push("_fout_register");
			args.push("-o");
			args.push(m.data.dst);
		} else {
			register_fns.push("_aout_register");
			register_fns.push("_vout_register");
			args.push("aout");
			args.push("vout");
		}

		if (m.data.useWebcodec) {
			register_fns.push("_wcdec_register");
			register_fns.push("_wcenc_register");
			register_fns.push("_webgrab_register");
		}

		register_fns = register_fns.concat(Object.keys(module).filter(x => x.startsWith("dynCall_") && x.endsWith("_register")));

		if (m.data.showStats != null) {
			args.push("-stats");
		}

		if (m.data.showGraph != null) {
			args.push("-graph");
		}

		if (m.data.showReport != null) {
			args.push("-r");
		}

		if (m.data.showLogs != null) {
			args.push("-logs="+m.data.showLogs);
		}

		if (m.data.noCleanupOnExit != null) {
			args.push("-qe");
		}

		const GPAC = {};

		//setProperty(args);
		function call_gpac() {

			//FIXME
			libgpac.gf_fs_reg_all = params["gf_fs_reg_all"];
			libgpac.gpac_done = params["gpac_done"];

			GPAC.stack = module.stackSave();
			args.unshift("gpac");
			var argc = args.length;
			var argv = module.stackAlloc((argc + 1) * 4);
			var argv_ptr = argv >> 2;
			args.forEach(arg => {
				module.HEAP32[argv_ptr++] = module.allocateUTF8OnStack(arg);
			});
			module.HEAP32[argv_ptr] = 0;

			//const gpac_em_sig_handler = module.cwrap('gpac_em_sig_handler', null, ['number']);
			//gpac_em_sig_handler(4);
			//setProperty({"graph":m.data.showGraph != null, "report":m.data.showReport  != null, "stats":m.data.showStats  != null})
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

	function handle_message(m) {
		switch (m.data.event) {
			case "init":
				return init(m);
			case "set_properties":
				return set_properties(m.data.properties);
			case "get_properties":
				return get_properties(m.data.properties);
			case "get_property":
				return get_property(m.data.property);
			default:
				return;
		}
	}


	if (ENVIRONMENT_IS_WORKER) {
		addEventListener("message", handle_message);
	} else if (ENVIRONMENT_IS_WEB) {
		window.solver_1 = handle_message;
	}
})();