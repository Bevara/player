import {stackSave, stackAlloc, stackRestore, HEAPF64, _emscripten_run_in_main_runtime_thread_js} from '../index'

/** @type{function(number, (number|boolean), ...(number|boolean))} */
function _emscripten_proxy_to_main_thread_js(index :number, sync : (number|boolean)) {
    // Additional arguments are passed after those two, which are the actual
    // function arguments.
    // The serialization buffer contains the number of call params, and then
    // all the args here.
    // We also pass 'sync' to C separately, since C needs to look at it.
    var numCallArgs = arguments.length - 2;
    if (numCallArgs > 20-1) throw 'emscripten_proxy_to_main_thread_js: Too many arguments ' + numCallArgs + ' to proxied function idx=' + index + ', maximum supported is ' + (20-1) + '!';
    // Allocate a buffer, which will be copied by the C code.
    var stack = stackSave();
    // First passed parameter specifies the number of arguments to the function.
    // When BigInt support is enabled, we must handle types in a more complex
    // way, detecting at runtime if a value is a BigInt or not (as we have no
    // type info here). To do that, add a "prefix" before each value that
    // indicates if it is a BigInt, which effectively doubles the number of
    // values we serialize for proxying. TODO: pack this?
    var serializedNumCallArgs = numCallArgs ;
    var args = stackAlloc(serializedNumCallArgs * 8);
    var b = args >> 3;
    for (var i = 0; i < numCallArgs; i++) {
      var arg = arguments[2 + i];
      HEAPF64[b + i] = arg;
    }
    var ret = _emscripten_run_in_main_runtime_thread_js(index, serializedNumCallArgs, args, sync);
    stackRestore(stack);
    return ret;
  }

  export {_emscripten_proxy_to_main_thread_js}