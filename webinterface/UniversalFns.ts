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
        this.script = script_elt;
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

export {addScriptDirectoryAndExtIfNeeded, launchNoWorker, sendMessageNoWorker, UniversalFn};