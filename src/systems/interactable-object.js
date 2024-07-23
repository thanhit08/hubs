import { COLLISION_LAYERS } from "../constants";
import { TYPE } from "three-ammo/constants";

export class InteractableObjectSystem {
    constructor(scene) {
        this.scene = scene;

        this.scene.addEventListener("spawn-interactable-object", this.onSpawnObject);
    }

    onSpawnObject = event => {
        // console.log(event.detail);
        const entity = document.createElement("a-entity");
        entity.setAttribute("offset-relative-to", { target: "#avatar-pov-node", offset: { x: 0, y: 0, z: -1.5 } });
        entity.setAttribute("networked", { template: "#interactable-object" });
        this.scene.appendChild(entity);
    };
}