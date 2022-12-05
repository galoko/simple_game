import { mat2d } from "gl-matrix"
import { camera, setupCamera } from "./camera"
import { debugMatrix, debugPoint, debugPoint1 } from "./debug"
import { createGraphics } from "./graphics"
import { ctx } from "./init"
import { mouse } from "./input-handler"
import { GraphicsObject } from "./object"
import { getAttachmentMatrix, getParentWorldZ } from "./object-utils"
import { createPlayer } from "./player"
import { now } from "./time"

const scene: GraphicsObject[] = []
const objectsToDraw: GraphicsObject[] = []

function drawObj(obj: GraphicsObject): void {
    obj.worldZ = getParentWorldZ(obj) + obj.z

    const worldMat = obj.calcWorldMatrix()
    if (obj.graphics) {
        // pixel to units
        const unitMatrix = obj.graphics.unitMatrix
        mat2d.mul(obj.mvpMatrix, camera.m, worldMat)

        mat2d.mul(obj.mvpMatrix, obj.mvpMatrix, unitMatrix)

        const time = now() - obj.startTime
        const [img, points] = obj.graphics.getFrameAndPoints(time)

        obj.lastFrame = img

        objectsToDraw.push(obj)

        if (points) {
            if (!obj.parent) {
                throw new Error("Attachment without a parent.")
            }
            for (const pointName in points) {
                obj.parent.setPoint(pointName, points[pointName], obj)
            }
        }
    }

    for (const slot in obj.attachments) {
        drawObj(obj.attachments[slot])
    }
}

export function drawScene() {
    setupCamera()

    // clear
    ctx.resetTransform()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // draw

    objectsToDraw.length = 0
    for (const obj of scene) {
        drawObj(obj)
    }

    objectsToDraw.sort((a, b) => a.worldZ - b.worldZ)

    for (const { mvpMatrix, lastFrame } of objectsToDraw) {
        if (lastFrame) {
            ctx.setTransform(
                mvpMatrix[0],
                mvpMatrix[1],
                mvpMatrix[2],
                mvpMatrix[3],
                mvpMatrix[4],
                mvpMatrix[5]
            )
            ctx.drawImage(lastFrame, 0, 0)
        }
    }

    for (const obj of scene) {
        for (const [pointName] of obj.points) {
            if (pointName === "") {
                for (const t of [0, 1]) {
                    const attachmentInfo = getAttachmentMatrix(obj, pointName, t)
                    if (!attachmentInfo) {
                        continue
                    }
                    const { m: attachmentMatrix, parentObj } = attachmentInfo
                    const m = mat2d.create()
                    mat2d.mul(m, camera.m, parentObj.getWorldMatrix())
                    mat2d.mul(m, m, attachmentMatrix)

                    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
                    ctx.fillStyle = "red"
                    ctx.beginPath()
                    ctx.arc(0, 0, 0.03, 0, 9)
                    ctx.fill()
                }
            }
        }
    }

    // DEBUG DRAW

    ctx.setTransform(
        debugMatrix[0],
        debugMatrix[1],
        debugMatrix[2],
        debugMatrix[3],
        debugMatrix[4],
        debugMatrix[5]
    )

    ctx.globalAlpha = 0.1
    ctx.lineWidth = 0.03
    ctx.strokeStyle = "red"
    ctx.beginPath()
    ctx.moveTo(debugPoint[0], debugPoint[1])
    ctx.lineTo(debugPoint1[0], debugPoint1[1])
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.resetTransform()
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(mouse[0], mouse[1], 5, 0, 9)
    ctx.fill()
}

export async function initScene(): Promise<void> {
    await createPlayer()

    for (let i = -10; i < 20; i++) {
        const dirt = new GraphicsObject()
        dirt.graphics = await createGraphics("dirt")
        dirt.scale = 10
        dirt.x = 10 * i
        dirt.y = 0
        dirt.z = 0
        scene.push(dirt)
    }
}

export function addToScene(obj: GraphicsObject): void {
    scene.push(obj)
}
