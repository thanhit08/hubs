import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cos, rotate, round, sin } from 'mathjs';

let len = 1.0;
let out_x: number[] = [];

let out_y: number[] = [];
let out_z: number[] = [];

const numberOfVertices = 38;
for (let i = 0; i < numberOfVertices; i++) {
    out_x.push(0.0);
    out_y.push(0.0);
    out_z.push(0.0);
}

export function setLength(length: number) {
    // if length <= 0 then len = 1.0
    len = length <= 0 ? 1.0 : length;
}

function getAngle(angle: number) {
    return angle * Math.PI / 180;
    let ang = 3.14159265358979323846 * angle / 180.0;
    let pentagonAngle = 3.14159265358979323846 * 36.0 / 180.0;

}


function createPentagonGeometry(radius: number) {
    const shape = new THREE.Shape();
    const angle = Math.PI * 2 / 5;
    for (let i = 0; i < 5; i++) {
        const x = radius * Math.cos(i * angle);
        const y = radius * Math.sin(i * angle);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
}

const colors = [
    '#ff0000', // red // 00
    '#00ff00', // green // 01
    '#0000ff', // blue // 02
    '#ffff00', // yellow // 03
    '#ff00ff', // magenta // 04
    '#00ffff', // cyan // 05
    '#ffffff', // white // 06
    '#000000', // black // 07
    '#808000', // olive // 08
    '#810f50', // lime // 09
    '#0080ff', // navy // 10
    '#ff8080', // pink // 11
    '#ff80ff', // purple // 12
    '#80b3ff', // light blue // 13
];
const material = new THREE.MeshBasicMaterial({ color: colors[0], side: THREE.DoubleSide });
// the angle of rotation of the pentagon faces in degrees
const angleStepsArray = [116.57, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180];
let currentAngleArray = [116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57, 116.57];

function updateCurrentAngleArray(steps: number) {
    let rotationFace = (11 - Math.floor(steps / 14));
    let rotationSteps = steps % 14;
    currentAngleArray[rotationFace] = angleStepsArray[rotationSteps];
    return [rotationFace, rotationSteps];
}

export function createPentagon(radius: number, position: THREE.Vector3, steps: number): [THREE.Group, number] {
    const [rotationFace, rotationSteps] = updateCurrentAngleArray(steps);
    const myThreeJSGroup = new THREE.Group();

    // const point = new THREE.Vector3(0, 0, 0);
    // const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[6], side: THREE.DoubleSide });
    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.copy(point);
    // myThreeJSGroup.add(sphere);

    // Draw face 0
    const geometry = createPentagonGeometry(radius);
    const pentagon0 = new THREE.Mesh(geometry, material);
    myThreeJSGroup.add(pentagon0);

    // Draw all points of geometry
    let points = geometry.getAttribute('position').array;
    // let colorIndex = 0;

    // const x = points[0];
    // const y = points[1];
    // const z = points[2];
    // const origin0 = drawSphere(new THREE.Vector3(x, y, z), colors[colorIndex]);
    // myThreeJSGroup.add(origin0);


    let indx = 2;
    let A0 = new THREE.Vector3(points[indx * 3], points[indx * 3 + 1], points[indx * 3 + 2])
    indx = 3;
    let A1 = new THREE.Vector3(points[indx * 3], points[indx * 3 + 1], points[indx * 3 + 2])

    // Draw face 1st
    let degAngle = currentAngleArray[1];
    let point0 = new THREE.Vector3(points[0], points[1], points[2]);
    rotatePointArround2Points(A0, A1, point0, degAngle);
    let point1 = new THREE.Vector3(points[3], points[4], points[5]);
    rotatePointArround2Points(A0, A1, point1, degAngle);
    let point2 = new THREE.Vector3(points[6], points[7], points[8]);
    rotatePointArround2Points(A0, A1, point2, degAngle);
    let point3 = new THREE.Vector3(points[9], points[10], points[11]);
    rotatePointArround2Points(A0, A1, point3, degAngle);
    let point4 = new THREE.Vector3(points[12], points[13], points[14]);
    rotatePointArround2Points(A0, A1, point4, degAngle);
    // const origin1 = drawSphere(point1, colors[0]);
    // myThreeJSGroup.add(origin1);
    const pentagon1 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[1]);
    myThreeJSGroup.add(pentagon1);

    // Draw face 2nd
    degAngle = currentAngleArray[2]
    rotatePointArround2Points(point4, point3, point0, degAngle);
    rotatePointArround2Points(point4, point3, point1, degAngle);
    rotatePointArround2Points(point4, point3, point2, degAngle);
    // const origin2 = drawSphere(point4, colors[0]);
    // myThreeJSGroup.add(origin2);
    const pentagon2 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[2]);
    myThreeJSGroup.add(pentagon2);

    // Draw face 3rd
    degAngle = currentAngleArray[3]
    rotatePointArround2Points(point1, point2, point0, degAngle);
    rotatePointArround2Points(point1, point2, point4, degAngle);
    rotatePointArround2Points(point1, point2, point3, degAngle);
    // const origin3 = drawSphere(point1, colors[0]);
    // myThreeJSGroup.add(origin3);
    const pentaagon3 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[3]);
    myThreeJSGroup.add(pentaagon3);

    // Draw face 4th
    degAngle = currentAngleArray[4]
    rotatePointArround2Points(point4, point3, point0, degAngle);
    rotatePointArround2Points(point4, point3, point1, degAngle);
    rotatePointArround2Points(point4, point3, point2, degAngle);
    // const origin4 = drawSphere(point4, colors[0]);
    // myThreeJSGroup.add(origin4);
    const pentagon4 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[4]);
    myThreeJSGroup.add(pentagon4);

    // Draw face 5th
    degAngle = currentAngleArray[5]
    rotatePointArround2Points(point1, point2, point0, degAngle);
    rotatePointArround2Points(point1, point2, point4, degAngle);
    rotatePointArround2Points(point1, point2, point3, degAngle);
    // const origin5 = drawSphere(point2, colors[0]);
    // myThreeJSGroup.add(origin5);
    const pentagon5 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[5]);
    myThreeJSGroup.add(pentagon5);

    // Draw face 6th
    degAngle = currentAngleArray[6]
    rotatePointArround2Points(point0, point4, point1, degAngle);
    rotatePointArround2Points(point0, point4, point2, degAngle);
    rotatePointArround2Points(point0, point4, point3, degAngle);
    // const origin6 = drawSphere(point0, colors[0]);
    // myThreeJSGroup.add(origin6);
    const pentagon6 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[6]);
    myThreeJSGroup.add(pentagon6);

    // Draw face 7th
    degAngle = currentAngleArray[7]
    rotatePointArround2Points(point2, point3, point1, degAngle);
    rotatePointArround2Points(point2, point3, point0, degAngle);
    rotatePointArround2Points(point2, point3, point4, degAngle);
    // const origin7 = drawSphere(point3, colors[0]);
    // myThreeJSGroup.add(origin7);
    const pentagon7 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[7]);
    myThreeJSGroup.add(pentagon7);

    // Draw face 8th
    degAngle = currentAngleArray[8]
    rotatePointArround2Points(point1, point0, point2, degAngle);
    rotatePointArround2Points(point1, point0, point3, degAngle);
    rotatePointArround2Points(point1, point0, point4, degAngle);
    // const origin8 = drawSphere(point0, colors[0]);
    // myThreeJSGroup.add(origin8);
    const pentagon8 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[8]);
    myThreeJSGroup.add(pentagon8);

    // Draw face 9th
    degAngle = currentAngleArray[9]
    rotatePointArround2Points(point2, point3, point1, degAngle);
    rotatePointArround2Points(point2, point3, point0, degAngle);
    rotatePointArround2Points(point2, point3, point4, degAngle);
    // const origin9 = drawSphere(point3, colors[0]);
    // myThreeJSGroup.add(origin9);
    const pentagon9 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[9]);
    myThreeJSGroup.add(pentagon9);

    // Draw face 10th
    degAngle = currentAngleArray[10]
    rotatePointArround2Points(point1, point0, point2, degAngle);
    rotatePointArround2Points(point1, point0, point3, degAngle);
    rotatePointArround2Points(point1, point0, point4, degAngle);
    // const origin10 = drawSphere(point4, colors[0]);
    // myThreeJSGroup.add(origin10);
    const pentagon10 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[10]);
    myThreeJSGroup.add(pentagon10);

    // Draw face 11th
    degAngle = currentAngleArray[11]
    rotatePointArround2Points(point1, point2, point0, degAngle);
    rotatePointArround2Points(point1, point2, point4, degAngle);
    rotatePointArround2Points(point1, point2, point3, degAngle);
    // const origin11 = drawSphere(point4, colors[0]);
    // myThreeJSGroup.add(origin11);
    const pentagon11 = drawShapeFromPoints(point0, point1, point2, point3, point4, colors[11]);
    myThreeJSGroup.add(pentagon11);



    myThreeJSGroup.position.copy(position);
    myThreeJSGroup.rotateX(Math.PI / 2);
    myThreeJSGroup.position.y -= 1.5;
    return [myThreeJSGroup, steps];
}

