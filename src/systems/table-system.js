import { createNetworkedEntity } from "../utils/create-networked-entity";

export class TableSystem {
    constructor(scene) {
        this.scene = scene;

        this.scene.addEventListener("spawn-table-object", this.onSpawnObject);
    }

    onSpawnObject = event => {
        const avatarPov = document.querySelector("#avatar-pov-node").object3D;
        const eid = createNetworkedEntity(APP.world, "cube");
        const obj = APP.world.eid2obj.get(eid);
        obj.position.copy(avatarPov.localToWorld(new THREE.Vector3(0, 0, -2.5)));
        obj.lookAt(avatarPov.getWorldPosition(new THREE.Vector3()));
    };
}