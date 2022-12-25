import { vec2 } from "gl-matrix"
import { MersenneTwister19937, Random } from "random-js"
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

    const box = new GraphicsObject(await createGraphics("box"))
    box.x = 4
    box.y = -0.25
    box.z = -1
    box.angle = 0
    box.graphics.physicsType = PhysicsType.STATIC
    addToScene(box)

    const COUNT = 30

    for (let i = -2; i < COUNT; i++) {
        const platform = new GraphicsObject(platform_graphics)
        platform.x = i
        platform.y = 0
        platform.z = 1
        addToScene(platform)
    }

    const platform = new GraphicsObject(platform_graphics)
    platform.x = 0
    platform.y = -1
    platform.z = 1
    addToScene(platform)

    const r = new Random(MersenneTwister19937.seedWithArray([0x12345678, 0x90abcdef]))

    let currentHeight = -1
    let currentX = 0
    let direction = 1
    for (let i = 0; i < 100; i++) {
        currentHeight -= r.real(1, 2)

        currentX += r.real(1, 2) * direction

        const length = r.integer(2, 8)

        if (r.real(0, 1) > 0.8) {
            direction = -direction
        }

        const startX = currentX
        let endX = startX

        for (let j = 0; j < length; j++) {
            const platform = new GraphicsObject(platform_graphics)
            platform.x = currentX
            platform.y = currentHeight
            platform.z = 1
            addToScene(platform)
            endX = currentX

            currentX += platform_graphics.scale * direction
        }

        if (r.real(0, 1) > 0.7) {
            const padding = platform_graphics.scale * 0.5

            const enemy = new Character("enemy", generic_head_graphics)
            enemy.obj.x = r.real(startX + padding, endX - padding)
            enemy.obj.y = currentHeight
            enemy.obj.mirror = r.real(0, 1) > 0.5
            addCharacter(enemy)
        }
    }
}
