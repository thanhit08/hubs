import * as THREE from 'three';
// import { cos, sin } from 'mathjs';

let len = 1.0;
let out_x: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let out_y: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let out_z: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
const maxSteps = 90;
export function setLength(length: number) {
    if (length <= 0.0) {
        len = 0.0;
        return 0;
    }
    len = length;
    return 1;
}

export function getAngle(type: number, angle: number): [number[], number[], number[]] {
    // if type < 0 or type > 13, return 0
    if (type < 0 || type > 13) {
        return [out_x, out_y, out_z];
    }
    // if angle < 0 or angle > 90, return 0
    if (angle < 0 || angle > 90) {
        return [out_x, out_y, out_z];
    }
    let ang = 3.14159265358979323846 * angle / 180.0;
    let c = Math.cos(ang);
    let s = Math.sin(ang);
    let c2 = Math.cos(2.0 * ang);
    let s2 = Math.sin(2.0 * ang);
    let t = 1.0 - c;
    let ax = 0.0;
    let ay = 0.0;
    let az = 0.0;
    let m00 = 1.0;
    let m01 = 0.0;
    let m02 = 0.0;
    let m10 = 0.0;
    let m11 = 1.0;
    let m12 = 0.0;
    let m20 = 0.0;
    let m21 = 0.0;
    let m22 = 1.0;
    let ox = 0.0;
    let oy = 0.0;
    let oz = 0.0;

    let idx = 0;
    out_x[idx] = 0.0;
    out_y[idx] = 0.0;
    out_z[idx] = 0.0;
    idx = 1;
    out_x[idx] = 0.0;
    out_y[idx] = len;
    out_z[idx] = 0.0;
    idx = 2;
    out_x[idx] = len;
    out_y[idx] = len;
    out_z[idx] = 0.0;
    idx = 3;
    out_x[idx] = len;
    out_y[idx] = 0.0;
    out_z[idx] = 0.0;

    switch (type) {
        case 0:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = -len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = len + len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 9;
                out_x[idx] = len + len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
            }
            break;
        case 1:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = -len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);

                idx = 8;
                ax = (out_x[2] - out_x[11]) / len;
                ay = (out_y[2] - out_y[11]) / len;
                az = (out_z[2] - out_z[11]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 2:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = -len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);

                idx = 8;
                ax = (out_x[11] - out_x[13]) / len;
                ay = (out_y[11] - out_y[13]) / len;
                az = (out_z[11] - out_z[13]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 3:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);

                idx = 6;
                ax = (out_x[12] - out_x[10]) / len;
                ay = (out_y[12] - out_y[10]) / len;
                az = (out_z[12] - out_z[10]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[10];
                oy = out_y[idx] - out_y[10];
                oz = out_z[idx] - out_z[10];
                out_x[idx] = out_x[10] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[10] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[10] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[10];
                oy = out_y[idx] - out_y[10];
                oz = out_z[idx] - out_z[10];
                out_x[idx] = out_x[10] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[10] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[10] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 8;
                ax = (out_x[11] - out_x[13]) / len;
                ay = (out_y[11] - out_y[13]) / len;
                az = (out_z[11] - out_z[13]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 4:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);

                idx = 6;
                ax = (out_x[0] - out_x[5]) / len;
                ay = (out_y[0] - out_y[5]) / len;
                az = (out_z[0] - out_z[5]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[5];
                oy = out_y[idx] - out_y[5];
                oz = out_z[idx] - out_z[5];
                out_x[idx] = out_x[5] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[5] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[5] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[5];
                oy = out_y[idx] - out_y[5];
                oz = out_z[idx] - out_z[5];
                out_x[idx] = out_x[5] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[5] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[5] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 8;
                ax = (out_x[11] - out_x[13]) / len;
                ay = (out_y[11] - out_y[13]) / len;
                az = (out_z[11] - out_z[13]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[13];
                oy = out_y[idx] - out_y[13];
                oz = out_z[idx] - out_z[13];
                out_x[idx] = out_x[13] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[13] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[13] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 5:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = -len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = len + len * (c + c2);
                out_z[idx] = len * (s + s2);

                idx = 8;
                ax = (out_x[4] - out_x[3]) / len;
                ay = (out_y[4] - out_y[3]) / len;
                az = (out_z[4] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 6:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 3.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 3.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = len + len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 9;
                out_x[idx] = len + len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 12;
                out_x[idx] = len + len * (c + c2);
                out_y[idx] = len;
                out_z[idx] = len * (s + s2);
                idx = 13;
                out_x[idx] = len + len * (c + c2);
                out_y[idx] = 0.0;
                out_z[idx] = len * (s + s2);

                idx = 6;
                ax = (out_x[10] - out_x[1]) / len;
                ay = (out_y[10] - out_y[1]) / len;
                az = (out_z[10] - out_z[1]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 7:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = -len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len * c;
                out_z[idx] = len * s;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = len + len * c;
                out_y[idx] = len;
                out_z[idx] = len * s;
                idx = 9;
                out_x[idx] = len + len * c;
                out_y[idx] = 0.0;
                out_z[idx] = len * s;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = -len;
                out_y[idx] = 3.0 * len;
                out_z[idx] = 0.0;

                idx = 6;
                ax = (out_x[2] - out_x[1]) / len;
                ay = (out_y[2] - out_y[1]) / len;
                az = (out_z[2] - out_z[1]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 10;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 6;
                ax = (out_x[10] - out_x[1]) / len;
                ay = (out_y[10] - out_y[1]) / len;
                az = (out_z[10] - out_z[1]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 12;
                ax = (out_x[10] - out_x[7]) / len;
                ay = (out_y[10] - out_y[7]) / len;
                az = (out_z[10] - out_z[7]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[7];
                oy = out_y[idx] - out_y[7];
                oz = out_z[idx] - out_z[7];
                out_x[idx] = out_x[7] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[7] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[7] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[7];
                oy = out_y[idx] - out_y[7];
                oz = out_z[idx] - out_z[7];
                out_x[idx] = out_x[7] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[7] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[7] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 8:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -3.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 10;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 11;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = 0.0;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = len + len * c;
                out_z[idx] = len * s;
                idx = 8;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -3.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -3.0 * len;
                out_z[idx] = 0.0;

                idx = 4;
                ax = (out_x[0] - out_x[3]) / len;
                ay = (out_y[0] - out_y[3]) / len;
                az = (out_z[0] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 5;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 8;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 10;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 8;
                ax = (out_x[4] - out_x[3]) / len;
                ay = (out_y[4] - out_y[3]) / len;
                az = (out_z[4] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 10;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 10;
                ax = (out_x[4] - out_x[9]) / len;
                ay = (out_y[4] - out_y[9]) / len;
                az = (out_z[4] - out_z[9]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[9];
                oy = out_y[idx] - out_y[9];
                oz = out_z[idx] - out_z[9];
                out_x[idx] = out_x[9] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[9] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[9] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[9];
                oy = out_y[idx] - out_y[9];
                oz = out_z[idx] - out_z[9];
                out_x[idx] = out_x[9] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[9] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[9] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[9];
                oy = out_y[idx] - out_y[9];
                oz = out_z[idx] - out_z[9];
                out_x[idx] = out_x[9] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[9] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[9] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[9];
                oy = out_y[idx] - out_y[9];
                oz = out_z[idx] - out_z[9];
                out_x[idx] = out_x[9] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[9] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[9] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 12;
                ax = (out_x[10] - out_x[11]) / len;
                ay = (out_y[10] - out_y[11]) / len;
                az = (out_z[10] - out_z[11]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 9:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;

                idx = 6;
                ax = (out_x[2] - out_x[1]) / len;
                ay = (out_y[2] - out_y[1]) / len;
                az = (out_z[2] - out_z[1]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 8;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 8;
                ax = (out_x[6] - out_x[1]) / len;
                ay = (out_y[6] - out_y[1]) / len;
                az = (out_z[6] - out_z[1]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[1];
                oy = out_y[idx] - out_y[1];
                oz = out_z[idx] - out_z[1];
                out_x[idx] = out_x[1] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[1] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[1] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 4;
                ax = (out_x[0] - out_x[3]) / len;
                ay = (out_y[0] - out_y[3]) / len;
                az = (out_z[0] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 5;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 10;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 10;
                ax = (out_x[4] - out_x[3]) / len;
                ay = (out_y[4] - out_y[3]) / len;
                az = (out_z[4] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 12;
                ax = (out_x[4] - out_x[11]) / len;
                ay = (out_y[4] - out_y[11]) / len;
                az = (out_z[4] - out_z[11]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
        case 10:
            if (angle == 0.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
            }
            else if (angle == 90.0) {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 6;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 7;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 8;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 9;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = len;
                out_y[idx] = len;
                out_z[idx] = len;
                idx = 12;
                out_x[idx] = 0.0;
                out_y[idx] = 0.0;
                out_z[idx] = len;
                idx = 13;
                out_x[idx] = 0.0;
                out_y[idx] = len;
                out_z[idx] = len;
            }
            else {
                idx = 4;
                out_x[idx] = len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 5;
                out_x[idx] = 0.0;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 6;
                out_x[idx] = -len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 7;
                out_x[idx] = -len;
                out_y[idx] = len;
                out_z[idx] = 0.0;
                idx = 8;
                out_x[idx] = -len;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 9;
                out_x[idx] = 0.0;
                out_y[idx] = 2.0 * len;
                out_z[idx] = 0.0;
                idx = 10;
                out_x[idx] = 2.0 * len;
                out_y[idx] = 0.0;
                out_z[idx] = 0.0;
                idx = 11;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -len;
                out_z[idx] = 0.0;
                idx = 12;
                out_x[idx] = len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;
                idx = 13;
                out_x[idx] = 2.0 * len;
                out_y[idx] = -2.0 * len;
                out_z[idx] = 0.0;

                idx = 6;
                ax = (out_x[1] - out_x[0]) / len;
                ay = (out_y[1] - out_y[0]) / len;
                az = (out_z[1] - out_z[0]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[0];
                oy = out_y[idx] - out_y[0];
                oz = out_z[idx] - out_z[0];
                out_x[idx] = out_x[0] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[0] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[0] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 7;
                ox = out_x[idx] - out_x[0];
                oy = out_y[idx] - out_y[0];
                oz = out_z[idx] - out_z[0];
                out_x[idx] = out_x[0] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[0] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[0] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 8;
                ox = out_x[idx] - out_x[0];
                oy = out_y[idx] - out_y[0];
                oz = out_z[idx] - out_z[0];
                out_x[idx] = out_x[0] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[0] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[0] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[0];
                oy = out_y[idx] - out_y[0];
                oz = out_z[idx] - out_z[0];
                out_x[idx] = out_x[0] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[0] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[0] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 8;
                ax = (out_x[1] - out_x[7]) / len;
                ay = (out_y[1] - out_y[7]) / len;
                az = (out_z[1] - out_z[7]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[7];
                oy = out_y[idx] - out_y[7];
                oz = out_z[idx] - out_z[7];
                out_x[idx] = out_x[7] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[7] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[7] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 9;
                ox = out_x[idx] - out_x[7];
                oy = out_y[idx] - out_y[7];
                oz = out_z[idx] - out_z[7];
                out_x[idx] = out_x[7] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[7] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[7] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 4;
                ax = (out_x[0] - out_x[3]) / len;
                ay = (out_y[0] - out_y[3]) / len;
                az = (out_z[0] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 5;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 10;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 10;
                ax = (out_x[4] - out_x[3]) / len;
                ay = (out_y[4] - out_y[3]) / len;
                az = (out_z[4] - out_z[3]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 11;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 12;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[3];
                oy = out_y[idx] - out_y[3];
                oz = out_z[idx] - out_z[3];
                out_x[idx] = out_x[3] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[3] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[3] + m20 * ox + + m21 * oy + m22 * oz;

                idx = 12;
                ax = (out_x[4] - out_x[11]) / len;
                ay = (out_y[4] - out_y[11]) / len;
                az = (out_z[4] - out_z[11]) / len;
                m00 = t * ax * ax + c;
                m01 = t * ax * ay - s * az;
                m02 = t * ax * az + s * ay;
                m10 = t * ay * ax + s * az;
                m11 = t * ay * ay + c;
                m12 = t * ay * az - s * ax;
                m20 = t * az * ax - s * ay;
                m21 = t * az * ay + s * ax;
                m22 = t * az * az + c;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
                idx = 13;
                ox = out_x[idx] - out_x[11];
                oy = out_y[idx] - out_y[11];
                oz = out_z[idx] - out_z[11];
                out_x[idx] = out_x[11] + m00 * ox + + m01 * oy + m02 * oz;
                out_y[idx] = out_y[11] + m10 * ox + + m11 * oy + m12 * oz;
                out_z[idx] = out_z[11] + m20 * ox + + m21 * oy + m22 * oz;
            }
            break;
    }
    return [out_x, out_y, out_z]
}

export function get_x(idx: number): number {
    if (idx < 0 || idx >= 14) {
        return 0.0;
    }
    return out_x[idx];
}

export function get_y(idx: number): number {
    if (idx < 0 || idx >= 14) {
        return 0.0;
    }
    return out_y[idx];
}

export function get_z(idx: number): number {
    if (idx < 0 || idx >= 14) {
        return 0.0;
    }
    return out_z[idx];
}

export function drawBox(props: any): [THREE.Group, number] {
    const baseProps = {
        type: 0,
        angle: 0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Quaternion(),
        scale: new THREE.Vector3(1, 1, 1),
    }
    Object.assign(baseProps, props);
    const myThreeJSGroup = new THREE.Group();

    const [out_x, out_y, out_z] = getAngle(baseProps.type, baseProps.angle);

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

    let faces = [
        [0, 1, 2, 3],
        [0, 3, 4, 5],
        [0, 6, 7, 1],
        [2, 8, 9, 3],
        [1, 10, 11, 2],
        [10, 12, 13, 11]
    ]

    switch (baseProps.type) {
        case 1:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [0, 6, 7, 1],
                [11, 8, 9, 2],
                [1, 10, 11, 2],
                [10, 12, 13, 11]
            ]
            break;
        case 2:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [0, 6, 7, 1],
                [1, 10, 11, 2],
                [10, 12, 13, 11],
                [13, 8, 9, 11]
            ]
            break;
        case 3:
            faces = [
                [0, 1, 2, 3], // red
                [0, 3, 4, 5], // green
                [10, 6, 7, 12], // blue
                [1, 10, 11, 2], // pink
                [10, 12, 13, 11], // cyan
                [13, 8, 9, 11] // yellow
            ]
            break;
        case 4:
            faces = [
                [0, 1, 2, 3], // red
                [0, 3, 4, 5], // green
                [5, 7, 6, 0], // blue
                [1, 10, 11, 2], // pink
                [10, 12, 13, 11], // cyan
                [13, 8, 9, 11] // yellow
            ]
            break;
        case 5:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [0, 6, 7, 1],
                [3, 8, 9, 4],
                [1, 10, 11, 2],
                [10, 12, 13, 11]
            ]
            break;
        case 6:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [1, 6, 7, 10],
                [2, 8, 9, 3],
                [1, 10, 11, 2],
                [8, 12, 13, 9]
            ]
            break;
        case 7:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [1, 6, 7, 10],
                [2, 8, 9, 3],
                [1, 10, 11, 2],
                [7, 13, 12, 10]
            ]
            break;
        case 8:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [1, 6, 7, 2],
                [3, 8, 9, 4],
                [4, 9, 11, 10],
                [10, 12, 13, 11]
            ]

            break;
        case 9:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [1, 6, 7, 2],
                [1, 9, 8, 6],
                [3, 10, 11, 4],
                [4, 11, 13, 12]
            ]
            break;
        case 10:
            faces = [
                [0, 1, 2, 3],
                [0, 3, 4, 5],
                [0, 6, 7, 1],
                [1, 7, 8, 9],
                [3, 10, 11, 4],
                [4, 11, 13, 12]
            ]
            break;
    }
    
    for (let i = 0; i < faces.length; i++) {
        // Draw faces
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            out_x[faces[i][0]], out_y[faces[i][0]], out_z[faces[i][0]], // Vertex 1 (X, Y, Z)
            out_x[faces[i][1]], out_y[faces[i][1]], out_z[faces[i][1]], // Vertex 2
            out_x[faces[i][2]], out_y[faces[i][2]], out_z[faces[i][2]], // Vertex 3
            out_x[faces[i][3]], out_y[faces[i][3]], out_z[faces[i][3]]  // Vertex 4
        ]);
        const indices = new Uint16Array([
            0, 1, 2, // Triangle 1
            2, 3, 0  // Triangle 2
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        const material = new THREE.MeshBasicMaterial({
            color: colors[i], side: THREE.DoubleSide, transparent: true,
            opacity: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Create material for the lines
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

        // Create edges geometry
        const edges = new THREE.EdgesGeometry(geometry);

        // Create line segments
        const lines = new THREE.LineSegments(edges, lineMaterial);

        myThreeJSGroup.add(mesh);
        myThreeJSGroup.add(lines);

    }
    return [myThreeJSGroup, maxSteps];
}