import { screenToWorld, setFocusPoint } from "./camera"
import { Character, generic_head_graphics, MAX_SPEED_ON_FOOT } from "./character"
import {
    getPressedDuration,
    isPressed,
    mouse,
    markPressAsUsed,
    getEllapsedSincePressStart,
} from "./input-handler"
import { now } from "./time"

export let player: Character

const MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME = 100
const JUMP_MAX_TIME = 100
const CAYOTE_TIME = 150

function playerControls() {
    // movement

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

    // jump

    if (player.touchingGround) {
        const spacePressed = isPressed("Space")
        if (spacePressed) {
            player.startJump()
        }
    } else {
        const elapsed = now() - player.lastTouchgroundTimestamp
        if (elapsed > CAYOTE_TIME) {
            const ellapsedSincePressStart = getEllapsedSincePressStart("Space")
            if (
                ellapsedSincePressStart !== undefined &&
                ellapsedSincePressStart > MAX_TIME_JUMP_PRESS_AHEAD_OF_TIME
            ) {
                markPressAsUsed("Space")
            }
        }
    }

    if (player.preparingToJump) {
        const spacePressed = isPressed("Space")
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
    }
}

function playerControlsPostPhysics() {
    setFocusPoint(player.obj.x, player.obj.y)

    // shoot

    const mouseWorldSpace = screenToWorld(mouse)
    player.aimAt(mouseWorldSpace)

    if (isPressed("LMB")) {
        player.shoot()

        markPressAsUsed("LMB")
    }
}

export function createPlayer() {
    player = new Character("player", generic_head_graphics)
    player.onBeforePhysics = playerControls
    player.onAfterPhysics = playerControlsPostPhysics
}
