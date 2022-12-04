const { vec2, mat2d } = glMatrix

const tempVec = vec2.create()
const UP = vec2.fromValues(0, -1)

const canvas = document.body.querySelector('canvas')
const ctx = canvas.getContext('2d', {desynchronized: true})

let screenWidth, screenHeight, dpr, aspectRatio

function resize() {
    dpr = devicePixelRatio

    screenWidth = document.body.clientWidth * dpr
    screenHeight = document.body.clientHeight * dpr

    if (canvas.width == screenWidth && canvas.height == screenHeight) {
        return
    }

    canvas.width = screenWidth
    canvas.height = screenHeight
    canvas.style.width = document.body.clientWidth + "px"
    canvas.style.height = document.body.clientHeight + "px"
}

resize()

//

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

class Graphics {
    constructor (name, prefix) {
        this.name = name;
        this.prefix = prefix;
    }

    async load() {
        const dataUrl = this.prefix ? `assets/${this.name}/${this.prefix}.json` : `assets/${this.name}.json`
        const response = await fetch(dataUrl)
        const data = response.ok ? await response.json() : {}

        const promises = []
        if (data.frames !== undefined) {
            for (let i = 1; i <= data.frames; i++) {
                promises.push(loadImage(`assets/${this.name}/${this.prefix}_${i}.png`))
            }
        } else {
            promises.push(loadImage(`assets/${this.name}.png`))
        }
        this.frames = await Promise.all(promises)

        // IN PIXELS
        const firstFrame = this.frames[0]
        this.pixelSize = firstFrame.width
        this.unitMatrix = mat2d.create()
        mat2d.fromScaling(this.unitMatrix, vec2.fromValues(1 / this.pixelSize, 1 / this.pixelSize))

        this.pivot = data.pivot || [firstFrame.width / 2, firstFrame.height] // default is [center, bottom]

        this.pivotMatrix = mat2d.create()
        vec2.negate(tempVec, this.pivot)
        vec2.transformMat2d(tempVec, tempVec, this.unitMatrix)
        mat2d.translate(this.pivotMatrix, this.pivotMatrix, tempVec)
        this.invPivotMatrix = mat2d.create()
        mat2d.invert(this.invPivotMatrix, this.pivotMatrix)

        // IN UNITS
        this.scale = data.scale || 1
        this.attachPoint = data.attachPoint
        this.attachT = data.attachT || 0
        this.points = data.points || []
        this.duration = data.duration || 1000
    }

    getFrameAndPoints(time) {
        const index = Math.max(0, Math.min(Math.trunc((time / this.duration) % 1 * this.frames.length), this.frames.length - 1))
        return [
            this.frames[index],
            this.points[index]
        ]
    }
}

async function createGraphics(name, prefix) {
    const graphics = new Graphics(name, prefix)
    await graphics.load()
    return graphics
}

let now = undefined

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}

const TORSO_SLOT = 0
const ARMS_SLOT = 1
const HEAD_SLOT = 2
const WEAPON_SLOT = 3

const IDENTITY = mat2d.create()

function getParent(obj) {
    let parent = obj.parent

    if (parent && obj.graphics.attachPoint) {
        const p = parent.points.get(obj.graphics.attachPoint)
        if (p) {
            parent = p.obj
        }
    }

    return parent
}

function getParentWorldMatrix(obj) {
    const parent = getParent(obj)
    return parent ? parent.getWorldMatrix() : IDENTITY
}

function getParentWorldZ(obj) {
    const parent = getParent(obj)
    return parent ? parent.worldZ : 0
}

class Object {
    constructor (graphics) {
        this.graphics = graphics
        this.x = 0
        this.y = 0
        this.angle = 0
        this.scale = 1
        this.z = 0;
        this.mat = mat2d.create()
        this.startTime = 0

        this.attachments = []

        this.worldMat = mat2d.create()
        this.worldZ = undefined

        this.points = new Map()

        this.mvpMatrix = mat2d.create()

        this.lastFrame = undefined

        this.mirror = false
    }

    attach(slot, attachment) {
        if (this.attachments[slot] !== attachment) {
            attachment.reset()
            attachment.parent = this
            this.attachments[slot] = attachment
        }
    }

    reset() {
        this.startTime = now
    }

    get mirrorMul() {
        return this.mirror ? -1 : 1
    }

    get scaleVec() {
        const scale = (this.graphics?.scale ?? 1) * this.scale
        return vec2.fromValues(scale * this.mirrorMul, scale)
    }

    get positionVec() {
        return vec2.fromValues(this.x, this.y)
    }

