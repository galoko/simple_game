/* eslint-disable @typescript-eslint/no-explicit-any */
import { vec2 } from "gl-matrix"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Box2DInit from "../third-party/Box2D_v2.3.1_min.wasm"
import { PhysicsCategoryBits, PhysicsCategoryToBits, PhysicsType } from "./graphics"
import { getWorldScale, GraphicsObject } from "./object"
import { getObjectByID } from "./scene"
import { now } from "./time"

export let Box2D: any
let world: any

let temp: any
let temp2: any

export const PHYSICS_STEP = 1 / 60
const MAX_STEPS_PER_STEP = 5

export const GRAVITY = 9.8

let currentTime = now() / 1000

let worldManifold: any
let rayCastCallback: any
const rayCastResult = vec2.create()
let raycastFixtureToIgnorePtr: any

const contantPoint0 = vec2.create()
const contantPoint1 = vec2.create()
const normal = vec2.create()

const objectsToAdd = new Set<GraphicsObject>()
const objectsToDelete = new Map<GraphicsObject, () => void>()

export function getWorldPointsAndNormalFromContact(contact: any): vec2[] {
    contact.GetWorldManifold(worldManifold)
    const manifold = contact.GetManifold()
    const pointCount = manifold.get_pointCount()

    const b2_normal = worldManifold.get_normal()
    const b2_points_ptr = Box2D.getPointer(worldManifold.get_points())

    const b2_point0 = Box2D.wrapPointer(b2_points_ptr, Box2D.b2Vec2)
    const b2_point1 = Box2D.wrapPointer(b2_points_ptr + 8, Box2D.b2Vec2)

    vec2.set(normal, b2_normal.get_x(), b2_normal.get_y())
    const result = [normal]

    if (pointCount > 0) {
        vec2.set(contantPoint0, b2_point0.get_x(), b2_point0.get_y())
        result.push(contantPoint0)
    }
    if (pointCount > 1) {
        vec2.set(contantPoint1, b2_point1.get_x(), b2_point1.get_y())
        result.push(contantPoint1)
    }

    return result
}

export function raycast(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    fixtureToIgnore: any
): vec2 | undefined {
    temp.Set(x0, y0)
    temp2.Set(x1, y1)
    raycastFixtureToIgnorePtr = Box2D.getPointer(fixtureToIgnore)

    vec2.set(rayCastResult, NaN, NaN)
    world.RayCast(rayCastCallback, temp, temp2)

    return !isNaN(rayCastResult[0]) ? rayCastResult : undefined
}

export function setVelocity(obj: GraphicsObject, x: number | undefined, y: number | undefined) {
    if (x !== undefined) {
        obj.vx = x
    }
    if (y !== undefined) {
        obj.vy = y
    }

    const body = obj.body
    if (!body) {
        return
    }

    const vel = body.GetLinearVelocity()

    temp.set_x(vel.get_x())
    temp.set_y(vel.get_y())

    if (x !== undefined) {
        temp.set_x(x)
    }
    if (y !== undefined) {
        temp.set_y(y)
    }

    body.SetLinearVelocity(temp)
}

export function getVelocityX(obj: GraphicsObject): number {
    return obj.body.GetLinearVelocity().get_x() ?? obj.vx
}

export function getVelocityY(obj: GraphicsObject): number {
    return obj.body.GetLinearVelocity().get_y() ?? obj.vy
}

export function mulVelocity(obj: GraphicsObject, x: number | undefined, y: number | undefined) {
    if (x !== undefined) {
        obj.vx *= x
    }
    if (y !== undefined) {
        obj.vy *= y
    }

    const body = obj.body
    if (!body) {
        return
    }

    const vel = body.GetLinearVelocity()
    if (x !== undefined) {
        vel.set_x(vel.get_x() * x)
    }
    if (y !== undefined) {
        vel.set_y(vel.get_y() * y)
    }
    body.SetLinearVelocity(vel)
}

