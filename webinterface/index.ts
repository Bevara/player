const version = require("../version.js").version;

import {UniversalImage} from "./UImage";

if (!customElements.get('universal-img_'+version)) {
    customElements.define('universal-img_'+version, UniversalImage, { extends: 'img' });
}

import {UniversalAudio} from "./UAudio";

if (!customElements.get('universal-audio_'+version)) {
    customElements.define('universal-audio_'+version, UniversalAudio, { extends: 'audio' });
}


import {UniversalVideo} from "./UVideo";

if (!customElements.get('universal-video_'+version)) {
    customElements.define('universal-video_'+version, UniversalVideo, { extends: 'video' });
}

import {UniversalCanvas} from "./UCanvas";

if (!customElements.get('universal-canvas_'+version)) {
    customElements.define('universal-canvas_'+version, UniversalCanvas, {extends: 'canvas' });
}