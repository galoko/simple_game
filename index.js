const canvas = document.body.querySelector('canvas')

canvas.width = document.body.clientWidth * devicePixelRatio
canvas.height = document.body.clientHeight * devicePixelRatio
canvas.style.width = document.body.clientWidth + "px"
canvas.style.height = document.body.clientHeight + "px"

const ctx = canvas.getContext('2d')

class Animation {
    constructor (name, frameCount, duration) {
        this.duration = duration;
        this.frames = []
        for (let i = 1; i <= frameCount; i++) {
            const frame = new Image()
            frame.src = `assets/${name}/${i}.png`
            this.frames.push(frame)
        }
    }

    getFrame(time) {
        return this.frames[Math.trunc((time / this.duration) % 1 * this.frames.length)]
    }
}

const run = new Animation('run', 8, 300)
const idle = new Animation('idle', 2, 500)

let now = undefined

class Player {
    constructor (x, y, z, scale) {
        this.x = x
        this.y = y
        this.z = z

        this.scale = scale

        this.animationStartTime = undefined
        this.animation = undefined
    }

    play(animation) {
        if (this.animation == animation) {
            return
        }
        this.animationStartTime = performance.now()
        this.animation = animation
    }

    getImage() {
        return this.animation.getFrame(now - this.animationStartTime)
    }
}

class StaticObject {
    constructor (name, x, y, z, scale) {
        this.x = x
        this.y = y
        this.z = z

        this.scale = scale

        this.img = new Image()
        this.img.src = `assets/${name}.png`
    }

    getImage() {
        return this.img
    }
}

let prevTime = undefined
let x = 0;

const objects = []

const player = new Player(0, 0, 0, 2)
player.play(idle)

objects.push(player)

for (let i = -10; i < 20; i++) {
    objects.push(new StaticObject('dirt', 10 * i, 1, 0, 10))
}

const keys = {}

// meters
let cameraX = 0
let cameraY = -5.5
let cameraScale = 150

function playerControls() {
    prevTime = prevTime || now
    const dt = (now - prevTime) / 1000
    prevTime = now

    if (keys['d']) {
        player.play(run)
        player.x += dt * 12
        player.mirrorX = false
    } else if (keys['a']) {
        player.play(run)
        player.x += dt * -12
        player.mirrorX = true
    } else {
        player.play(idle)
    }
}

requestAnimationFrame(function tick(time) {
    now = time

    playerControls()

    // draw

    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    cameraX = player.x + 6

    for (const obj of objects) {
        const img = obj.getImage()

        const s = cameraScale * obj.scale

        ctx.resetTransform()

        // center to canvas
        ctx.translate(canvas.width / 2, canvas.height / 2)

        // apply camera
        ctx.scale(cameraScale, cameraScale)
        ctx.translate(-cameraX, -cameraY)

        ctx.translate(obj.x, obj.y)
        ctx.scale(obj.scale * (obj.mirrorX ? -1 : 1), obj.scale)
        
        // normalize image size and set origin at center X, bottom Y
        ctx.scale(1 / img.width, 1 / img.width)
        ctx.translate(-img.width / 2, -img.height)

        ctx.drawImage(img, 0, 0)
    }

    requestAnimationFrame(tick)
})

document.body.onkeydown = e => { keys[e.key] = true }
document.body.onkeyup = e => { keys[e.key] = false }