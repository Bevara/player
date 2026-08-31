import JSZip = require("jszip");
import { addScriptDirectoryAndExtIfNeeded, launchNoWorker, sendMessageNoWorker, setupProgressive, launchProgressive, UniversalFn } from "./UniversalFns";
const version = require("../version.js").version;
import '@ungap/custom-elements';

class UniversalVideo extends HTMLVideoElement implements UniversalFn {
    using: string;
    memory: Uint8Array;

    with: string;

    entry: any;
    module: any;

    using_attribute: string = "";
    with_attribute: string[] = [];
    print_attribute: Element | null;
    error_attribute: Element | null;

    out = "mp4";
    scriptDirectory = document.currentScript? this.initScriptDirectory((document.currentScript as any).src) :"";
    useCache = false;
    useWorker = false;
    printProgess = false;
    cache = null;
    worker = null;
    script = null;
    core = null;

    urlToRevoke = [];

    private _decodingPromise: Promise<string>;

    private _messageHandlerNoWorker = null;

    private initScriptDirectory(src:string){
        if (src.indexOf('blob:') !== 0) {
            return src.substr(0, src.replace(/[?#].*/, "").lastIndexOf('/')+1);
          } else {
            return '';
        }
    }

    get decodingPromise() {
        return this._decodingPromise;
    }

    properties(props : string[]){
        const message = {
            event: "get_properties",
            properties: props
        };

        return this.sendMessage(message);
    }

    set enable_reporting(value :boolean){
        const message = {
            event: "set_properties",
            properties: { "enable_reporting": value }
        };

        this.sendMessage(message);
     }

    sendMessage(message) {
        return this.worker ? this.sendMessageWorker(message) : sendMessageNoWorker(this, message);
    }
    sendMessageWorker(message) {
        if (this.worker) {
            this.worker.postMessage(message);

            this.worker.addEventListener('message', m => {
                return m.data;
            });
        }
    }

    dataURLToSrc(blob, cached) {
        if (!blob) return;
        if (this.useCache && this.cache && !cached) {
            this.cache.put(this.src, new Response(blob));
        }

        this.src = URL.createObjectURL(blob);
        this.dispatchEvent(new CustomEvent('ready'));
    }

    processMessages(self, core, resolve) {
        if ("exit_code" in core){
            if (core.blob) {
                self.dataURLToSrc(core.blob, false);
                resolve(self.src);
            }else{
                resolve(null);
            }
        }


        function clear_text(text) {
            return text
                .replaceAll("[37m", '')
                .replaceAll("[0m", '');
        }

        if (core.print) {
            if (self.print_attribute) {
                (self.print_attribute as any).value += clear_text(core.print) + "\n";
            } else {
                console.log(core.print);
            }
        }

        if (core.printErr) {
            if (self.error_attribute) {
                (self.error_attribute as any).value += clear_text(core.printErr) + "\n";
            } else {
                console.log(core.printErr);
            }

        }

    }


    launchWorker(script, message, resolve) {
        const worker = new Worker(script);
        if (worker) {
            worker.postMessage(message);

            worker.addEventListener('message', m => {
                this.processMessages(this, m.data, resolve);
            });
        }

        this.worker = worker;
    }

    async universal_decode(): Promise<string> {
        return new Promise(async (main_resolve, main_reject) => {
            if (this.useCache) {
                try {
                    this.cache = this.cache || await caches.open('universal-video_'+version);
                } catch (e) { }
                const cachedImg = this.cache && await this.cache.match(this.src);
                if (cachedImg) {
                    const cachedImgData = await cachedImg.blob();
                    this.dataURLToSrc(cachedImgData, true);
                    main_resolve(this.src);
                    return;
                }
            }

            let mime = "";
            try{
                const parsed_url = new URL(this.src);
                if(parsed_url.protocol === 'blob:'){
                    // We can't fetch head of a blob
                    const response = await fetch(this.src);
                    mime = response.headers.get("Content-Type");
                }else if(parsed_url.protocol === 'http:' || parsed_url.protocol === 'https:'){
                    const response = await fetch(this.src, { method: 'HEAD' });
                    mime = response.headers.get("Content-Type");
                }
            }catch {
                console.log("failed to fetch head of the content "+ this.src);
            }



            let src = this.src;
            let js = null;
            let wasmBinaryFile = null;
            let dynamicLibraries: string[] = [];

            if ((this.src && this.src.endsWith(".bvr")) || mime == "application/x-bevara") {
                const jszip = new JSZip();
                const fetched_bvr = await fetch(this.src);

                if (!fetched_bvr.ok) {
                    main_reject("");
                    return;
                }

                const zip = await jszip.loadAsync(fetched_bvr.blob());
                const metadata = await zip.file("meta.json").async("string");
                const json_meta = JSON.parse(metadata);
                this.core = json_meta.core;

                const getURLData = async (name) => {
                    if (Array.isArray(name)) {
                        const blobs = await Promise.all(name.map(x => zip.file(x).async("blob")));
                        const urls = blobs.map(x => URL.createObjectURL(x));
                        this.urlToRevoke = this.urlToRevoke.concat(urls);
                        return urls;
                    } else if (typeof name == 'string') {
                        const blob = await zip.file(name).async("blob");
                        const url = URL.createObjectURL(blob);
                        this.urlToRevoke.push(url);
                        return url;
                    }
                    return null;
                };

                src = (await getURLData(json_meta.source) as string);
                js = await getURLData(json_meta.core + ".js");
                wasmBinaryFile = await getURLData(json_meta.core + ".wasm");
                dynamicLibraries = (await getURLData(json_meta.decoders.map(x => x + ".wasm")) as string[]);
            }
            const scriptDirectory = this.getAttribute("script-directory") ? this.getAttribute("script-directory") : "";

            if (this.getAttribute("using")) {
                this.core = this.getAttribute("using");
                js = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("using"), ".js");
                wasmBinaryFile = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("using"), ".wasm");
            }

            if (this.getAttribute("js")) {
                //Overwrite js attribute
                js = await addScriptDirectoryAndExtIfNeeded(scriptDirectory, this.getAttribute("js"), "");
            }

            if (this.getAttribute("with")) {
                const all_using = await Promise.all(this.getAttribute("with").split(';').map(x => addScriptDirectoryAndExtIfNeeded(scriptDirectory, x,".wasm")));
                dynamicLibraries = dynamicLibraries.concat(all_using);
            }

            const isProgressive = this.getAttribute("progressive") == "";
            const useWebcodec = this.getAttribute("use-webcodec") == "" ? true : false;
            /* MSE can't play the source's original audio codec (e.g.
             * Vorbis) remuxed as-is into mp4 - it needs an actual
             * MSE-supported codec. MP3 was tried first (libmp3lame) but
             * ruled out: Chrome's MSE does not accept MP3 inside an mp4
             * container under ANY codec string (confirmed via
             * MediaSource.isTypeSupported - only bare "audio/mpeg" works,
             * which would need a second, separate SourceBuffer/GPAC
             * destination). Opus-in-mp4 IS MSE-supported and fits this
             * single-mp4-destination architecture directly, so "libopusenc"
             * is used instead. "c=aac"/"c=opus" are pushed as *global* GPAC
             * session args (see loader.js), not scoped to a single PID: if
             * no filter capable of producing that codec is registered, the
             * constraint fails the whole session, not just the audio track
             * - so only request one when a capable filter is actually
             * present. use-webcodec makes "wcenc" (AAC) available;
             * explicitly listing "libopusenc_1" in "with" makes the native
             * "encopus" (Opus) filter available. Prefer AAC (use-webcodec)
             * when both are present. Not forcing useWebcodec unconditionally
             * here because doing so would also make "wcenc" a candidate for
             * the *video* track, which can lose to libx264_1/encx264 in
             * "with" the same way the non-progressive path was fixed to
             * avoid today. */
            const withAttr = this.getAttribute("with") || "";
            const hasOpusEncoder = withAttr.indexOf("libopusenc") !== -1;
            const audioTranscode = useWebcodec ? "c=aac" : (hasOpusEncoder ? "c=opus" : null);

            const message: any = {
                event:"init",
                module: {
                    dynamicLibraries: dynamicLibraries ,
                    noInitialRun: true,
                    noExitRuntime: true

                },
                wasmBinaryFile: wasmBinaryFile,
                src : src,
                dst: "out.mp4",
                /* Bare "c=avc" for both branches - loader.js already gates the
                 * "wcenc:" prefix behind useWebcodec itself (registers/expects
                 * the wcenc filter only when use-webcodec is set). Hardcoding
                 * "wcenc:c=avc" here for the non-progressive case bypassed that
                 * gating and requested wcenc regardless of use-webcodec - only
                 * worked by accident when an earlier use-webcodec test in the
                 * same page left wcenc registered, and failed with "Failed to
                 * find filter wcenc:c=avc" otherwise (confirmed via a
                 * non-progressive, non-use-webcodec video tag run in
                 * isolation). */
                transcode: isProgressive ? (audioTranscode ? ["c=avc", audioTranscode] : ["c=avc"]) : ["c=avc"],
                useWebcodec: useWebcodec,
                showStats: this.getAttribute("stats"),
                showGraph: this.getAttribute("graph"),
                showReport: this.getAttribute("report"),
                showLogs: this.getAttribute("logs"),
                print:this.getAttribute("print"),
                printErr:this.getAttribute("printErr"),
                noCleanupOnExit:this.getAttribute("noCleanupOnExit"),
                test : this.getAttribute("test")
            };

            if (!js){
                console.log("Warning! no accessor is used on the universal, using a usual tag instead...");
                main_reject(this.src);
                return;
            }
            try {
                if (isProgressive) {
                    /* Progressive/MSE playback needs (a) fragmented mp4 output so
                     * the file is valid to append incrementally to a
                     * SourceBuffer, and (b) a JS function reference
                     * (onProgress) passed straight through the message object,
                     * which only works when the handler is called directly -
                     * so this always runs no-worker, regardless of the
                     * use-worker attribute. */
                    /* GPAC's default (no destination-link override) already
                     * picks the single correct transcoded avc1 PID for
                     * video - confirmed via MP4Box after ruling out a false
                     * lead: any "SID=*#..." destination filter, REGARDLESS
                     * of its refinement (stream-type match/negation or even
                     * a CodecID property match), bypasses GPAC's normal
                     * single-path caps arbitration for same-type PIDs and
                     * either links every matching video-typed PID (original
                     * Theora passthrough AND transcoded avc1 both end up
                     * muxed - 2 video tracks, confirmed via MP4Box) or, for
                     * the CodecID-based variant specifically, hangs the
                     * whole GPAC session indefinitely (confirmed: output
                     * stuck at 903 bytes after 45s, vs a few seconds
                     * normally) - so no "SID=" override is used here at all.
                     * Without an audioTranscode target (see above), GPAC
                     * still passthrough-muxes the original audio codec
                     * (e.g. Vorbis) by default, which is not a valid MSE
                     * codec in any mp4 mime type - the SourceBuffer's
                     * mimeCodecs below only ever declares an audio codec
                     * when audioTranscode actually makes the mux produce
                     * one, so a source with un-transcodable audio simply
                     * plays back video-only. "tfdt_traf=true" forces GPAC to
                     * write a "tfdt" (track fragment base media decode time)
                     * box in every traf: GPAC's mp4mx only does this
                     * automatically when "tsalign=false" (an unrelated
                     * timeline-realignment setting, off by default), so
                     * plain fragmented output otherwise omits tfdt entirely.
                     * Chrome's MSE ChunkDemuxer requires tfdt per the ISO
                     * BMFF Byte Stream Format spec and rejects fragments
                     * without one ("RunSegmentParserLoop: stream parsing
                     * failed"), even though regular (non-MSE) playback
                     * tolerates the omission - this was the actual root
                     * cause behind every "parsing failed" error seen while
                     * debugging progressive audio (confirmed missing via a
                     * byte-level diff against an ffmpeg-generated reference
                     * fragmented mp4, which Chrome's MSE accepted). */
                    const dstOptsDefault = "store=sfrag:cdur=1:tfdt_traf=true";
                    message.dst_opts = this.getAttribute("dst-opts") || dstOptsDefault;
                    const videoCodec = this.getAttribute("codecs") || "avc1.640028";
                    const audioCodec = this.getAttribute("audio-codecs") ||
                        (audioTranscode == "c=aac" ? "mp4a.40.2" : audioTranscode == "c=opus" ? "opus" : null);
                    const codecs = audioCodec ? (videoCodec + "," + audioCodec) : videoCodec;
                    const progressive = setupProgressive(this, 'video/mp4; codecs="' + codecs + '"');
                    /* self.src (the MediaSource object URL) is already set
                     * synchronously by setupProgressive - the element is
                     * playable as soon as the first fragment lands, no need
                     * to wait for the whole transcode to resolve this
                     * promise the way the non-progressive path does. */
                    main_resolve(this.src);
                    launchProgressive(this, js, message, () => {}, progressive);
                } else {
                    this.getAttribute("use-worker") == "" ? this.launchWorker(js, message, main_resolve) : launchNoWorker(this, js, message, main_resolve);
                }
            }catch(e){
                main_reject();
            }
        });
    }


    connectedCallback() {
        this._decodingPromise = this.universal_decode();
    }

    disconnectedCallback() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.urlToRevoke.forEach(x => URL.revokeObjectURL(x));

        if (this.script) {
            const core = this.getAttribute("using");
            document.head.removeChild(this.script);
            this.script = null;
            if ((window as any)[core]) {
                (window as any)[core] = null;
            }

        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                break;
            case 'using':
                this.using_attribute = this.getAttribute("using");
                break;
            case 'with':
                this.with_attribute = this.getAttribute("with").split(';').map(x => x + ".wasm");
                break;
            case 'print':
                this.print_attribute = document.querySelector(this.getAttribute("print"));
                break;
            case 'printerr':
                this.error_attribute = document.querySelector(this.getAttribute("printerr"));
                break;
            case 'out':
                this.out = this.getAttribute("out");
                break;
            case 'use-cache':
                this.useCache = true;
                break;
            case 'use-worker':
                this.useWorker = true;
                break;
            case 'progress':
                this.printProgess = true;
                break;
            case 'script-directory':
                this.scriptDirectory = this.getAttribute("script-directory");
                break;
        }
    }

    static get observedAttributes() { return ['src', 'using', 'with', 'print', 'printerr', 'out', 'use-cache', 'progress', 'script-directory', 'use-worker', "debug", "js"]; }
}

if (!customElements.get('universal-video_'+version)) {
    customElements.define('universal-video_'+version, UniversalVideo, { extends: 'video' });
}

export { UniversalVideo };
