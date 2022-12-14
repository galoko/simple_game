import { mat2d, vec2 } from "gl-matrix"
import { ctx } from "./init"
import { screen } from "./init"

export const camera = {
    x: 0,
    y: 0,
    scale: 150,
    m: mat2d.create(),
}

export function screenToWorld(p: vec2): vec2 {
    const [x, y] = p
    return vec2.fromValues(
        (x - ctx.canvas.width / 2) / camera.scale + camera.x,
        (y - ctx.canvas.height / 2) / camera.scale + camera.y
    )
}

const focusPoint = vec2.create()

const SCREEN_HEIGHT_IN_METERS = 12

export function setupCamera(): void {
    camera.scale = Math.max(0.01, screen.height / SCREEN_HEIGHT_IN_METERS)
    const SCREEN_WIDTH_IN_METERS = screen.width / camera.scale

    camera.x = focusPoint[0] + SCREEN_WIDTH_IN_METERS * 0
    camera.y = focusPoint[1] - SCREEN_HEIGHT_IN_METERS * 0.25

    mat2d.identity(camera.m)
    mat2d.translate(
        camera.m,
        camera.m,
        vec2.fromValues(ctx.canvas.width / 2, ctx.canvas.height / 2)
    )
    mat2d.scale(camera.m, camera.m, vec2.fromValues(camera.scale, camera.scale))
    mat2d.translate(camera.m, camera.m, vec2.fromValues(-camera.x, -camera.y))
}

export function setFocusPoint(x: number, y: number): void {
    vec2.set(focusPoint, x, y)
    setupCamera()
}
