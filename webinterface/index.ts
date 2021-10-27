import {UniversalCanvas} from "./UCanvas"
import {UniversalImage} from "./UImage"

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

if (!customElements.get('universal-canvas')) {
    customElements.define('universal-canvas', UniversalCanvas, { extends: 'canvas' });
}
