import { handleResize } from "./init"
import { initPhysics, physicsStep } from "./physics"
import { playerControls } from "./player"
import { drawScene } from "./scene"
import { initScene } from "./scene-generator"
import { setNow } from "./time"

function tick(time: number) {
    setNow(time)

    playerControls()

    handleResize()
    physicsStep()
    drawScene()

    requestAnimationFrame(tick)
}

async function main() {
    await initPhysics()
    await initScene()

    requestAnimationFrame(tick)
}

main()
