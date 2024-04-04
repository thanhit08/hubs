import * as THREE from 'three';

const maxSteps = 9;

function create2DShape(points: THREE.Vector3[], position: THREE.Vector3, color: string) {
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

function drawLine(point1: THREE.Vector3, point2: THREE.Vector3, position: THREE.Vector3, color: number) {
    point1 = point1.add(position);
    point1.z = position.z;
    point2 = point2.add(position);
    point2.z = position.z;
    // Line geometry
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);

    // Line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: color });

    // Line
    const line = new THREE.Line(lineGeometry, lineMaterial);
    return line;
}


// Function to find intersection point
function findIntersectionPoint(A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3, D: THREE.Vector3): any {
    const a1 = B.y - A.y;
    const b1 = A.x - B.x;
    const c1 = a1*(A.x) + b1*(A.y);
 
    // Line CD represented as a2x + b2y = c2
    const a2 = D.y - C.y;
    const b2 = C.x - D.x;
    const c2 = a2*(C.x)+ b2*(C.y);

    const denominator = a1*b2 - a2*b1;
    if (denominator === 0) {
        // Lines are parallel or coincident
        return null;
    } else {
        const x = (b2*c1 - b1*c2)/denominator;
        const y = (a1*c2 - a2*c1)/denominator;
        return new THREE.Vector3(x, y, A.z);
    }
}

function draw2DCircle(position: THREE.Vector3, boardPosition: THREE.Vector3, radius: number, color: string) {
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({
        color: color, side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    const circle = new THREE.Mesh(geometry, material);
    // change position circle to (position + shapePosition)

    circle.position.copy(new THREE.Vector3(position.x + boardPosition.x, position.y + boardPosition.y, boardPosition.z));

    // Create material for the lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create edges geometry
    const edges = new THREE.EdgesGeometry(geometry);

    // Create line segments
    const lines = new THREE.LineSegments(edges, lineMaterial);
    lines.position.copy(new THREE.Vector3(position.x + boardPosition.x, position.y + boardPosition.y, boardPosition.z));

    const meshGroup = new THREE.Group();
    meshGroup.add(circle);
    meshGroup.add(lines);

    return meshGroup;
}

export function createConstruction01(position: THREE.Vector3, steps: number): [THREE.Group, number, number] {
    const group = new THREE.Group();
    const pointA = new THREE.Vector3(1, 2, position.z);
    const pointB = new THREE.Vector3(-1, -1, position.z);
    const pointC = new THREE.Vector3(3, 0, position.z);

    const circleSize = 0.05;
    const pointACircle = draw2DCircle(pointA, position, circleSize, 'red');
    const pointBCircle = draw2DCircle(pointB, position, circleSize, 'blue');
    const pointCCircle = draw2DCircle(pointC, position, circleSize, 'green');

    const ABCShape = create2DShape([pointA, pointB, pointC], position, '#A85225');

    const pointD = new THREE.Vector3((pointB.x + pointC.x) / 2, (pointB.y + pointC.y) / 2, position.z);
    const pointE = new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, position.z);
    const pointDCircle = draw2DCircle(pointD, position, circleSize, 'orange');
    const pointECircle = draw2DCircle(pointE, position, circleSize, 'cyan');

    // Draw line AD
    const lineAD = drawLine(pointA, pointD, position, 0x000000);
    const lineCE = drawLine(pointC, pointE,position,  0x000000);

    const arrayObjects = [pointACircle, pointBCircle, pointCCircle, ABCShape, pointDCircle, pointECircle, lineAD, lineCE];
    const crossPoint = findIntersectionPoint(pointA, pointD, pointC, pointE);
    if (crossPoint) {
        const crossPointCircle = draw2DCircle(crossPoint, new THREE.Vector3(0, 0, position.z), circleSize, 'purple', );
        arrayObjects.push(crossPointCircle);
    }


    
    for (let i = 0; i < steps; i++) {
        group.add(arrayObjects[i]);
    }
    // group.add(pointACircle);
    // group.add(pointBCircle);
    // group.add(pointCCircle);
    // group.add(ABCShape);
    // group.add(pointDCircle);
    // group.add(pointECircle);
    // group.add(lineAD);
    // group.add(lineCE);

    // group.position.copy(position);
    group.position.x -= 2;
    return [group, steps, maxSteps];

}
