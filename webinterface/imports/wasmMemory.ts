const INITIAL_MEMORY = 16777216;

const wasmMemory = new WebAssembly.Memory({
    'initial': INITIAL_MEMORY / 65536,
    'maximum': INITIAL_MEMORY / 65536
});


export {wasmMemory}
