//import {UniversalCanvas} from "./UCanvas"
import {UniversalImage} from "./UImage"
import {UniversalAudio} from "./UAudio"
import {UniversalVideo} from "./UVideo"

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

if (!customElements.get('universal-audio')) {
    customElements.define('universal-audio', UniversalAudio, { extends: 'audio' });
}

if (!customElements.get('universal-video')) {
    customElements.define('universal-video', UniversalVideo, { extends: 'video' });
}