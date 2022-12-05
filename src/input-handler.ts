import { vec2 } from "gl-matrix"
import { ctx } from "./init"
import { screen } from "./init"

export const keys = new Map<string, boolean>()

export const mouse = vec2.create()

document.body.onkeydown = e => {
    keys.set(e.code, true)
}
document.body.onkeyup = e => {
    keys.set(e.code, false)
}

ctx.canvas.onmousemove = e => {
    vec2.set(mouse, e.clientX * screen.dpr, e.clientY * screen.dpr)
}
