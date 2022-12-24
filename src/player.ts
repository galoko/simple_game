import { screenToWorld, setFocusPoint } from "./camera"
import { Character, MAX_SPEED_ON_FOOT } from "./character"
import {
    getPressedDuration,
    isPressed,
    mouse,
    markPressAsUsed,
    getEllapsedSincePressStart,
} from "./input-handler"

export let player: Character

const MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME = 100
const JUMP_MAX_TIME = 200

function playerControls() {
    let dstVelocity: number
    if (isPressed("KeyD")) {
        player.isMoving = true
        player.obj.mirror = false
        dstVelocity = MAX_SPEED_ON_FOOT
    } else if (isPressed("KeyA")) {
        player.isMoving = true
        player.obj.mirror = true
        dstVelocity = -MAX_SPEED_ON_FOOT
    } else {
        player.isMoving = false
        dstVelocity = 0
    }

    let velocityMul: number
    const dstDirection = Math.sign(dstVelocity)
    if (dstDirection === -player.movingDirection) {
        velocityMul = -1
    } else if (dstDirection === 0) {
        velocityMul = 0
    } else {
        velocityMul = 1
    }

    player.changeSpeed(dstVelocity, velocityMul)

    if (player.touchingGround) {
        const spacePressed = isPressed("Space")
        if (spacePressed) {
            player.startJump()
        }

        const spacePressedDuration = getPressedDuration("Space")
        if (spacePressedDuration !== undefined) {
            if (!spacePressed || spacePressedDuration >= JUMP_MAX_TIME) {
                const jumpPower = Math.min(spacePressedDuration / JUMP_MAX_TIME, 1)

                if (jumpPower > 0.0) {
                    player.jump(jumpPower)
                } else {
                    player.cancelJump()
                }

                markPressAsUsed("Space")
            }
        }
    } else {
        const ellapsedSincePressStart = getEllapsedSincePressStart("Space")
        if (
            ellapsedSincePressStart !== undefined &&
            ellapsedSincePressStart > MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME
        ) {
            markPressAsUsed("Space")
        }
    }
}

function playerControlsPostPhysics() {
    setFocusPoint(player.obj.x, player.obj.y)
    const mouseWorldSpace = screenToWorld(mouse)
    player.aimAt(mouseWorldSpace)
}

export function createPlayer() {
    player = new Character("player", true)
    player.onBeforePhysics = playerControls
    player.onAfterPhysics = playerControlsPostPhysics
}
