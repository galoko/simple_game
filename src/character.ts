import { vec2 } from "gl-matrix"
import { aimAt } from "./character-utils"
import {
    ALL_MASK,
    createDummyGraphics,
    Graphics,
    PhysicsCategory,
    PhysicsCategoryBits,
    PhysicsType,
} from "./graphics"
import { getAngleFromMatrix, rotate } from "./math-utils"
import { addBloodStain, generateMeatExplosion } from "./meat-explosion"
import { GraphicsObject } from "./object"
import { getAttachmentWorldMatrix } from "./object-utils"
import {
    getVelocityX,
    getVelocityY,
    GRAVITY,
    raycast,
    setGravityScale,
    setVelocity,
    syncPhysicsWithObj,
} from "./physics"
import { addToScene, removeFromScene, scheduleToRemove } from "./scene"
import { getDT, now } from "./time"

export const TORSO_SLOT = 0
export const ARMS_SLOT = 1
export const HEAD_SLOT = 2
export const WEAPON_SLOT = 3
export const SHOOT_LINE_SLOT = 4
export const EYE_LINE_SLOT = 5
export const BLAST_SLOT = 6

export const mountains_graphics = new Graphics("mountains")
export const platform_graphics = new Graphics("platform")
export const blood_graphics = new Graphics("blood")

const idle_torso_graphics = new Graphics("idle", "torso_legs")
const idle_arms_graphics = new Graphics("idle", "arms")
const run_torso_graphics = new Graphics("run", "torso_legs")
const fall_torso_graphics = new Graphics("fall", "torso_legs")
const jump_start_torso_graphics = new Graphics("jump_start", "torso_legs")
const aiming_arms_graphics = new Graphics("aiming", "arms")

export const oleg_graphics = new Graphics("heads", "oleg")
export const misha_graphics = new Graphics("heads", "misha")
export const generic_head_graphics = new Graphics("heads", "generic_head")

const blaster_graphics = new Graphics("blaster")
const bullet_graphics = new Graphics("bullet", "bullet")
const blast_graphics = new Graphics("blast", "blast")
const shoot_line_graphics = new Graphics("shoot-line")
const eye_line_graphics = new Graphics("eye-line")

export const meat_piece_graphics = new Graphics("blood", "meat_piece")
export const small_meat_piece_graphics = new Graphics("blood", "small_meat_piece")
export const meat_on_bone_graphics = new Graphics("blood", "meat_on_bone")
export const eye_ball_graphics = new Graphics("blood", "eye_ball")

export const FOOT_START = 0.02
export const FOOT_HEIGHT = 0.27
const FOOT_HEIGHT_PADDING = 0.1
export const FOOT_FULL_HEIGHT = FOOT_HEIGHT + FOOT_HEIGHT_PADDING

export async function loadCharacterAnimations() {
    await Promise.all([
        mountains_graphics.load(),
        platform_graphics.load(),
        blood_graphics.load(),

        idle_torso_graphics.load(),
        idle_arms_graphics.load(),
        run_torso_graphics.load(),
        fall_torso_graphics.load(),
        jump_start_torso_graphics.load(),
        aiming_arms_graphics.load(),

        oleg_graphics.load(),
        misha_graphics.load(),
        generic_head_graphics.load(),

        blaster_graphics.load(),
        blast_graphics.load(),
        bullet_graphics.load(),
        shoot_line_graphics.load(),
        eye_line_graphics.load(),

        meat_piece_graphics.load(),
        small_meat_piece_graphics.load(),
        meat_on_bone_graphics.load(),
        eye_ball_graphics.load(),
    ])
}

const characters = new Set<Character>()

export const MAX_SPEED_ON_FOOT = 7
export const ACCELERATION_ON_FOOT = MAX_SPEED_ON_FOOT / 0.25
export const ACCELERATION_IN_AIR = ACCELERATION_ON_FOOT * 1

