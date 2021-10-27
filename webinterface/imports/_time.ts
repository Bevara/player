import {HEAP32} from '../UCanvas'

function _time(ptr:number)
{
    var ret = (Date.now()/1000)|0;
    if (ptr) {
      HEAP32[((ptr)>>2)] = ret;
    }
    return ret;
}
export {_time}
