import { mat2d, vec2 } from "gl-matrix"
import { camera } from "./camera"
import { FOOT_FULL_HEIGHT, FOOT_HEIGHT, FOOT_START } from "./character"
import { GraphicsType, PhysicsType } from "./graphics"
import { ctx } from "./init"
import { mouse } from "./input-handler"
import { getWorldScale, GraphicsObject } from "./object"
import { getAttachmentInfo, getParentWorldZ } from "./object-utils"
import { addToPhysics, syncObjWithPhysics } from "./physics"
import { player } from "./player"
import { now } from "./time"

const scene: GraphicsObject[] = []
const objectsToDraw: GraphicsObject[] = []
const objectsByID = new Map<number, GraphicsObject>()

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

export function syncPhysics() {
    for (const obj of scene) {
        syncObjWithPhysics(obj)
    }
}

export let vx: number
export let y_v0: number
export let g: number
export let g2: number

export function drawScene() {
    ctx.resetTransform()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    objectsToDraw.length = 0
    for (const obj of scene) {
        drawObj(obj)
    }
    objectsToDraw.sort((a, b) => a.worldZ - b.worldZ)

    for (const obj of objectsToDraw) {
        const { mvpMatrix, lastIndex } = obj
        const type = obj.graphics.type

        if (type !== GraphicsType.NONE && lastIndex !== undefined) {
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
                    const attachmentInfo = getAttachmentInfo(obj, pointName, t)
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

    function drawCollisionModel(obj: GraphicsObject) {
        if (obj.graphics.physicsType === PhysicsType.NONE) {
            return
        }

        const physicsPoints = obj.graphics.physicsPoints
        const scale = getWorldScale(obj)

        const { mvpMatrix } = obj
        ctx.setTransform(
            mvpMatrix[0],
            mvpMatrix[1],
            mvpMatrix[2],
            mvpMatrix[3],
            mvpMatrix[4],
            mvpMatrix[5]
        )

        const lineWidth = vec2.fromValues(0.01, 0)
        vec2.transformMat2d(lineWidth, lineWidth, obj.graphics.invUnitMatrix)
        vec2.scale(lineWidth, lineWidth, 1 / scale)

        ctx.strokeStyle = "deeppink"
        ctx.lineWidth = lineWidth[0]
        ctx.beginPath()
        for (let i = 0; i < physicsPoints.length; i++) {
            const p = vec2.fromValues(physicsPoints[i][0], physicsPoints[i][1])
            if (obj.graphics.physicsPivot) {
                vec2.add(p, p, obj.graphics.physicsPivot)
            }
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

    for (const obj of objectsToDraw) {
        /*
        if (obj.graphics.name !== "dummy") {
            continue
        }
        */
        drawCollisionModel(obj)
        for (const slot in obj.attachments) {
            drawCollisionModel(obj.attachments[slot])
        }
    }

    /*
    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5])
    ctx.fillStyle = "rgb(0, 255, 0)"
    const p = debugPoint
    ctx.beginPath()
    ctx.arc(p[0], p[1], 0.01, 0, 9)
    ctx.fill()
    */

    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5])
    ctx.strokeStyle = "green"
    ctx.lineWidth = 0.01
    ctx.beginPath()
    const footY = player.obj.y - FOOT_HEIGHT * player.obj.scale
    ctx.moveTo(player.obj.x, footY - FOOT_START * player.obj.scale)
    ctx.lineTo(player.obj.x, footY + FOOT_FULL_HEIGHT * player.obj.scale)
    ctx.stroke()

    // DEBUG JUMP VISULIZATION

    // const g = 9.8

    const initialX = 0
    const initialY = 0

    const DT = 1 / 600

    vx = 14 // horizontal speed
    const p = 1
    const xh = 2.5 * p // horizontal distance for jump
    const h = -2.2 * p // height for jump

    const th = xh / vx

    y_v0 = (2 * h * vx) / xh
    g = (-2 * h * vx * vx) / (xh * xh)
    g2 = g * 2

    const getY = (t: number) => 0.5 * g * t * t + y_v0 * t + initialY
    const getDerivY = (t: number) => g * t + y_v0
    const getY2 = (t: number) => 0.5 * g2 * t * t + getDerivY(th) * t + getY(th)
    const getX = (t: number) => vx * t + initialX

    let t = 0

    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5])
    ctx.strokeStyle = "blue"
    ctx.lineWidth = 0.01
    ctx.beginPath()
    ctx.moveTo(getX(t), getY(t))
    while (t < th) {
        t = Math.min(t + DT, th)
        ctx.lineTo(getX(t), getY(t))
    }
    while (t < th * 2) {
        t = Math.min(t + DT, th * 2)
        ctx.lineTo(getX(t), getY2(t - th))
    }

    ctx.moveTo(getX(th), 0)
    ctx.lineTo(getX(th), getY(th))

    ctx.stroke()
}

export function addToScene(obj: GraphicsObject): void {
    scene.push(obj)

    objectsByID.set(obj.id, obj)
    for (const slot in obj.attachments) {
        const attachment = obj.attachments[slot]
        objectsByID.set(attachment.id, attachment)
    }

    addToPhysics(obj)
}

export function getObjectByID(id: number): GraphicsObject {
    const obj = objectsByID.get(id)
    if (!obj) {
        throw new Error("Can't find object by id")
    }
    return obj
}
