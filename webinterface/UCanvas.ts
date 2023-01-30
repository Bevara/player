import {Module, UTF8ToString} from './core-player.js';

const modules_entryLibraries : string[] = [
    'compose_filter_register',
'filein_register',
'fileout_register',
'aout_register',
'latm_mx_register',
'm4vmx_register',
'nalumx_register',
'obumx_register',
'tileagg_register',
'm2tssplit_register',
'vcrop_register',
'vflip_register',
'writegen_register',
'nhmldump_register',
'nhntdump_register',
'qcpmx_register',
'vttmx_register',
'vorbisdec_register',
'maddec_register',
'theoradec_register',
'a52dec_register',
'faad_register',
'imgdec_register',
'oggdmx_register',
'ac3dmx_register',
'av1dmx_register',
'img_reframe_register',
'mp3_dmx_register',
'proresdmx_register',
'rawvidreframe_register',
'adts_dmx_register',
'flac_dmx_register',
'latm_dmx_register',
'mpgviddmx_register',
'qcpdmx_register',
'amrdmx_register',
'gsfdmx_register',
'h263dmx_register',
'm2tsdmx_register',
'naludmx_register',
'nhmldmx_register',
'nhntdmx_register',
'pcmreframe_register',
'safdmx_register',
'vobsubdmx_register',
'pngenc_register',
'ffdec_register',
'ffdmx_register',
'ffenc_register',
'ffavf_register',
'ffmx_register',
'ffsws_register',
'bmp_reframe_register',
'pbm_reframe_register',
'dxf_reframe_register',
'svgin_register',

    ];

const genericTracks = [
    {
      id: '1'
    }, {
      id: '2'
    }, {
      id: '3'
    }
  ];

class BevaraTimeRanges implements TimeRanges {
    constructor() {

    }
        length: number = 0;
         
         end(index: number): number {
             return 0;
         };
         
         
         start(index: number): number{
             return 0;
         }
}
class BevaraTextTrackList {
    constructor() {
        //this.buffered = {length:false};
    }

}

