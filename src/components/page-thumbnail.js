import { resolveUrl, createImageTexture } from "../utils/media-utils";
import { proxiedUrlFor } from "../utils/media-url-utils";
import { waitForDOMContentLoaded } from "../utils/async-utils";
import loadingObjectSrc from "../assets/models/LoadingObject_Atom.glb";
import { cloneObject3D } from "../utils/three-utils";

let loadingObject;

AFRAME.registerComponent("page-thumbnail", {
    schema: {
        src: { type: "string" }
    },

    init: function () {
        console.log("Init Page");
        this.updateThumbnail = this.updateThumbnail.bind(this);
        waitForDOMContentLoaded().then(() => {
            loadModel(loadingObjectSrc).then(gltf => {
                loadingObject = gltf;
            });
        });
    },

    update(prevData) {
        if (this.data.src !== prevData.src) {
            console.log("Update Page");
            this.updateThumbnail();
        }
    },

    updateThumbnail: async function updateThumbnail() {
        if (this.el.object3DMap.mesh) {
            this.el.removeObject3D("mesh");
        }

        const src = this.data.src;

        const result = await resolveUrl(src);
        console.log(result);

        const thumbnailUrl = result?.meta?.thumbnail;

        if (!thumbnailUrl) {
            throw Error("No thumbnail found");
        }

        const corsProxiedThumbnailUrl = proxiedUrlFor(thumbnailUrl);

        const texture = await createImageTexture(corsProxiedThumbnailUrl);

        const geometry = new THREE.PlaneBufferGeometry(1.6, 0.9, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        // rotate mesh arround x axis
        mesh.rotation.x = Math.PI;
        this.el.setObject3D("mesh", mesh);
        this.el.emit("page-thumbnail-loaded");
    }
});