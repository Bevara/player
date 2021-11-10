import {err, handleException} from "../utils/errors"

function callUserCallback(func :any, synchronous:any) {
  if (this.ABORT) {
    err('user callback triggered after application aborted.  Ignoring.');
    return;
  }
  // For synchronous calls, let any exceptions propagate, and don't let the runtime exit.
  if (synchronous) {
    func();
    return;
  }
  try {
    func();
  } catch (e) {
    handleException(e);
  }
}

  export {callUserCallback}