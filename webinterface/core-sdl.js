function SDL_MODULE(MODULE_HEAP, MODULE, ABORT, EXPORT_WRAPPER, STRINGTOUTF8,UTF8TOSTRING,ALLOCATEUTF8,WASMENTRYTABLE) {
    // Global function
    var HEAP,
        /** @type {!ArrayBuffer} */
        buffer,
        /** @type {!Int8Array} */
        HEAP8,
        /** @type {!Uint8Array} */
        HEAPU8,
        /** @type {!Int16Array} */
        HEAP16,
        /** @type {!Uint16Array} */
        HEAPU16,
        /** @type {!Int32Array} */
        HEAP32,
        /** @type {!Uint32Array} */
        HEAPU32,
        /** @type {!Float32Array} */
        HEAPF32,
        /** @type {!Float64Array} */
        HEAPF64;
    var Module = MODULE;
    var abort = ABORT;
    var getWasmTableEntry = WASMENTRYTABLE; 
    
    var err = console.warn.bind(console);

    var __ATEXIT__    = []; // functions called during shutdown
    var setWindowTitle = (title) => document.title = title;
    var GLctx;

    function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        HEAP8 = new Int8Array(buf);
        HEAP16 = new Int16Array(buf);
        HEAP32 = new Int32Array(buf);
        HEAPU8 = new Uint8Array(buf);
        HEAPU16 = new Uint16Array(buf);
        HEAPU32 = new Uint32Array(buf);
        HEAPF32 = new Float32Array(buf);
        HEAPF64 = new Float64Array(buf);
    }
    updateGlobalBufferAndViews(MODULE_HEAP);

    /** @type {function(*, string=)} */
    function assert(condition, text) {
        if (!condition) {
            abort('Assertion failed' + (text ? ': ' + text : ''));
        }
    }
    var createExportWrapper = EXPORT_WRAPPER;
    var _malloc = Module["_malloc"] = createExportWrapper("malloc");

    var stringToUTF8 = STRINGTOUTF8;
    var UTF8ToString = UTF8TOSTRING;
    var allocateUTF8 = ALLOCATEUTF8;

    //Specific SDL functions

    function listenOnce(object, event, func) {
        object.addEventListener(event, func, { 'once': true });
      }

    /** @param {Object=} elements */
  function autoResumeAudioContext(ctx, elements) {
    if (!elements) {
      elements = [document, document.getElementById('canvas')];
    }
    ['keydown', 'mousedown', 'touchstart'].forEach(function(event) {
      elements.forEach(function(element) {
        if (element) {
          listenOnce(element, event, function() {
            if (ctx.state === 'suspended') ctx.resume();
          });
        }
      });
    });
  }

    var ASM_CONSTS = {
        291796: function($0, $1, $2) {var w = $0; var h = $1; var pixels = $2; if (!Module['SDL2']) Module['SDL2'] = {}; var SDL2 = Module['SDL2']; if (SDL2.ctxCanvas !== Module['canvas']) { SDL2.ctx = Module['createContext'](Module['canvas'], false, true); SDL2.ctxCanvas = Module['canvas']; } if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) { SDL2.image = SDL2.ctx.createImageData(w, h); SDL2.w = w; SDL2.h = h; SDL2.imageCtx = SDL2.ctx; } var data = SDL2.image.data; var src = pixels >> 2; var dst = 0; var num; if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) { num = data.length; while (dst < num) { var val = HEAP32[src]; data[dst ] = val & 0xff; data[dst+1] = (val >> 8) & 0xff; data[dst+2] = (val >> 16) & 0xff; data[dst+3] = 0xff; src++; dst += 4; } } else { if (SDL2.data32Data !== data) { SDL2.data32 = new Int32Array(data.buffer); SDL2.data8 = new Uint8Array(data.buffer); SDL2.data32Data = data; } var data32 = SDL2.data32; num = data32.length; data32.set(HEAP32.subarray(src, src + num)); var data8 = SDL2.data8; var i = 3; var j = i + 4*num; if (num % 8 == 0) { while (i < j) { data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; } } else { while (i < j) { data8[i] = 0xff; i = i + 4 | 0; } } } SDL2.ctx.putImageData(SDL2.image, 0, 0); return 0;},  
        293275: function() {if (typeof(AudioContext) !== 'undefined') { return 1; } else if (typeof(webkitAudioContext) !== 'undefined') { return 1; } return 0;},  
        293412: function() {if ((typeof(navigator.mediaDevices) !== 'undefined') && (typeof(navigator.mediaDevices.getUserMedia) !== 'undefined')) { return 1; } else if (typeof(navigator.webkitGetUserMedia) !== 'undefined') { return 1; } return 0;},  
        293636: function($0) {if(typeof(Module['SDL2']) === 'undefined') { Module['SDL2'] = {}; } var SDL2 = Module['SDL2']; if (!$0) { SDL2.audio = {}; } else { SDL2.capture = {}; } if (!SDL2.audioContext) { if (typeof(AudioContext) !== 'undefined') { SDL2.audioContext = new AudioContext(); } else if (typeof(webkitAudioContext) !== 'undefined') { SDL2.audioContext = new webkitAudioContext(); } if (SDL2.audioContext) { autoResumeAudioContext(SDL2.audioContext); } } return SDL2.audioContext === undefined ? -1 : 0;},  
        294129: function() {var SDL2 = Module['SDL2']; return SDL2.audioContext.sampleRate;},  
        294197: function($0, $1, $2, $3) {var SDL2 = Module['SDL2']; var have_microphone = function(stream) { if (SDL2.capture.silenceTimer !== undefined) { clearTimeout(SDL2.capture.silenceTimer); SDL2.capture.silenceTimer = undefined; } SDL2.capture.mediaStreamNode = SDL2.audioContext.createMediaStreamSource(stream); SDL2.capture.scriptProcessorNode = SDL2.audioContext.createScriptProcessor($1, $0, 1); SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) { if ((SDL2 === undefined) || (SDL2.capture === undefined)) { return; } audioProcessingEvent.outputBuffer.getChannelData(0).fill(0.0); SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer; dynCall('vi', $2, [$3]); }; SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode); SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination); SDL2.capture.stream = stream; }; var no_microphone = function(error) { }; SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate); SDL2.capture.silenceBuffer.getChannelData(0).fill(0.0); var silence_callback = function() { SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer; dynCall('vi', $2, [$3]); }; SDL2.capture.silenceTimer = setTimeout(silence_callback, ($1 / SDL2.audioContext.sampleRate) * 1000); if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) { navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(have_microphone).catch(no_microphone); } else if (navigator.webkitGetUserMedia !== undefined) { navigator.webkitGetUserMedia({ audio: true, video: false }, have_microphone, no_microphone); }},  
        295849: function($0, $1, $2, $3) {var SDL2 = Module['SDL2']; SDL2.audio.scriptProcessorNode = SDL2.audioContext['createScriptProcessor']($1, 0, $0); SDL2.audio.scriptProcessorNode['onaudioprocess'] = function (e) { if ((SDL2 === undefined) || (SDL2.audio === undefined)) { return; } SDL2.audio.currentOutputBuffer = e['outputBuffer']; dynCall('vi', $2, [$3]); }; SDL2.audio.scriptProcessorNode['connect'](SDL2.audioContext['destination']);},  
        296259: function($0, $1) {var SDL2 = Module['SDL2']; var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels; for (var c = 0; c < numChannels; ++c) { var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c); if (channelData.length != $1) { throw 'Web Audio capture buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } if (numChannels == 1) { for (var j = 0; j < $1; ++j) { setValue($0 + (j * 4), channelData[j], 'float'); } } else { for (var j = 0; j < $1; ++j) { setValue($0 + (((j * numChannels) + c) * 4), channelData[j], 'float'); } } }},  
        296864: function($0, $1) {var SDL2 = Module['SDL2']; var numChannels = SDL2.audio.currentOutputBuffer['numberOfChannels']; for (var c = 0; c < numChannels; ++c) { var channelData = SDL2.audio.currentOutputBuffer['getChannelData'](c); if (channelData.length != $1) { throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } for (var j = 0; j < $1; ++j) { channelData[j] = HEAPF32[$0 + ((j*numChannels + c) << 2) >> 2]; } }},  
        297344: function($0) {var SDL2 = Module['SDL2']; if ($0) { if (SDL2.capture.silenceTimer !== undefined) { clearTimeout(SDL2.capture.silenceTimer); } if (SDL2.capture.stream !== undefined) { var tracks = SDL2.capture.stream.getAudioTracks(); for (var i = 0; i < tracks.length; i++) { SDL2.capture.stream.removeTrack(tracks[i]); } SDL2.capture.stream = undefined; } if (SDL2.capture.scriptProcessorNode !== undefined) { SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {}; SDL2.capture.scriptProcessorNode.disconnect(); SDL2.capture.scriptProcessorNode = undefined; } if (SDL2.capture.mediaStreamNode !== undefined) { SDL2.capture.mediaStreamNode.disconnect(); SDL2.capture.mediaStreamNode = undefined; } if (SDL2.capture.silenceBuffer !== undefined) { SDL2.capture.silenceBuffer = undefined } SDL2.capture = undefined; } else { if (SDL2.audio.scriptProcessorNode != undefined) { SDL2.audio.scriptProcessorNode.disconnect(); SDL2.audio.scriptProcessorNode = undefined; } SDL2.audio = undefined; } if ((SDL2.audioContext !== undefined) && (SDL2.audio === undefined) && (SDL2.capture === undefined)) { SDL2.audioContext.close(); SDL2.audioContext = undefined; }},  
        298516: function($0, $1, $2, $3, $4) {var w = $0; var h = $1; var hot_x = $2; var hot_y = $3; var pixels = $4; var canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; var ctx = canvas.getContext("2d"); var image = ctx.createImageData(w, h); var data = image.data; var src = pixels >> 2; var dst = 0; var num; if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) { num = data.length; while (dst < num) { var val = HEAP32[src]; data[dst ] = val & 0xff; data[dst+1] = (val >> 8) & 0xff; data[dst+2] = (val >> 16) & 0xff; data[dst+3] = (val >> 24) & 0xff; src++; dst += 4; } } else { var data32 = new Int32Array(data.buffer); num = data32.length; data32.set(HEAP32.subarray(src, src + num)); } ctx.putImageData(image, 0, 0); var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto"; var urlBuf = _malloc(url.length + 1); stringToUTF8(url, urlBuf, url.length + 1); return urlBuf;},  
        299505: function($0) {if (Module['canvas']) { Module['canvas'].style['cursor'] = UTF8ToString($0); } return 0;},  
        299598: function() {if (Module['canvas']) { Module['canvas'].style['cursor'] = 'none'; }},  
        299667: function() {return window.innerWidth;},  
        299697: function() {return window.innerHeight;}
    };

    var Browser = {
        mainLoop: {
            running: false, scheduler: null, method: "", currentlyRunningMainloop: 0, func: null, arg: 0, timingMode: 0, timingValue: 0, currentFrameNumber: 0, queue: [], pause: function () {
                Browser.mainLoop.scheduler = null;
                // Incrementing this signals the previous main loop that it's now become old, and it must return.
                Browser.mainLoop.currentlyRunningMainloop++;
            }, resume: function () {
                Browser.mainLoop.currentlyRunningMainloop++;
                var timingMode = Browser.mainLoop.timingMode;
                var timingValue = Browser.mainLoop.timingValue;
                var func = Browser.mainLoop.func;
                Browser.mainLoop.func = null;
                // do not set timing and call scheduler, we will do it on the next lines
                setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
                _emscripten_set_main_loop_timing(timingMode, timingValue);
                Browser.mainLoop.scheduler();
            }, updateStatus: function () {
                if (Module['setStatus']) {
                    var message = Module['statusMessage'] || 'Please wait...';
                    var remaining = Browser.mainLoop.remainingBlockers;
                    var expected = Browser.mainLoop.expectedBlockers;
                    if (remaining) {
                        if (remaining < expected) {
                            Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
                        } else {
                            Module['setStatus'](message);
                        }
                    } else {
                        Module['setStatus']('');
                    }
                }
            }, runIter: function (func) {
                if (ABORT) return;
                if (Module['preMainLoop']) {
                    var preRet = Module['preMainLoop']();
                    if (preRet === false) {
                        return; // |return false| skips a frame
                    }
                }
                callUserCallback(func);
                if (Module['postMainLoop']) Module['postMainLoop']();
            }
        }, isFullscreen: false, pointerLock: false, moduleContextCreatedCallbacks: [], workers: [], init: function () {
            if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers

            if (Browser.initted) return;
            Browser.initted = true;

            try {
                new Blob();
                Browser.hasBlobConstructor = true;
            } catch (e) {
                Browser.hasBlobConstructor = false;
                out("warning: no blob constructor, cannot create blobs with mimetypes");
            }
            Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? out("warning: no BlobBuilder") : null));
            Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
            if (!Module.noImageDecoding && typeof Browser.URLObject == 'undefined') {
                out("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
                Module.noImageDecoding = true;
            }

            // Support for plugins that can process preloaded files. You can add more of these to
            // your app by creating and appending to Module.preloadPlugins.
            //
            // Each plugin is asked if it can handle a file based on the file's name. If it can,
            // it is given the file's raw data. When it is done, it calls a callback with the file's
            // (possibly modified) data. For example, a plugin might decompress a file, or it
            // might create some side data structure for use later (like an Image element, etc.).

            var imagePlugin = {};
            imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
                return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
            };
            imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
                var b = null;
                if (Browser.hasBlobConstructor) {
                    try {
                        b = new Blob([byteArray], { type: Browser.getMimetype(name) });
                        if (b.size !== byteArray.length) { // Safari bug #118630
                            // Safari's Blob can only take an ArrayBuffer
                            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
                        }
                    } catch (e) {
                        warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
                    }
                }
                if (!b) {
                    var bb = new Browser.BlobBuilder();
                    bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
                    b = bb.getBlob();
                }
                var url = Browser.URLObject.createObjectURL(b);
                assert(typeof url == 'string', 'createObjectURL must return a url as a string');
                var img = new Image();
                img.onload = () => {
                    assert(img.complete, 'Image ' + name + ' could not be decoded');
                    var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    Module["preloadedImages"][name] = canvas;
                    Browser.URLObject.revokeObjectURL(url);
                    if (onload) onload(byteArray);
                };
                img.onerror = (event) => {
                    out('Image ' + url + ' could not be decoded');
                    if (onerror) onerror();
                };
                img.src = url;
            };
            Module['preloadPlugins'].push(imagePlugin);

            var audioPlugin = {};
            audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
                return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
            };
            audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
                var done = false;
                function finish(audio) {
                    if (done) return;
                    done = true;
                    Module["preloadedAudios"][name] = audio;
                    if (onload) onload(byteArray);
                }
                function fail() {
                    if (done) return;
                    done = true;
                    Module["preloadedAudios"][name] = new Audio(); // empty shim
                    if (onerror) onerror();
                }
                if (Browser.hasBlobConstructor) {
                    try {
                        var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
                    } catch (e) {
                        return fail();
                    }
                    var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
                    assert(typeof url == 'string', 'createObjectURL must return a url as a string');
                    var audio = new Audio();
                    audio.addEventListener('canplaythrough', function () { finish(audio) }, false); // use addEventListener due to chromium bug 124926
                    audio.onerror = function audio_onerror(event) {
                        if (done) return;
                        out('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
                        function encode64(data) {
                            var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                            var PAD = '=';
                            var ret = '';
                            var leftchar = 0;
                            var leftbits = 0;
                            for (var i = 0; i < data.length; i++) {
                                leftchar = (leftchar << 8) | data[i];
                                leftbits += 8;
                                while (leftbits >= 6) {
                                    var curr = (leftchar >> (leftbits - 6)) & 0x3f;
                                    leftbits -= 6;
                                    ret += BASE[curr];
                                }
                            }
                            if (leftbits == 2) {
                                ret += BASE[(leftchar & 3) << 4];
                                ret += PAD + PAD;
                            } else if (leftbits == 4) {
                                ret += BASE[(leftchar & 0xf) << 2];
                                ret += PAD;
                            }
                            return ret;
                        }
                        audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
                        finish(audio); // we don't wait for confirmation this worked - but it's worth trying
                    };
                    audio.src = url;
                    // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
                    safeSetTimeout(function () {
                        finish(audio); // try to use it even though it is not necessarily ready to play
                    }, 10000);
                } else {
                    return fail();
                }
            };
            Module['preloadPlugins'].push(audioPlugin);

            // Use string keys here to avoid minification since the plugin consumer
            // also uses string keys.
            var wasmPlugin = {
                'asyncWasmLoadPromise': new Promise(function (resolve, reject) { return resolve(); }),
                'canHandle': function (name) {
                    return !Module.noWasmDecoding && name.endsWith('.so')
                },
                'handle': function (byteArray, name, onload, onerror) {
                    // loadWebAssemblyModule can not load modules out-of-order, so rather
                    // than just running the promises in parallel, this makes a chain of
                    // promises to run in series.
                    wasmPlugin['asyncWasmLoadPromise'] = wasmPlugin['asyncWasmLoadPromise'].then(
                        function () {
                            return loadWebAssemblyModule(byteArray, { loadAsync: true, nodelete: true });
                        }).then(
                            function (module) {
                                Module['preloadedWasm'][name] = module;
                                onload();
                            },
                            function (err) {
                                console.warn("Couldn't instantiate wasm: " + name + " '" + err + "'");
                                onerror();
                            });
                }
            };
            Module['preloadPlugins'].push(wasmPlugin);

            // Canvas event setup

            function pointerLockChange() {
                Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                    document['mozPointerLockElement'] === Module['canvas'] ||
                    document['webkitPointerLockElement'] === Module['canvas'] ||
                    document['msPointerLockElement'] === Module['canvas'];
            }
            var canvas = Module['canvas'];
            if (canvas) {
                // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
                // Module['forcedAspectRatio'] = 4 / 3;

                canvas.requestPointerLock = canvas['requestPointerLock'] ||
                    canvas['mozRequestPointerLock'] ||
                    canvas['webkitRequestPointerLock'] ||
                    canvas['msRequestPointerLock'] ||
                    function () { };
                canvas.exitPointerLock = document['exitPointerLock'] ||
                    document['mozExitPointerLock'] ||
                    document['webkitExitPointerLock'] ||
                    document['msExitPointerLock'] ||
                    function () { }; // no-op if function does not exist
                canvas.exitPointerLock = canvas.exitPointerLock.bind(document);

                document.addEventListener('pointerlockchange', pointerLockChange, false);
                document.addEventListener('mozpointerlockchange', pointerLockChange, false);
                document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
                document.addEventListener('mspointerlockchange', pointerLockChange, false);

                if (Module['elementPointerLock']) {
                    canvas.addEventListener("click", function (ev) {
                        if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                            Module['canvas'].requestPointerLock();
                            ev.preventDefault();
                        }
                    }, false);
                }
            }
        }, handledByPreloadPlugin: function (byteArray, fullname, finish, onerror) {
            // Ensure plugins are ready.
            Browser.init();

            var handled = false;
            Module['preloadPlugins'].forEach(function (plugin) {
                if (handled) return;
                if (plugin['canHandle'](fullname)) {
                    plugin['handle'](byteArray, fullname, finish, onerror);
                    handled = true;
                }
            });
            return handled;
        }, createContext: function (/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
            if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.

            var ctx;
            var contextHandle;
            if (useWebGL) {
                // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
                var contextAttributes = {
                    antialias: false,
                    alpha: false,
                    majorVersion: 1,
                };

                if (webGLContextAttributes) {
                    for (var attribute in webGLContextAttributes) {
                        contextAttributes[attribute] = webGLContextAttributes[attribute];
                    }
                }

                // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
                // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
                // Browser.createContext() should not even be emitted.
                if (typeof GL != 'undefined') {
                    contextHandle = GL.createContext(canvas, contextAttributes);
                    if (contextHandle) {
                        ctx = GL.getContext(contextHandle).GLctx;
                    }
                }
            } else {
                ctx = canvas.getContext('2d');
            }

            if (!ctx) return null;

            if (setInModule) {
                if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');

                Module.ctx = ctx;
                if (useWebGL) GL.makeContextCurrent(contextHandle);
                Module.useWebGL = useWebGL;
                Browser.moduleContextCreatedCallbacks.forEach(function (callback) { callback() });
                Browser.init();
            }
            return ctx;
        }, destroyContext: function (canvas, useWebGL, setInModule) { }, fullscreenHandlersInstalled: false, lockPointer: undefined, resizeCanvas: undefined, requestFullscreen: function (lockPointer, resizeCanvas) {
            Browser.lockPointer = lockPointer;
            Browser.resizeCanvas = resizeCanvas;
            if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
            if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;

            var canvas = Module['canvas'];
            function fullscreenChange() {
                Browser.isFullscreen = false;
                var canvasContainer = canvas.parentNode;
                if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
                    document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
                    document['webkitCurrentFullScreenElement']) === canvasContainer) {
                    canvas.exitFullscreen = Browser.exitFullscreen;
                    if (Browser.lockPointer) canvas.requestPointerLock();
                    Browser.isFullscreen = true;
                    if (Browser.resizeCanvas) {
                        Browser.setFullscreenCanvasSize();
                    } else {
                        Browser.updateCanvasDimensions(canvas);
                    }
                } else {
                    // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
                    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                    canvasContainer.parentNode.removeChild(canvasContainer);

                    if (Browser.resizeCanvas) {
                        Browser.setWindowedCanvasSize();
                    } else {
                        Browser.updateCanvasDimensions(canvas);
                    }
                }
                if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
                if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
            }

            if (!Browser.fullscreenHandlersInstalled) {
                Browser.fullscreenHandlersInstalled = true;
                document.addEventListener('fullscreenchange', fullscreenChange, false);
                document.addEventListener('mozfullscreenchange', fullscreenChange, false);
                document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
                document.addEventListener('MSFullscreenChange', fullscreenChange, false);
            }

            // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
            var canvasContainer = document.createElement("div");
            canvas.parentNode.insertBefore(canvasContainer, canvas);
            canvasContainer.appendChild(canvas);

            // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
            canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                canvasContainer['mozRequestFullScreen'] ||
                canvasContainer['msRequestFullscreen'] ||
                (canvasContainer['webkitRequestFullscreen'] ? function () { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
                (canvasContainer['webkitRequestFullScreen'] ? function () { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);

            canvasContainer.requestFullscreen();
        }, requestFullScreen: function () {
            abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
        }, exitFullscreen: function () {
            // This is workaround for chrome. Trying to exit from fullscreen
            // not in fullscreen state will cause "TypeError: Document not active"
            // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
            if (!Browser.isFullscreen) {
                return false;
            }

            var CFS = document['exitFullscreen'] ||
                document['cancelFullScreen'] ||
                document['mozCancelFullScreen'] ||
                document['msExitFullscreen'] ||
                document['webkitCancelFullScreen'] ||
                (function () { });
            CFS.apply(document, []);
            return true;
        }, nextRAF: 0, fakeRequestAnimationFrame: function (func) {
            // try to keep 60fps between calls to here
            var now = Date.now();
            if (Browser.nextRAF === 0) {
                Browser.nextRAF = now + 1000 / 60;
            } else {
                while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
                    Browser.nextRAF += 1000 / 60;
                }
            }
            var delay = Math.max(Browser.nextRAF - now, 0);
            setTimeout(func, delay);
        }, requestAnimationFrame: function (func) {
            if (typeof requestAnimationFrame == 'function') {
                requestAnimationFrame(func);
                return;
            }
            var RAF = Browser.fakeRequestAnimationFrame;
            RAF(func);
        }, safeSetTimeout: function (func) {
            // Legacy function, this is used by the SDL2 port so we need to keep it
            // around at least until that is updated.
            return safeSetTimeout(func);
        }, safeRequestAnimationFrame: function (func) {

            return Browser.requestAnimationFrame(function () {

                callUserCallback(func);
            });
        }, getMimetype: function (name) {
            return {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'bmp': 'image/bmp',
                'ogg': 'audio/ogg',
                'wav': 'audio/wav',
                'mp3': 'audio/mpeg'
            }[name.substr(name.lastIndexOf('.') + 1)];
        }, getUserMedia: function (func) {
            if (!window.getUserMedia) {
                window.getUserMedia = navigator['getUserMedia'] ||
                    navigator['mozGetUserMedia'];
            }
            window.getUserMedia(func);
        }, getMovementX: function (event) {
            return event['movementX'] ||
                event['mozMovementX'] ||
                event['webkitMovementX'] ||
                0;
        }, getMovementY: function (event) {
            return event['movementY'] ||
                event['mozMovementY'] ||
                event['webkitMovementY'] ||
                0;
        }, getMouseWheelDelta: function (event) {
            var delta = 0;
            switch (event.type) {
                case 'DOMMouseScroll':
                    // 3 lines make up a step
                    delta = event.detail / 3;
                    break;
                case 'mousewheel':
                    // 120 units make up a step
                    delta = event.wheelDelta / 120;
                    break;
                case 'wheel':
                    delta = event.deltaY
                    switch (event.deltaMode) {
                        case 0:
                            // DOM_DELTA_PIXEL: 100 pixels make up a step
                            delta /= 100;
                            break;
                        case 1:
                            // DOM_DELTA_LINE: 3 lines make up a step
                            delta /= 3;
                            break;
                        case 2:
                            // DOM_DELTA_PAGE: A page makes up 80 steps
                            delta *= 80;
                            break;
                        default:
                            throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
                    }
                    break;
                default:
                    throw 'unrecognized mouse wheel event: ' + event.type;
            }
            return delta;
        }, mouseX: 0, mouseY: 0, mouseMovementX: 0, mouseMovementY: 0, touches: {}, lastTouches: {}, calculateMouseEvent: function (event) { // event should be mousemove, mousedown or mouseup
            if (Browser.pointerLock) {
                // When the pointer is locked, calculate the coordinates
                // based on the movement of the mouse.
                // Workaround for Firefox bug 764498
                if (event.type != 'mousemove' &&
                    ('mozMovementX' in event)) {
                    Browser.mouseMovementX = Browser.mouseMovementY = 0;
                } else {
                    Browser.mouseMovementX = Browser.getMovementX(event);
                    Browser.mouseMovementY = Browser.getMovementY(event);
                }

                // check if SDL is available
                if (typeof SDL != "undefined") {
                    Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                    Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
                } else {
                    // just add the mouse delta to the current absolut mouse position
                    // FIXME: ideally this should be clamped against the canvas size and zero
                    Browser.mouseX += Browser.mouseMovementX;
                    Browser.mouseY += Browser.mouseMovementY;
                }
            } else {
                // Otherwise, calculate the movement based on the changes
                // in the coordinates.
                var rect = Module["canvas"].getBoundingClientRect();
                var cw = Module["canvas"].width;
                var ch = Module["canvas"].height;

                // Neither .scrollX or .pageXOffset are defined in a spec, but
                // we prefer .scrollX because it is currently in a spec draft.
                // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
                var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
                var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);
                // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
                // and we have no viable fallback.
                assert((typeof scrollX != 'undefined') && (typeof scrollY != 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');

                if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
                    var touch = event.touch;
                    if (touch === undefined) {
                        return; // the "touch" property is only defined in SDL

                    }
                    var adjustedX = touch.pageX - (scrollX + rect.left);
                    var adjustedY = touch.pageY - (scrollY + rect.top);

                    adjustedX = adjustedX * (cw / rect.width);
                    adjustedY = adjustedY * (ch / rect.height);

                    var coords = { x: adjustedX, y: adjustedY };

                    if (event.type === 'touchstart') {
                        Browser.lastTouches[touch.identifier] = coords;
                        Browser.touches[touch.identifier] = coords;
                    } else if (event.type === 'touchend' || event.type === 'touchmove') {
                        var last = Browser.touches[touch.identifier];
                        if (!last) last = coords;
                        Browser.lastTouches[touch.identifier] = last;
                        Browser.touches[touch.identifier] = coords;
                    }
                    return;
                }

                var x = event.pageX - (scrollX + rect.left);
                var y = event.pageY - (scrollY + rect.top);

                // the canvas might be CSS-scaled compared to its backbuffer;
                // SDL-using content will want mouse coordinates in terms
                // of backbuffer units.
                x = x * (cw / rect.width);
                y = y * (ch / rect.height);

                Browser.mouseMovementX = x - Browser.mouseX;
                Browser.mouseMovementY = y - Browser.mouseY;
                Browser.mouseX = x;
                Browser.mouseY = y;
            }
        }, resizeListeners: [], updateResizeListeners: function () {
            var canvas = Module['canvas'];
            Browser.resizeListeners.forEach(function (listener) {
                listener(canvas.width, canvas.height);
            });
        }, setCanvasSize: function (width, height, noUpdates) {
            var canvas = Module['canvas'];
            Browser.updateCanvasDimensions(canvas, width, height);
            if (!noUpdates) Browser.updateResizeListeners();
        }, windowedWidth: 0, windowedHeight: 0, setFullscreenCanvasSize: function () {
            // check if SDL is available
            if (typeof SDL != "undefined") {
                var flags = HEAPU32[((SDL.screen) >> 2)];
                flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
                HEAP32[((SDL.screen) >> 2)] = flags;
            }
            Browser.updateCanvasDimensions(Module['canvas']);
            Browser.updateResizeListeners();
        }, setWindowedCanvasSize: function () {
            // check if SDL is available
            if (typeof SDL != "undefined") {
                var flags = HEAPU32[((SDL.screen) >> 2)];
                flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
                HEAP32[((SDL.screen) >> 2)] = flags;
            }
            Browser.updateCanvasDimensions(Module['canvas']);
            Browser.updateResizeListeners();
        }, updateCanvasDimensions: function (canvas, wNative, hNative) {
            if (wNative && hNative) {
                canvas.widthNative = wNative;
                canvas.heightNative = hNative;
            } else {
                wNative = canvas.widthNative;
                hNative = canvas.heightNative;
            }
            var w = wNative;
            var h = hNative;
            if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
                if (w / h < Module['forcedAspectRatio']) {
                    w = Math.round(h * Module['forcedAspectRatio']);
                } else {
                    h = Math.round(w / Module['forcedAspectRatio']);
                }
            }
            if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
                document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
                document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
                var factor = Math.min(screen.width / w, screen.height / h);
                w = Math.round(w * factor);
                h = Math.round(h * factor);
            }
            if (Browser.resizeCanvas) {
                if (canvas.width != w) canvas.width = w;
                if (canvas.height != h) canvas.height = h;
                if (typeof canvas.style != 'undefined') {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height");
                }
            } else {
                if (canvas.width != wNative) canvas.width = wNative;
                if (canvas.height != hNative) canvas.height = hNative;
                if (typeof canvas.style != 'undefined') {
                    if (w != wNative || h != hNative) {
                        canvas.style.setProperty("width", w + "px", "important");
                        canvas.style.setProperty("height", h + "px", "important");
                    } else {
                        canvas.style.removeProperty("width");
                        canvas.style.removeProperty("height");
                    }
                }
            }
        }
    };
    var EGL = {
        errorCode: 12288, defaultDisplayInitialized: false, currentContext: 0, currentReadSurface: 0, currentDrawSurface: 0, contextAttributes: { alpha: false, depth: false, stencil: false, antialias: false }, stringCache: {}, setErrorCode: function (code) {
            EGL.errorCode = code;
        }, chooseConfig: function (display, attribList, config, config_size, numConfigs) {
            if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
                EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
                return 0;
            }

            if (attribList) {
                // read attribList if it is non-null
                for (; ;) {
                    var param = HEAP32[((attribList) >> 2)];
                    if (param == 0x3021 /*EGL_ALPHA_SIZE*/) {
                        var alphaSize = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.alpha = (alphaSize > 0);
                    } else if (param == 0x3025 /*EGL_DEPTH_SIZE*/) {
                        var depthSize = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.depth = (depthSize > 0);
                    } else if (param == 0x3026 /*EGL_STENCIL_SIZE*/) {
                        var stencilSize = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.stencil = (stencilSize > 0);
                    } else if (param == 0x3031 /*EGL_SAMPLES*/) {
                        var samples = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.antialias = (samples > 0);
                    } else if (param == 0x3032 /*EGL_SAMPLE_BUFFERS*/) {
                        var samples = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.antialias = (samples == 1);
                    } else if (param == 0x3100 /*EGL_CONTEXT_PRIORITY_LEVEL_IMG*/) {
                        var requestedPriority = HEAP32[(((attribList) + (4)) >> 2)];
                        EGL.contextAttributes.lowLatency = (requestedPriority != 0x3103 /*EGL_CONTEXT_PRIORITY_LOW_IMG*/);
                    } else if (param == 0x3038 /*EGL_NONE*/) {
                        break;
                    }
                    attribList += 8;
                }
            }

            if ((!config || !config_size) && !numConfigs) {
                EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
                return 0;
            }
            if (numConfigs) {
                HEAP32[((numConfigs) >> 2)] = 1; // Total number of supported configs: 1.
            }
            if (config && config_size > 0) {
                HEAP32[((config) >> 2)] = 62002;
            }

            EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
            return 1;
        }
    };
    function _eglBindAPI(api) {
        if (api == 0x30A0 /* EGL_OPENGL_ES_API */) {
            EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
            return 1;
        } else { // if (api == 0x30A1 /* EGL_OPENVG_API */ || api == 0x30A2 /* EGL_OPENGL_API */) {
            EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
            return 0;
        }
    }
    _eglBindAPI.sig = 'ii';

    function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
        return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
    }
    _eglChooseConfig.sig = 'iiiiii';

    function __webgl_enable_ANGLE_instanced_arrays(ctx) {
        // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('ANGLE_instanced_arrays');
        if (ext) {
            ctx['vertexAttribDivisor'] = function (index, divisor) { ext['vertexAttribDivisorANGLE'](index, divisor); };
            ctx['drawArraysInstanced'] = function (mode, first, count, primcount) { ext['drawArraysInstancedANGLE'](mode, first, count, primcount); };
            ctx['drawElementsInstanced'] = function (mode, count, type, indices, primcount) { ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount); };
            return 1;
        }
    }

    function __webgl_enable_OES_vertex_array_object(ctx) {
        // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('OES_vertex_array_object');
        if (ext) {
            ctx['createVertexArray'] = function () { return ext['createVertexArrayOES'](); };
            ctx['deleteVertexArray'] = function (vao) { ext['deleteVertexArrayOES'](vao); };
            ctx['bindVertexArray'] = function (vao) { ext['bindVertexArrayOES'](vao); };
            ctx['isVertexArray'] = function (vao) { return ext['isVertexArrayOES'](vao); };
            return 1;
        }
    }

    function __webgl_enable_WEBGL_draw_buffers(ctx) {
        // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('WEBGL_draw_buffers');
        if (ext) {
            ctx['drawBuffers'] = function (n, bufs) { ext['drawBuffersWEBGL'](n, bufs); };
            return 1;
        }
    }

    function __webgl_enable_WEBGL_multi_draw(ctx) {
        // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
        return !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
    }
    var GL = {
        counter: 1, buffers: [], programs: [], framebuffers: [], renderbuffers: [], textures: [], shaders: [], vaos: [], contexts: [], offscreenCanvases: {}, queries: [], stringCache: {}, unpackAlignment: 4, recordError: function recordError(errorCode) {
            if (!GL.lastError) {
                GL.lastError = errorCode;
            }
        }, getNewId: function (table) {
            var ret = GL.counter++;
            for (var i = table.length; i < ret; i++) {
                table[i] = null;
            }
            return ret;
        }, getSource: function (shader, count, string, length) {
            var source = '';
            for (var i = 0; i < count; ++i) {
                var len = length ? HEAP32[(((length) + (i * 4)) >> 2)] : -1;
                source += UTF8ToString(HEAP32[(((string) + (i * 4)) >> 2)], len < 0 ? undefined : len);
            }
            return source;
        }, createContext: function (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) {

            // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL context on a canvas,
            // calling .getContext() will always return that context independent of which 'webgl' or 'webgl2'
            // context version was passed. See https://bugs.webkit.org/show_bug.cgi?id=222758 and
            // https://github.com/emscripten-core/emscripten/issues/13295.
            // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari version field in above check.
            if (!canvas.getContextSafariWebGL2Fixed) {
                canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */
                function fixedGetContext(ver, attrs) {
                    var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                    return ((ver == 'webgl') == (gl instanceof WebGLRenderingContext)) ? gl : null;
                }
                canvas.getContext = fixedGetContext;
            }

            var ctx =
                (canvas.getContext("webgl", webGLContextAttributes)
                    // https://caniuse.com/#feat=webgl
                );

            if (!ctx) return 0;

            var handle = GL.registerContext(ctx, webGLContextAttributes);

            return handle;
        }, registerContext: function (ctx, webGLContextAttributes) {
            // without pthreads a context is just an integer ID
            var handle = GL.getNewId(GL.contexts);

            var context = {
                handle: handle,
                attributes: webGLContextAttributes,
                version: webGLContextAttributes.majorVersion,
                GLctx: ctx
            };

            // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
            if (ctx.canvas) ctx.canvas.GLctxObject = context;
            GL.contexts[handle] = context;
            if (typeof webGLContextAttributes.enableExtensionsByDefault == 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
                GL.initExtensions(context);
            }

            return handle;
        }, makeContextCurrent: function (contextHandle) {

            GL.currentContext = GL.contexts[contextHandle]; // Active Emscripten GL layer context object.
            Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx; // Active WebGL context object.
            return !(contextHandle && !GLctx);
        }, getContext: function (contextHandle) {
            return GL.contexts[contextHandle];
        }, deleteContext: function (contextHandle) {
            if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
            if (typeof JSEvents == 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
            if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
            GL.contexts[contextHandle] = null;
        }, initExtensions: function (context) {
            // If this function is called without a specific context object, init the extensions of the currently active context.
            if (!context) context = GL.currentContext;

            if (context.initExtensionsDone) return;
            context.initExtensionsDone = true;

            var GLctx = context.GLctx;

            // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist.

            // Extensions that are only available in WebGL 1 (the calls will be no-ops if called on a WebGL 2 context active)
            __webgl_enable_ANGLE_instanced_arrays(GLctx);
            __webgl_enable_OES_vertex_array_object(GLctx);
            __webgl_enable_WEBGL_draw_buffers(GLctx);

            {
                GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
            }

            __webgl_enable_WEBGL_multi_draw(GLctx);

            // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
            var exts = GLctx.getSupportedExtensions() || [];
            exts.forEach(function (ext) {
                // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders are not enabled by default.
                if (!ext.includes('lose_context') && !ext.includes('debug')) {
                    // Call .getExtension() to enable that extension permanently.
                    GLctx.getExtension(ext);
                }
            });
        }
    };
    function _eglCreateContext(display, config, hmm, contextAttribs) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }

        // EGL 1.4 spec says default EGL_CONTEXT_CLIENT_VERSION is GLES1, but this is not supported by Emscripten.
        // So user must pass EGL_CONTEXT_CLIENT_VERSION == 2 to initialize EGL.
        var glesContextVersion = 1;
        for (; ;) {
            var param = HEAP32[((contextAttribs) >> 2)];
            if (param == 0x3098 /*EGL_CONTEXT_CLIENT_VERSION*/) {
                glesContextVersion = HEAP32[(((contextAttribs) + (4)) >> 2)];
            } else if (param == 0x3038 /*EGL_NONE*/) {
                break;
            } else {
                /* EGL1.4 specifies only EGL_CONTEXT_CLIENT_VERSION as supported attribute */
                EGL.setErrorCode(0x3004 /*EGL_BAD_ATTRIBUTE*/);
                return 0;
            }
            contextAttribs += 8;
        }
        if (glesContextVersion != 2) {
            EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
            return 0; /* EGL_NO_CONTEXT */
        }

        EGL.contextAttributes.majorVersion = glesContextVersion - 1; // WebGL 1 is GLES 2, WebGL2 is GLES3
        EGL.contextAttributes.minorVersion = 0;

        EGL.context = GL.createContext(Module['canvas'], EGL.contextAttributes);

        if (EGL.context != 0) {
            EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);

            // Run callbacks so that GL emulation works
            GL.makeContextCurrent(EGL.context);
            Module.useWebGL = true;
            Browser.moduleContextCreatedCallbacks.forEach(function (callback) { callback() });

            // Note: This function only creates a context, but it shall not make it active.
            GL.makeContextCurrent(null);
            return 62004; // Magic ID for Emscripten EGLContext
        } else {
            EGL.setErrorCode(0x3009 /* EGL_BAD_MATCH */); // By the EGL 1.4 spec, an implementation that does not support GLES2 (WebGL in this case), this error code is set.
            return 0; /* EGL_NO_CONTEXT */
        }
    }
    _eglCreateContext.sig = 'iiiii';

    function _eglCreateWindowSurface(display, config, win, attrib_list) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        if (config != 62002 /* Magic ID for the only EGLConfig supported by Emscripten */) {
            EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
            return 0;
        }
        // TODO: Examine attrib_list! Parameters that can be present there are:
        // - EGL_RENDER_BUFFER (must be EGL_BACK_BUFFER)
        // - EGL_VG_COLORSPACE (can't be set)
        // - EGL_VG_ALPHA_FORMAT (can't be set)
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 62006; /* Magic ID for Emscripten 'default surface' */
    }
    _eglCreateWindowSurface.sig = 'iiiii';

    function _eglDestroyContext(display, context) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        if (context != 62004 /* Magic ID for Emscripten EGLContext */) {
            EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
            return 0;
        }

        GL.deleteContext(EGL.context);
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        if (EGL.currentContext == context) {
            EGL.currentContext = 0;
        }
        return 1 /* EGL_TRUE */;
    }
    _eglDestroyContext.sig = 'iii';

    function _eglDestroySurface(display, surface) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        if (surface != 62006 /* Magic ID for the only EGLSurface supported by Emscripten */) {
            EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
            return 1;
        }
        if (EGL.currentReadSurface == surface) {
            EGL.currentReadSurface = 0;
        }
        if (EGL.currentDrawSurface == surface) {
            EGL.currentDrawSurface = 0;
        }
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1; /* Magic ID for Emscripten 'default surface' */
    }
    _eglDestroySurface.sig = 'iii';

    function _eglGetConfigAttrib(display, config, attribute, value) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        if (config != 62002 /* Magic ID for the only EGLConfig supported by Emscripten */) {
            EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
            return 0;
        }
        if (!value) {
            EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
            return 0;
        }
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        switch (attribute) {
            case 0x3020: // EGL_BUFFER_SIZE
                HEAP32[((value) >> 2)] = EGL.contextAttributes.alpha ? 32 : 24;
                return 1;
            case 0x3021: // EGL_ALPHA_SIZE
                HEAP32[((value) >> 2)] = EGL.contextAttributes.alpha ? 8 : 0;
                return 1;
            case 0x3022: // EGL_BLUE_SIZE
                HEAP32[((value) >> 2)] = 8;
                return 1;
            case 0x3023: // EGL_GREEN_SIZE
                HEAP32[((value) >> 2)] = 8;
                return 1;
            case 0x3024: // EGL_RED_SIZE
                HEAP32[((value) >> 2)] = 8;
                return 1;
            case 0x3025: // EGL_DEPTH_SIZE
                HEAP32[((value) >> 2)] = EGL.contextAttributes.depth ? 24 : 0;
                return 1;
            case 0x3026: // EGL_STENCIL_SIZE
                HEAP32[((value) >> 2)] = EGL.contextAttributes.stencil ? 8 : 0;
                return 1;
            case 0x3027: // EGL_CONFIG_CAVEAT
                // We can return here one of EGL_NONE (0x3038), EGL_SLOW_CONFIG (0x3050) or EGL_NON_CONFORMANT_CONFIG (0x3051).
                HEAP32[((value) >> 2)] = 0x3038;
                return 1;
            case 0x3028: // EGL_CONFIG_ID
                HEAP32[((value) >> 2)] = 62002;
                return 1;
            case 0x3029: // EGL_LEVEL
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x302A: // EGL_MAX_PBUFFER_HEIGHT
                HEAP32[((value) >> 2)] = 4096;
                return 1;
            case 0x302B: // EGL_MAX_PBUFFER_PIXELS
                HEAP32[((value) >> 2)] = 16777216;
                return 1;
            case 0x302C: // EGL_MAX_PBUFFER_WIDTH
                HEAP32[((value) >> 2)] = 4096;
                return 1;
            case 0x302D: // EGL_NATIVE_RENDERABLE
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x302E: // EGL_NATIVE_VISUAL_ID
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x302F: // EGL_NATIVE_VISUAL_TYPE
                HEAP32[((value) >> 2)] = 0x3038;
                return 1;
            case 0x3031: // EGL_SAMPLES
                HEAP32[((value) >> 2)] = EGL.contextAttributes.antialias ? 4 : 0;
                return 1;
            case 0x3032: // EGL_SAMPLE_BUFFERS
                HEAP32[((value) >> 2)] = EGL.contextAttributes.antialias ? 1 : 0;
                return 1;
            case 0x3033: // EGL_SURFACE_TYPE
                HEAP32[((value) >> 2)] = 0x4;
                return 1;
            case 0x3034: // EGL_TRANSPARENT_TYPE
                // If this returns EGL_TRANSPARENT_RGB (0x3052), transparency is used through color-keying. No such thing applies to Emscripten canvas.
                HEAP32[((value) >> 2)] = 0x3038;
                return 1;
            case 0x3035: // EGL_TRANSPARENT_BLUE_VALUE
            case 0x3036: // EGL_TRANSPARENT_GREEN_VALUE
            case 0x3037: // EGL_TRANSPARENT_RED_VALUE
                // "If EGL_TRANSPARENT_TYPE is EGL_NONE, then the values for EGL_TRANSPARENT_RED_VALUE, EGL_TRANSPARENT_GREEN_VALUE, and EGL_TRANSPARENT_BLUE_VALUE are undefined."
                HEAP32[((value) >> 2)] = -1;
                return 1;
            case 0x3039: // EGL_BIND_TO_TEXTURE_RGB
            case 0x303A: // EGL_BIND_TO_TEXTURE_RGBA
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x303B: // EGL_MIN_SWAP_INTERVAL
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x303C: // EGL_MAX_SWAP_INTERVAL
                HEAP32[((value) >> 2)] = 1;
                return 1;
            case 0x303D: // EGL_LUMINANCE_SIZE
            case 0x303E: // EGL_ALPHA_MASK_SIZE
                HEAP32[((value) >> 2)] = 0;
                return 1;
            case 0x303F: // EGL_COLOR_BUFFER_TYPE
                // EGL has two types of buffers: EGL_RGB_BUFFER and EGL_LUMINANCE_BUFFER.
                HEAP32[((value) >> 2)] = 0x308E;
                return 1;
            case 0x3040: // EGL_RENDERABLE_TYPE
                // A bit combination of EGL_OPENGL_ES_BIT,EGL_OPENVG_BIT,EGL_OPENGL_ES2_BIT and EGL_OPENGL_BIT.
                HEAP32[((value) >> 2)] = 0x4;
                return 1;
            case 0x3042: // EGL_CONFORMANT
                // "EGL_CONFORMANT is a mask indicating if a client API context created with respect to the corresponding EGLConfig will pass the required conformance tests for that API."
                HEAP32[((value) >> 2)] = 0;
                return 1;
            default:
                EGL.setErrorCode(0x3004 /* EGL_BAD_ATTRIBUTE */);
                return 0;
        }
    }
    _eglGetConfigAttrib.sig = 'iiiii';

    function _eglGetDisplay(nativeDisplayType) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        // Note: As a 'conformant' implementation of EGL, we would prefer to init here only if the user
        //       calls this function with EGL_DEFAULT_DISPLAY. Other display IDs would be preferred to be unsupported
        //       and EGL_NO_DISPLAY returned. Uncomment the following code lines to do this.
        // Instead, an alternative route has been preferred, namely that the Emscripten EGL implementation
        // "emulates" X11, and eglGetDisplay is expected to accept/receive a pointer to an X11 Display object.
        // Therefore, be lax and allow anything to be passed in, and return the magic handle to our default EGLDisplay object.

        //    if (nativeDisplayType == 0 /* EGL_DEFAULT_DISPLAY */) {
        return 62000; // Magic ID for Emscripten 'default display'
        //    }
        //    else
        //      return 0; // EGL_NO_DISPLAY
    }
    _eglGetDisplay.sig = 'ii';

    function _eglGetError() {
        return EGL.errorCode;
    }
    _eglGetError.sig = 'i';

    function _eglInitialize(display, majorVersion, minorVersion) {
        if (display == 62000 /* Magic ID for Emscripten 'default display' */) {
            if (majorVersion) {
                HEAP32[((majorVersion) >> 2)] = 1; // Advertise EGL Major version: '1'
            }
            if (minorVersion) {
                HEAP32[((minorVersion) >> 2)] = 4; // Advertise EGL Minor version: '4'
            }
            EGL.defaultDisplayInitialized = true;
            EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
            return 1;
        }
        else {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
    }
    _eglInitialize.sig = 'iiii';

    function _eglMakeCurrent(display, draw, read, context) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0 /* EGL_FALSE */;
        }
        //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
        if (context != 0 && context != 62004 /* Magic ID for Emscripten EGLContext */) {
            EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
            return 0;
        }
        if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006 /* Magic ID for Emscripten 'default surface' */)) {
            EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
            return 0;
        }

        GL.makeContextCurrent(context ? EGL.context : null);

        EGL.currentContext = context;
        EGL.currentDrawSurface = draw;
        EGL.currentReadSurface = read;
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1 /* EGL_TRUE */;
    }
    _eglMakeCurrent.sig = 'iiiii';

    function _eglQueryString(display, name) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        if (EGL.stringCache[name]) return EGL.stringCache[name];
        var ret;
        switch (name) {
            case 0x3053 /* EGL_VENDOR */: ret = allocateUTF8("Emscripten"); break;
            case 0x3054 /* EGL_VERSION */: ret = allocateUTF8("1.4 Emscripten EGL"); break;
            case 0x3055 /* EGL_EXTENSIONS */: ret = allocateUTF8(""); break; // Currently not supporting any EGL extensions.
            case 0x308D /* EGL_CLIENT_APIS */: ret = allocateUTF8("OpenGL_ES"); break;
            default:
                EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
                return 0;
        }
        EGL.stringCache[name] = ret;
        return ret;
    }
    _eglQueryString.sig = 'iii';

    function _eglSwapBuffers() {

        if (!EGL.defaultDisplayInitialized) {
            EGL.setErrorCode(0x3001 /* EGL_NOT_INITIALIZED */);
        } else if (!Module.ctx) {
            EGL.setErrorCode(0x3002 /* EGL_BAD_ACCESS */);
        } else if (Module.ctx.isContextLost()) {
            EGL.setErrorCode(0x300E /* EGL_CONTEXT_LOST */);
        } else {
            // According to documentation this does an implicit flush.
            // Due to discussion at https://github.com/emscripten-core/emscripten/pull/1871
            // the flush was removed since this _may_ result in slowing code down.
            //_glFlush();
            EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
            return 1 /* EGL_TRUE */;
        }
        return 0 /* EGL_FALSE */;
    }
    _eglSwapBuffers.sig = 'iii';

    function _eglSwapInterval(display, interval) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        if (interval == 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 0);
        else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, interval);

        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
    }
    _eglSwapInterval.sig = 'iii';

    function _eglTerminate(display) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
            EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
            return 0;
        }
        EGL.currentContext = 0;
        EGL.currentReadSurface = 0;
        EGL.currentDrawSurface = 0;
        EGL.defaultDisplayInitialized = false;
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
    }
    _eglTerminate.sig = 'ii';

    function _eglWaitClient() {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
    }
    _eglWaitClient.sig = 'i';
    function _eglWaitGL(
    ) {
        return _eglWaitClient();
    }
    _eglWaitGL.sig = 'i';

    function _eglWaitNative(nativeEngineId) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
    }
    _eglWaitNative.sig = 'ii';

    var readAsmConstArgsArray = [];
    function readAsmConstArgs(sigPtr, buf) {
        ;
        // Nobody should have mutated _readAsmConstArgsArray underneath us to be something else than an array.
        assert(Array.isArray(readAsmConstArgsArray));
        // The input buffer is allocated on the stack, so it must be stack-aligned.
        assert(buf % 16 == 0);
        readAsmConstArgsArray.length = 0;
        var ch;
        // Most arguments are i32s, so shift the buffer pointer so it is a plain
        // index into HEAP32.
        buf >>= 2;
        while (ch = HEAPU8[sigPtr++]) {
            assert(ch === 100/*'d'*/ || ch === 102/*'f'*/ || ch === 105 /*'i'*/, 'Invalid character ' + ch + '("' + String.fromCharCode(ch) + '") in readAsmConstArgs! Use only "d", "f" or "i", and do not specify "v" for void return argument.');
            // A double takes two 32-bit slots, and must also be aligned - the backend
            // will emit padding to avoid that.
            var readAsmConstArgsDouble = ch < 105;
            if (readAsmConstArgsDouble && (buf & 1)) buf++;
            readAsmConstArgsArray.push(readAsmConstArgsDouble ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
            ++buf;
        }
        return readAsmConstArgsArray;
    }
    function _emscripten_asm_const_int(code, sigPtr, argbuf) {
        code -= 1024;
        var args = readAsmConstArgs(sigPtr, argbuf);
        if (!ASM_CONSTS.hasOwnProperty(code)) abort('No EM_ASM constant found at address ' + code);
        return ASM_CONSTS[code].apply(null, args);
    }
    _emscripten_asm_const_int.sig = 'iiii';

    function _emscripten_console_error(str) {
        assert(typeof str == 'number');
        console.error(UTF8ToString(str));
    }
    _emscripten_console_error.sig = 'vi';

    var JSEvents = {
        inEventHandler: 0, removeAllEventListeners: function () {
            for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
                JSEvents._removeHandler(i);
            }
            JSEvents.eventHandlers = [];
            JSEvents.deferredCalls = [];
        }, registerRemoveEventListeners: function () {
            if (!JSEvents.removeEventListenersRegistered) {
                __ATEXIT__.push(JSEvents.removeAllEventListeners);
                JSEvents.removeEventListenersRegistered = true;
            }
        }, deferredCalls: [], deferCall: function (targetFunction, precedence, argsList) {
            function arraysHaveEqualContent(arrA, arrB) {
                if (arrA.length != arrB.length) return false;

                for (var i in arrA) {
                    if (arrA[i] != arrB[i]) return false;
                }
                return true;
            }
            // Test if the given call was already queued, and if so, don't add it again.
            for (var i in JSEvents.deferredCalls) {
                var call = JSEvents.deferredCalls[i];
                if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                    return;
                }
            }
            JSEvents.deferredCalls.push({
                targetFunction: targetFunction,
                precedence: precedence,
                argsList: argsList
            });

            JSEvents.deferredCalls.sort(function (x, y) { return x.precedence < y.precedence; });
        }, removeDeferredCalls: function (targetFunction) {
            for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
                if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                    JSEvents.deferredCalls.splice(i, 1);
                    --i;
                }
            }
        }, canPerformEventHandlerRequests: function () {
            return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
        }, runDeferredCalls: function () {
            if (!JSEvents.canPerformEventHandlerRequests()) {
                return;
            }
            for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
                var call = JSEvents.deferredCalls[i];
                JSEvents.deferredCalls.splice(i, 1);
                --i;
                call.targetFunction.apply(null, call.argsList);
            }
        }, eventHandlers: [], removeAllHandlersOnTarget: function (target, eventTypeString) {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (JSEvents.eventHandlers[i].target == target &&
                    (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
                    JSEvents._removeHandler(i--);
                }
            }
        }, _removeHandler: function (i) {
            var h = JSEvents.eventHandlers[i];
            h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
            JSEvents.eventHandlers.splice(i, 1);
        }, registerOrRemoveHandler: function (eventHandler) {
            var jsEventHandler = function jsEventHandler(event) {
                // Increment nesting count for the event handler.
                ++JSEvents.inEventHandler;
                JSEvents.currentEventHandler = eventHandler;
                // Process any old deferred calls the user has placed.
                JSEvents.runDeferredCalls();
                // Process the actual event, calls back to user C code handler.
                eventHandler.handlerFunc(event);
                // Process any new deferred calls that were placed right now from this event handler.
                JSEvents.runDeferredCalls();
                // Out of event handler - restore nesting count.
                --JSEvents.inEventHandler;
            };

            if (eventHandler.callbackfunc) {
                eventHandler.eventListenerFunc = jsEventHandler;
                eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
                JSEvents.eventHandlers.push(eventHandler);
                JSEvents.registerRemoveEventListeners();
            } else {
                for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                    if (JSEvents.eventHandlers[i].target == eventHandler.target
                        && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                        JSEvents._removeHandler(i--);
                    }
                }
            }
        }, getNodeNameForTarget: function (target) {
            if (!target) return '';
            if (target == window) return '#window';
            if (target == screen) return '#screen';
            return (target && target.nodeName) ? target.nodeName : '';
        }, fullscreenEnabled: function () {
            return document.fullscreenEnabled
                // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
                // TODO: If Safari at some point ships with unprefixed version, update the version check above.
                || document.webkitFullscreenEnabled
                ;
        }
    };

    var currentFullscreenStrategy = {};

    function maybeCStringToJsString(cString) {
        // "cString > 2" checks if the input is a number, and isn't of the special
        // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
        // In other words, if cString > 2 then it's a pointer to a valid place in
        // memory, and points to a C string.
        return cString > 2 ? UTF8ToString(cString) : cString;
    }

    var specialHTMLTargets = [0, typeof document != 'undefined' ? document : 0, typeof window != 'undefined' ? window : 0];
    function findEventTarget(target) {
        target = maybeCStringToJsString(target);
        var domElement = specialHTMLTargets[target] || (typeof document != 'undefined' ? document.querySelector(target) : undefined);
        return domElement;
    }
    function findCanvasEventTarget(target) { return findEventTarget(target); }
    function _emscripten_get_canvas_element_size(target, width, height) {
        var canvas = findCanvasEventTarget(target);
        if (!canvas) return -4;
        HEAP32[((width) >> 2)] = canvas.width;
        HEAP32[((height) >> 2)] = canvas.height;
    }
    function getCanvasElementSize(target) {
        return withStackSave(function () {
            var w = stackAlloc(8);
            var h = w + 4;

            var targetInt = stackAlloc(target.id.length + 1);
            stringToUTF8(target.id, targetInt, target.id.length + 1);
            var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
            var size = [HEAP32[((w) >> 2)], HEAP32[((h) >> 2)]];
            return size;
        });
    }

    function _emscripten_set_canvas_element_size(target, width, height) {
        var canvas = findCanvasEventTarget(target);
        if (!canvas) return -4;
        canvas.width = width;
        canvas.height = height;
        return 0;
    }
    _emscripten_set_canvas_element_size.sig = 'iiii';
    function setCanvasElementSize(target, width, height) {
        if (!target.controlTransferredOffscreen) {
            target.width = width;
            target.height = height;
        } else {
            // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
            // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
            withStackSave(function () {
                var targetInt = stackAlloc(target.id.length + 1);
                stringToUTF8(target.id, targetInt, target.id.length + 1);
                _emscripten_set_canvas_element_size(targetInt, width, height);
            });
        }
    }
    function registerRestoreOldStyle(canvas) {
        var canvasSize = getCanvasElementSize(canvas);
        var oldWidth = canvasSize[0];
        var oldHeight = canvasSize[1];
        var oldCssWidth = canvas.style.width;
        var oldCssHeight = canvas.style.height;
        var oldBackgroundColor = canvas.style.backgroundColor; // Chrome reads color from here.
        var oldDocumentBackgroundColor = document.body.style.backgroundColor; // IE11 reads color from here.
        // Firefox always has black background color.
        var oldPaddingLeft = canvas.style.paddingLeft; // Chrome, FF, Safari
        var oldPaddingRight = canvas.style.paddingRight;
        var oldPaddingTop = canvas.style.paddingTop;
        var oldPaddingBottom = canvas.style.paddingBottom;
        var oldMarginLeft = canvas.style.marginLeft; // IE11
        var oldMarginRight = canvas.style.marginRight;
        var oldMarginTop = canvas.style.marginTop;
        var oldMarginBottom = canvas.style.marginBottom;
        var oldDocumentBodyMargin = document.body.style.margin;
        var oldDocumentOverflow = document.documentElement.style.overflow; // Chrome, Firefox
        var oldDocumentScroll = document.body.scroll; // IE
        var oldImageRendering = canvas.style.imageRendering;

        function restoreOldStyle() {
            var fullscreenElement = document.fullscreenElement
                || document.webkitFullscreenElement
                || document.msFullscreenElement
                ;
            if (!fullscreenElement) {
                document.removeEventListener('fullscreenchange', restoreOldStyle);

                // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
                // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
                document.removeEventListener('webkitfullscreenchange', restoreOldStyle);

                setCanvasElementSize(canvas, oldWidth, oldHeight);

                canvas.style.width = oldCssWidth;
                canvas.style.height = oldCssHeight;
                canvas.style.backgroundColor = oldBackgroundColor; // Chrome
                // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
                // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
                // had explicitly set so subsequent fullscreen transitions would not set background color properly.
                if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = 'white';
                document.body.style.backgroundColor = oldDocumentBackgroundColor; // IE11
                canvas.style.paddingLeft = oldPaddingLeft; // Chrome, FF, Safari
                canvas.style.paddingRight = oldPaddingRight;
                canvas.style.paddingTop = oldPaddingTop;
                canvas.style.paddingBottom = oldPaddingBottom;
                canvas.style.marginLeft = oldMarginLeft; // IE11
                canvas.style.marginRight = oldMarginRight;
                canvas.style.marginTop = oldMarginTop;
                canvas.style.marginBottom = oldMarginBottom;
                document.body.style.margin = oldDocumentBodyMargin;
                document.documentElement.style.overflow = oldDocumentOverflow; // Chrome, Firefox
                document.body.scroll = oldDocumentScroll; // IE
                canvas.style.imageRendering = oldImageRendering;
                if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);

                if (currentFullscreenStrategy.canvasResizedCallback) {
                    getWasmTableEntry(currentFullscreenStrategy.canvasResizedCallback)(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
                }
            }
        }
        document.addEventListener('fullscreenchange', restoreOldStyle);
        // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
        // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
        document.addEventListener('webkitfullscreenchange', restoreOldStyle);
        return restoreOldStyle;
    }

    function setLetterbox(element, topBottom, leftRight) {
        // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
        element.style.paddingLeft = element.style.paddingRight = leftRight + 'px';
        element.style.paddingTop = element.style.paddingBottom = topBottom + 'px';
    }

    function getBoundingClientRect(e) {
        return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : { 'left': 0, 'top': 0 };
    }
    function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
        var restoreOldStyle = registerRestoreOldStyle(target);
        var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
        var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
        var rect = getBoundingClientRect(target);
        var windowedCssWidth = rect.width;
        var windowedCssHeight = rect.height;
        var canvasSize = getCanvasElementSize(target);
        var windowedRttWidth = canvasSize[0];
        var windowedRttHeight = canvasSize[1];

        if (strategy.scaleMode == 3) {
            setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
            cssWidth = windowedCssWidth;
            cssHeight = windowedCssHeight;
        } else if (strategy.scaleMode == 2) {
            if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
                var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
                setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
                cssHeight = desiredCssHeight;
            } else {
                var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
                setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
                cssWidth = desiredCssWidth;
            }
        }

        // If we are adding padding, must choose a background color or otherwise Chrome will give the
        // padding a default white color. Do it only if user has not customized their own background color.
        if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
        // IE11 does the same, but requires the color to be set in the document body.
        if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
        // Firefox always shows black letterboxes independent of style color.

        target.style.width = cssWidth + 'px';
        target.style.height = cssHeight + 'px';

        if (strategy.filteringMode == 1) {
            target.style.imageRendering = 'optimizeSpeed';
            target.style.imageRendering = '-moz-crisp-edges';
            target.style.imageRendering = '-o-crisp-edges';
            target.style.imageRendering = '-webkit-optimize-contrast';
            target.style.imageRendering = 'optimize-contrast';
            target.style.imageRendering = 'crisp-edges';
            target.style.imageRendering = 'pixelated';
        }

        var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
        if (strategy.canvasResolutionScaleMode != 0) {
            var newWidth = (cssWidth * dpiScale) | 0;
            var newHeight = (cssHeight * dpiScale) | 0;
            setCanvasElementSize(target, newWidth, newHeight);
            if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
        }
        return restoreOldStyle;
    }
    function _JSEvents_requestFullscreen(target, strategy) {
        // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
        if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
            _JSEvents_resizeCanvasForFullscreen(target, strategy);
        }

        if (target.requestFullscreen) {
            target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            return JSEvents.fullscreenEnabled() ? -3 : -1;
        }

        currentFullscreenStrategy = strategy;

        if (strategy.canvasResizedCallback) {
            getWasmTableEntry(strategy.canvasResizedCallback)(37, 0, strategy.canvasResizedCallbackUserData);
        }

        return 0;
    }
    function _emscripten_exit_fullscreen() {
        if (!JSEvents.fullscreenEnabled()) return -1;
        // Make sure no queued up calls will fire after this.
        JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);

        var d = specialHTMLTargets[1];
        if (d.exitFullscreen) {
            d.fullscreenElement && d.exitFullscreen();
        } else if (d.webkitExitFullscreen) {
            d.webkitFullscreenElement && d.webkitExitFullscreen();
        } else {
            return -1;
        }

        return 0;
    }
    _emscripten_exit_fullscreen.sig = 'i';

    function requestPointerLock(target) {
        if (target.requestPointerLock) {
            target.requestPointerLock();
        } else if (target.msRequestPointerLock) {
            target.msRequestPointerLock();
        } else {
            // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
            // or if the whole browser just doesn't support the feature.
            if (document.body.requestPointerLock
                || document.body.msRequestPointerLock
            ) {
                return -3;
            } else {
                return -1;
            }
        }
        return 0;
    }
    function _emscripten_exit_pointerlock() {
        // Make sure no queued up calls will fire after this.
        JSEvents.removeDeferredCalls(requestPointerLock);

        if (document.exitPointerLock) {
            document.exitPointerLock();
        } else if (document.msExitPointerLock) {
            document.msExitPointerLock();
        } else {
            return -1;
        }
        return 0;
    }
    _emscripten_exit_pointerlock.sig = 'i';

    function _emscripten_get_device_pixel_ratio() {
        return (typeof devicePixelRatio == 'number' && devicePixelRatio) || 1.0;
    }
    _emscripten_get_device_pixel_ratio.sig = 'd';

    function _emscripten_get_element_css_size(target, width, height) {
        target = findEventTarget(target);
        if (!target) return -4;

        var rect = getBoundingClientRect(target);
        HEAPF64[((width) >> 3)] = rect.width;
        HEAPF64[((height) >> 3)] = rect.height;

        return 0;
    }
    _emscripten_get_element_css_size.sig = 'iiii';

    function fillGamepadEventData(eventStruct, e) {
        HEAPF64[((eventStruct) >> 3)] = e.timestamp;
        for (var i = 0; i < e.axes.length; ++i) {
            HEAPF64[(((eventStruct + i * 8) + (16)) >> 3)] = e.axes[i];
        }
        for (var i = 0; i < e.buttons.length; ++i) {
            if (typeof e.buttons[i] == 'object') {
                HEAPF64[(((eventStruct + i * 8) + (528)) >> 3)] = e.buttons[i].value;
            } else {
                HEAPF64[(((eventStruct + i * 8) + (528)) >> 3)] = e.buttons[i];
            }
        }
        for (var i = 0; i < e.buttons.length; ++i) {
            if (typeof e.buttons[i] == 'object') {
                HEAP32[(((eventStruct + i * 4) + (1040)) >> 2)] = e.buttons[i].pressed;
            } else {
                // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
                /** @suppress {checkTypes} */
                HEAP32[(((eventStruct + i * 4) + (1040)) >> 2)] = e.buttons[i] == 1;
            }
        }
        HEAP32[(((eventStruct) + (1296)) >> 2)] = e.connected;
        HEAP32[(((eventStruct) + (1300)) >> 2)] = e.index;
        HEAP32[(((eventStruct) + (8)) >> 2)] = e.axes.length;
        HEAP32[(((eventStruct) + (12)) >> 2)] = e.buttons.length;
        stringToUTF8(e.id, eventStruct + 1304, 64);
        stringToUTF8(e.mapping, eventStruct + 1368, 64);
    }
    function _emscripten_get_gamepad_status(index, gamepadState) {
        if (!JSEvents.lastGamepadState) throw 'emscripten_get_gamepad_status() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';

        // INVALID_PARAM is returned on a Gamepad index that never was there.
        if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;

        // NO_DATA is returned on a Gamepad index that was removed.
        // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
        // This is because gamepads must keep their original position in the array.
        // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
        if (!JSEvents.lastGamepadState[index]) return -7;

        fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
        return 0;
    }
    _emscripten_get_gamepad_status.sig = 'iii';

    function _emscripten_get_heap_max() {
        return HEAPU8.length;
    }


    function _emscripten_get_num_gamepads() {
        if (!JSEvents.lastGamepadState) throw 'emscripten_get_num_gamepads() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
        // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
        // Otherwise the following line will throw an exception.
        return JSEvents.lastGamepadState.length;
    }
    _emscripten_get_num_gamepads.sig = 'i';

    function _emscripten_get_screen_size(width, height) {
        HEAP32[((width) >> 2)] = screen.width;
        HEAP32[((height) >> 2)] = screen.height;
    }
    _emscripten_get_screen_size.sig = 'vii';

    function _emscripten_glActiveTexture(x0) { GLctx['activeTexture'](x0) }
    _emscripten_glActiveTexture.sig = 'vi';

    function _emscripten_glAttachShader(program, shader) {
        GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    }
    _emscripten_glAttachShader.sig = 'vii';

    function _emscripten_glBeginQueryEXT(target, id) {
        GLctx.disjointTimerQueryExt['beginQueryEXT'](target, GL.queries[id]);
    }
    _emscripten_glBeginQueryEXT.sig = 'vii';

    function _emscripten_glBindAttribLocation(program, index, name) {
        GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    }
    _emscripten_glBindAttribLocation.sig = 'viii';

    function _emscripten_glBindBuffer(target, buffer) {

        GLctx.bindBuffer(target, GL.buffers[buffer]);
    }
    _emscripten_glBindBuffer.sig = 'vii';

    function _emscripten_glBindFramebuffer(target, framebuffer) {

        GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);

    }
    _emscripten_glBindFramebuffer.sig = 'vii';

    function _emscripten_glBindRenderbuffer(target, renderbuffer) {
        GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    }
    _emscripten_glBindRenderbuffer.sig = 'vii';

    function _emscripten_glBindTexture(target, texture) {
        GLctx.bindTexture(target, GL.textures[texture]);
    }
    _emscripten_glBindTexture.sig = 'vii';

    function _emscripten_glBindVertexArrayOES(vao) {
        GLctx['bindVertexArray'](GL.vaos[vao]);
    }
    _emscripten_glBindVertexArrayOES.sig = 'vi';

    function _emscripten_glBlendColor(x0, x1, x2, x3) { GLctx['blendColor'](x0, x1, x2, x3) }
    _emscripten_glBlendColor.sig = 'vffff';

    function _emscripten_glBlendEquation(x0) { GLctx['blendEquation'](x0) }
    _emscripten_glBlendEquation.sig = 'vi';

    function _emscripten_glBlendEquationSeparate(x0, x1) { GLctx['blendEquationSeparate'](x0, x1) }
    _emscripten_glBlendEquationSeparate.sig = 'vii';

    function _emscripten_glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }
    _emscripten_glBlendFunc.sig = 'vii';

    function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) { GLctx['blendFuncSeparate'](x0, x1, x2, x3) }
    _emscripten_glBlendFuncSeparate.sig = 'viiii';

    function _emscripten_glBufferData(target, size, data, usage) {

        // N.b. here first form specifies a heap subarray, second form an integer size, so the ?: code here is polymorphic. It is advised to avoid
        // randomly mixing both uses in calling code, to avoid any potential JS engine JIT issues.
        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage);
    }
    _emscripten_glBufferData.sig = 'viiii';

    function _emscripten_glBufferSubData(target, offset, size, data) {
        GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
    }
    _emscripten_glBufferSubData.sig = 'viiii';

    function _emscripten_glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }
    _emscripten_glCheckFramebufferStatus.sig = 'ii';

    function _emscripten_glClear(x0) { GLctx['clear'](x0) }
    _emscripten_glClear.sig = 'vi';

    function _emscripten_glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }
    _emscripten_glClearColor.sig = 'vffff';

    function _emscripten_glClearDepthf(x0) { GLctx['clearDepth'](x0) }
    _emscripten_glClearDepthf.sig = 'vf';

    function _emscripten_glClearStencil(x0) { GLctx['clearStencil'](x0) }
    _emscripten_glClearStencil.sig = 'vi';

    function _emscripten_glColorMask(red, green, blue, alpha) {
        GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }
    _emscripten_glColorMask.sig = 'viiii';

    function _emscripten_glCompileShader(shader) {
        GLctx.compileShader(GL.shaders[shader]);
    }
    _emscripten_glCompileShader.sig = 'vi';

    function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
        GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data), (data + imageSize)) : null);
    }
    _emscripten_glCompressedTexImage2D.sig = 'viiiiiiii';

    function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
        GLctx['compressedTexSubImage2D'](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data), (data + imageSize)) : null);
    }
    _emscripten_glCompressedTexSubImage2D.sig = 'viiiiiiiii';

    function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }
    _emscripten_glCopyTexImage2D.sig = 'viiiiiiii';

    function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexSubImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }
    _emscripten_glCopyTexSubImage2D.sig = 'viiiiiiii';

    function _emscripten_glCreateProgram() {
        var id = GL.getNewId(GL.programs);
        var program = GLctx.createProgram();
        // Store additional information needed for each shader program:
        program.name = id;
        // Lazy cache results of glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
        program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
        program.uniformIdCounter = 1;
        GL.programs[id] = program;
        return id;
    }
    _emscripten_glCreateProgram.sig = 'i';

    function _emscripten_glCreateShader(shaderType) {
        var id = GL.getNewId(GL.shaders);
        GL.shaders[id] = GLctx.createShader(shaderType);

        return id;
    }
    _emscripten_glCreateShader.sig = 'ii';

    function _emscripten_glCullFace(x0) { GLctx['cullFace'](x0) }
    _emscripten_glCullFace.sig = 'vi';

    function _emscripten_glDeleteBuffers(n, buffers) {
        for (var i = 0; i < n; i++) {
            var id = HEAP32[(((buffers) + (i * 4)) >> 2)];
            var buffer = GL.buffers[id];

            // From spec: "glDeleteBuffers silently ignores 0's and names that do not
            // correspond to existing buffer objects."
            if (!buffer) continue;

            GLctx.deleteBuffer(buffer);
            buffer.name = 0;
            GL.buffers[id] = null;

        }
    }
    _emscripten_glDeleteBuffers.sig = 'vii';

    function _emscripten_glDeleteFramebuffers(n, framebuffers) {
        for (var i = 0; i < n; ++i) {
            var id = HEAP32[(((framebuffers) + (i * 4)) >> 2)];
            var framebuffer = GL.framebuffers[id];
            if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
            GLctx.deleteFramebuffer(framebuffer);
            framebuffer.name = 0;
            GL.framebuffers[id] = null;
        }
    }
    _emscripten_glDeleteFramebuffers.sig = 'vii';

    function _emscripten_glDeleteProgram(id) {
        if (!id) return;
        var program = GL.programs[id];
        if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        GLctx.deleteProgram(program);
        program.name = 0;
        GL.programs[id] = null;
    }
    _emscripten_glDeleteProgram.sig = 'vi';

    function _emscripten_glDeleteQueriesEXT(n, ids) {
        for (var i = 0; i < n; i++) {
            var id = HEAP32[(((ids) + (i * 4)) >> 2)];
            var query = GL.queries[id];
            if (!query) continue; // GL spec: "unused names in ids are ignored, as is the name zero."
            GLctx.disjointTimerQueryExt['deleteQueryEXT'](query);
            GL.queries[id] = null;
        }
    }
    _emscripten_glDeleteQueriesEXT.sig = 'vii';

    function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
        for (var i = 0; i < n; i++) {
            var id = HEAP32[(((renderbuffers) + (i * 4)) >> 2)];
            var renderbuffer = GL.renderbuffers[id];
            if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
            GLctx.deleteRenderbuffer(renderbuffer);
            renderbuffer.name = 0;
            GL.renderbuffers[id] = null;
        }
    }
    _emscripten_glDeleteRenderbuffers.sig = 'vii';

    function _emscripten_glDeleteShader(id) {
        if (!id) return;
        var shader = GL.shaders[id];
        if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        GLctx.deleteShader(shader);
        GL.shaders[id] = null;
    }
    _emscripten_glDeleteShader.sig = 'vi';

    function _emscripten_glDeleteTextures(n, textures) {
        for (var i = 0; i < n; i++) {
            var id = HEAP32[(((textures) + (i * 4)) >> 2)];
            var texture = GL.textures[id];
            if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
            GLctx.deleteTexture(texture);
            texture.name = 0;
            GL.textures[id] = null;
        }
    }
    _emscripten_glDeleteTextures.sig = 'vii';

    function _emscripten_glDeleteVertexArraysOES(n, vaos) {
        for (var i = 0; i < n; i++) {
            var id = HEAP32[(((vaos) + (i * 4)) >> 2)];
            GLctx['deleteVertexArray'](GL.vaos[id]);
            GL.vaos[id] = null;
        }
    }
    _emscripten_glDeleteVertexArraysOES.sig = 'vii';

    function _emscripten_glDepthFunc(x0) { GLctx['depthFunc'](x0) }
    _emscripten_glDepthFunc.sig = 'vi';

    function _emscripten_glDepthMask(flag) {
        GLctx.depthMask(!!flag);
    }
    _emscripten_glDepthMask.sig = 'vi';

    function _emscripten_glDepthRangef(x0, x1) { GLctx['depthRange'](x0, x1) }
    _emscripten_glDepthRangef.sig = 'vii';

    function _emscripten_glDetachShader(program, shader) {
        GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
    }
    _emscripten_glDetachShader.sig = 'vii';

    function _emscripten_glDisable(x0) { GLctx['disable'](x0) }
    _emscripten_glDisable.sig = 'vi';

    function _emscripten_glDisableVertexAttribArray(index) {
        GLctx.disableVertexAttribArray(index);
    }
    _emscripten_glDisableVertexAttribArray.sig = 'vi';

    function _emscripten_glDrawArrays(mode, first, count) {

        GLctx.drawArrays(mode, first, count);

    }
    _emscripten_glDrawArrays.sig = 'viii';

    function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
        GLctx['drawArraysInstanced'](mode, first, count, primcount);
    }
    _emscripten_glDrawArraysInstancedANGLE.sig = 'viiii';

    var tempFixedLengthArray = [];
    function _emscripten_glDrawBuffersWEBGL(n, bufs) {

        var bufArray = tempFixedLengthArray[n];
        for (var i = 0; i < n; i++) {
            bufArray[i] = HEAP32[(((bufs) + (i * 4)) >> 2)];
        }

        GLctx['drawBuffers'](bufArray);
    }
    _emscripten_glDrawBuffersWEBGL.sig = 'vii';

    function _emscripten_glDrawElements(mode, count, type, indices) {

        GLctx.drawElements(mode, count, type, indices);

    }
    _emscripten_glDrawElements.sig = 'viiii';

    function _emscripten_glDrawElementsInstancedANGLE(mode, count, type, indices, primcount) {
        GLctx['drawElementsInstanced'](mode, count, type, indices, primcount);
    }
    _emscripten_glDrawElementsInstancedANGLE.sig = 'viiiii';

    function _emscripten_glEnable(x0) { GLctx['enable'](x0) }
    _emscripten_glEnable.sig = 'vi';

    function _emscripten_glEnableVertexAttribArray(index) {
        GLctx.enableVertexAttribArray(index);
    }
    _emscripten_glEnableVertexAttribArray.sig = 'vi';

    function _emscripten_glEndQueryEXT(target) {
        GLctx.disjointTimerQueryExt['endQueryEXT'](target);
    }
    _emscripten_glEndQueryEXT.sig = 'vi';

    function _emscripten_glFinish() { GLctx['finish']() }
    _emscripten_glFinish.sig = 'v';

    function _emscripten_glFlush() { GLctx['flush']() }
    _emscripten_glFlush.sig = 'v';

    function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
        GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
            GL.renderbuffers[renderbuffer]);
    }
    _emscripten_glFramebufferRenderbuffer.sig = 'viiii';

    function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
        GLctx.framebufferTexture2D(target, attachment, textarget,
            GL.textures[texture], level);
    }
    _emscripten_glFramebufferTexture2D.sig = 'viiiii';

    function _emscripten_glFrontFace(x0) { GLctx['frontFace'](x0) }
    _emscripten_glFrontFace.sig = 'vi';

    function __glGenObject(n, buffers, createFunction, objectTable
    ) {
        for (var i = 0; i < n; i++) {
            var buffer = GLctx[createFunction]();
            var id = buffer && GL.getNewId(objectTable);
            if (buffer) {
                buffer.name = id;
                objectTable[id] = buffer;
            } else {
                GL.recordError(0x502 /* GL_INVALID_OPERATION */);
            }
            HEAP32[(((buffers) + (i * 4)) >> 2)] = id;
        }
    }
    __glGenObject.sig = 'vii';
    function _emscripten_glGenBuffers(n, buffers) {
        __glGenObject(n, buffers, 'createBuffer', GL.buffers
        );
    }
    _emscripten_glGenBuffers.sig = 'vii';

    function _emscripten_glGenFramebuffers(n, ids) {
        __glGenObject(n, ids, 'createFramebuffer', GL.framebuffers
        );
    }
    _emscripten_glGenFramebuffers.sig = 'vii';

    function _emscripten_glGenQueriesEXT(n, ids) {
        for (var i = 0; i < n; i++) {
            var query = GLctx.disjointTimerQueryExt['createQueryEXT']();
            if (!query) {
                GL.recordError(0x502 /* GL_INVALID_OPERATION */);
                while (i < n) HEAP32[(((ids) + (i++ * 4)) >> 2)] = 0;
                return;
            }
            var id = GL.getNewId(GL.queries);
            query.name = id;
            GL.queries[id] = query;
            HEAP32[(((ids) + (i * 4)) >> 2)] = id;
        }
    }
    _emscripten_glGenQueriesEXT.sig = 'vii';

    function _emscripten_glGenRenderbuffers(n, renderbuffers) {
        __glGenObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers
        );
    }
    _emscripten_glGenRenderbuffers.sig = 'vii';

    function _emscripten_glGenTextures(n, textures) {
        __glGenObject(n, textures, 'createTexture', GL.textures
        );
    }
    _emscripten_glGenTextures.sig = 'vii';

    function _emscripten_glGenVertexArraysOES(n, arrays) {
        __glGenObject(n, arrays, 'createVertexArray', GL.vaos
        );
    }
    _emscripten_glGenVertexArraysOES.sig = 'vii';

    function _emscripten_glGenerateMipmap(x0) { GLctx['generateMipmap'](x0) }
    _emscripten_glGenerateMipmap.sig = 'vi';

    function __glGetActiveAttribOrUniform(funcName, program, index, bufSize, length, size, type, name) {
        program = GL.programs[program];
        var info = GLctx[funcName](program, index);
        if (info) { // If an error occurs, nothing will be written to length, size and type and name.
            var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
            if (length) HEAP32[((length) >> 2)] = numBytesWrittenExclNull;
            if (size) HEAP32[((size) >> 2)] = info.size;
            if (type) HEAP32[((type) >> 2)] = info.type;
        }
    }
    function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
        __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);
    }
    _emscripten_glGetActiveAttrib.sig = 'viiiiiii';

    function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
        __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);
    }
    _emscripten_glGetActiveUniform.sig = 'viiiiiii';

    function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
        var result = GLctx.getAttachedShaders(GL.programs[program]);
        var len = result.length;
        if (len > maxCount) {
            len = maxCount;
        }
        HEAP32[((count) >> 2)] = len;
        for (var i = 0; i < len; ++i) {
            var id = GL.shaders.indexOf(result[i]);
            HEAP32[(((shaders) + (i * 4)) >> 2)] = id;
        }
    }
    _emscripten_glGetAttachedShaders.sig = 'viiii';

    function _emscripten_glGetAttribLocation(program, name) {
        return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
    }
    _emscripten_glGetAttribLocation.sig = 'iii';

    function readI53FromI64(ptr) {
        return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
    }

    function readI53FromU64(ptr) {
        return HEAPU32[ptr >> 2] + HEAPU32[ptr + 4 >> 2] * 4294967296;
    }
    function writeI53ToI64(ptr, num) {
        HEAPU32[ptr >> 2] = num;
        HEAPU32[ptr + 4 >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296;
        var deserialized = (num >= 0) ? readI53FromU64(ptr) : readI53FromI64(ptr);
        if (deserialized != num) warnOnce('writeI53ToI64() out of range: serialized JS Number ' + num + ' to Wasm heap as bytes lo=0x' + HEAPU32[ptr >> 2].toString(16) + ', hi=0x' + HEAPU32[ptr + 4 >> 2].toString(16) + ', which deserializes back to ' + deserialized + ' instead!');
    }
    function emscriptenWebGLGet(name_, p, type) {
        // Guard against user passing a null pointer.
        // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
        // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
        // better to report an error instead of doing anything random.
        if (!p) {
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var ret = undefined;
        switch (name_) { // Handle a few trivial GLES values
            case 0x8DFA: // GL_SHADER_COMPILER
                ret = 1;
                break;
            case 0x8DF8: // GL_SHADER_BINARY_FORMATS
                if (type != 0 && type != 1) {
                    GL.recordError(0x500); // GL_INVALID_ENUM
                }
                return; // Do not write anything to the out pointer, since no binary formats are supported.
            case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
                ret = 0;
                break;
            case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
                // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
                // so implement it ourselves to allow C++ GLES2 code get the length.
                var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
                ret = formats ? formats.length : 0;
                break;

        }

        if (ret === undefined) {
            var result = GLctx.getParameter(name_);
            switch (typeof result) {
                case "number":
                    ret = result;
                    break;
                case "boolean":
                    ret = result ? 1 : 0;
                    break;
                case "string":
                    GL.recordError(0x500); // GL_INVALID_ENUM
                    return;
                case "object":
                    if (result === null) {
                        // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
                        // can mean an invalid name_, which we need to report as an error
                        switch (name_) {
                            case 0x8894: // ARRAY_BUFFER_BINDING
                            case 0x8B8D: // CURRENT_PROGRAM
                            case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                            case 0x8CA6: // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
                            case 0x8CA7: // RENDERBUFFER_BINDING
                            case 0x8069: // TEXTURE_BINDING_2D
                            case 0x85B5: // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
                            case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                                ret = 0;
                                break;
                            }
                            default: {
                                GL.recordError(0x500); // GL_INVALID_ENUM
                                return;
                            }
                        }
                    } else if (result instanceof Float32Array ||
                        result instanceof Uint32Array ||
                        result instanceof Int32Array ||
                        result instanceof Array) {
                        for (var i = 0; i < result.length; ++i) {
                            switch (type) {
                                case 0: HEAP32[(((p) + (i * 4)) >> 2)] = result[i]; break;
                                case 2: HEAPF32[(((p) + (i * 4)) >> 2)] = result[i]; break;
                                case 4: HEAP8[(((p) + (i)) >> 0)] = result[i] ? 1 : 0; break;
                            }
                        }
                        return;
                    } else {
                        try {
                            ret = result.name | 0;
                        } catch (e) {
                            GL.recordError(0x500); // GL_INVALID_ENUM
                            err('GL_INVALID_ENUM in glGet' + type + 'v: Unknown object returned from WebGL getParameter(' + name_ + ')! (error: ' + e + ')');
                            return;
                        }
                    }
                    break;
                default:
                    GL.recordError(0x500); // GL_INVALID_ENUM
                    err('GL_INVALID_ENUM in glGet' + type + 'v: Native code calling glGet' + type + 'v(' + name_ + ') and it returns ' + result + ' of type ' + typeof (result) + '!');
                    return;
            }
        }

        switch (type) {
            case 1: writeI53ToI64(p, ret); break;
            case 0: HEAP32[((p) >> 2)] = ret; break;
            case 2: HEAPF32[((p) >> 2)] = ret; break;
            case 4: HEAP8[((p) >> 0)] = ret ? 1 : 0; break;
        }
    }
    function _emscripten_glGetBooleanv(name_, p) {
        emscriptenWebGLGet(name_, p, 4);
    }
    _emscripten_glGetBooleanv.sig = 'vii';

    function _emscripten_glGetBufferParameteriv(target, value, data) {
        if (!data) {
            // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
            // if data == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAP32[((data) >> 2)] = GLctx.getBufferParameter(target, value);
    }
    _emscripten_glGetBufferParameteriv.sig = 'viii';

    function _emscripten_glGetError() {
        var error = GLctx.getError() || GL.lastError;
        GL.lastError = 0/*GL_NO_ERROR*/;
        return error;
    }
    _emscripten_glGetError.sig = 'i';

    function _emscripten_glGetFloatv(name_, p) {
        emscriptenWebGLGet(name_, p, 2);
    }
    _emscripten_glGetFloatv.sig = 'vii';

    function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
        var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
        if (result instanceof WebGLRenderbuffer ||
            result instanceof WebGLTexture) {
            result = result.name | 0;
        }
        HEAP32[((params) >> 2)] = result;
    }
    _emscripten_glGetFramebufferAttachmentParameteriv.sig = 'viiii';

    function _emscripten_glGetIntegerv(name_, p) {
        emscriptenWebGLGet(name_, p, 0);
    }
    _emscripten_glGetIntegerv.sig = 'vii';

    function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
        if (length) HEAP32[((length) >> 2)] = numBytesWrittenExclNull;
    }
    _emscripten_glGetProgramInfoLog.sig = 'viiii';

    function _emscripten_glGetProgramiv(program, pname, p) {
        if (!p) {
            // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }

        if (program >= GL.counter) {
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }

        program = GL.programs[program];

        if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
            var log = GLctx.getProgramInfoLog(program);
            if (log === null) log = '(unknown error)';
            HEAP32[((p) >> 2)] = log.length + 1;
        } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
            if (!program.maxUniformLength) {
                for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/); ++i) {
                    program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
                }
            }
            HEAP32[((p) >> 2)] = program.maxUniformLength;
        } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
            if (!program.maxAttributeLength) {
                for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/); ++i) {
                    program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
                }
            }
            HEAP32[((p) >> 2)] = program.maxAttributeLength;
        } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
            if (!program.maxUniformBlockNameLength) {
                for (var i = 0; i < GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/); ++i) {
                    program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
                }
            }
            HEAP32[((p) >> 2)] = program.maxUniformBlockNameLength;
        } else {
            HEAP32[((p) >> 2)] = GLctx.getProgramParameter(program, pname);
        }
    }
    _emscripten_glGetProgramiv.sig = 'viii';

    function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var query = GL.queries[id];
        var param;
        {
            param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        }
        var ret;
        if (typeof param == 'boolean') {
            ret = param ? 1 : 0;
        } else {
            ret = param;
        }
        writeI53ToI64(params, ret);
    }
    _emscripten_glGetQueryObjecti64vEXT.sig = 'viii';

    function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var query = GL.queries[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
            ret = param ? 1 : 0;
        } else {
            ret = param;
        }
        HEAP32[((params) >> 2)] = ret;
    }
    _emscripten_glGetQueryObjectivEXT.sig = 'viii';

    function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var query = GL.queries[id];
        var param;
        {
            param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        }
        var ret;
        if (typeof param == 'boolean') {
            ret = param ? 1 : 0;
        } else {
            ret = param;
        }
        writeI53ToI64(params, ret);
    }
    _emscripten_glGetQueryObjectui64vEXT.sig = 'viii';

    function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var query = GL.queries[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
            ret = param ? 1 : 0;
        } else {
            ret = param;
        }
        HEAP32[((params) >> 2)] = ret;
    }
    _emscripten_glGetQueryObjectuivEXT.sig = 'viii';

    function _emscripten_glGetQueryivEXT(target, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAP32[((params) >> 2)] = GLctx.disjointTimerQueryExt['getQueryEXT'](target, pname);
    }
    _emscripten_glGetQueryivEXT.sig = 'viii';

    function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if params == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAP32[((params) >> 2)] = GLctx.getRenderbufferParameter(target, pname);
    }
    _emscripten_glGetRenderbufferParameteriv.sig = 'viii';

    function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
        if (length) HEAP32[((length) >> 2)] = numBytesWrittenExclNull;
    }
    _emscripten_glGetShaderInfoLog.sig = 'viiii';

    function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
        var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
        HEAP32[((range) >> 2)] = result.rangeMin;
        HEAP32[(((range) + (4)) >> 2)] = result.rangeMax;
        HEAP32[((precision) >> 2)] = result.precision;
    }
    _emscripten_glGetShaderPrecisionFormat.sig = 'viiii';

    function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
        var result = GLctx.getShaderSource(GL.shaders[shader]);
        if (!result) return; // If an error occurs, nothing will be written to length or source.
        var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
        if (length) HEAP32[((length) >> 2)] = numBytesWrittenExclNull;
    }
    _emscripten_glGetShaderSource.sig = 'viiii';

    function _emscripten_glGetShaderiv(shader, pname, p) {
        if (!p) {
            // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
            var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
            if (log === null) log = '(unknown error)';
            // The GLES2 specification says that if the shader has an empty info log,
            // a value of 0 is returned. Otherwise the log has a null char appended.
            // (An empty string is falsey, so we can just check that instead of
            // looking at log.length.)
            var logLength = log ? log.length + 1 : 0;
            HEAP32[((p) >> 2)] = logLength;
        } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
            var source = GLctx.getShaderSource(GL.shaders[shader]);
            // source may be a null, or the empty string, both of which are falsey
            // values that we report a 0 length for.
            var sourceLength = source ? source.length + 1 : 0;
            HEAP32[((p) >> 2)] = sourceLength;
        } else {
            HEAP32[((p) >> 2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
        }
    }
    _emscripten_glGetShaderiv.sig = 'viii';

    function stringToNewUTF8(jsString) {
        var length = lengthBytesUTF8(jsString) + 1;
        var cString = _malloc(length);
        stringToUTF8(jsString, cString, length);
        return cString;
    }
    function _emscripten_glGetString(name_) {
        var ret = GL.stringCache[name_];
        if (!ret) {
            switch (name_) {
                case 0x1F03 /* GL_EXTENSIONS */:
                    var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
                    exts = exts.concat(exts.map(function (e) { return "GL_" + e; }));
                    ret = stringToNewUTF8(exts.join(' '));
                    break;
                case 0x1F00 /* GL_VENDOR */:
                case 0x1F01 /* GL_RENDERER */:
                case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
                case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
                    var s = GLctx.getParameter(name_);
                    if (!s) {
                        GL.recordError(0x500/*GL_INVALID_ENUM*/);
                    }
                    ret = s && stringToNewUTF8(s);
                    break;

                case 0x1F02 /* GL_VERSION */:
                    var glVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
                    // return GLES version string corresponding to the version of the WebGL context
                    {
                        glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
                    }
                    ret = stringToNewUTF8(glVersion);
                    break;
                case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
                    var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
                    // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
                    var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                    var ver_num = glslVersion.match(ver_re);
                    if (ver_num !== null) {
                        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
                        glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
                    }
                    ret = stringToNewUTF8(glslVersion);
                    break;
                default:
                    GL.recordError(0x500/*GL_INVALID_ENUM*/);
                // fall through
            }
            GL.stringCache[name_] = ret;
        }
        return ret;
    }
    _emscripten_glGetString.sig = 'ii';

    function _emscripten_glGetTexParameterfv(target, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAPF32[((params) >> 2)] = GLctx.getTexParameter(target, pname);
    }
    _emscripten_glGetTexParameterfv.sig = 'viii';

    function _emscripten_glGetTexParameteriv(target, pname, params) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if p == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAP32[((params) >> 2)] = GLctx.getTexParameter(target, pname);
    }
    _emscripten_glGetTexParameteriv.sig = 'viii';

    /** @suppress {checkTypes} */
    function jstoi_q(str) {
        return parseInt(str);
    }

    /** @noinline */
    function webglGetLeftBracePos(name) {
        return name.slice(-1) == ']' && name.lastIndexOf('[');
    }
    function webglPrepareUniformLocationsBeforeFirstUse(program) {
        var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
            uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
            i, j;

        // On the first time invocation of glGetUniformLocation on this shader program:
        // initialize cache data structures and discover which uniforms are arrays.
        if (!uniformLocsById) {
            // maps GLint integer locations to WebGLUniformLocations
            program.uniformLocsById = uniformLocsById = {};
            // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
            program.uniformArrayNamesById = {};

            for (i = 0; i < GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/); ++i) {
                var u = GLctx.getActiveUniform(program, i);
                var nm = u.name;
                var sz = u.size;
                var lb = webglGetLeftBracePos(nm);
                var arrayName = lb > 0 ? nm.slice(0, lb) : nm;

                // Assign a new location.
                var id = program.uniformIdCounter;
                program.uniformIdCounter += sz;
                // Eagerly get the location of the uniformArray[0] base element.
                // The remaining indices >0 will be left for lazy evaluation to
                // improve performance. Those may never be needed to fetch, if the
                // application fills arrays always in full starting from the first
                // element of the array.
                uniformSizeAndIdsByName[arrayName] = [sz, id];

                // Store placeholder integers in place that highlight that these
                // >0 index locations are array indices pending population.
                for (j = 0; j < sz; ++j) {
                    uniformLocsById[id] = j;
                    program.uniformArrayNamesById[id++] = arrayName;
                }
            }
        }
    }
    function _emscripten_glGetUniformLocation(program, name) {

        name = UTF8ToString(name);

        if (program = GL.programs[program]) {
            webglPrepareUniformLocationsBeforeFirstUse(program);
            var uniformLocsById = program.uniformLocsById; // Maps GLuint -> WebGLUniformLocation
            var arrayIndex = 0;
            var uniformBaseName = name;

            // Invariant: when populating integer IDs for uniform locations, we must maintain the precondition that
            // arrays reside in contiguous addresses, i.e. for a 'vec4 colors[10];', colors[4] must be at location colors[0]+4.
            // However, user might call glGetUniformLocation(program, "colors") for an array, so we cannot discover based on the user
            // input arguments whether the uniform we are dealing with is an array. The only way to discover which uniforms are arrays
            // is to enumerate over all the active uniforms in the program.
            var leftBrace = webglGetLeftBracePos(name);

            // If user passed an array accessor "[index]", parse the array index off the accessor.
            if (leftBrace > 0) {
                arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0; // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
                uniformBaseName = name.slice(0, leftBrace);
            }

            // Have we cached the location of this uniform before?
            var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName]; // A pair [array length, GLint of the uniform location]

            // If an uniform with this name exists, and if its index is within the array limits (if it's even an array),
            // query the WebGLlocation, or return an existing cached location.
            if (sizeAndId && arrayIndex < sizeAndId[0]) {
                arrayIndex += sizeAndId[1]; // Add the base location of the uniform to the array index offset.
                if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
                    return arrayIndex;
                }
            }
        }
        else {
            // N.b. we are currently unable to distinguish between GL program IDs that never existed vs GL program IDs that have been deleted,
            // so report GL_INVALID_VALUE in both cases.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
        }
        return -1;
    }
    _emscripten_glGetUniformLocation.sig = 'iii';

    function webglGetUniformLocation(location) {
        var p = GLctx.currentProgram;

        if (p) {
            var webglLoc = p.uniformLocsById[location];
            // p.uniformLocsById[location] stores either an integer, or a WebGLUniformLocation.

            // If an integer, we have not yet bound the location, so do it now. The integer value specifies the array index
            // we should bind to.
            if (typeof webglLoc == 'number') {
                p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? '[' + webglLoc + ']' : ''));
            }
            // Else an already cached WebGLUniformLocation, return it.
            return webglLoc;
        } else {
            GL.recordError(0x502/*GL_INVALID_OPERATION*/);
        }
    }
    /** @suppress{checkTypes} */
    function emscriptenWebGLGetUniform(program, location, params, type) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if params == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        program = GL.programs[program];
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var data = GLctx.getUniform(program, webglGetUniformLocation(location));
        if (typeof data == 'number' || typeof data == 'boolean') {
            switch (type) {
                case 0: HEAP32[((params) >> 2)] = data; break;
                case 2: HEAPF32[((params) >> 2)] = data; break;
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                switch (type) {
                    case 0: HEAP32[(((params) + (i * 4)) >> 2)] = data[i]; break;
                    case 2: HEAPF32[(((params) + (i * 4)) >> 2)] = data[i]; break;
                }
            }
        }
    }
    function _emscripten_glGetUniformfv(program, location, params) {
        emscriptenWebGLGetUniform(program, location, params, 2);
    }
    _emscripten_glGetUniformfv.sig = 'viii';

    function _emscripten_glGetUniformiv(program, location, params) {
        emscriptenWebGLGetUniform(program, location, params, 0);
    }
    _emscripten_glGetUniformiv.sig = 'viii';

    function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
        if (!pointer) {
            // GLES2 specification does not specify how to behave if pointer is a null pointer. Since calling this function does not make sense
            // if pointer == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        HEAP32[((pointer) >> 2)] = GLctx.getVertexAttribOffset(index, pname);
    }
    _emscripten_glGetVertexAttribPointerv.sig = 'viii';

    /** @suppress{checkTypes} */
    function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
        if (!params) {
            // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
            // if params == null, issue a GL error to notify user about it.
            GL.recordError(0x501 /* GL_INVALID_VALUE */);
            return;
        }
        var data = GLctx.getVertexAttrib(index, pname);
        if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
            HEAP32[((params) >> 2)] = data && data["name"];
        } else if (typeof data == 'number' || typeof data == 'boolean') {
            switch (type) {
                case 0: HEAP32[((params) >> 2)] = data; break;
                case 2: HEAPF32[((params) >> 2)] = data; break;
                case 5: HEAP32[((params) >> 2)] = Math.fround(data); break;
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                switch (type) {
                    case 0: HEAP32[(((params) + (i * 4)) >> 2)] = data[i]; break;
                    case 2: HEAPF32[(((params) + (i * 4)) >> 2)] = data[i]; break;
                    case 5: HEAP32[(((params) + (i * 4)) >> 2)] = Math.fround(data[i]); break;
                }
            }
        }
    }
    function _emscripten_glGetVertexAttribfv(index, pname, params) {
        // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
        // otherwise the results are undefined. (GLES3 spec 6.1.12)
        emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
    }
    _emscripten_glGetVertexAttribfv.sig = 'viii';

    function _emscripten_glGetVertexAttribiv(index, pname, params) {
        // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
        // otherwise the results are undefined. (GLES3 spec 6.1.12)
        emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
    }
    _emscripten_glGetVertexAttribiv.sig = 'viii';

    function _emscripten_glHint(x0, x1) { GLctx['hint'](x0, x1) }
    _emscripten_glHint.sig = 'vii';

    function _emscripten_glIsBuffer(buffer) {
        var b = GL.buffers[buffer];
        if (!b) return 0;
        return GLctx.isBuffer(b);
    }
    _emscripten_glIsBuffer.sig = 'ii';

    function _emscripten_glIsEnabled(x0) { return GLctx['isEnabled'](x0) }
    _emscripten_glIsEnabled.sig = 'ii';

    function _emscripten_glIsFramebuffer(framebuffer) {
        var fb = GL.framebuffers[framebuffer];
        if (!fb) return 0;
        return GLctx.isFramebuffer(fb);
    }
    _emscripten_glIsFramebuffer.sig = 'ii';

    function _emscripten_glIsProgram(program) {
        program = GL.programs[program];
        if (!program) return 0;
        return GLctx.isProgram(program);
    }
    _emscripten_glIsProgram.sig = 'ii';

    function _emscripten_glIsQueryEXT(id) {
        var query = GL.queries[id];
        if (!query) return 0;
        return GLctx.disjointTimerQueryExt['isQueryEXT'](query);
    }
    _emscripten_glIsQueryEXT.sig = 'ii';

    function _emscripten_glIsRenderbuffer(renderbuffer) {
        var rb = GL.renderbuffers[renderbuffer];
        if (!rb) return 0;
        return GLctx.isRenderbuffer(rb);
    }
    _emscripten_glIsRenderbuffer.sig = 'ii';

    function _emscripten_glIsShader(shader) {
        var s = GL.shaders[shader];
        if (!s) return 0;
        return GLctx.isShader(s);
    }
    _emscripten_glIsShader.sig = 'ii';

    function _emscripten_glIsTexture(id) {
        var texture = GL.textures[id];
        if (!texture) return 0;
        return GLctx.isTexture(texture);
    }
    _emscripten_glIsTexture.sig = 'ii';

    function _emscripten_glIsVertexArrayOES(array) {

        var vao = GL.vaos[array];
        if (!vao) return 0;
        return GLctx['isVertexArray'](vao);
    }
    _emscripten_glIsVertexArrayOES.sig = 'ii';

    function _emscripten_glLineWidth(x0) { GLctx['lineWidth'](x0) }
    _emscripten_glLineWidth.sig = 'vf';

    function _emscripten_glLinkProgram(program) {
        program = GL.programs[program];
        GLctx.linkProgram(program);
        // Invalidate earlier computed uniform->ID mappings, those have now become stale
        program.uniformLocsById = 0; // Mark as null-like so that glGetUniformLocation() knows to populate this again.
        program.uniformSizeAndIdsByName = {};

    }
    _emscripten_glLinkProgram.sig = 'vi';

    function _emscripten_glPixelStorei(pname, param) {
        if (pname == 0xCF5 /* GL_UNPACK_ALIGNMENT */) {
            GL.unpackAlignment = param;
        }
        GLctx.pixelStorei(pname, param);
    }
    _emscripten_glPixelStorei.sig = 'vii';

    function _emscripten_glPolygonOffset(x0, x1) { GLctx['polygonOffset'](x0, x1) }
    _emscripten_glPolygonOffset.sig = 'vff';

    function _emscripten_glQueryCounterEXT(id, target) {
        GLctx.disjointTimerQueryExt['queryCounterEXT'](GL.queries[id], target);
    }
    _emscripten_glQueryCounterEXT.sig = 'vii';

    function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
        function roundedToNextMultipleOf(x, y) {
            return (x + y - 1) & -y;
        }
        var plainRowSize = width * sizePerPixel;
        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
        return height * alignedRowSize;
    }

    function __colorChannelsInGlTextureFormat(format) {
        // Micro-optimizations for size: map format to size by subtracting smallest enum value (0x1902) from all values first.
        // Also omit the most common size value (1) from the list, which is assumed by formats not on the list.
        var colorChannels = {
            // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
            // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
            5: 3,
            6: 4,
            // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
            8: 2,
            29502: 3,
            29504: 4,
        };
        return colorChannels[format - 0x1902] || 1;
    }

    function heapObjectForWebGLType(type) {
        // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
        // smaller values for the heap, for shorter generated code size.
        // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
        // (since most types are HEAPU16)
        type -= 0x1400;

        if (type == 1) return HEAPU8;

        if (type == 4) return HEAP32;

        if (type == 6) return HEAPF32;

        if (type == 5
            || type == 28922
        )
            return HEAPU32;

        return HEAPU16;
    }

    function heapAccessShiftForWebGLHeap(heap) {
        return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
    }
    function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
        var heap = heapObjectForWebGLType(type);
        var shift = heapAccessShiftForWebGLHeap(heap);
        var byteSize = 1 << shift;
        var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
        var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
        return heap.subarray(pixels >> shift, pixels + bytes >> shift);
    }
    function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
        var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
        if (!pixelData) {
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
            return;
        }
        GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }
    _emscripten_glReadPixels.sig = 'viiiiiii';

    function _emscripten_glReleaseShaderCompiler() {
        // NOP (as allowed by GLES 2.0 spec)
    }
    _emscripten_glReleaseShaderCompiler.sig = 'v';

    function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3) }
    _emscripten_glRenderbufferStorage.sig = 'viiii';

    function _emscripten_glSampleCoverage(value, invert) {
        GLctx.sampleCoverage(value, !!invert);
    }
    _emscripten_glSampleCoverage.sig = 'vii';

    function _emscripten_glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3) }
    _emscripten_glScissor.sig = 'viiii';

    function _emscripten_glShaderBinary() {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
    }
    _emscripten_glShaderBinary.sig = 'v';

    function _emscripten_glShaderSource(shader, count, string, length) {
        var source = GL.getSource(shader, count, string, length);

        GLctx.shaderSource(GL.shaders[shader], source);
    }
    _emscripten_glShaderSource.sig = 'viiii';

    function _emscripten_glStencilFunc(x0, x1, x2) { GLctx['stencilFunc'](x0, x1, x2) }
    _emscripten_glStencilFunc.sig = 'viii';

    function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) { GLctx['stencilFuncSeparate'](x0, x1, x2, x3) }
    _emscripten_glStencilFuncSeparate.sig = 'viiii';

    function _emscripten_glStencilMask(x0) { GLctx['stencilMask'](x0) }
    _emscripten_glStencilMask.sig = 'vi';

    function _emscripten_glStencilMaskSeparate(x0, x1) { GLctx['stencilMaskSeparate'](x0, x1) }
    _emscripten_glStencilMaskSeparate.sig = 'vii';

    function _emscripten_glStencilOp(x0, x1, x2) { GLctx['stencilOp'](x0, x1, x2) }
    _emscripten_glStencilOp.sig = 'viii';

    function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) { GLctx['stencilOpSeparate'](x0, x1, x2, x3) }
    _emscripten_glStencilOpSeparate.sig = 'viiii';

    function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
        GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
    }
    _emscripten_glTexImage2D.sig = 'viiiiiiiii';

    function _emscripten_glTexParameterf(x0, x1, x2) { GLctx['texParameterf'](x0, x1, x2) }
    _emscripten_glTexParameterf.sig = 'viii';

    function _emscripten_glTexParameterfv(target, pname, params) {
        var param = HEAPF32[((params) >> 2)];
        GLctx.texParameterf(target, pname, param);
    }
    _emscripten_glTexParameterfv.sig = 'viii';

    function _emscripten_glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }
    _emscripten_glTexParameteri.sig = 'viii';

    function _emscripten_glTexParameteriv(target, pname, params) {
        var param = HEAP32[((params) >> 2)];
        GLctx.texParameteri(target, pname, param);
    }
    _emscripten_glTexParameteriv.sig = 'viii';

    function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
        var pixelData = null;
        if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
        GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    }
    _emscripten_glTexSubImage2D.sig = 'viiiiiiiii';

    function _emscripten_glUniform1f(location, v0) {
        GLctx.uniform1f(webglGetUniformLocation(location), v0);
    }
    _emscripten_glUniform1f.sig = 'vif';

    var miniTempWebGLFloatBuffers = [];
    function _emscripten_glUniform1fv(location, count, value) {

        if (count <= 288) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[count - 1];
            for (var i = 0; i < count; ++i) {
                view[i] = HEAPF32[(((value) + (4 * i)) >> 2)];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 4) >> 2);
        }
        GLctx.uniform1fv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform1fv.sig = 'viii';

    function _emscripten_glUniform1i(location, v0) {
        GLctx.uniform1i(webglGetUniformLocation(location), v0);
    }
    _emscripten_glUniform1i.sig = 'vii';

    var __miniTempWebGLIntBuffers = [];
    function _emscripten_glUniform1iv(location, count, value) {

        if (count <= 288) {
            // avoid allocation when uploading few enough uniforms
            var view = __miniTempWebGLIntBuffers[count - 1];
            for (var i = 0; i < count; ++i) {
                view[i] = HEAP32[(((value) + (4 * i)) >> 2)];
            }
        } else {
            var view = HEAP32.subarray((value) >> 2, (value + count * 4) >> 2);
        }
        GLctx.uniform1iv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform1iv.sig = 'viii';

    function _emscripten_glUniform2f(location, v0, v1) {
        GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
    }
    _emscripten_glUniform2f.sig = 'viff';

    function _emscripten_glUniform2fv(location, count, value) {

        if (count <= 144) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[2 * count - 1];
            for (var i = 0; i < 2 * count; i += 2) {
                view[i] = HEAPF32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >> 2)];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 8) >> 2);
        }
        GLctx.uniform2fv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform2fv.sig = 'viii';

    function _emscripten_glUniform2i(location, v0, v1) {
        GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
    }
    _emscripten_glUniform2i.sig = 'viii';

    function _emscripten_glUniform2iv(location, count, value) {

        if (count <= 144) {
            // avoid allocation when uploading few enough uniforms
            var view = __miniTempWebGLIntBuffers[2 * count - 1];
            for (var i = 0; i < 2 * count; i += 2) {
                view[i] = HEAP32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >> 2)];
            }
        } else {
            var view = HEAP32.subarray((value) >> 2, (value + count * 8) >> 2);
        }
        GLctx.uniform2iv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform2iv.sig = 'viii';

    function _emscripten_glUniform3f(location, v0, v1, v2) {
        GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
    }
    _emscripten_glUniform3f.sig = 'vifff';

    function _emscripten_glUniform3fv(location, count, value) {

        if (count <= 96) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[3 * count - 1];
            for (var i = 0; i < 3 * count; i += 3) {
                view[i] = HEAPF32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >> 2)];
                view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >> 2)];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 12) >> 2);
        }
        GLctx.uniform3fv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform3fv.sig = 'viii';

    function _emscripten_glUniform3i(location, v0, v1, v2) {
        GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
    }
    _emscripten_glUniform3i.sig = 'viiii';

    function _emscripten_glUniform3iv(location, count, value) {

        if (count <= 96) {
            // avoid allocation when uploading few enough uniforms
            var view = __miniTempWebGLIntBuffers[3 * count - 1];
            for (var i = 0; i < 3 * count; i += 3) {
                view[i] = HEAP32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >> 2)];
                view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >> 2)];
            }
        } else {
            var view = HEAP32.subarray((value) >> 2, (value + count * 12) >> 2);
        }
        GLctx.uniform3iv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform3iv.sig = 'viii';

    function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
        GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
    }
    _emscripten_glUniform4f.sig = 'viffff';

    function _emscripten_glUniform4fv(location, count, value) {

        if (count <= 72) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[4 * count - 1];
            // hoist the heap out of the loop for size and for pthreads+growth.
            var heap = HEAPF32;
            value >>= 2;
            for (var i = 0; i < 4 * count; i += 4) {
                var dst = value + i;
                view[i] = heap[dst];
                view[i + 1] = heap[dst + 1];
                view[i + 2] = heap[dst + 2];
                view[i + 3] = heap[dst + 3];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 16) >> 2);
        }
        GLctx.uniform4fv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform4fv.sig = 'viii';

    function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
        GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
    }
    _emscripten_glUniform4i.sig = 'viiiii';

    function _emscripten_glUniform4iv(location, count, value) {

        if (count <= 72) {
            // avoid allocation when uploading few enough uniforms
            var view = __miniTempWebGLIntBuffers[4 * count - 1];
            for (var i = 0; i < 4 * count; i += 4) {
                view[i] = HEAP32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >> 2)];
                view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >> 2)];
                view[i + 3] = HEAP32[(((value) + (4 * i + 12)) >> 2)];
            }
        } else {
            var view = HEAP32.subarray((value) >> 2, (value + count * 16) >> 2);
        }
        GLctx.uniform4iv(webglGetUniformLocation(location), view);
    }
    _emscripten_glUniform4iv.sig = 'viii';

    function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {

        if (count <= 72) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[4 * count - 1];
            for (var i = 0; i < 4 * count; i += 4) {
                view[i] = HEAPF32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >> 2)];
                view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >> 2)];
                view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >> 2)];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 16) >> 2);
        }
        GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
    }
    _emscripten_glUniformMatrix2fv.sig = 'viiii';

    function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {

        if (count <= 32) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[9 * count - 1];
            for (var i = 0; i < 9 * count; i += 9) {
                view[i] = HEAPF32[(((value) + (4 * i)) >> 2)];
                view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >> 2)];
                view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >> 2)];
                view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >> 2)];
                view[i + 4] = HEAPF32[(((value) + (4 * i + 16)) >> 2)];
                view[i + 5] = HEAPF32[(((value) + (4 * i + 20)) >> 2)];
                view[i + 6] = HEAPF32[(((value) + (4 * i + 24)) >> 2)];
                view[i + 7] = HEAPF32[(((value) + (4 * i + 28)) >> 2)];
                view[i + 8] = HEAPF32[(((value) + (4 * i + 32)) >> 2)];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 36) >> 2);
        }
        GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
    }
    _emscripten_glUniformMatrix3fv.sig = 'viiii';

    function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {

        if (count <= 18) {
            // avoid allocation when uploading few enough uniforms
            var view = miniTempWebGLFloatBuffers[16 * count - 1];
            // hoist the heap out of the loop for size and for pthreads+growth.
            var heap = HEAPF32;
            value >>= 2;
            for (var i = 0; i < 16 * count; i += 16) {
                var dst = value + i;
                view[i] = heap[dst];
                view[i + 1] = heap[dst + 1];
                view[i + 2] = heap[dst + 2];
                view[i + 3] = heap[dst + 3];
                view[i + 4] = heap[dst + 4];
                view[i + 5] = heap[dst + 5];
                view[i + 6] = heap[dst + 6];
                view[i + 7] = heap[dst + 7];
                view[i + 8] = heap[dst + 8];
                view[i + 9] = heap[dst + 9];
                view[i + 10] = heap[dst + 10];
                view[i + 11] = heap[dst + 11];
                view[i + 12] = heap[dst + 12];
                view[i + 13] = heap[dst + 13];
                view[i + 14] = heap[dst + 14];
                view[i + 15] = heap[dst + 15];
            }
        } else {
            var view = HEAPF32.subarray((value) >> 2, (value + count * 64) >> 2);
        }
        GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
    }
    _emscripten_glUniformMatrix4fv.sig = 'viiii';

    function _emscripten_glUseProgram(program) {
        program = GL.programs[program];
        GLctx.useProgram(program);
        // Record the currently active program so that we can access the uniform
        // mapping table of that program.
        GLctx.currentProgram = program;
    }
    _emscripten_glUseProgram.sig = 'vi';

    function _emscripten_glValidateProgram(program) {
        GLctx.validateProgram(GL.programs[program]);
    }
    _emscripten_glValidateProgram.sig = 'vi';

    function _emscripten_glVertexAttrib1f(x0, x1) { GLctx['vertexAttrib1f'](x0, x1) }
    _emscripten_glVertexAttrib1f.sig = 'vif';

    function _emscripten_glVertexAttrib1fv(index, v) {

        GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
    }
    _emscripten_glVertexAttrib1fv.sig = 'vii';

    function _emscripten_glVertexAttrib2f(x0, x1, x2) { GLctx['vertexAttrib2f'](x0, x1, x2) }
    _emscripten_glVertexAttrib2f.sig = 'viff';

    function _emscripten_glVertexAttrib2fv(index, v) {

        GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2]);
    }
    _emscripten_glVertexAttrib2fv.sig = 'vii';

    function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) { GLctx['vertexAttrib3f'](x0, x1, x2, x3) }
    _emscripten_glVertexAttrib3f.sig = 'vifff';

    function _emscripten_glVertexAttrib3fv(index, v) {

        GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2]);
    }
    _emscripten_glVertexAttrib3fv.sig = 'vii';

    function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) { GLctx['vertexAttrib4f'](x0, x1, x2, x3, x4) }
    _emscripten_glVertexAttrib4f.sig = 'viffff';

    function _emscripten_glVertexAttrib4fv(index, v) {

        GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2]);
    }
    _emscripten_glVertexAttrib4fv.sig = 'vii';

    function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
        GLctx['vertexAttribDivisor'](index, divisor);
    }
    _emscripten_glVertexAttribDivisorANGLE.sig = 'vii';

    function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
        GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }
    _emscripten_glVertexAttribPointer.sig = 'viiiiii';

    function _emscripten_glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }
    _emscripten_glViewport.sig = 'viiii';

    function _emscripten_has_asyncify() {
        return false;
    }

    function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
    }

    function doRequestFullscreen(target, strategy) {
        if (!JSEvents.fullscreenEnabled()) return -1;
        target = findEventTarget(target);
        if (!target) return -4;

        if (!target.requestFullscreen
            && !target.webkitRequestFullscreen
        ) {
            return -3;
        }

        var canPerformRequests = JSEvents.canPerformEventHandlerRequests();

        // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
        if (!canPerformRequests) {
            if (strategy.deferUntilInEventHandler) {
                JSEvents.deferCall(_JSEvents_requestFullscreen, 1 /* priority over pointer lock */, [target, strategy]);
                return 1;
            } else {
                return -2;
            }
        }

        return _JSEvents_requestFullscreen(target, strategy);
    }
    function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
        var strategy = {
            scaleMode: HEAP32[((fullscreenStrategy) >> 2)],
            canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy) + (4)) >> 2)],
            filteringMode: HEAP32[(((fullscreenStrategy) + (8)) >> 2)],
            deferUntilInEventHandler: deferUntilInEventHandler,
            canvasResizedCallback: HEAP32[(((fullscreenStrategy) + (12)) >> 2)],
            canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy) + (16)) >> 2)]
        };

        return doRequestFullscreen(target, strategy);
    }
    _emscripten_request_fullscreen_strategy.sig = 'iiii';

    function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
        target = findEventTarget(target);
        if (!target) return -4;
        if (!target.requestPointerLock
            && !target.msRequestPointerLock
        ) {
            return -1;
        }

        var canPerformRequests = JSEvents.canPerformEventHandlerRequests();

        // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
        if (!canPerformRequests) {
            if (deferUntilInEventHandler) {
                JSEvents.deferCall(requestPointerLock, 2 /* priority below fullscreen */, [target]);
                return 1;
            } else {
                return -2;
            }
        }

        return requestPointerLock(target);
    }
    _emscripten_request_pointerlock.sig = 'iii';

    function abortOnCannotGrowMemory(requestedSize) {
        abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s INITIAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
    }
    function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        abortOnCannotGrowMemory(requestedSize);
    }

    function _emscripten_sample_gamepad_data() {
        return (JSEvents.lastGamepadState = (navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null)))
            ? 0 : -1;
    }
    _emscripten_sample_gamepad_data.sig = 'i';

    function registerBeforeUnloadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        var beforeUnloadEventHandlerFunc = function (ev) {
            var e = ev || event;

            // Note: This is always called on the main browser thread, since it needs synchronously return a value!
            var confirmationMessage = getWasmTableEntry(callbackfunc)(eventTypeId, 0, userData);

            if (confirmationMessage) {
                confirmationMessage = UTF8ToString(confirmationMessage);
            }
            if (confirmationMessage) {
                e.preventDefault();
                e.returnValue = confirmationMessage;
                return confirmationMessage;
            }
        };

        var eventHandler = {
            target: findEventTarget(target),
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: beforeUnloadEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
        if (typeof onbeforeunload == 'undefined') return -1;
        // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
        // and there is no time to start proxying it anywhere.
        if (targetThread !== 1) return -5;
        registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
        return 0;
    }
    _emscripten_set_beforeunload_callback_on_thread.sig = 'iii';

    function registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);

        var focusEventHandlerFunc = function (ev) {
            var e = ev || event;

            var nodeName = JSEvents.getNodeNameForTarget(e.target);
            var id = e.target.id ? e.target.id : '';

            var focusEvent = JSEvents.focusEvent;
            stringToUTF8(nodeName, focusEvent + 0, 128);
            stringToUTF8(id, focusEvent + 128, 128);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: findEventTarget(target),
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: focusEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
        return 0;
    }
    _emscripten_set_blur_callback_on_thread.sig = 'iiiiii';


    function _emscripten_set_element_css_size(target, width, height) {
        target = findEventTarget(target);
        if (!target) return -4;

        target.style.width = width + "px";
        target.style.height = height + "px";

        return 0;
    }
    _emscripten_set_element_css_size.sig = 'iiii';

    function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
        return 0;
    }
    _emscripten_set_focus_callback_on_thread.sig = 'iiiiii';

    function fillFullscreenChangeEventData(eventStruct) {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        var isFullscreen = !!fullscreenElement;
        // Assigning a boolean to HEAP32 with expected type coercion.
        /** @suppress{checkTypes} */
        HEAP32[((eventStruct) >> 2)] = isFullscreen;
        HEAP32[(((eventStruct) + (4)) >> 2)] = JSEvents.fullscreenEnabled();
        // If transitioning to fullscreen, report info about the element that is now fullscreen.
        // If transitioning to windowed mode, report info about the element that just was fullscreen.
        var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
        var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
        var id = (reportedElement && reportedElement.id) ? reportedElement.id : '';
        stringToUTF8(nodeName, eventStruct + 8, 128);
        stringToUTF8(id, eventStruct + 136, 128);
        HEAP32[(((eventStruct) + (264)) >> 2)] = reportedElement ? reportedElement.clientWidth : 0;
        HEAP32[(((eventStruct) + (268)) >> 2)] = reportedElement ? reportedElement.clientHeight : 0;
        HEAP32[(((eventStruct) + (272)) >> 2)] = screen.width;
        HEAP32[(((eventStruct) + (276)) >> 2)] = screen.height;
        if (isFullscreen) {
            JSEvents.previousFullscreenElement = fullscreenElement;
        }
    }
    function registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc(280);

        var fullscreenChangeEventhandlerFunc = function (ev) {
            var e = ev || event;

            var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;

            fillFullscreenChangeEventData(fullscreenChangeEvent);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: fullscreenChangeEventhandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        if (!JSEvents.fullscreenEnabled()) return -1;
        target = findEventTarget(target);
        if (!target) return -4;
        registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);

        // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
        // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
        registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);

        return 0;
    }
    _emscripten_set_fullscreenchange_callback_on_thread.sig = 'iiiiii';

    function registerGamepadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);

        var gamepadEventHandlerFunc = function (ev) {
            var e = ev || event;

            var gamepadEvent = JSEvents.gamepadEvent;
            fillGamepadEventData(gamepadEvent, e["gamepad"]);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, gamepadEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: findEventTarget(target),
            allowsDeferredCalls: true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: gamepadEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
        if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
        registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
        return 0;
    }
    _emscripten_set_gamepadconnected_callback_on_thread.sig = 'iiiii';

    function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
        if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
        registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
        return 0;
    }
    _emscripten_set_gamepaddisconnected_callback_on_thread.sig = 'iiiii';

    function registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(176);

        var keyEventHandlerFunc = function (e) {
            assert(e);

            var keyEventData = JSEvents.keyEvent;
            HEAPF64[((keyEventData) >> 3)] = e.timeStamp;

            var idx = keyEventData >> 2;

            HEAP32[idx + 2] = e.location;
            HEAP32[idx + 3] = e.ctrlKey;
            HEAP32[idx + 4] = e.shiftKey;
            HEAP32[idx + 5] = e.altKey;
            HEAP32[idx + 6] = e.metaKey;
            HEAP32[idx + 7] = e.repeat;
            HEAP32[idx + 8] = e.charCode;
            HEAP32[idx + 9] = e.keyCode;
            HEAP32[idx + 10] = e.which;
            stringToUTF8(e.key || '', keyEventData + 44, 32);
            stringToUTF8(e.code || '', keyEventData + 76, 32);
            stringToUTF8(e.char || '', keyEventData + 108, 32);
            stringToUTF8(e.locale || '', keyEventData + 140, 32);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: findEventTarget(target),
            allowsDeferredCalls: true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: keyEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
        return 0;
    }
    _emscripten_set_keydown_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
        return 0;
    }
    _emscripten_set_keypress_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
        return 0;
    }
    _emscripten_set_keyup_callback_on_thread.sig = 'iiiiii';

    function fillMouseEventData(eventStruct, e, target) {
        assert(eventStruct % 4 == 0);
        HEAPF64[((eventStruct) >> 3)] = e.timeStamp;
        var idx = eventStruct >> 2;
        HEAP32[idx + 2] = e.screenX;
        HEAP32[idx + 3] = e.screenY;
        HEAP32[idx + 4] = e.clientX;
        HEAP32[idx + 5] = e.clientY;
        HEAP32[idx + 6] = e.ctrlKey;
        HEAP32[idx + 7] = e.shiftKey;
        HEAP32[idx + 8] = e.altKey;
        HEAP32[idx + 9] = e.metaKey;
        HEAP16[idx * 2 + 20] = e.button;
        HEAP16[idx * 2 + 21] = e.buttons;

        HEAP32[idx + 11] = e["movementX"]
            ;

        HEAP32[idx + 12] = e["movementY"]
            ;

        var rect = getBoundingClientRect(target);
        HEAP32[idx + 13] = e.clientX - rect.left;
        HEAP32[idx + 14] = e.clientY - rect.top;

    }
    function registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
        target = findEventTarget(target);

        var mouseEventHandlerFunc = function (ev) {
            var e = ev || event;

            // TODO: Make this access thread safe, or this could update live while app is reading it.
            fillMouseEventData(JSEvents.mouseEvent, e, target);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: mouseEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
        return 0;
    }
    _emscripten_set_mousedown_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
        return 0;
    }
    _emscripten_set_mouseenter_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
        return 0;
    }
    _emscripten_set_mouseleave_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
        return 0;
    }
    _emscripten_set_mousemove_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
        return 0;
    }
    _emscripten_set_mouseup_callback_on_thread.sig = 'iiiiii';

    function fillPointerlockChangeEventData(eventStruct) {
        var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
        var isPointerlocked = !!pointerLockElement;
        // Assigning a boolean to HEAP32 with expected type coercion.
        /** @suppress{checkTypes} */
        HEAP32[((eventStruct) >> 2)] = isPointerlocked;
        var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
        var id = (pointerLockElement && pointerLockElement.id) ? pointerLockElement.id : '';
        stringToUTF8(nodeName, eventStruct + 4, 128);
        stringToUTF8(id, eventStruct + 132, 128);
    }
    function registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc(260);

        var pointerlockChangeEventHandlerFunc = function (ev) {
            var e = ev || event;

            var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
            fillPointerlockChangeEventData(pointerlockChangeEvent);

            if (getWasmTableEntry(callbackfunc)(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: pointerlockChangeEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    /** @suppress {missingProperties} */
    function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        // TODO: Currently not supported in pthreads or in --proxy-to-worker mode. (In pthreads mode, document object is not defined)
        if (!document || !document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
            return -1;
        }

        target = findEventTarget(target);
        if (!target) return -4;
        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
        return 0;
    }
    _emscripten_set_pointerlockchange_callback_on_thread.sig = 'iiiiii';

    function registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);

        target = findEventTarget(target);

        var uiEventHandlerFunc = function (ev) {
            var e = ev || event;
            if (e.target != target) {
                // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
                // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
                // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
                // causing a new scroll, etc..
                return;
            }
            var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
            if (!b) {
                // During a page unload 'body' can be null, with "Cannot read property 'clientWidth' of null" being thrown
                return;
            }
            var uiEvent = JSEvents.uiEvent;
            HEAP32[((uiEvent) >> 2)] = e.detail;
            HEAP32[(((uiEvent) + (4)) >> 2)] = b.clientWidth;
            HEAP32[(((uiEvent) + (8)) >> 2)] = b.clientHeight;
            HEAP32[(((uiEvent) + (12)) >> 2)] = innerWidth;
            HEAP32[(((uiEvent) + (16)) >> 2)] = innerHeight;
            HEAP32[(((uiEvent) + (20)) >> 2)] = outerWidth;
            HEAP32[(((uiEvent) + (24)) >> 2)] = outerHeight;
            HEAP32[(((uiEvent) + (28)) >> 2)] = pageXOffset;
            HEAP32[(((uiEvent) + (32)) >> 2)] = pageYOffset;
            if (getWasmTableEntry(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: uiEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
        return 0;
    }
    _emscripten_set_resize_callback_on_thread.sig = 'iiiiii';

    function registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1696);

        target = findEventTarget(target);

        var touchEventHandlerFunc = function (e) {
            assert(e);
            var t, touches = {}, et = e.touches;
            // To ease marshalling different kinds of touches that browser reports (all touches are listed in e.touches, 
            // only changed touches in e.changedTouches, and touches on target at a.targetTouches), mark a boolean in
            // each Touch object so that we can later loop only once over all touches we see to marshall over to Wasm.

            for (var i = 0; i < et.length; ++i) {
                t = et[i];
                // Browser might recycle the generated Touch objects between each frame (Firefox on Android), so reset any
                // changed/target states we may have set from previous frame.
                t.isChanged = t.onTarget = 0;
                touches[t.identifier] = t;
            }
            // Mark which touches are part of the changedTouches list.
            for (var i = 0; i < e.changedTouches.length; ++i) {
                t = e.changedTouches[i];
                t.isChanged = 1;
                touches[t.identifier] = t;
            }
            // Mark which touches are part of the targetTouches list.
            for (var i = 0; i < e.targetTouches.length; ++i) {
                touches[e.targetTouches[i].identifier].onTarget = 1;
            }

            var touchEvent = JSEvents.touchEvent;
            HEAPF64[((touchEvent) >> 3)] = e.timeStamp;
            var idx = touchEvent >> 2; // Pre-shift the ptr to index to HEAP32 to save code size
            HEAP32[idx + 3] = e.ctrlKey;
            HEAP32[idx + 4] = e.shiftKey;
            HEAP32[idx + 5] = e.altKey;
            HEAP32[idx + 6] = e.metaKey;
            idx += 7; // Advance to the start of the touch array.
            var targetRect = getBoundingClientRect(target);
            var numTouches = 0;
            for (var i in touches) {
                t = touches[i];
                HEAP32[idx + 0] = t.identifier;
                HEAP32[idx + 1] = t.screenX;
                HEAP32[idx + 2] = t.screenY;
                HEAP32[idx + 3] = t.clientX;
                HEAP32[idx + 4] = t.clientY;
                HEAP32[idx + 5] = t.pageX;
                HEAP32[idx + 6] = t.pageY;
                HEAP32[idx + 7] = t.isChanged;
                HEAP32[idx + 8] = t.onTarget;
                HEAP32[idx + 9] = t.clientX - targetRect.left;
                HEAP32[idx + 10] = t.clientY - targetRect.top;

                idx += 13;

                if (++numTouches > 31) {
                    break;
                }
            }
            HEAP32[(((touchEvent) + (8)) >> 2)] = numTouches;

            if (getWasmTableEntry(callbackfunc)(eventTypeId, touchEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: touchEventHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
        return 0;
    }
    _emscripten_set_touchcancel_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
        return 0;
    }
    _emscripten_set_touchend_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
        return 0;
    }
    _emscripten_set_touchmove_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
        return 0;
    }
    _emscripten_set_touchstart_callback_on_thread.sig = 'iiiiii';

    function fillVisibilityChangeEventData(eventStruct) {
        var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
        var visibilityState = visibilityStates.indexOf(document.visibilityState);

        // Assigning a boolean to HEAP32 with expected type coercion.
        /** @suppress{checkTypes} */
        HEAP32[((eventStruct) >> 2)] = document.hidden;
        HEAP32[(((eventStruct) + (4)) >> 2)] = visibilityState;
    }
    function _emscripten_sleep() {
        throw 'Please compile your program with async support in order to use asynchronous operations like emscripten_sleep';
    }

    function registerVisibilityChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc( 8 );
    
        var visibilityChangeEventHandlerFunc = function(ev) {
          var e = ev || event;
    
          var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
    
          fillVisibilityChangeEventData(visibilityChangeEvent);
    
          if (getWasmTableEntry(callbackfunc)(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: target,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: visibilityChangeEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }

    function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
        if (!specialHTMLTargets[1]) {
            return -4;
        }
        registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
        return 0;
    }
    _emscripten_set_visibilitychange_callback_on_thread.sig = 'iiiii';

    function registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(104);

        // The DOM Level 3 events spec event 'wheel'
        var wheelHandlerFunc = function (ev) {
            var e = ev || event;
            var wheelEvent = JSEvents.wheelEvent;
            fillMouseEventData(wheelEvent, e, target);
            HEAPF64[(((wheelEvent) + (72)) >> 3)] = e["deltaX"];
            HEAPF64[(((wheelEvent) + (80)) >> 3)] = e["deltaY"];
            HEAPF64[(((wheelEvent) + (88)) >> 3)] = e["deltaZ"];
            HEAP32[(((wheelEvent) + (96)) >> 2)] = e["deltaMode"];
            if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target: target,
            allowsDeferredCalls: true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: wheelHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
    }
    function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        target = findEventTarget(target);
        if (typeof target.onwheel != 'undefined') {
            registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
            return 0;
        } else {
            return -1;
        }
    }
    _emscripten_set_wheel_callback_on_thread.sig = 'iiiiii';

    function _emscripten_set_window_title(title) {
        setWindowTitle(UTF8ToString(title));
    }
    _emscripten_set_window_title.sig = 'vi';

    function _emscripten_set_main_loop_timing(mode, value) {
        Browser.mainLoop.timingMode = mode;
        Browser.mainLoop.timingValue = value;
    
        if (!Browser.mainLoop.func) {
          err('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
          return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
        }
    
        if (!Browser.mainLoop.running) {
          
          Browser.mainLoop.running = true;
        }
        if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
          };
          Browser.mainLoop.method = 'timeout';
        } else if (mode == 1 /*EM_TIMING_RAF*/) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = 'rAF';
        } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
          if (typeof setImmediate == 'undefined') {
            // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';
            var Browser_setImmediate_messageHandler = function(/** @type {Event} */ event) {
              // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
              // so check for both cases.
              if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            }
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = /** @type{function(function(): ?, ...?): number} */(function Browser_emulated_setImmediate(func) {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
                Module['setImmediates'].push(func);
                postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
              } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
            })
          }
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = 'immediate';
        }
        return 0;
      }
    _emscripten_set_main_loop_timing.sig = 'iii';

    var sdl_functions = {
        "emscripten_get_num_gamepads": _emscripten_get_num_gamepads,
        "emscripten_get_screen_size": _emscripten_get_screen_size,
        "emscripten_glActiveTexture": _emscripten_glActiveTexture,
        "emscripten_glAttachShader": _emscripten_glAttachShader,
        "emscripten_glBeginQueryEXT": _emscripten_glBeginQueryEXT,
        "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
        "emscripten_glBindBuffer": _emscripten_glBindBuffer,
        "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
        "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
        "emscripten_glBindTexture": _emscripten_glBindTexture,
        "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES,
        "emscripten_glBlendColor": _emscripten_glBlendColor,
        "emscripten_glBlendEquation": _emscripten_glBlendEquation,
        "emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate,
        "emscripten_glBlendFunc": _emscripten_glBlendFunc,
        "emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate,
        "emscripten_glBufferData": _emscripten_glBufferData,
        "emscripten_glBufferSubData": _emscripten_glBufferSubData,
        "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
        "emscripten_glClear": _emscripten_glClear,
        "emscripten_glClearColor": _emscripten_glClearColor,
        "emscripten_glClearDepthf": _emscripten_glClearDepthf,
        "emscripten_glClearStencil": _emscripten_glClearStencil,
        "emscripten_glColorMask": _emscripten_glColorMask,
        "emscripten_glCompileShader": _emscripten_glCompileShader,
        "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
        "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
        "emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D,
        "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
        "emscripten_glCreateProgram": _emscripten_glCreateProgram,
        "emscripten_glCreateShader": _emscripten_glCreateShader,
        "emscripten_glCullFace": _emscripten_glCullFace,
        "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
        "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
        "emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
        "emscripten_glDeleteQueriesEXT": _emscripten_glDeleteQueriesEXT,
        "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
        "emscripten_glDeleteShader": _emscripten_glDeleteShader,
        "emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
        "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES,
        "emscripten_glDepthFunc": _emscripten_glDepthFunc,
        "emscripten_glDepthMask": _emscripten_glDepthMask,
        "emscripten_glDepthRangef": _emscripten_glDepthRangef,
        "emscripten_glDetachShader": _emscripten_glDetachShader,
        "emscripten_glDisable": _emscripten_glDisable,
        "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
        "emscripten_glDrawArrays": _emscripten_glDrawArrays,
        "emscripten_glDrawArraysInstancedANGLE": _emscripten_glDrawArraysInstancedANGLE,
        "emscripten_glDrawBuffersWEBGL": _emscripten_glDrawBuffersWEBGL,
        "emscripten_glDrawElements": _emscripten_glDrawElements,
        "emscripten_glDrawElementsInstancedANGLE": _emscripten_glDrawElementsInstancedANGLE,
        "emscripten_glEnable": _emscripten_glEnable,
        "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
        "emscripten_glEndQueryEXT": _emscripten_glEndQueryEXT,
        "emscripten_glFinish": _emscripten_glFinish,
        "emscripten_glFlush": _emscripten_glFlush,
        "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
        "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
        "emscripten_glFrontFace": _emscripten_glFrontFace,
        "emscripten_glGenBuffers": _emscripten_glGenBuffers,
        "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
        "emscripten_glGenQueriesEXT": _emscripten_glGenQueriesEXT,
        "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
        "emscripten_glGenTextures": _emscripten_glGenTextures,
        "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES,
        "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
        "emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib,
        "emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform,
        "emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders,
        "emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation,
        "emscripten_glGetBooleanv": _emscripten_glGetBooleanv,
        "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
        "emscripten_glGetError": _emscripten_glGetError,
        "emscripten_glGetFloatv": _emscripten_glGetFloatv,
        "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
        "emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
        "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
        "emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
        "emscripten_glGetQueryObjecti64vEXT": _emscripten_glGetQueryObjecti64vEXT,
        "emscripten_glGetQueryObjectivEXT": _emscripten_glGetQueryObjectivEXT,
        "emscripten_glGetQueryObjectui64vEXT": _emscripten_glGetQueryObjectui64vEXT,
        "emscripten_glGetQueryObjectuivEXT": _emscripten_glGetQueryObjectuivEXT,
        "emscripten_glGetQueryivEXT": _emscripten_glGetQueryivEXT,
        "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
        "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
        "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
        "emscripten_glGetShaderSource": _emscripten_glGetShaderSource,
        "emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
        "emscripten_glGetString": _emscripten_glGetString,
        "emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv,
        "emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv,
        "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
        "emscripten_glGetUniformfv": _emscripten_glGetUniformfv,
        "emscripten_glGetUniformiv": _emscripten_glGetUniformiv,
        "emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv,
        "emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv,
        "emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv,
        "emscripten_glHint": _emscripten_glHint,
        "emscripten_glIsBuffer": _emscripten_glIsBuffer,
        "emscripten_glIsEnabled": _emscripten_glIsEnabled,
        "emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer,
        "emscripten_glIsProgram": _emscripten_glIsProgram,
        "emscripten_glIsQueryEXT": _emscripten_glIsQueryEXT,
        "emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer,
        "emscripten_glIsShader": _emscripten_glIsShader,
        "emscripten_glIsTexture": _emscripten_glIsTexture,
        "emscripten_glIsVertexArrayOES": _emscripten_glIsVertexArrayOES,
        "emscripten_glLineWidth": _emscripten_glLineWidth,
        "emscripten_glLinkProgram": _emscripten_glLinkProgram,
        "emscripten_glPixelStorei": _emscripten_glPixelStorei,
        "emscripten_glPolygonOffset": _emscripten_glPolygonOffset,
        "emscripten_glQueryCounterEXT": _emscripten_glQueryCounterEXT,
        "emscripten_glReadPixels": _emscripten_glReadPixels,
        "emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler,
        "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
        "emscripten_glSampleCoverage": _emscripten_glSampleCoverage,
        "emscripten_glScissor": _emscripten_glScissor,
        "emscripten_glShaderBinary": _emscripten_glShaderBinary,
        "emscripten_glShaderSource": _emscripten_glShaderSource,
        "emscripten_glStencilFunc": _emscripten_glStencilFunc,
        "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
        "emscripten_glStencilMask": _emscripten_glStencilMask,
        "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
        "emscripten_glStencilOp": _emscripten_glStencilOp,
        "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
        "emscripten_glTexImage2D": _emscripten_glTexImage2D,
        "emscripten_glTexParameterf": _emscripten_glTexParameterf,
        "emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
        "emscripten_glTexParameteri": _emscripten_glTexParameteri,
        "emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
        "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
        "emscripten_glUniform1f": _emscripten_glUniform1f,
        "emscripten_glUniform1fv": _emscripten_glUniform1fv,
        "emscripten_glUniform1i": _emscripten_glUniform1i,
        "emscripten_glUniform1iv": _emscripten_glUniform1iv,
        "emscripten_glUniform2f": _emscripten_glUniform2f,
        "emscripten_glUniform2fv": _emscripten_glUniform2fv,
        "emscripten_glUniform2i": _emscripten_glUniform2i,
        "emscripten_glUniform2iv": _emscripten_glUniform2iv,
        "emscripten_glUniform3f": _emscripten_glUniform3f,
        "emscripten_glUniform3fv": _emscripten_glUniform3fv,
        "emscripten_glUniform3i": _emscripten_glUniform3i,
        "emscripten_glUniform3iv": _emscripten_glUniform3iv,
        "emscripten_glUniform4f": _emscripten_glUniform4f,
        "emscripten_glUniform4fv": _emscripten_glUniform4fv,
        "emscripten_glUniform4i": _emscripten_glUniform4i,
        "emscripten_glUniform4iv": _emscripten_glUniform4iv,
        "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
        "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
        "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
        "emscripten_glUseProgram": _emscripten_glUseProgram,
        "emscripten_glValidateProgram": _emscripten_glValidateProgram,
        "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
        "emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv,
        "emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f,
        "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
        "emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f,
        "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
        "emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f,
        "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
        "emscripten_glVertexAttribDivisorANGLE": _emscripten_glVertexAttribDivisorANGLE,
        "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
        "emscripten_glViewport": _emscripten_glViewport,
        "emscripten_has_asyncify": _emscripten_has_asyncify,
        "emscripten_sleep": _emscripten_sleep,
        "eglBindAPI": _eglBindAPI,
        "eglChooseConfig": _eglChooseConfig,
        "eglCreateContext": _eglCreateContext,
        "eglCreateWindowSurface": _eglCreateWindowSurface,
        "eglDestroyContext": _eglDestroyContext,
        "eglDestroySurface": _eglDestroySurface,
        "eglGetConfigAttrib": _eglGetConfigAttrib,
        "eglGetDisplay": _eglGetDisplay,
        "eglGetError": _eglGetError,
        "eglInitialize": _eglInitialize,
        "eglMakeCurrent": _eglMakeCurrent,
        "eglQueryString": _eglQueryString,
        "eglSwapBuffers": _eglSwapBuffers,
        "eglSwapInterval": _eglSwapInterval,
        "eglTerminate": _eglTerminate,
        "eglWaitGL": _eglWaitGL,
        "eglWaitNative": _eglWaitNative,
        "emscripten_asm_const_int": _emscripten_asm_const_int,
        "emscripten_set_beforeunload_callback_on_thread": _emscripten_set_beforeunload_callback_on_thread,
        "emscripten_set_blur_callback_on_thread": _emscripten_set_blur_callback_on_thread,
        "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
        "emscripten_set_element_css_size": _emscripten_set_element_css_size,
        "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread,
        "emscripten_set_fullscreenchange_callback_on_thread": _emscripten_set_fullscreenchange_callback_on_thread,
        "emscripten_set_gamepadconnected_callback_on_thread": _emscripten_set_gamepadconnected_callback_on_thread,
        "emscripten_set_gamepaddisconnected_callback_on_thread": _emscripten_set_gamepaddisconnected_callback_on_thread,
        "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread,
        "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread,
        "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread,
        "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread,
        "emscripten_set_mouseenter_callback_on_thread": _emscripten_set_mouseenter_callback_on_thread,
        "emscripten_set_mouseleave_callback_on_thread": _emscripten_set_mouseleave_callback_on_thread,
        "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread,
        "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread,
        "emscripten_set_pointerlockchange_callback_on_thread": _emscripten_set_pointerlockchange_callback_on_thread,
        "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread,
        "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread,
        "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread,
        "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread,
        "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread,
        "emscripten_set_visibilitychange_callback_on_thread": _emscripten_set_visibilitychange_callback_on_thread,
        "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread,
        "emscripten_sample_gamepad_data": _emscripten_sample_gamepad_data,
        "emscripten_set_beforeunload_callback_on_thread": _emscripten_set_beforeunload_callback_on_thread,
        "emscripten_set_blur_callback_on_thread": _emscripten_set_blur_callback_on_thread,
        "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
        "emscripten_set_element_css_size": _emscripten_set_element_css_size,
        "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread,
        "emscripten_set_fullscreenchange_callback_on_thread": _emscripten_set_fullscreenchange_callback_on_thread,
        "emscripten_set_gamepadconnected_callback_on_thread": _emscripten_set_gamepadconnected_callback_on_thread,
        "emscripten_set_gamepaddisconnected_callback_on_thread": _emscripten_set_gamepaddisconnected_callback_on_thread,
        "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread,
        "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread,
        "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread,
        "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread,
        "emscripten_set_mouseenter_callback_on_thread": _emscripten_set_mouseenter_callback_on_thread,
        "emscripten_set_mouseleave_callback_on_thread": _emscripten_set_mouseleave_callback_on_thread,
        "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread,
        "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread,
        "emscripten_set_pointerlockchange_callback_on_thread": _emscripten_set_pointerlockchange_callback_on_thread,
        "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread,
        "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread,
        "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread,
        "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread,
        "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread,
        "emscripten_set_visibilitychange_callback_on_thread": _emscripten_set_visibilitychange_callback_on_thread,
        "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread,
        "emscripten_set_window_title": _emscripten_set_window_title,
        "emscripten_get_gamepad_status": _emscripten_get_gamepad_status,
        "emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy,
        "emscripten_request_pointerlock": _emscripten_request_pointerlock,
        "emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
        "emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio,
        "emscripten_exit_fullscreen": _emscripten_exit_fullscreen,
        "emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
        "emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio,
        "emscripten_get_element_css_size": _emscripten_get_element_css_size,
        "emscripten_get_gamepad_status": _emscripten_get_gamepad_status,

    }
    return sdl_functions;
}
export { SDL_MODULE };