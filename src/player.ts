import { screenToWorld, setFocusPoint } from "./camera"
import { Character } from "./character"
import { keys, mouse } from "./input-handler"
import { getVelocityX, getVelocityY, setVelocity } from "./physics"
import { getDT } from "./time"

export let player: Character

const MAX_SPEED_ON_FOOT = 14
const ACCELERATION_ON_FOOT = 70

function playerControls() {
    if (player.touchingGround) {
        let dstVelocity: number
        if (keys.get("KeyD")) {
            dstVelocity = MAX_SPEED_ON_FOOT
            player.isMoving = true
            player.obj.mirror = false
        } else if (keys.get("KeyA")) {
            player.isMoving = true
            dstVelocity = -MAX_SPEED_ON_FOOT
            player.obj.mirror = true
        } else {
            player.isMoving = false
            dstVelocity = 0
        }

        let velX = getVelocityX(player.obj.body)
        const dstDirection = Math.sign(dstVelocity)
        if (dstDirection === -player.movingDirection) {
            velX = -velX
        } else if (dstDirection === 0) {
            velX = 0
        }
        player.movingDirection = dstDirection

        const delta = dstVelocity - velX
        const direction = Math.sign(delta)
        const speed = Math.abs(delta)

        const dt = getDT()
        const velocityDiff = direction * Math.min(ACCELERATION_ON_FOOT * dt, speed)
        const newVelocityX = velX + velocityDiff

        const cappedVelocityX =
            dstDirection * Math.min(newVelocityX * dstDirection, MAX_SPEED_ON_FOOT)

        setVelocity(player.obj.body, cappedVelocityX, undefined)

        if (keys.get("Space")) {
            player.startJump()
        } else {
            if (player.preparingToJump) {
                player.jump()
            }
        }
    } else {
        if (keys.get("KeyD")) {
            // player.steerSpeed(0.07)
            player.obj.mirror = false
        } else if (keys.get("KeyA")) {
            // player.steerSpeed(-0.07)
            player.obj.mirror = true
        }
    }

    // console.log(getVelocityY(player.obj.body))
}

function playerControlsPostPhysics() {
    setFocusPoint(player.obj.x, player.obj.y)
    const mouseWorldSpace = screenToWorld(mouse)
    player.aimAt(mouseWorldSpace)
}

export function createPlayer() {
    player = new Character("player")
    player.onBeforePhysics = playerControls
    player.onAfterPhysics = playerControlsPostPhysics
}
