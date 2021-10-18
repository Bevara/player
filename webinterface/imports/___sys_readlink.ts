
import {ENVIRONMENT_IS_PTHREAD} from '../imports'
import {_emscripten_proxy_to_main_thread_js} from '../utils/threads'
import {SYSCALLS} from '../utils/sys'
import {FS} from '../utils/fs'
import {abort} from '../utils/outputs'

function ___sys_readlink(path:string, buf :number, bufsize:number) {
//    if (ENVIRONMENT_IS_PTHREAD)
//         return _emscripten_proxy_to_main_thread_js(47, 1, path, buf, bufsize);
//     try {

//         path = SYSCALLS.getStr(path);
//         return SYSCALLS.doReadlink(path, buf, bufsize);
//     } catch (e) {
//         if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
//         return -e.errno;
//     }
}
export { ___sys_readlink }
