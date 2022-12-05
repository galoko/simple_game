import { handleResize } from "./init"
import { playerControls } from "./player"
import { drawScene, initScene } from "./scene"
import { setNow } from "./time"

function tick(time: number) {
    setNow(time)

    playerControls()

    handleResize()
    drawScene()

    requestAnimationFrame(tick)
}

async function main() {
    await initScene()

    requestAnimationFrame(tick)
}

main()
