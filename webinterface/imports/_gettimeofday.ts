import {HEAP32} from '../UCanvas'

function _gettimeofday(ptr : number)
{
    var now = Date.now();
    HEAP32[((ptr)>>2)] = (now/1000)|0; // seconds
    HEAP32[(((ptr)+(4))>>2)] = ((now % 1000)*1000)|0; // microseconds
    return 0;
}
export {_gettimeofday}
