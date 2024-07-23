import { getAbsoluteHref } from "../utils/media-url-utils";
import ducky from "../assets/models/DuckyMesh.glb";

AFRAME.registerComponent('interactable-object', {
    schema: {
        height: { type: 'number', default: 3.2 },
        depth: { type: 'number', default: 2 },
        width: { type: 'number', default: 2.0 },
        meshColor: { default: "red" },
    },
    createInteractableObjectElements: function () {
        console.log("Creating Interactable Object Elements");
        var body = getAbsoluteHref(location.href, ducky)
        document.querySelector("a-scene").emit("add_media", body);
    },
    init: function () {
        this.createInteractableObjectElements();
    },
    tick: function () {
    }
});