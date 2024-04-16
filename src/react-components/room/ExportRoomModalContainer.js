import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { ExportRoomModal } from "./ExportRoomModal";

const listEntities = ['page-thumbnail', 'portal'];

export function ExportRoomModalContainer({ scene, onClose }) {
    const onSubmit = useCallback(
        (roomName, roomDescription) => {
            // console.log(src);
            if (!roomName) return;
            if (!roomDescription) return;

            // replace space with underscore in room name
            roomName = roomName.replace(/\s/g, "_");
            console.log(scene);
            const baseURI = scene.baseURI;
            console.log(baseURI);
            // Get path of the url 
            const sceneID = window.location.pathname.split('/')[1];            
            // list all entities "object" in the scene
            const exportObjects = [];
            var entities = scene.querySelectorAll('a-entity');
            for (var i = entities.length - 1; i >= 0; i--) {
                if (entities[i].getAttribute('class') != 'ui') {
                    exportObjects.push(entities[i]);
                } else {
                    break;
                }
            }
            console.log(exportObjects);
            const jsonObjects = [];
            for (var i = 0; i < exportObjects.length; i++) {
                var obj = {};
                obj["id"] = exportObjects[i].getAttribute('id');
                const components = exportObjects[i].components;
                const componentNames = [];
                for (var key in components) {
                    if (!listEntities.includes(key)) {
                        continue;
                    }

                    const keyDict = {};
                    keyDict["key"] = key;
                    keyDict["data"] = components[key].data;
                    componentNames.push(keyDict);
                }
                obj["components"] = componentNames;
                obj["class"] = exportObjects[i].getAttribute('class');
                obj["position"] = exportObjects[i].object3D.position;
                obj["rotation"] = exportObjects[i].object3D.rotation;
                obj["scale"] = exportObjects[i].object3D.scale;
                obj["up"] = exportObjects[i].object3D.up;
                
                jsonObjects.push(obj);
            }
            // create a json content with room name and room description
            var dict = {};
            dict["roomName"] = roomName;
            dict['sceneID'] = sceneID;
            dict["roomDescription"] = roomDescription;
            dict["objects"] = jsonObjects;
            var json = JSON.stringify(dict);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = roomName + ".json";
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);

            onClose();
        },
        [scene, onClose]
    );

    return <ExportRoomModal onSubmit={onSubmit} onClose={onClose} />;
}

ExportRoomModalContainer.propTypes = {
    scene: PropTypes.object.isRequired,
    onClose: PropTypes.func
};