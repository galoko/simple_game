import { mat2d, vec2 } from "gl-matrix"
import { screenToWorld, setFocusPoint } from "./camera"
import { ARMS_SLOT, HEAD_SLOT, SHOOT_LINE_SLOT, TORSO_SLOT, WEAPON_SLOT } from "./character"
import { createGraphics } from "./graphics"
import { keys, mouse } from "./input-handler"
import { cross, dot, getAngleFromMatrix, getAngleFromVector, rotate } from "./math-utils"
import { GraphicsObject } from "./object"
import { getAttachmentMatrix, getWorldPivotPoint, recalcWorldTransforms } from "./object-utils"
import { addToScene } from "./scene"
import { getDT } from "./time"

export const player = new GraphicsObject()
const idle_torso = new GraphicsObject()
const idle_arms = new GraphicsObject()
const run_torso = new GraphicsObject()
const aiming_arms = new GraphicsObject()
const blaster = new GraphicsObject()
const shootLine = new GraphicsObject()

const UP = vec2.fromValues(0, -1)

export async function createPlayer(): Promise<void> {
    run_torso.graphics = await createGraphics("run", "torso_legs")
    // const run_arms = await createGraphics('run', 'arms')

    idle_torso.graphics = await createGraphics("idle", "torso_legs")
    idle_arms.graphics = await createGraphics("idle", "arms")

    aiming_arms.graphics = await createGraphics("aiming", "arms")
    aiming_arms.z = 0.2

    player.scale = 2
    player.x = 0
    // player.mirror = true

    const head = new GraphicsObject()
    head.graphics = await createGraphics("oleg")
    head.angle = 1.57
    head.z = 0.1
    player.attach(HEAD_SLOT, head)

    blaster.graphics = await createGraphics("blaster")
    blaster.z = -0.05
    player.attach(WEAPON_SLOT, blaster)

    shootLine.graphics = await createGraphics("shoot-line")
    shootLine.z = -0.01
    player.attach(SHOOT_LINE_SLOT, shootLine)

    addToScene(player)
}

export function playerControls() {
    player.attach(ARMS_SLOT, aiming_arms)

    const dt = getDT()

    const isAiming = true

    if (keys.get("KeyD")) {
        player.attach(TORSO_SLOT, run_torso)
        player.x += dt * 7
        player.mirror = false
    } else if (keys.get("KeyA")) {
        player.attach(TORSO_SLOT, run_torso)
        player.x += dt * -7
        player.mirror = true
    } else {
        player.attach(TORSO_SLOT, idle_torso)
    }

    if (isAiming) {
        // player.play(undefined, aiming_arms)
    }

    recalcWorldTransforms(player)

    setFocusPoint(player.x, player.y)

    // TODO redo this into generic aiming method

    const shouldersPivotPointWorldSpace = getWorldPivotPoint(aiming_arms)
    const barrelAttachment = getAttachmentMatrix(player, "barrel", 1)

    if (shouldersPivotPointWorldSpace && barrelAttachment) {
        const mouseWorldSpace = screenToWorld(mouse)

        aiming_arms.angle = 0

        const { parentObj: barrelObj, m: attachmentMatrix } = barrelAttachment
        const barrelMatrix = mat2d.create()
        mat2d.mul(barrelMatrix, barrelMatrix, aiming_arms.calcWorldMatrix())
        mat2d.mul(barrelMatrix, barrelMatrix, barrelObj.calcLocalMatrix())
        mat2d.mul(barrelMatrix, barrelMatrix, attachmentMatrix)

        const barrelAngle = getAngleFromMatrix(barrelMatrix)

        const barrelLocalSpace = vec2.fromValues(0, 0)
        vec2.transformMat2d(barrelLocalSpace, barrelLocalSpace, barrelMatrix)
        vec2.sub(barrelLocalSpace, barrelLocalSpace, shouldersPivotPointWorldSpace)
        vec2.mul(barrelLocalSpace, barrelLocalSpace, player.mirrorVec)

        const offsetHeight = dot(rotate(barrelLocalSpace, -barrelAngle), UP) * player.mirrorMul
        const offsetUp = vec2.create()
        vec2.scale(offsetUp, UP, offsetHeight)

        const mousePointShouldersLocalSpace = vec2.create()
        vec2.add(mousePointShouldersLocalSpace, mousePointShouldersLocalSpace, mouseWorldSpace)
        vec2.sub(
            mousePointShouldersLocalSpace,
            mousePointShouldersLocalSpace,
            shouldersPivotPointWorldSpace
        )

        const mouseAngle = getAngleFromVector(mousePointShouldersLocalSpace)
        vec2.sub(
            mousePointShouldersLocalSpace,
            mousePointShouldersLocalSpace,
            rotate(offsetUp, mouseAngle)
        )

        // normalized delta
        const tangent = vec2.create()
        vec2.normalize(tangent, mousePointShouldersLocalSpace)

        const normal = cross(tangent)

        const pointOnCircle = vec2.create()
        vec2.scale(pointOnCircle, normal, offsetHeight)

        const pointOnCircleWorldSpace = vec2.create()
        vec2.add(pointOnCircleWorldSpace, shouldersPivotPointWorldSpace, pointOnCircle)

        const deltaMouseAndPointOnCircle = vec2.create()
        vec2.sub(deltaMouseAndPointOnCircle, mouseWorldSpace, pointOnCircleWorldSpace)

        vec2.mul(deltaMouseAndPointOnCircle, deltaMouseAndPointOnCircle, player.mirrorVec)

        aiming_arms.angle = getAngleFromVector(deltaMouseAndPointOnCircle) - barrelAngle
        aiming_arms.angleIsWorldAngle = true

        aiming_arms.calcWorldMatrix()
    }
}
