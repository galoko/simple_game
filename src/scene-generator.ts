import { createGraphics } from "./graphics"
import { GraphicsObject } from "./object"
import { createPlayer } from "./player"
import { addToScene } from "./scene"

export async function initScene(): Promise<void> {
    await createPlayer()

    const box = new GraphicsObject()
    box.graphics = await createGraphics("box")
    box.x = 4
    box.y = -2
    box.z = -1
    box.angle = 0.5
    addToScene(box)

    const COUNT = 3

    const angle = 0.5
    for (let i = -COUNT / 2; i < COUNT; i++) {
        const l = 10 * i
        const dirt = new GraphicsObject()
        dirt.graphics = await createGraphics("dirt")
        dirt.scale = 10
        dirt.x = Math.cos(angle) * l
        dirt.y = Math.sin(angle) * l + 0.01
        dirt.z = 1
        dirt.angle = angle
        addToScene(dirt)
    }
}
