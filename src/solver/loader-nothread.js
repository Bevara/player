(() => {
	const ENVIRONMENT_IS_WEB = typeof window == 'object';
	const ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	async function init(m) {
		const params = m.data.module;

		params["locateFile"] = function (path, scriptDirectory) {
			if (path == "player.wasm" && m.data.wasmBinaryFile) {
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

		const module = await Module(params);
		const FS = module['FS'];
		const src = m.data.src;
		const response = await fetch(src);
		var fname = src.split('/').pop();
		const data = await response.arrayBuffer();
		FS.writeFile(fname, new Uint8Array(data));

		const entry = module._constructor();
		const register_fns = Object.keys(module).filter(x => x.startsWith("dynCall_") && x.endsWith("_register"));

		const args = m.data.args ? m.data.args : {};

		args["src"] = fname;
		args["dst"] = m.data.dst;
		args["filters"] = register_fns.map(entry => module[entry](0));


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

		setProperty(args);
	};


	if (ENVIRONMENT_IS_WORKER) {
		addEventListener("message", init);
	} else if (ENVIRONMENT_IS_WEB) {
		window.player = init;
	}
})();