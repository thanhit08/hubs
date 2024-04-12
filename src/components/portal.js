AFRAME.registerComponent('portal', {
    schema: {
        height: { type: 'number', default: 3.2 },
        depth: { type: 'number', default: 2 },
        width: { type: 'number', default: 2.0 },
        cameraColor: { default: "red" },
        portalFaceColor: { default: "blue" },
        portalFrameColor: { default: "yello" },
        destinationPortalId: { type: 'string' },
        portalId: { type: 'string' }
    },
    createPortalElements: function () {
        //This function creates a frame for the portal (sort of like a door frame). 
        // The actual portal is a plane mesh which acts as a render target for a portalPlayerCamera assigned to each portal. 
        // The portal face is used to set a location relative to the portal where a user should teleport. 
        // If we just teleport to the location of the portal we'll be stuck in an infinite loop of teleportations due to the way that the colliders for the portal and player are set up.
        // Sadly, that would have been the ideal way of setting up the portal. It would have given me the feeling of actually having a non-euclidean space.
        // In hindsight I should have only enabled teleportation if the player is looking at the portal or approaching it from the front. 
        console.log("Creating Portal Elements");
        var targetPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(this.data.width - 0.1, this.data.height - 0.1),
            new THREE.MeshBasicMaterial({ color: this.data.portalFaceColo, side: THREE.DoubleSide, transparent: true, opacity: 0.5})
        );
        targetPlane.position.set(0, 0, 0);
        targetPlane.name = this.el.id + "-" + "face";
        this.el.object3D.add(targetPlane);
    },
    init: function () {
        this.createPortalElements();
    },
    tick: function () {
    }
});


function setLayers() {
    var layer = 3; //This could be any integer between 2 and 31. Anything that wont mess with the left eye, right eye layer settings for a VR camera.
    // Make the objects in layer visible to the player's camera
    $("#player")[0].object3D.traverse(function (obj) { if (obj.type == "PerspectiveCamera") { obj.layers.enable(layer) } });
    // Make the portal invisible to the portal's rendering cameras by placing them in layer 3. The rendering cameras with id (portal#-player-camera) can't see objects in layer 3, only the player camera can.
    // By doing this we can avoid having to see the back of the destination portal in the source portal view. But we wont be able to see trippy visuals like infinite mirror reflections.
    $("[portal]").toArray().forEach(portalFrame => portalFrame.object3D.traverse(function (obj) { if (obj.type == "Mesh") { obj.layers.set(layer) } }));
    // Enable all layers for the lighting so that they also affect the portal elements in layer 3. This makes the portals lit up in whatever layer the player camera is in.
    document.getElementById("home").querySelectorAll("a-entity[light]").forEach(light => light.object3D.children[0].layers.enableAll());
}

function setCollisionEvents() {
    //Function to "teleport the user to the destination portal while orienting the user to whatever view they had on the source portal. 
    //If you were looking at an object on the soucre portal, you should be looking at the object when you pass through the portal (or atleast the same direction)"
    var playerEl = document.getElementById('player-body');
    playerEl.setAttribute("aabb-collider", "objects: .portal-frame");
    document.querySelectorAll("[aabb-collider]").forEach(function (entity) {
        entity.addEventListener("hitstart", function (event) {
        });
    });
}

window.onload = function () {
    setCollisionEvents();
}



