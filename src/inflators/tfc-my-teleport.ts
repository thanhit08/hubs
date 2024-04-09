import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCMyTeleport, CursorRaycastable, RemoteHoverTarget, SingleActionButton, Rigidbody, PhysicsShape } from "../bit-components";
import { COLLISION_LAYERS } from "../constants";
import { RIGID_BODY_FLAGS } from "./rigid-body"; // Import the missing 'FIT' enum
import { CONSTANTS } from "three-ammo";
import { inflateRigidBody, Type } from "./rigid-body";
import { inflatePhysicsShape, Shape, Fit, Axis } from "./physics-shape";
export type TFCMyTeleportParams = {
    roomID: string
};

const DEFAULTS: Required<TFCMyTeleportParams> = {
    roomID: "0",
};

export enum ActivationState {
    ACTIVE_TAG = 0,
    ISLAND_SLEEPING = 1,
    WANTS_DEACTIVATION = 2,
    DISABLE_DEACTIVATION = 3,
    DISABLE_SIMULATION = 4
}

export function inflateTFCMyTeleport(world: HubsWorld, eid: number, params: TFCMyTeleportParams) {
    console.log("inflating a MyTeleport Component ", { eid, params });
    const requiredParams = Object.assign({}, DEFAULTS, params) as Required<TFCMyTeleportParams>;
    addComponent(world, TFCMyTeleport, eid);
    TFCMyTeleport.roomID[eid] = APP.getSid(requiredParams.roomID);

    addComponent(world, Rigidbody, eid);
    Rigidbody.type[eid] = Type.STATIC;
    Rigidbody.collisionFilterGroup[eid] = COLLISION_LAYERS.TELEPORT;
    Rigidbody.collisionFilterMask[eid] = COLLISION_LAYERS.AVATAR | COLLISION_LAYERS.INTERACTABLES;
    Rigidbody.flags[eid] = RIGID_BODY_FLAGS.DISABLE_COLLISION;
    Rigidbody.mass[eid] = 0;
    Rigidbody.gravity[eid].set([0, -9.8, 0]);
    Rigidbody.linearDamping[eid] = 0.01;
    Rigidbody.angularDamping[eid] = 0.01;
    Rigidbody.linearSleepingThreshold[eid] = 1.6;
    Rigidbody.angularSleepingThreshold[eid] = 2.5;
    Rigidbody.angularFactor[eid].set([1, 1, 1]);
    Rigidbody.activationState[eid] = ActivationState.ACTIVE_TAG;

    // addComponent(world, PhysicsShape, eid);

    // PhysicsShape.type[eid] = Shape.BOX;
    // PhysicsShape.fit[eid] = Fit.MANUAL;
    // PhysicsShape.halfExtents[eid].set([1, 1, 1]);
    // PhysicsShape.minHalfExtent[eid] = 0;
    // PhysicsShape.maxHalfExtent[eid] = Number.POSITIVE_INFINITY;
    // PhysicsShape.sphereRadius[eid] = NaN;
    // PhysicsShape.cylinderAxis[eid] = Axis.Y;
    // PhysicsShape.margin[eid] =0.01;
    // PhysicsShape.offset[eid].set([0, 0, 0]);
    // PhysicsShape.heightfieldData[eid] = [];
    // PhysicsShape.heightfieldDistance[eid] = 1;
    // PhysicsShape.orientation[eid].set([0, 0, 0, 1]);

    // inflatePhysicsShape(world, eid, {
    //     type: Object.values(CONSTANTS.SHAPE).indexOf(CONSTANTS.SHAPE.BOX as CONSTANTS.SHAPE),
    //     fit: Object.values(CONSTANTS.FIT).indexOf(CONSTANTS.FIT.ALL as CONSTANTS.FIT),
    //     halfExtents: [1, 1, 1,]
    // });


    // const options = {
    //     type: SHAPE.BOX,
    //     halfExtents: { x: 0.5, y: 0.5, z: 0.02 },
    //     margin: 0.1,
    //     fit: FIT.MANUAL // Use the imported 'FIT' enum
    // }

    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
}
