import { curry } from './curry.js';
/**
 * Identity function returning same value provided as argument.
 */
export function identity(x) {
    return x;
}
/**
 * Check if value is `null` or `undefined`.
 *
 * For same argument, if this function returns `true`, functions `isBoolean`,
 * `isInteger`, `isNumber`, `isString`, `isArray` and `isObject` will return
 * `false`.
 */
export function isNil(x) {
    return x == null;
}
/**
 * Check if value is Boolean.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isInteger`, `isNumber`, `isString`, `isArray` and `isObject` will return
 * `false`.
 */
export function isBoolean(x) {
    return typeof (x) == 'boolean';
}
/**
 * Check if value is Integer.
 *
 * For same argument, if this function returns `true`, function `isNumber` will
 * also return `true`.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isString`, `isArray` and `isObject` will return `false`.
 */
export function isInteger(x) {
    return Number.isInteger(x);
}
/**
 * Check if value is Number.
 *
 * For same argument, if this function returns `true`, function `isInteger` may
 * also return `true` if argument is integer number.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isString`, `isArray` and `isObject` will return `false`.
 */
export function isNumber(x) {
    return typeof (x) == 'number';
}
/**
 * Check if value is String.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isArray`, and `isObject` will return
 * `false`.
 */
export function isString(x) {
    return typeof (x) == 'string';
}
/**
 * Check if value is Array.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isString`, and `isObject` will return
 * `false`.
 */
export function isArray(x) {
    return Array.isArray(x);
}
/**
 * Check if value is Object.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isString`, and `isArray` will return
 * `false`.
 */
export function isObject(x) {
    return typeof (x) == 'object' && !isArray(x) && !isNil(x);
}
/**
 * Strictly parse integer from string
 *
 * If provided string doesn't represent integer value, `NaN` is returned.
 */
export function strictParseInt(value) {
    if (/^(-|\+)?([0-9]+)$/.test(value))
        return Number(value);
    return NaN;
}
/**
 * Strictly parse floating point number from string
 *
 * If provided string doesn't represent valid number, `NaN` is returned.
 */
export function strictParseFloat(value) {
    if (/^(-|\+)?([0-9]+(\.[0-9]+)?)$/.test(value))
        return Number(value);
    return NaN;
}
/**
 * Create new deep copy of input value.
 *
 * In case of Objects or Arrays, new instances are created with elements
 * obtained by recursivly calling `clone` in input argument values.
 */
export function clone(x) {
    if (isArray(x))
        return Array.from(x, clone);
    if (isObject(x)) {
        const ret = {};
        for (const i in x)
            ret[i] = clone(x[i]);
        return ret;
    }
    return x;
}
/**
 * Combine two arrays in single array of pairs
 *
 * The returned array is truncated to the length of the shorter of the two
 * input arrays.
 */
export function zip(arr1, arr2) {
    return Array.from((function* () {
        for (let i = 0; i < arr1.length && i < arr2.length; ++i)
            yield [arr1[i], arr2[i]];
    })());
}
/**
 * Convert object to array of key, value pairs
 */
export function toPairs(obj) {
    return Object.entries(obj);
}
/**
 * Convert array of key, value pairs to object
 */
export function fromPairs(arr) {
    return Object.fromEntries(arr);
}
/**
 * Flatten nested arrays.
 *
 * Create array with same elements as in input array where all elements which
 * are also arrays are replaced with elements of resulting recursive
 * application of flatten function.
 *
 * If argument is not an array, function returns the argument encapsulated in
 * an array.
 */
export function flatten(arr) {
    return isArray(arr) ? arr.flat(Infinity) : [arr];
}
/**
 * Create function which applies list of functions to same arguments and
 * return list of results.
 */
export function flap(...fns) {
    return (...args) => fns.map(fn => fn(...args));
}
/**
 * Deep object equality
 */
export function _equals(x, y) {
    if (x === y)
        return true;
    if (typeof (x) != 'object' ||
        typeof (y) != 'object' ||
        x === null ||
        y === null)
        return false;
    if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length != y.length)
            return false;
        for (let i = 0; i < x.length && i < y.length; ++i) {
            if (!_equals(x[i], y[i]))
                return false;
        }
        return true;
    }
    else if (!Array.isArray(x) && !Array.isArray(y)) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (const key in x) {
            if (!(key in y))
                return false;
        }
        for (const key in x) {
            if (!_equals(x[key], y[key]))
                return false;
        }
        return true;
    }
    return false;
}
/**
 * Curried `_equals`
 */
export const equals = curry(_equals);
/**
 * Create array by repeating same value
 */
export function _repeat(x, n) {
    return Array.from({ length: n }, _ => x);
}
/**
 * Curried `_repeat`
 */
