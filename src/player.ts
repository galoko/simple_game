import { screenToWorld, setFocusPoint } from "./camera"
import { Character } from "./character"
import { keys, mouse } from "./input-handler"

export let player: Character

function playerControls() {
    if (keys.get("KeyD")) {
        player.setSpeed(7)
        player.obj.mirror = false
    } else if (keys.get("KeyA")) {
        player.setSpeed(-7)
        player.obj.mirror = true
    } else {
        player.setSpeed(0)
    }
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
