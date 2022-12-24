import { screenToWorld, setFocusPoint } from "./camera"
import {
    ACCELERATION_IN_AIR,
    ACCELERATION_ON_FOOT,
    Character,
    MAX_SPEED_ON_FOOT,
} from "./character"
import { keys, mouse } from "./input-handler"
import { getVelocityX, setVelocity } from "./physics"
import { getDT } from "./time"

export let player: Character

function playerControls() {
    let dstVelocity: number
    if (keys.get("KeyD")) {
        player.isMoving = true
        player.obj.mirror = false
        dstVelocity = MAX_SPEED_ON_FOOT
    } else if (keys.get("KeyA")) {
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

    if (keys.get("Space") && player.touchingGround) {
        player.startJump()
    } else {
        if (player.preparingToJump) {
            player.jump()
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