export const repeat = curry(_repeat);
/**
 * Sort array
 *
 * Comparison function receives two arguments representing array elements and
 * should return:
 *   - negative number in case first argument is more significant then second
 *   - zero in case first argument is equaly significant as second
 *   - positive number in case first argument is less significant then second
 */
export function _sort(fn, arr) {
    return Array.from(arr).sort(fn);
}
/**
 * Curried `_sort`
 */
export const sort = curry(_sort);
/**
 * Sort array based on results of appling function to it's elements
 *
 * Resulting order is determined by comparring function application results
 * with greater then and lesser then operators.
 */
export function _sortBy(fn, arr) {
    return _sort((x, y) => {
        const xVal = fn(x);
        const yVal = fn(y);
        if (xVal < yVal)
            return -1;
        if (xVal > yVal)
            return 1;
        return 0;
    }, arr);
}
/**
 * Curried `_sortBy`
 */
export const sortBy = curry(_sortBy);
/**
 * Create object containing only subset of selected properties
 */
export function _pick(arr, obj) {
    const ret = {};
    for (const i of arr) {
        if (i in obj) {
            ret[i] = obj[i];
        }
    }
    return ret;
}
/**
 * Curried `_pick`
 */
export const pick = curry(_pick);
export function _map(fn, x) {
    if (isArray(x))
        return x.map(fn);
    const res = {};
    for (const k in x)
        res[k] = fn(x[k], k, x);
    return res;
}
/**
 * Curried `_map`
 */
export const map = curry(_map);
/**
 * Change array to contain only elements for which function returns `true`
 */
export function _filter(fn, arr) {
    return arr.filter(fn);
}
/**
 * Curried `_filter`
 */
export const filter = curry(_filter);
/**
 * Append value to end of array
 */
export function _append(val, arr) {
    return [...arr, val];
}
/**
 * Curried `_append`
 */
export const append = curry(_append);
export function _reduce(fn, val, x) {
    if (isArray(x))
        return x.reduce(fn, val);
    let acc = val;
    for (const k in x)
        acc = fn(acc, x[k], k, x);
    return acc;
}
/**
 * Curried `_reduce`
 */
export const reduce = curry(_reduce);
/**
 * Merge two objects
 *
 * If same property exist in both arguments, second argument's value is used
 * as resulting value
 */
export function _merge(x, y) {
    return Object.assign({}, x, y);
}
/**
 * Curried `_merge`
 */
export const merge = curry(_merge);
/**
 * Merge multiple objects
 *
 * If same property exist in multiple arguments, value from the last argument
 * containing that property is used
 */
export function mergeAll(objs) {
    return Object.assign({}, ...objs);
}
export function _find(fn, x) {
    if (isArray(x))
        return x.find(fn);
    for (const k in x)
        if (fn(x[k], k, x))
            return x[k];
}
/**
 * Curried `_find`
 */
export const find = curry(_find);
export function _findIndex(fn, x) {
    if (isArray(x)) {
        const index = x.findIndex(fn);
        return (index >= 0 ? index : undefined);
    }
    for (const k in x)
        if (fn(x[k], k, x))
            return k;
}
/**
 * Curried `_findIndex`
 */
export const findIndex = curry(_findIndex);
/**
 * Concatenate two arrays
 */
export function _concat(x, y) {
    return x.concat(y);
}
/**
 * Curried `_concat`
 */
export const concat = curry(_concat);
/**
 * Create union of two arrays using `equals` to check equality
 */
export function _union(x, y) {
    const result = [];
    for (const arr of [x, y])
        for (const i of arr)
            if (!_find(equals(i), result))
                result.push(i);
    return result;
}
/**
 * Curried `_union`
 */
export const union = curry(_union);
/**
 * Check if array contains value using `equals` to check equality
 *
 * TODO: add support for objects (should we check for keys or values?)
 */
export function _contains(val, arr) {
    for (const i of arr)
        if (_equals(val, i))
            return true;
    return false;
}
/**
 * Curried `_contains`
 */
export const contains = curry(_contains);
/**
 * Insert value into array on specified index
 */
export function _insert(idx, val, arr) {
    return [...arr.slice(0, idx), val, ...arr.slice(idx)];
}
/**
 * Curried `_insert`
 */
export const insert = curry(_insert);
/**
 * Get array slice
 */
export function _slice(begin, end, arr) {
    return arr.slice(begin, (end != null ? end : undefined));
}
/**
 * Curried `_slice`
 */
export const slice = curry(_slice);
/**
 * Reverse array
 */
export function reverse(arr) {
    return Array.from(arr).reverse();
}
/**
 * Array length
 */
export function length(arr) {
    return arr.length;
}
/**
 * Increment value
 */
export function inc(val) {
    return val + 1;
}
/**
 * Decrement value
 */
export function dec(val) {
    return val - 1;
}
/**
 * Logical not
 */
export function not(val) {
    return !val;
}
