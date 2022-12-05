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

export class Graphics {
    public frames: HTMLImageElement[] = []
    public unitMatrix = mat2d.create()
    public pivotMatrix = mat2d.create()
    public invPivotMatrix = mat2d.create()
    public scale = 1
    public attachPoint: string | undefined = undefined
    public attachT = 0
    public points: AttachmentPoints[] = []
    public duration = 1000

    constructor(public name: string, public prefix?: string) {}

    async load() {
        const dataUrl = this.prefix
            ? `assets/${this.name}/${this.prefix}.json`
            : `assets/${this.name}.json`
        const response = await fetch(dataUrl)
        const data = response.ok ? await response.json() : {}

        const promises: Promise<HTMLImageElement>[] = []
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
        const pixelSize = firstFrame.width
        mat2d.fromScaling(this.unitMatrix, vec2.fromValues(1 / pixelSize, 1 / pixelSize))

        // default is [center, bottom]
        const pivot = data.pivot || [firstFrame.width / 2, firstFrame.height]

        const v = vec2.create()
        vec2.negate(v, pivot)
        vec2.transformMat2d(v, v, this.unitMatrix)
        mat2d.translate(this.pivotMatrix, this.pivotMatrix, v)
        mat2d.invert(this.invPivotMatrix, this.pivotMatrix)

        // IN UNITS
        this.scale = data.scale || this.scale
        this.attachPoint = data.attachPoint
        this.attachT = data.attachT || this.attachT
        this.points = data.points || this.points
        this.duration = data.duration || this.duration
    }

    getFrameAndPoints(time: number): [HTMLImageElement, AttachmentPoints] {
        const index = Math.max(
            0,
            Math.min(
                Math.trunc(((time / this.duration) % 1) * this.frames.length),
                this.frames.length - 1
            )
        )
        return [this.frames[index], this.points[index]]
    }
}

export async function createGraphics(name: string, prefix?: string): Promise<Graphics> {
    const graphics = new Graphics(name, prefix)
    await graphics.load()
    return graphics
}
