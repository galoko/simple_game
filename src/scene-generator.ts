import { addCharacter, Character, loadCharacterAnimations } from "./character"
import { createGraphics, PhysicsType } from "./graphics"
import { GraphicsObject } from "./object"
import { createPlayer, player } from "./player"
import { addToScene } from "./scene"

export async function initScene(): Promise<void> {
    await loadCharacterAnimations()

    createPlayer()
    addCharacter(player)

    addCharacter(new Character("misha", false))

    const box = new GraphicsObject(await createGraphics("box"))
    box.x = 4
    box.y = -0.25
    box.z = -1
    box.angle = 0
    box.graphics.physicsType = PhysicsType.STATIC
    addToScene(box)

    const COUNT = 3
    const FLOORS_COUNT = 10

    const dirt_graphics = await createGraphics("dirt")

    const angle = 0
    for (let j = 0; j < FLOORS_COUNT; j++) {
        for (let i = -COUNT / 2; i < COUNT; i++) {
            const l = 10 * i
            const dirt = new GraphicsObject(dirt_graphics)
            dirt.scale = 10
            dirt.x = Math.cos(angle) * l * (j + 1)
            dirt.y = Math.sin(angle) * l - j * 1.8
            dirt.z = 1
            dirt.angle = angle
            addToScene(dirt)
        }
    }
}
