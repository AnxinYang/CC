export function getCenterOfElement(elem: Element): [number, number] {
    let { x, y, width, height } = elem.getBoundingClientRect();
    return [
        x + width / 2,
        y + height / 2
    ]
}