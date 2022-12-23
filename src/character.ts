import { vec2 } from "gl-matrix"
import { aimAt } from "./character-utils"
import { createDummyGraphics, Graphics, PhysicsType } from "./graphics"
import { GraphicsObject } from "./object"
import {
    getVelocityX,
    getVelocityY,
    mulVelocity,
    raycast,
    setVelocity,
    syncPhysicsWithObj,
} from "./physics"
import { addToScene, g, g2, vx, y_v0 } from "./scene"

export const TORSO_SLOT = 0
export const ARMS_SLOT = 1
export const HEAD_SLOT = 2
export const WEAPON_SLOT = 3
export const SHOOT_LINE_SLOT = 4
export const EYE_LINE_SLOT = 5

const idle_torso_graphics = new Graphics("idle", "torso_legs")
const idle_arms_graphics = new Graphics("idle", "arms")
const run_torso_graphics = new Graphics("run", "torso_legs")
const fall_torso_graphics = new Graphics("fall", "torso_legs")
const jump_start_torso_graphics = new Graphics("jump_start", "torso_legs")
const aiming_arms_graphics = new Graphics("aiming", "arms")

const oleg_graphics = new Graphics("oleg")

const blaster_graphics = new Graphics("blaster")
const shoot_line_graphics = new Graphics("shoot-line")
const eye_line_graphics = new Graphics("eye-line")

export const FOOT_START = 0.02
export const FOOT_HEIGHT = 0.27
const FOOT_HEIGHT_PADDING = 0.1
export const FOOT_FULL_HEIGHT = FOOT_HEIGHT + FOOT_HEIGHT_PADDING

export async function loadCharacterAnimations() {
    await Promise.all([
        idle_torso_graphics.load(),
        idle_arms_graphics.load(),
        run_torso_graphics.load(),
        fall_torso_graphics.load(),
        jump_start_torso_graphics.load(),
        aiming_arms_graphics.load(),

        oleg_graphics.load(),

        blaster_graphics.load(),
        shoot_line_graphics.load(),
        eye_line_graphics.load(),
    ])
}

const characters: Character[] = []

export class Character {
    private readonly idle_torso = new GraphicsObject(idle_torso_graphics)
    // private readonly idle_arms = new GraphicsObject(idle_arms_graphics)
    private readonly run_torso = new GraphicsObject(run_torso_graphics)
    private readonly fall_torso = new GraphicsObject(fall_torso_graphics)
    private readonly jump_start_torso = new GraphicsObject(jump_start_torso_graphics)
    private readonly aiming_arms = new GraphicsObject(aiming_arms_graphics)

    private readonly head = new GraphicsObject(oleg_graphics)

    private readonly blaster = new GraphicsObject(blaster_graphics)
    private readonly shootLine = new GraphicsObject(shoot_line_graphics)
    private readonly eyeline = new GraphicsObject(eye_line_graphics)

    private readonly objGraphics = createDummyGraphics()
    public readonly obj = new GraphicsObject(this.objGraphics)

    public onBeforePhysics: (() => void) | undefined
    public onAfterPhysics: (() => void) | undefined

    public touchingGround = false
    public isMoving = false
    public movingDirection = 0
    public currentSpeed = 0
    public preparingToJump = false
    public jumpSteps = 0

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
        // this.obj.y = -1
    }

    private updateAnimation() {
        if (this.touchingGround) {
            if (!this.isMoving) {
                if (this.preparingToJump) {
                    this.obj.attach(TORSO_SLOT, this.jump_start_torso)
                } else {
                    this.obj.attach(TORSO_SLOT, this.idle_torso)
                }
            } else {
                this.obj.attach(TORSO_SLOT, this.run_torso)
            }
        } else {
            this.obj.attach(TORSO_SLOT, this.fall_torso)
        }
    }

    setSpeed(speed: number): void {
        setVelocity(this.obj.body, speed, undefined)
        this.currentSpeed = speed
        this.updateAnimation()
    }

    steerSpeed(speed: number): void {
        setVelocity(this.obj.body, getVelocityX(this.obj.body) + speed, undefined)
        this.updateAnimation()
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
        this.touchingGround = false

        if (getVelocityY(this.obj.body) >= -10e-5) {
            const footStart = FOOT_START * this.obj.scale
            const footHeight =
                (this.touchingGround ? FOOT_FULL_HEIGHT : FOOT_HEIGHT) * this.obj.scale

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
                setVelocity(this.obj.body, undefined, 0)

                this.touchingGround = true
            }
        }

        this.updateAnimation()
    }

    beforePhysics(): void {
        this.onBeforePhysics?.()

        if (this.jumpSteps > 0) {
            this.obj.body.SetGravityScale(g / 9.8)
            setVelocity(this.obj.body, vx, y_v0)
            this.jumpSteps--
        }
        if (getVelocityY(this.obj.body) > 10e-4) {
            this.obj.body.SetGravityScale(g2 / 9.8)
        }
    }

    afterPhysics(): void {
        this.attachToGround()

        this.onAfterPhysics?.()
    }

    startJump(): void {
        this.preparingToJump = true
        this.updateAnimation()
    }

    get jumping() {
        return this.jumpSteps > 0
    }

    jump(): void {
        this.jumpSteps = 1
        this.preparingToJump = false
        this.updateAnimation()
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
