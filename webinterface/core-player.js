
import { SDL_MODULE } from "./core-sdl.js"
import { FETCH_MODULE } from "./core-fetch.js"

var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
    function (Module) {
      Module = Module || {};



      // The Module object: Our interface to the outside world. We import
      // and export values on it. There are various ways Module can be used:
      // 1. Not defined. We create it here
      // 2. A function parameter, function(Module) { ..generated code.. }
      // 3. pre-run appended it, var Module = {}; ..generated code..
      // 4. External script tag defines var Module.
      // We need to check if Module already exists (e.g. case 3 above).
      // Substitution will be replaced with actual code on later stage of the build,
      // this way Closure Compiler will not mangle it (e.g. case 4. above).
      // Note that if you want to run closure, and also to use Module
      // after the generated code, you will need to define   var Module = {};
      // before the code. Then that object will be used in the code, and you
      // can continue to use Module afterwards as well.
      var Module = typeof Module != 'undefined' ? Module : {};
      var filter_entries = Module['filter_entries'] || [];
      var module_entries = Module['module_entries'] || [];

      // See https://caniuse.com/mdn-javascript_builtins_object_assign

      // Set up the promise that indicates the Module is initialized
      var readyPromiseResolve, readyPromiseReject;
      Module['ready'] = new Promise(function (resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });

      Object.defineProperty(Module, "filter_entries", { configurable: true, get: function () { return filter_entries } });
      Object.defineProperty(Module, "module_entries", { configurable: true, get: function () { return module_entries } });

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pthread_mutex_unlock')) {
        Object.defineProperty(Module['ready'], '_pthread_mutex_unlock', { configurable: true, get: function () { abort('You are getting _pthread_mutex_unlock on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pthread_mutex_unlock', { configurable: true, set: function () { abort('You are setting _pthread_mutex_unlock on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pthread_mutex_lock')) {
        Object.defineProperty(Module['ready'], '_pthread_mutex_lock', { configurable: true, get: function () { abort('You are getting _pthread_mutex_lock on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pthread_mutex_lock', { configurable: true, set: function () { abort('You are setting _pthread_mutex_lock on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pthread_self')) {
        Object.defineProperty(Module['ready'], '_pthread_self', { configurable: true, get: function () { abort('You are getting _pthread_self on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pthread_self', { configurable: true, set: function () { abort('You are setting _pthread_self on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_sprintf')) {
        Object.defineProperty(Module['ready'], '_sprintf', { configurable: true, get: function () { abort('You are getting _sprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_sprintf', { configurable: true, set: function () { abort('You are setting _sprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_vfprintf')) {
        Object.defineProperty(Module['ready'], '_vfprintf', { configurable: true, get: function () { abort('You are getting _vfprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_vfprintf', { configurable: true, set: function () { abort('You are setting _vfprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_fprintf')) {
        Object.defineProperty(Module['ready'], '_fprintf', { configurable: true, get: function () { abort('You are getting _fprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_fprintf', { configurable: true, set: function () { abort('You are setting _fprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_bsearch')) {
        Object.defineProperty(Module['ready'], '_bsearch', { configurable: true, get: function () { abort('You are getting _bsearch on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_bsearch', { configurable: true, set: function () { abort('You are setting _bsearch on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_frexp')) {
        Object.defineProperty(Module['ready'], '_frexp', { configurable: true, get: function () { abort('You are getting _frexp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_frexp', { configurable: true, set: function () { abort('You are setting _frexp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_llrint')) {
        Object.defineProperty(Module['ready'], '_llrint', { configurable: true, get: function () { abort('You are getting _llrint on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_llrint', { configurable: true, set: function () { abort('You are setting _llrint on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_fwrite')) {
        Object.defineProperty(Module['ready'], '_fwrite', { configurable: true, get: function () { abort('You are getting _fwrite on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_fwrite', { configurable: true, set: function () { abort('You are setting _fwrite on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_cos')) {
        Object.defineProperty(Module['ready'], '_cos', { configurable: true, get: function () { abort('You are getting _cos on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_cos', { configurable: true, set: function () { abort('You are setting _cos on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_cosh')) {
        Object.defineProperty(Module['ready'], '_cosh', { configurable: true, get: function () { abort('You are getting _cosh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_cosh', { configurable: true, set: function () { abort('You are setting _cosh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_acos')) {
        Object.defineProperty(Module['ready'], '_acos', { configurable: true, get: function () { abort('You are getting _acos on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_acos', { configurable: true, set: function () { abort('You are setting _acos on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_sin')) {
        Object.defineProperty(Module['ready'], '_sin', { configurable: true, get: function () { abort('You are getting _sin on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_sin', { configurable: true, set: function () { abort('You are setting _sin on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_sinh')) {
        Object.defineProperty(Module['ready'], '_sinh', { configurable: true, get: function () { abort('You are getting _sinh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_sinh', { configurable: true, set: function () { abort('You are setting _sinh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_asin')) {
        Object.defineProperty(Module['ready'], '_asin', { configurable: true, get: function () { abort('You are getting _asin on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_asin', { configurable: true, set: function () { abort('You are setting _asin on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_tan')) {
        Object.defineProperty(Module['ready'], '_tan', { configurable: true, get: function () { abort('You are getting _tan on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_tan', { configurable: true, set: function () { abort('You are setting _tan on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_tanh')) {
        Object.defineProperty(Module['ready'], '_tanh', { configurable: true, get: function () { abort('You are getting _tanh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_tanh', { configurable: true, set: function () { abort('You are setting _tanh on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_atan')) {
        Object.defineProperty(Module['ready'], '_atan', { configurable: true, get: function () { abort('You are getting _atan on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_atan', { configurable: true, set: function () { abort('You are setting _atan on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_exp')) {
        Object.defineProperty(Module['ready'], '_exp', { configurable: true, get: function () { abort('You are getting _exp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_exp', { configurable: true, set: function () { abort('You are setting _exp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_log')) {
        Object.defineProperty(Module['ready'], '_log', { configurable: true, get: function () { abort('You are getting _log on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_log', { configurable: true, set: function () { abort('You are setting _log on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_fabs')) {
        Object.defineProperty(Module['ready'], '_fabs', { configurable: true, get: function () { abort('You are getting _fabs on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_fabs', { configurable: true, set: function () { abort('You are setting _fabs on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strncmp')) {
        Object.defineProperty(Module['ready'], '_strncmp', { configurable: true, get: function () { abort('You are getting _strncmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strncmp', { configurable: true, set: function () { abort('You are setting _strncmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strdup')) {
        Object.defineProperty(Module['ready'], '_strdup', { configurable: true, get: function () { abort('You are getting _strdup on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strdup', { configurable: true, set: function () { abort('You are setting _strdup on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_timescale')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_timescale', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_timescale on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_timescale', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_timescale on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_cts')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_cts', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_cts', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_duration')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_duration', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_duration on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_duration', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_duration on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_fileio_url')) {
        Object.defineProperty(Module['ready'], '_gf_fileio_url', { configurable: true, get: function () { abort('You are getting _gf_fileio_url on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_fileio_url', { configurable: true, set: function () { abort('You are setting _gf_fileio_url on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_fileio_new')) {
        Object.defineProperty(Module['ready'], '_gf_fileio_new', { configurable: true, get: function () { abort('You are getting _gf_fileio_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_fileio_new', { configurable: true, set: function () { abort('You are setting _gf_fileio_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_fileio_set_stats_u32')) {
        Object.defineProperty(Module['ready'], '_gf_fileio_set_stats_u32', { configurable: true, get: function () { abort('You are getting _gf_fileio_set_stats_u32 on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_fileio_set_stats_u32', { configurable: true, set: function () { abort('You are setting _gf_fileio_set_stats_u32 on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_ldexp')) {
        Object.defineProperty(Module['ready'], '_ldexp', { configurable: true, get: function () { abort('You are getting _ldexp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_ldexp', { configurable: true, set: function () { abort('You are setting _ldexp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pthread_mutex_destroy')) {
        Object.defineProperty(Module['ready'], '_pthread_mutex_destroy', { configurable: true, get: function () { abort('You are getting _pthread_mutex_destroy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pthread_mutex_destroy', { configurable: true, set: function () { abort('You are setting _pthread_mutex_destroy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pthread_mutex_init')) {
        Object.defineProperty(Module['ready'], '_pthread_mutex_init', { configurable: true, get: function () { abort('You are getting _pthread_mutex_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pthread_mutex_init', { configurable: true, set: function () { abort('You are setting _pthread_mutex_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_posix_memalign')) {
        Object.defineProperty(Module['ready'], '_posix_memalign', { configurable: true, get: function () { abort('You are getting _posix_memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_posix_memalign', { configurable: true, set: function () { abort('You are setting _posix_memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_pow')) {
        Object.defineProperty(Module['ready'], '_pow', { configurable: true, get: function () { abort('You are getting _pow on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_pow', { configurable: true, set: function () { abort('You are setting _pow on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_vsnprintf')) {
        Object.defineProperty(Module['ready'], '_vsnprintf', { configurable: true, get: function () { abort('You are getting _vsnprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_vsnprintf', { configurable: true, set: function () { abort('You are setting _vsnprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_getenv')) {
        Object.defineProperty(Module['ready'], '_getenv', { configurable: true, get: function () { abort('You are getting _getenv on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_getenv', { configurable: true, set: function () { abort('You are setting _getenv on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strcmp')) {
        Object.defineProperty(Module['ready'], '_strcmp', { configurable: true, get: function () { abort('You are getting _strcmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strcmp', { configurable: true, set: function () { abort('You are setting _strcmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strlen')) {
        Object.defineProperty(Module['ready'], '_strlen', { configurable: true, get: function () { abort('You are getting _strlen on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strlen', { configurable: true, set: function () { abort('You are setting _strlen on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strcpy')) {
        Object.defineProperty(Module['ready'], '_strcpy', { configurable: true, get: function () { abort('You are getting _strcpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strcpy', { configurable: true, set: function () { abort('You are setting _strcpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strcat')) {
        Object.defineProperty(Module['ready'], '_strcat', { configurable: true, get: function () { abort('You are getting _strcat on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strcat', { configurable: true, set: function () { abort('You are setting _strcat on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strncpy')) {
        Object.defineProperty(Module['ready'], '_strncpy', { configurable: true, get: function () { abort('You are getting _strncpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strncpy', { configurable: true, set: function () { abort('You are setting _strncpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strchr')) {
        Object.defineProperty(Module['ready'], '_strchr', { configurable: true, get: function () { abort('You are getting _strchr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_strchr', { configurable: true, set: function () { abort('You are setting _strchr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memset')) {
        Object.defineProperty(Module['ready'], '_memset', { configurable: true, get: function () { abort('You are getting _memset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_memset', { configurable: true, set: function () { abort('You are setting _memset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memcpy')) {
        Object.defineProperty(Module['ready'], '_memcpy', { configurable: true, get: function () { abort('You are getting _memcpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_memcpy', { configurable: true, set: function () { abort('You are setting _memcpy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memmove')) {
        Object.defineProperty(Module['ready'], '_memmove', { configurable: true, get: function () { abort('You are getting _memmove on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_memmove', { configurable: true, set: function () { abort('You are setting _memmove on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memalign')) {
        Object.defineProperty(Module['ready'], '_memalign', { configurable: true, get: function () { abort('You are getting _memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_memalign', { configurable: true, set: function () { abort('You are setting _memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memcmp')) {
        Object.defineProperty(Module['ready'], '_memcmp', { configurable: true, get: function () { abort('You are getting _memcmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_memcmp', { configurable: true, set: function () { abort('You are setting _memcmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_calloc')) {
        Object.defineProperty(Module['ready'], '_calloc', { configurable: true, get: function () { abort('You are getting _calloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_calloc', { configurable: true, set: function () { abort('You are setting _calloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_realloc')) {
        Object.defineProperty(Module['ready'], '_realloc', { configurable: true, get: function () { abort('You are getting _realloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_realloc', { configurable: true, set: function () { abort('You are setting _realloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_url_concatenate')) {
        Object.defineProperty(Module['ready'], '_gf_url_concatenate', { configurable: true, get: function () { abort('You are getting _gf_url_concatenate on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_url_concatenate', { configurable: true, set: function () { abort('You are setting _gf_url_concatenate on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_strdup')) {
        Object.defineProperty(Module['ready'], '_gf_strdup', { configurable: true, get: function () { abort('You are getting _gf_strdup on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_strdup', { configurable: true, set: function () { abort('You are setting _gf_strdup on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_fileio_get_udta')) {
        Object.defineProperty(Module['ready'], '_gf_fileio_get_udta', { configurable: true, get: function () { abort('You are getting _gf_fileio_get_udta on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_fileio_get_udta', { configurable: true, set: function () { abort('You are setting _gf_fileio_get_udta on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_bs_new')) {
        Object.defineProperty(Module['ready'], '_gf_bs_new', { configurable: true, get: function () { abort('You are getting _gf_bs_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_bs_new', { configurable: true, set: function () { abort('You are setting _gf_bs_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_bs_available')) {
        Object.defineProperty(Module['ready'], '_gf_bs_available', { configurable: true, get: function () { abort('You are getting _gf_bs_available on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_bs_available', { configurable: true, set: function () { abort('You are setting _gf_bs_available on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_bs_read_int')) {
        Object.defineProperty(Module['ready'], '_gf_bs_read_int', { configurable: true, get: function () { abort('You are getting _gf_bs_read_int on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_bs_read_int', { configurable: true, set: function () { abort('You are setting _gf_bs_read_int on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_bs_get_position')) {
        Object.defineProperty(Module['ready'], '_gf_bs_get_position', { configurable: true, get: function () { abort('You are getting _gf_bs_get_position on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_bs_get_position', { configurable: true, set: function () { abort('You are setting _gf_bs_get_position on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_bs_del')) {
        Object.defineProperty(Module['ready'], '_gf_bs_del', { configurable: true, get: function () { abort('You are getting _gf_bs_del on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_bs_del', { configurable: true, set: function () { abort('You are setting _gf_bs_del on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_get_udta')) {
        Object.defineProperty(Module['ready'], '_gf_filter_get_udta', { configurable: true, get: function () { abort('You are getting _gf_filter_get_udta on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_get_udta', { configurable: true, set: function () { abort('You are setting _gf_filter_get_udta on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_get_packet')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_get_packet', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_get_packet on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_get_packet', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_get_packet on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_data')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_data', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_data on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_data', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_data on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_set_property')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_set_property', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_set_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_set_property', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_set_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_new_alloc')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_new_alloc', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_new_alloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_new_alloc', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_new_alloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_send')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_send', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_send on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_send', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_send on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_check_caps')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_check_caps', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_check_caps on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_check_caps', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_check_caps on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_get_property')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_get_property', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_get_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_get_property', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_get_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_new')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_new', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_new', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_copy_properties')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_copy_properties', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_copy_properties on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_copy_properties', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_copy_properties on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_set_name')) {
        Object.defineProperty(Module['ready'], '_gf_filter_set_name', { configurable: true, get: function () { abort('You are getting _gf_filter_set_name on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_set_name', { configurable: true, set: function () { abort('You are setting _gf_filter_set_name on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_dependency_flags')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_dependency_flags', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_dependency_flags on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_dependency_flags', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_dependency_flags on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pid_set_framing_mode')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pid_set_framing_mode', { configurable: true, get: function () { abort('You are getting _gf_filter_pid_set_framing_mode on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pid_set_framing_mode', { configurable: true, set: function () { abort('You are setting _gf_filter_pid_set_framing_mode on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_new_ref')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_new_ref', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_new_ref on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_new_ref', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_new_ref on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_cts')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_cts', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_cts', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_sap')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_sap', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_sap on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_sap', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_sap on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_duration')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_duration', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_duration on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_duration', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_duration on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_property')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_property', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_property', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_property on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_byte_offset')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_byte_offset', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_byte_offset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_byte_offset', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_byte_offset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_framing')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_framing', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_framing on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_framing', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_framing on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_set_seek_flag')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_seek_flag', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_set_seek_flag on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_set_seek_flag', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_set_seek_flag on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_gf_filter_pck_get_seek_flag')) {
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_seek_flag', { configurable: true, get: function () { abort('You are getting _gf_filter_pck_get_seek_flag on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_gf_filter_pck_get_seek_flag', { configurable: true, set: function () { abort('You are setting _gf_filter_pck_get_seek_flag on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_fflush')) {
        Object.defineProperty(Module['ready'], '_fflush', { configurable: true, get: function () { abort('You are getting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_fflush', { configurable: true, set: function () { abort('You are setting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_siprintf')) {
        Object.defineProperty(Module['ready'], '_siprintf', { configurable: true, get: function () { abort('You are getting _siprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_siprintf', { configurable: true, set: function () { abort('You are setting _siprintf on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_constructor')) {
        Object.defineProperty(Module['ready'], '_constructor', { configurable: true, get: function () { abort('You are getting _constructor on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_constructor', { configurable: true, set: function () { abort('You are setting _constructor on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_set')) {
        Object.defineProperty(Module['ready'], '_set', { configurable: true, get: function () { abort('You are getting _set on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_set', { configurable: true, set: function () { abort('You are setting _set on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_get')) {
        Object.defineProperty(Module['ready'], '_get', { configurable: true, get: function () { abort('You are getting _get on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_get', { configurable: true, set: function () { abort('You are setting _get on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_destructor')) {
        Object.defineProperty(Module['ready'], '_destructor', { configurable: true, get: function () { abort('You are getting _destructor on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_destructor', { configurable: true, set: function () { abort('You are setting _destructor on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '___stdio_exit')) {
        Object.defineProperty(Module['ready'], '___stdio_exit', { configurable: true, get: function () { abort('You are getting ___stdio_exit on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '___stdio_exit', { configurable: true, set: function () { abort('You are setting ___stdio_exit on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_bs_new')) {
        Object.defineProperty(Module['ready'], '_orig$gf_bs_new', { configurable: true, get: function () { abort('You are getting _orig$gf_bs_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_bs_new', { configurable: true, set: function () { abort('You are setting _orig$gf_bs_new on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_bs_available')) {
        Object.defineProperty(Module['ready'], '_orig$gf_bs_available', { configurable: true, get: function () { abort('You are getting _orig$gf_bs_available on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_bs_available', { configurable: true, set: function () { abort('You are setting _orig$gf_bs_available on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_bs_get_position')) {
        Object.defineProperty(Module['ready'], '_orig$gf_bs_get_position', { configurable: true, get: function () { abort('You are getting _orig$gf_bs_get_position on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_bs_get_position', { configurable: true, set: function () { abort('You are setting _orig$gf_bs_get_position on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_filter_pck_set_cts')) {
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_set_cts', { configurable: true, get: function () { abort('You are getting _orig$gf_filter_pck_set_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_set_cts', { configurable: true, set: function () { abort('You are setting _orig$gf_filter_pck_set_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_filter_pck_get_cts')) {
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_get_cts', { configurable: true, get: function () { abort('You are getting _orig$gf_filter_pck_get_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_get_cts', { configurable: true, set: function () { abort('You are setting _orig$gf_filter_pck_get_cts on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$gf_filter_pck_set_byte_offset')) {
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_set_byte_offset', { configurable: true, get: function () { abort('You are getting _orig$gf_filter_pck_set_byte_offset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$gf_filter_pck_set_byte_offset', { configurable: true, set: function () { abort('You are setting _orig$gf_filter_pck_set_byte_offset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_orig$llrint')) {
        Object.defineProperty(Module['ready'], '_orig$llrint', { configurable: true, get: function () { abort('You are getting _orig$llrint on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_orig$llrint', { configurable: true, set: function () { abort('You are setting _orig$llrint on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      if (!Object.getOwnPropertyDescriptor(Module['ready'], 'onRuntimeInitialized')) {
        Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, get: function () { abort('You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, set: function () { abort('You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }


      // --pre-jses are emitted after the Module integration code, so that they can
      // refer to Module (if they choose; they can also define Module)
      // {{PRE_JSES}}

      // Sometimes an existing Module object exists with properties
      // meant to overwrite the default module functionality. Here
      // we collect those properties and reapply _after_ we configure
      // the current environment's defaults to avoid having to be so
      // defensive during initialization.
      var moduleOverrides = Object.assign({}, Module);

      var arguments_ = [];
      var thisProgram = './this.program';
      var quit_ = (status, toThrow) => {
        throw toThrow;
      };

      // Determine the runtime environment we are in. You can customize this by
      // setting the ENVIRONMENT setting at compile time (see settings.js).

      // Attempt to auto-detect the environment
      var ENVIRONMENT_IS_WEB = typeof window == 'object';
      var ENVIRONMENT_IS_WORKER = false;//typeof importScripts == 'function';
      // N.b. Electron.js environment is simultaneously a NODE-environment, but
      // also a web environment.
      var ENVIRONMENT_IS_NODE = false;//typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
      var ENVIRONMENT_IS_SHELL = false;//!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

      if (Module['ENVIRONMENT']) {
        throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
      }

      // `/` should be present at the end if `scriptDirectory` is not empty
      var scriptDirectory = '';
      function locateFile(path) {
        if (Module['locateFile']) {
          return Module['locateFile'](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }

      // Hooks that are implemented differently in different runtime environments.
      var read_,
        readAsync,
        readBinary,
        setWindowTitle;

      // Normally we don't log exceptions but instead let them bubble out the top
      // level where the embedding environment (e.g. the browser) can handle
      // them.
      // However under v8 and node we sometimes exit the process direcly in which case
      // its up to use us to log the exception before exiting.
      // If we fix https://github.com/emscripten-core/emscripten/issues/15080
      // this may no longer be needed under node.
      function logExceptionOnExit(e) {
        if (e instanceof ExitStatus) return;
        let toLog = e;
        if (e && typeof e == 'object' && e.stack) {
          toLog = [e, e.stack];
        }
        err('exiting due to exception: ' + toLog);
      }

      var fs;

      if (ENVIRONMENT_IS_SHELL) {

        if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

        if (typeof read != 'undefined') {
          read_ = function shell_read(f) {
            return read(f);
          };
        }

        readBinary = function readBinary(f) {
          let data;
          if (typeof readbuffer == 'function') {
            return new Uint8Array(readbuffer(f));
          }
          data = read(f, 'binary');
          assert(typeof data == 'object');
          return data;
        };

        readAsync = function readAsync(f, onload, onerror) {
          setTimeout(() => onload(readBinary(f)), 0);
        };

        if (typeof scriptArgs != 'undefined') {
          arguments_ = scriptArgs;
        } else if (typeof arguments != 'undefined') {
          arguments_ = arguments;
        }

        if (typeof quit == 'function') {
          quit_ = (status, toThrow) => {
            logExceptionOnExit(toThrow);
            quit(status);
          };
        }

        if (typeof print != 'undefined') {
          // Prefer to use print/printErr where they exist, as they usually work better.
          if (typeof console == 'undefined') console = /** @type{!Console} */({});
          console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
          console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != 'undefined' ? printErr : print);
        }

      } else

        // Note that this includes Node.js workers when relevant (pthreads is enabled).
        // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
        // ENVIRONMENT_IS_NODE.
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
            scriptDirectory = self.location.href;
          } else if (typeof document != 'undefined' && document.currentScript) { // web
            scriptDirectory = document.currentScript.src;
          }
          // When MODULARIZE, this JS may be executed later, after document.currentScript
          // is gone, so we saved it, and we use it here instead of any other info.
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
          // otherwise, slice off the final part of the url to find the script directory.
          // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
          // and scriptDirectory will correctly be replaced with an empty string.
          // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
          // they are removed because they could contain a slash.
          if (scriptDirectory.indexOf('blob:') !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/') + 1);
          } else {
            scriptDirectory = '';
          }

          if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

          // Differentiate the Web Worker from the Node Worker case, as reading must
          // be done differently.
          {
            // include: web_or_worker_shell_read.js


            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.send(null);
              return xhr.responseText;
            }

            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
              };
            }

            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.responseType = 'arraybuffer';
              xhr.onload = () => {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            }

            // end include: web_or_worker_shell_read.js
          }

          setWindowTitle = (title) => document.title = title;
        } else {
          throw new Error('environment detection error');
        }

      var out = Module['print'] || console.log.bind(console);
      var err = Module['printErr'] || console.warn.bind(console);

      // Merge back in the overrides
      Object.assign(Module, moduleOverrides);
      // Free the object hierarchy contained in the overrides, this lets the GC
      // reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
      moduleOverrides = null;
      checkIncomingModuleAPI();

      // Emit code to handle expected values on the Module object. This applies Module.x
      // to the proper local x. This has two benefits: first, we only emit it if it is
      // expected to arrive, and second, by using a local everywhere else that can be
      // minified.

      if (Module['arguments']) arguments_ = Module['arguments']; legacyModuleProp('arguments', 'arguments_');

      if (Module['thisProgram']) thisProgram = Module['thisProgram']; legacyModuleProp('thisProgram', 'thisProgram');

      if (Module['quit']) quit_ = Module['quit']; legacyModuleProp('quit', 'quit_');

      // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
      // Assertions on removed incoming Module JS APIs.
      assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
      assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
      assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
      assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
      assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
      assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
      assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
      assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
      assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
      legacyModuleProp('read', 'read_');
      legacyModuleProp('readAsync', 'readAsync');
      legacyModuleProp('readBinary', 'readBinary');
      legacyModuleProp('setWindowTitle', 'setWindowTitle');
      var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
      var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
      var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
      var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';


      assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-s ENVIRONMENT` to enable.");




      var STACK_ALIGN = 16;
      var POINTER_SIZE = 4;

      function getNativeTypeSize(type) {
        switch (type) {
          case 'i1': case 'i8': return 1;
          case 'i16': return 2;
          case 'i32': return 4;
          case 'i64': return 8;
          case 'float': return 4;
          case 'double': return 8;
          default: {
            if (type[type.length - 1] === '*') {
              return POINTER_SIZE;
            } else if (type[0] === 'i') {
              const bits = Number(type.substr(1));
              assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
              return bits / 8;
            } else {
              return 0;
            }
          }
        }
      }

      function warnOnce(text) {
        if (!warnOnce.shown) warnOnce.shown = {};
        if (!warnOnce.shown[text]) {
          warnOnce.shown[text] = 1;
          err(text);
        }
      }

      // include: runtime_functions.js


      // Wraps a JS function as a wasm function with a given signature.
      function convertJsFunctionToWasm(func, sig) {

        // If the type reflection proposal is available, use the new
        // "WebAssembly.Function" constructor.
        // Otherwise, construct a minimal wasm module importing the JS function and
        // re-exporting it.
        if (typeof WebAssembly.Function == "function") {
          var typeNames = {
            'i': 'i32',
            'j': 'i64',
            'f': 'f32',
            'd': 'f64'
          };
          var type = {
            parameters: [],
            results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
          };
          for (var i = 1; i < sig.length; ++i) {
            type.parameters.push(typeNames[sig[i]]);
          }
          return new WebAssembly.Function(type, func);
        }

        // The module is static, with the exception of the type section, which is
        // generated based on the signature passed in.
        var typeSection = [
          0x01, // id: section,
          0x00, // length: 0 (placeholder)
          0x01, // count: 1
          0x60, // form: func
        ];
        var sigRet = sig.slice(0, 1);
        var sigParam = sig.slice(1);
        var typeCodes = {
          'i': 0x7f, // i32
          'j': 0x7e, // i64
          'f': 0x7d, // f32
          'd': 0x7c, // f64
        };

        // Parameters, length + signatures
        typeSection.push(sigParam.length);
        for (var i = 0; i < sigParam.length; ++i) {
          typeSection.push(typeCodes[sigParam[i]]);
        }

        // Return values, length + signatures
        // With no multi-return in MVP, either 0 (void) or 1 (anything else)
        if (sigRet == 'v') {
          typeSection.push(0x00);
        } else {
          typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
        }

        // Write the overall length of the type section back into the section header
        // (excepting the 2 bytes for the section id and length)
        typeSection[1] = typeSection.length - 2;

        // Rest of the module is static
        var bytes = new Uint8Array([
          0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
          0x01, 0x00, 0x00, 0x00, // version: 1
        ].concat(typeSection, [
          0x02, 0x07, // import section
          // (import "e" "f" (func 0 (type 0)))
          0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
          0x07, 0x05, // export section
          // (export "f" (func 0 (type 0)))
          0x01, 0x01, 0x66, 0x00, 0x00,
        ]));

        // We can compile this wasm module synchronously because it is very small.
        // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
        var module = new WebAssembly.Module(bytes);
        var instance = new WebAssembly.Instance(module, {
          'e': {
            'f': func
          }
        });
        var wrappedFunc = instance.exports['f'];
        return wrappedFunc;
      }

      var freeTableIndexes = [];

      // Weak map of functions in the table to their indexes, created on first use.
      var functionsInTableMap;

      function getEmptyTableSlot() {
        // Reuse a free index if there is one, otherwise grow.
        if (freeTableIndexes.length) {
          return freeTableIndexes.pop();
        }
        // Grow the table
        try {
          wasmTable.grow(1);
        } catch (err) {
          if (!(err instanceof RangeError)) {
            throw err;
          }
          throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
        }
        return wasmTable.length - 1;
      }

      function updateTableMap(offset, count) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          // Ignore null values.
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }

      /**
       * Add a function to the table.
       * 'sig' parameter is required if the function being added is a JS function.
       * @param {string=} sig
       */
      function addFunction(func, sig) {
        assert(typeof func != 'undefined');

        // Check if the function is already in the table, to ensure each function
        // gets a unique index. First, create the map if this is the first use.
        if (!functionsInTableMap) {
          functionsInTableMap = new WeakMap();
          updateTableMap(0, wasmTable.length);
        }
        if (functionsInTableMap.has(func)) {
          return functionsInTableMap.get(func);
        }

        // It's not in the table, add it now.

        var ret = getEmptyTableSlot();

        // Set the new value.
        try {
          // Attempting to call this with JS function will cause of table.set() to fail
          setWasmTableEntry(ret, func);
        } catch (err) {
          if (!(err instanceof TypeError)) {
            throw err;
          }
          assert(typeof sig != 'undefined', 'Missing signature argument to addFunction: ' + func);
          var wrapped = convertJsFunctionToWasm(func, sig);
          setWasmTableEntry(ret, wrapped);
        }

        functionsInTableMap.set(func, ret);

        return ret;
      }

      function removeFunction(index) {
        functionsInTableMap.delete(getWasmTableEntry(index));
        freeTableIndexes.push(index);
      }

      // end include: runtime_functions.js
      // include: runtime_debug.js


      function legacyModuleProp(prop, newName) {
        if (!Object.getOwnPropertyDescriptor(Module, prop)) {
          Object.defineProperty(Module, prop, {
            configurable: true,
            get: function () {
              abort('Module.' + prop + ' has been replaced with plain ' + newName + ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
            }
          });
        }
      }

      function ignoredModuleProp(prop) {
        if (Object.getOwnPropertyDescriptor(Module, prop)) {
          abort('`Module.' + prop + '` was supplied but `' + prop + '` not included in INCOMING_MODULE_JS_API');
        }
      }

      function unexportedMessage(sym, isFSSybol) {
        var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
        if (isFSSybol) {
          msg += '. Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you';
        }
        return msg;
      }

      function unexportedRuntimeSymbol(sym, isFSSybol) {
        if (!Object.getOwnPropertyDescriptor(Module, sym)) {
          Object.defineProperty(Module, sym, {
            configurable: true,
            get: function () {
              abort(unexportedMessage(sym, isFSSybol));
            }
          });
        }
      }

      function unexportedRuntimeFunction(sym, isFSSybol) {
        if (!Object.getOwnPropertyDescriptor(Module, sym)) {
          Module[sym] = () => abort(unexportedMessage(sym, isFSSybol));
        }
      }

      // end include: runtime_debug.js
      var tempRet0 = 0;
      var setTempRet0 = (value) => { tempRet0 = value; };
      var getTempRet0 = () => tempRet0;



      // === Preamble library stuff ===

      // Documentation for the public APIs defined in this file must be updated in:
      //    site/source/docs/api_reference/preamble.js.rst
      // A prebuilt local version of the documentation is available at:
      //    site/build/text/docs/api_reference/preamble.js.txt
      // You can also build docs locally as HTML or other formats in site/
      // An online HTML version (which may be of a different version of Emscripten)
      //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

      var dynamicLibraries = Module['dynamicLibraries'] || [];

      var wasmBinary;
      if (Module['wasmBinary']) wasmBinary = Module['wasmBinary']; legacyModuleProp('wasmBinary', 'wasmBinary');
      var noExitRuntime = Module['noExitRuntime'] || true; legacyModuleProp('noExitRuntime', 'noExitRuntime');

      if (typeof WebAssembly != 'object') {
        abort('no native wasm support detected');
      }

      // include: runtime_safe_heap.js


      // In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
      // In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

      /** @param {number} ptr
          @param {number} value
          @param {string} type
          @param {number|boolean=} noSafe */
      function setValue(ptr, value, type = 'i8', noSafe) {
        if (type.charAt(type.length - 1) === '*') type = 'i32';
        switch (type) {
          case 'i1': HEAP8[((ptr) >> 0)] = value; break;
          case 'i8': HEAP8[((ptr) >> 0)] = value; break;
          case 'i16': HEAP16[((ptr) >> 1)] = value; break;
          case 'i32': HEAP32[((ptr) >> 2)] = value; break;
          case 'i64': (tempI64 = [value >>> 0, (tempDouble = value, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[((ptr) >> 2)] = tempI64[0], HEAP32[(((ptr) + (4)) >> 2)] = tempI64[1]); break;
          case 'float': HEAPF32[((ptr) >> 2)] = value; break;
          case 'double': HEAPF64[((ptr) >> 3)] = value; break;
          default: abort('invalid type for setValue: ' + type);
        }
      }

      /** @param {number} ptr
          @param {string} type
          @param {number|boolean=} noSafe */
      function getValue(ptr, type = 'i8', noSafe) {
        if (type.charAt(type.length - 1) === '*') type = 'i32';
        switch (type) {
          case 'i1': return HEAP8[((ptr) >> 0)];
          case 'i8': return HEAP8[((ptr) >> 0)];
          case 'i16': return HEAP16[((ptr) >> 1)];
          case 'i32': return HEAP32[((ptr) >> 2)];
          case 'i64': return HEAP32[((ptr) >> 2)];
          case 'float': return HEAPF32[((ptr) >> 2)];
          case 'double': return Number(HEAPF64[((ptr) >> 3)]);
          default: abort('invalid type for getValue: ' + type);
        }
        return null;
      }

      // end include: runtime_safe_heap.js
      // Wasm globals

      var wasmMemory;


      //========================================
      // SDL functions
      //========================================


      //========================================
      // Runtime essentials
      //========================================

      // whether we are quitting the application. no code should run after this.
      // set in exit() and abort()
      var ABORT = false;

      // set by exit() and abort().  Passed to 'onExit' handler.
      // NOTE: This is also used as the process return code code in shell environments
      // but only when noExitRuntime is false.
      var EXITSTATUS;

      /** @type {function(*, string=)} */
      function assert(condition, text) {
        if (!condition) {
          abort('Assertion failed' + (text ? ': ' + text : ''));
        }
      }

      // Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
      function getCFunc(ident) {
        var func = Module['_' + ident]; // closure exported function
        assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
        return func;
      }

      // C calling interface.
      /** @param {string|null=} returnType
          @param {Array=} argTypes
          @param {Arguments|Array=} args
          @param {Object=} opts */
      function ccall(ident, returnType, argTypes, args, opts) {
        // For fast lookup of conversion functions
        var toC = {
          'string': function (str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) { // null string
              // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
              var len = (str.length << 2) + 1;
              ret = stackAlloc(len);
              stringToUTF8(str, ret, len);
            }
            return ret;
          },
          'array': function (arr) {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret;
          }
        };

        function convertReturnValue(ret) {
          if (returnType === 'string') return UTF8ToString(ret);
          if (returnType === 'boolean') return Boolean(ret);
          return ret;
        }

        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        assert(returnType !== 'array', 'Return type should not be "array".');
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0) stack = stackSave();
              cArgs[i] = converter(args[i]);
            } else {
              cArgs[i] = args[i];
            }
          }
        }
        var ret = func.apply(null, cArgs);
        function onDone(ret) {
          if (stack !== 0) stackRestore(stack);
          return convertReturnValue(ret);
        }

        ret = onDone(ret);
        return ret;
      }

      /** @param {string=} returnType
          @param {Array=} argTypes
          @param {Object=} opts */
      function cwrap(ident, returnType, argTypes, opts) {
        return function () {
          return ccall(ident, returnType, argTypes, arguments, opts);
        }
      }

      // We used to include malloc/free by default in the past. Show a helpful error in
      // builds with assertions.

      // include: runtime_legacy.js


      var ALLOC_NORMAL = 0; // Tries to use _malloc()
      var ALLOC_STACK = 1; // Lives for the duration of the current function call

      /**
       * allocate(): This function is no longer used by emscripten but is kept around to avoid
       *             breaking external users.
       *             You should normally not use allocate(), and instead allocate
       *             memory using _malloc()/stackAlloc(), initialize it with
       *             setValue(), and so forth.
       * @param {(Uint8Array|Array<number>)} slab: An array of data.
       * @param {number=} allocator : How to allocate memory, see ALLOC_*
       */
      function allocate(slab, allocator) {
        var ret;
        assert(typeof allocator == 'number', 'allocate no longer takes a type argument')
        assert(typeof slab != 'number', 'allocate no longer takes a number as arg0')

        if (allocator == ALLOC_STACK) {
          ret = stackAlloc(slab.length);
        } else {
          ret = _malloc(slab.length);
        }

        if (!slab.subarray && !slab.slice) {
          slab = new Uint8Array(slab);
        }
        HEAPU8.set(slab, ret);
        return ret;
      }

      // end include: runtime_legacy.js
      // include: runtime_strings.js


      // runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

      var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

      // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
      // a copy of that string as a Javascript String object.
      /**
       * heapOrArray is either a regular array, or a JavaScript typed array view.
       * @param {number} idx
       * @param {number=} maxBytesToRead
       * @return {string}
       */
      function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
        // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
        // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
        while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        } else {
          var str = '';
          // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
          while (idx < endPtr) {
            // For UTF8 byte structure, see:
            // http://en.wikipedia.org/wiki/UTF-8#Description
            // https://www.ietf.org/rfc/rfc2279.txt
            // https://tools.ietf.org/html/rfc3629
            var u0 = heapOrArray[idx++];
            if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 0xF0) == 0xE0) {
              u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
              if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
              u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
            }

            if (u0 < 0x10000) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 0x10000;
              str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
            }
          }
        }
        return str;
      }

      // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
      // copy of that string as a Javascript String object.
      // maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
      //                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
      //                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
      //                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
      //                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
      //                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
      //                 throw JS JIT optimizations off, so it is worth to consider consistently using one
      //                 style or the other.
      /**
       * @param {number} ptr
       * @param {number=} maxBytesToRead
       * @return {string}
       */
      function UTF8ToString(ptr, maxBytesToRead) {
        ;
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
      }

      // Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
      // encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
      // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
      // Parameters:
      //   str: the Javascript string to copy.
      //   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
      //   outIdx: The starting offset in the array to begin the copying.
      //   maxBytesToWrite: The maximum number of bytes this function can write to the array.
      //                    This count should include the null terminator,
      //                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
      //                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
      // Returns the number of bytes written, EXCLUDING the null terminator.

      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
          return 0;

        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
          var u = str.charCodeAt(i); // possibly a lead surrogate
          if (u >= 0xD800 && u <= 0xDFFF) {
            var u1 = str.charCodeAt(++i);
            u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
          }
          if (u <= 0x7F) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
          } else if (u <= 0x7FF) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 0xC0 | (u >> 6);
            heap[outIdx++] = 0x80 | (u & 63);
          } else if (u <= 0xFFFF) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 0xE0 | (u >> 12);
            heap[outIdx++] = 0x80 | ((u >> 6) & 63);
            heap[outIdx++] = 0x80 | (u & 63);
          } else {
            if (outIdx + 3 >= endIdx) break;
            if (u > 0x10FFFF) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
            heap[outIdx++] = 0xF0 | (u >> 18);
            heap[outIdx++] = 0x80 | ((u >> 12) & 63);
            heap[outIdx++] = 0x80 | ((u >> 6) & 63);
            heap[outIdx++] = 0x80 | (u & 63);
          }
        }
        // Null-terminate the pointer to the buffer.
        heap[outIdx] = 0;
        return outIdx - startIdx;
      }

      // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
      // null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
      // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
      // Returns the number of bytes written, EXCLUDING the null terminator.

      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }

      // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          var u = str.charCodeAt(i); // possibly a lead surrogate
          if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
          if (u <= 0x7F) ++len;
          else if (u <= 0x7FF) len += 2;
          else if (u <= 0xFFFF) len += 3;
          else len += 4;
        }
        return len;
      }

      // end include: runtime_strings.js
      // include: runtime_strings_extra.js


      // runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

      // Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
      // a copy of that string as a Javascript String object.

      function AsciiToString(ptr) {
        var str = '';
        while (1) {
          var ch = HEAPU8[((ptr++) >> 0)];
          if (!ch) return str;
          str += String.fromCharCode(ch);
        }
      }

      // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
      // null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

      function stringToAscii(str, outPtr) {
        return writeAsciiToMemory(str, outPtr, false);
      }

      // Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
      // a copy of that string as a Javascript String object.

      var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;

      function UTF16ToString(ptr, maxBytesToRead) {
        assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
        var endPtr = ptr;
        // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
        // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;
        // If maxBytesToRead is not passed explicitly, it will be undefined, and this
        // will always evaluate to true. This saves on code size.
        while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
        endPtr = idx << 1;

        if (endPtr - ptr > 32 && UTF16Decoder) {
          return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
        } else {
          var str = '';

          // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
          // will always evaluate to true. The loop is then terminated on the first null char.
          for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
            var codeUnit = HEAP16[(((ptr) + (i * 2)) >> 1)];
            if (codeUnit == 0) break;
            // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
            str += String.fromCharCode(codeUnit);
          }

          return str;
        }
      }

      // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
      // null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
      // Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
      // Parameters:
      //   str: the Javascript string to copy.
      //   outPtr: Byte address in Emscripten HEAP where to write the string to.
      //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
      //                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
      //                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
      // Returns the number of bytes written, EXCLUDING the null terminator.

      function stringToUTF16(str, outPtr, maxBytesToWrite) {
        assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
        assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
        if (maxBytesToWrite === undefined) {
          maxBytesToWrite = 0x7FFFFFFF;
        }
        if (maxBytesToWrite < 2) return 0;
        maxBytesToWrite -= 2; // Null terminator.
        var startPtr = outPtr;
        var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
        for (var i = 0; i < numCharsToWrite; ++i) {
          // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
          var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
          HEAP16[((outPtr) >> 1)] = codeUnit;
          outPtr += 2;
        }
        // Null-terminate the pointer to the HEAP.
        HEAP16[((outPtr) >> 1)] = 0;
        return outPtr - startPtr;
      }

      // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

      function lengthBytesUTF16(str) {
        return str.length * 2;
      }

      function UTF32ToString(ptr, maxBytesToRead) {
        assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
        var i = 0;

        var str = '';
        // If maxBytesToRead is not passed explicitly, it will be undefined, and this
        // will always evaluate to true. This saves on code size.
        while (!(i >= maxBytesToRead / 4)) {
          var utf32 = HEAP32[(((ptr) + (i * 4)) >> 2)];
          if (utf32 == 0) break;
          ++i;
          // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          if (utf32 >= 0x10000) {
            var ch = utf32 - 0x10000;
            str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
          } else {
            str += String.fromCharCode(utf32);
          }
        }
        return str;
      }

      // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
      // null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
      // Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
      // Parameters:
      //   str: the Javascript string to copy.
      //   outPtr: Byte address in Emscripten HEAP where to write the string to.
      //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
      //                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
      //                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
      // Returns the number of bytes written, EXCLUDING the null terminator.

      function stringToUTF32(str, outPtr, maxBytesToWrite) {
        assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
        assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
        if (maxBytesToWrite === undefined) {
          maxBytesToWrite = 0x7FFFFFFF;
        }
        if (maxBytesToWrite < 4) return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;
        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
          if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
          }
          HEAP32[((outPtr) >> 2)] = codeUnit;
          outPtr += 4;
          if (outPtr + 4 > endPtr) break;
        }
        // Null-terminate the pointer to the HEAP.
        HEAP32[((outPtr) >> 2)] = 0;
        return outPtr - startPtr;
      }

      // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

      function lengthBytesUTF32(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
          len += 4;
        }

        return len;
      }

      // Allocate heap space for a JS string, and write it there.
      // It is the responsibility of the caller to free() that memory.
      function allocateUTF8(str) {
        var size = lengthBytesUTF8(str) + 1;
        var ret = _malloc(size);
        if (ret) stringToUTF8Array(str, HEAP8, ret, size);
        return ret;
      }

      // Allocate stack space for a JS string, and write it there.
      function allocateUTF8OnStack(str) {
        var size = lengthBytesUTF8(str) + 1;
        var ret = stackAlloc(size);
        stringToUTF8Array(str, HEAP8, ret, size);
        return ret;
      }

      // Deprecated: This function should not be called because it is unsafe and does not provide
      // a maximum length limit of how many bytes it is allowed to write. Prefer calling the
      // function stringToUTF8Array() instead, which takes in a maximum length that can be used
      // to be secure from out of bounds writes.
      /** @deprecated
          @param {boolean=} dontAddNull */
      function writeStringToMemory(string, buffer, dontAddNull) {
        warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

        var /** @type {number} */ lastChar, /** @type {number} */ end;
        if (dontAddNull) {
          // stringToUTF8Array always appends null. If we don't want to do that, remember the
          // character that existed at the location where the null will be placed, and restore
          // that after the write (below).
          end = buffer + lengthBytesUTF8(string);
          lastChar = HEAP8[end];
        }
        stringToUTF8(string, buffer, Infinity);
        if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
      }

      function writeArrayToMemory(array, buffer) {
        assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
        HEAP8.set(array, buffer);
      }

      /** @param {boolean=} dontAddNull */
      function writeAsciiToMemory(str, buffer, dontAddNull) {
        for (var i = 0; i < str.length; ++i) {
          assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
          HEAP8[((buffer++) >> 0)] = str.charCodeAt(i);
        }
        // Null-terminate the pointer to the HEAP.
        if (!dontAddNull) HEAP8[((buffer) >> 0)] = 0;
      }

      // end include: runtime_strings_extra.js
      // Memory management

      var HEAP,
        /** @type {!ArrayBuffer} */
        buffer,
        /** @type {!Int8Array} */
        HEAP8,
        /** @type {!Uint8Array} */
        HEAPU8,
        /** @type {!Int16Array} */
        HEAP16,
        /** @type {!Uint16Array} */
        HEAPU16,
        /** @type {!Int32Array} */
        HEAP32,
        /** @type {!Uint32Array} */
        HEAPU32,
        /** @type {!Float32Array} */
        HEAPF32,
        /** @type {!Float64Array} */
        HEAPF64;

      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module['HEAP8'] = HEAP8 = new Int8Array(buf);
        Module['HEAP16'] = HEAP16 = new Int16Array(buf);
        Module['HEAP32'] = HEAP32 = new Int32Array(buf);
        Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
        Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
        Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
        Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
        Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
      }

      var TOTAL_STACK = 5242880;
      if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

      var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 134217728; legacyModuleProp('INITIAL_MEMORY', 'INITIAL_MEMORY');

      assert(INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

      // check for full engine support (use string 'subarray' to avoid closure compiler confusion)
      assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
        'JS engine does not provide full typed array support');

      // In non-standalone/normal mode, we create the memory here.
      // include: runtime_init_memory.js


      // Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)

      if (Module['wasmMemory']) {
        wasmMemory = Module['wasmMemory'];
      } else {
        wasmMemory = new WebAssembly.Memory({
          'initial': INITIAL_MEMORY / 65536,
          'maximum': INITIAL_MEMORY / 65536
        });
      }

      if (wasmMemory) {
        buffer = wasmMemory.buffer;
      }

      // If the user provides an incorrect length, just use that length instead rather than providing the user to
      // specifically provide the memory length with Module['INITIAL_MEMORY'].
      INITIAL_MEMORY = buffer.byteLength;
      assert(INITIAL_MEMORY % 65536 === 0);
      updateGlobalBufferAndViews(buffer);

      // end include: runtime_init_memory.js

      // include: runtime_init_table.js
      // In RELOCATABLE mode we create the table in JS.
      var wasmTable = new WebAssembly.Table({
        'initial': 4374,
        'element': 'anyfunc'
      });

      // end include: runtime_init_table.js
      // include: runtime_stack_check.js


      // Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
      function writeStackCookie() {
        var max = _emscripten_stack_get_end();
        assert((max & 3) == 0);
        // The stack grow downwards towards _emscripten_stack_get_end.
        // We write cookies to the final two words in the stack and detect if they are
        // ever overwritten.
        HEAP32[((max) >> 2)] = 0x2135467;
        HEAP32[(((max) + (4)) >> 2)] = 0x89BACDFE;
        // Also test the global address 0 for integrity.
        HEAP32[0] = 0x63736d65; /* 'emsc' */
      }

      function checkStackCookie() {
        if (ABORT) return;
        var max = _emscripten_stack_get_end();
        var cookie1 = HEAPU32[((max) >> 2)];
        var cookie2 = HEAPU32[(((max) + (4)) >> 2)];
        /*if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
          abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' 0x' + cookie1.toString(16));
        }*/
        // Also test the global address 0 for integrity.
        if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
      }

      // end include: runtime_stack_check.js
      // include: runtime_assertions.js


      // Endianness check
      (function () {
        var h16 = new Int16Array(1);
        var h8 = new Int8Array(h16.buffer);
        h16[0] = 0x6373;
        if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -s SUPPORT_BIG_ENDIAN=1 to bypass)';
      })();

      // end include: runtime_assertions.js
      var __ATPRERUN__ = []; // functions called before the runtime is initialized
      var __ATINIT__ = []; // functions called during startup
      var __ATMAIN__ = []; // functions called when main() is to be run
      var __ATEXIT__ = []; // functions called during shutdown
      var __ATPOSTRUN__ = []; // functions called after the main() is called

      var runtimeInitialized = false;

      function keepRuntimeAlive() {
        return noExitRuntime;
      }

      function preRun() {

        if (Module['preRun']) {
          if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
          while (Module['preRun'].length) {
            addOnPreRun(Module['preRun'].shift());
          }
        }

        callRuntimeCallbacks(__ATPRERUN__);
      }

      function initRuntime() {
        checkStackCookie();
        assert(!runtimeInitialized);
        runtimeInitialized = true;


        if (!Module["noFSInit"] && !FS.init.initialized)
          FS.init();
        FS.ignorePermissions = false;

        TTY.init();
        SOCKFS.root = FS.mount(SOCKFS, {}, null);
        PIPEFS.root = FS.mount(PIPEFS, {}, null);
        callRuntimeCallbacks(__ATINIT__);
      }

      function preMain() {
        checkStackCookie();

        callRuntimeCallbacks(__ATMAIN__);
      }

      function postRun() {
        checkStackCookie();

        if (Module['postRun']) {
          if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
          while (Module['postRun'].length) {
            addOnPostRun(Module['postRun'].shift());
          }
        }

        callRuntimeCallbacks(__ATPOSTRUN__);
      }

      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }

      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }

      function addOnPreMain(cb) {
        __ATMAIN__.unshift(cb);
      }

      function addOnExit(cb) {
      }

      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }

      // include: runtime_math.js


      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

      assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
      assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
      assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
      assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

      // end include: runtime_math.js
      // A counter of dependencies for calling run(). If we need to
      // do asynchronous work before running, increment this and
      // decrement it. Incrementing must happen in a place like
      // Module.preRun (used by emcc to add file preloading).
      // Note that you can add dependencies in preRun, even though
      // it happens right before run - run will be postponed until
      // the dependencies are met.
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
      var runDependencyTracking = {};

      function getUniqueRunDependency(id) {
        var orig = id;
        while (1) {
          if (!runDependencyTracking[id]) return id;
          id = orig + Math.random();
        }
      }

      function addRunDependency(id) {
        runDependencies++;

        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }

        if (id) {
          assert(!runDependencyTracking[id]);
          runDependencyTracking[id] = 1;
          if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
            // Check for missing dependencies every few seconds
            runDependencyWatcher = setInterval(function () {
              if (ABORT) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null;
                return;
              }
              var shown = false;
              for (var dep in runDependencyTracking) {
                if (!shown) {
                  shown = true;
                  err('still waiting on run dependencies:');
                }
                err('dependency: ' + dep);
              }
              if (shown) {
                err('(end of list)');
              }
            }, 10000);
          }
        } else {
          err('warning: run dependency added without ID');
        }
      }

      function removeRunDependency(id) {
        runDependencies--;

        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }

        if (id) {
          assert(runDependencyTracking[id]);
          delete runDependencyTracking[id];
        } else {
          err('warning: run dependency removed without ID');
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback(); // can add another dependenciesFulfilled
          }
        }
      }

      Module["preloadedImages"] = {}; // maps url to image data
      Module["preloadedAudios"] = {}; // maps url to audio data
      Module["preloadedWasm"] = {}; // maps url to wasm instance exports

      /** @param {string|number=} what */
      function abort(what) {
        {
          if (Module['onAbort']) {
            Module['onAbort'](what);
          }
        }

        what = 'Aborted(' + what + ')';
        // TODO(sbc): Should we remove printing and leave it up to whoever
        // catches the exception?
        err(what);

        ABORT = true;
        EXITSTATUS = 1;

        // Use a wasm runtime error, because a JS error might be seen as a foreign
        // exception, which means we'd run destructors on it. We need the error to
        // simply make the program stop.

        // Suppress closure compiler warning here. Closure compiler's builtin extern
        // defintion for WebAssembly.RuntimeError claims it takes no arguments even
        // though it can.
        // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.

        /** @suppress {checkTypes} */
        var e = new WebAssembly.RuntimeError(what);

        readyPromiseReject(e);
        // Throw the error whether or not MODULARIZE is set because abort is used
        // in code paths apart from instantiation where an exception is expected
        // to be thrown when abort is called.
        throw e;
      }

      // {{MEM_INITIALIZER}}

      // include: memoryprofiler.js


      // end include: memoryprofiler.js
      // include: URIUtils.js


      // Prefix of data URIs emitted by SINGLE_FILE and related options.
      var dataURIPrefix = 'data:application/octet-stream;base64,';

      // Indicates whether filename is a base64 data URI.
      function isDataURI(filename) {
        // Prefix of data URIs emitted by SINGLE_FILE and related options.
        return filename.startsWith(dataURIPrefix);
      }

      // Indicates whether filename is delivered via file protocol (as opposed to http/https)
      function isFileURI(filename) {
        return filename.startsWith('file://');
      }

      // end include: URIUtils.js
      /** @param {boolean=} fixedasm */
      function createExportWrapper(name, fixedasm) {
        return function () {
          var displayName = name;
          var asm = fixedasm;
          if (!fixedasm) {
            asm = Module['asm'];
          }
          assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
          if (!asm[name]) {
            assert(asm[name], 'exported native function `' + displayName + '` not found');
          }
          return asm[name].apply(null, arguments);
        };
      }

      var wasmBinaryFile;
      wasmBinaryFile = location.using;
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }

      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          } else {
            throw "both async and sync fetching of the wasm failed";
          }
        }
        catch (err) {
          abort(err);
        }
      }

      function getBinaryPromise() {
        // If we don't have the binary yet, try to to load it asynchronously.
        // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
        // See https://github.com/github/fetch/pull/92#issuecomment-140665932
        // Cordova or Electron apps are typically loaded from a file:// url.
        // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch == 'function'
            && !isFileURI(wasmBinaryFile)
          ) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
              if (!response['ok']) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              }
              return response['arrayBuffer']();
            }).catch(function () {
              return getBinary(wasmBinaryFile);
            });
          }
          else {
            if (readAsync) {
              // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
              return new Promise(function (resolve, reject) {
                readAsync(wasmBinaryFile, function (response) { resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))) }, reject)
              });
            }
          }
        }

        // Otherwise, getBinary should be able to get it synchronously
        return Promise.resolve().then(function () { return getBinary(wasmBinaryFile); });
      }

      // Create the wasm instance.
      // Receives the wasm imports, returns the exports.
      function createWasm() {
        // prepare imports
        var info = {
          'env': asmLibraryArg,
          'wasi_snapshot_preview1': asmLibraryArg,
          'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
          'GOT.func': new Proxy(asmLibraryArg, GOTHandler),
        };
        // Load the wasm module and create an instance of using native support in the JS engine.
        // handle a generated wasm instance, receiving its exports and
        // performing other necessary setup
        /** @param {WebAssembly.Module=} module*/
        function receiveInstance(instance, module) {
          var exports = instance.exports;

          exports = relocateExports(exports, 1024);

          Module['asm'] = exports;

          var metadata = getDylinkMetadata(module);
          if (metadata.neededDynlibs) {
            dynamicLibraries = metadata.neededDynlibs.concat(dynamicLibraries);
          }
          mergeLibSymbols(exports, 'main')

          addOnInit(Module['asm']['__wasm_call_ctors']);

          removeRunDependency('wasm-instantiate');

        }
        // we can't run yet (except in a pthread, where we have a custom sync instantiator)
        addRunDependency('wasm-instantiate');

        // Prefer streaming instantiation if available.
        // Async compilation can be confusing when an error on the page overwrites Module
        // (for example, if the order of elements is wrong, and the one defining Module is
        // later), so we save Module and check it later.
        var trueModule = Module;
        function receiveInstantiationResult(result) {
          // 'result' is a ResultObject object which has both the module and instance.
          // receiveInstance() will swap in the exports (to Module.asm) so they can be called
          assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
          trueModule = null;
          receiveInstance(result['instance'], result['module']);
        }

        function instantiateArrayBuffer(receiver) {
          return getBinaryPromise().then(function (binary) {
            return WebAssembly.instantiate(binary, info);
          }).then(function (instance) {
            return instance;
          }).then(receiver, function (reason) {
            err('failed to asynchronously prepare wasm: ' + reason);

            // Warn on some common problems.
            if (isFileURI(wasmBinaryFile)) {
              err('warning: Loading from a file URI (' + wasmBinaryFile + ') is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing');
            }
            abort(reason);
          });
        }

        function instantiateAsync() {
          if (!wasmBinary &&
            typeof WebAssembly.instantiateStreaming == 'function' &&
            !isDataURI(wasmBinaryFile) &&
            // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
            !isFileURI(wasmBinaryFile) &&
            typeof fetch == 'function') {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
              // Suppress closure warning here since the upstream definition for
              // instantiateStreaming only allows Promise<Repsponse> rather than
              // an actual Response.
              // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
              /** @suppress {checkTypes} */
              var result = WebAssembly.instantiateStreaming(response, info);

              return result.then(
                receiveInstantiationResult,
                function (reason) {
                  // We expect the most common failure cause to be a bad MIME type for the binary,
                  // in which case falling back to ArrayBuffer instantiation should work.
                  err('wasm streaming compile failed: ' + reason);
                  err('falling back to ArrayBuffer instantiation');
                  return instantiateArrayBuffer(receiveInstantiationResult);
                });
            });
          } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
          }
        }

        // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
        // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
        // to any other async startup actions they are performing.
        // Also pthreads and wasm workers initialize the wasm instance through this path.
        if (Module['instantiateWasm']) {
          try {
            var exports = Module['instantiateWasm'](info, receiveInstance);
            return exports;
          } catch (e) {
            err('Module.instantiateWasm callback failed with error: ' + e);
            return false;
          }
        }

        // If instantiation fails, reject the module ready promise.
        instantiateAsync().catch(readyPromiseReject);
        return {}; // no exports yet; we'll fill them in later
      }

      // Globals used by JS i64 conversions (see makeSetValue)
      var tempDouble;
      var tempI64;

      // === Body ===

      var ASM_CONSTS = {

      };






      var GOT = {};
      var GOTHandler = {
        get: function (obj, symName) {
          if (!GOT[symName]) {
            GOT[symName] = new WebAssembly.Global({ 'value': 'i32', 'mutable': true });
          }
          return GOT[symName]
        }
      };

      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == 'function') {
            callback(Module); // Pass the module as the first argument.
            continue;
          }
          var func = callback.func;
          if (typeof func == 'number') {
            if (callback.arg === undefined) {
              // Run the wasm function ptr with signature 'v'. If no function
              // with such signature was exported, this call does not need
              // to be emitted (and would confuse Closure)
              getWasmTableEntry(func)();
            } else {
              // If any function with signature 'vi' was exported, run
              // the callback with that signature.
              getWasmTableEntry(func)(callback.arg);
            }
          } else {
            func(callback.arg === undefined ? null : callback.arg);
          }
        }
      }

      function withStackSave(f) {
        var stack = stackSave();
        var ret = f();
        stackRestore(stack);
        return ret;
      }
      function demangle(func) {
        warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
        return func;
      }

      function demangleAll(text) {
        var regex =
          /\b_Z[\w\d_]+/g;
        return text.replace(regex,
          function (x) {
            var y = demangle(x);
            return x === y ? x : (y + ' [' + x + ']');
          });
      }

      function getDylinkMetadata(binary) {
        var offset = 0;
        var end = 0;

        function getU8() {
          return binary[offset++];
        }

        function getLEB() {
          var ret = 0;
          var mul = 1;
          while (1) {
            var byte = binary[offset++];
            ret += ((byte & 0x7f) * mul);
            mul *= 0x80;
            if (!(byte & 0x80)) break;
          }
          return ret;
        }

        function getString() {
          var len = getLEB();
          offset += len;
          return UTF8ArrayToString(binary, offset - len, len);
        }

        /** @param {string=} message */
        function failIf(condition, message) {
          if (condition) throw new Error(message);
        }

        var name = 'dylink.0';
        if (binary instanceof WebAssembly.Module) {
          var dylinkSection = WebAssembly.Module.customSections(binary, name);
          if (dylinkSection.length === 0) {
            name = 'dylink'
            dylinkSection = WebAssembly.Module.customSections(binary, name);
          }
          failIf(dylinkSection.length === 0, 'need dylink section');
          binary = new Uint8Array(dylinkSection[0]);
          end = binary.length
        } else {
          var int32View = new Uint32Array(new Uint8Array(binary.subarray(0, 24)).buffer);
          var magicNumberFound = int32View[0] == 0x6d736100;
          failIf(!magicNumberFound, 'need to see wasm magic number'); // \0asm
          // we should see the dylink custom section right after the magic number and wasm version
          failIf(binary[8] !== 0, 'need the dylink section to be first')
          offset = 9;
          var section_size = getLEB(); //section size
          end = offset + section_size;
          name = getString();
        }

        var customSection = { neededDynlibs: [], tlsExports: {} };
        if (name == 'dylink') {
          customSection.memorySize = getLEB();
          customSection.memoryAlign = getLEB();
          customSection.tableSize = getLEB();
          customSection.tableAlign = getLEB();
          // shared libraries this module needs. We need to load them first, so that
          // current module could resolve its imports. (see tools/shared.py
          // WebAssembly.make_shared_library() for "dylink" section extension format)
          var neededDynlibsCount = getLEB();
          for (var i = 0; i < neededDynlibsCount; ++i) {
            var libname = getString();
            customSection.neededDynlibs.push(libname);
          }
        } else {
          failIf(name !== 'dylink.0');
          var WASM_DYLINK_MEM_INFO = 0x1;
          var WASM_DYLINK_NEEDED = 0x2;
          var WASM_DYLINK_EXPORT_INFO = 0x3;
          var WASM_SYMBOL_TLS = 0x100;
          while (offset < end) {
            var subsectionType = getU8();
            var subsectionSize = getLEB();
            if (subsectionType === WASM_DYLINK_MEM_INFO) {
              customSection.memorySize = getLEB();
              customSection.memoryAlign = getLEB();
              customSection.tableSize = getLEB();
              customSection.tableAlign = getLEB();
            } else if (subsectionType === WASM_DYLINK_NEEDED) {
              var neededDynlibsCount = getLEB();
              for (var i = 0; i < neededDynlibsCount; ++i) {
                libname = getString();
                customSection.neededDynlibs.push(libname);
              }
            } else if (subsectionType === WASM_DYLINK_EXPORT_INFO) {
              var count = getLEB();
              while (count--) {
                var symname = getString();
                var flags = getLEB();
                if (flags & WASM_SYMBOL_TLS) {
                  customSection.tlsExports[symname] = 1;
                }
              }
            } else {
              err('unknown dylink.0 subsection: ' + subsectionType)
              // unknown subsection
              offset += subsectionSize;
            }
          }
        }

        var tableAlign = Math.pow(2, customSection.tableAlign);
        assert(tableAlign === 1, 'invalid tableAlign ' + tableAlign);
        assert(offset == end);

        return customSection;
      }

      var wasmTableMirror = [];
      function getWasmTableEntry(funcPtr) {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        }
        assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
        return func;
      }

      function handleException(e) {
        // Certain exception types we do not treat as errors since they are used for
        // internal control flow.
        // 1. ExitStatus, which is thrown by exit()
        // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
        //    that wish to return to JS event loop.
        if (e instanceof ExitStatus || e == 'unwind') {
          return EXITSTATUS;
        }
        quit_(1, e);
      }

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

      function asmjsMangle(x) {
        var unmangledSymbols = ['stackAlloc', 'stackSave', 'stackRestore'];
        return x.indexOf('dynCall_') == 0 || unmangledSymbols.includes(x) ? x : '_' + x;
      }
      function mergeLibSymbols(exports, libName) {
        // add symbols into global namespace TODO: weak linking etc.
        for (var sym in exports) {
          if (!exports.hasOwnProperty(sym)) {
            continue;
          }

          // When RTLD_GLOBAL is enable, the symbols defined by this shared object will be made
          // available for symbol resolution of subsequently loaded shared objects.
          //
          // We should copy the symbols (which include methods and variables) from SIDE_MODULE to MAIN_MODULE.

          if (!asmLibraryArg.hasOwnProperty(sym)) {
            asmLibraryArg[sym] = exports[sym];
          }

          // Export native export on the Module object.
          // TODO(sbc): Do all users want this?  Should we skip this by default?
          var module_sym = asmjsMangle(sym);
          if (!Module.hasOwnProperty(module_sym)) {
            Module[module_sym] = exports[sym];
          }
        }
      }

      var LDSO = { loadedLibsByName: {}, loadedLibsByHandle: {} };

      function dynCallLegacy(sig, ptr, args) {
        assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
        if (args && args.length) {
          // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
          assert(args.length === sig.substring(1).replace(/j/g, '--').length);
        } else {
          assert(sig.length == 1);
        }
        var f = Module["dynCall_" + sig];
        return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
      }
      /** @param {Object=} args */
      function dynCall(sig, ptr, args) {
        // Without WASM_BIGINT support we cannot directly call function with i64 as
        // part of thier signature, so we rely the dynCall functions generated by
        // wasm-emscripten-finalize
        if (sig.includes('j')) {
          return dynCallLegacy(sig, ptr, args);
        }
        assert(getWasmTableEntry(ptr), 'missing table entry in dynCall: ' + ptr);
        return getWasmTableEntry(ptr).apply(null, args)
      }
      function createInvokeFunction(sig) {
        return function () {
          var sp = stackSave();
          try {
            return dynCall(sig, arguments[0], Array.prototype.slice.call(arguments, 1));
          } catch (e) {
            stackRestore(sp);
            // Exceptions thrown from C++ exception will be integer numbers.
            // longjmp will throw the number Infinity. Re-throw other types of
            // exceptions using a compact and fast check.
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
      }

      var ___heap_base = 6284784;
      function getMemory(size) {
        // After the runtime is initialized, we must only use sbrk() normally.
        if (runtimeInitialized)
          return _malloc(size);
        var ret = ___heap_base;
        var end = (ret + size + 15) & -16;
        assert(end <= HEAP8.length, 'failure to getMemory - memory growth etc. is not supported there, call malloc/sbrk directly or increase INITIAL_MEMORY');
        ___heap_base = end;
        GOT['__heap_base'].value = end;
        return ret;
      }

      function isInternalSym(symName) {
        // TODO: find a way to mark these in the binary or avoid exporting them.
        return [
          '__cpp_exception',
          '__c_longjmp',
          '__wasm_apply_data_relocs',
          '__dso_handle',
          '__tls_size',
          '__tls_align',
          '__set_stack_limits',
          'emscripten_tls_init',
          '__wasm_init_tls',
          '__wasm_call_ctors',
        ].includes(symName)
          ;
      }
      function updateGOT(exports, replace) {
        for (var symName in exports) {
          if (isInternalSym(symName)) {
            continue;
          }

          var value = exports[symName];
          if (symName.startsWith('orig$')) {
            symName = symName.split('$')[1];
            replace = true;
          }

          if (!GOT[symName]) {
            GOT[symName] = new WebAssembly.Global({ 'value': 'i32', 'mutable': true });
          }
          if (replace || GOT[symName].value == 0) {
            if (typeof value == 'function') {
              GOT[symName].value = addFunction(value);
            } else if (typeof value == 'number') {
              GOT[symName].value = value;
            } else if (typeof value == 'bigint') {
              GOT[symName].value = Number(value);
            } else {
              err("unhandled export type for `" + symName + "`: " + (typeof value));
            }
          }
        }
      }
      /** @param {boolean=} replace */
      function relocateExports(exports, memoryBase, replace) {
        var relocated = {};

        for (var e in exports) {
          var value = exports[e];
          if (typeof value == 'object') {
            // a breaking change in the wasm spec, globals are now objects
            // https://github.com/WebAssembly/mutable-global/issues/1
            value = value.value;
          }
          if (typeof value == 'number') {
            value += memoryBase;
          }
          relocated[e] = value;
        }
        updateGOT(relocated, replace);
        return relocated;
      }

      function resolveGlobalSymbol(symName, direct) {
        var sym;
        if (direct) {
          // First look for the orig$ symbol which is the symbols without
          // any legalization performed.
          sym = asmLibraryArg['orig$' + symName];
        }
        if (!sym) {
          sym = asmLibraryArg[symName];
        }

        // Check for the symbol on the Module object.  This is the only
        // way to dynamically access JS library symbols that were not
        // referenced by the main module (and therefore not part of the
        // initial set of symbols included in asmLibraryArg when it
        // was declared.
        if (!sym) {
          sym = Module[asmjsMangle(symName)];
        }

        if (!sym && symName.startsWith('invoke_')) {
          sym = createInvokeFunction(symName.split('_')[1]);
        }

        return sym;
      }

      function alignMemory(size, alignment) {
        assert(alignment, "alignment argument is required");
        return Math.ceil(size / alignment) * alignment;
      }

      function zeroMemory(address, size) {
        HEAPU8.fill(0, address, address + size);
      }
      /** @param {number=} handle */
      function loadWebAssemblyModule(binary, flags, handle) {
        var metadata = getDylinkMetadata(binary);
        var originalTable = wasmTable;

        // loadModule loads the wasm module after all its dependencies have been loaded.
        // can be called both sync/async.
        function loadModule() {
          // The first thread to load a given module needs to allocate the static
          // table and memory regions.  Later threads re-use the same table region
          // and can ignore the memory region (since memory is shared between
          // threads already).
          var needsAllocation = !handle || !HEAP8[(((handle) + (24)) >> 0)];
          if (needsAllocation) {
            // alignments are powers of 2
            var memAlign = Math.pow(2, metadata.memoryAlign);
            // finalize alignments and verify them
            memAlign = Math.max(memAlign, STACK_ALIGN); // we at least need stack alignment
            // prepare memory
            var memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0; // TODO: add to cleanups
            var tableBase = metadata.tableSize ? wasmTable.length : 0;
            if (handle) {
              HEAP8[(((handle) + (24)) >> 0)] = 1;
              HEAP32[(((handle) + (28)) >> 2)] = memoryBase;
              HEAP32[(((handle) + (32)) >> 2)] = metadata.memorySize;
              HEAP32[(((handle) + (36)) >> 2)] = tableBase;
              HEAP32[(((handle) + (40)) >> 2)] = metadata.tableSize;
            }
          } else {
            memoryBase = HEAP32[(((handle) + (28)) >> 2)];
            tableBase = HEAP32[(((handle) + (36)) >> 2)];
          }

          var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length;
          if (tableGrowthNeeded > 0) {
            wasmTable.grow(tableGrowthNeeded);
          }

          // This is the export map that we ultimately return.  We declare it here
          // so it can be used within resolveSymbol.  We resolve symbols against
          // this local symbol map in the case there they are not present on the
          // global Module object.  We need this fallback because:
          // a) Modules sometime need to import their own symbols
          // b) Symbols from side modules are not always added to the global namespace.
          var moduleExports;

          function resolveSymbol(sym) {
            var resolved = resolveGlobalSymbol(sym, false);
            if (!resolved) {
              resolved = moduleExports[sym];
            }
            assert(resolved, 'undefined symbol `' + sym + '`. perhaps a side module was not linked in? if this global was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=1 in the environment');
            return resolved;
          }

          // TODO kill ↓↓↓ (except "symbols local to this module", it will likely be
          // not needed if we require that if A wants symbols from B it has to link
          // to B explicitly: similarly to -Wl,--no-undefined)
          //
          // wasm dynamic libraries are pure wasm, so they cannot assist in
          // their own loading. When side module A wants to import something
          // provided by a side module B that is loaded later, we need to
          // add a layer of indirection, but worse, we can't even tell what
          // to add the indirection for, without inspecting what A's imports
          // are. To do that here, we use a JS proxy (another option would
          // be to inspect the binary directly).
          var proxyHandler = {
            'get': function (stubs, prop) {
              // symbols that should be local to this module
              switch (prop) {
                case '__memory_base':
                  return memoryBase;
                case '__table_base':
                  return tableBase;
              }
              if (prop in asmLibraryArg) {
                // No stub needed, symbol already exists in symbol table
                return asmLibraryArg[prop];
              }
              // Return a stub function that will resolve the symbol
              // when first called.
              if (!(prop in stubs)) {
                var resolved;
                stubs[prop] = function () {
                  if (!resolved) resolved = resolveSymbol(prop);
                  return resolved.apply(null, arguments);
                };
              }
              return stubs[prop];
            }
          };
          var proxy = new Proxy({}, proxyHandler);
          var info = {
            'GOT.mem': new Proxy({}, GOTHandler),
            'GOT.func': new Proxy({}, GOTHandler),
            'env': proxy,
            wasi_snapshot_preview1: proxy,
          };

          function postInstantiation(instance) {
            //FIXME : Set this information in custom section
            const filter_entry = Object.keys(instance.exports).filter(fn => fn.endsWith("_register"));
            filter_entries = filter_entries.concat(filter_entry);
            const module_entry = Object.keys(instance.exports).filter(fn => fn.startsWith("gf_register_module_"));
            module_entries = module_entries.concat(module_entry);
            // the table should be unchanged
            assert(wasmTable === originalTable);
            // add new entries to functionsInTableMap
            updateTableMap(tableBase, metadata.tableSize);
            moduleExports = relocateExports(instance.exports, memoryBase);
            if (!flags.allowUndefined) {
              reportUndefinedSymbols();
            }

            // initialize the module
            var init = moduleExports['__wasm_call_ctors'];
            if (init) {
              if (runtimeInitialized) {
                init();
              } else {
                // we aren't ready to run compiled code yet
                __ATINIT__.push(init);
              }
            }
            return moduleExports;
          }

          if (flags.loadAsync) {
            if (binary instanceof WebAssembly.Module) {
              var instance = new WebAssembly.Instance(binary, info);
              return Promise.resolve(postInstantiation(instance));
            }
            return WebAssembly.instantiate(binary, info).then(function (result) {
              return postInstantiation(result.instance);
            });
          }

          var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary);
          var instance = new WebAssembly.Instance(module, info);
          return postInstantiation(instance);
        }

        // now load needed libraries and the module itself.
        if (flags.loadAsync) {
          return metadata.neededDynlibs.reduce(function (chain, dynNeeded) {
            return chain.then(function () {
              return loadDynamicLibrary(dynNeeded, flags);
            });
          }, Promise.resolve()).then(function () {
            return loadModule();
          });
        }

        metadata.neededDynlibs.forEach(function (dynNeeded) {
          loadDynamicLibrary(dynNeeded, flags);
        });
        return loadModule();
      }
      /** @param {number=} handle */
      function loadDynamicLibrary(lib, flags, handle) {
        if (lib == '__main__' && !LDSO.loadedLibsByName[lib]) {
          LDSO.loadedLibsByName[lib] = {
            refcount: Infinity,   // = nodelete
            name: '__main__',
            module: Module['asm'],
            global: true
          };
        }

        // when loadDynamicLibrary did not have flags, libraries were loaded
        // globally & permanently
        flags = flags || { global: true, nodelete: true }

        var dso = LDSO.loadedLibsByName[lib];
        if (dso) {
          // the library is being loaded or has been loaded already.
          //
          // however it could be previously loaded only locally and if we get
          // load request with global=true we have to make it globally visible now.
          if (flags.global && !dso.global) {
            dso.global = true;
            if (dso.module !== 'loading') {
              // ^^^ if module is 'loading' - symbols merging will be eventually done by the loader.
              mergeLibSymbols(dso.module, lib)
            }
          }
          // same for "nodelete"
          if (flags.nodelete && dso.refcount !== Infinity) {
            dso.refcount = Infinity;
          }
          dso.refcount++
          if (handle) {
            LDSO.loadedLibsByHandle[handle] = dso;
          }
          return flags.loadAsync ? Promise.resolve(true) : true;
        }

        // allocate new DSO
        dso = {
          refcount: flags.nodelete ? Infinity : 1,
          name: lib,
          module: 'loading',
          global: flags.global,
        };
        LDSO.loadedLibsByName[lib] = dso;
        if (handle) {
          LDSO.loadedLibsByHandle[handle] = dso;
        }

        // libData <- libFile
        function loadLibData(libFile) {
          // for wasm, we can use fetch for async, but for fs mode we can only imitate it
          if (flags.fs && flags.fs.findObject(libFile)) {
            var libData = flags.fs.readFile(libFile, { encoding: 'binary' });
            if (!(libData instanceof Uint8Array)) {
              libData = new Uint8Array(libData);
            }
            return flags.loadAsync ? Promise.resolve(libData) : libData;
          }

          if (flags.loadAsync) {
            return new Promise(function (resolve, reject) {
              readAsync(libFile, function (data) { resolve(new Uint8Array(data)); }, reject);
            });
          }

          // load the binary synchronously
          if (!readBinary) {
            throw new Error(libFile + ': file not found, and synchronous loading of external files is not available');
          }
          return readBinary(libFile);
        }

        // libModule <- lib
        function getLibModule() {
          // lookup preloaded cache first
          if (Module['preloadedWasm'] !== undefined &&
            Module['preloadedWasm'][lib] !== undefined) {
            var libModule = Module['preloadedWasm'][lib];
            return flags.loadAsync ? Promise.resolve(libModule) : libModule;
          }

          // module not preloaded - load lib data and create new module from it
          if (flags.loadAsync) {
            return loadLibData(lib).then(function (libData) {
              return loadWebAssemblyModule(libData, flags, handle);
            });
          }

          return loadWebAssemblyModule(loadLibData(lib), flags, handle);
        }

        // module for lib is loaded - update the dso & global namespace
        function moduleLoaded(libModule) {
          if (dso.global) {
            mergeLibSymbols(libModule, lib);
          }
          dso.module = libModule;
        }

        if (flags.loadAsync) {
          return getLibModule().then(function (libModule) {
            moduleLoaded(libModule);
            return true;
          });
        }

        moduleLoaded(getLibModule());
        return true;
      }

      function reportUndefinedSymbols() {
        for (var symName in GOT) {
          if (GOT[symName].value == 0) {
            var value = resolveGlobalSymbol(symName, true)
            assert(value, 'undefined symbol `' + symName + '`. perhaps a side module was not linked in? if this global was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=1 in the environment');
            if (typeof value == 'function') {
              /** @suppress {checkTypes} */
              GOT[symName].value = addFunction(value, value.sig);
            } else if (typeof value == 'number') {
              GOT[symName].value = value;
            } else {
              throw new Error('bad export type for `' + symName + '`: ' + (typeof value));
            }
          }
        }
      }

      function add_file_io() {
        memio.forEach(x => {
          x.value = addFunction(x, x.sig);
        })
      }

      function preloadDylibs() {
        if (!dynamicLibraries.length) {
          reportUndefinedSymbols();
          return;
        }

        // Load binaries asynchronously
        addRunDependency('preloadDylibs');
        dynamicLibraries.reduce(function (chain, lib) {
          return chain.then(function () {
            return loadDynamicLibrary(scriptDirectory + lib, { loadAsync: true, global: true, nodelete: true, allowUndefined: true });
          });
        }, Promise.resolve()).then(function () {
          // we got them all, wonderful
          reportUndefinedSymbols();
          add_file_io();
          removeRunDependency('preloadDylibs');
        });
      }



      function setWasmTableEntry(idx, func) {
        wasmTable.set(idx, func);
        wasmTableMirror[idx] = func;
      }

      function stackTrace() {
        var js = jsStackTrace();
        if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
        return demangleAll(js);
      }

      function ___assert_fail(condition, filename, line, func) {
        abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
      }
      ___assert_fail.sig = 'viiii';

      function ___call_sighandler(fp, sig) {
        getWasmTableEntry(fp)(sig);
      }


      var ___memory_base = new WebAssembly.Global({ 'value': 'i32', 'mutable': false }, 1024);

      var ___stack_pointer = new WebAssembly.Global({ 'value': 'i32', 'mutable': true }, 6284784);

      var PATH = {
        splitPath: function (filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        }, normalizeArray: function (parts, allowAboveRoot) {
          // if the path tries to go above the root, `up` ends up > 0
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
              parts.splice(i, 1);
            } else if (last === '..') {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          // if the path is allowed to go above the root, restore leading ..s
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift('..');
            }
          }
          return parts;
        }, normalize: function (path) {
          var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
          // Normalize the path
          path = PATH.normalizeArray(path.split('/').filter(function (p) {
            return !!p;
          }), !isAbsolute).join('/');
          if (!path && !isAbsolute) {
            path = '.';
          }
          if (path && trailingSlash) {
            path += '/';
          }
          return (isAbsolute ? '/' : '') + path;
        }, dirname: function (path) {
          var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
          if (!root && !dir) {
            // No dirname whatsoever
            return '.';
          }
          if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        }, basename: function (path) {
          // EMSCRIPTEN return '/'' for '/', not an empty string
          if (path === '/') return '/';
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf('/');
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1);
        }, extname: function (path) {
          return PATH.splitPath(path)[3];
        }, join: function () {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join('/'));
        }, join2: function (l, r) {
          return PATH.normalize(l + '/' + r);
        }
      };

      function getRandomDevice() {
        if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          return function () { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
          // if (ENVIRONMENT_IS_NODE) {
          //   // for nodejs with or without crypto support included
          //   try {
          //     var crypto_module = require('crypto');
          //     // nodejs has crypto support
          //     return function() { return crypto_module['randomBytes'](1)[0]; };
          //   } catch (e) {
          //     // nodejs doesn't have crypto support
          //   }
          // }
          // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
          return function () { abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };"); };
      }

      var PATH_FS = {
        resolve: function () {
          var resolvedPath = '',
            resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = (i >= 0) ? arguments[i] : FS.cwd();
            // Skip empty and invalid entries
            if (typeof path != 'string') {
              throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
              return ''; // an invalid portion invalidates the whole thing
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
          }
          // At this point the path should be resolved to a full absolute path, but
          // handle relative paths to be safe (might happen when process.cwd() fails)
          resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function (p) {
            return !!p;
          }), !resolvedAbsolute).join('/');
          return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
        }, relative: function (from, to) {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== '') break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== '') break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split('/'));
          var toParts = trim(to.split('/'));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join('/');
        }
      };

      var TTY = {
        ttys: [], init: function () {
          // https://github.com/emscripten-core/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
          //   // device, it always assumes it's a TTY device. because of this, we're forcing
          //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
          //   // with text files until FS.init can be refactored.
          //   process['stdin']['setEncoding']('utf8');
          // }
        }, shutdown: function () {
          // https://github.com/emscripten-core/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
          //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
          //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
          //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
          //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
          //   process['stdin']['pause']();
          // }
        }, register: function (dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops: ops };
          FS.registerDevice(dev, TTY.stream_ops);
        }, stream_ops: {
          open: function (stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(43);
            }
            stream.tty = tty;
            stream.seekable = false;
          }, close: function (stream) {
            // flush any pending line data
            stream.tty.ops.flush(stream.tty);
          }, flush: function (stream) {
            stream.tty.ops.flush(stream.tty);
          }, read: function (stream, buffer, offset, length, pos /* ignored */) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(60);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          }, write: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(60);
            }
            try {
              for (var i = 0; i < length; i++) {
                stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
              }
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        }, default_tty_ops: {
          get_char: function (tty) {
            if (!tty.input.length) {
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                // we will read data by chunks of BUFSIZE
                var BUFSIZE = 256;
                var buf = Buffer.alloc(BUFSIZE);
                var bytesRead = 0;

                try {
                  bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
                } catch (e) {
                  // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                  // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                  if (e.toString().includes('EOF')) bytesRead = 0;
                  else throw e;
                }

                if (bytesRead > 0) {
                  result = buf.slice(0, bytesRead).toString('utf-8');
                } else {
                  result = null;
                }
              } else
                if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                  // Browser.
                  result = window.prompt('Input: ');  // returns null on cancel
                  if (result !== null) {
                    result += '\n';
                  }
                } else if (typeof readline == 'function') {
                  // Command line.
                  result = readline();
                  if (result !== null) {
                    result += '\n';
                  }
                }
              if (!result) {
                return null;
              }
              tty.input = intArrayFromString(result, true);
            }
            return tty.input.shift();
          }, put_char: function (tty, val) {
            if (val === null || val === 10) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
            }
          }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            }
          }
        }, default_tty1_ops: {
          put_char: function (tty, val) {
            if (val === null || val === 10) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val);
            }
          }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            }
          }
        }
      };

      function mmapAlloc(size) {
        abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
      }
      var MEMFS = {
        ops_table: null, mount: function (mount) {
          return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
        }, createNode: function (parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            // no supported
            throw new FS.ErrnoError(63);
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
            // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
            // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
            // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
            node.contents = null;
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          // add the new node to the parent
          if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp;
          }
          return node;
        }, getFileDataAsTypedArray: function (node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
          return new Uint8Array(node.contents);
        }, expandFileStorage: function (node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
        }, resizeFileStorage: function (node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null; // Fully decommit when requesting a resize to zero.
            node.usedBytes = 0;
          } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize); // Allocate new storage.
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
            }
            node.usedBytes = newSize;
          }
        }, node_ops: {
          getattr: function (node) {
            var attr = {};
            // device numbers reuse inode numbers.
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
              attr.size = node.usedBytes;
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length;
            } else {
              attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
            //       but this is not required by the standard.
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
          }, setattr: function (node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp;
            }
            if (attr.size !== undefined) {
              MEMFS.resizeFileStorage(node, attr.size);
            }
          }, lookup: function (parent, name) {
            throw FS.genericErrors[44];
          }, mknod: function (parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev);
          }, rename: function (old_node, new_dir, new_name) {
            // if we're overwriting a directory at new_name, make sure it's empty.
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name);
              } catch (e) {
              }
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(55);
                }
              }
            }
            // do the internal rewiring
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now()
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir;
          }, unlink: function (parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now();
          }, rmdir: function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(55);
            }
            delete parent.contents[name];
            parent.timestamp = Date.now();
          }, readdir: function (node) {
            var entries = ['.', '..'];
            for (var key in node.contents) {
              if (!node.contents.hasOwnProperty(key)) {
                continue;
              }
              entries.push(key);
            }
            return entries;
          }, symlink: function (parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
            node.link = oldpath;
            return node;
          }, readlink: function (node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            return node.link;
          }
        }, stream_ops: {
          read: function (stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) { // non-trivial, and typed array
              buffer.set(contents.subarray(position, position + size), offset);
            } else {
              for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
            }
            return size;
          }, write: function (stream, buffer, offset, length, position, canOwn) {
            // The data buffer should be a typed array view
            assert(!(buffer instanceof ArrayBuffer));

            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();

            if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
              if (canOwn) {
                assert(position === 0, 'canOwn must imply no weird position inside the file');
                node.contents = buffer.subarray(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
                node.contents = buffer.slice(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
                node.contents.set(buffer.subarray(offset, offset + length), position);
                return length;
              }
            }

            // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
              // Use typed array write which is available.
              node.contents.set(buffer.subarray(offset, offset + length), position);
            } else {
              for (var i = 0; i < length; i++) {
                node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
              }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length;
          }, llseek: function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position;
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes;
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(28);
            }
            return position;
          }, allocate: function (stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
          }, mmap: function (stream, address, length, position, prot, flags) {
            if (address !== 0) {
              // We don't currently support location hints for the address of the mapping
              throw new FS.ErrnoError(28);
            }
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            // Only make a new copy when MAP_PRIVATE is specified.
            if (!(flags & 2) && contents.buffer === buffer) {
              // We can't emulate MAP_SHARED when the file is not backed by the buffer
              // we're mapping to (e.g. the HEAP buffer).
              allocated = false;
              ptr = contents.byteOffset;
            } else {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              allocated = true;
              ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              HEAP8.set(contents, ptr);
            }
            return { ptr: ptr, allocated: allocated };
          }, msync: function (stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (mmapFlags & 2) {
              // MAP_PRIVATE calls need not to be synced back to underlying fs
              return 0;
            }

            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            // should we check if bytesWritten and length are the same?
            return 0;
          }
        }
      };

      /** @param {boolean=} noRunDep */
      function asyncLoad(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
        readAsync(url, function (arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function (event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      }

      var ERRNO_MESSAGES = { 0: "Success", 1: "Arg list too long", 2: "Permission denied", 3: "Address already in use", 4: "Address not available", 5: "Address family not supported by protocol family", 6: "No more processes", 7: "Socket already connected", 8: "Bad file number", 9: "Trying to read unreadable message", 10: "Mount device busy", 11: "Operation canceled", 12: "No children", 13: "Connection aborted", 14: "Connection refused", 15: "Connection reset by peer", 16: "File locking deadlock error", 17: "Destination address required", 18: "Math arg out of domain of func", 19: "Quota exceeded", 20: "File exists", 21: "Bad address", 22: "File too large", 23: "Host is unreachable", 24: "Identifier removed", 25: "Illegal byte sequence", 26: "Connection already in progress", 27: "Interrupted system call", 28: "Invalid argument", 29: "I/O error", 30: "Socket is already connected", 31: "Is a directory", 32: "Too many symbolic links", 33: "Too many open files", 34: "Too many links", 35: "Message too long", 36: "Multihop attempted", 37: "File or path name too long", 38: "Network interface is not configured", 39: "Connection reset by network", 40: "Network is unreachable", 41: "Too many open files in system", 42: "No buffer space available", 43: "No such device", 44: "No such file or directory", 45: "Exec format error", 46: "No record locks available", 47: "The link has been severed", 48: "Not enough core", 49: "No message of desired type", 50: "Protocol not available", 51: "No space left on device", 52: "Function not implemented", 53: "Socket is not connected", 54: "Not a directory", 55: "Directory not empty", 56: "State not recoverable", 57: "Socket operation on non-socket", 59: "Not a typewriter", 60: "No such device or address", 61: "Value too large for defined data type", 62: "Previous owner died", 63: "Not super-user", 64: "Broken pipe", 65: "Protocol error", 66: "Unknown protocol", 67: "Protocol wrong type for socket", 68: "Math result not representable", 69: "Read only file system", 70: "Illegal seek", 71: "No such process", 72: "Stale file handle", 73: "Connection timed out", 74: "Text file busy", 75: "Cross-device link", 100: "Device not a stream", 101: "Bad font file fmt", 102: "Invalid slot", 103: "Invalid request code", 104: "No anode", 105: "Block device required", 106: "Channel number out of range", 107: "Level 3 halted", 108: "Level 3 reset", 109: "Link number out of range", 110: "Protocol driver not attached", 111: "No CSI structure available", 112: "Level 2 halted", 113: "Invalid exchange", 114: "Invalid request descriptor", 115: "Exchange full", 116: "No data (for no delay io)", 117: "Timer expired", 118: "Out of streams resources", 119: "Machine is not on the network", 120: "Package not installed", 121: "The object is remote", 122: "Advertise error", 123: "Srmount error", 124: "Communication error on send", 125: "Cross mount point (not really error)", 126: "Given log. name not unique", 127: "f.d. invalid for this operation", 128: "Remote address changed", 129: "Can   access a needed shared lib", 130: "Accessing a corrupted shared lib", 131: ".lib section in a.out corrupted", 132: "Attempting to link in too many libs", 133: "Attempting to exec a shared library", 135: "Streams pipe error", 136: "Too many users", 137: "Socket type not supported", 138: "Not supported", 139: "Protocol family not supported", 140: "Can't send after socket shutdown", 141: "Too many references", 142: "Host is down", 148: "No medium (in tape drive)", 156: "Level 2 not synchronized" };

      var ERRNO_CODES = {};
      var FS = {
        root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (path, opts = {}) => {
          path = PATH_FS.resolve(FS.cwd(), path);

          if (!path) return { path: '', node: null };

          var defaults = {
            follow_mount: true,
            recurse_count: 0
          };
          opts = Object.assign(defaults, opts)

          if (opts.recurse_count > 8) {  // max recursive lookup of 8
            throw new FS.ErrnoError(32);
          }

          // split the path
          var parts = PATH.normalizeArray(path.split('/').filter((p) => !!p), false);

          // start at the root
          var current = FS.root;
          var current_path = '/';

          for (var i = 0; i < parts.length; i++) {
            var islast = (i === parts.length - 1);
            if (islast && opts.parent) {
              // stop resolving
              break;
            }

            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);

            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current)) {
              if (!islast || (islast && opts.follow_mount)) {
                current = current.mounted.root;
              }
            }

            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);

                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                current = lookup.node;

                if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                  throw new FS.ErrnoError(32);
                }
              }
            }
          }

          return { path: current_path, node: current };
        }, getPath: (node) => {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== '/' ? mount + '/' + path : mount + path;
            }
            path = path ? node.name + '/' + path : node.name;
            node = node.parent;
          }
        }, hashName: (parentid, name) => {
          var hash = 0;

          for (var i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
          }
          return ((parentid + hash) >>> 0) % FS.nameTable.length;
        }, hashAddNode: (node) => {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        }, hashRemoveNode: (node) => {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        }, lookupNode: (parent, name) => {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode, parent);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          // if we failed to find it in the cache, call into the VFS
          return FS.lookup(parent, name);
        }, createNode: (parent, name, mode, rdev) => {
          assert(typeof parent == 'object')
          var node = new FS.FSNode(parent, name, mode, rdev);

          FS.hashAddNode(node);

          return node;
        }, destroyNode: (node) => {
          FS.hashRemoveNode(node);
        }, isRoot: (node) => {
          return node === node.parent;
        }, isMountpoint: (node) => {
          return !!node.mounted;
        }, isFile: (mode) => {
          return (mode & 61440) === 32768;
        }, isDir: (mode) => {
          return (mode & 61440) === 16384;
        }, isLink: (mode) => {
          return (mode & 61440) === 40960;
        }, isChrdev: (mode) => {
          return (mode & 61440) === 8192;
        }, isBlkdev: (mode) => {
          return (mode & 61440) === 24576;
        }, isFIFO: (mode) => {
          return (mode & 61440) === 4096;
        }, isSocket: (mode) => {
          return (mode & 49152) === 49152;
        }, flagModes: { "r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090 }, modeStringToFlags: (str) => {
          var flags = FS.flagModes[str];
          if (typeof flags == 'undefined') {
            throw new Error('Unknown file open mode: ' + str);
          }
          return flags;
        }, flagsToPermissionString: (flag) => {
          var perms = ['r', 'w', 'rw'][flag & 3];
          if ((flag & 512)) {
            perms += 'w';
          }
          return perms;
        }, nodePermissions: (node, perms) => {
          if (FS.ignorePermissions) {
            return 0;
          }
          // return 0 if any user, group or owner bits are set.
          if (perms.includes('r') && !(node.mode & 292)) {
            return 2;
          } else if (perms.includes('w') && !(node.mode & 146)) {
            return 2;
          } else if (perms.includes('x') && !(node.mode & 73)) {
            return 2;
          }
          return 0;
        }, mayLookup: (dir) => {
          var errCode = FS.nodePermissions(dir, 'x');
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        }, mayCreate: (dir, name) => {
          try {
            var node = FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, 'wx');
        }, mayDelete: (dir, name, isdir) => {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, 'wx');
          if (errCode) {
            return errCode;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31;
            }
          }
          return 0;
        }, mayOpen: (node, flags) => {
          if (!node) {
            return 44;
          }
          if (FS.isLink(node.mode)) {
            return 32;
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
              return 31;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        }, MAX_OPEN_FDS: 4096, nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(33);
        }, getStream: (fd) => FS.streams[fd], createStream: (stream, fd_start, fd_end) => {
          if (!FS.FSStream) {
            FS.FSStream = /** @constructor */ function () { };
            FS.FSStream.prototype = {
              object: {
                get: function () { return this.node; },
                set: function (val) { this.node = val; }
              },
              isRead: {
                get: function () { return (this.flags & 2097155) !== 1; }
              },
              isWrite: {
                get: function () { return (this.flags & 2097155) !== 0; }
              },
              isAppend: {
                get: function () { return (this.flags & 1024); }
              }
            };
          }
          // clone it, so we can return an instance of FSStream
          stream = Object.assign(new FS.FSStream(), stream);
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        }, closeStream: (fd) => {
          FS.streams[fd] = null;
        }, chrdev_stream_ops: {
          open: (stream) => {
            var device = FS.getDevice(stream.node.rdev);
            // override node's stream ops with the device's
            stream.stream_ops = device.stream_ops;
            // forward the open call
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
          }, llseek: () => {
            throw new FS.ErrnoError(70);
          }
        }, major: (dev) => ((dev) >> 8), minor: (dev) => ((dev) & 0xff), makedev: (ma, mi) => ((ma) << 8 | (mi)), registerDevice: (dev, ops) => {
          FS.devices[dev] = { stream_ops: ops };
        }, getDevice: (dev) => FS.devices[dev], getMounts: (mount) => {
          var mounts = [];
          var check = [mount];

          while (check.length) {
            var m = check.pop();

            mounts.push(m);

            check.push.apply(check, m.mounts);
          }

          return mounts;
        }, syncfs: (populate, callback) => {
          if (typeof populate == 'function') {
            callback = populate;
            populate = false;
          }

          FS.syncFSRequests++;

          if (FS.syncFSRequests > 1) {
            err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
          }

          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;

          function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode);
          }

          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          };

          // sync all mounts
          mounts.forEach((mount) => {
            if (!mount.type.syncfs) {
              return done(null);
            }
            mount.type.syncfs(mount, populate, done);
          });
        }, mount: (type, opts, mountpoint) => {
          if (typeof type == 'string') {
            // The filesystem was not included, and instead we have an error
            // message stored in the variable.
            throw type;
          }
          var root = mountpoint === '/';
          var pseudo = !mountpoint;
          var node;

          if (root && FS.root) {
            throw new FS.ErrnoError(10);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

            mountpoint = lookup.path;  // use the absolute path
            node = lookup.node;

            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }

            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
          }

          var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
          };

          // create a root node for the fs
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;

          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            // set as a mountpoint
            node.mounted = mount;

            // add the new mount to the current mount's children
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }

          return mountRoot;
        }, unmount: (mountpoint) => {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
          }

          // destroy the nodes for this mount, and all its child mounts
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);

          Object.keys(FS.nameTable).forEach((hash) => {
            var current = FS.nameTable[hash];

            while (current) {
              var next = current.name_next;

              if (mounts.includes(current.mount)) {
                FS.destroyNode(current);
              }

              current = next;
            }
          });

          // no longer a mountpoint
          node.mounted = null;

          // remove this mount from the child mounts
          var idx = node.mount.mounts.indexOf(mount);
          assert(idx !== -1);
          node.mount.mounts.splice(idx, 1);
        }, lookup: (parent, name) => {
          return parent.node_ops.lookup(parent, name);
        }, mknod: (path, mode, dev) => {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === '.' || name === '..') {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        }, create: (path, mode) => {
          mode = mode !== undefined ? mode : 438 /* 0666 */;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        }, mkdir: (path, mode) => {
          mode = mode !== undefined ? mode : 511 /* 0777 */;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        }, mkdirTree: (path, mode) => {
          var dirs = path.split('/');
          var d = '';
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += '/' + dirs[i];
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        }, mkdev: (path, mode, dev) => {
          if (typeof dev == 'undefined') {
            dev = mode;
            mode = 438 /* 0666 */;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        }, symlink: (oldpath, newpath) => {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        }, rename: (old_path, new_path) => {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          // parents must exist
          var lookup, old_dir, new_dir;

          // let the errors from non existant directories percolate up
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;

          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          // need to be part of the same mount
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
          }
          // source must exist
          var old_node = FS.lookupNode(old_dir, old_name);
          // old path should not be an ancestor of the new path
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(28);
          }
          // new path should not be an ancestor of the old path
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(55);
          }
          // see if the new path already exists
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
            // not fatal
          }
          // early out if nothing needs to change
          if (old_node === new_node) {
            return;
          }
          // we'll need to delete the old entry
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          // need delete permissions if we'll be overwriting.
          // need create permissions if new doesn't already exist.
          errCode = new_node ?
            FS.mayDelete(new_dir, new_name, isdir) :
            FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
            throw new FS.ErrnoError(10);
          }
          // if we are going to change the parent, check write permissions
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, 'w');
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          // remove the node from the lookup hash
          FS.hashRemoveNode(old_node);
          // do the underlying fs rename
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
          } catch (e) {
            throw e;
          } finally {
            // add the node back to the hash (in case node_ops.rename
            // changed its name)
            FS.hashAddNode(old_node);
          }
        }, rmdir: (path) => {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        }, readdir: (path) => {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
          }
          return node.node_ops.readdir(node);
        }, unlink: (path) => {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            // According to POSIX, we should map EISDIR to EPERM, but
            // we instead do what Linux does (and we must, as we use
            // the musl linux libc).
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        }, readlink: (path) => {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
        }, stat: (path, dontFollow) => {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
          }
          return node.node_ops.getattr(node);
        }, lstat: (path) => {
          return FS.stat(path, true);
        }, chmod: (path, mode, dontFollow) => {
          var node;
          if (typeof path == 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            mode: (mode & 4095) | (node.mode & ~4095),
            timestamp: Date.now()
          });
        }, lchmod: (path, mode) => {
          FS.chmod(path, mode, true);
        }, fchmod: (fd, mode) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          FS.chmod(stream.node, mode);
        }, chown: (path, uid, gid, dontFollow) => {
          var node;
          if (typeof path == 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            timestamp: Date.now()
            // we ignore the uid / gid for now
          });
        }, lchown: (path, uid, gid) => {
          FS.chown(path, uid, gid, true);
        }, fchown: (fd, uid, gid) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          FS.chown(stream.node, uid, gid);
        }, truncate: (path, len) => {
          if (len < 0) {
            throw new FS.ErrnoError(28);
          }
          var node;
          if (typeof path == 'string') {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.nodePermissions(node, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
          });
        }, ftruncate: (fd, len) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
          }
          FS.truncate(stream.node, len);
        }, utime: (path, atime, mtime) => {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
          });
        }, open: (path, flags, mode, fd_start, fd_end) => {
          if (path === "") {
            throw new FS.ErrnoError(44);
          }
          flags = typeof flags == 'string' ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode == 'undefined' ? 438 /* 0666 */ : mode;
          if ((flags & 64)) {
            mode = (mode & 4095) | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path == 'object') {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {
                follow: !(flags & 131072)
              });
              node = lookup.node;
            } catch (e) {
              // ignore
            }
          }
          // perhaps we need to create the node
          var created = false;
          if ((flags & 64)) {
            if (node) {
              // if O_CREAT and O_EXCL are set, error out if the node already exists
              if ((flags & 128)) {
                throw new FS.ErrnoError(20);
              }
            } else {
              // node doesn't exist, try to create it
              node = FS.mknod(path, mode, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          // can't truncate a device
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          // if asked only for a directory, then this must be one
          if ((flags & 65536) && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
          // check permissions, if this is not a file we just created now (it is ok to
          // create and write to a file with read-only permissions; it is read-only
          // for later use)
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          // do truncation if necessary
          if ((flags & 512)) {
            FS.truncate(node, 0);
          }
          // we've already handled these, don't pass down to the underlying vfs
          flags &= ~(128 | 512 | 131072);

          // register the stream with the filesystem
          var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),  // we want the absolute path to the node
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            // used by the file family libc calls (fopen, fwrite, ferror, etc.)
            ungotten: [],
            error: false
          }, fd_start, fd_end);
          // call the new stream's open function
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module['logReadFiles'] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
            }
          }
          return stream;
        }, close: (stream) => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (stream.getdents) stream.getdents = null; // free readdir state
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        }, isClosed: (stream) => {
          return stream.fd === null;
        }, llseek: (stream, offset, whence) => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        }, read: (stream, buffer, offset, length, position) => {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
          }
          var seeking = typeof position != 'undefined';
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        }, write: (stream, buffer, offset, length, position, canOwn) => {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
          }
          if (stream.seekable && stream.flags & 1024) {
            // seek to the end before writing in append mode
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position != 'undefined';
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        }, allocate: (stream, offset, length) => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
          }
          stream.stream_ops.allocate(stream, offset, length);
        }, mmap: (stream, address, length, position, prot, flags) => {
          // User requests writing to file (prot & PROT_WRITE != 0).
          // Checking if we have permissions to write to the file unless
          // MAP_PRIVATE flag is set. According to POSIX spec it is possible
          // to write to file opened in read-only mode with MAP_PRIVATE flag,
          // as all modifications will be visible only in the memory of
          // the current process.
          if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
          }
          return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
        }, msync: (stream, buffer, offset, length, mmapFlags) => {
          if (!stream || !stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        }, munmap: (stream) => 0, ioctl: (stream, cmd, arg) => {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        }, readFile: (path, opts = {}) => {
          opts.flags = opts.flags || 0;
          opts.encoding = opts.encoding || 'binary';
          if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === 'utf8') {
            ret = UTF8ArrayToString(buf, 0);
          } else if (opts.encoding === 'binary') {
            ret = buf;
          }
          FS.close(stream);
          return ret;
        }, writeFile: (path, data, opts = {}) => {
          opts.flags = opts.flags || 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data == 'string') {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
          } else {
            throw new Error('Unsupported data type');
          }
          FS.close(stream);
        }, cwd: () => FS.currentPath, chdir: (path) => {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
          }
          var errCode = FS.nodePermissions(lookup.node, 'x');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.currentPath = lookup.path;
        }, createDefaultDirectories: () => {
          FS.mkdir('/tmp');
          FS.mkdir('/home');
          FS.mkdir('/home/web_user');
        }, createDefaultDevices: () => {
          // create /dev
          FS.mkdir('/dev');
          // setup /dev/null
          FS.registerDevice(FS.makedev(1, 3), {
            read: () => 0,
            write: (stream, buffer, offset, length, pos) => length,
          });
          FS.mkdev('/dev/null', FS.makedev(1, 3));
          // setup /dev/tty and /dev/tty1
          // stderr needs to print output using err() rather than out()
          // so we register a second tty just for it.
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev('/dev/tty', FS.makedev(5, 0));
          FS.mkdev('/dev/tty1', FS.makedev(6, 0));
          // setup /dev/[u]random
          var random_device = getRandomDevice();
          FS.createDevice('/dev', 'random', random_device);
          FS.createDevice('/dev', 'urandom', random_device);
          // we're not going to emulate the actual shm device,
          // just create the tmp dirs that reside in it commonly
          FS.mkdir('/dev/shm');
          FS.mkdir('/dev/shm/tmp');
        }, createSpecialDirectories: () => {
          // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
          // name of the stream for fd 6 (see test_unistd_ttyname)
          FS.mkdir('/proc');
          var proc_self = FS.mkdir('/proc/self');
          FS.mkdir('/proc/self/fd');
          FS.mount({
            mount: () => {
              var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
              node.node_ops = {
                lookup: (parent, name) => {
                  var fd = +name;
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: 'fake' },
                    node_ops: { readlink: () => stream.path },
                  };
                  ret.parent = ret; // make it look like a simple root node
                  return ret;
                }
              };
              return node;
            }
          }, {}, '/proc/self/fd');
        }, createStandardStreams: () => {
          // TODO deprecate the old functionality of a single
          // input / output callback and that utilizes FS.createDevice
          // and instead require a unique set of stream ops

          // by default, we symlink the standard streams to the
          // default tty devices. however, if the standard streams
          // have been overwritten we create a unique device for
          // them instead.
          if (Module['stdin']) {
            FS.createDevice('/dev', 'stdin', Module['stdin']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdin');
          }
          if (Module['stdout']) {
            FS.createDevice('/dev', 'stdout', null, Module['stdout']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdout');
          }
          if (Module['stderr']) {
            FS.createDevice('/dev', 'stderr', null, Module['stderr']);
          } else {
            FS.symlink('/dev/tty1', '/dev/stderr');
          }

          // open default streams for the stdin, stdout and stderr devices
          var stdin = FS.open('/dev/stdin', 0);
          var stdout = FS.open('/dev/stdout', 1);
          var stderr = FS.open('/dev/stderr', 1);
          assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
          assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
          assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
        }, ensureErrnoError: () => {
          if (FS.ErrnoError) return;
          FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = /** @this{Object} */ function (errno) {
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            };
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];

            // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
            // now ensures it shows what we want.
            if (this.stack) {
              // Define the stack property for Node.js 4, which otherwise errors on the next line.
              Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
              this.stack = demangleAll(this.stack);
            }
          };
          FS.ErrnoError.prototype = new Error();
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
          [44].forEach((code) => {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = '<generic error, no stack>';
          });
        }, staticInit: () => {
          FS.ensureErrnoError();

          FS.nameTable = new Array(4096);

          FS.mount(MEMFS, {}, '/');

          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();

          FS.filesystems = {
            'MEMFS': MEMFS,
          };
        }, init: (input, output, error) => {
          assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
          FS.init.initialized = true;

          FS.ensureErrnoError();

          // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
          Module['stdin'] = input || Module['stdin'];
          Module['stdout'] = output || Module['stdout'];
          Module['stderr'] = error || Module['stderr'];

          FS.createStandardStreams();
        }, quit: () => {
          FS.init.initialized = false;
          // Call musl-internal function to close all stdio streams, so nothing is
          // left in internal buffers.
          ___stdio_exit();
          // close all of our streams
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        }, getMode: (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        }, findObject: (path, dontResolveLastLink) => {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object;
          } else {
            return null;
          }
        }, analyzePath: (path, dontResolveLastLink) => {
          // operate from within the context of the symlink's target
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = {
            isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
            parentExists: false, parentPath: null, parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === '/';
          } catch (e) {
            ret.error = e.errno;
          };
          return ret;
        }, createPath: (parent, path, canRead, canWrite) => {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          var parts = path.split('/').reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
              // ignore EEXIST
            }
            parent = current;
          }
          return current;
        }, createFile: (parent, name, properties, canRead, canWrite) => {
          var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode);
        }, createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
          var path = name;
          if (parent) {
            parent = typeof parent == 'string' ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent;
          }
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data == 'string') {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr;
            }
            // make sure we can write to the file
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
          return node;
        }, createDevice: (parent, name, input, output) => {
          var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          // Create a fake device that a set of stream ops to emulate
          // the old behavior.
          FS.registerDevice(dev, {
            open: (stream) => {
              stream.seekable = false;
            },
            close: (stream) => {
              // flush any pending line data
              if (output && output.buffer && output.buffer.length) {
                output(10);
              }
            },
            read: (stream, buffer, offset, length, pos /* ignored */) => {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input();
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write: (stream, buffer, offset, length, pos) => {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset + i]);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          });
          return FS.mkdev(path, mode, dev);
        }, forceLoadFile: (obj) => {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (typeof XMLHttpRequest != 'undefined') {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (read_) {
            // Command-line.
            try {
              // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
              //          read() will try to parse UTF8.
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length;
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          } else {
            throw new Error('Cannot load without read() or XMLHttpRequest.');
          }
        }, createLazyFile: (parent, name, url, canRead, canWrite) => {
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          /** @constructor */
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize) | 0;
            return this.getter(chunkNum)[chunkOffset];
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";

            var chunkSize = 1024 * 1024; // Chunk size in bytes

            if (!hasByteServing) chunkSize = datalength;

            // Function to get a range from the remote URL.
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");

              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);

              // Some hints to the browser that we want binary data.
              xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }

              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              } else {
                return intArrayFromString(xhr.responseText || '', true);
              }
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength - 1); // if datalength-1 is selected, this is the last block
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
              return lazyArray.chunks[chunkNum];
            });

            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }

            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          };
          if (typeof XMLHttpRequest != 'undefined') {
            if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
            var lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, {
              length: {
                get: /** @this{Object} */ function () {
                  if (!this.lengthKnown) {
                    this.cacheLength();
                  }
                  return this._length;
                }
              },
              chunkSize: {
                get: /** @this{Object} */ function () {
                  if (!this.lengthKnown) {
                    this.cacheLength();
                  }
                  return this._chunkSize;
                }
              }
            });

            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url: url };
          }

          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          // This is a total hack, but I want to get this lazy file code out of the
          // core of MEMFS. If we want to keep this lazy file concept I feel it should
          // be its own thin LAZYFS proxying calls to MEMFS.
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          // Add a function that defers querying the file size until it is asked the first time.
          Object.defineProperties(node, {
            usedBytes: {
              get: /** @this {FSNode} */ function () { return this.contents.length; }
            }
          });
          // override each stream op with one that tries to force load the lazy file first
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach((key) => {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              FS.forceLoadFile(node);
              return fn.apply(null, arguments);
            };
          });
          // use a custom read function
          stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            var contents = stream.node.contents;
            if (position >= contents.length)
              return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) { // normal array
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          };
          node.stream_ops = stream_ops;
          return node;
        }, createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          // TODO we should allow people to just pass in a complete filename instead
          // of parent and name being that we just join them anyways
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
          function processData(byteArray) {
            function finish(byteArray) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
              }
              if (onload) onload();
              removeRunDependency(dep);
            }
            if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
              if (onerror) onerror();
              removeRunDependency(dep);
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == 'string') {
            asyncLoad(url, (byteArray) => processData(byteArray), onerror);
          } else {
            processData(url);
          }
        }, indexedDB: () => {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        }, DB_NAME: () => {
          return 'EM_FS_' + window.location.pathname;
        }, DB_VERSION: 20, DB_STORE_NAME: "FILE_DATA", saveFilesToDB: (paths, onload, onerror) => {
          onload = onload || (() => { });
          onerror = onerror || (() => { });
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = () => {
            out('creating db');
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
          };
          openRequest.onsuccess = () => {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach((path) => {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = () => { ok++; if (ok + fail == total) finish() };
              putRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        }, loadFilesFromDB: (paths, onload, onerror) => {
          onload = onload || (() => { });
          onerror = onerror || (() => { });
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = onerror; // no database to load from
          openRequest.onsuccess = () => {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
            } catch (e) {
              onerror(e);
              return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach((path) => {
              var getRequest = files.get(path);
              getRequest.onsuccess = () => {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path);
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish();
              };
              getRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        }, absolutePath: () => {
          abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
        }, createFolder: () => {
          abort('FS.createFolder has been removed; use FS.mkdir instead');
        }, createLink: () => {
          abort('FS.createLink has been removed; use FS.symlink instead');
        }, joinPath: () => {
          abort('FS.joinPath has been removed; use PATH.join instead');
        }, mmapAlloc: () => {
          abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
        }, standardizePath: () => {
          abort('FS.standardizePath has been removed; use PATH.normalize instead');
        }
      };
      var SYSCALLS = {
        DEFAULT_POLLMASK: 5, calculateAt: function (dirfd, path, allowEmpty) {
          if (path[0] === '/') {
            return path;
          }
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
          }
          if (path.length == 0) {
            if (!allowEmpty) {
              throw new FS.ErrnoError(44);;
            }
            return dir;
          }
          return PATH.join2(dir, path);
        }, doStat: function (func, path, buf) {
          try {
            var stat = func(path);
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              // an error occurred while trying to look up the path; we should just report ENOTDIR
              return -54;
            }
            throw e;
          }
          HEAP32[((buf) >> 2)] = stat.dev;
          HEAP32[(((buf) + (4)) >> 2)] = 0;
          HEAP32[(((buf) + (8)) >> 2)] = stat.ino;
          HEAP32[(((buf) + (12)) >> 2)] = stat.mode;
          HEAP32[(((buf) + (16)) >> 2)] = stat.nlink;
          HEAP32[(((buf) + (20)) >> 2)] = stat.uid;
          HEAP32[(((buf) + (24)) >> 2)] = stat.gid;
          HEAP32[(((buf) + (28)) >> 2)] = stat.rdev;
          HEAP32[(((buf) + (32)) >> 2)] = 0;
          (tempI64 = [stat.size >>> 0, (tempDouble = stat.size, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[(((buf) + (40)) >> 2)] = tempI64[0], HEAP32[(((buf) + (44)) >> 2)] = tempI64[1]);
          HEAP32[(((buf) + (48)) >> 2)] = 4096;
          HEAP32[(((buf) + (52)) >> 2)] = stat.blocks;
          HEAP32[(((buf) + (56)) >> 2)] = (stat.atime.getTime() / 1000) | 0;
          HEAP32[(((buf) + (60)) >> 2)] = 0;
          HEAP32[(((buf) + (64)) >> 2)] = (stat.mtime.getTime() / 1000) | 0;
          HEAP32[(((buf) + (68)) >> 2)] = 0;
          HEAP32[(((buf) + (72)) >> 2)] = (stat.ctime.getTime() / 1000) | 0;
          HEAP32[(((buf) + (76)) >> 2)] = 0;
          (tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[(((buf) + (80)) >> 2)] = tempI64[0], HEAP32[(((buf) + (84)) >> 2)] = tempI64[1]);
          return 0;
        }, doMsync: function (addr, stream, len, flags, offset) {
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags);
        }, doMkdir: function (path, mode) {
          // remove a trailing slash, if one - /a/b/ has basename of '', but
          // we want to create b in the context of this function
          path = PATH.normalize(path);
          if (path[path.length - 1] === '/') path = path.substr(0, path.length - 1);
          FS.mkdir(path, mode, 0);
          return 0;
        }, doMknod: function (path, mode, dev) {
          // we don't want this in the JS API as it uses mknod to create all nodes.
          switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;
            default: return -28;
          }
          FS.mknod(path, mode, dev);
          return 0;
        }, doReadlink: function (path, buf, bufsize) {
          if (bufsize <= 0) return -28;
          var ret = FS.readlink(path);

          var len = Math.min(bufsize, lengthBytesUTF8(ret));
          var endChar = HEAP8[buf + len];
          stringToUTF8(ret, buf, bufsize + 1);
          // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
          // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
          HEAP8[buf + len] = endChar;

          return len;
        }, doAccess: function (path, amode) {
          if (amode & ~7) {
            // need a valid mode
            return -28;
          }
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node) {
            return -44;
          }
          var perms = '';
          if (amode & 4) perms += 'r';
          if (amode & 2) perms += 'w';
          if (amode & 1) perms += 'x';
          if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
            return -2;
          }
          return 0;
        }, doReadv: function (stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov) + (i * 8)) >> 2)];
            var len = HEAP32[(((iov) + (i * 8 + 4)) >> 2)];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break; // nothing more to read
          }
          return ret;
        }, doWritev: function (stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov) + (i * 8)) >> 2)];
            var len = HEAP32[(((iov) + (i * 8 + 4)) >> 2)];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
          }
          return ret;
        }, varargs: undefined, get: function () {
          assert(SYSCALLS.varargs != undefined);
          SYSCALLS.varargs += 4;
          var ret = HEAP32[(((SYSCALLS.varargs) - (4)) >> 2)];
          return ret;
        }, getStr: function (ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        }, getStreamFromFD: function (fd) {
          var stream = FS.getStream(fd);
          if (!stream) throw new FS.ErrnoError(8);
          return stream;
        }, get64: function (low, high) {
          if (low >= 0) assert(high === 0);
          else assert(high === -1);
          return low;
        }
      };
      function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
        try {

          // readfds are supported,
          // writefds checks socket open status
          // exceptfds not supported
          // timeout is always 0 - fully async
          assert(nfds <= 64, 'nfds must be less than or equal to 64');  // fd sets have 64 bits // TODO: this could be 1024 based on current musl headers
          assert(!exceptfds, 'exceptfds not supported');

          var total = 0;

          var srcReadLow = (readfds ? HEAP32[((readfds) >> 2)] : 0),
            srcReadHigh = (readfds ? HEAP32[(((readfds) + (4)) >> 2)] : 0);
          var srcWriteLow = (writefds ? HEAP32[((writefds) >> 2)] : 0),
            srcWriteHigh = (writefds ? HEAP32[(((writefds) + (4)) >> 2)] : 0);
          var srcExceptLow = (exceptfds ? HEAP32[((exceptfds) >> 2)] : 0),
            srcExceptHigh = (exceptfds ? HEAP32[(((exceptfds) + (4)) >> 2)] : 0);

          var dstReadLow = 0,
            dstReadHigh = 0;
          var dstWriteLow = 0,
            dstWriteHigh = 0;
          var dstExceptLow = 0,
            dstExceptHigh = 0;

          var allLow = (readfds ? HEAP32[((readfds) >> 2)] : 0) |
            (writefds ? HEAP32[((writefds) >> 2)] : 0) |
            (exceptfds ? HEAP32[((exceptfds) >> 2)] : 0);
          var allHigh = (readfds ? HEAP32[(((readfds) + (4)) >> 2)] : 0) |
            (writefds ? HEAP32[(((writefds) + (4)) >> 2)] : 0) |
            (exceptfds ? HEAP32[(((exceptfds) + (4)) >> 2)] : 0);

          var check = function (fd, low, high, val) {
            return (fd < 32 ? (low & val) : (high & val));
          };

          for (var fd = 0; fd < nfds; fd++) {
            var mask = 1 << (fd % 32);
            if (!(check(fd, allLow, allHigh, mask))) {
              continue;  // index isn't in the set
            }

            var stream = FS.getStream(fd);
            if (!stream) throw new FS.ErrnoError(8);

            var flags = SYSCALLS.DEFAULT_POLLMASK;

            if (stream.stream_ops.poll) {
              flags = stream.stream_ops.poll(stream);
            }

            if ((flags & 1) && check(fd, srcReadLow, srcReadHigh, mask)) {
              fd < 32 ? (dstReadLow = dstReadLow | mask) : (dstReadHigh = dstReadHigh | mask);
              total++;
            }
            if ((flags & 4) && check(fd, srcWriteLow, srcWriteHigh, mask)) {
              fd < 32 ? (dstWriteLow = dstWriteLow | mask) : (dstWriteHigh = dstWriteHigh | mask);
              total++;
            }
            if ((flags & 2) && check(fd, srcExceptLow, srcExceptHigh, mask)) {
              fd < 32 ? (dstExceptLow = dstExceptLow | mask) : (dstExceptHigh = dstExceptHigh | mask);
              total++;
            }
          }

          if (readfds) {
            HEAP32[((readfds) >> 2)] = dstReadLow;
            HEAP32[(((readfds) + (4)) >> 2)] = dstReadHigh;
          }
          if (writefds) {
            HEAP32[((writefds) >> 2)] = dstWriteLow;
            HEAP32[(((writefds) + (4)) >> 2)] = dstWriteHigh;
          }
          if (exceptfds) {
            HEAP32[((exceptfds) >> 2)] = dstExceptLow;
            HEAP32[(((exceptfds) + (4)) >> 2)] = dstExceptHigh;
          }

          return total;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      var SOCKFS = {
        mount: function (mount) {
          // If Module['websocket'] has already been defined (e.g. for configuring
          // the subprotocol/url) use that, if not initialise it to a new object.
          Module['websocket'] = (Module['websocket'] &&
            ('object' === typeof Module['websocket'])) ? Module['websocket'] : {};

          // Add the Event registration mechanism to the exported websocket configuration
          // object so we can register network callbacks from native JavaScript too.
          // For more documentation see system/include/emscripten/emscripten.h
          Module['websocket']._callbacks = {};
          Module['websocket']['on'] = /** @this{Object} */ function (event, callback) {
            if ('function' === typeof callback) {
              this._callbacks[event] = callback;
            }
            return this;
          };

          Module['websocket'].emit = /** @this{Object} */ function (event, param) {
            if ('function' === typeof this._callbacks[event]) {
              this._callbacks[event].call(this, param);
            }
          };

          // If debug is enabled register simple default logging callbacks for each Event.

          return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
        }, createSocket: function (family, type, protocol) {
          type &= ~526336; // Some applications may pass it; it makes no sense for a single process.
          var streaming = type == 1;
          if (streaming && protocol && protocol != 6) {
            throw new FS.ErrnoError(66); // if SOCK_STREAM, must be tcp or 0.
          }

          // create our internal socket structure
          var sock = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            error: null, // Used in getsockopt for SOL_SOCKET/SO_ERROR test
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
          };

          // create the filesystem node to store the socket structure
          var name = SOCKFS.nextname();
          var node = FS.createNode(SOCKFS.root, name, 49152, 0);
          node.sock = sock;

          // and the wrapping stream that enables library functions such
          // as read and write to indirectly interact with the socket
          var stream = FS.createStream({
            path: name,
            node: node,
            flags: 2,
            seekable: false,
            stream_ops: SOCKFS.stream_ops
          });

          // map the new stream to the socket structure (sockets have a 1:1
          // relationship with a stream)
          sock.stream = stream;

          return sock;
        }, getSocket: function (fd) {
          var stream = FS.getStream(fd);
          if (!stream || !FS.isSocket(stream.node.mode)) {
            return null;
          }
          return stream.node.sock;
        }, stream_ops: {
          poll: function (stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock);
          }, ioctl: function (stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs);
          }, read: function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
              // socket is closed
              return 0;
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length;
          }, write: function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length);
          }, close: function (stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock);
          }
        }, nextname: function () {
          if (!SOCKFS.nextname.current) {
            SOCKFS.nextname.current = 0;
          }
          return 'socket[' + (SOCKFS.nextname.current++) + ']';
        }, websocket_sock_ops: {
          createPeer: function (sock, addr, port) {
            var ws;

            if (typeof addr == 'object') {
              ws = addr;
              addr = null;
              port = null;
            }

            if (ws) {
              // for sockets that've already connected (e.g. we're the server)
              // we can inspect the _socket property for the address
              if (ws._socket) {
                addr = ws._socket.remoteAddress;
                port = ws._socket.remotePort;
              }
              // if we're just now initializing a connection to the remote,
              // inspect the url property
              else {
                var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                if (!result) {
                  throw new Error('WebSocket URL must be in the format ws(s)://address:port');
                }
                addr = result[1];
                port = parseInt(result[2], 10);
              }
            } else {
              // create the actual websocket object and connect
              try {
                // runtimeConfig gets set to true if WebSocket runtime configuration is available.
                var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));

                // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
                // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
                var url = 'ws:#'.replace('#', '//');

                if (runtimeConfig) {
                  if ('string' === typeof Module['websocket']['url']) {
                    url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                  }
                }

                if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                  var parts = addr.split('/');
                  url = url + parts[0] + ":" + port + "/" + parts.slice(1).join('/');
                }

                // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
                var subProtocols = 'binary'; // The default value is 'binary'

                if (runtimeConfig) {
                  if ('string' === typeof Module['websocket']['subprotocol']) {
                    subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                  }
                }

                // The default WebSocket options
                var opts = undefined;

                if (subProtocols !== 'null') {
                  // The regex trims the string (removes spaces at the beginning and end, then splits the string by
                  // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
                  subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);

                  // The node ws library API for specifying optional subprotocol is slightly different than the browser's.
                  opts = ENVIRONMENT_IS_NODE ? { 'protocol': subProtocols.toString() } : subProtocols;
                }

                // some webservers (azure) does not support subprotocol header
                if (runtimeConfig && null === Module['websocket']['subprotocol']) {
                  subProtocols = 'null';
                  opts = undefined;
                }

                // If node we use the ws library.
                var WebSocketConstructor;
                if (ENVIRONMENT_IS_NODE) {
                  WebSocketConstructor = /** @type{(typeof WebSocket)} */(require('ws'));
                } else {
                  WebSocketConstructor = WebSocket;
                }
                ws = new WebSocketConstructor(url, opts);
                ws.binaryType = 'arraybuffer';
              } catch (e) {
                throw new FS.ErrnoError(23);
              }
            }

            var peer = {
              addr: addr,
              port: port,
              socket: ws,
              dgram_send_queue: []
            };

            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);

            // if this is a bound dgram socket, send the port number first to allow
            // us to override the ephemeral port reported to us by remotePort on the
            // remote end.
            if (sock.type === 2 && typeof sock.sport != 'undefined') {
              peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8), (sock.sport & 0xff)
              ]));
            }

            return peer;
          }, getPeer: function (sock, addr, port) {
            return sock.peers[addr + ':' + port];
          }, addPeer: function (sock, peer) {
            sock.peers[peer.addr + ':' + peer.port] = peer;
          }, removePeer: function (sock, peer) {
            delete sock.peers[peer.addr + ':' + peer.port];
          }, handlePeerEvents: function (sock, peer) {
            var first = true;

            var handleOpen = function () {

              Module['websocket'].emit('open', sock.stream.fd);

              try {
                var queued = peer.dgram_send_queue.shift();
                while (queued) {
                  peer.socket.send(queued);
                  queued = peer.dgram_send_queue.shift();
                }
              } catch (e) {
                // not much we can do here in the way of proper error handling as we've already
                // lied and said this data was sent. shut it down.
                peer.socket.close();
              }
            };

            function handleMessage(data) {
              if (typeof data == 'string') {
                var encoder = new TextEncoder(); // should be utf-8
                data = encoder.encode(data); // make a typed array from the string
              } else {
                assert(data.byteLength !== undefined); // must receive an ArrayBuffer
                if (data.byteLength == 0) {
                  // An empty ArrayBuffer will emit a pseudo disconnect event
                  // as recv/recvmsg will return zero which indicates that a socket
                  // has performed a shutdown although the connection has not been disconnected yet.
                  return;
                } else {
                  data = new Uint8Array(data); // make a typed array view on the array buffer
                }
              }

              // if this is the port message, override the peer's port with it
              var wasfirst = first;
              first = false;
              if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
                // update the peer's port and it's key in the peer map
                var newport = ((data[8] << 8) | data[9]);
                SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                peer.port = newport;
                SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                return;
              }

              sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
              Module['websocket'].emit('message', sock.stream.fd);
            };

            if (ENVIRONMENT_IS_NODE) {
              peer.socket.on('open', handleOpen);
              peer.socket.on('message', function (data, flags) {
                if (!flags.binary) {
                  return;
                }
                handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
              });
              peer.socket.on('close', function () {
                Module['websocket'].emit('close', sock.stream.fd);
              });
              peer.socket.on('error', function (error) {
                // Although the ws library may pass errors that may be more descriptive than
                // ECONNREFUSED they are not necessarily the expected error code e.g. 
                // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
                // is still probably the most useful thing to do.
                sock.error = 14; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
                Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
                // don't throw
              });
            } else {
              peer.socket.onopen = handleOpen;
              peer.socket.onclose = function () {
                Module['websocket'].emit('close', sock.stream.fd);
              };
              peer.socket.onmessage = function peer_socket_onmessage(event) {
                handleMessage(event.data);
              };
              peer.socket.onerror = function (error) {
                // The WebSocket spec only allows a 'simple event' to be thrown on error,
                // so we only really know as much as ECONNREFUSED.
                sock.error = 14; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
                Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
              };
            }
          }, poll: function (sock) {
            if (sock.type === 1 && sock.server) {
              // listen sockets should only say they're available for reading
              // if there are pending clients.
              return sock.pending.length ? (64 | 1) : 0;
            }

            var mask = 0;
            var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
              SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
              null;

            if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
              mask |= (64 | 1);
            }

            if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
              mask |= 4;
            }

            if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
              mask |= 16;
            }

            return mask;
          }, ioctl: function (sock, request, arg) {
            switch (request) {
              case 21531:
                var bytes = 0;
                if (sock.recv_queue.length) {
                  bytes = sock.recv_queue[0].data.length;
                }
                HEAP32[((arg) >> 2)] = bytes;
                return 0;
              default:
                return 28;
            }
          }, close: function (sock) {
            // if we've spawned a listen server, close it
            if (sock.server) {
              try {
                sock.server.close();
              } catch (e) {
              }
              sock.server = null;
            }
            // close any peer connections
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
              var peer = sock.peers[peers[i]];
              try {
                peer.socket.close();
              } catch (e) {
              }
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
            }
            return 0;
          }, bind: function (sock, addr, port) {
            if (typeof sock.saddr != 'undefined' || typeof sock.sport != 'undefined') {
              throw new FS.ErrnoError(28);  // already bound
            }
            sock.saddr = addr;
            sock.sport = port;
            // in order to emulate dgram sockets, we need to launch a listen server when
            // binding on a connection-less socket
            // note: this is only required on the server side
            if (sock.type === 2) {
              // close the existing server if it exists
              if (sock.server) {
                sock.server.close();
                sock.server = null;
              }
              // swallow error operation not supported error that occurs when binding in the
              // browser where this isn't supported
              try {
                sock.sock_ops.listen(sock, 0);
              } catch (e) {
                if (!(e instanceof FS.ErrnoError)) throw e;
                if (e.errno !== 138) throw e;
              }
            }
          }, connect: function (sock, addr, port) {
            if (sock.server) {
              throw new FS.ErrnoError(138);
            }

            // TODO autobind
            // if (!sock.addr && sock.type == 2) {
            // }

            // early out if we're already connected / in the middle of connecting
            if (typeof sock.daddr != 'undefined' && typeof sock.dport != 'undefined') {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (dest) {
                if (dest.socket.readyState === dest.socket.CONNECTING) {
                  throw new FS.ErrnoError(7);
                } else {
                  throw new FS.ErrnoError(30);
                }
              }
            }

            // add the socket to our peer list and set our
            // destination address / port to match
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;

            // always "fail" in non-blocking mode
            throw new FS.ErrnoError(26);
          }, listen: function (sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
              throw new FS.ErrnoError(138);
            }
            if (sock.server) {
              throw new FS.ErrnoError(28);  // already listening
            }
            var WebSocketServer = require('ws').Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
              host: host,
              port: sock.sport
              // TODO support backlog
            });
            Module['websocket'].emit('listen', sock.stream.fd); // Send Event with listen fd.

            sock.server.on('connection', function (ws) {
              if (sock.type === 1) {
                var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);

                // create a peer on the new socket
                var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                newsock.daddr = peer.addr;
                newsock.dport = peer.port;

                // push to queue for accept to pick up
                sock.pending.push(newsock);
                Module['websocket'].emit('connection', newsock.stream.fd);
              } else {
                // create a peer on the listen socket so calling sendto
                // with the listen socket and an address will resolve
                // to the correct client
                SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                Module['websocket'].emit('connection', sock.stream.fd);
              }
            });
            sock.server.on('closed', function () {
              Module['websocket'].emit('close', sock.stream.fd);
              sock.server = null;
            });
            sock.server.on('error', function (error) {
              // Although the ws library may pass errors that may be more descriptive than
              // ECONNREFUSED they are not necessarily the expected error code e.g. 
              // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
              // is still probably the most useful thing to do. This error shouldn't
              // occur in a well written app as errors should get trapped in the compiled
              // app's own getaddrinfo call.
              sock.error = 23; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
              Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'EHOSTUNREACH: Host is unreachable']);
              // don't throw
            });
          }, accept: function (listensock) {
            if (!listensock.server || !listensock.pending.length) {
              throw new FS.ErrnoError(28);
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock;
          }, getname: function (sock, peer) {
            var addr, port;
            if (peer) {
              if (sock.daddr === undefined || sock.dport === undefined) {
                throw new FS.ErrnoError(53);
              }
              addr = sock.daddr;
              port = sock.dport;
            } else {
              // TODO saddr and sport will be set for bind()'d UDP sockets, but what
              // should we be returning for TCP sockets that've been connect()'d?
              addr = sock.saddr || 0;
              port = sock.sport || 0;
            }
            return { addr: addr, port: port };
          }, sendmsg: function (sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
              // connection-less sockets will honor the message address,
              // and otherwise fall back to the bound destination address
              if (addr === undefined || port === undefined) {
                addr = sock.daddr;
                port = sock.dport;
              }
              // if there was no address to fall back to, error out
              if (addr === undefined || port === undefined) {
                throw new FS.ErrnoError(17);
              }
            } else {
              // connection-based sockets will only use the bound
              addr = sock.daddr;
              port = sock.dport;
            }

            // find the peer for the destination address
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);

            // early out if not connected with a connection-based socket
            if (sock.type === 1) {
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                throw new FS.ErrnoError(53);
              } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(6);
              }
            }

            // create a copy of the incoming data to send, as the WebSocket API
            // doesn't work entirely with an ArrayBufferView, it'll just send
            // the entire underlying buffer
            if (ArrayBuffer.isView(buffer)) {
              offset += buffer.byteOffset;
              buffer = buffer.buffer;
            }

            var data;
            data = buffer.slice(offset, offset + length);

            // if we're emulating a connection-less dgram socket and don't have
            // a cached connection, queue the buffer to send upon connect and
            // lie, saying the data was sent now.
            if (sock.type === 2) {
              if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                // if we're not connected, open a new connection
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                  dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                }
                dest.dgram_send_queue.push(data);
                return length;
              }
            }

            try {
              // send the actual data
              dest.socket.send(data);
              return length;
            } catch (e) {
              throw new FS.ErrnoError(28);
            }
          }, recvmsg: function (sock, length) {
            // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
            if (sock.type === 1 && sock.server) {
              // tcp servers should not be recv()'ing on the listen socket
              throw new FS.ErrnoError(53);
            }

            var queued = sock.recv_queue.shift();
            if (!queued) {
              if (sock.type === 1) {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);

                if (!dest) {
                  // if we have a destination address but are not connected, error out
                  throw new FS.ErrnoError(53);
                }
                else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                  // return null if the socket has closed
                  return null;
                }
                else {
                  // else, our socket is in a valid state but truly has nothing available
                  throw new FS.ErrnoError(6);
                }
              } else {
                throw new FS.ErrnoError(6);
              }
            }

            // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
            // requeued TCP data it'll be an ArrayBufferView
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
              buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
              addr: queued.addr,
              port: queued.port
            };

            // push back any unread data for TCP connections
            if (sock.type === 1 && bytesRead < queuedLength) {
              var bytesRemaining = queuedLength - bytesRead;
              queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
              sock.recv_queue.unshift(queued);
            }

            return res;
          }
        }
      };
      function getSocketFromFD(fd) {
        var socket = SOCKFS.getSocket(fd);
        if (!socket) throw new FS.ErrnoError(8);
        return socket;
      }

      function setErrNo(value) {
        HEAP32[((___errno_location()) >> 2)] = value;
        return value;
      }
      var Sockets = { BUFFER_SIZE: 10240, MAX_BUFFER_SIZE: 10485760, nextFd: 1, fds: {}, nextport: 1, maxport: 65535, peer: null, connections: {}, portmap: {}, localAddr: 4261412874, addrPool: [33554442, 50331658, 67108874, 83886090, 100663306, 117440522, 134217738, 150994954, 167772170, 184549386, 201326602, 218103818, 234881034] };

      function inetPton4(str) {
        var b = str.split('.');
        for (var i = 0; i < 4; i++) {
          var tmp = Number(b[i]);
          if (isNaN(tmp)) return null;
          b[i] = tmp;
        }
        return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
      }

      /** @suppress {checkTypes} */
      function jstoi_q(str) {
        return parseInt(str);
      }
      function inetPton6(str) {
        var words;
        var w, offset, z, i;
        /* http://home.deds.nl/~aeron/regex/ */
        var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
        var parts = [];
        if (!valid6regx.test(str)) {
          return null;
        }
        if (str === "::") {
          return [0, 0, 0, 0, 0, 0, 0, 0];
        }
        // Z placeholder to keep track of zeros when splitting the string on ":"
        if (str.startsWith("::")) {
          str = str.replace("::", "Z:"); // leading zeros case
        } else {
          str = str.replace("::", ":Z:");
        }

        if (str.indexOf(".") > 0) {
          // parse IPv4 embedded stress
          str = str.replace(new RegExp('[.]', 'g'), ":");
          words = str.split(":");
          words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
          words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
          words = words.slice(0, words.length - 2);
        } else {
          words = str.split(":");
        }

        offset = 0; z = 0;
        for (w = 0; w < words.length; w++) {
          if (typeof words[w] == 'string') {
            if (words[w] === 'Z') {
              // compressed zeros - write appropriate number of zero words
              for (z = 0; z < (8 - words.length + 1); z++) {
                parts[w + z] = 0;
              }
              offset = z - 1;
            } else {
              // parse hex to field to 16-bit value and write it in network byte-order
              parts[w + offset] = _htons(parseInt(words[w], 16));
            }
          } else {
            // parsed IPv4 words
            parts[w + offset] = words[w];
          }
        }
        return [
          (parts[1] << 16) | parts[0],
          (parts[3] << 16) | parts[2],
          (parts[5] << 16) | parts[4],
          (parts[7] << 16) | parts[6]
        ];
      }
      /** @param {number=} addrlen */
      function writeSockaddr(sa, family, addr, port, addrlen) {
        switch (family) {
          case 2:
            addr = inetPton4(addr);
            zeroMemory(sa, 16);
            if (addrlen) {
              HEAP32[((addrlen) >> 2)] = 16;
            }
            HEAP16[((sa) >> 1)] = family;
            HEAP32[(((sa) + (4)) >> 2)] = addr;
            HEAP16[(((sa) + (2)) >> 1)] = _htons(port);
            break;
          case 10:
            addr = inetPton6(addr);
            zeroMemory(sa, 28);
            if (addrlen) {
              HEAP32[((addrlen) >> 2)] = 28;
            }
            HEAP32[((sa) >> 2)] = family;
            HEAP32[(((sa) + (8)) >> 2)] = addr[0];
            HEAP32[(((sa) + (12)) >> 2)] = addr[1];
            HEAP32[(((sa) + (16)) >> 2)] = addr[2];
            HEAP32[(((sa) + (20)) >> 2)] = addr[3];
            HEAP16[(((sa) + (2)) >> 1)] = _htons(port);
            break;
          default:
            return 5;
        }
        return 0;
      }

      var DNS = {
        address_map: { id: 1, addrs: {}, names: {} }, lookup_name: function (name) {
          // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
          var res = inetPton4(name);
          if (res !== null) {
            return name;
          }
          res = inetPton6(name);
          if (res !== null) {
            return name;
          }

          // See if this name is already mapped.
          var addr;

          if (DNS.address_map.addrs[name]) {
            addr = DNS.address_map.addrs[name];
          } else {
            var id = DNS.address_map.id++;
            assert(id < 65535, 'exceeded max address mappings of 65535');

            addr = '172.29.' + (id & 0xff) + '.' + (id & 0xff00);

            DNS.address_map.names[addr] = name;
            DNS.address_map.addrs[name] = addr;
          }

          return addr;
        }, lookup_addr: function (addr) {
          if (DNS.address_map.names[addr]) {
            return DNS.address_map.names[addr];
          }

          return null;
        }
      };
      function ___syscall_accept4(fd, addr, addrlen, flags) {
        try {

          var sock = getSocketFromFD(fd);
          var newsock = sock.sock_ops.accept(sock);
          if (addr) {
            var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen);
            assert(!errno);
          }
          return newsock.stream.fd;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function inetNtop4(addr) {
        return (addr & 0xff) + '.' + ((addr >> 8) & 0xff) + '.' + ((addr >> 16) & 0xff) + '.' + ((addr >> 24) & 0xff)
      }

      function inetNtop6(ints) {
        //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
        //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
        //  128-bits are split into eight 16-bit words
        //  stored in network byte order (big-endian)
        //  |                80 bits               | 16 |      32 bits        |
        //  +-----------------------------------------------------------------+
        //  |               10 bytes               |  2 |      4 bytes        |
        //  +--------------------------------------+--------------------------+
        //  +               5 words                |  1 |      2 words        |
        //  +--------------------------------------+--------------------------+
        //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
        //  +--------------------------------------+----+---------------------+
        //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
        //  +--------------------------------------+----+---------------------+
        var str = "";
        var word = 0;
        var longest = 0;
        var lastzero = 0;
        var zstart = 0;
        var len = 0;
        var i = 0;
        var parts = [
          ints[0] & 0xffff,
          (ints[0] >> 16),
          ints[1] & 0xffff,
          (ints[1] >> 16),
          ints[2] & 0xffff,
          (ints[2] >> 16),
          ints[3] & 0xffff,
          (ints[3] >> 16)
        ];

        // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses

        var hasipv4 = true;
        var v4part = "";
        // check if the 10 high-order bytes are all zeros (first 5 words)
        for (i = 0; i < 5; i++) {
          if (parts[i] !== 0) { hasipv4 = false; break; }
        }

        if (hasipv4) {
          // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
          v4part = inetNtop4(parts[6] | (parts[7] << 16));
          // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
          if (parts[5] === -1) {
            str = "::ffff:";
            str += v4part;
            return str;
          }
          // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
          if (parts[5] === 0) {
            str = "::";
            //special case IPv6 addresses
            if (v4part === "0.0.0.0") v4part = ""; // any/unspecified address
            if (v4part === "0.0.0.1") v4part = "1";// loopback address
            str += v4part;
            return str;
          }
        }

        // Handle all other IPv6 addresses

        // first run to find the longest contiguous zero words
        for (word = 0; word < 8; word++) {
          if (parts[word] === 0) {
            if (word - lastzero > 1) {
              len = 0;
            }
            lastzero = word;
            len++;
          }
          if (len > longest) {
            longest = len;
            zstart = word - longest + 1;
          }
        }

        for (word = 0; word < 8; word++) {
          if (longest > 1) {
            // compress contiguous zeros - to produce "::"
            if (parts[word] === 0 && word >= zstart && word < (zstart + longest)) {
              if (word === zstart) {
                str += ":";
                if (zstart === 0) str += ":"; //leading zeros case
              }
              continue;
            }
          }
          // converts 16-bit words from big-endian to little-endian before converting to hex string
          str += Number(_ntohs(parts[word] & 0xffff)).toString(16);
          str += word < 7 ? ":" : "";
        }
        return str;
      }
      function readSockaddr(sa, salen) {
        // family / port offsets are common to both sockaddr_in and sockaddr_in6
        var family = HEAP16[((sa) >> 1)];
        var port = _ntohs(HEAPU16[(((sa) + (2)) >> 1)]);
        var addr;

        switch (family) {
          case 2:
            if (salen !== 16) {
              return { errno: 28 };
            }
            addr = HEAP32[(((sa) + (4)) >> 2)];
            addr = inetNtop4(addr);
            break;
          case 10:
            if (salen !== 28) {
              return { errno: 28 };
            }
            addr = [
              HEAP32[(((sa) + (8)) >> 2)],
              HEAP32[(((sa) + (12)) >> 2)],
              HEAP32[(((sa) + (16)) >> 2)],
              HEAP32[(((sa) + (20)) >> 2)]
            ];
            addr = inetNtop6(addr);
            break;
          default:
            return { errno: 5 };
        }

        return { family: family, addr: addr, port: port };
      }
      /** @param {boolean=} allowNull */
      function getSocketAddress(addrp, addrlen, allowNull) {
        if (allowNull && addrp === 0) return null;
        var info = readSockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info;
      }
      function ___syscall_bind(fd, addr, addrlen) {
        try {

          var sock = getSocketFromFD(fd);
          var info = getSocketAddress(addr, addrlen);
          sock.sock_ops.bind(sock, info.addr, info.port);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function __dlinit(main_dso_handle) {
        var dso = { refcount: Infinity, name: "__main__", module: Module["asm"], global: true };
        LDSO.loadedLibsByName[dso.name] = dso;
        LDSO.loadedLibsByHandle[main_dso_handle] = dso;
      }
      function ___syscall_mkdirat(dirfd, path, mode) {
        try { path = SYSCALLS.getStr(path); path = SYSCALLS.calculateAt(dirfd, path); path = PATH.normalize(path); if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1); FS.mkdir(path, mode, 0); return 0 } catch (e) { if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e; return -e.errno }
      }

      function ___syscall_chdir(path) {
        try {

          path = SYSCALLS.getStr(path);
          FS.chdir(path);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_connect(fd, addr, addrlen) {
        try {

          var sock = getSocketFromFD(fd);
          var info = getSocketAddress(addr, addrlen);
          sock.sock_ops.connect(sock, info.addr, info.port);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_dup(fd) {
        try {

          var old = SYSCALLS.getStreamFromFD(fd);
          return FS.open(old.path, old.flags, 0).fd;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_dup3(fd, suggestFD, flags) {
        try {

          var old = SYSCALLS.getStreamFromFD(fd);
          assert(!flags);
          if (old.fd === suggestFD) return -28;
          var suggest = FS.getStream(suggestFD);
          if (suggest) FS.close(suggest);
          return FS.open(old.path, old.flags, 0, suggestFD, suggestFD).fd;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_faccessat(dirfd, path, amode, flags) {
        try {

          path = SYSCALLS.getStr(path);
          assert(flags === 0);
          path = SYSCALLS.calculateAt(dirfd, path);
          return SYSCALLS.doAccess(path, amode);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_fcntl64(fd, cmd, varargs) {
        SYSCALLS.varargs = varargs;
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (cmd) {
            case 0: {
              var arg = SYSCALLS.get();
              if (arg < 0) {
                return -28;
              }
              var newStream;
              newStream = FS.open(stream.path, stream.flags, 0, arg);
              return newStream.fd;
            }
            case 1:
            case 2:
              return 0;  // FD_CLOEXEC makes no sense for a single process.
            case 3:
              return stream.flags;
            case 4: {
              var arg = SYSCALLS.get();
              stream.flags |= arg;
              return 0;
            }
            case 5:
        /* case 5: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {

                var arg = SYSCALLS.get();
                var offset = 0;
                // We're always unlocked.
                HEAP16[(((arg) + (offset)) >> 1)] = 2;
                return 0;
              }
            case 6:
            case 7:
              /* case 6: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
              /* case 7: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */


              return 0; // Pretend that the locking is successful.
            case 16:
            case 8:
              return -28; // These are for sockets. We don't have them fully implemented yet.
            case 9:
              // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
              setErrNo(28);
              return -1;
            default: {
              return -28;
            }
          }
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_fstat64(fd, buf) {
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          return SYSCALLS.doStat(FS.stat, stream.path, buf);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_getcwd(buf, size) {
        try {

          if (size === 0) return -28;
          var cwd = FS.cwd();
          var cwdLengthInBytes = lengthBytesUTF8(cwd);
          if (size < cwdLengthInBytes + 1) return -68;
          stringToUTF8(cwd, buf, size);
          return buf;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_getdents64(fd, dirp, count) {
        try {

          var stream = SYSCALLS.getStreamFromFD(fd)
          if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path);
          }

          var struct_size = 280;
          var pos = 0;
          var off = FS.llseek(stream, 0, 1);

          var idx = Math.floor(off / struct_size);

          while (idx < stream.getdents.length && pos + struct_size <= count) {
            var id;
            var type;
            var name = stream.getdents[idx];
            if (name === '.') {
              id = stream.node.id;
              type = 4; // DT_DIR
            }
            else if (name === '..') {
              var lookup = FS.lookupPath(stream.path, { parent: true });
              id = lookup.node.id;
              type = 4; // DT_DIR
            }
            else {
              var child = FS.lookupNode(stream.node, name);
              id = child.id;
              type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                  FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                    8;                             // DT_REG, regular file.
            }
            assert(id);
            (tempI64 = [id >>> 0, (tempDouble = id, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[((dirp + pos) >> 2)] = tempI64[0], HEAP32[(((dirp + pos) + (4)) >> 2)] = tempI64[1]);
            (tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[(((dirp + pos) + (8)) >> 2)] = tempI64[0], HEAP32[(((dirp + pos) + (12)) >> 2)] = tempI64[1]);
            HEAP16[(((dirp + pos) + (16)) >> 1)] = 280;
            HEAP8[(((dirp + pos) + (18)) >> 0)] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += struct_size;
            idx += 1;
          }
          FS.llseek(stream, idx * struct_size, 0);
          return pos;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_getsockname(fd, addr, addrlen) {
        try {

          err("__syscall_getsockname " + fd);
          var sock = getSocketFromFD(fd);
          // TODO: sock.saddr should never be undefined, see TODO in websocket_sock_ops.getname
          var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || '0.0.0.0'), sock.sport, addrlen);
          assert(!errno);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_getsockopt(fd, level, optname, optval, optlen) {
        try {

          var sock = getSocketFromFD(fd);
          // Minimal getsockopt aimed at resolving https://github.com/emscripten-core/emscripten/issues/2211
          // so only supports SOL_SOCKET with SO_ERROR.
          if (level === 1) {
            if (optname === 4) {
              HEAP32[((optval) >> 2)] = sock.error;
              HEAP32[((optlen) >> 2)] = 4;
              sock.error = null; // Clear the error (The SO_ERROR option obtains and then clears this field).
              return 0;
            }
          }
          return -50; // The option is unknown at the level indicated.
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_ioctl(fd, op, varargs) {
        SYSCALLS.varargs = varargs;
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (op) {
            case 21509:
            case 21505: {
              if (!stream.tty) return -59;
              return 0;
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
              if (!stream.tty) return -59;
              return 0; // no-op, not actually adjusting terminal settings
            }
            case 21519: {
              if (!stream.tty) return -59;
              var argp = SYSCALLS.get();
              HEAP32[((argp) >> 2)] = 0;
              return 0;
            }
            case 21520: {
              if (!stream.tty) return -59;
              return -28; // not supported
            }
            case 21531: {
              var argp = SYSCALLS.get();
              return FS.ioctl(stream, op, argp);
            }
            case 21523: {
              // TODO: in theory we should write to the winsize struct that gets
              // passed in, but for now musl doesn't read anything on it
              if (!stream.tty) return -59;
              return 0;
            }
            case 21524: {
              // TODO: technically, this ioctl call should change the window size.
              // but, since emscripten doesn't have any concept of a terminal window
              // yet, we'll just silently throw it away as we do TIOCGWINSZ
              if (!stream.tty) return -59;
              return 0;
            }
            default: abort('bad ioctl syscall ' + op);
          }
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_listen(fd, backlog) {
        try {

          var sock = getSocketFromFD(fd);
          sock.sock_ops.listen(sock, backlog);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_lstat64(path, buf) {
        try {

          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS.lstat, path, buf);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_mkdir(path, mode) {
        try {

          path = SYSCALLS.getStr(path);
          return SYSCALLS.doMkdir(path, mode);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_mknod(path, mode, dev) {
        try {

          path = SYSCALLS.getStr(path);
          return SYSCALLS.doMknod(path, mode, dev);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_newfstatat(dirfd, path, buf, flags) {
        try {

          path = SYSCALLS.getStr(path);
          var nofollow = flags & 256;
          var allowEmpty = flags & 4096;
          flags = flags & (~4352);
          assert(!flags, flags);
          path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
          return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_openat(dirfd, path, flags, varargs) {
        SYSCALLS.varargs = varargs;
        try {

          path = SYSCALLS.getStr(path);
          path = SYSCALLS.calculateAt(dirfd, path);
          var mode = varargs ? SYSCALLS.get() : 0;
          return FS.open(path, flags, mode).fd;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      var PIPEFS = {
        BUCKET_BUFFER_SIZE: 8192, mount: function (mount) {
          // Do not pollute the real root directory or its child nodes with pipes
          // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
          return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
        }, createPipe: function () {
          var pipe = {
            buckets: [],
            // refcnt 2 because pipe has a read end and a write end. We need to be
            // able to read from the read end after write end is closed.
            refcnt: 2,
          };

          pipe.buckets.push({
            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
            offset: 0,
            roffset: 0
          });

          var rName = PIPEFS.nextname();
          var wName = PIPEFS.nextname();
          var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
          var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);

          rNode.pipe = pipe;
          wNode.pipe = pipe;

          var readableStream = FS.createStream({
            path: rName,
            node: rNode,
            flags: 0,
            seekable: false,
            stream_ops: PIPEFS.stream_ops
          });
          rNode.stream = readableStream;

          var writableStream = FS.createStream({
            path: wName,
            node: wNode,
            flags: 1,
            seekable: false,
            stream_ops: PIPEFS.stream_ops
          });
          wNode.stream = writableStream;

          return {
            readable_fd: readableStream.fd,
            writable_fd: writableStream.fd
          };
        }, stream_ops: {
          poll: function (stream) {
            var pipe = stream.node.pipe;

            if ((stream.flags & 2097155) === 1) {
              return (256 | 4);
            } else {
              if (pipe.buckets.length > 0) {
                for (var i = 0; i < pipe.buckets.length; i++) {
                  var bucket = pipe.buckets[i];
                  if (bucket.offset - bucket.roffset > 0) {
                    return (64 | 1);
                  }
                }
              }
            }

            return 0;
          }, ioctl: function (stream, request, varargs) {
            return 28;
          }, fsync: function (stream) {
            return 28;
          }, read: function (stream, buffer, offset, length, position /* ignored */) {
            var pipe = stream.node.pipe;
            var currentLength = 0;

            for (var i = 0; i < pipe.buckets.length; i++) {
              var bucket = pipe.buckets[i];
              currentLength += bucket.offset - bucket.roffset;
            }

            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);

            if (length <= 0) {
              return 0;
            }
            if (currentLength == 0) {
              // Behave as if the read end is always non-blocking
              throw new FS.ErrnoError(6);
            }
            var toRead = Math.min(currentLength, length);

            var totalRead = toRead;
            var toRemove = 0;

            for (var i = 0; i < pipe.buckets.length; i++) {
              var currBucket = pipe.buckets[i];
              var bucketSize = currBucket.offset - currBucket.roffset;

              if (toRead <= bucketSize) {
                var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                if (toRead < bucketSize) {
                  tmpSlice = tmpSlice.subarray(0, toRead);
                  currBucket.roffset += toRead;
                } else {
                  toRemove++;
                }
                data.set(tmpSlice);
                break;
              } else {
                var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                data.set(tmpSlice);
                data = data.subarray(tmpSlice.byteLength);
                toRead -= tmpSlice.byteLength;
                toRemove++;
              }
            }

            if (toRemove && toRemove == pipe.buckets.length) {
              // Do not generate excessive garbage in use cases such as
              // write several bytes, read everything, write several bytes, read everything...
              toRemove--;
              pipe.buckets[toRemove].offset = 0;
              pipe.buckets[toRemove].roffset = 0;
            }

            pipe.buckets.splice(0, toRemove);

            return totalRead;
          }, write: function (stream, buffer, offset, length, position /* ignored */) {
            var pipe = stream.node.pipe;

            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);

            var dataLen = data.byteLength;
            if (dataLen <= 0) {
              return 0;
            }

            var currBucket = null;

            if (pipe.buckets.length == 0) {
              currBucket = {
                buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                offset: 0,
                roffset: 0
              };
              pipe.buckets.push(currBucket);
            } else {
              currBucket = pipe.buckets[pipe.buckets.length - 1];
            }

            assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);

            var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
            if (freeBytesInCurrBuffer >= dataLen) {
              currBucket.buffer.set(data, currBucket.offset);
              currBucket.offset += dataLen;
              return dataLen;
            } else if (freeBytesInCurrBuffer > 0) {
              currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
              currBucket.offset += freeBytesInCurrBuffer;
              data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
            }

            var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
            var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;

            for (var i = 0; i < numBuckets; i++) {
              var newBucket = {
                buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                offset: PIPEFS.BUCKET_BUFFER_SIZE,
                roffset: 0
              };
              pipe.buckets.push(newBucket);
              newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
              data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
            }

            if (remElements > 0) {
              var newBucket = {
                buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                offset: data.byteLength,
                roffset: 0
              };
              pipe.buckets.push(newBucket);
              newBucket.buffer.set(data);
            }

            return dataLen;
          }, close: function (stream) {
            var pipe = stream.node.pipe;
            pipe.refcnt--;
            if (pipe.refcnt === 0) {
              pipe.buckets = null;
            }
          }
        }, nextname: function () {
          if (!PIPEFS.nextname.current) {
            PIPEFS.nextname.current = 0;
          }
          return 'pipe[' + (PIPEFS.nextname.current++) + ']';
        }
      };
      function ___syscall_pipe(fdPtr) {
        try {

          if (fdPtr == 0) {
            throw new FS.ErrnoError(21);
          }

          var res = PIPEFS.createPipe();

          HEAP32[((fdPtr) >> 2)] = res.readable_fd;
          HEAP32[(((fdPtr) + (4)) >> 2)] = res.writable_fd;

          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
        try {

          path = SYSCALLS.getStr(path);
          path = SYSCALLS.calculateAt(dirfd, path);
          return SYSCALLS.doReadlink(path, buf, bufsize);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
        try {

          var sock = getSocketFromFD(fd);
          var msg = sock.sock_ops.recvmsg(sock, len);
          if (!msg) return 0; // socket is closed
          if (addr) {
            var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
            assert(!errno);
          }
          HEAPU8.set(msg.buffer, buf);
          return msg.buffer.byteLength;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
        try {

          oldpath = SYSCALLS.getStr(oldpath);
          newpath = SYSCALLS.getStr(newpath);
          oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
          newpath = SYSCALLS.calculateAt(newdirfd, newpath);
          FS.rename(oldpath, newpath);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_rmdir(path) {
        try {

          path = SYSCALLS.getStr(path);
          FS.rmdir(path);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
        try {

          var sock = getSocketFromFD(fd);
          var dest = getSocketAddress(addr, addr_len, true);
          if (!dest) {
            // send, no address provided
            return FS.write(sock.stream, HEAP8, message, length);
          } else {
            // sendto an address
            return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
          }
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_socket(domain, type, protocol) {
        try {

          var sock = SOCKFS.createSocket(domain, type, protocol);
          assert(sock.stream.fd < 64); // XXX ? select() assumes socket fd values are in 0..63
          return sock.stream.fd;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_stat64(path, buf) {
        try {

          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS.stat, path, buf);
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_symlink(target, linkpath) {
        try {

          target = SYSCALLS.getStr(target);
          linkpath = SYSCALLS.getStr(linkpath);
          FS.symlink(target, linkpath);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_unlinkat(dirfd, path, flags) {
        try {

          path = SYSCALLS.getStr(path);
          path = SYSCALLS.calculateAt(dirfd, path);
          if (flags === 0) {
            FS.unlink(path);
          } else if (flags === 512) {
            FS.rmdir(path);
          } else {
            abort('Invalid flags passed to unlinkat');
          }
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      function ___syscall_utimensat(dirfd, path, times, flags) {
        try {

          path = SYSCALLS.getStr(path);
          assert(flags === 0);
          path = SYSCALLS.calculateAt(dirfd, path, true);
          if (!times) {
            var atime = Date.now();
            var mtime = atime;
          } else {
            var seconds = HEAP32[((times) >> 2)];
            var nanoseconds = HEAP32[(((times) + (4)) >> 2)];
            atime = (seconds * 1000) + (nanoseconds / (1000 * 1000));
            times += 8;
            seconds = HEAP32[((times) >> 2)];
            nanoseconds = HEAP32[(((times) + (4)) >> 2)];
            mtime = (seconds * 1000) + (nanoseconds / (1000 * 1000));
          }
          FS.utime(path, atime, mtime);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno;
        }
      }

      var ___table_base = new WebAssembly.Global({ 'value': 'i32', 'mutable': false }, 1);

      var ENV = {};

      function dlSetError(msg) {
        withStackSave(function () {
          var cmsg = allocateUTF8OnStack(msg);
          ___dl_seterr(cmsg);
        });
      }
      function dlopenInternal(handle, jsflags) {
        // void *dlopen(const char *file, int mode);
        // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html
        var filename = UTF8ToString(handle + 44);
        var flags = HEAP32[(((handle) + (20)) >> 2)];
        filename = PATH.normalize(filename);
        var searchpaths = [];

        var isValidFile = (filename) => {
          var target = FS.findObject(filename);
          return target && !target.isFolder && !target.isDevice;
        };

        if (!isValidFile(filename)) {
          if (ENV['LD_LIBRARY_PATH']) {
            searchpaths = ENV['LD_LIBRARY_PATH'].split(':');
          }

          for (var ident in searchpaths) {
            var searchfile = PATH.join2(searchpaths[ident], filename);
            if (isValidFile(searchfile)) {
              filename = searchfile;
              break;
            }
          }
        }

        // We don't care about RTLD_NOW and RTLD_LAZY.
        var combinedFlags = {
          global: Boolean(flags & 256),
          nodelete: Boolean(flags & 4096),
          loadAsync: jsflags.loadAsync,
          fs: jsflags.fs,
        }

        if (jsflags.loadAsync) {
          return loadDynamicLibrary(filename, combinedFlags, handle);
        }

        try {
          return loadDynamicLibrary(filename, combinedFlags, handle)
        } catch (e) {
          err('Error in loading dynamic library ' + filename + ": " + e);
          dlSetError('Could not load dynamic lib: ' + filename + '\n' + e);
          return 0;
        }
      }
      function __dlopen_js(handle) {
        var jsflags = {
          loadAsync: false,
          fs: FS, // load libraries from provided filesystem
        }
        return dlopenInternal(handle, jsflags);
      }
      __dlopen_js.sig = 'iiii';

      function __dlsym_js(handle, symbol) {
        // void *dlsym(void *restrict handle, const char *restrict name);
        // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlsym.html
        symbol = UTF8ToString(symbol);
        var result;

        if (handle == 0) {
          result = resolveGlobalSymbol(symbol, true);
          if (!result) {
            dlSetError('Tried to lookup unknown symbol "' + symbol + '" in dynamic lib: RTLD_DEFAULT');
            return 0;
          }
        } else {
          var lib = LDSO.loadedLibsByHandle[handle];
          assert(lib, 'Tried to dlsym() from an unopened handle: ' + handle);
          if (!lib.module.hasOwnProperty(symbol)) {
            dlSetError('Tried to lookup unknown symbol "' + symbol + '" in dynamic lib: ' + lib.name)
            return 0;
          }
          result = lib.module['orig$' + symbol];
          if (!result)
            result = lib.module[symbol];
        }

        if (typeof result == 'function') {
          // Insert the function into the wasm table.  If its a direct wasm function
          // the second argument will not be needed.  If its a JS function we rely
          // on the `sig` attribute being set based on the `<func>__sig` specified
          // in library JS file.
          result = addFunction(result, result.sig);
        }
        return result;
      }
      __dlsym_js.sig = 'iii';

      function __emscripten_date_now() {
        return Date.now();
      }
      __emscripten_date_now.sig = 'j';

      var nowIsMonotonic = true;;
      function __emscripten_get_now_is_monotonic() {
        return nowIsMonotonic;
      }

      function __emscripten_throw_longjmp() { throw Infinity; }
      __emscripten_throw_longjmp.sig = 'v';

      function __gmtime_js(time, tmPtr) {
        var date = new Date(HEAP32[((time) >> 2)] * 1000);
        HEAP32[((tmPtr) >> 2)] = date.getUTCSeconds();
        HEAP32[(((tmPtr) + (4)) >> 2)] = date.getUTCMinutes();
        HEAP32[(((tmPtr) + (8)) >> 2)] = date.getUTCHours();
        HEAP32[(((tmPtr) + (12)) >> 2)] = date.getUTCDate();
        HEAP32[(((tmPtr) + (16)) >> 2)] = date.getUTCMonth();
        HEAP32[(((tmPtr) + (20)) >> 2)] = date.getUTCFullYear() - 1900;
        HEAP32[(((tmPtr) + (24)) >> 2)] = date.getUTCDay();
        var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
        var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24)) | 0;
        HEAP32[(((tmPtr) + (28)) >> 2)] = yday;
      }
      __gmtime_js.sig = 'iii';

      function __localtime_js(time, tmPtr) {
        var date = new Date(HEAP32[((time) >> 2)] * 1000);
        HEAP32[((tmPtr) >> 2)] = date.getSeconds();
        HEAP32[(((tmPtr) + (4)) >> 2)] = date.getMinutes();
        HEAP32[(((tmPtr) + (8)) >> 2)] = date.getHours();
        HEAP32[(((tmPtr) + (12)) >> 2)] = date.getDate();
        HEAP32[(((tmPtr) + (16)) >> 2)] = date.getMonth();
        HEAP32[(((tmPtr) + (20)) >> 2)] = date.getFullYear() - 1900;
        HEAP32[(((tmPtr) + (24)) >> 2)] = date.getDay();

        var start = new Date(date.getFullYear(), 0, 1);
        var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) | 0;
        HEAP32[(((tmPtr) + (28)) >> 2)] = yday;
        HEAP32[(((tmPtr) + (36)) >> 2)] = -(date.getTimezoneOffset() * 60);

        // Attention: DST is in December in South, and some regions don't have DST at all.
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
        HEAP32[(((tmPtr) + (32)) >> 2)] = dst;
      }
      __localtime_js.sig = 'iii';

      function __mktime_js(tmPtr) {
        var date = new Date(HEAP32[(((tmPtr) + (20)) >> 2)] + 1900,
          HEAP32[(((tmPtr) + (16)) >> 2)],
          HEAP32[(((tmPtr) + (12)) >> 2)],
          HEAP32[(((tmPtr) + (8)) >> 2)],
          HEAP32[(((tmPtr) + (4)) >> 2)],
          HEAP32[((tmPtr) >> 2)],
          0);

        // There's an ambiguous hour when the time goes back; the tm_isdst field is
        // used to disambiguate it.  Date() basically guesses, so we fix it up if it
        // guessed wrong, or fill in tm_isdst with the guess if it's -1.
        var dst = HEAP32[(((tmPtr) + (32)) >> 2)];
        var guessedOffset = date.getTimezoneOffset();
        var start = new Date(date.getFullYear(), 0, 1);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
        if (dst < 0) {
          // Attention: some regions don't have DST at all.
          HEAP32[(((tmPtr) + (32)) >> 2)] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
        } else if ((dst > 0) != (dstOffset == guessedOffset)) {
          var nonDstOffset = Math.max(winterOffset, summerOffset);
          var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
          // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
          date.setTime(date.getTime() + (trueOffset - guessedOffset) * 60000);
        }

        HEAP32[(((tmPtr) + (24)) >> 2)] = date.getDay();
        var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) | 0;
        HEAP32[(((tmPtr) + (28)) >> 2)] = yday;
        // To match expected behavior, update fields from date
        HEAP32[((tmPtr) >> 2)] = date.getSeconds();
        HEAP32[(((tmPtr) + (4)) >> 2)] = date.getMinutes();
        HEAP32[(((tmPtr) + (8)) >> 2)] = date.getHours();
        HEAP32[(((tmPtr) + (12)) >> 2)] = date.getDate();
        HEAP32[(((tmPtr) + (16)) >> 2)] = date.getMonth();

        return (date.getTime() / 1000) | 0;
      }
      __mktime_js.sig = 'ii';

      function __timegm_js(tmPtr) {
        var time = Date.UTC(HEAP32[(((tmPtr) + (20)) >> 2)] + 1900,
          HEAP32[(((tmPtr) + (16)) >> 2)],
          HEAP32[(((tmPtr) + (12)) >> 2)],
          HEAP32[(((tmPtr) + (8)) >> 2)],
          HEAP32[(((tmPtr) + (4)) >> 2)],
          HEAP32[((tmPtr) >> 2)],
          0);
        var date = new Date(time);

        HEAP32[(((tmPtr) + (24)) >> 2)] = date.getUTCDay();
        var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
        var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24)) | 0;
        HEAP32[(((tmPtr) + (28)) >> 2)] = yday;

        return (date.getTime() / 1000) | 0;
      }
      __timegm_js.sig = 'ii';

      function _tzset_impl(timezone, daylight, tzname) {
        var currentYear = new Date().getFullYear();
        var winter = new Date(currentYear, 0, 1);
        var summer = new Date(currentYear, 6, 1);
        var winterOffset = winter.getTimezoneOffset();
        var summerOffset = summer.getTimezoneOffset();

        // Local standard timezone offset. Local standard time is not adjusted for daylight savings.
        // This code uses the fact that getTimezoneOffset returns a greater value during Standard Time versus Daylight Saving Time (DST).
        // Thus it determines the expected output during Standard Time, and it compares whether the output of the given date the same (Standard) or less (DST).
        var stdTimezoneOffset = Math.max(winterOffset, summerOffset);

        // timezone is specified as seconds west of UTC ("The external variable
        // `timezone` shall be set to the difference, in seconds, between
        // Coordinated Universal Time (UTC) and local standard time."), the same
        // as returned by stdTimezoneOffset.
        // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
        HEAP32[((timezone) >> 2)] = stdTimezoneOffset * 60;

        HEAP32[((daylight) >> 2)] = Number(winterOffset != summerOffset);

        function extractZone(date) {
          var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return match ? match[1] : "GMT";
        };
        var winterName = extractZone(winter);
        var summerName = extractZone(summer);
        var winterNamePtr = allocateUTF8(winterName);
        var summerNamePtr = allocateUTF8(summerName);
        if (summerOffset < winterOffset) {
          // Northern hemisphere
          HEAP32[((tzname) >> 2)] = winterNamePtr;
          HEAP32[(((tzname) + (4)) >> 2)] = summerNamePtr;
        } else {
          HEAP32[((tzname) >> 2)] = summerNamePtr;
          HEAP32[(((tzname) + (4)) >> 2)] = winterNamePtr;
        }
      }
      _tzset_impl.sig = 'viii';
      function __tzset_js(timezone, daylight, tzname) {
        // TODO: Use (malleable) environment variables instead of system settings.
        if (__tzset_js.called) return;
        __tzset_js.called = true;
        _tzset_impl(timezone, daylight, tzname);
      }
      __tzset_js.sig = 'viii';

      function _abort() {
        abort('native code called abort()');
      }
      _abort.sig = 'v';

      function _emscripten_console_error(str) {
        assert(typeof str == 'number');
        console.error(UTF8ToString(str));
      }
      _emscripten_console_error.sig = 'vi';

      function _emscripten_get_heap_max() {
        return HEAPU8.length;
      }

      var _emscripten_get_now; if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = () => {
          var t = process['hrtime']();
          return t[0] * 1e3 + t[1] / 1e6;
        };
      } else _emscripten_get_now = () => performance.now();
      ;

      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
      }

      function abortOnCannotGrowMemory(requestedSize) {
        abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s INITIAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
      }
      function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        abortOnCannotGrowMemory(requestedSize);
      }

      function getExecutableName() {
        return thisProgram || './this.program';
      }
      function getEnvStrings() {
        if (!getEnvStrings.strings) {
          // Default values.
          // Browser language detection #8751
          var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
          var env = {
            'USER': 'web_user',
            'LOGNAME': 'web_user',
            'PATH': '/',
            'PWD': '/',
            'HOME': '/home/web_user',
            'LANG': lang,
            '_': getExecutableName()
          };
          // Apply the user-provided values, if any.
          for (var x in ENV) {
            // x is a key in ENV; if ENV[x] is undefined, that means it was
            // explicitly set to be so. We allow user code to do that to
            // force variables with default values to remain unset.
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x];
          }
          var strings = [];
          for (var x in env) {
            strings.push(x + '=' + env[x]);
          }
          getEnvStrings.strings = strings;
        }
        return getEnvStrings.strings;
      }
      function _environ_get(__environ, environ_buf) {
        var bufSize = 0;
        getEnvStrings().forEach(function (string, i) {
          var ptr = environ_buf + bufSize;
          HEAP32[(((__environ) + (i * 4)) >> 2)] = ptr;
          writeAsciiToMemory(string, ptr);
          bufSize += string.length + 1;
        });
        return 0;
      }
      _environ_get.sig = 'iii';

      function _environ_sizes_get(penviron_count, penviron_buf_size) {
        var strings = getEnvStrings();
        HEAP32[((penviron_count) >> 2)] = strings.length;
        var bufSize = 0;
        strings.forEach(function (string) {
          bufSize += string.length + 1;
        });
        HEAP32[((penviron_buf_size) >> 2)] = bufSize;
        return 0;
      }
      _environ_sizes_get.sig = 'iii';

      function _exit(status) {
        // void _exit(int status);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
        exit(status);
      }
      _exit.sig = 'vi';

      function _fd_close(fd) {
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          FS.close(stream);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno;
        }
      }
      _fd_close.sig = 'ii';

      function _fd_fdstat_get(fd, pbuf) {
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          // All character devices are terminals (other things a Linux system would
          // assume is a character device, like the mouse, we have special APIs for).
          var type = stream.tty ? 2 :
            FS.isDir(stream.mode) ? 3 :
              FS.isLink(stream.mode) ? 7 :
                4;
          HEAP8[((pbuf) >> 0)] = type;
          // TODO HEAP16[(((pbuf)+(2))>>1)] = ?;
          // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(8))>>2)] = tempI64[0],HEAP32[(((pbuf)+(12))>>2)] = tempI64[1]);
          // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(16))>>2)] = tempI64[0],HEAP32[(((pbuf)+(20))>>2)] = tempI64[1]);
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno;
        }
      }
      _fd_fdstat_get.sig = 'iii';

      function _fd_read(fd, iov, iovcnt, pnum) {
        try {

          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt);
          HEAP32[((pnum) >> 2)] = num;
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno;
        }
      }
      _fd_read.sig = 'iiiii';

      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        try {


          var stream = SYSCALLS.getStreamFromFD(fd);
          var HIGH_OFFSET = 0x100000000; // 2^32
          // use an unsigned operator on low and shift high by 32-bits
          var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);

          var DOUBLE_LIMIT = 0x20000000000000; // 2^53
          // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
          if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61;
          }

          FS.llseek(stream, offset, whence);
          (tempI64 = [stream.position >>> 0, (tempDouble = stream.position, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[((newOffset) >> 2)] = tempI64[0], HEAP32[(((newOffset) + (4)) >> 2)] = tempI64[1]);
          if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno;
        }
      }

      function _fd_write(fd, iov, iovcnt, pnum) {
        try {

          ;
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doWritev(stream, iov, iovcnt);
          HEAP32[((pnum) >> 2)] = num;
          return 0;
        } catch (e) {
          if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno;
        }
      }
      _fd_write.sig = 'iiiii';

      function _getTempRet0() {
        return getTempRet0();
      }
      _getTempRet0.sig = 'i';

      function _getaddrinfo(node, service, hint, out) {
        // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
        // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
        // really should provide a linked list of suitable addrinfo values.
        var addrs = [];
        var canon = null;
        var addr = 0;
        var port = 0;
        var flags = 0;
        var family = 0;
        var type = 0;
        var proto = 0;
        var ai, last;

        function allocaddrinfo(family, type, proto, canon, addr, port) {
          var sa, salen, ai;
          var errno;

          salen = family === 10 ?
            28 :
            16;
          addr = family === 10 ?
            inetNtop6(addr) :
            inetNtop4(addr);
          sa = _malloc(salen);
          errno = writeSockaddr(sa, family, addr, port);
          assert(!errno);

          ai = _malloc(32);
          HEAP32[(((ai) + (4)) >> 2)] = family;
          HEAP32[(((ai) + (8)) >> 2)] = type;
          HEAP32[(((ai) + (12)) >> 2)] = proto;
          HEAP32[(((ai) + (24)) >> 2)] = canon;
          HEAP32[(((ai) + (20)) >> 2)] = sa;
          if (family === 10) {
            HEAP32[(((ai) + (16)) >> 2)] = 28;
          } else {
            HEAP32[(((ai) + (16)) >> 2)] = 16;
          }
          HEAP32[(((ai) + (28)) >> 2)] = 0;

          return ai;
        }

        if (hint) {
          flags = HEAP32[((hint) >> 2)];
          family = HEAP32[(((hint) + (4)) >> 2)];
          type = HEAP32[(((hint) + (8)) >> 2)];
          proto = HEAP32[(((hint) + (12)) >> 2)];
        }
        if (type && !proto) {
          proto = type === 2 ? 17 : 6;
        }
        if (!type && proto) {
          type = proto === 17 ? 2 : 1;
        }

        // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
        // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
        if (proto === 0) {
          proto = 6;
        }
        if (type === 0) {
          type = 1;
        }

        if (!node && !service) {
          return -2;
        }
        if (flags & ~(1 | 2 | 4 |
          1024 | 8 | 16 | 32)) {
          return -1;
        }
        if (hint !== 0 && (HEAP32[((hint) >> 2)] & 2) && !node) {
          return -1;
        }
        if (flags & 32) {
          // TODO
          return -2;
        }
        if (type !== 0 && type !== 1 && type !== 2) {
          return -7;
        }
        if (family !== 0 && family !== 2 && family !== 10) {
          return -6;
        }

        if (service) {
          service = UTF8ToString(service);
          port = parseInt(service, 10);

          if (isNaN(port)) {
            if (flags & 1024) {
              return -2;
            }
            // TODO support resolving well-known service names from:
            // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
            return -8;
          }
        }

        if (!node) {
          if (family === 0) {
            family = 2;
          }
          if ((flags & 1) === 0) {
            if (family === 2) {
              addr = _htonl(2130706433);
            } else {
              addr = [0, 0, 0, 1];
            }
          }
          ai = allocaddrinfo(family, type, proto, null, addr, port);
          HEAP32[((out) >> 2)] = ai;
          return 0;
        }

        //
        // try as a numeric address
        //
        node = UTF8ToString(node);
        addr = inetPton4(node);
        if (addr !== null) {
          // incoming node is a valid ipv4 address
          if (family === 0 || family === 2) {
            family = 2;
          }
          else if (family === 10 && (flags & 8)) {
            addr = [0, 0, _htonl(0xffff), addr];
            family = 10;
          } else {
            return -2;
          }
        } else {
          addr = inetPton6(node);
          if (addr !== null) {
            // incoming node is a valid ipv6 address
            if (family === 0 || family === 10) {
              family = 10;
            } else {
              return -2;
            }
          }
        }
        if (addr != null) {
          ai = allocaddrinfo(family, type, proto, node, addr, port);
          HEAP32[((out) >> 2)] = ai;
          return 0;
        }
        if (flags & 4) {
          return -2;
        }

        //
        // try as a hostname
        //
        // resolve the hostname to a temporary fake address
        node = DNS.lookup_name(node);
        addr = inetPton4(node);
        if (family === 0) {
          family = 2;
        } else if (family === 10) {
          addr = [0, 0, _htonl(0xffff), addr];
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAP32[((out) >> 2)] = ai;
        return 0;
      }
      _getaddrinfo.sig = 'iiiii';

      function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
        var info = readSockaddr(sa, salen);
        if (info.errno) {
          return -6;
        }
        var port = info.port;
        var addr = info.addr;

        var overflowed = false;

        if (node && nodelen) {
          var lookup;
          if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
            if (flags & 8) {
              return -2;
            }
          } else {
            addr = lookup;
          }
          var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);

          if (numBytesWrittenExclNull + 1 >= nodelen) {
            overflowed = true;
          }
        }

        if (serv && servlen) {
          port = '' + port;
          var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);

          if (numBytesWrittenExclNull + 1 >= servlen) {
            overflowed = true;
          }
        }

        if (overflowed) {
          // Note: even when we overflow, getnameinfo() is specced to write out the truncated results.
          return -12;
        }

        return 0;
      }

      function _proc_exit(code) {
        procExit(code);
      }
      _proc_exit.sig = 'vi';

      function _pthread_setschedparam(
      ) {
        if (!Module['_pthread_setschedparam']) abort("external symbol 'pthread_setschedparam' is missing. perhaps a side module was not linked in? if this function was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=1 in the environment");
        return Module['_pthread_setschedparam'].apply(null, arguments);
      }

      function _sem_timedwait(
      ) {
        if (!Module['_sem_timedwait']) abort("external symbol 'sem_timedwait' is missing. perhaps a side module was not linked in? if this function was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=1 in the environment");
        return Module['_sem_timedwait'].apply(null, arguments);
      }

      function _setTempRet0(val) {
        setTempRet0(val);
      }
      _setTempRet0.sig = 'vi';

      function _system(command) {
        // int system(const char *command);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/system.html
        // Can't call external programs.
        if (!command) return 0; // no shell available
        setErrNo(52);
        return -1;
      }

      var FSNode = /** @constructor */ function (parent, name, mode, rdev) {
        if (!parent) {
          parent = this;  // root node sets parent to itself
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.mounted = null;
        this.id = FS.nextInode++;
        this.name = name;
        this.mode = mode;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = rdev;
      };
      var readMode = 292/*292*/ | 73/*73*/;
      var writeMode = 146/*146*/;
      Object.defineProperties(FSNode.prototype, {
        read: {
          get: /** @this{FSNode} */function () {
            return (this.mode & readMode) === readMode;
          },
          set: /** @this{FSNode} */function (val) {
            val ? this.mode |= readMode : this.mode &= ~readMode;
          }
        },
        write: {
          get: /** @this{FSNode} */function () {
            return (this.mode & writeMode) === writeMode;
          },
          set: /** @this{FSNode} */function (val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode;
          }
        },
        isFolder: {
          get: /** @this{FSNode} */function () {
            return FS.isDir(this.mode);
          }
        },
        isDevice: {
          get: /** @this{FSNode} */function () {
            return FS.isChrdev(this.mode);
          }
        }
      });
      FS.FSNode = FSNode;
      FS.staticInit();;
      ERRNO_CODES = {
        'EPERM': 63,
        'ENOENT': 44,
        'ESRCH': 71,
        'EINTR': 27,
        'EIO': 29,
        'ENXIO': 60,
        'E2BIG': 1,
        'ENOEXEC': 45,
        'EBADF': 8,
        'ECHILD': 12,
        'EAGAIN': 6,
        'EWOULDBLOCK': 6,
        'ENOMEM': 48,
        'EACCES': 2,
        'EFAULT': 21,
        'ENOTBLK': 105,
        'EBUSY': 10,
        'EEXIST': 20,
        'EXDEV': 75,
        'ENODEV': 43,
        'ENOTDIR': 54,
        'EISDIR': 31,
        'EINVAL': 28,
        'ENFILE': 41,
        'EMFILE': 33,
        'ENOTTY': 59,
        'ETXTBSY': 74,
        'EFBIG': 22,
        'ENOSPC': 51,
        'ESPIPE': 70,
        'EROFS': 69,
        'EMLINK': 34,
        'EPIPE': 64,
        'EDOM': 18,
        'ERANGE': 68,
        'ENOMSG': 49,
        'EIDRM': 24,
        'ECHRNG': 106,
        'EL2NSYNC': 156,
        'EL3HLT': 107,
        'EL3RST': 108,
        'ELNRNG': 109,
        'EUNATCH': 110,
        'ENOCSI': 111,
        'EL2HLT': 112,
        'EDEADLK': 16,
        'ENOLCK': 46,
        'EBADE': 113,
        'EBADR': 114,
        'EXFULL': 115,
        'ENOANO': 104,
        'EBADRQC': 103,
        'EBADSLT': 102,
        'EDEADLOCK': 16,
        'EBFONT': 101,
        'ENOSTR': 100,
        'ENODATA': 116,
        'ETIME': 117,
        'ENOSR': 118,
        'ENONET': 119,
        'ENOPKG': 120,
        'EREMOTE': 121,
        'ENOLINK': 47,
        'EADV': 122,
        'ESRMNT': 123,
        'ECOMM': 124,
        'EPROTO': 65,
        'EMULTIHOP': 36,
        'EDOTDOT': 125,
        'EBADMSG': 9,
        'ENOTUNIQ': 126,
        'EBADFD': 127,
        'EREMCHG': 128,
        'ELIBACC': 129,
        'ELIBBAD': 130,
        'ELIBSCN': 131,
        'ELIBMAX': 132,
        'ELIBEXEC': 133,
        'ENOSYS': 52,
        'ENOTEMPTY': 55,
        'ENAMETOOLONG': 37,
        'ELOOP': 32,
        'EOPNOTSUPP': 138,
        'EPFNOSUPPORT': 139,
        'ECONNRESET': 15,
        'ENOBUFS': 42,
        'EAFNOSUPPORT': 5,
        'EPROTOTYPE': 67,
        'ENOTSOCK': 57,
        'ENOPROTOOPT': 50,
        'ESHUTDOWN': 140,
        'ECONNREFUSED': 14,
        'EADDRINUSE': 3,
        'ECONNABORTED': 13,
        'ENETUNREACH': 40,
        'ENETDOWN': 38,
        'ETIMEDOUT': 73,
        'EHOSTDOWN': 142,
        'EHOSTUNREACH': 23,
        'EINPROGRESS': 26,
        'EALREADY': 7,
        'EDESTADDRREQ': 17,
        'EMSGSIZE': 35,
        'EPROTONOSUPPORT': 66,
        'ESOCKTNOSUPPORT': 137,
        'EADDRNOTAVAIL': 4,
        'ENETRESET': 39,
        'EISCONN': 30,
        'ENOTCONN': 53,
        'ETOOMANYREFS': 141,
        'EUSERS': 136,
        'EDQUOT': 19,
        'ESTALE': 72,
        'ENOTSUP': 138,
        'ENOMEDIUM': 148,
        'EILSEQ': 25,
        'EOVERFLOW': 61,
        'ECANCELED': 11,
        'ENOTRECOVERABLE': 56,
        'EOWNERDEAD': 62,
        'ESTRPIPE': 135,
      };;
      var ASSERTIONS = true;



      /** @type {function(string, boolean=, number=)} */
      function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array;
      }

      function intArrayToString(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
          var chr = array[i];
          if (chr > 0xFF) {
            if (ASSERTIONS) {
              assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
            }
            chr &= 0xFF;
          }
          ret.push(String.fromCharCode(chr));
        }
        return ret.join('');
      }


      function checkIncomingModuleAPI() {
        ignoredModuleProp('fetchSettings');
      }
      var coreLibraryArg = {
        "__assert_fail": ___assert_fail,
        "__call_sighandler": ___call_sighandler,
        "__heap_base": ___heap_base,
        "__indirect_function_table": wasmTable,
        "__memory_base": ___memory_base,
        "__stack_pointer": ___stack_pointer,
        "__syscall__newselect": ___syscall__newselect,
        "__syscall_accept4": ___syscall_accept4,
        "__syscall_bind": ___syscall_bind,
        "__syscall_chdir": ___syscall_chdir,
        "__syscall_connect": ___syscall_connect,
        "__syscall_dup": ___syscall_dup,
        "__syscall_dup3": ___syscall_dup3,
        "__syscall_faccessat": ___syscall_faccessat,
        "__syscall_fcntl64": ___syscall_fcntl64,
        "__syscall_fstat64": ___syscall_fstat64,
        "__syscall_getcwd": ___syscall_getcwd,
        "__syscall_getdents64": ___syscall_getdents64,
        "__syscall_getsockname": ___syscall_getsockname,
        "__syscall_getsockopt": ___syscall_getsockopt,
        "__syscall_ioctl": ___syscall_ioctl,
        "__syscall_listen": ___syscall_listen,
        "__syscall_lstat64": ___syscall_lstat64,
        "__syscall_mkdir": ___syscall_mkdir,
        "__syscall_mknod": ___syscall_mknod,
        "__syscall_newfstatat": ___syscall_newfstatat,
        "__syscall_openat": ___syscall_openat,
        "__syscall_pipe": ___syscall_pipe,
        "__syscall_readlinkat": ___syscall_readlinkat,
        "__syscall_recvfrom": ___syscall_recvfrom,
        "__syscall_renameat": ___syscall_renameat,
        "__syscall_rmdir": ___syscall_rmdir,
        "__syscall_sendto": ___syscall_sendto,
        "__syscall_socket": ___syscall_socket,
        "__syscall_stat64": ___syscall_stat64,
        "__syscall_symlink": ___syscall_symlink,
        "__syscall_unlinkat": ___syscall_unlinkat,
        "__syscall_utimensat": ___syscall_utimensat,
        "__table_base": ___table_base,
        "_dlopen_js": __dlopen_js,
        "_dlsym_js": __dlsym_js,
        "_emscripten_date_now": __emscripten_date_now,
        "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
        "_emscripten_throw_longjmp": __emscripten_throw_longjmp,
        "_gmtime_js": __gmtime_js,
        "_localtime_js": __localtime_js,
        "_mktime_js": __mktime_js,
        "_timegm_js": __timegm_js,
        "_tzset_js": __tzset_js,
        "abort": _abort,
        "emscripten_console_error": _emscripten_console_error,
        "emscripten_get_heap_max": _emscripten_get_heap_max,
        "emscripten_get_now": _emscripten_get_now,
        "emscripten_memcpy_big": _emscripten_memcpy_big,
        "emscripten_resize_heap": _emscripten_resize_heap,
        "environ_get": _environ_get,
        "environ_sizes_get": _environ_sizes_get,
        "exit": _exit,
        "fd_close": _fd_close,
        "fd_fdstat_get": _fd_fdstat_get,
        "fd_read": _fd_read,
        "fd_seek": _fd_seek,
        "fd_write": _fd_write,
        "getTempRet0": _getTempRet0,
        "getaddrinfo": _getaddrinfo,
        "getnameinfo": _getnameinfo,
        "invoke_ii": invoke_ii,
        "invoke_iii": invoke_iii,
        "invoke_iiii": invoke_iiii,
        "invoke_iiiii": invoke_iiiii,
        "invoke_iiiiii": invoke_iiiiii,
        "invoke_vi": invoke_vi,
        "invoke_vii": invoke_vii,
        "invoke_viii": invoke_viii,
        "invoke_viiii": invoke_viiii,
        "invoke_viiiiiiiii": invoke_viiiiiiiii,
        "memory": wasmMemory,
        "proc_exit": _proc_exit,
        "pthread_setschedparam": _pthread_setschedparam,
        "sem_timedwait": _sem_timedwait,
        "setTempRet0": _setTempRet0,
        "system": _system,
        "_dlinit": __dlinit,
        "__syscall_mkdirat": ___syscall_mkdirat,

      };

      var asmLibraryArg = Object.assign({},
        coreLibraryArg,
        SDL_MODULE(wasmMemory.buffer, Module, abort, createExportWrapper, stringToUTF8, UTF8ToString, allocateUTF8, getWasmTableEntry),
        FETCH_MODULE(wasmMemory.buffer, Module, abort, createExportWrapper, stringToUTF8, UTF8ToString)
      );

      var asm = createWasm();
      /** @type {function(...*):?} */
      var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

      /** @type {function(...*):?} */
      var _constructor = Module["_constructor"] = createExportWrapper("constructor");

      /** @type {function(...*):?} */
      var _malloc = Module["_malloc"] = createExportWrapper("malloc");

      /** @type {function(...*):?} */
      var _set = Module["_set"] = createExportWrapper("set");

      /** @type {function(...*):?} */
      var _get = Module["_get"] = createExportWrapper("get");

      /** @type {function(...*):?} */
      var _destructor = Module["_destructor"] = createExportWrapper("destructor");

      /** @type {function(...*):?} */
      var _fprintf = Module["_fprintf"] = createExportWrapper("fprintf");

      /** @type {function(...*):?} */
      var _strcmp = Module["_strcmp"] = createExportWrapper("strcmp");

      /** @type {function(...*):?} */
      var _gf_fileio_set_stats_u32 = Module["_gf_fileio_set_stats_u32"] = createExportWrapper("gf_fileio_set_stats_u32");

      /** @type {function(...*):?} */
      var _free = Module["_free"] = createExportWrapper("free");

      /** @type {function(...*):?} */
      var _realloc = Module["_realloc"] = createExportWrapper("realloc");

      /** @type {function(...*):?} */
      var _memcpy = Module["_memcpy"] = createExportWrapper("memcpy");

      /** @type {function(...*):?} */
      var _strlen = Module["_strlen"] = createExportWrapper("strlen");

      /** @type {function(...*):?} */
      var _memcmp = Module["_memcmp"] = createExportWrapper("memcmp");

      /** @type {function(...*):?} */
      var _memmove = Module["_memmove"] = createExportWrapper("memmove");

      /** @type {function(...*):?} */
      var _gf_fileio_new = Module["_gf_fileio_new"] = createExportWrapper("gf_fileio_new");

      /** @type {function(...*):?} */
      var _gf_fileio_url = Module["_gf_fileio_url"] = createExportWrapper("gf_fileio_url");

      /** @type {function(...*):?} */
      var _gf_fileio_get_udta = Module["_gf_fileio_get_udta"] = createExportWrapper("gf_fileio_get_udta");

      /** @type {function(...*):?} */
      var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

      /** @type {function(...*):?} */
      var _strcpy = Module["_strcpy"] = createExportWrapper("strcpy");

      /** @type {function(...*):?} */
      var _strcat = Module["_strcat"] = createExportWrapper("strcat");

      /** @type {function(...*):?} */
      var _strchr = Module["_strchr"] = createExportWrapper("strchr");

      /** @type {function(...*):?} */
      var _strncmp = Module["_strncmp"] = createExportWrapper("strncmp");

      /** @type {function(...*):?} */
      var _sprintf = Module["_sprintf"] = createExportWrapper("sprintf");

      /** @type {function(...*):?} */
      var _gf_strdup = Module["_gf_strdup"] = createExportWrapper("gf_strdup");

      /** @type {function(...*):?} */
      var _vsnprintf = Module["_vsnprintf"] = createExportWrapper("vsnprintf");

      /** @type {function(...*):?} */
      var _fwrite = Module["_fwrite"] = createExportWrapper("fwrite");

      /** @type {function(...*):?} */
      var _vfprintf = Module["_vfprintf"] = createExportWrapper("vfprintf");

      /** @type {function(...*):?} */
      var _fflush = Module["_fflush"] = createExportWrapper("fflush");

      /** @type {function(...*):?} */
      var _gf_bs_new = Module["_gf_bs_new"] = createExportWrapper("gf_bs_new");

      /** @type {function(...*):?} */
      var _gf_bs_del = Module["_gf_bs_del"] = createExportWrapper("gf_bs_del");

      /** @type {function(...*):?} */
      var _gf_bs_read_int = Module["_gf_bs_read_int"] = createExportWrapper("gf_bs_read_int");

      /** @type {function(...*):?} */
      var _gf_bs_available = Module["_gf_bs_available"] = createExportWrapper("gf_bs_available");

      /** @type {function(...*):?} */
      var _gf_bs_get_position = Module["_gf_bs_get_position"] = createExportWrapper("gf_bs_get_position");

      /** @type {function(...*):?} */
      var _strncpy = Module["_strncpy"] = createExportWrapper("strncpy");

      /** @type {function(...*):?} */
      var _calloc = Module["_calloc"] = createExportWrapper("calloc");

      /** @type {function(...*):?} */
      var _strdup = Module["_strdup"] = createExportWrapper("strdup");

      /** @type {function(...*):?} */
      var _gf_url_concatenate = Module["_gf_url_concatenate"] = createExportWrapper("gf_url_concatenate");

      /** @type {function(...*):?} */
      var _pthread_self = Module["_pthread_self"] = createExportWrapper("pthread_self");

      /** @type {function(...*):?} */
      var _pthread_mutex_init = Module["_pthread_mutex_init"] = createExportWrapper("pthread_mutex_init");

      /** @type {function(...*):?} */
      var _pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = createExportWrapper("pthread_mutex_destroy");

      /** @type {function(...*):?} */
      var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = createExportWrapper("pthread_mutex_unlock");

      /** @type {function(...*):?} */
      var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = createExportWrapper("pthread_mutex_lock");

      /** @type {function(...*):?} */
      var _getenv = Module["_getenv"] = createExportWrapper("getenv");

      /** @type {function(...*):?} */
      var _gf_filter_pck_new_alloc = Module["_gf_filter_pck_new_alloc"] = createExportWrapper("gf_filter_pck_new_alloc");

      /** @type {function(...*):?} */
      var _gf_filter_pck_new_ref = Module["_gf_filter_pck_new_ref"] = createExportWrapper("gf_filter_pck_new_ref");

      /** @type {function(...*):?} */
      var _gf_filter_pck_send = Module["_gf_filter_pck_send"] = createExportWrapper("gf_filter_pck_send");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_data = Module["_gf_filter_pck_get_data"] = createExportWrapper("gf_filter_pck_get_data");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_property = Module["_gf_filter_pck_get_property"] = createExportWrapper("gf_filter_pck_get_property");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_framing = Module["_gf_filter_pck_set_framing"] = createExportWrapper("gf_filter_pck_set_framing");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_cts = Module["_gf_filter_pck_set_cts"] = createExportWrapper("gf_filter_pck_set_cts");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_cts = Module["_gf_filter_pck_get_cts"] = createExportWrapper("gf_filter_pck_get_cts");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_timescale = Module["_gf_filter_pck_get_timescale"] = createExportWrapper("gf_filter_pck_get_timescale");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_sap = Module["_gf_filter_pck_set_sap"] = createExportWrapper("gf_filter_pck_set_sap");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_duration = Module["_gf_filter_pck_set_duration"] = createExportWrapper("gf_filter_pck_set_duration");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_duration = Module["_gf_filter_pck_get_duration"] = createExportWrapper("gf_filter_pck_get_duration");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_seek_flag = Module["_gf_filter_pck_set_seek_flag"] = createExportWrapper("gf_filter_pck_set_seek_flag");

      /** @type {function(...*):?} */
      var _gf_filter_pck_get_seek_flag = Module["_gf_filter_pck_get_seek_flag"] = createExportWrapper("gf_filter_pck_get_seek_flag");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_dependency_flags = Module["_gf_filter_pck_set_dependency_flags"] = createExportWrapper("gf_filter_pck_set_dependency_flags");

      /** @type {function(...*):?} */
      var _gf_filter_pck_set_byte_offset = Module["_gf_filter_pck_set_byte_offset"] = createExportWrapper("gf_filter_pck_set_byte_offset");

      /** @type {function(...*):?} */
      var _gf_filter_pid_get_packet = Module["_gf_filter_pid_get_packet"] = createExportWrapper("gf_filter_pid_get_packet");

      /** @type {function(...*):?} */
      var _gf_filter_pid_check_caps = Module["_gf_filter_pid_check_caps"] = createExportWrapper("gf_filter_pid_check_caps");

      /** @type {function(...*):?} */
      var _gf_filter_pid_set_property = Module["_gf_filter_pid_set_property"] = createExportWrapper("gf_filter_pid_set_property");

      /** @type {function(...*):?} */
      var _gf_filter_pid_get_property = Module["_gf_filter_pid_get_property"] = createExportWrapper("gf_filter_pid_get_property");

      /** @type {function(...*):?} */
      var _gf_filter_pid_set_framing_mode = Module["_gf_filter_pid_set_framing_mode"] = createExportWrapper("gf_filter_pid_set_framing_mode");

      /** @type {function(...*):?} */
      var _gf_filter_pid_new = Module["_gf_filter_pid_new"] = createExportWrapper("gf_filter_pid_new");

      /** @type {function(...*):?} */
      var _gf_filter_pid_copy_properties = Module["_gf_filter_pid_copy_properties"] = createExportWrapper("gf_filter_pid_copy_properties");

      /** @type {function(...*):?} */
      var _cos = Module["_cos"] = createExportWrapper("cos");

      /** @type {function(...*):?} */
      var _sin = Module["_sin"] = createExportWrapper("sin");

      /** @type {function(...*):?} */
      var _tan = Module["_tan"] = createExportWrapper("tan");

      /** @type {function(...*):?} */
      var _atan = Module["_atan"] = createExportWrapper("atan");

      /** @type {function(...*):?} */
      var _pow = Module["_pow"] = createExportWrapper("pow");

      /** @type {function(...*):?} */
      var _acos = Module["_acos"] = createExportWrapper("acos");

      /** @type {function(...*):?} */
      var _htonl = Module["_htonl"] = createExportWrapper("htonl");

      /** @type {function(...*):?} */
      var _htons = Module["_htons"] = createExportWrapper("htons");

      /** @type {function(...*):?} */
      var _ntohs = Module["_ntohs"] = createExportWrapper("ntohs");

      /** @type {function(...*):?} */
      var _asin = Module["_asin"] = createExportWrapper("asin");

      /** @type {function(...*):?} */
      var _log = Module["_log"] = createExportWrapper("log");

      /** @type {function(...*):?} */
      var _saveSetjmp = Module["_saveSetjmp"] = createExportWrapper("saveSetjmp");

      /** @type {function(...*):?} */
      var _gf_filter_get_udta = Module["_gf_filter_get_udta"] = createExportWrapper("gf_filter_get_udta");

      /** @type {function(...*):?} */
      var _gf_filter_set_name = Module["_gf_filter_set_name"] = createExportWrapper("gf_filter_set_name");

      /** @type {function(...*):?} */
      var _fabs = Module["_fabs"] = createExportWrapper("fabs");

      /** @type {function(...*):?} */
      var _exp = Module["_exp"] = createExportWrapper("exp");

      /** @type {function(...*):?} */
      var _cosh = Module["_cosh"] = createExportWrapper("cosh");

      /** @type {function(...*):?} */
      var _sinh = Module["_sinh"] = createExportWrapper("sinh");

      /** @type {function(...*):?} */
      var _tanh = Module["_tanh"] = createExportWrapper("tanh");

      /** @type {function(...*):?} */
      var _memset = Module["_memset"] = createExportWrapper("memset");

      /** @type {function(...*):?} */
      var _siprintf = Module["_siprintf"] = createExportWrapper("siprintf");

      /** @type {function(...*):?} */
      var _frexp = Module["_frexp"] = createExportWrapper("frexp");

      /** @type {function(...*):?} */
      var ___stdio_exit = Module["___stdio_exit"] = createExportWrapper("__stdio_exit");

      /** @type {function(...*):?} */
      var _bsearch = Module["_bsearch"] = createExportWrapper("bsearch");

      /** @type {function(...*):?} */
      var ___dl_seterr = Module["___dl_seterr"] = createExportWrapper("__dl_seterr");

      /** @type {function(...*):?} */
      var _ldexp = Module["_ldexp"] = createExportWrapper("ldexp");

      /** @type {function(...*):?} */
      var _llrint = Module["_llrint"] = createExportWrapper("llrint");

      /** @type {function(...*):?} */
      var _memalign = Module["_memalign"] = createExportWrapper("memalign");

      /** @type {function(...*):?} */
      var _posix_memalign = Module["_posix_memalign"] = createExportWrapper("posix_memalign");

      /** @type {function(...*):?} */
      var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

      /** @type {function(...*):?} */
      var _emscripten_stack_set_limits = Module["_emscripten_stack_set_limits"] = function () {
        return (_emscripten_stack_set_limits = Module["_emscripten_stack_set_limits"] = Module["asm"]["emscripten_stack_set_limits"]).apply(null, arguments);
      };

      /** @type {function(...*):?} */
      var _emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = function () {
        return (_emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
      };

      /** @type {function(...*):?} */
      var _emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = function () {
        return (_emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
      };

      /** @type {function(...*):?} */
      var _emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = function () {
        return (_emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
      };

      /** @type {function(...*):?} */
      var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

      /** @type {function(...*):?} */
      var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

      /** @type {function(...*):?} */
      var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

      /** @type {function(...*):?} */
      var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");

      /** @type {function(...*):?} */
      var dynCall_iiji = Module["dynCall_iiji"] = createExportWrapper("dynCall_iiji");

      /** @type {function(...*):?} */
      var dynCall_vijj = Module["dynCall_vijj"] = createExportWrapper("dynCall_vijj");

      /** @type {function(...*):?} */
      var dynCall_iiiiji = Module["dynCall_iiiiji"] = createExportWrapper("dynCall_iiiiji");

      /** @type {function(...*):?} */
      var dynCall_vij = Module["dynCall_vij"] = createExportWrapper("dynCall_vij");

      /** @type {function(...*):?} */
      var dynCall_viji = Module["dynCall_viji"] = createExportWrapper("dynCall_viji");

      /** @type {function(...*):?} */
      var dynCall_jijii = Module["dynCall_jijii"] = createExportWrapper("dynCall_jijii");

      /** @type {function(...*):?} */
      var dynCall_jijji = Module["dynCall_jijji"] = createExportWrapper("dynCall_jijji");

      /** @type {function(...*):?} */
      var dynCall_jijij = Module["dynCall_jijij"] = createExportWrapper("dynCall_jijij");

      /** @type {function(...*):?} */
      var dynCall_iijijji = Module["dynCall_iijijji"] = createExportWrapper("dynCall_iijijji");

      /** @type {function(...*):?} */
      var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

      /** @type {function(...*):?} */
      var dynCall_jiiii = Module["dynCall_jiiii"] = createExportWrapper("dynCall_jiiii");

      /** @type {function(...*):?} */
      var dynCall_iiiijjjii = Module["dynCall_iiiijjjii"] = createExportWrapper("dynCall_iiiijjjii");

      /** @type {function(...*):?} */
      var dynCall_jii = Module["dynCall_jii"] = createExportWrapper("dynCall_jii");

      /** @type {function(...*):?} */
      var dynCall_iiijji = Module["dynCall_iiijji"] = createExportWrapper("dynCall_iiijji");

      /** @type {function(...*):?} */
      var dynCall_viiijiii = Module["dynCall_viiijiii"] = createExportWrapper("dynCall_viiijiii");

      /** @type {function(...*):?} */
      var dynCall_jijjiii = Module["dynCall_jijjiii"] = createExportWrapper("dynCall_jijjiii");

      /** @type {function(...*):?} */
      var dynCall_jijiii = Module["dynCall_jijiii"] = createExportWrapper("dynCall_jijiii");

      /** @type {function(...*):?} */
      var dynCall_jijiiiii = Module["dynCall_jijiiiii"] = createExportWrapper("dynCall_jijiiiii");

      /** @type {function(...*):?} */
      var dynCall_jijj = Module["dynCall_jijj"] = createExportWrapper("dynCall_jijj");

      /** @type {function(...*):?} */
      var dynCall_jiii = Module["dynCall_jiii"] = createExportWrapper("dynCall_jiii");

      /** @type {function(...*):?} */
      var dynCall_jijiiii = Module["dynCall_jijiiii"] = createExportWrapper("dynCall_jijiiii");

      /** @type {function(...*):?} */
      var dynCall_iijijjji = Module["dynCall_iijijjji"] = createExportWrapper("dynCall_iijijjji");

      /** @type {function(...*):?} */
      var dynCall_iiiji = Module["dynCall_iiiji"] = createExportWrapper("dynCall_iiiji");

      /** @type {function(...*):?} */
      var dynCall_iiiij = Module["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");

      /** @type {function(...*):?} */
      var dynCall_jij = Module["dynCall_jij"] = createExportWrapper("dynCall_jij");

      /** @type {function(...*):?} */
      var dynCall_vijjii = Module["dynCall_vijjii"] = createExportWrapper("dynCall_vijjii");

      /** @type {function(...*):?} */
      var _orig$gf_bs_new = Module["_orig$gf_bs_new"] = createExportWrapper("orig$gf_bs_new");

      /** @type {function(...*):?} */
      var _orig$gf_bs_available = Module["_orig$gf_bs_available"] = createExportWrapper("orig$gf_bs_available");

      /** @type {function(...*):?} */
      var _orig$gf_bs_get_position = Module["_orig$gf_bs_get_position"] = createExportWrapper("orig$gf_bs_get_position");

      /** @type {function(...*):?} */
      var _orig$gf_filter_pck_set_cts = Module["_orig$gf_filter_pck_set_cts"] = createExportWrapper("orig$gf_filter_pck_set_cts");

      /** @type {function(...*):?} */
      var _orig$gf_filter_pck_get_cts = Module["_orig$gf_filter_pck_get_cts"] = createExportWrapper("orig$gf_filter_pck_get_cts");

      /** @type {function(...*):?} */
      var _orig$gf_filter_pck_set_byte_offset = Module["_orig$gf_filter_pck_set_byte_offset"] = createExportWrapper("orig$gf_filter_pck_set_byte_offset");

      /** @type {function(...*):?} */
      var _orig$llrint = Module["_orig$llrint"] = createExportWrapper("orig$llrint");


      function invoke_ii(index, a1) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_iii(index, a1, a2) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_viii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_vi(index, a1) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_iiii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_vii(index, a1, a2) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_iiiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_viiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3, a4);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }

      function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }




      // === Auto-generated postamble setup entry stuff ===

      unexportedRuntimeFunction('intArrayFromString', false);
      unexportedRuntimeFunction('intArrayToString', false);
      unexportedRuntimeFunction('ccall', false);
      unexportedRuntimeFunction('cwrap', false);
      unexportedRuntimeFunction('setValue', false);
      unexportedRuntimeFunction('getValue', false);
      Module["allocate"] = allocate;
      unexportedRuntimeFunction('UTF8ArrayToString', false);
      Module["UTF8ToString"] = UTF8ToString;
      unexportedRuntimeFunction('stringToUTF8Array', false);
      Module["stringToUTF8"] = stringToUTF8;
      unexportedRuntimeFunction('lengthBytesUTF8', false);
      unexportedRuntimeFunction('stackTrace', false);
      unexportedRuntimeFunction('addOnPreRun', false);
      unexportedRuntimeFunction('addOnInit', false);
      unexportedRuntimeFunction('addOnPreMain', false);
      unexportedRuntimeFunction('addOnExit', false);
      unexportedRuntimeFunction('addOnPostRun', false);
      unexportedRuntimeFunction('writeStringToMemory', false);
      unexportedRuntimeFunction('writeArrayToMemory', false);
      unexportedRuntimeFunction('writeAsciiToMemory', false);
      unexportedRuntimeFunction('addRunDependency', true);
      unexportedRuntimeFunction('removeRunDependency', true);
      unexportedRuntimeFunction('FS_createFolder', false);
      unexportedRuntimeFunction('FS_createPath', true);
      unexportedRuntimeFunction('FS_createDataFile', true);
      unexportedRuntimeFunction('FS_createPreloadedFile', true);
      unexportedRuntimeFunction('FS_createLazyFile', true);
      unexportedRuntimeFunction('FS_createLink', false);
      unexportedRuntimeFunction('FS_createDevice', true);
      unexportedRuntimeFunction('FS_unlink', true);
      unexportedRuntimeFunction('getLEB', false);
      unexportedRuntimeFunction('getFunctionTables', false);
      unexportedRuntimeFunction('alignFunctionTables', false);
      unexportedRuntimeFunction('registerFunctions', false);
      unexportedRuntimeFunction('addFunction', false);
      unexportedRuntimeFunction('removeFunction', false);
      unexportedRuntimeFunction('getFuncWrapper', false);
      unexportedRuntimeFunction('prettyPrint', false);
      unexportedRuntimeFunction('dynCall', false);
      unexportedRuntimeFunction('getCompilerSetting', false);
      unexportedRuntimeFunction('print', false);
      unexportedRuntimeFunction('printErr', false);
      unexportedRuntimeFunction('getTempRet0', false);
      unexportedRuntimeFunction('setTempRet0', false);
      unexportedRuntimeFunction('callMain', false);
      unexportedRuntimeFunction('abort', false);
      unexportedRuntimeFunction('keepRuntimeAlive', false);
      unexportedRuntimeFunction('zeroMemory', false);
      unexportedRuntimeFunction('stringToNewUTF8', false);
      unexportedRuntimeFunction('abortOnCannotGrowMemory', false);
      unexportedRuntimeFunction('emscripten_realloc_buffer', false);
      unexportedRuntimeFunction('ENV', false);
      unexportedRuntimeFunction('ERRNO_CODES', false);
      unexportedRuntimeFunction('ERRNO_MESSAGES', false);
      unexportedRuntimeFunction('setErrNo', false);
      unexportedRuntimeFunction('inetPton4', false);
      unexportedRuntimeFunction('inetNtop4', false);
      unexportedRuntimeFunction('inetPton6', false);
      unexportedRuntimeFunction('inetNtop6', false);
      unexportedRuntimeFunction('readSockaddr', false);
      unexportedRuntimeFunction('writeSockaddr', false);
      unexportedRuntimeFunction('DNS', false);
      unexportedRuntimeFunction('getHostByName', false);
      unexportedRuntimeFunction('Protocols', false);
      unexportedRuntimeFunction('Sockets', false);
      unexportedRuntimeFunction('getRandomDevice', false);
      unexportedRuntimeFunction('traverseStack', false);
      unexportedRuntimeFunction('UNWIND_CACHE', false);
      unexportedRuntimeFunction('convertPCtoSourceLocation', false);
      unexportedRuntimeFunction('readAsmConstArgsArray', false);
      unexportedRuntimeFunction('readAsmConstArgs', false);
      unexportedRuntimeFunction('mainThreadEM_ASM', false);
      unexportedRuntimeFunction('jstoi_q', false);
      unexportedRuntimeFunction('jstoi_s', false);
      unexportedRuntimeFunction('getExecutableName', false);
      unexportedRuntimeFunction('listenOnce', false);
      unexportedRuntimeFunction('autoResumeAudioContext', false);
      unexportedRuntimeFunction('dynCallLegacy', false);
      unexportedRuntimeFunction('getDynCaller', false);
      unexportedRuntimeFunction('dynCall', false);
      unexportedRuntimeFunction('handleException', false);
      unexportedRuntimeFunction('runtimeKeepalivePush', false);
      unexportedRuntimeFunction('runtimeKeepalivePop', false);
      unexportedRuntimeFunction('callUserCallback', false);
      unexportedRuntimeFunction('maybeExit', false);
      unexportedRuntimeFunction('safeSetTimeout', false);
      unexportedRuntimeFunction('asmjsMangle', false);
      unexportedRuntimeFunction('asyncLoad', false);
      unexportedRuntimeFunction('alignMemory', false);
      unexportedRuntimeFunction('mmapAlloc', false);
      unexportedRuntimeFunction('reallyNegative', false);
      unexportedRuntimeFunction('unSign', false);
      unexportedRuntimeFunction('reSign', false);
      unexportedRuntimeFunction('formatString', false);
      unexportedRuntimeFunction('PATH', false);
      unexportedRuntimeFunction('PATH_FS', false);
      unexportedRuntimeFunction('SYSCALLS', false);
      unexportedRuntimeFunction('getSocketFromFD', false);
      unexportedRuntimeFunction('getSocketAddress', false);
      unexportedRuntimeFunction('JSEvents', false);
      unexportedRuntimeFunction('registerKeyEventCallback', false);
      unexportedRuntimeFunction('specialHTMLTargets', false);
      unexportedRuntimeFunction('maybeCStringToJsString', false);
      unexportedRuntimeFunction('findEventTarget', false);
      unexportedRuntimeFunction('findCanvasEventTarget', false);
      unexportedRuntimeFunction('getBoundingClientRect', false);
      unexportedRuntimeFunction('fillMouseEventData', false);
      unexportedRuntimeFunction('registerMouseEventCallback', false);
      unexportedRuntimeFunction('registerWheelEventCallback', false);
      unexportedRuntimeFunction('registerUiEventCallback', false);
      unexportedRuntimeFunction('registerFocusEventCallback', false);
      unexportedRuntimeFunction('fillDeviceOrientationEventData', false);
      unexportedRuntimeFunction('registerDeviceOrientationEventCallback', false);
      unexportedRuntimeFunction('fillDeviceMotionEventData', false);
      unexportedRuntimeFunction('registerDeviceMotionEventCallback', false);
      unexportedRuntimeFunction('screenOrientation', false);
      unexportedRuntimeFunction('fillOrientationChangeEventData', false);
      unexportedRuntimeFunction('registerOrientationChangeEventCallback', false);
      unexportedRuntimeFunction('fillFullscreenChangeEventData', false);
      unexportedRuntimeFunction('registerFullscreenChangeEventCallback', false);
      unexportedRuntimeFunction('registerRestoreOldStyle', false);
      unexportedRuntimeFunction('hideEverythingExceptGivenElement', false);
      unexportedRuntimeFunction('restoreHiddenElements', false);
      unexportedRuntimeFunction('setLetterbox', false);
      unexportedRuntimeFunction('currentFullscreenStrategy', false);
      unexportedRuntimeFunction('restoreOldWindowedStyle', false);
      unexportedRuntimeFunction('softFullscreenResizeWebGLRenderTarget', false);
      unexportedRuntimeFunction('doRequestFullscreen', false);
      unexportedRuntimeFunction('fillPointerlockChangeEventData', false);
      unexportedRuntimeFunction('registerPointerlockChangeEventCallback', false);
      unexportedRuntimeFunction('registerPointerlockErrorEventCallback', false);
      unexportedRuntimeFunction('requestPointerLock', false);
      unexportedRuntimeFunction('fillVisibilityChangeEventData', false);
      unexportedRuntimeFunction('registerVisibilityChangeEventCallback', false);
      unexportedRuntimeFunction('registerTouchEventCallback', false);
      unexportedRuntimeFunction('fillGamepadEventData', false);
      unexportedRuntimeFunction('registerGamepadEventCallback', false);
      unexportedRuntimeFunction('registerBeforeUnloadEventCallback', false);
      unexportedRuntimeFunction('fillBatteryEventData', false);
      unexportedRuntimeFunction('battery', false);
      unexportedRuntimeFunction('registerBatteryEventCallback', false);
      unexportedRuntimeFunction('setCanvasElementSize', false);
      unexportedRuntimeFunction('getCanvasElementSize', false);
      unexportedRuntimeFunction('demangle', false);
      unexportedRuntimeFunction('demangleAll', false);
      unexportedRuntimeFunction('jsStackTrace', false);
      unexportedRuntimeFunction('stackTrace', false);
      unexportedRuntimeFunction('getEnvStrings', false);
      unexportedRuntimeFunction('checkWasiClock', false);
      unexportedRuntimeFunction('writeI53ToI64', false);
      unexportedRuntimeFunction('writeI53ToI64Clamped', false);
      unexportedRuntimeFunction('writeI53ToI64Signaling', false);
      unexportedRuntimeFunction('writeI53ToU64Clamped', false);
      unexportedRuntimeFunction('writeI53ToU64Signaling', false);
      unexportedRuntimeFunction('readI53FromI64', false);
      unexportedRuntimeFunction('readI53FromU64', false);
      unexportedRuntimeFunction('convertI32PairToI53', false);
      unexportedRuntimeFunction('convertU32PairToI53', false);
      unexportedRuntimeFunction('GOT', false);
      unexportedRuntimeFunction('LDSO', false);
      unexportedRuntimeFunction('getMemory', false);
      unexportedRuntimeFunction('mergeLibSymbols', false);
      unexportedRuntimeFunction('loadWebAssemblyModule', false);
      unexportedRuntimeFunction('loadDynamicLibrary', false);
      unexportedRuntimeFunction('dlopenInternal', false);
      unexportedRuntimeFunction('setImmediateWrapped', false);
      unexportedRuntimeFunction('clearImmediateWrapped', false);
      unexportedRuntimeFunction('polyfillSetImmediate', false);
      unexportedRuntimeFunction('uncaughtExceptionCount', false);
      unexportedRuntimeFunction('exceptionLast', false);
      unexportedRuntimeFunction('exceptionCaught', false);
      unexportedRuntimeFunction('ExceptionInfo', false);
      unexportedRuntimeFunction('CatchInfo', false);
      unexportedRuntimeFunction('exception_addRef', false);
      unexportedRuntimeFunction('exception_decRef', false);
      unexportedRuntimeFunction('Browser', false);
      unexportedRuntimeFunction('funcWrappers', false);
      unexportedRuntimeFunction('getFuncWrapper', false);
      unexportedRuntimeFunction('setMainLoop', false);
      unexportedRuntimeFunction('wget', false);
      unexportedRuntimeFunction('FS', false);
      unexportedRuntimeFunction('MEMFS', false);
      unexportedRuntimeFunction('TTY', false);
      unexportedRuntimeFunction('PIPEFS', false);
      unexportedRuntimeFunction('SOCKFS', false);
      unexportedRuntimeFunction('_setNetworkCallback', false);
      unexportedRuntimeFunction('tempFixedLengthArray', false);
      unexportedRuntimeFunction('miniTempWebGLFloatBuffers', false);
      unexportedRuntimeFunction('heapObjectForWebGLType', false);
      unexportedRuntimeFunction('heapAccessShiftForWebGLHeap', false);
      unexportedRuntimeFunction('GL', false);
      unexportedRuntimeFunction('emscriptenWebGLGet', false);
      unexportedRuntimeFunction('computeUnpackAlignedImageSize', false);
      unexportedRuntimeFunction('emscriptenWebGLGetTexPixelData', false);
      unexportedRuntimeFunction('emscriptenWebGLGetUniform', false);
      unexportedRuntimeFunction('webglGetUniformLocation', false);
      unexportedRuntimeFunction('webglPrepareUniformLocationsBeforeFirstUse', false);
      unexportedRuntimeFunction('webglGetLeftBracePos', false);
      unexportedRuntimeFunction('emscriptenWebGLGetVertexAttrib', false);
      unexportedRuntimeFunction('writeGLArray', false);
      unexportedRuntimeFunction('AL', false);
      unexportedRuntimeFunction('SDL_unicode', false);
      unexportedRuntimeFunction('SDL_ttfContext', false);
      unexportedRuntimeFunction('SDL_audio', false);
      unexportedRuntimeFunction('SDL', false);
      unexportedRuntimeFunction('SDL_gfx', false);
      unexportedRuntimeFunction('GLUT', false);
      unexportedRuntimeFunction('EGL', false);
      unexportedRuntimeFunction('GLFW_Window', false);
      unexportedRuntimeFunction('GLFW', false);
      unexportedRuntimeFunction('GLEW', false);
      unexportedRuntimeFunction('IDBStore', false);
      unexportedRuntimeFunction('runAndAbortIfError', false);
      unexportedRuntimeFunction('warnOnce', false);
      unexportedRuntimeFunction('stackSave', false);
      unexportedRuntimeFunction('stackRestore', false);
      unexportedRuntimeFunction('stackAlloc', false);
      unexportedRuntimeFunction('AsciiToString', false);
      unexportedRuntimeFunction('stringToAscii', false);
      unexportedRuntimeFunction('UTF16ToString', false);
      unexportedRuntimeFunction('stringToUTF16', false);
      unexportedRuntimeFunction('lengthBytesUTF16', false);
      unexportedRuntimeFunction('UTF32ToString', false);
      unexportedRuntimeFunction('stringToUTF32', false);
      unexportedRuntimeFunction('lengthBytesUTF32', false);
      unexportedRuntimeFunction('allocateUTF8', false);
      unexportedRuntimeFunction('allocateUTF8OnStack', false);
      Module["writeStackCookie"] = writeStackCookie;
      Module["checkStackCookie"] = checkStackCookie;
      unexportedRuntimeSymbol('ALLOC_NORMAL', false);
      unexportedRuntimeSymbol('ALLOC_STACK', false);

      var calledRun;

      /**
       * @constructor
       * @this {ExitStatus}
       */
      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
      }

      var calledMain = false;

      dependenciesFulfilled = function runCaller() {
        // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
      };

      function callMain(args) {
        assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
        assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

        var entryFunction = Module['_main'];

        // Main modules can't tell if they have main() at compile time, since it may
        // arrive from a dynamic library.
        if (!entryFunction) return;

        args = args || [];

        var argc = args.length + 1;
        var argv = stackAlloc((argc + 1) * 4);
        HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
        for (var i = 1; i < argc; i++) {
          HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
        }
        HEAP32[(argv >> 2) + argc] = 0;

        try {

          var ret = entryFunction(argc, argv);

          // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as
          // execution is asynchronously handed off to a pthread.
          // if we're not running an evented main loop, it's time to exit
          exit(ret, /* implicit = */ true);
          return ret;
        }
        catch (e) {
          return handleException(e);
        } finally {
          calledMain = true;

        }
      }

      function stackCheckInit() {
        // This is normally called automatically during __wasm_call_ctors but need to
        // get these values before even running any of the ctors so we call it redundantly
        // here.
        // TODO(sbc): Move writeStackCookie to native to to avoid this.
        _emscripten_stack_set_limits(6284784, 1041904);
        writeStackCookie();
      }

      var dylibsLoaded = false;

      /** @type {function(Array=)} */
      function run(args) {
        args = args || arguments_;

        if (runDependencies > 0) {
          return;
        }

        stackCheckInit();

        if (!dylibsLoaded) {
          // Loading of dynamic libraries needs to happen on each thread, so we can't
          // use the normal __ATPRERUN__ mechanism.
          preloadDylibs();
          dylibsLoaded = true;

          // Loading dylibs can add run dependencies.
          if (runDependencies > 0) {
            return;
          }
        }

        preRun();

        // a preRun added a dependency, run will be called later
        if (runDependencies > 0) {
          return;
        }

        function doRun() {
          // run may have just been called through dependencies being fulfilled just in this very frame,
          // or while the async setStatus time below was happening
          if (calledRun) return;
          calledRun = true;
          Module['calledRun'] = true;

          if (ABORT) return;

          initRuntime();

          preMain();

          readyPromiseResolve(Module);
          if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

          if (shouldRunNow) callMain(args);

          postRun();
        }

        if (Module['setStatus']) {
          Module['setStatus']('Running...');
          setTimeout(function () {
            setTimeout(function () {
              Module['setStatus']('');
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
        checkStackCookie();
      }
      Module['run'] = run;

      function checkUnflushedContent() {
        // Compiler settings do not allow exiting the runtime, so flushing
        // the streams is not possible. but in ASSERTIONS mode we check
        // if there was something to flush, and if so tell the user they
        // should request that the runtime be exitable.
        // Normally we would not even include flush() at all, but in ASSERTIONS
        // builds we do so just for this check, and here we see if there is any
        // content to flush, that is, we check if there would have been
        // something a non-ASSERTIONS build would have not seen.
        // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
        // mode (which has its own special function for this; otherwise, all
        // the code is inside libc)
        var oldOut = out;
        var oldErr = err;
        var has = false;
        out = err = (x) => {
          has = true;
        }
        try { // it doesn't matter if it fails
          ___stdio_exit();
          // also flush in the JS FS layer
          ['stdout', 'stderr'].forEach(function (name) {
            var info = FS.analyzePath('/dev/' + name);
            if (!info) return;
            var stream = info.object;
            var rdev = stream.rdev;
            var tty = TTY.ttys[rdev];
            if (tty && tty.output && tty.output.length) {
              has = true;
            }
          });
        } catch (e) { }
        out = oldOut;
        err = oldErr;
        if (has) {
          warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
        }
      }

      /** @param {boolean|number=} implicit */
      function exit(status, implicit) {
        EXITSTATUS = status;

        checkUnflushedContent();

        // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
        if (keepRuntimeAlive() && !implicit) {
          var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
          readyPromiseReject(msg);
          err(msg);
        }

        procExit(status);
      }

      function procExit(code) {
        EXITSTATUS = code;
        if (!keepRuntimeAlive()) {
          if (Module['onExit']) Module['onExit'](code);
          ABORT = true;
        }
        quit_(code, new ExitStatus(code));
      }

      if (Module['preInit']) {
        if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
        while (Module['preInit'].length > 0) {
          Module['preInit'].pop()();
        }
      }

      // shouldRunNow refers to calling main(), not run().
      var shouldRunNow = true;

      if (Module['noInitialRun']) shouldRunNow = false;

      run();







      return Module.ready
    }
  );
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function () { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;

const location = {};
const memio = [];
export { Module, location, memio };