let nowValue = performance.now()
let dtValue = 0

export function now(): number {
    return nowValue
}

export function setNow(time: number): void {
    dtValue = (time - nowValue) / 1000
    nowValue = time
}

export function getDT() {
    return dtValue
}
