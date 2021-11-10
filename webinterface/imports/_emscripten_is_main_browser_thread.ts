var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

function _emscripten_is_main_browser_thread()
{
    return !ENVIRONMENT_IS_WORKER;
}
export {_emscripten_is_main_browser_thread}
