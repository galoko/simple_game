import { mat2d, vec2 } from "gl-matrix"
import { getAngleFromPoint, lerp } from "./math-utils"
import { GraphicsObject } from "./object"
import { now } from "./time"

export function getParent(obj: GraphicsObject): GraphicsObject | undefined {
    let parent = obj.parent

    if (parent && obj.graphics.attachPoint) {
        const p = parent.points.get(obj.graphics.attachPoint)
        if (p) {
            parent = p.obj
        }
    }

    return parent
}

const IDENTITY = mat2d.create()

export function getParentWorldMatrix(obj: GraphicsObject): mat2d {
    const parent = getParent(obj)
    return parent ? parent.getWorldMatrix() : IDENTITY
}

export function getParentWorldZ(obj: GraphicsObject): number {
    const parent = getParent(obj)
    return parent ? parent.worldZ : 0
}

export function getAttachmentInfo(
    obj: GraphicsObject,
    pointName: string,
    t: number
):
    | {
          m: mat2d
          parentObj: GraphicsObject
      }
    | undefined {
    const p = obj.points.get(pointName)
    if (!p) {
        return undefined
    }

    const { point, obj: parentObj } = p
    const [x0, y0, x1, y1] = point

    const angle = getAngleFromPoint(x1 - x0, y1 - y0)

    const offset = vec2.fromValues(lerp(x0, x1, t), lerp(y0, y1, t))
    vec2.transformMat2d(offset, offset, parentObj.graphics.unitMatrix)

    const m = mat2d.create()
    mat2d.translate(m, m, offset)
    mat2d.rotate(m, m, angle)

    return { m, parentObj }
}

export function getWorldPoint(obj: GraphicsObject) {
    const p = vec2.fromValues(0, 0)
    const m = obj.getWorldMatrix()
    vec2.transformMat2d(p, p, m)
    return p
}

export function getWorldPivotPoint(obj: GraphicsObject) {
    const p = vec2.fromValues(0, 0)
    const m = obj.getWorldMatrix()

    vec2.sub(p, p, obj.graphics.pivot)
    vec2.transformMat2d(p, p, m)

    return p
}

export function recalcWorldTransforms(obj: GraphicsObject) {
    obj.calcWorldMatrix()

    if (obj.graphics) {
        const time = now() - obj.startTime
        const index = obj.graphics.timeToIndex(time)

        const points = obj.graphics.getPoints(index)
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
        recalcWorldTransforms(obj.attachments[slot])
    }
}
