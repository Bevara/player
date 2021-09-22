
class UniversalImage extends HTMLImageElement  {
    constructor() {
        super();
    }
}

customElements.define('universal-img', UniversalImage, {extends: 'img' });