import { mat2d, vec2 } from "gl-matrix"

export function lerp(v0: number, v1: number, t: number): number {
    return v0 * (1 - t) + v1 * t
}

export function getAngleFromPoint(x: number, y: number) {
    return Math.atan2(y, x)
}

export function getAngleFromVector(v: vec2): number {
    const [x, y] = v
    return Math.atan2(y, x)
}

export function getAngleFromMatrix(m: mat2d) {
    return Math.atan2(m[1], m[3])
}

export function dot(v1: vec2, v2: vec2): number {
    const [x0, y0] = v1
    const [x1, y1] = v2
    return x0 * x1 + y0 * y1
}

export function cross(v: vec2): vec2 {
    return vec2.fromValues(v[1], -v[0])
}

export function rotate(v: vec2, angle: number): vec2 {
    const [x, y] = v

    const c = Math.cos(angle)
    const s = Math.sin(angle)

    return vec2.fromValues(x * c - y * s, x * s + y * c)
}
