import { mat2d, vec2 } from "gl-matrix"
import { camera, setupCamera } from "./camera"
import { GraphicsType } from "./graphics"
import { ctx } from "./init"
import { mouse } from "./input-handler"
import { GraphicsObject } from "./object"
import { getAttachmentMatrix, getParentWorldZ } from "./object-utils"
import { addToPhysics, syncObjWithPhysics } from "./physics"
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
        const index = obj.graphics.timeToIndex(time)

        obj.lastIndex = index

        const points = obj.graphics.getPoints(index)
        if (points) {
            if (!obj.parent) {
                throw new Error("Attachment without a parent.")
            }
            for (const pointName in points) {
                obj.parent.setPoint(pointName, points[pointName], obj)
            }
        }

        objectsToDraw.push(obj)
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
        syncObjWithPhysics(obj)
        drawObj(obj)
    }

    objectsToDraw.sort((a, b) => a.worldZ - b.worldZ)

    for (const obj of objectsToDraw) {
        const { mvpMatrix, lastIndex } = obj
        const type = obj.graphics?.type

        if (type !== undefined && lastIndex !== undefined) {
            ctx.setTransform(
                mvpMatrix[0],
                mvpMatrix[1],
                mvpMatrix[2],
                mvpMatrix[3],
                mvpMatrix[4],
                mvpMatrix[5]
            )

            switch (type) {
                case GraphicsType.IMG: {
                    const img = obj.graphics.getFrame(lastIndex)
                    ctx.drawImage(img, 0, 0)
                    break
                }
                case GraphicsType.LINE: {
                    const path = obj.graphics.getPath(lastIndex)
                    ctx.globalAlpha = obj.graphics.alpha
                    ctx.lineWidth = 1
                    if (obj.graphics.stroke) {
                        ctx.strokeStyle = obj.graphics.color
                        ctx.stroke(path)
                    } else {
                        ctx.fillStyle = obj.graphics.color
                        ctx.fill(path)
                    }
                    ctx.globalAlpha = 1
                    break
                }
            }
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

    ctx.resetTransform()
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(mouse[0], mouse[1], 5, 0, 9)
    ctx.fill()

    // DEBUG PHYSICS DRAW

    for (const obj of objectsToDraw) {
        if (!obj.body) {
            continue
        }

        const physicsPoints = obj.graphics.physicsPoints
        const scale = obj.scaleVec

        const { mvpMatrix } = obj
        ctx.setTransform(
            mvpMatrix[0],
            mvpMatrix[1],
            mvpMatrix[2],
            mvpMatrix[3],
            mvpMatrix[4],
            mvpMatrix[5]
        )

        ctx.strokeStyle = "deeppink"
        ctx.lineWidth = 10 / scale[0]
        ctx.beginPath()
        for (let i = 0; i < physicsPoints.length; i++) {
            const p = vec2.fromValues(physicsPoints[i][0], physicsPoints[i][1])
            vec2.transformMat2d(p, p, obj.graphics.invUnitMatrix)
            if (i === 0) {
                ctx.moveTo(p[0], p[1])
            } else {
                ctx.lineTo(p[0], p[1])
            }
        }
        ctx.closePath()

        ctx.stroke()
    }
}

export function addToScene(obj: GraphicsObject): void {
    scene.push(obj)

    addToPhysics(obj)
}
