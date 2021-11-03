import {UniversalCanvas} from "./UCanvas"
import {UniversalImage} from "./UImage"

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

if (!customElements.get('universal-canvas')) {
    customElements.define('universal-canvas', UniversalCanvas, { extends: 'canvas' });
}

/*
const img = document.createElement('img', {"is" : "universal-img"});
img.setAttribute("src", "http://bevaraserver.ddns.net/test-signals/Freedom.jpg");
img.setAttribute("using", "third_parties/nanojpeg/nanojpeg.wasm");
img.setAttribute("with", "openjpeg.wasm");

setTimeout(function(){ document.body.appendChild(img);}, 3000);*/