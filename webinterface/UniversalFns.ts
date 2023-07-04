import urlExist from 'url-exist';

async function test_url(directories, url){
    for (const directory of directories){
        if(await urlExist(directory+url)){
            return directory+url;
        }
    }

    return await urlExist(url)?url : "";
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

export {addScriptDirectoryAndExtIfNeeded};