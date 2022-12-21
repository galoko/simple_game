import { vec2 } from "gl-matrix"
import { aimAt } from "./character-utils"
import { createDummyGraphics, Graphics, PhysicsType } from "./graphics"
import { GraphicsObject } from "./object"
import { mulVelocity, raycast, setVelocity, syncPhysicsWithObj } from "./physics"
import { addToScene } from "./scene"

export const TORSO_SLOT = 0
export const ARMS_SLOT = 1
export const HEAD_SLOT = 2
export const WEAPON_SLOT = 3
export const SHOOT_LINE_SLOT = 4
export const EYE_LINE_SLOT = 5

const idle_torso_graphics = new Graphics("idle", "torso_legs")
const idle_arms_graphics = new Graphics("idle", "arms")
const run_torso_graphics = new Graphics("run", "torso_legs")
const aiming_arms_graphics = new Graphics("aiming", "arms")

const oleg_graphics = new Graphics("oleg")

const blaster_graphics = new Graphics("blaster")
const shoot_line_graphics = new Graphics("shoot-line")
const eye_line_graphics = new Graphics("eye-line")

export const FOOT_START = 0.0
export const FOOT_HEIGHT = 0.27
const FOOT_HEIGHT_PADDING = 0.1
export const FOOT_FULL_HEIGHT = FOOT_HEIGHT + FOOT_HEIGHT_PADDING

export async function loadCharacterAnimations() {
    await idle_torso_graphics.load()
    await idle_arms_graphics.load()
    await run_torso_graphics.load()
    await aiming_arms_graphics.load()

    await oleg_graphics.load()

    await blaster_graphics.load()
    await shoot_line_graphics.load()
    await eye_line_graphics.load()
}

const characters: Character[] = []

export class Character {
    private readonly idle_torso = new GraphicsObject(idle_torso_graphics)
    // private readonly idle_arms = new GraphicsObject(idle_arms_graphics)
    private readonly run_torso = new GraphicsObject(run_torso_graphics)
    private readonly aiming_arms = new GraphicsObject(aiming_arms_graphics)

    private readonly head = new GraphicsObject(oleg_graphics)

    private readonly blaster = new GraphicsObject(blaster_graphics)
    private readonly shootLine = new GraphicsObject(shoot_line_graphics)
    private readonly eyeline = new GraphicsObject(eye_line_graphics)

    private readonly objGraphics = createDummyGraphics()
    public readonly obj = new GraphicsObject(this.objGraphics)

    public onBeforePhysics: (() => void) | undefined
    public onAfterPhysics: (() => void) | undefined

    constructor(public readonly name: string) {
        this.objGraphics.physicsType = PhysicsType.DYNAMIC
        this.objGraphics.fixedRotation = true

        const WIDTH = 0.2
        this.objGraphics.physicsPoints = [
            vec2.fromValues(-WIDTH / 2, 0),
            vec2.fromValues(-WIDTH / 2, 0.5),
            vec2.fromValues(0, 1 - FOOT_HEIGHT),
            vec2.fromValues(WIDTH / 2, 0.5),
            vec2.fromValues(WIDTH / 2, 0),
        ]
        this.objGraphics.physicsPivot = vec2.fromValues(0, -1)

        this.obj.attach(TORSO_SLOT, this.idle_torso)

        this.aiming_arms.z = 0.2

        this.head.angle = 1.57
        this.head.z = 0.1
        this.obj.attach(HEAD_SLOT, this.head)

        this.blaster.z = -0.05
        this.obj.attach(WEAPON_SLOT, this.blaster)

        this.shootLine.z = -0.01
        this.obj.attach(SHOOT_LINE_SLOT, this.shootLine)

        this.eyeline.z = -0.01
        this.obj.attach(EYE_LINE_SLOT, this.eyeline)

        this.obj.attach(ARMS_SLOT, this.aiming_arms)

        //

        this.obj.scale = 2
        this.obj.y = -1
    }

    setSpeed(speed: number): void {
        setVelocity(this.obj.body, speed, undefined)

        if (speed === 0) {
            this.obj.attach(TORSO_SLOT, this.idle_torso)
        } else {
            this.obj.attach(TORSO_SLOT, this.run_torso)
        }
    }

    aimAt(p: vec2): void {
        this.obj.attach(ARMS_SLOT, this.aiming_arms)

        aimAt(p, this.aiming_arms, "barrel")

        const oldHeadAngle = this.head.angle
        aimAt(p, this.head, "eyeline")
        if (this.head.angle < -1.1 || this.head.angle > 1.2) {
            this.head.angle = oldHeadAngle
        }
    }

    attachToGround(): void {
        const footStart = FOOT_START * this.obj.scale
        const footHeight = FOOT_FULL_HEIGHT * this.obj.scale

        const footY = this.obj.y - FOOT_HEIGHT * this.obj.scale

        const p = raycast(
            this.obj.x,
            footY - footStart,
            this.obj.x,
            footY + footHeight,
            this.obj.fixture
        )
        if (p) {
            this.obj.y = p[1]
            syncPhysicsWithObj(this.obj)
            mulVelocity(this.obj.body, 0.9, 0)
        }
    }

    beforePhysics(): void {
        this.onBeforePhysics?.()
    }

    afterPhysics(): void {
        this.attachToGround()

        this.onAfterPhysics?.()
    }
}

export function addCharacter(character: Character) {
    addToScene(character.obj)
    characters.push(character)
}

export function charactersBeforePhysics() {
    for (const char of characters) {
        char.beforePhysics()
    }
}

export function charactersAfterPhysics() {
    for (const char of characters) {
        char.afterPhysics()
    }
}
