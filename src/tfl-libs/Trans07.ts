import * as THREE from 'three'

const curveData: THREE.Vector3[] = [];
const numPoints = 30;
let minTTrans01 = -2.1; // Initial minimum value of t
let maxTTrans01 = 2.1; // Initial maximum value of t
const angles = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90,
  100, 110, 120, 130, 140, 150, 160, 170, 180,
  190, 200, 210, 220, 230, 240, 250, 260, 270,
  280, 290, 300, 310, 320, 330, 340, 350, 360];
let angle = 45;
export function createMyThreeJSTrans07(props: any): [THREE.Group, number] {
  const point_curves: THREE.Vector3[][] = [];
  const baseProps = {
    category: "Transformation",
    unit: "1",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    scale: new THREE.Vector3(1, 1, 1),
    steps: angles.length
  }
  Object.assign(baseProps, props);

  const myThreeJSGroup = new THREE.Group();

  generateCurveData();
  // Create a curve geometry and add the points
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(curveData);
  // Create a material for the curve
  const curveMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true });
  // Create the curve mesh
  const curve = new THREE.Mesh(curveGeometry, curveMaterial);
  curve.position.copy(baseProps.position);
  myThreeJSGroup.add(curve);
  let angleSteps = baseProps.steps;
  if (baseProps.steps > angles.length) {
    angleSteps = angles.length;
  }
  if (baseProps.steps <= 0) {
    angleSteps = 0;
  }
  for (let i = 0; i < angleSteps; i++) {
    angle = angles[i];

    let new_curve_data = [];
    for (let i = 0; i < curveData.length; i++) {
      const x = curveData[i].x;
      const y = curveData[i].y;
      const z = curveData[i].z;
      const new_y = y * Math.cos(((angle) * Math.PI) / 180) - z * Math.sin(((angle) * Math.PI) / 180);
      const new_z = y * Math.sin(((angle) * Math.PI) / 180) + z * Math.cos(((angle) * Math.PI) / 180);
      new_curve_data.push(new THREE.Vector3(x, new_y, new_z));
    }

    point_curves[i] = new_curve_data;

    const new_CurveGeometry = new THREE.BufferGeometry().setFromPoints(new_curve_data);
    const new_CurveMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true });
    let new_curve = new THREE.Mesh(new_CurveGeometry, new_CurveMaterial);
    new_curve.position.copy(baseProps.position);
    console.log("New Curve");
    myThreeJSGroup.add(new_curve);
  }

  let point_curve_data_line_1 = [];
  let point_curve_data_line_2 = [];


  for (let i = 0; i < point_curves.length; i++) {
    if (point_curves[i]) {
      point_curve_data_line_1.push(point_curves[i][0]);
      point_curve_data_line_2.push(point_curves[i][2]);
    }
  }

  if (point_curve_data_line_1.length > 1) {
    const point_curve_geometry_line1 = new THREE.BufferGeometry().setFromPoints(point_curve_data_line_1);
    const point_curve_geometry_line2 = new THREE.BufferGeometry().setFromPoints(point_curve_data_line_2);
    const point_curve_material_line1 = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const point_curve_material_line2 = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const line1 = new THREE.Line(point_curve_geometry_line1, point_curve_material_line1);
    const line2 = new THREE.Line(point_curve_geometry_line2, point_curve_material_line2);

    line1.position.copy(baseProps.position);
    line2.position.copy(baseProps.position);

    myThreeJSGroup.add(line1);
    myThreeJSGroup.add(line2);
  }

  return [myThreeJSGroup, angleSteps];
}



const generateCurveData = () => {
  curveData.length = 0;
  var v1 = new THREE.Vector3(0, 2, 0);
  var v2 = new THREE.Vector3(2, 0, 0);
  var v3 = new THREE.Vector3(3, 4, 0);
  curveData.push(v1);
  curveData.push(v2);
  curveData.push(v3);
};