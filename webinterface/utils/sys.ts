import {FS, PATH} from "../utils/fs"
import {assert} from "../utils/outputs"

var SYSCALLS = {
  mappings:{},
  DEFAULT_POLLMASK:5,umask:511,
  doMkdir:function(path : string, mode : number) {
    // remove a trailing slash, if one - /a/b/ has basename of '', but
    // we want to create b in the context of this function
    path = PATH.normalize(path);
    if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
    FS.mkdir(path, mode, 0);
    return 0;
  },doWritev:function(stream, iov : number, iovcnt : number, offset?:number) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(((iov)+(i*8))>>2)];
      var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
      var curr = FS.write(stream, HEAP8,ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
    }
    return ret;
  },varargs:undefined,get:function() {
    assert(SYSCALLS.varargs != undefined);
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
    return ret;
  },getStr:function(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },getStreamFromFD:function(fd) {
    var stream = FS.getStream(fd);
    if (!stream) throw new FS.ErrnoError(8);
    return stream;
  },get64:function(low, high) {
    if (low >= 0) assert(high === 0);
    else assert(high === -1);
    return low;
  }};

  export {SYSCALLS}