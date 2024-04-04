import * as THREE from 'three';
import { cos, rotate, round, sin } from 'mathjs';


function drawBoard(position: THREE.Vector3, size: THREE.Vector2, color: string) {
    const board = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, 0.1),
        new THREE.MeshBasicMaterial({ color: parseInt(color), side: THREE.DoubleSide })
    );
    board.position.copy(position);
    return board;

}

const maxSteps = 90;

function create2DShape(points: THREE.Vector2[], position: THREE.Vector3, color: string) {
    const shape = new THREE.Shape();
    for (let i = 0; i < points.length; i++) {
        if (i === 0) {
            shape.moveTo(points[i].x, points[i].y);
        } else {
            shape.lineTo(points[i].x, points[i].y);
        }
    }
    shape.lineTo(points[0].x, points[0].y);
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({
        color: color, side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Create material for the lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create edges geometry
    const edges = new THREE.EdgesGeometry(geometry);

    // Create line segments
    const lines = new THREE.LineSegments(edges, lineMaterial);
    lines.position.copy(position);

    const meshGroup = new THREE.Group();
    meshGroup.add(mesh);
    meshGroup.add(lines);

    return meshGroup;
}

function draw2DCircle(position: THREE.Vector3, boardPosition: THREE.Vector3, radius: number, color: string) {
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({
        color: color, side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const circle = new THREE.Mesh(geometry, material);
    // change position circle to (position + shapePosition)

    circle.position.copy(new THREE.Vector3(position.x + boardPosition.x, position.y + boardPosition.y, boardPosition.z ));

    // Create material for the lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create edges geometry
    const edges = new THREE.EdgesGeometry(geometry);

    // Create line segments
    const lines = new THREE.LineSegments(edges, lineMaterial);
    lines.position.copy(new THREE.Vector3(position.x + boardPosition.x, position.y + boardPosition.y, boardPosition.z ));

    const meshGroup = new THREE.Group();
    meshGroup.add(circle);
    meshGroup.add(lines);

    return meshGroup;
}

let currentAngleArray = [0, 0, 0];

function updateCurrentAngleArray(steps: number) {
    if (steps === 0) {
        currentAngleArray = [0, 0, 0];
        return steps;
    }
    if (steps < 0) {
        steps = 0;
        currentAngleArray = [0, 0, 0];
        return steps;
    }

    if (steps > 0 && steps <= 18) {
        currentAngleArray[0] = -(steps * 5);
        currentAngleArray[1] = 0;
        currentAngleArray[2] = 0;
    }
    if (steps >= 18 && steps <= 36) {
        currentAngleArray[0] = -(18 * 5);
        currentAngleArray[1] = (steps - 18) * 5;
        currentAngleArray[2] = 0;
    }
    if (steps >= 36 && steps <= 90) {
        currentAngleArray[0] = -(18 * 5);
        currentAngleArray[1] = (18 * 5);
        currentAngleArray[2] = (steps - 36) * 5;
    }
    if (steps > 90) {

        currentAngleArray = [-(18 * 5), (18 * 5), (54 * 5)];
        steps = 90;
    }
    return steps;

}

export function createTrigonometry(position: THREE.Vector3, steps: number): [THREE.Group, number, number] {
    steps = updateCurrentAngleArray(steps);
    const group = new THREE.Group();
    const size = new THREE.Vector2(6, 5);
    const boardColor = '0xffffff';
    // const shapeEdges = 5;
    // const edgeAngle = Math.PI * 2 / shapeEdges;
    // const radius = 0.5;
    // const points = [];
    // const polygonVertices = [];
    const rotateAngle = steps * 5;
    // for (let i = 0; i < shapeEdges; i++) {
    //     const x = Math.cos(edgeAngle * i) * radius;
    //     const y = Math.sin(edgeAngle * i) * radius;
    //     points.push(new THREE.Vector2(x, y));
    //     polygonVertices.push({ x: x, y: y });
    // }
    // const centerPoint = { x: 0, y: 0 };
    // const rotatedPolygon = rotatePolygon(polygonVertices, centerPoint, rotateAngle);
    // const rotatedVector2Points = rotatedPolygon.map(point => new THREE.Vector2(point.x, point.y));

    // group.add(drawBoard(position, size, boardColor));

    const shapePosition = new THREE.Vector3(position.x, position.y, position.z );
    // const circlePosition = new THREE.Vector3(position.x - 1, position.y, position.z );

    // rotatePointArroundPoint(circlePosition, shapePosition, rotateAngle);
    // // const shape2D = create2DShape(points, shapePosition , 'blue');
    // // group.add(shape2D);

    // const shape2D = create2DShape(rotatedVector2Points, shapePosition, 'blue');
    // group.add(shape2D);

    // const circleSize = 0.05;
    // const originPoint = draw2DCircle(circlePosition, circleSize, 'red');
    // group.add(originPoint);

    const pointA = { x: 2, y: 2 };
    const pointB = { x: 2, y: -2 };
    const pointC = { x: -2, y: -2 };
    const pointD = { x: -2, y: 2 };
    const pointE = { x: 0.6, y: 2 };
    const pointF = { x: -2, y: -0.6 };

    const circleSize = 0.05;
    // const pointACircle = draw2DCircle(new THREE.Vector3(pointA.x, pointA.y, position.z ), shapePosition, circleSize, 'red');
    // group.add(pointACircle);

    // const pointBCircle = draw2DCircle(new THREE.Vector3(pointB.x, pointB.y, position.z ), shapePosition, circleSize, 'green');
    // group.add(pointBCircle);

    // rotate point C around point B
    const rotatedPointC = rotatePointArroundPoint(new THREE.Vector3(pointB.x, pointB.y, position.z ), new THREE.Vector3(pointC.x, pointC.y, position.z ), currentAngleArray[0]);

    // const pointCCircle = draw2DCircle(new THREE.Vector3(pointC.x, pointC.y, position.z ), shapePosition, circleSize, 'blue');
    // group.add(pointCCircle);

    // const pointDCircle = draw2DCircle(new THREE.Vector3(pointD.x, pointD.y, position.z ), shapePosition, circleSize, 'yellow');
    // group.add(pointDCircle);

    // const pointECircle = draw2DCircle(new THREE.Vector3(pointE.x, pointE.y, position.z ), shapePosition, circleSize, 'cyan');
    // group.add(pointECircle);

    // const pointFCircle = draw2DCircle(new THREE.Vector3(pointF.x, pointF.y, position.z ), shapePosition, circleSize, 'purple');
    // group.add(pointFCircle);



    // Calculate orthogonal projection of point D on line CE
    const pointG = calculateOrthogonalProjection(new THREE.Vector2(pointD.x, pointD.y), new THREE.Vector2(pointC.x, pointC.y), new THREE.Vector2(pointE.x, pointE.y));
    // const pointGCircle = draw2DCircle(new THREE.Vector3(pointG.x, pointG.y, position.z ), shapePosition, circleSize, 'olive');
    // group.add(pointGCircle);

    // Calculate orthogonal projection of point F on line CE
    const pointJ = calculateOrthogonalProjection(new THREE.Vector2(pointF.x, pointF.y), new THREE.Vector2(pointC.x, pointC.y), new THREE.Vector2(pointE.x, pointE.y));
    // const pointJCircle = draw2DCircle(new THREE.Vector3(pointJ.x, pointJ.y, position.z ), shapePosition, circleSize, 'navy');
    // group.add(pointJCircle);

    // Caclulate orthogonal projection of point B on line CE
    const pointH = calculateOrthogonalProjection(new THREE.Vector2(pointB.x, pointB.y), new THREE.Vector2(pointC.x, pointC.y), new THREE.Vector2(pointE.x, pointE.y));
    // rotate H around B
    const rotatedPointH = rotatePointArroundPoint(new THREE.Vector3(pointB.x, pointB.y, position.z ), new THREE.Vector3(pointH.x, pointH.y, position.z ), currentAngleArray[0]);
    const pointHCircle = draw2DCircle(new THREE.Vector3(pointH.x, pointH.y, position.z ), shapePosition, circleSize, 'black');
    group.add(pointHCircle);

    const shapeBCHPoints = [pointB, rotatedPointC, rotatedPointH];
    const shapeBCH = create2DShape(shapeBCHPoints.map(point => new THREE.Vector2(point.x, point.y)), shapePosition, 'green');
    group.add(shapeBCH);

    const shapeABHEPoints = [pointA, pointB, pointH, pointE];
    const shapeABHE = create2DShape(shapeABHEPoints.map(point => new THREE.Vector2(point.x, point.y)), shapePosition, 'orange');
    group.add(shapeABHE);


    const rotatedPointJ = rotatePointArroundPoint(new THREE.Vector3(pointD.x, pointD.y, position.z ), new THREE.Vector3(pointJ.x, pointJ.y, position.z ), currentAngleArray[1]);
    const rotatedPointC2 = rotatePointArroundPoint(new THREE.Vector3(pointD.x, pointD.y, position.z ), new THREE.Vector3(pointC.x, pointC.y, position.z ), currentAngleArray[1]);
    const rotatedPointF = rotatePointArroundPoint(new THREE.Vector3(pointD.x, pointD.y, position.z ), new THREE.Vector3(pointF.x, pointF.y, position.z ), currentAngleArray[1]);
    let shapeJCFPoints = [rotatedPointJ, rotatedPointC2, rotatedPointF];
    const shapeJCF = create2DShape(shapeJCFPoints.map(point => new THREE.Vector2(point.x, point.y)), shapePosition, 'cyan');
    group.add(shapeJCF);

    const shapeJFDGPoints = [pointJ, pointF, pointD, pointG];
    const shapeJFDG = create2DShape(shapeJFDGPoints.map(point => new THREE.Vector2(point.x, point.y)), shapePosition, 'purple');
    group.add(shapeJFDG);

    const rotatedPointG = rotatePointArroundPoint(new THREE.Vector3(pointD.x, pointD.y, position.z ), new THREE.Vector3(pointG.x, pointG.y, position.z ), currentAngleArray[2]);
    const rotatedPointE = rotatePointArroundPoint(new THREE.Vector3(pointD.x, pointD.y, position.z ), new THREE.Vector3(pointE.x, pointE.y, position.z ), currentAngleArray[2]);
    const shapeGDEPoints = [rotatedPointG, pointD, rotatedPointE];
    const shapeGDE = create2DShape(shapeGDEPoints.map(point => new THREE.Vector2(point.x, point.y)), shapePosition, 'yellow');
    group.add(shapeGDE);

    group.position.y += 1;
    group.position.x -= 2
    return [group, steps, maxSteps];
}

function calculateOrthogonalProjection(pointP: THREE.Vector2, pointA: THREE.Vector2, pointB: THREE.Vector2) {
    // Calculate the vector representing the line direction (AB)
    const lineDirection = pointB.clone().sub(pointA).normalize();

    // Calculate the vector from point A to point P (P - A)
    const vectorAP = pointP.clone().sub(pointA);

    // Calculate the scalar projection of vector (P - A) onto the line direction vector (AB)
    const scalarProjection = vectorAP.dot(lineDirection);

    // Calculate the projection point
    const projectionPoint = pointA.clone().add(lineDirection.clone().multiplyScalar(scalarProjection));

    return { x: projectionPoint.x, y: projectionPoint.y };
}

// Function to rotate a point around another point
function rotatePoint(point: THREE.Vector2, center: THREE.Vector2, degAngle: number) {
    const angle = THREE.MathUtils.degToRad(degAngle); // Example: 45 degrees in radians
    const rotatedX = cos(angle) * (point.x - center.x) - sin(angle) * (point.y - center.y) + center.x;
    const rotatedY = sin(angle) * (point.x - center.x) + cos(angle) * (point.y - center.y) + center.y;
    return { x: rotatedX, y: rotatedY };
}

// Function to rotate all points on the polygon around the center point
function rotatePolygon(polygon: Array<any>, center: any, degAngle: number) {
    return polygon.map(point => rotatePoint(point, center, degAngle));
}

function rotatePointArroundPoint(originPoint: THREE.Vector3, rotatePoint: THREE.Vector3, degAngle: number) {
    rotatePoint.sub(originPoint);
    const axis = new THREE.Vector3(0, 0, 1); // Direction from A0 to A1
    const angle = THREE.MathUtils.degToRad(degAngle); // Example: 45 degrees in radians
    rotatePoint.applyAxisAngle(axis, angle);
    // Move newPentagon back
    rotatePoint.add(originPoint);
    return rotatePoint;
}