export function setGravityScale(obj: GraphicsObject, gravityScale: number) {
    obj.gravityScale = gravityScale

    const body = obj.body
    if (!body) {
        return
    }

    body.SetGravityScale(obj.gravityScale)
}

export async function initPhysics(): Promise<void> {
    Box2D = await Box2DInit()

    temp = new Box2D.b2Vec2(0.0, 0.0)
    temp2 = new Box2D.b2Vec2(0.0, 0.0)

    const gravity = new Box2D.b2Vec2(0.0, GRAVITY)

    world = new Box2D.b2World(gravity)
    worldManifold = new Box2D.b2WorldManifold()

    const RAY_EXCLUDE_CATEGORIES = PhysicsCategoryBits.BULLET | PhysicsCategoryBits.MEAT
    rayCastCallback = new Box2D.JSRayCastCallback()
    rayCastCallback.ReportFixture = (
        fixturePtr: any,
        point: any,
        _normal: any,
        fraction: number
    ) => {
        if (fixturePtr === raycastFixtureToIgnorePtr) {
            return 1
        }

        const f = Box2D.wrapPointer(fixturePtr, Box2D.b2Fixture)
        if ((f.GetFilterData().get_categoryBits() & RAY_EXCLUDE_CATEGORIES) !== 0) {
            return 1
        }

        const p = Box2D.wrapPointer(point, Box2D.b2Vec2)
        vec2.set(rayCastResult, p.get_x(), p.get_y())

        return fraction
    }

    const listener = new Box2D.JSContactListener()
    listener.BeginContact = (contactPtr: any) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
        const fixtureA = contact.GetFixtureA()
        const fixtureB = contact.GetFixtureB()

        const objA = getObjectByID(fixtureA.GetUserData())
        const objB = getObjectByID(fixtureB.GetUserData())

        objA.contactStarted(contactPtr, objB)
        objB.contactStarted(contactPtr, objA)
    }
    listener.EndContact = (contactPtr: any) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
        const fixtureA = contact.GetFixtureA()
        const fixtureB = contact.GetFixtureB()

        const objA = getObjectByID(fixtureA.GetUserData())
        objA.contactEnded(contactPtr)

        const objB = getObjectByID(fixtureB.GetUserData())
        objB.contactEnded(contactPtr)
    }
    listener.PreSolve = (contactPtr: any) => {
        const contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact)
        const fixtureA = contact.GetFixtureA()
        const fixtureB = contact.GetFixtureB()

        const objA = getObjectByID(fixtureA.GetUserData())
        objA.contactPresolve(contactPtr)

        const objB = getObjectByID(fixtureB.GetUserData())
        objB.contactPresolve(contactPtr)
    }
    listener.PostSolve = () => {
        //
    }
    world.SetContactListener(listener)
}

function createShape(obj: GraphicsObject): typeof Box2D.b2PolygonShape {
    const shape = new Box2D.b2PolygonShape()

    const physicsPoints = obj.graphics.physicsPoints
    const scale = getWorldScale(obj)
    const buffer = Box2D._malloc(physicsPoints.length * 8)
    let offset = 0

    for (let i = 0; i < physicsPoints.length; i++) {
        const p = vec2.fromValues(physicsPoints[i][0], physicsPoints[i][1])
        vec2.add(p, p, obj.graphics.pivot)
        if (obj.graphics.physicsPivot) {
            vec2.add(p, p, obj.graphics.physicsPivot)
        }
        vec2.scale(p, p, scale)

        Box2D.HEAPF32[(buffer + offset) >> 2] = p[0]
        Box2D.HEAPF32[(buffer + offset + 4) >> 2] = p[1]

        offset += 8
    }
    const ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2)
    shape.Set(ptr_wrapped, physicsPoints.length)
    Box2D._free(buffer)

    return shape
}

