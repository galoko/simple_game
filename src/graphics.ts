/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { vec2, mat2d } from "gl-matrix"

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export type AttachmentPoints = {
    [key: string]: number[]
}

export enum GraphicsType {
    NONE = "none",
    IMG = "img",
    LINE = "line",
}

export enum PhysicsType {
    STATIC = "static",
    DYNAMIC = "dynamic",
    KINEMATIC = "kinematic",
    NONE = "none",
}

export enum PhysicsCategory {
    NONE = "none",
    BULLET = "bullet",
    MEAT = "meat",
    PLATFORM = "platform",
}

export enum PhysicsCategoryBits {
    NONE = 1 << 0,
    BULLET = 1 << 1,
    MEAT = 1 << 2,
    PLATFORM = 1 << 3,
}

export const PhysicsCategoryToBits = new Map<PhysicsCategory, number>()
PhysicsCategoryToBits.set(PhysicsCategory.NONE, PhysicsCategoryBits.NONE)
PhysicsCategoryToBits.set(PhysicsCategory.BULLET, PhysicsCategoryBits.BULLET)
PhysicsCategoryToBits.set(PhysicsCategory.MEAT, PhysicsCategoryBits.MEAT)
PhysicsCategoryToBits.set(PhysicsCategory.PLATFORM, PhysicsCategoryBits.PLATFORM)

export const ALL_MASK = Array.from(PhysicsCategoryToBits.values()).reduce(
    (mask, bits) => mask | bits,
    0
)

export class Graphics {
    public frames: HTMLImageElement[] = []
    public unitMatrix = mat2d.create()
    public invUnitMatrix = mat2d.create()
    public pivot = vec2.create()
    public width = 1
    public height = 1
    public scale = 1
    public attachPoint: string | undefined = undefined
    public attachT = 0
    public points: AttachmentPoints[] = []
    public duration = 1000
    public type = GraphicsType.NONE

    public repeat = true

    public path: Path2D = undefined!
    public color: string = undefined!
    public alpha = 1
    public stroke = true

    public physicsType = PhysicsType.NONE
    public physicsCategory = PhysicsCategoryBits.NONE
    public physicsMaskBits = ALL_MASK
    public physicsPoints: vec2[] = undefined!
    public physicsPivot: vec2 | undefined = undefined
    public fixedRotation = false
    public density = 5
    public friction = 0.5
    public restitution = 0
    public isSensor = false
    public isBullet = false

    constructor(public name: string, public prefix?: string) {}

    async load() {
        const dataUrl = this.prefix
            ? `assets/${this.name}/${this.prefix}.json`
            : `assets/${this.name}.json`
        const response = await fetch(dataUrl)
        const data = response.ok ? await response.json() : {}

        this.type = data.type || GraphicsType.IMG
        this.repeat = data.repeat ?? this.repeat

        if (this.type === GraphicsType.IMG) {
            const promises: Promise<HTMLImageElement>[] = []
            if (data.frames !== undefined) {
                for (let i = 1; i <= data.frames; i++) {
                    promises.push(loadImage(`assets/${this.name}/${this.prefix}_${i}.png`))
                }
            } else {
                const name = !this.prefix
                    ? `assets/${this.name}.png`
                    : `assets/${this.name}/${this.prefix}.png`
                promises.push(loadImage(name))
            }
            this.frames = await Promise.all(promises)
        } else {
            const line = data.line
            this.path = new Path2D()
            this.path.moveTo(line[0], line[1])
            this.path.lineTo(line[2], line[3])
            this.color = data.color
            this.alpha = data.alpha || this.alpha
            this.stroke = this.type === GraphicsType.LINE
        }

        // IN PIXELS
        const firstFrame = this.frames[0]
        const pixelWidth = firstFrame?.width || 1
        const pixelHeight = firstFrame?.height || 1
        mat2d.fromScaling(this.unitMatrix, vec2.fromValues(1 / pixelWidth, 1 / pixelWidth))
        mat2d.invert(this.invUnitMatrix, this.unitMatrix)

        this.width = pixelWidth / pixelWidth
        this.height = pixelHeight / pixelWidth

        // default is [center, bottom]
        const pivot =
            data.pivot || (firstFrame ? [firstFrame.width / 2, firstFrame.height] : [0, 0])

        // physics
        this.physicsType = data.physics || this.physicsType
        this.physicsCategory = PhysicsCategoryToBits.get(data.category) ?? this.physicsCategory
        if (data.mask) {
            this.physicsMaskBits = data.mask.reduce(
                (mask: number, category: PhysicsCategory) =>
                    mask | (PhysicsCategoryToBits.get(category) ?? 0),
                0
            )
        }
        if (data.negativeMask) {
            this.physicsMaskBits =
                ALL_MASK &
                ~data.negativeMask.reduce(
                    (mask: number, category: PhysicsCategory) =>
                        mask | (PhysicsCategoryToBits.get(category) ?? 0),
                    0
                )
        }

        this.isBullet = data.bullet ?? this.isBullet
        this.isSensor = data.sensor ?? this.isSensor

        this.density = data.density ?? this.density
        this.friction = data.friction ?? this.friction
        this.restitution = data.restitution ?? this.restitution

        if (this.physicsType !== PhysicsType.NONE) {
            const physicsPoints: number[] = data.physicsPoints || [
                0,
                0,

                pixelWidth,
                0,

                pixelWidth,
                pixelHeight,

                0,
                pixelHeight,
            ]

            this.physicsPoints = []
            for (let i = 0; i < physicsPoints.length; i += 2) {
                const p = vec2.fromValues(physicsPoints[i + 0], physicsPoints[i + 1])
                vec2.transformMat2d(p, p, this.unitMatrix)
                this.physicsPoints.push(p)
            }
        }

        vec2.set(this.pivot, pivot[0], pivot[1])
        vec2.negate(this.pivot, this.pivot)
        vec2.transformMat2d(this.pivot, this.pivot, this.unitMatrix)

        // IN UNITS
        this.scale = data.scale || this.scale
        this.attachPoint = data.attachPoint
        this.attachT = data.attachT || this.attachT
        this.points = data.points || this.points
        this.duration = data.duration || this.duration
    }

    timeToIndex(time: number): number {
        let t = time / this.duration
        if (this.repeat) {
            t %= 1
        }

        const index = Math.max(
            0,
            Math.min(Math.trunc(t * this.frames.length), this.frames.length - 1)
        )

        return index
    }

    getPoints(index: number): AttachmentPoints {
        return this.points[index]
    }

    getFrame(index: number): HTMLImageElement {
        return this.frames[index]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPath(_index: number): Path2D {
        return this.path
    }
}

export async function createGraphics(name: string, prefix?: string): Promise<Graphics> {
    const graphics = new Graphics(name, prefix)
    await graphics.load()
    return graphics
}

export function createDummyGraphics() {
    return new Graphics("dummy")
}
