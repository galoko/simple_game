import { mat2, mat2d, vec2 } from "gl-matrix"
import { camera } from "./camera"
import { FOOT_FULL_HEIGHT, FOOT_HEIGHT, FOOT_START, mountains_graphics } from "./character"
import { GraphicsType, PhysicsType } from "./graphics"
import { ctx, screen } from "./init"
import { mouse } from "./input-handler"
import { getWorldScale, GraphicsObject } from "./object"
import { getAttachmentInfo, getParentWorldZ } from "./object-utils"
import { addToPhysics, scheduleToRemovePhysics, syncObjWithPhysics } from "./physics"
import { player } from "./player"
import { now } from "./time"

const scene = new Set<GraphicsObject>()
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

export function deleteObjects() {
    const n = now()

    for (const obj of scene) {
        if (obj.deleteTimestamp !== undefined && n >= obj.deleteTimestamp) {
            removeFromScene(obj)
        }
    }
}

function tileBackground() {
    const background = mountains_graphics

    const worldMat = mat2d.create()
    mat2d.scale(worldMat, worldMat, vec2.fromValues(background.scale, background.scale))
    const unitMatrix = background.unitMatrix
    const mvpMatrix = mat2d.create()
    mat2d.mul(mvpMatrix, camera.m, worldMat)
    mat2d.mul(mvpMatrix, mvpMatrix, unitMatrix)

    ctx.setTransform(
        mvpMatrix[0],
        mvpMatrix[1],
        mvpMatrix[2],
        mvpMatrix[3],
        mvpMatrix[4],
        mvpMatrix[5]
    )

    const invMVP = mat2d.create()
    mat2d.invert(invMVP, mvpMatrix)

    const p = vec2.fromValues(0, 0)
    vec2.transformMat2d(p, p, invMVP)

    const img = background.getFrame(0)

    const p2 = vec2.fromValues(img.width, img.height)
    vec2.transformMat2(p2, p2, mvpMatrix as mat2)

    const w = Math.ceil(screen.width / p2[0]) + 1
    const h = Math.ceil(screen.height / p2[1]) + 1

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            ctx.drawImage(
                img,
                (Math.floor(p[0] / img.width) + x) * img.width,
                (Math.floor(p[1] / img.height) + y) * img.height
            )
        }
    }

    /*
    for (let x = 0; x < wCount; x++) {
        for (let y = 0; y < hCount; y++) {
            ctx.drawImage(img, x * screenWidth, y * screenHeight)
        }
    }
    */
}

export function drawScene() {
    ctx.resetTransform()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    tileBackground()

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

    /*
    for (const obj of objectsToDraw) {
        drawCollisionModel(obj)
        for (const slot in obj.attachments) {
            drawCollisionModel(obj.attachments[slot])
        }
    }

    ctx.setTransform(camera.m[0], camera.m[1], camera.m[2], camera.m[3], camera.m[4], camera.m[5])
    ctx.strokeStyle = "green"
    ctx.lineWidth = 0.01
    ctx.beginPath()
    const footY = player.obj.y - FOOT_HEIGHT * player.obj.scale
    ctx.moveTo(player.obj.x, footY - FOOT_START * player.obj.scale)
    ctx.lineTo(player.obj.x, footY + FOOT_FULL_HEIGHT * player.obj.scale)
    ctx.stroke()
    */
}

export function addToScene(obj: GraphicsObject): void {
    scene.add(obj)

    objectsByID.set(obj.id, obj)
    for (const slot in obj.attachments) {
        const attachment = obj.attachments[slot]
        objectsByID.set(attachment.id, attachment)
    }

    addToPhysics(obj)
}

export function removeFromScene(obj: GraphicsObject): void {
    scheduleToRemovePhysics(obj, () => {
        for (const slot in obj.attachments) {
            const attachment = obj.attachments[slot]
            objectsByID.delete(attachment.id)
        }
        objectsByID.delete(obj.id)
    })

    scene.delete(obj)
}

export function scheduleToRemove(obj: GraphicsObject, timeout: number): void {
    obj.deleteTimestamp = now() + timeout
}

export function getObjectByID(id: number): GraphicsObject {
    const obj = objectsByID.get(id)
    if (!obj) {
        throw new Error("Can't find object by id")
    }
    return obj
}
