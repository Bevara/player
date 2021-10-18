import { ENVIRONMENT_IS_NODE } from "../imports"

function _emscripten_num_logical_cores()
{
    //if (ENVIRONMENT_IS_NODE) return require('os').cpus().length;
    return navigator['hardwareConcurrency'];
}
export {_emscripten_num_logical_cores}