export class Character {
    private readonly idle_torso = new GraphicsObject(idle_torso_graphics)
    // private readonly idle_arms = new GraphicsObject(idle_arms_graphics)
    private readonly run_torso = new GraphicsObject(run_torso_graphics)
    private readonly fall_torso = new GraphicsObject(fall_torso_graphics)
    private readonly jump_start_torso = new GraphicsObject(jump_start_torso_graphics)
    private readonly aiming_arms = new GraphicsObject(aiming_arms_graphics)

    private readonly head

    private readonly blaster = new GraphicsObject(blaster_graphics)
    private readonly blast = new GraphicsObject(blast_graphics)
    private readonly shootLine = new GraphicsObject(shoot_line_graphics)
    private readonly eyeline = new GraphicsObject(eye_line_graphics)

    private readonly objGraphics = createDummyGraphics()
    public readonly obj = new GraphicsObject(this.objGraphics)

    public onBeforePhysics: (() => void) | undefined
    public onAfterPhysics: (() => void) | undefined

    private pointToAim: vec2 | undefined = undefined

    public touchingGround = false
    public isMoving = false
    public movingDirection = 0
    public currentSpeed = 0

    public preparingToJump = false
    public isJumping = false
    public gravityForJumpFall = 0
    public lastTouchgroundTimestamp = 0

    public isAlive = true

    constructor(public readonly name: string, head: Graphics) {
        this.obj.character = this
        this.obj.physicsGroupIndex = -this.obj.id

        this.objGraphics.physicsType = PhysicsType.DYNAMIC
        this.objGraphics.fixedRotation = true
        this.objGraphics.friction = 0

        const WIDTH = 0.1
        this.objGraphics.physicsPoints = [
            vec2.fromValues(-WIDTH / 2, 0),
            vec2.fromValues(-WIDTH / 2, 0.5),
            vec2.fromValues(0, 1 - FOOT_HEIGHT),
            vec2.fromValues(WIDTH / 2, 0.5),
            vec2.fromValues(WIDTH / 2, 0),
        ]
        this.objGraphics.physicsPivot = vec2.fromValues(0, -1)
        this.objGraphics.physicsMaskBits = ALL_MASK & ~PhysicsCategoryBits.PLATFORM

        this.obj.attach(TORSO_SLOT, this.idle_torso)

        this.aiming_arms.z = 0.2

        this.head = new GraphicsObject(head)
        this.head.angle = 1.57
        this.head.z = 0.1
        this.obj.attach(HEAD_SLOT, this.head)

        this.blaster.z = -0.05
        this.obj.attach(WEAPON_SLOT, this.blaster)

        this.shootLine.z = -0.01
        this.obj.attach(SHOOT_LINE_SLOT, this.shootLine)

        this.eyeline.z = -0.01
        // this.obj.attach(EYE_LINE_SLOT, this.eyeline)

        this.obj.attach(ARMS_SLOT, this.aiming_arms)

        //

        this.obj.scale = 2
        // this.obj.y = -1

        this.onBeforePhysics = () => {
            this.changeSpeed(0)
        }
    }

    public changeSpeed(dstVelocity: number, velocityMul = 1) {
        const dstDirection = Math.sign(dstVelocity)
        this.movingDirection = dstDirection

        const velX = getVelocityX(this.obj) * velocityMul

        const delta = dstVelocity - velX
        const direction = Math.sign(delta)
        const speed = Math.abs(delta)

        const acceleration = this.touchingGround ? ACCELERATION_ON_FOOT : ACCELERATION_IN_AIR

        const dt = getDT()
        const velocityDiff = direction * Math.min(acceleration * dt, speed)
        const newVelocityX = velX + velocityDiff

        const cappedVelocityX =
            dstDirection * Math.min(newVelocityX * dstDirection, MAX_SPEED_ON_FOOT)

        setVelocity(this.obj, cappedVelocityX, undefined)
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
        setVelocity(this.obj, speed, undefined)
        this.currentSpeed = speed
        this.updateAnimation()
    }

