import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cos, sin } from 'mathjs';

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

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
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
    '#80ff00', // lime // 09
    '#0080ff', // navy // 10
    '#ff8080', // pink // 11
    '#ff80ff', // purple // 12
    '#80b3ff', // light blue // 13
];

export function createPentagon(radius: number, position: THREE.Vector3): THREE.Group {

    const myThreeJSGroup = new THREE.Group();

    const point = new THREE.Vector3(0, 0, 0);
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[6] });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(point);
    myThreeJSGroup.add(sphere);

    const geometry = createPentagonGeometry(radius);
    // Draw all points of geometry
    const points = geometry.getAttribute('position').array;
    let colorIndex = 0;
    for (let i = 0; i < points.length; i += 3) {
        const x = points[i];
        const y = points[i + 1];
        const z = points[i + 2];
        const point = new THREE.Vector3(x, y, z);
        const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[colorIndex] });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(point);
        myThreeJSGroup.add(sphere);
        colorIndex++;
    }
    // Random a color
    material.color.setHex(Math.random() * 0xffffff);
    const pentagon = new THREE.Mesh(geometry, material);
    myThreeJSGroup.add(pentagon);

    
    for (let i = 0; i < 5; i++) {
        const newGeometry = createPentagonGeometry(radius);
        const newGeometryMaterial = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.DoubleSide});
        const newPentagon = new THREE.Mesh(newGeometry, newGeometryMaterial);
        const A0 = new THREE.Vector3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2])
        let A1 = new THREE.Vector3(points[i * 3 + 3], points[i * 3 + 4], points[i * 3 + 5])
        if (i === 4) {
            A1 = new THREE.Vector3(points[0], points[1], points[2])
        }
        const degAngle = 116.57;
        rotateObjectArround2Points(A0, A1, newPentagon, degAngle);
        myThreeJSGroup.add(newPentagon);
    }

    myThreeJSGroup.position.copy(position);
    return myThreeJSGroup;
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

