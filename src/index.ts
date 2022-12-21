import { setFocusPoint } from "./camera"
import { handleResize } from "./init"
import { initPhysics, physicsStep } from "./physics"
import { player, playerControls, playerControlsPostPhysics } from "./player"
import { drawScene, syncPhysics } from "./scene"
import { initScene } from "./scene-generator"
import { setNow } from "./time"

function tick(time: number) {
    setNow(time)

    handleResize()

    playerControls()
    physicsStep()
    syncPhysics()
    playerControlsPostPhysics()
    setFocusPoint(player.x, player.y)
    drawScene()

    requestAnimationFrame(tick)
}

async function main() {
    await initPhysics()
    await initScene()

    requestAnimationFrame(tick)
}

main()
