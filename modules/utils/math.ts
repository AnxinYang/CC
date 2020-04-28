export function rng(min: number = 0, max: number = 1, toFixed: number = 4): number {
    let base = Math.random();
    if (max < min) {
        let t = max;
        max = min;
        min = t
        console.warn(`Min value is larger than max.`)
    }

    let diff = max - min;
    let result = (base * diff + min).toFixed(toFixed);

    return +result;
}