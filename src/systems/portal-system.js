
export class PortalSystem {
    constructor(scene) {
        this.scene = scene;

        this.scene.addEventListener("spawn-portal", this.onSpawnPortal);
    }

    onSpawnPortal = event => {
        // console.log(event.detail);
        const entity = document.createElement("a-entity");   
        entity.setAttribute("id", event.detail.portalId);     
        entity.setAttribute("portal", { destinationPortalId: event.detail.destinationPortalId });
        entity.setAttribute("offset-relative-to", { target: "#avatar-pov-node", offset: { x: 0, y: 0, z: -1.5 } });
        entity.setAttribute("networked", { template: "#interactable-portal" });
        this.scene.appendChild(entity);
      };
}