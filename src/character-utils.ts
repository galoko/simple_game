import { vec2 } from "gl-matrix"
import { cross, dot, getAngleFromMatrix, getAngleFromVector, rotate } from "./math-utils"
import { GraphicsObject } from "./object"
import { getAttachmentWorldMatrix, getWorldPivotPoint, recalcWorldTransforms } from "./object-utils"

const UP = vec2.fromValues(0, -1)

export function aimAt(p: vec2, objectToRotate: GraphicsObject, attachmentName: string) {
    const parent = objectToRotate.parent
    if (!parent) {
        return
    }

    recalcWorldTransforms(parent)

    objectToRotate.angle = 0
    objectToRotate.calcWorldMatrix()

    const rotationCenter = getWorldPivotPoint(objectToRotate)
    const attachmentWorldMatrix = getAttachmentWorldMatrix(parent, attachmentName, 1)

    if (rotationCenter && attachmentWorldMatrix) {
        const attachmentAngle = getAngleFromMatrix(attachmentWorldMatrix)

        const attachmentLocalSpace = vec2.fromValues(0, 0)
        vec2.transformMat2d(attachmentLocalSpace, attachmentLocalSpace, attachmentWorldMatrix)
        vec2.sub(attachmentLocalSpace, attachmentLocalSpace, rotationCenter)
        vec2.mul(attachmentLocalSpace, attachmentLocalSpace, parent.mirrorVec)

        const offsetHeight =
            dot(rotate(attachmentLocalSpace, -attachmentAngle), UP) * parent.mirrorMul
        const offsetUp = vec2.create()
        vec2.scale(offsetUp, UP, offsetHeight)

        const delta = vec2.create()
        vec2.add(delta, delta, p)
        vec2.sub(delta, delta, rotationCenter)

        const mouseAngle = getAngleFromVector(delta)
        vec2.sub(delta, delta, rotate(offsetUp, mouseAngle))

        // normalized delta
        const tangent = vec2.create()
        vec2.normalize(tangent, delta)

        const normal = cross(tangent)

        const pointOnCircle = vec2.create()
        vec2.scale(pointOnCircle, normal, offsetHeight)

        const pointOnCircleWorldSpace = vec2.create()
        vec2.add(pointOnCircleWorldSpace, rotationCenter, pointOnCircle)

        const deltaPointAndPointOnCircle = vec2.create()
        vec2.sub(deltaPointAndPointOnCircle, p, pointOnCircleWorldSpace)

        vec2.mul(deltaPointAndPointOnCircle, deltaPointAndPointOnCircle, parent.mirrorVec)

        objectToRotate.angle = getAngleFromVector(deltaPointAndPointOnCircle) - attachmentAngle
        objectToRotate.angleIsWorldAngle = true

        objectToRotate.calcWorldMatrix()
    }
}
