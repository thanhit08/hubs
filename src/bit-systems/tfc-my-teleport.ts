import { HubsWorld } from "../app";
import { defineQuery, enterQuery, exitQuery, hasComponent, Not, entityExists } from "bitecs";
import { Interacted, AvatarHeadCollider, TFCMyTeleport, Rigidbody, Object3DTag, AEntity, PhysicsShape } from "../bit-components";
import { anyEntityWith } from "../utils/bit-utils";
import { getBodyFromRigidBody } from "../inflators/rigid-body";
import { Shape, inflatePhysicsShape, Fit, getShapeFromPhysicsShape } from "../inflators/physics-shape";
import { PhysicsSystem } from "../systems/physics-system";
import { findAncestorWithComponent } from "../utils/bit-utils";
import type { EntityID } from "../utils/networking-types";

const TFCMyTeleportQuery = defineQuery([TFCMyTeleport]);
const TFCMyTeleportEnterQuery = enterQuery(TFCMyTeleportQuery);
const TFCMyTeleportExitQuery = exitQuery(TFCMyTeleportQuery);

function addPhysicsShapes(world: HubsWorld, physicsSystem: PhysicsSystem, eid: number) {
    const bodyId = PhysicsShape.bodyId[eid];
    const obj = world.eid2obj.get(eid)!;
    const shape = getShapeFromPhysicsShape(eid);
    const shapeId = physicsSystem.addShapes(bodyId, obj, shape);
    PhysicsShape.shapeId[eid] = shapeId;
}

function clicked(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

export function TFCMyTeleportSystem(world: HubsWorld, physicsSystem: PhysicsSystem) {
    const avatarHead: any = anyEntityWith(world, AvatarHeadCollider);
    const myTeleportEid: any = anyEntityWith(world, TFCMyTeleport);

    if (!hasComponent(world, Rigidbody, myTeleportEid)) return;
    const entered = TFCMyTeleportEnterQuery(world);
    for (let i = 0; i < entered.length; i++) {
        const eid = entered[i];
        const obj = world.eid2obj.get(eid);
        const body = getBodyFromRigidBody(eid);
        const bodyId = physicsSystem.addBody(obj, body);
        Rigidbody.bodyId[eid] = bodyId;
        const bodyEid = findAncestorWithComponent(world, Rigidbody, myTeleportEid);
        if (bodyEid) {
            PhysicsShape.bodyId[myTeleportEid] = Rigidbody.bodyId[bodyEid];
            addPhysicsShapes(world, physicsSystem, myTeleportEid);
            inflatePhysicsShape(world, myTeleportEid, {
                type: Shape.BOX,
                fit: Fit.MANUAL,
                halfExtents: [0.5, 0.5, 0.5],
            })
        } else {
            console.warn(`Could find a body for shape in entity ${myTeleportEid}`);
        }
    }

    const query = TFCMyTeleportQuery(world);
    for (let i = 0; i < query.length; i++) {
        const eid = query[i];
        if (clicked(world, eid)) {
            console.log("My Teleport clicked", eid);
        }

        const collisions = physicsSystem.getCollisions(Rigidbody.bodyId[avatarHead]);
        for (let i = 0; i < collisions.length; i++) {
            console.log("collisions", collisions);
            const bodyData = physicsSystem.bodyUuidToData.get(collisions[i]);
            const collidedEid = bodyData && bodyData.object3D && bodyData.object3D.eid;
            if (hasComponent(world, TFCMyTeleport, collidedEid)) {
                console.log("teleporting to room", TFCMyTeleport.roomID[collidedEid]);
            }
        }

        //isEntityColliding(world, physicsSystem, avatarHead, eid);
    }

    const exited = TFCMyTeleportExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const eid = exited[i];
        if (entityExists(world, eid) && hasComponent(world, PhysicsShape, eid)) {
            physicsSystem.removeShapes(PhysicsShape.bodyId[eid], PhysicsShape.shapeId[eid]);
        }
        physicsSystem.removeBody(Rigidbody.bodyId[eid]);
    }
}
function isEntityColliding(world: HubsWorld, physicsSystem: PhysicsSystem, eidA: number, eidB: number) {
    const collisions = physicsSystem.getCollisions(Rigidbody.bodyId[eidA]);
    for (let i = 0; i < collisions.length; i++) {
        console.log("collisions", collisions);
        const bodyData = physicsSystem.bodyUuidToData.get(collisions[i]);
        const collidedEid = bodyData && bodyData.object3D && bodyData.object3D.eid;
        if (hasComponent(world, TFCMyTeleport, collidedEid)) {
            console.log("teleporting to room", TFCMyTeleport.roomID[collidedEid]);
            return true;
        }
    }
    return false;
}