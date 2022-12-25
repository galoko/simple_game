import { vec2 } from "gl-matrix"
import {
    addCharacter,
    Character,
    generic_head_graphics,
    loadCharacterAnimations,
    platform_graphics,
} from "./character"
import { createGraphics, PhysicsType } from "./graphics"
import { GraphicsObject } from "./object"
import { createPlayer, player } from "./player"
import { addToScene } from "./scene"

export async function initScene(): Promise<void> {
    await loadCharacterAnimations()

    createPlayer()
    addCharacter(player)

    for (let i = 0; i < 10; i++) {
        const enemy = new Character("enemy", generic_head_graphics)
        enemy.obj.x = 3 + i * 3
        enemy.obj.y = 0
        enemy.obj.mirror = true
        addCharacter(enemy)
        enemy.aimAt(vec2.fromValues(0, -2 + 0.17))
    }

    const box = new GraphicsObject(await createGraphics("box"))
    box.x = 4
    box.y = -0.25
    box.z = -1
    box.angle = 0
    box.graphics.physicsType = PhysicsType.STATIC
    addToScene(box)

    const COUNT = 3

    const dirt_graphics = await createGraphics("dirt")

    const angle = 0
    for (let i = -COUNT / 2; i < COUNT; i++) {
        const l = 10 * i
        const dirt = new GraphicsObject(dirt_graphics)
        dirt.scale = 10
        dirt.x = Math.cos(angle) * l
        dirt.y = Math.sin(angle) * l
        dirt.z = 1
        dirt.angle = angle
        addToScene(dirt)
    }

    const platform = new GraphicsObject(platform_graphics)
    platform.x = 0
    platform.y = -1
    platform.z = 1
    addToScene(platform)
}
