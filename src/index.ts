import { charactersAfterPhysics, charactersBeforePhysics } from "./character"
import { handleResize } from "./init"
import { initPhysics, physicsStep } from "./physics"
import { deleteObjects, drawScene, syncPhysics } from "./scene"
import { initScene } from "./scene-generator"
import { setNow } from "./time"

function tick(time: number) {
    setNow(time)

    handleResize()

    charactersBeforePhysics()
    physicsStep()
    syncPhysics()
    deleteObjects()
    charactersAfterPhysics()
    drawScene()

    requestAnimationFrame(tick)
}

async function main() {
    await initPhysics()
    await initScene()

    requestAnimationFrame(tick)
}

main()