class BevaraRemotePlayback implements RemotePlayback {
    constructor() {

    }
    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }
    onconnect: ((this: RemotePlayback, ev: Event) => any) | null = null;
    onconnecting: ((this: RemotePlayback, ev: Event) => any) | null= null;
    ondisconnect: ((this: RemotePlayback, ev: Event) => any) | null= null;
    readonly state: RemotePlaybackState = "disconnected";
    cancelWatchAvailability(id?: number): Promise<void> {
        return new Promise(function() {return 0});
    }
    prompt(): Promise<void> {
        return new Promise(function() {return 0});
    }

    watchAvailability(callback: RemotePlaybackAvailabilityCallback): Promise<number>{
        return new Promise(function() {return 0});
    }
    
    addEventListener<K extends keyof RemotePlaybackEventMap>(type: K, listener: (this: RemotePlayback, ev: RemotePlaybackEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void{

    };
    
    removeEventListener<K extends keyof RemotePlaybackEventMap>(type: K, listener: (this: RemotePlayback, ev: RemotePlaybackEventMap[K]) => any, options?: boolean | EventListenerOptions): void{

    };

}

class UniversalCanvas extends HTMLCanvasElement implements HTMLMediaElement {
    readonly event_playing : Event = new Event('playing');
    readonly event_pause : Event = new Event('pause');
    readonly event_volumechange : Event = new Event('volumechange');
    readonly event_canplay : Event = new Event('canplay');
    readonly event_canplaythrough : Event = new Event('canplaythrough');
    readonly event_durationchange : Event = new Event('durationchange');
    readonly event_loadedmetadata : Event = new Event('loadedmetadata');
    readonly event_ended : Event = new Event('ended');
    readonly event_timeupdate : Event = new Event('timeupdate');
    readonly event_resize : Event = new Event('resize');
    readonly event_loadstart : Event = new Event('loadstart');
    readonly event_progress : Event = new Event('progress');
    readonly event_ratechange : Event = new Event('ratechange');
    

    readonly HAVE_NOTHING: number = 0;
    readonly HAVE_METADATA: number = 1;
    readonly HAVE_CURRENT_DATA: number = 2;
    readonly HAVE_FUTURE_DATA: number = 3;
    readonly HAVE_ENOUGH_DATA: number = 4;
    readonly NETWORK_EMPTY: number = 0;
    readonly NETWORK_IDLE: number = 1;
    readonly NETWORK_LOADING: number = 2;
    readonly NETWORK_NO_SOURCE: number = 3;

    autoplay: boolean = false;
    controls: boolean = false;
    crossOrigin:string | null = null;
    currentSrc:string = "";
    defaultMuted:boolean = false;
    defaultPlaybackRate:number = 0;
    ended:boolean=false;
    error:MediaError | null = null;
    loop:boolean=false;
    mediaKeys:MediaKeys | null = null;
    muted:boolean =false;
    networkState:number= this.NETWORK_EMPTY;
    onencrypted:((this: HTMLMediaElement, ev: MediaEncryptedEvent) => any) | null = null;
    onwaitingforkey: ((this: HTMLMediaElement, ev: Event) => any) | null = null;
    paused: boolean = false;
    preservesPitch:boolean = true;
    played:TimeRanges = new BevaraTimeRanges();
    preload: "" | "none" | "metadata" | "auto" = "";
    readyState: number = this.HAVE_NOTHING;
    seekable: TimeRanges = new BevaraTimeRanges();
    seeking: boolean = false;
    src: string ="";
    srcObject: MediaProvider | null = null;
    textTracks: TextTrackList = new BevaraTextTrackList() as TextTrackList;
    disableRemotePlayback: boolean = true;
    remote: RemotePlayback = new BevaraRemotePlayback();
    _volume: number = 0;
    _duration: number = 0;
    _init: boolean = false;
    _currentTime: number = 0;
    _playbackRate: number = 1;


    get playbackRate():number{
        return this._playbackRate;
    }

    set playbackRate(v:number){
        if (this._init == true){
            Module.ccall('set', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify({ "Player_Speed": v })]);
            this.dispatchEvent(this.event_ratechange);
        }
        this._playbackRate = v;
    }

    get buffered():TimeRanges{
        return new BevaraTimeRanges();
    }

    get duration():number{
        return this._duration;
    }

    get currentTime():number{
        if (this._init == true){
            const state = Module.ccall('get', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify(['Get_Time_in_ms'])]);
            const json_state = JSON.parse(state);
            return json_state.Get_Time_in_ms / 1000;
        }

        return this._currentTime;
    }

    set currentTime(t:number){
        if (this._init == true){
            const info = Module.ccall('set', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify({ "Get_Time_in_ms": Math.round(t * 1000) })]);
        }else{
            this._currentTime = t;
        }
    }


    set volume(v:number){
        if (this._init == true){
            const volume = Math.round(v * 100);
            const info = Module.ccall('set', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify({ "Player_Volume": volume })]);
            const json_info = JSON.parse(info);
        }else{
            this._volume = v;
        }
        this.dispatchEvent(this.event_volumechange);
    }

    get volume():number{
        if (this._init == true){
            const state = Module.ccall('get', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify(['Player_Volume'])]);
            const json_state = JSON.parse(state);
            return json_state.Player_Volume / 100;
        }
        return this._volume;
    }

    addTextTrack(kind: TextTrackKind, label?: string, language?: string): TextTrack {
        return new TextTrack();
    }

    canPlayType(type: string): CanPlayTypeResult{
        return "";
    }

    fastSeek(time: number): void{
        Module.video_elt.currentTime(time);
    } 
    load(): void{
        console.log("load");
    }

    pause(): void{
        const info = Module.ccall('set', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify({ 'Player_State': 'Player_Pause' })]);
        const json_info = JSON.parse(info);
        if (json_info.Player_State == false) {
            this.paused = true;
            this.dispatchEvent(this.event_pause);
        }
    }

    play(): Promise<void>{
        return new Promise((successCallback, failureCallback) => {

            const info = Module.ccall('set', 'string', ['number', 'string'], [Module.decoder_ptr, JSON.stringify({ 'Player_State': 'Player_Play' })]);
            const json_info = JSON.parse(info);
           
            if (json_info.Player_State == true) {
                this.dispatchEvent(this.event_playing);
                successCallback(json_info);
                this.paused = false;
            } else {
                failureCallback(json_info);
            }
          });
    }
    setMediaKeys(mediaKeys: MediaKeys | null): Promise<void>{
        return new Promise((successCallback, failureCallback) => {
            console.log("C'est fait");
            // réussir une fois sur deux
            if (Math.random() > .5) {
                console.log("Réussite");
                successCallback();
            } else {
                console.log("Échec");
              failureCallback();
            }
          });
    }

    static event_callback (ctx :any, msg:any) {
        const _utf8 = UTF8ToString(msg);
        const event = JSON.parse(_utf8);
        //const doc = document.getElementById("status");
        //const player = (this as any).player as Bevara_Player;
        //const art = player.art;
        //const notice = art.notice;
        //const canvas = player.canvas;
        //console.log(event);
        switch (event.type) {
            case 'GF_EVENT_PROGRESS':
                switch (event.progress_type) {
                    case 1:
                        if (event.done == event.total) {
                            Module.video_elt.networkState = Module.video_elt.NETWORK_IDLE;
                            
                            //art.loading.show = false;
                            //art.emit("video:canplay");
                            //art.emit("ready");
                            //doc.innerHTML = "media download completed";
                            //Module.get_info();
                        } else if (event.total == 0) {
                            Module.video_elt.networkState = Module.video_elt.NETWORK_LOADING;
                            Module.video_elt.dispatchEvent(Module.video_elt.event_progress);
                            //notice.show("Downloading media : " + event.done + " bytes ");
                            //doc.innerHTML = "Downloading media : " + event.done + " bytes ";
                        } else {
                            Module.video_elt.networkState = Module.video_elt.NETWORK_LOADING;
                            Module.video_elt.dispatchEvent(Module.video_elt.event_progress);
                            //notice.show("Downloading media : " + (100 * event.done / event.total).toFixed(1) + " % ");
                            //doc.innerHTML = "Downloading media : " + (100 * event.done / event.total).toFixed(1) + " % ";
                        }
                        break;
                    default:
                        console.log(event);
                }
                break;

            case 'GF_EVENT_DURATION':
                Module.video_elt._duration = event.duration;
                Module.video_elt.dispatchEvent(Module.video_elt.event_durationchange);
                Module.video_elt.dispatchEvent(Module.video_elt.event_loadedmetadata);
            break;
            case 'GF_EVENT_EOS':
                //Module.video_elt.dispatchEvent(Module.video_elt.event_ended);
                break;
            case 'GF_EVENT_SIZE':
                Module.video_elt.width  = event.width;
                Module.video_elt.height  = event.height;
                Module.video_elt.dispatchEvent(Module.video_elt.event_resize);
                console.log("Setting size to w:" +event.width+" and h:"+event.height);
                break;

            case 'GF_EVENT_CONNECT':
                    if(event.is_connected == 1){
                        Module.video_elt.dispatchEvent(Module.video_elt.event_canplay);
                        Module.video_elt.dispatchEvent(Module.video_elt.event_canplaythrough);
                    }
                    break;
            default:
                console.log(event);
        }

    }

    connectedCallback(){
        Module.video_elt = this;

        Module.canvas = (function () {
            Module.video_elt.addEventListener("webglcontextlost", function (e:any) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);
            return Module.video_elt;
        })();

        Module.onRuntimeInitialized = (function () {
            Module.video_elt._init  = true;
            const src = Module.video_elt.getAttribute("src");
            const setup_arguments = {
                evt_callback: Module.addFunction(UniversalCanvas.event_callback.bind(this), 'vii'),
                entryLibraries: modules_entryLibraries.map( (x:any) => Module.ccall(x, ['number'], ['number'], [null])),
                in_url: src
            };
    
            Module.decoder_ptr = Module.ccall('setup_acc', ['number'], ['string'], [JSON.stringify(setup_arguments)]);
            Module.video_elt.volume = Module.video_elt._volume;
            Module.video_elt.playbackRate = Module.video_elt._playbackRate;

            Module.video_elt.dispatchEvent(Module.video_elt.event_loadstart);

            let interval = setInterval(function () {
                Module._step_run(Module.decoder_ptr);
            }, 1);

            let interval2 = setInterval(function () {
                Module.video_elt.dispatchEvent(Module.video_elt.event_timeupdate);
            }, 100);
        })
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'src':
                this.src = newValue;
                break;
        }
    }

    static get observedAttributes() { return ['src']; }
}

if (!customElements.get('universal-canvas')) {
    customElements.define('universal-canvas', UniversalCanvas, {extends: 'canvas' });
}

export { UniversalCanvas };