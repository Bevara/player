(() => {
	const ENVIRONMENT_IS_WEB = typeof window == 'object';
	const ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	async function init(m) {
		const params = m.data.module;

		params["locateFile"] = function (path, scriptDirectory) {
			if (path == "core.wasm" && m.data.wasmBinaryFile) {
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


		const res = FS.readFile(args.dst, { encoding: "binary" });

		if (args.dst.endsWith("rgba")) {
			const props  = getProperty(["width", "height"]);
			const canvas = new OffscreenCanvas(props.width, props.height);
			const imgData = new ImageData(Uint8ClampedArray.from(res), props.width, props.height);
			canvas.getContext('2d').putImageData(imgData, 0, 0);
			blob = await canvas.convertToBlob();
		} else if (args.dst.endsWith("rgb")) {
			const props  = getProperty(["width", "height"]);
			const canvas = new OffscreenCanvas(props.width, props.height);
			const imgData = new ImageData(props.width, props.height);

			const dest = imgData.data;
			const n = 4 * props.width * props.height;
			let s = 0, d = 0;
			while (d < n) {
				dest[d++] = res[s++];
				dest[d++] = res[s++];
				dest[d++] = res[s++];
				dest[d++] = 255;    // skip alpha byte
			}

			canvas.getContext('2d').putImageData(imgData, 0, 0);

			blob = await canvas.convertToBlob();
		} else {
			blob = new Blob([res], { type: "application/octet-stream" });
		}

		if (ENVIRONMENT_IS_WORKER) {
			postMessage({ core: { blob: blob} });
		} else if (ENVIRONMENT_IS_WEB){
			return blob;
		}
	};


	if (ENVIRONMENT_IS_WORKER) {
		addEventListener("message", init);
	} else if (ENVIRONMENT_IS_WEB) {
		window.core = init;
	}
})();