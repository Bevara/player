
class UniversalImage extends HTMLImageElement {
    constructor() {
        super();

        fetch("player.wasm").then(function (response){
            console.log("test");
        })
    }
}

customElements.define('universal-img', UniversalImage, { extends: 'img' });