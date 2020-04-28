type Handler = (value: any) => void | boolean | Promise<void | boolean>;

class DataSet {
    name: string;
    dataMap: Map<string, any> = new Map();
    handlerMap: Map<string, Map<string, Handler>> = new Map();

    set(key: string, value: any) {
        this.dataMap.set(key, value);
        this.cast(key, value);
        return value;
    }

    get(key: string, defaultValue: any) {
        this.dataMap.get(key);

        return this.dataMap.get(key) ?? defaultValue;
    }

    cast(key: string, value: any) {
        let subMap = this.handlerMap.get(key);
        let self = this;

        if (!subMap) return;

        subMap.forEach(async function (handler, name) {
            let result = await handler(value);
            if (result === false) self.unbind(`${key}-${name}`)
        });
    }

    bind(key: string, handler: (value: any) => void | boolean | Promise<void | boolean>): string;
    bind(key: string, name: string, string: (value: any) => void | boolean | Promise<void | boolean>): string
    bind(key: string, param: string | Handler, handler?: Handler): string {
        if (!key || !param) return null;

        if (typeof param === 'string') {
            if (!handler) return null;
            return _bind.call(this, key, param, handler)
        }

        if (typeof param === 'function') {
            return _bind.call(this, key, `${Date.now()}.${(Math.random() * 100).toFixed(0)}`, param)
        }

        return null;
    }

    unbind(handlerToken: string) {
        if (!handlerToken) return false;

        let [key, name] = handlerToken.split('-');
        let subMap = this.handlerMap.get(key);
        let result = true;

        if (!subMap) return false;

        result = subMap.delete(name);

        if (!result) return false;

        if (subMap.size === 0) result = this.handlerMap.delete(key);

        return result
    }

    hasHandler(key: string, name: string) {
        if (!key || !name) return false;
        let subMap = this.handlerMap.get(key);

        if (!subMap) return false;

        return subMap.has(name);
    }

    hasHandlers(key: string) {
        if (!key) return false;
        return this.handlerMap.has(key);
    }

    getdataMap() {
        return this.dataMap;
    }

    gethandlerMap() {
        return this.handlerMap;
    }
}

async function _bind(key: string, name: string, handler: Handler) {
    let result = await handler(this.get(key));
    if (result === false) return;

    let subMap: Map<string, Handler> = this.handlerMap.get(key) ?? new Map();

    subMap.set(name, handler);
    this.handlerMap.set(key, subMap);

    return `${key}-${name}`;
}

export function dataSet() {
    return new DataSet();
}