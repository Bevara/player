import {ENVIRONMENT_IS_PTHREAD} from '../globals'
import {_emscripten_proxy_to_main_thread_js} from '../utils/threads'
import {SYSCALLS} from '../utils/sys'
import {FS} from '../utils/fs'
import {abort} from '../utils/outputs'

function ___sys_open(path : number, flags : number, varargs : number)
{
  console.log ("function ___sys_open has not been implemented!")
}
export {___sys_open}
