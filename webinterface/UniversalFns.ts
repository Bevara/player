import urlExist from 'url-exist';

async function test_url(directories, url){
    const filter_directories = directories.filter(x => x !="");

    for (const directory of filter_directories){
        if(await urlExist(directory+url)){
            return directory+url;
        }

        return "";
    }

    return url;
}

function addScriptDirectoryAndExtIfNeeded(scriptDirectory, url, ext) {
    try {
        const parsed_url = new URL(url);
        if(parsed_url.protocol === 'blob:'){
            return url;
        }else if(parsed_url.protocol === 'http:' || parsed_url.protocol === 'https:'){
            return test_url([],url + ext);
        }

        return test_url(scriptDirectory.split(';'), url + ext);
      }catch(e){
        return test_url(scriptDirectory.split(';'), url + ext);
      }
}

declare interface UniversalFn {
    properties(props : string[]);

    set enable_reporting(value :boolean);
    get decodingPromise();
}




function launchNoWorker(self, script, message, resolve) {

    function addLoadEvent(script, func) {
        var oldonload = script.onload;
        if (typeof script.onload != 'function') {
            script.onload = func;
        } else {
            script.onload = function () {
                if (oldonload) {
                    oldonload();
                }
                func();
            };
        }
    }

    async function init() {
        self._messageHandlerNoWorker = await (window as any)[self.core]();
        const res = await self._messageHandlerNoWorker({data:message}); 
        self.processMessages(self, res, resolve);
    }

    const scripts = document.querySelectorAll(`script[src$="${script}"]`);

    if (scripts.length > 0) {
        const coreInit = (window as any)[self.core];
        if (coreInit) {
            init();
        } else {
            addLoadEvent(scripts[0], init);
        }
    } else {
        const script_elt = document.createElement('script');
        script_elt.src = script;
        addLoadEvent(script_elt, init);
        document.head.appendChild(script_elt);
        self.script = script_elt;
    }
}

function sendMessageNoWorker(self, message) {
    if (window[self.core]) {
        try {
            return self._messageHandlerNoWorker({data:message});
        } catch (error) {
            console.log(error.message);
        }
    }
}

/* Sets up progressive (streaming) playback via Media Source Extensions: the
 * caller (UVideo.ts/UAudio.ts) attaches a MediaSource to the element up
 * front instead of waiting for the whole transcode to finish and reading
 * back one final blob. loader.js's fragmented-mp4mx output (dst:
 * "out.mp4:store=sfrag:cdur=...") is polled from the Emscripten virtual FS
 * as it grows (see the onProgress/onProgressDone hooks wired in
 * launchProgressive below) and each new byte range is fed to the
 * SourceBuffer as soon as it's available, so playback can start well
 * before transcoding completes.
 *
 * mimeCodecs must be a full MSE mime string, e.g.
 * 'video/mp4; codecs="avc1.640028"' or 'audio/mp4; codecs="mp4a.40.2"' -
 * MSE requires the caller to know the codec ahead of time, same as any
 * other manual MSE integration; this repo's transcode targets are fixed
 * (see UVideo.ts/UAudio.ts) so a matching default is provided there. */
function setupProgressive(self, mimeCodecs) {
    const mediaSource = new MediaSource();
    self.src = URL.createObjectURL(mediaSource);

    let sourceBuffer = null;
    const queue = [];
    let ended = false;
    let openError = null;

    function pump() {
        if (!sourceBuffer || sourceBuffer.updating || !queue.length) return;
        const chunk = queue.shift();
        try {
            sourceBuffer.appendBuffer(chunk);
        } catch (e) {
            console.log('[progressive] appendBuffer failed: ' + e.message);
        }
    }

    function maybeEnd() {
        if (ended && sourceBuffer && !sourceBuffer.updating && !queue.length && mediaSource.readyState === 'open') {
            try { mediaSource.endOfStream(); } catch (e) { }
        }
    }

    mediaSource.addEventListener('sourceopen', () => {
        try {
            sourceBuffer = mediaSource.addSourceBuffer(mimeCodecs);
        } catch (e) {
            openError = e;
            console.log('[progressive] addSourceBuffer failed for "' + mimeCodecs + '": ' + e.message);
            return;
        }
        sourceBuffer.addEventListener('updateend', () => {
            pump();
            maybeEnd();
        });
        pump();
    });

    return {
        push(bytes) {
            if (!bytes || !bytes.length) return;
            queue.push(bytes);
            pump();
        },
        finish() {
            ended = true;
            maybeEnd();
        },
        get error() { return openError; }
    };
}

/* Like launchNoWorker, but for progressive playback: wires message.onProgress
 * (called with each new chunk of bytes as the output file grows) and
 * message.onProgressDone (called once transcoding is complete) to the
 * MediaSource handle returned by setupProgressive, in addition to the
 * normal resolve-on-exit_code flow. */
function launchProgressive(self, script, message, resolve, progressive) {
    message.progressive = true;
    message.onProgress = (bytes) => progressive.push(bytes);
    message.onProgressDone = () => progressive.finish();
    launchNoWorker(self, script, message, resolve);
}

export {addScriptDirectoryAndExtIfNeeded, launchNoWorker, sendMessageNoWorker, setupProgressive, launchProgressive, UniversalFn};