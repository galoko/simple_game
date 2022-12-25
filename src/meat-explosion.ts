import { vec2 } from "gl-matrix"
import { createEntropy, MersenneTwister19937, Random } from "random-js"
import {
    blood_graphics,
    Character,
    eye_ball_graphics,
    meat_on_bone_graphics,
    meat_piece_graphics,
    small_meat_piece_graphics,
} from "./character"
import { Graphics, PhysicsType } from "./graphics"
import { rotate } from "./math-utils"
import { GraphicsObject } from "./object"
import { getVelocityX, getVelocityY, setVelocity } from "./physics"
import { addToScene } from "./scene"

const r = new Random(MersenneTwister19937.seedWithArray([0x12345678, 0x90abcdef]))

function addMeatPiece(
    character: Character,
    x: number,
    y: number,
    graphics: Graphics,
    z: number,
    angle = 0
) {
    const obj = new GraphicsObject(graphics)
    obj.x = character.obj.x + x
    obj.y = character.obj.y + y
    obj.angle = character.obj.angle + angle
    obj.z = character.obj.z + z

    const velAngle = r.real(-0.5, 0.5)
    const vel = rotate(
        vec2.fromValues(obj.x - (character.obj.x + 0.05), (obj.y - (character.obj.y - 1.2)) * 0.01),
        velAngle
    )
    vec2.normalize(vel, vel)
    vec2.scale(vel, vel, 15)
    vel[0] += getVelocityX(character.obj)
    vel[1] += getVelocityY(character.obj)

    setVelocity(obj, vel[0], vel[1])

    addToScene(obj)
}

function addMeatPieceCircle(
    radius: number,
    objRadius: number,
    character: Character,
    cx: number,
    cy: number,
    graphics: Graphics,
    z: number,
    angle = 0
) {
    const radiusSq = radius * radius
    const size = Math.floor(radius / objRadius)

    for (let offsetX = -size; offsetX <= size; offsetX++) {
        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const x = cx + offsetX * objRadius
            const y = cy + offsetY * objRadius

            const dx = x - cx
            const dy = y - cy
            const distSq = dx * dx + dy * dy

            if (distSq <= radiusSq) {
                addMeatPiece(
                    character,
                    x + r.real(-0.01, 0.01),
                    y + r.real(-0.01, 0.01),
                    graphics,
                    z,
                    angle
                )
            }
        }
    }
}

function addMeatPieceLine(
    offsetX: number,
    offsetY: number,
    width: number,
    height: number,
    character: Character,
    x: number,
    y: number,
    graphics: Graphics,
    z: number,
    angle = 0
) {
    const v = rotate(vec2.fromValues(0, offsetY), angle)

    for (let column = -Math.floor((width - 1) / 2); column < width / 2; column++) {
        for (let i = 0; i < height; i++) {
            addMeatPiece(
                character,
                x + column * offsetX + v[0] * i + r.real(-0.01, 0.01),
                y + v[1] * i + r.real(-0.01, 0.01),
                graphics,
                z,
                angle
            )
        }
    }
}

export function addBloodStain(character: Character): void {
    const blood_stain = new GraphicsObject(blood_graphics)
    blood_stain.x = character.obj.x + r.real(-0.2, 0.2)
    blood_stain.y = character.obj.y - 1 + r.real(-0.2, 0.2)
    blood_stain.z = -0.01
    blood_stain.angle = r.real(0, Math.PI * 2)
    addToScene(blood_stain)
}

export function generateMeatExplosion(character: Character): void {
    /*
    eye_ball_graphics.physicsType = PhysicsType.NONE
    meat_on_bone_graphics.physicsType = PhysicsType.NONE
    meat_piece_graphics.physicsType = PhysicsType.NONE
    small_meat_piece_graphics.physicsType = PhysicsType.NONE
    */

    // eyes
    addMeatPiece(character, -0.1, -2 + 0.15, eye_ball_graphics, 0.21)
    addMeatPiece(character, -0.1, -2 + 0.14, eye_ball_graphics, 0.22)

    // head
    addMeatPieceCircle(0.17, 0.05, character, 0.01, -2 + 0.2, small_meat_piece_graphics, 0.2)

    // legs
    addMeatPieceLine(0, 0.4, 1, 2, character, 0.05, -0.8, meat_on_bone_graphics, 0.2, 0)
    addMeatPieceLine(0, 0.4, 1, 2, character, 0.05, -0.8, meat_on_bone_graphics, 0.2, -0.2)

    // arms
    addMeatPieceLine(0, 0.4, 1, 2, character, 0.05, -1.55, meat_on_bone_graphics, 0.2, 0.5)
    addMeatPieceLine(0, 0.4, 1, 2, character, 0.05, -1.55, meat_on_bone_graphics, 0.2, 0.8)

    // body
    addMeatPieceLine(0.05, 0.06, 3, 11, character, 0.05, -1.55, small_meat_piece_graphics, 0.2, 0)

    // feet
    addMeatPieceLine(0.05, 0.06, 5, 2, character, 0.05, -0.1, small_meat_piece_graphics, 0.2, 0)
}