function drawSphere(point: THREE.Vector3, color: string) {
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(point);
    return sphere;
}


function drawShapeFromPoints(point0: THREE.Vector3, point1: THREE.Vector3, point2: THREE.Vector3, point3: THREE.Vector3, point4: THREE.Vector3, color: string) {

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        ...point0.toArray(), // Base
        ...point1.toArray(),
        ...point2.toArray(),
        ...point3.toArray(),
        ...point4.toArray(), // Apex
    ]);
    const indices = new Uint16Array([
        0, 1, 2, // Triangle 1
        2, 3, 0,  // Triangle 2
        0, 3, 4
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const material = new THREE.MeshBasicMaterial({
        color: color, side: THREE.DoubleSide, transparent: true,
        opacity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);

    // Create material for solid border
    const borderMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Black color for demonstration
        wireframe: true
    });
    // Create material for the lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create edges geometry
    const edges = new THREE.EdgesGeometry(geometry);

    // Create line segments
    const lines = new THREE.LineSegments(edges, lineMaterial);

    const meshGroup = new THREE.Group();
    meshGroup.add(mesh);
    meshGroup.add(lines);
    return meshGroup;

    // draw a 3d shape from points
    // const shape = new THREE.Shape();
    // shape.moveTo(point0.x, point0.y);
    // shape.lineTo(point1.x, point1.y);
    // shape.lineTo(point2.x, point2.y);
    // shape.lineTo(point3.x, point3.y);
    // shape.lineTo(point4.x, point4.y);
    // shape.closePath();
    // const geometry = new THREE.ShapeGeometry(shape);
    // const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide});
    // const pentagon = new THREE.Mesh(geometry, material);
    // return pentagon;
}

