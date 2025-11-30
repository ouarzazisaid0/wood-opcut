import { curry } from './curry.js';
import { isArray, isObject, strictParseInt, equals, clone } from './misc.js';
export const patch = curry((diff, data) => {
    const reducer = (acc, i) => operations[i.op](i, acc);
    // return diff.reduce(reducer, data);
    return diff.reduce(reducer, clone(data));
});
function opAdd(op, data) {
    const path = parsePointer(op.path);
    return _add(path, op.value, data);
}
function opRemove(op, data) {
    const path = parsePointer(op.path);
    return _remove(path, data);
}
function opReplace(op, data) {
    const path = parsePointer(op.path);
    return _replace(path, op.value, data);
}
function opMove(op, data) {
    const from = parsePointer(op.from);
    const path = parsePointer(op.path);
    if (path.length > from.length && equals(from, path.slice(0, from.length)))
        throw Error("path can't be child of from");
    const val = _get(from, data);
    return _add(path, val, _remove(from, data));
}
function opCopy(op, data) {
    const from = parsePointer(op.from);
    const path = parsePointer(op.path);
    const val = _get(from, data);
    return _add(path, val, data);
}
function opTest(op, data) {
    const path = parsePointer(op.path);
    const val = _get(path, data);
    if (!equals(val, op.value))
        throw Error("invalid value");
    return data;
}
const operations = {
    add: opAdd,
    remove: opRemove,
    replace: opReplace,
    move: opMove,
    copy: opCopy,
    test: opTest
};
function unescapePointerSegment(segment) {
    return segment.replaceAll('~1', '/').replaceAll('~0', '~');
}
function parsePointer(pointer) {
    if (pointer == '')
        return [];
    const segments = pointer.split('/');
    if (segments[0] != '')
        throw Error("invalid pointer");
    return segments.slice(1).map(unescapePointerSegment);
}
function _add(path, val, data) {
    if (path.length < 1)
        return val;
    const key = path[0];
    if (path.length < 2) {
        if (isArray(data)) {
            if (key == '-') {
                // return [...data, val];
                data.push(val);
                return data;
            }
            const index = strictParseInt(key);
            if (Number.isNaN(index) || index > data.length || index < 0)
                throw Error("invalid array index");
            // return [
            //     ..._islice(0, index, data),
            //     val,
            //     ..._islice(index, null, data)
            // ];
            data.splice(index, 0, val);
            return data;
        }
        if (isObject(data)) {
            // return Object.assign({}, data, {[key]: val});
            data[key] = val;
            return data;
        }
        throw Error("invalid data type");
    }
    if (isArray(data)) {
        const index = strictParseInt(key);
        if (Number.isNaN(index) || index > data.length - 1 || index < 0)
            throw Error("invalid array index");
        // return [
        //     ..._islice(0, index, data),
        //     _add(path.slice(1), val, data[index]),
        //     ..._islice(index + 1, null, data)
        // ];
        _add(path.slice(1), val, data[index]);
        return data;
    }
    if (isObject(data)) {
        if (!(key in data))
            throw Error("invalid object key");
        // return Object.assign(
        //     {}, data, {[key]: _add(path.slice(1), val, data[key])}
        // );
        _add(path.slice(1), val, data[key]);
        return data;
    }
    throw Error("invalid data type");
}
function _remove(path, data) {
    if (path.length < 1)
        return null;
    const key = path[0];
    if (path.length < 2) {
        if (isArray(data)) {
            const index = strictParseInt(key);
            if (Number.isNaN(index) || index > data.length - 1 || index < 0)
                throw Error("invalid array index");
            // return [
            //     ..._islice(0, index, data),
            //     ..._islice(index + 1, null, data)
            // ];
            data.splice(index, 1);
            return data;
        }
        if (isObject(data)) {
            if (!(key in data))
                throw Error("invalid object key");
            // const ret = Object.assign({}, data);
            // delete ret[key];
            // return ret;
            delete data[key];
            return data;
        }
        throw Error("invalid data type");
    }
    if (isArray(data)) {
        const index = strictParseInt(key);
        if (Number.isNaN(index) || index > data.length - 1 || index < 0)
            throw Error("invalid array index");
        // return [
        //     ..._islice(0, index, data),
        //     _remove(path.slice(1), data[index]),
        //     ..._islice(index + 1, null, data)
        // ];
        _remove(path.slice(1), data[index]);
        return data;
    }
    if (isObject(data)) {
        if (!(key in data))
            throw Error("invalid object key");
        // return Object.assign(
        //     {}, data, {[key]: _remove(path.slice(1), data[key])}
        // );
        _remove(path.slice(1), data[key]);
        return data;
    }
    throw Error("invalid data type");
}
function _replace(path, val, data) {
    if (path.length < 1)
        return val;
    const key = path[0];
    if (path.length < 2) {
        if (isArray(data)) {
            const index = strictParseInt(key);
            if (Number.isNaN(index) || index > data.length - 1 || index < 0)
                throw Error("invalid array index");
            // return [
            //     ..._islice(0, index, data),
            //     val,
            //     ..._islice(index + 1, null, data)
            // ];
            data[index] = val;
            return data;
        }
        if (isObject(data)) {
            if (!(key in data))
                throw Error("invalid object key");
            // return Object.assign({}, data, {[key]: val});
            data[key] = val;
            return data;
        }
        throw Error("invalid data type");
    }
    if (isArray(data)) {
        const index = strictParseInt(key);
        if (Number.isNaN(index) || index > data.length - 1 || index < 0)
            throw Error("invalid array index");
        // return [
        //     ..._islice(0, index, data),
        //     _replace(path.slice(1), val, data[index]),
        //     ..._islice(index + 1, null, data)
        // ];
        _replace(path.slice(1), val, data[index]);
        return data;
    }
    if (isObject(data)) {
        if (!(key in data))
            throw Error("invalid object key");
        // return Object.assign(
        //     {}, data, {[key]: _replace(path.slice(1), val, data[key])}
        // );
        _replace(path.slice(1), val, data[key]);
        return data;
    }
    throw Error("invalid data type");
}
function _get(path, data) {
    if (path.length < 1)
        return data;
    const key = path[0];
    if (isArray(data)) {
        const index = strictParseInt(key);
        if (Number.isNaN(index) || index > data.length - 1 || index < 0)
            throw Error("invalid array index");
        return _get(path.slice(1), data[index]);
    }
    if (isObject(data)) {
        if (!(key in data))
            throw Error("invalid object key");
        return _get(path.slice(1), data[key]);
    }
    throw Error("invalid data type");
}
