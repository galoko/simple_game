/* eslint-disable @typescript-eslint/no-explicit-any */
import { vec2 } from "gl-matrix"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Box2DInit from "../third-party/Box2D_v2.3.1_min.wasm"
import { PhysicsType } from "./graphics"
import { GraphicsObject } from "./object"
import { now } from "./time"

let Box2D: any
let world: any

let ZERO: any
let temp: any

const PHYSICS_STEP = 1 / 60
const MAX_STEPS_PER_STEP = 5

let currentTime = now() / 1000

const PHYSICS_SCALE = 15

export async function initPhysics(): Promise<void> {
    Box2D = await Box2DInit()

    ZERO = new Box2D.b2Vec2(0.0, 0.0)
    temp = new Box2D.b2Vec2(0.0, 0.0)

    const gravity = new Box2D.b2Vec2(0.0, 9.8 * PHYSICS_SCALE)

    world = new Box2D.b2World(gravity)
}

export function addToPhysics(obj: GraphicsObject): void {
    if (!obj.graphics || obj.graphics.physicsType == PhysicsType.NONE) {
        return
    }

    const shape = new Box2D.b2PolygonShape()

    const physicsPoints = obj.graphics.physicsPoints
    const scale = obj.scaleVec
    const buffer = Box2D._malloc(physicsPoints.length * 8)
    let offset = 0
    for (let i = 0; i < physicsPoints.length; i++) {
        const p = vec2.fromValues(physicsPoints[i][0], physicsPoints[i][1])
        vec2.mul(p, p, scale)
        vec2.add(p, p, obj.pivot)
        vec2.scale(p, p, PHYSICS_SCALE)

        Box2D.HEAPF32[(buffer + offset) >> 2] = p[0]
        Box2D.HEAPF32[(buffer + offset + 4) >> 2] = p[1]

        offset += 8
    }
    const ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2)
    shape.Set(ptr_wrapped, physicsPoints.length)
    Box2D._free(buffer)

    let type
    switch (obj.graphics.physicsType) {
        case PhysicsType.DYNAMIC: {
            type = Box2D.b2_dynamicBody
            break
        }
        case PhysicsType.KINEMATIC: {
            type = Box2D.b2_kinematicBody
            break
        }
        case PhysicsType.STATIC: {
            type = Box2D.b2_staticBody
            break
        }
    }

    const bd = new Box2D.b2BodyDef()
    bd.set_type(type)
    bd.set_position(ZERO)
    const body = world.CreateBody(bd)
    body.CreateFixture(shape, 5.0)

    // body.SetAngularVelocity(-5)

    obj.body = body

    syncPhysicsWithObj(obj)
}

export function syncPhysicsWithObj(obj: GraphicsObject): void {
    const body = obj.body

    temp.Set(obj.x * PHYSICS_SCALE, obj.y * PHYSICS_SCALE)
    body.SetTransform(temp, obj.angle)
    body.SetLinearVelocity(ZERO)
    body.SetAwake(1)
    body.SetActive(1)
}

export function syncObjWithPhysics(obj: GraphicsObject): void {
    // return
    const body = obj.body
    if (
        body
        /*
        obj.graphics.physicsType === PhysicsType.DYNAMIC ||
        obj.graphics.physicsType === PhysicsType.KINEMATIC
        */
    ) {
        const bpos = body.GetPosition()
        obj.x = bpos.get_x() / PHYSICS_SCALE
        obj.y = bpos.get_y() / PHYSICS_SCALE
        obj.angle = body.GetAngle()
    }
}

export function physicsStep() {
    const time = now() / 1000

    const stepCount = (time - currentTime) / PHYSICS_STEP

    const stepsToSimulate = Math.min(stepCount, MAX_STEPS_PER_STEP)

    currentTime += stepCount * PHYSICS_STEP

    for (let i = 0; i < stepsToSimulate; i++) {
        world.Step(PHYSICS_STEP, 2, 2)
    }
}
