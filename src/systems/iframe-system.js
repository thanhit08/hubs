import { TYPE } from "three-ammo/constants";
import { COLLISION_LAYERS } from "../constants";
// import { SHAPE, TYPE } from "three-ammo/constants";
export class IframeSystem {
    constructor(scene) {
        this.scene = scene;

        this.scene.addEventListener("spawn-iframe", this.onSpawnIframe);
    }

    onSpawnIframe = event => {
        // console.log(event.detail);
        const entity = document.createElement("a-entity");        
        entity.setAttribute("page-thumbnail", { src: event.detail.src });
        entity.setAttribute("offset-relative-to", { target: "#avatar-pov-node", offset: { x: 0, y: 0, z: -1.5 } });
        entity.setAttribute("networked", { template: "#interactable-iframe-media" });
        this.scene.appendChild(entity);
      };
}