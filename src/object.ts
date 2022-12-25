/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mat2d, vec2 } from "gl-matrix"
import { Character } from "./character"
import { Graphics } from "./graphics"
import { getAngleFromMatrix, getScaleFromMatrix } from "./math-utils"
import { getAttachmentInfo, getParent, getParentWorldMatrix } from "./object-utils"
import { Box2D } from "./physics"
import { now } from "./time"

export function getWorldScale(obj: GraphicsObject): number {
    const parent = getParent(obj)
    const parentWorldScale = parent ? getWorldScale(parent) : 1
    return parentWorldScale * obj.scaleVec[0]
}

type ContactCallback = (contact: any) => void
type ContactCallbackWithObj = (contact: any, otherObj: GraphicsObject) => void

export class GraphicsObject {
    private static NEXT_OBJ_ID = 0

    public readonly id = GraphicsObject.NEXT_OBJ_ID++

    public x = 0
    public y = 0
    public vx = 0
    public vy = 0
    public angle = 0
    public scale = 1
    public z = 0
    public mirror = false
    public angleIsWorldAngle = false
    public scaleIsWorldScale = false

    public mat = mat2d.create()
    public startTime = 0
    public points = new Map()

    public attachments: GraphicsObject[] = []
    public parent: GraphicsObject | undefined = undefined

    public worldMat = mat2d.create()
    public worldZ = 0

    public mvpMatrix = mat2d.create()
    public lastIndex: number | undefined = undefined

    public deleteTimestamp: number | undefined = undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public body: any = undefined
    public fixture: any = undefined
    public contacts = new Map<number, any>()
    public physicsGroupIndex = 0

    public gravityScale = 1

    public character: Character | undefined = undefined

    public onContactStart: ContactCallbackWithObj | undefined = undefined
    public onContactPresolve: ContactCallback | undefined = undefined
    public onContactEnded: ContactCallback | undefined = undefined

    constructor(public graphics: Graphics) {}

    contactStarted(contactPtr: number, otherObj: GraphicsObject): void {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
        this.contacts.set(contactPtr, contact)
        this.onContactStart?.(contact, otherObj)
    }

    contactPresolve(contactPtr: number): void {
        const contact = this.contacts.get(contactPtr)
        this.onContactPresolve?.(contact)
    }

    contactEnded(contactPtr: number): void {
        const contact = this.contacts.get(contactPtr)
        this.contacts.delete(contactPtr)
        this.onContactEnded?.(contact)
    }

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
        const scale = this.graphics.scale * this.scale
        return vec2.fromValues(scale, scale)
    }

    get positionVec() {
        return vec2.fromValues(this.x, this.y)
    }

    calcLocalMatrix(parentWorldMatrix?: mat2d) {
        const m = this.mat
        mat2d.identity(m)

        if (this.graphics.attachPoint) {
            if (!this.parent) {
                throw new Error("Attachment without a parent.")
            }

            const attachmentInfo = getAttachmentInfo(
                this.parent,
                this.graphics.attachPoint,
                this.graphics.attachT
            )
            if (attachmentInfo) {
                mat2d.mul(m, m, attachmentInfo.m)
            }
        }

        if (this.scaleIsWorldScale && parentWorldMatrix) {
            const parentScale = getScaleFromMatrix(parentWorldMatrix)
            mat2d.scale(m, m, vec2.fromValues(1 / parentScale, 1 / parentScale))
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
        mat2d.scale(m, m, this.mirrorVec)

        if (this.graphics) {
            mat2d.translate(m, m, this.graphics.pivot)
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
