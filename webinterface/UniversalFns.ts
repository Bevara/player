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
}


export {addScriptDirectoryAndExtIfNeeded, UniversalFn};