    calcLocalMatrix(parentWorldMatrix) {
        const m = this.mat
        mat2d.identity(m)

        if (this.graphics?.attachPoint) {
            const { m: attachmentMatrix } = getAttachmentMatrix(this.parent, this.graphics.attachPoint, this.graphics.attachT)
            mat2d.mul(m, m, attachmentMatrix)
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
        mat2d.mul(this.worldMat, parentWorldMatrix, this.calcLocalMatrix(parentWorldMatrix));
        return this.worldMat
    }

    getWorldMatrix() {
        return this.worldMat
    }
    
    setPoint(pointName, point, obj) {
        this.points.set(pointName, {
            point, obj
        })
    }
}

function getAngleFromPoint(x, y) {
    return Math.atan2(y, x)
}

function getAngleFromVector(v) {
    const [x, y] = v
    return Math.atan2(y, x)
}

function getAngleFromMatrix(m) {
    return Math.atan2(m[1], m[3])
}

function dot(v1, v2) {
    const [x0, y0] = v1
    const [x1, y1] = v2
    return x0 * x1 + y0 * y1
}

function cross(v) {
    return vec2.fromValues(v[1], -v[0])
}

function rotate(v, angle) {
    const [x, y] = v
    const c = Math.cos(angle)
    const s = Math.sin(angle)

    return [
        x * c - y * s,
        x * s + y * c
    ]
}

function getAttachmentMatrix(obj, pointName, t) {
    const p = obj.points.get(pointName)
    if (!p) {
        return undefined
    }

    const { point, obj: parentObj } = p
    const [ x0, y0, x1, y1 ] = point

    const angle = getAngleFromPoint(x1 - x0, y1 - y0)
    
    vec2.set(tempVec,
        lerp(x0, x1, t),
        lerp(y0, y1, t)
    )
    vec2.transformMat2d(tempVec, tempVec, parentObj.graphics.unitMatrix)

    const m = mat2d.create()
    mat2d.translate(m, m, tempVec)
    mat2d.rotate(m, m, angle)

    return { m, parentObj }
}

function getWorldPoint(obj) {
    const p = vec2.fromValues(0, 0)
    const m = obj.getWorldMatrix()
    vec2.transformMat2d(p, p, m)
    return p
}

function getWorldPivotPoint(obj) {
    const p = vec2.fromValues(0, 0)
    const m = obj.getWorldMatrix()

    vec2.transformMat2d(p, p, obj.graphics.invPivotMatrix)
    vec2.transformMat2d(p, p, m)
    
    return p
}

function screenToWorld(p) {
    const [x, y] = p
    return vec2.fromValues(
        (x - canvas.width / 2) / cameraScale + cameraX,
        (y - canvas.height / 2) / cameraScale + cameraY
    )
}

let prevTime = undefined

const scene = []
const objectsToDraw = []

const keys = {}
const mouse = vec2.create()

let cameraX = 0
let cameraY = 0
let cameraScale = 150

let player, idle_torso, idle_arms, aiming_arms, blaster;

const debugPoint = vec2.create()
const debugPoint1 = vec2.create()
let isDebugLine = false
const debugMatrix = mat2d.create()

const debugPoint2 = vec2.create()
const debugPoint3 = vec2.create()
let isDebugLine2 = false
const debugMatrix2 = mat2d.create()

function playerControls() {
    player.attach(TORSO_SLOT, idle_torso)
    player.attach(ARMS_SLOT, aiming_arms)

    prevTime = prevTime || now
    const dt = (now - prevTime) / 1000
    prevTime = now

    const isAiming = true

    if (keys['KeyD']) {
        // player.play(run_torso, run_arms)
        player.x += dt * 12
        player.mirror = false
    } else if (keys['KeyA']) {
        // player.play(run_torso, run_arms)
        player.x += dt * -12
        player.mirror = true
    } else {
        // player.play(idle_torso, idle_arms)
    }

    if (isAiming) {
        // player.play(undefined, aiming_arms)
    }

    const shouldersPivotPointWorldSpace = getWorldPivotPoint(aiming_arms)
    const barrelAttachment = getAttachmentMatrix(player, 'barrel', 1)

    if (shouldersPivotPointWorldSpace && barrelAttachment) {
        const mouseWorldSpace = screenToWorld(mouse)

        aiming_arms.angle = 0

        const { parentObj: barrelObj, m: attachmentMatrix } = barrelAttachment
        const barrelMatrix = mat2d.create()
        mat2d.mul(barrelMatrix, barrelMatrix, aiming_arms.calcWorldMatrix())
        mat2d.mul(barrelMatrix, barrelMatrix, barrelObj.calcLocalMatrix())
        mat2d.mul(barrelMatrix, barrelMatrix, attachmentMatrix)
        
        const barrelAngle = getAngleFromMatrix(barrelMatrix)

        const barrelLocalSpace = vec2.fromValues(0, 0);
        vec2.transformMat2d(barrelLocalSpace, barrelLocalSpace, barrelMatrix)
        vec2.sub(barrelLocalSpace, barrelLocalSpace, shouldersPivotPointWorldSpace)

        const offsetHeight = dot(rotate(barrelLocalSpace, -barrelAngle), UP)
        const offsetUp = vec2.create()
        vec2.scale(offsetUp, UP, offsetHeight)

        const mousePointShouldersLocalSpace = vec2.create()
        vec2.add(mousePointShouldersLocalSpace, mousePointShouldersLocalSpace, mouseWorldSpace)
        vec2.sub(mousePointShouldersLocalSpace, mousePointShouldersLocalSpace, shouldersPivotPointWorldSpace)

        const mouseAngle = getAngleFromVector(mousePointShouldersLocalSpace);
        vec2.sub(mousePointShouldersLocalSpace, mousePointShouldersLocalSpace, rotate(offsetUp, mouseAngle))

        // normalized delta
        const tangent = vec2.create()
        vec2.normalize(tangent, mousePointShouldersLocalSpace)

        const normal = cross(tangent)

        const pointOnCircle = vec2.create()
        vec2.scale(pointOnCircle, normal, offsetHeight)
 
        const pointOnCircleWorldSpace = vec2.create()
        vec2.add(pointOnCircleWorldSpace, shouldersPivotPointWorldSpace, pointOnCircle)

        const deltaMouseAndPointOnCircle = vec2.create()
        vec2.sub(deltaMouseAndPointOnCircle, mouseWorldSpace, pointOnCircleWorldSpace)

        aiming_arms.angle = getAngleFromVector(deltaMouseAndPointOnCircle) - barrelAngle
        aiming_arms.angleIsWorldAngle = true

        aiming_arms.calcWorldMatrix();

        // debug

        mat2d.copy(debugMatrix, cameraMatrix)
        mat2d.mul(debugMatrix, debugMatrix, barrelObj.calcWorldMatrix())
        mat2d.mul(debugMatrix, debugMatrix, attachmentMatrix)
        vec2.set(debugPoint, 0, 0)
        vec2.set(debugPoint1, 1500, 0)
        isDebugLine = true

        /*
        mat2d.copy(debugMatrix2, cameraMatrix)
        mat2d.mul(debugMatrix2, debugMatrix2, aiming_arms.getWorldMatrix())
        mat2d.mul(debugMatrix2, debugMatrix2, aiming_arms.graphics.invPivotMatrix)
        mat2d.mul(debugMatrix2, debugMatrix2, barrelMatrix)
        vec2.set(debugPoint2, 0, 0)
        isDebugLine2 = false;
        */
        /*
        const v = rotate(vec2.fromValues(100, 0), barrelAngle)
        mat2d.copy(debugMatrix2, cameraMatrix)
        vec2.copy(debugPoint2, shouldersPivotPointWorldSpace)
        vec2.set(debugPoint3, shouldersPivotPointWorldSpace[0] + v[0], shouldersPivotPointWorldSpace[1] + v[1])
        isDebugLine2 = true;
        */

        const v = barrelLocalSpace
        const w = getWorldPivotPoint(aiming_arms)
        mat2d.copy(debugMatrix2, cameraMatrix)
        vec2.set(debugPoint2, w[0] + v[0], w[1] + v[1])
        isDebugLine2 = false;
    }

    // player.angle = -0.3
}

const cameraMatrix = mat2d.create()

function setupCamera() {
    const SCREEN_HEIGHT_IN_METERS = 3;
    cameraScale = Math.max(0.01, screenHeight / SCREEN_HEIGHT_IN_METERS)
    const SCREEN_WIDTH_IN_METERS = screenWidth / cameraScale

    cameraX = player.x + SCREEN_WIDTH_IN_METERS * 0.25
    cameraY = player.y - SCREEN_HEIGHT_IN_METERS * 0.425

    mat2d.identity(cameraMatrix)
    mat2d.translate(cameraMatrix, cameraMatrix, vec2.fromValues(canvas.width / 2, canvas.height / 2))
    mat2d.scale(cameraMatrix, cameraMatrix, vec2.fromValues(cameraScale, cameraScale))
    mat2d.translate(cameraMatrix, cameraMatrix, vec2.fromValues(-cameraX, -cameraY))
}

const temp = mat2d.create()

function drawObj(obj) {
    obj.worldZ = getParentWorldZ(obj) + obj.z

    const worldMat = obj.calcWorldMatrix()
    if (obj.graphics) {
        // pixel to units
        const unitMatrix = obj.graphics.unitMatrix
        mat2d.mul(obj.mvpMatrix, cameraMatrix, worldMat)

        mat2d.mul(obj.mvpMatrix, obj.mvpMatrix, unitMatrix)

        const time = now - obj.startTime
        const [img, points] = obj.graphics.getFrameAndPoints(time)

        obj.lastFrame = img

        objectsToDraw.push(obj)

        if (points) {
            for (const pointName in points) {
                obj.parent.setPoint(pointName, points[pointName], obj);
            }
        }
    }

    for (const slot in obj.attachments) {
        const attachment = obj.attachments[slot]
        drawObj(attachment)
    }
}

function tick(time) {
    now = time / 1000

    resize()

    // clear
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    playerControls()
    setupCamera()

    // draw

    objectsToDraw.length = 0
    for (const obj of scene) {
        drawObj(obj)
    }
    
    objectsToDraw.sort((a, b) => a.worldZ - b.worldZ)

    for (const {mvpMatrix, lastFrame} of objectsToDraw) {
        ctx.setTransform(...mvpMatrix)
        ctx.drawImage(lastFrame, 0, 0)

        /*
        ctx.globalAlpha = 0.1
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, lastFrame.width, lastFrame.height)
        ctx.globalAlpha = 1
        */
    }

    for (const obj of scene) {
        for (const [pointName] of obj.points) {
            if (pointName === '') {
                for (t of [0, 1]) {
                    const { m: attachmentMatrix, parentObj } = getAttachmentMatrix(obj, pointName, t)
                    const m = mat2d.create()
                    mat2d.mul(m, cameraMatrix, parentObj.getWorldMatrix())
                    mat2d.mul(m, m, attachmentMatrix)

                    ctx.setTransform(...m)
                    ctx.fillStyle = 'red'
                    ctx.beginPath()
                    ctx.arc(0, 0, 0.03, 0, 9)
                    ctx.fill()
                }
            }
        }
    }

    ctx.setTransform(...debugMatrix)
    if (!isDebugLine) {
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(...debugPoint, 0.03, 0, 9)
        ctx.fill()
    } else {
        ctx.globalAlpha = 0.1
        ctx.lineWidth = 0.03
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(...debugPoint)
        ctx.lineTo(...debugPoint1)
        ctx.stroke()
        ctx.globalAlpha = 1
    }

    /*
    ctx.setTransform(...debugMatrix2)
    if (!isDebugLine2) {
        ctx.fillStyle = 'green'
        ctx.beginPath()
        ctx.arc(...debugPoint2, 0.01, 0, 9)
        ctx.fill()
    } else {
        ctx.lineWidth = 0.01
        // ctx.lineCap = 'butt'
        ctx.strokeStyle = 'green'
        ctx.beginPath()
        ctx.moveTo(...debugPoint2)
        ctx.lineTo(...debugPoint3)
        ctx.stroke()
    }
    */

    requestAnimationFrame(tick)
}

document.body.onkeydown = e => { keys[e.code] = true }
document.body.onkeyup = e => { keys[e.code] = false }

canvas.onmousemove = e => { 
    vec2.set(mouse, e.clientX * dpr, e.clientY * dpr)
}

async function main() {
    now = performance.now() / 1000

    // const run_torso = await createGraphics('run', 'torso_legs')
    // const run_arms = await createGraphics('run', 'arms')

    idle_torso = new Object(await createGraphics('idle', 'torso_legs'))
    idle_arms = new Object(await createGraphics('idle', 'arms'))

    aiming_arms = new Object(await createGraphics('aiming', 'arms'))
    aiming_arms.z = 0.2

    player = new Object(null)
    player.scale = 2
    player.x = 2
    player.angle = -0.4

    const head = new Object(await createGraphics('oleg'))
    head.angle = 1.57
    head.z = 0.1
    player.attach(HEAD_SLOT, head)

    blaster = new Object(await createGraphics('blaster'))
    blaster.z = 0.15
    player.attach(WEAPON_SLOT, blaster)
    
    scene.push(player)
    
    for (let i = -10; i < 20; i++) {
        const dirt = new Object(await createGraphics('dirt'))
        dirt.scale = 10
        dirt.x = 10 * i
        dirt.y = 10
        dirt.z = 0
        scene.push(dirt)
    }

    requestAnimationFrame(tick)
}

main()