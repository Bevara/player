class MainModule {

    mainModule : WebAssembly.Module;

    constructor(mainModule: WebAssembly.Module) {
        this.mainModule = mainModule;
    }

    init(): Promise<WebAssembly.Instance>{
        const info = {
          
        };

        return WebAssembly.instantiate(this.mainModule, info);
    }

}


export { MainModule }