function physicsTypeToBox2D(physicsType: PhysicsType): any {
    let type = PhysicsType.NONE
    switch (physicsType) {
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
    return type
}

function createFixture(obj: GraphicsObject, body: any): void {
    if (obj.graphics.physicsType === PhysicsType.NONE) {
        return
    }

    const shape = createShape(obj)

    const fixtureDef = new Box2D.b2FixtureDef()
    fixtureDef.set_shape(shape)

    fixtureDef.set_density(obj.graphics.density)
    fixtureDef.set_restitution(obj.graphics.restitution)
    fixtureDef.set_friction(obj.graphics.friction)
    fixtureDef.set_isSensor(obj.graphics.isSensor)

    const filter = fixtureDef.get_filter()
    filter.set_categoryBits(obj.graphics.physicsCategory)
    filter.set_maskBits(obj.graphics.physicsMaskBits)
    filter.set_groupIndex(obj.physicsGroupIndex)

    const fixture = body.CreateFixture(fixtureDef)
    fixture.SetUserData(obj.id)

    obj.fixture = fixture
}

function initPhysicsForObject(obj: GraphicsObject): void {
    if (obj.body || obj.graphics.physicsType == PhysicsType.NONE) {
        return
    }

    const physicsType = physicsTypeToBox2D(obj.graphics.physicsType)

    const bd = new Box2D.b2BodyDef()
    bd.set_type(physicsType)
    bd.set_fixedRotation(obj.graphics.fixedRotation)
    const body = world.CreateBody(bd)
    // body.SetAngularVelocity(-5)
    body.SetBullet(obj.graphics.isBullet)

    createFixture(obj, body)
    for (const slot in obj.attachments) {
        createFixture(obj.attachments[slot], body)
    }

    obj.body = body
}

function doAddToPhysics(obj: GraphicsObject): void {
    initPhysicsForObject(obj)

    const body = obj.body
    if (!body) {
        return
    }

    body.SetAwake(1)
    body.SetActive(1)
    body.SetGravityScale(obj.gravityScale)

    temp.set_x(obj.vx)
    temp.set_y(obj.vy)
    body.SetLinearVelocity(temp)

    syncPhysicsWithObj(obj)
}

let isInProgress = false

export function addToPhysics(obj: GraphicsObject): void {
    if (isInProgress) {
        objectsToAdd.add(obj)
    } else {
        doAddToPhysics(obj)
    }
}

export function syncPhysicsWithObj(obj: GraphicsObject): void {
    const body = obj.body

    temp.Set(obj.x, obj.y)
    body.SetTransform(temp, obj.angle)
}

export function syncObjWithPhysics(obj: GraphicsObject): void {
    const body = obj.body
    if (
        body ||
        obj.graphics.physicsType === PhysicsType.DYNAMIC ||
        obj.graphics.physicsType === PhysicsType.KINEMATIC
    ) {
        const bpos = body.GetPosition()
        obj.x = bpos.get_x()
        obj.y = bpos.get_y()
        obj.angle = body.GetAngle()
    }
}

export function scheduleToRemovePhysics(obj: GraphicsObject, callback: () => void): void {
    objectsToDelete.set(obj, callback)
}

function addObjects() {
    for (const obj of objectsToAdd) {
        doAddToPhysics(obj)
    }
    objectsToAdd.clear()
}

function deleteObjects() {
    for (const [obj, callback] of objectsToDelete) {
        world.DestroyBody(obj.body)
        obj.body = null
        callback()
    }
    objectsToDelete.clear()
}

export function physicsStep() {
    const time = now() / 1000

    const stepCount = Math.trunc((time - currentTime) / PHYSICS_STEP)

    const stepsToSimulate = Math.min(stepCount, MAX_STEPS_PER_STEP)

    currentTime += stepCount * PHYSICS_STEP

    isInProgress = true
    for (let i = 0; i < stepsToSimulate; i++) {
        world.Step(PHYSICS_STEP, 20, 20)
    }
    isInProgress = false

    deleteObjects()
    addObjects()
}
