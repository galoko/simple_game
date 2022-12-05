/* eslint-disable @typescript-eslint/no-non-null-assertion */
const canvas = document.body.querySelector("canvas")!
export const ctx = canvas.getContext("2d", { desynchronized: true })!

export const screen = {
    width: 0,
    height: 0,
    dpr: 1,
}

export function handleResize() {
    screen.dpr = devicePixelRatio

    screen.width = document.body.clientWidth * screen.dpr
    screen.height = document.body.clientHeight * screen.dpr

    if (canvas.width == screen.width && canvas.height == screen.height) {
        return
    }

    canvas.width = screen.width
    canvas.height = screen.height
    canvas.style.width = document.body.clientWidth + "px"
    canvas.style.height = document.body.clientHeight + "px"
}

handleResize()
