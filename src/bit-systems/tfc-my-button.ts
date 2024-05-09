import { HubsWorld } from "../app";
import { defineQuery, enterQuery, exitQuery, hasComponent, Not, entityExists, addComponent, addEntity } from "bitecs";
import { Interacted, TFCMyButton } from "../bit-components";
import { createUIButton } from "../tfl-libs/myButton";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { WebGLContentModalContainer } from "../react-components/room/WebGLContentModalContainer";
import UIRoot from "../react-components/ui-root";

const TFCMyButtonQuery = defineQuery([TFCMyButton]);
const TFCMyButtonEnterQuery = enterQuery(TFCMyButtonQuery);
const TFCMyButtonExitQuery = exitQuery(TFCMyButtonQuery);

const objectsInScene: THREE.Object3D[] = [];

function clicked(world: HubsWorld, entity: number) {
    return hasComponent(world, Interacted, entity);
}

export function TFCMyButtonSystem(world: HubsWorld) {
    const myButtonEid = anyEntityWith(world, TFCMyButton);
    if (myButtonEid !== null) {

        const entered = TFCMyButtonEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            const entity = entered[i];
            console.log('TFCMyButton entered', entity);
            // Get the entity's TFCMyButton component
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity]);
            console.log('TFCMyButton content', content);
            const myButton = world.eid2obj.get(entity);

            if (myButton) {
                // myButton.visible = false;
                const myButtonPosition = new THREE.Vector3();
                myButton.getWorldPosition(myButtonPosition);

                // Get the world rotation of myButton object
                const myButtonRotation = new THREE.Quaternion();
                myButton.getWorldQuaternion(myButtonRotation);

                // Get the world scale of myButton object
                const myButtonScale = new THREE.Vector3();
                myButton.getWorldScale(myButtonScale);

                const myMilling01ButtonEid = addEntity(world);
                // Change the material of the button
                const newMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.0});
                (myButton.children[0] as THREE.Mesh).material = newMaterial;

                const myMilling01Button = createUIButton({
                    width: 1.6,
                    height: 0.4,
                    backgroundColor: 'https://localhost:4000/files/75083328-5e62-4bad-b82a-eb15fea05e82.jpg',
                    textColor: '#ffffff',
                    text: "Milling 01",
                    fontSize: 16,
                    font: 'Arial',
                });

                myMilling01Button.position.copy(myButtonPosition);
                myMilling01Button.position.z += 0.01;
                // myMilling01Button.quaternion.copy(myButtonRotation);

                addObject3DComponent(world, myMilling01ButtonEid, myMilling01Button);

                world.scene.add(myMilling01Button);
                objectsInScene.push(myMilling01Button);
            }
        }
    }

    const exited = TFCMyButtonExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const entity = exited[i];
        console.log('TFCMyButton exited', entity)

        for (let j = 0; j < objectsInScene.length; j++) {
            const object = objectsInScene[j];
            console.log("Removing object from scene: " + object.name);
            world.scene.remove(object);
        }
        objectsInScene.length = 0;
    }

    const entities = TFCMyButtonQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (clicked(world, entity)) {
            const scene = AFRAME.scenes[0];
            console.log("My Button clicked", entity);
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity]);
            console.log('TFCMyButton content', content);
            // Get component UIRoot     
            scene.emit("action_toggle_wegbl");
        }
    }
}