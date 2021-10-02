var ABORT = false;
var EXITSTATUS;

var err = console.warn.bind(console);

function jsStackTrace() {
    var error = new Error();
    if (!error.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
            throw new Error();
        } catch (e) {
            error = e;
        }
        if (!error.stack) {
            return '(no stack trace available)';
        }
    }
    return error.stack.toString();
}

function demangle(func : string) :string {
    warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
    return func;
  }

function demangleAll(text: string) :string {
    var regex =
        /\b_Z[\w\d_]+/g;
    return text.replace(regex,
        function (x) {
            var y = demangle(x);
            return x === y ? x : (y + ' [' + x + ']');
        });
}

function stackTrace() {
    var js = jsStackTrace();
    return demangleAll(js);
}

interface _iWarnOnce {
    shown: Record<string, number>;
}

var _warnOnce: _iWarnOnce;

function warnOnce(text: string): void {
    if (!_warnOnce.shown[text]) {
        _warnOnce.shown[text] = 1;
        err(text);
    }
}

/** @param {string|number=} what */
function abort(what: string) {

    what += '';
    err(what);

    ABORT = true;
    EXITSTATUS = 1;

    var output = 'abort(' + what + ') at ' + stackTrace();
    what = output;

    // Use a wasm runtime error, because a JS error might be seen as a foreign
    // exception, which means we'd run destructors on it. We need the error to
    // simply make the program stop.
    var e = new WebAssembly.RuntimeError();

    // Throw the error whether or not MODULARIZE is set because abort is used
    // in code paths apart from instantiation where an exception is expected
    // to be thrown when abort is called.
    throw e;
}

/** @type {function(*, string=)} */
function assert(condition: any, text?: string): void {
    if (!condition) {
        abort('Assertion failed: ' + text);
    }
}

export { err, warnOnce, assert }