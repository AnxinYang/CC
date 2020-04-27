type Handler = (value: any) => undefined | boolean | Promise<void | boolean>;

const DataMap: Map<string, any> = new Map();
const HandlerMap: Map<string, Map<string, Handler>> = new Map();

export function set(key: string, value: any) {
    DataMap.set(key, value);
    cast(key, value);
    return value;
}

export function get(key: string, defaultValue: any) {
    DataMap.get(key);

    return DataMap.get(key) ?? defaultValue;
}

export function cast(key: string, value: any) {
    let subMap = HandlerMap.get(key);

    if (!subMap) return;

    subMap.forEach(async function (handler, name) {
        let result = await handler(value);
        if (result === false) unbind(`${key}-${name}`)
    });
}

export function bind(key: string, handler: (value: any) => undefined | boolean | Promise<void | boolean>): string;
export function bind(key: string, name: string, string: (value: any) => undefined | boolean | Promise<void | boolean>): string
export function bind(key: string, param: string | Handler, handler?: Handler): string {
    if (!key || !param) return null;

    if (typeof param === 'string') {
        if (!handler) return null;
        return _bind(key, param, handler)
    }

    if (typeof param === 'function') {
        return _bind(key, `${Date.now()}`, handler)
    }

    return null;
}
function _bind(key: string, name: string, handler: Handler) {
    let subMap: Map<string, Handler> = HandlerMap.get(key) ?? new Map();

    subMap.set(name, handler);
    HandlerMap.set(key, subMap);

    return `${key}-${name}`;
}

export function unbind(handlerToken: string) {
    if (!handlerToken) return false;

    let [key, name] = handlerToken.split('-');
    let subMap = HandlerMap.get(key);

    if (!subMap) return false;

    return subMap.delete(name)
}

export function hasHandler(key: string, name: string) {
    if (!key || !name) return false;
    let subMap = HandlerMap.get(key);

    if (!subMap) return false;

    return subMap.has(name);
}

export function hasHandlers(key: string) {
    if (!key) return false;
    return HandlerMap.has(key);
}

export function _getDataMap() {
    return DataMap;
}

export function _getHandlerMap() {
    return HandlerMap;
}