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

    for (let i = -10; i < 20; i++) {
        const dirt = new GraphicsObject()
        dirt.graphics = await createGraphics("dirt")
        dirt.scale = 10
        dirt.x = 10 * i
        dirt.y = 0
        dirt.z = 1
        addToScene(dirt)
    }
}
