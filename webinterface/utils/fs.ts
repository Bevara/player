import {PATH} from './path'
import {ERRNO_MESSAGES, ERRNO_CODES} from './errors'

var FS = {
  currentPath:"/",

  cwd:function() {
    return FS.currentPath;
  },

};

  export {FS}