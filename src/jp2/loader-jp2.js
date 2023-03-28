var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

addEventListener("message", async m => {
	const name = "jp2";
	var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';

	if (!ENVIRONMENT_IS_WORKER) {
		//Filter messages since multiple universal tag can work at the same time
		if (!m.data.tag || !m.data.tag.using || !m.data.tag.using.endsWith(name)) {
			return;
		};
	}

	if (!m.data.tag || !m.data.tag.in) {
		return;
	}

	m.data.tag.module["locateFile"] = function (path, scriptDirectory) {
		if (path.startsWith("blob")) {
			return path;
		} else if (path == name + ".wasm" && m.data.tag.core) {
			return m.data.tag.core;
		} else if (m.data.tag.scriptDirectory && m.data.tag.scriptDirectory != "") {
			return m.data.tag.scriptDirectory + path;
		}
		return scriptDirectory + path;
	};

	const module_parameters = m.data.tag.module;
	if (m.data.tag.print) {
		module_parameters["print"] = function () {
			return function (t) {
				postMessage({ core: { print: t, ref: m.data.tag.ref } });
			};
		}();
	}

	if (m.data.tag.printErr) {
		module_parameters["printErr"] = function () {
			return function (t) {
				postMessage({ core: { printErr: t, ref: m.data.tag.ref } });
			};
		}();
	}

	const module = await Module(m.data.tag.module);
	const FS = module['FS'];
	const src = m.data.tag.in.src;
	const response = await fetch(src);
	var fname = src.split('/').pop();
	const data = await response.arrayBuffer();
	FS.writeFile(fname, new Uint8Array(data));

	const entry = module._constructor();
	const register_fns = Object.keys(module).filter(x => x.startsWith("dynCall_") && x.endsWith("_register"));

	const args = m.data.tag.args ? m.data.tag.args : {};
	const props = m.data.tag.props ? m.data.tag.props : [];

	args["io_in"] = fname;
	args["io_out"] = "out.rgb";
	args["filters"] = register_fns.map(entry => module[entry](0));
	props.push("width");
	props.push("height");

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
	const res = FS.readFile("out.rgb", { encoding: "binary" });


	const canvas = new OffscreenCanvas(json_res_parsed.width, json_res_parsed.height);
	const imgData = new ImageData(json_res_parsed.width, json_res_parsed.height);

	const dest = imgData.data;
	const src = res;
	const n = 4 * json_res_parsed.width * json_res_parsed.height;
	let s = 0, d = 0;
	while (d < n) {
		dest[d++] = src[s++];
		dest[d++] = src[s++];
		dest[d++] = src[s++];
		dest[d++] = 255;    // skip alpha byte
	}

	canvas.getContext('2d').putImageData(imgData, 0, 0);

	blob = await canvas.convertToBlob();


	postMessage({ core: { blob: blob, ref: m.data.tag.ref } });
});

if (ENVIRONMENT_IS_WEB) {
	window["jp2Loaded"] = true;
}