function rotatePointArround2Points(A0: THREE.Vector3, A1: THREE.Vector3, point3D: THREE.Vector3, degAngle: number) {
    // center point of A0 and A1
    const center = new THREE.Vector3().addVectors(A0, A1).multiplyScalar(0.5);
    // Move newPentagon to center using translate
    point3D.sub(center);
    // create rotation vector by A0 and A1 normal vector
    const axis = new THREE.Vector3().subVectors(A1, A0).normalize(); // Direction from A0 to A1
    const angle = THREE.MathUtils.degToRad(degAngle); // Example: 45 degrees in radians
    point3D.applyAxisAngle(axis, angle);
    // Move newPentagon back
    point3D.add(center);

}

function rotateObjectArround2Points(A0: THREE.Vector3, A1: THREE.Vector3, newPentagon: THREE.Mesh, degAngle: number) {
    // center point of A0 and A1
    const center = new THREE.Vector3().addVectors(A0, A1).multiplyScalar(0.5);
    // Move newPentagon to center using translate
    newPentagon.translateX(center.x);
    newPentagon.translateY(center.y);
    newPentagon.translateZ(center.z);
    // create rotation vector by A0 and A1 normal vector
    const axis = new THREE.Vector3().subVectors(A1, A0).normalize(); // Direction from A0 to A1
    const angle = THREE.MathUtils.degToRad(degAngle); // Example: 45 degrees in radians
    // const quaternion = new THREE.Quaternion();
    // quaternion.setFromAxisAngle(axis, angle); // Axis and angle of rotation    
    // newPentagon.quaternion.multiplyQuaternions(quaternion, newPentagon.quaternion);
    newPentagon.rotateOnAxis(axis, angle);
    // Move newPentagon back
    newPentagon.translateX(-center.x);
    newPentagon.translateY(-center.y);
    newPentagon.translateZ(-center.z);
}

