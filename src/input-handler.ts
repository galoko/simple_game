import { vec2 } from "gl-matrix"
import { ctx } from "./init"
import { screen } from "./init"
import { now } from "./time"

type KeyPressInfo = {
    down_timestamp: number
    up_timestamp?: number
    used?: boolean
}

const keys = new Map<string, KeyPressInfo>()

export const mouse = vec2.create()

function keyDown(code: string, timeStamp: number): void {
    const info = keys.get(code)
    if (!info) {
        keys.set(code, {
            down_timestamp: timeStamp,
        })
    } else {
        // don't override initial timepstamp
        if (info.up_timestamp === undefined) {
            return
        }

        info.down_timestamp = timeStamp
        delete info.up_timestamp
        delete info.used
    }
}

function keyUp(code: string, timeStamp: number): void {
    const info = keys.get(code)

    if (!info) {
        return
    }

    info.up_timestamp = timeStamp
}

document.body.onkeydown = e => {
    keyDown(e.code, e.timeStamp)
}

document.body.onkeyup = e => {
    keyUp(e.code, e.timeStamp)
}

const mouseButtonToCode = ["LMB", "MMB", "RMB"]

ctx.canvas.onmousedown = e => {
    vec2.set(mouse, e.clientX * screen.dpr, e.clientY * screen.dpr)
    keyDown(mouseButtonToCode[e.button], e.timeStamp)
}

ctx.canvas.onmousemove = e => {
    vec2.set(mouse, e.clientX * screen.dpr, e.clientY * screen.dpr)
}

ctx.canvas.onmouseup = e => {
    vec2.set(mouse, e.clientX * screen.dpr, e.clientY * screen.dpr)
    keyUp(mouseButtonToCode[e.button], e.timeStamp)
}

export function markPressAsUsed(key: string) {
    const info = keys.get(key)
    if (info) {
        info.used = true
    }
}

export function isPressed(key: string) {
    const info = keys.get(key)
    return info && !info.used && info.up_timestamp == undefined
}

export function getPressedDuration(key: string): number | undefined {
    const info = keys.get(key)
    if (!info || info.used) {
        return undefined
    }

    const up_timestamp = info.up_timestamp || now()

    return up_timestamp - info.down_timestamp
}

export function getEllapsedSincePressStart(key: string): number | undefined {
    const info = keys.get(key)
    if (!info || info.used) {
        return undefined
    }

    return now() - info.down_timestamp
}