    steerSpeed(speed: number): void {
        setVelocity(this.obj, getVelocityX(this.obj) + speed, undefined)
        this.updateAnimation()
    }

    aimAt(p: vec2): void {
        this.pointToAim = p
    }

    shoot(): void {
        const m = getAttachmentWorldMatrix(this.obj, "barrel", 1)
        if (!m) {
            return
        }

        const p = vec2.create()
        vec2.transformMat2d(p, p, m)
        const angle =
            getAngleFromMatrix(m) * (this.obj.mirror ? -1 : 1) + (this.obj.mirror ? Math.PI : 0)

        const bullet = new GraphicsObject(bullet_graphics)
        bullet.angle = angle
        bullet.x = p[0]
        bullet.y = p[1]
        bullet.physicsGroupIndex = -this.obj.id

        bullet.onContactPresolve = contact => {
            contact.SetEnabled(false)
        }

        bullet.onContactStart = (contact, otherObj) => {
            removeFromScene(bullet)

            const character = otherObj.character
            if (character && character.isAlive) {
                character.isAlive = false
                addBloodStain(character)
                removeCharacter(character)
                generateMeatExplosion(character)
            }
        }

        addToScene(bullet)

        scheduleToRemove(bullet, 5000)

        setGravityScale(bullet, 0)

        const v = rotate(vec2.fromValues(20, 0), angle)
        setVelocity(bullet, getVelocityX(this.obj) + v[0], getVelocityY(this.obj) + v[1])

        this.obj.attach(BLAST_SLOT, this.blast)
        this.blast.reset()
    }

    attachToGround(): void {
        this.touchingGround = false

        if (getVelocityY(this.obj) >= -10e-5) {
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
                setVelocity(this.obj, undefined, 0)

                this.touchingGround = true
                this.isJumping = false
                this.lastTouchgroundTimestamp = now()
            }
        }

        this.updateAnimation()
    }

    applyAim() {
        const p = this.pointToAim
        if (!p) {
            return
        }

        this.obj.attach(ARMS_SLOT, this.aiming_arms)

        aimAt(p, this.aiming_arms, "barrel")

        const oldHeadAngle = this.head.angle
        aimAt(p, this.head, "eyeline")
        if (this.head.angle < -1.1 || this.head.angle > 1.2) {
            this.head.angle = oldHeadAngle
        }
    }

    beforePhysics(): void {
        this.onBeforePhysics?.()

        if (this.isJumping) {
            // is decending?
            if (getVelocityY(this.obj) > 10e-4) {
                setGravityScale(this.obj, this.gravityForJumpFall / GRAVITY)
            }
        } else {
            setGravityScale(this.obj, 2)
        }
    }

    afterPhysics(): void {
        this.attachToGround()

        this.onAfterPhysics?.()

        this.applyAim()
    }

    startJump(): void {
        this.preparingToJump = true
        this.updateAnimation()
    }

    cancelJump(): void {
        this.preparingToJump = false
    }

    jump(jumpPower: number): void {
        this.preparingToJump = false

        const velX = getVelocityX(this.obj)

        const jumpDistance = velX * 0.5 * jumpPower // horizontal distance for jump
        const jumpHeight = -2.2 * jumpPower // height for jump

        let th = jumpDistance / velX
        if (isNaN(th)) {
            th = 0.4 * jumpPower
        }

        // vertical speed
        const velocityForJump = (2 * jumpHeight) / th
        const gravityForJump = (-2 * jumpHeight) / (th * th)
        this.gravityForJumpFall = gravityForJump * 1.2

        setGravityScale(this.obj, gravityForJump / GRAVITY)
        setVelocity(this.obj, undefined, velocityForJump)

        this.isJumping = true

        this.updateAnimation()
    }
}

export function addCharacter(character: Character) {
    addToScene(character.obj)
    characters.add(character)
}

export function removeCharacter(character: Character) {
    characters.delete(character)
    removeFromScene(character.obj)
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
