import { mat2d, vec2 } from "gl-matrix"
import { Graphics } from "./graphics"
import { getAngleFromMatrix } from "./math-utils"
import { getAttachmentMatrix, getParentWorldMatrix } from "./object-utils"
import { now } from "./time"

export class GraphicsObject {
    public graphics: Graphics = undefined!

    public x = 0
    public y = 0
    public angle = 0
    public scale = 1
    public z = 0
    public mirror = false
    public angleIsWorldAngle = false

    public mat = mat2d.create()
    public startTime = 0
    public points = new Map()

    public attachments: GraphicsObject[] = []
    public parent: GraphicsObject | undefined = undefined

    public worldMat = mat2d.create()
    public worldZ = 0

    public mvpMatrix = mat2d.create()
    public lastFrame: HTMLImageElement | undefined = undefined

    attach(slot: number, attachment: GraphicsObject) {
        if (this.attachments[slot] !== attachment) {
            attachment.reset()
            attachment.parent = this
            this.attachments[slot] = attachment
        }
    }

    reset() {
        this.startTime = now()
    }

    get mirrorMul() {
        return this.mirror ? -1 : 1
    }

    get mirrorVec() {
        return vec2.fromValues(this.mirror ? -1 : 1, 1)
    }

    get scaleVec() {
        const scale = (this.graphics?.scale ?? 1) * this.scale
        return vec2.fromValues(scale * this.mirrorMul, scale)
    }

    get positionVec() {
        return vec2.fromValues(this.x, this.y)
    }

    calcLocalMatrix(parentWorldMatrix?: mat2d) {
        const m = this.mat
        mat2d.identity(m)

        if (this.graphics?.attachPoint) {
            if (!this.parent) {
                throw new Error("Attachment without a parent.")
            }

            const attachmentInfo = getAttachmentMatrix(
                this.parent,
                this.graphics.attachPoint,
                this.graphics.attachT
            )
            if (attachmentInfo) {
                mat2d.mul(m, m, attachmentInfo.m)
            }
        }

        if (this.angleIsWorldAngle && parentWorldMatrix) {
            const parentAngle = getAngleFromMatrix(parentWorldMatrix)
            const currentAngle = getAngleFromMatrix(m)
            mat2d.rotate(m, m, -parentAngle)
            mat2d.rotate(m, m, -currentAngle)
        }

        mat2d.translate(m, m, this.positionVec)
        mat2d.rotate(m, m, this.angle)
        mat2d.scale(m, m, this.scaleVec)

        if (this.graphics) {
            mat2d.mul(m, m, this.graphics.pivotMatrix)
        }

        return m
    }

    calcWorldMatrix() {
        const parentWorldMatrix = getParentWorldMatrix(this)
        mat2d.mul(this.worldMat, parentWorldMatrix, this.calcLocalMatrix(parentWorldMatrix))
        return this.worldMat
    }

    getWorldMatrix() {
        return this.worldMat
    }

    setPoint(pointName: string, point: number[], obj: GraphicsObject) {
        this.points.set(pointName, {
            point,
            obj,
        })
    }
}
