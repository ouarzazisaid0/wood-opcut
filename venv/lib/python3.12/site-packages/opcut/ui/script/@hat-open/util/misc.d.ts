import { Curried1, Curried2, Curried3 } from './curry.js';
/**
 * Identity function returning same value provided as argument.
 */
export declare function identity<T>(x: T): T;
/**
 * Check if value is `null` or `undefined`.
 *
 * For same argument, if this function returns `true`, functions `isBoolean`,
 * `isInteger`, `isNumber`, `isString`, `isArray` and `isObject` will return
 * `false`.
 */
export declare function isNil(x: unknown): x is (null | undefined);
/**
 * Check if value is Boolean.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isInteger`, `isNumber`, `isString`, `isArray` and `isObject` will return
 * `false`.
 */
export declare function isBoolean(x: unknown): x is boolean;
/**
 * Check if value is Integer.
 *
 * For same argument, if this function returns `true`, function `isNumber` will
 * also return `true`.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isString`, `isArray` and `isObject` will return `false`.
 */
export declare function isInteger(x: unknown): x is number;
/**
 * Check if value is Number.
 *
 * For same argument, if this function returns `true`, function `isInteger` may
 * also return `true` if argument is integer number.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isString`, `isArray` and `isObject` will return `false`.
 */
export declare function isNumber(x: unknown): x is number;
/**
 * Check if value is String.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isArray`, and `isObject` will return
 * `false`.
 */
export declare function isString(x: unknown): x is string;
/**
 * Check if value is Array.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isString`, and `isObject` will return
 * `false`.
 */
export declare function isArray(x: unknown): x is unknown[];
/**
 * Check if value is Object.
 *
 * For same argument, if this function returns `true`, functions `isNil`,
 * `isBoolean`, `isInteger`, `isNumber`, `isString`, and `isArray` will return
 * `false`.
 */
export declare function isObject(x: unknown): x is Record<string, unknown>;
/**
 * Strictly parse integer from string
 *
 * If provided string doesn't represent integer value, `NaN` is returned.
 */
export declare function strictParseInt(value: string): number;
/**
 * Strictly parse floating point number from string
 *
 * If provided string doesn't represent valid number, `NaN` is returned.
 */
export declare function strictParseFloat(value: string): number;
/**
 * Create new deep copy of input value.
 *
 * In case of Objects or Arrays, new instances are created with elements
 * obtained by recursivly calling `clone` in input argument values.
 */
export declare function clone<T>(x: T): T;
/**
 * Combine two arrays in single array of pairs
 *
 * The returned array is truncated to the length of the shorter of the two
 * input arrays.
 */
export declare function zip<T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][];
/**
 * Convert object to array of key, value pairs
 */
export declare function toPairs<T>(obj: Record<string, T>): [string, T][];
/**
 * Convert array of key, value pairs to object
 */
export declare function fromPairs<T>(arr: [string, T][]): Record<string, T>;
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
export declare function flatten(arr: any): any[];
/**
 * Create function which applies list of functions to same arguments and
 * return list of results.
 */
export declare function flap<T extends [...any]>(...fns: ((...args: T) => any)[]): ((...args: T) => any[]);
/**
 * Deep object equality
 */
export declare function _equals(x: any, y: any): boolean;
/**
 * Curried `_equals`
 */
export declare const equals: Curried2<any, any, boolean>;
/**
 * Create array by repeating same value
 */
export declare function _repeat<T>(x: T, n: number): T[];
/**
 * Curried `_repeat`
 */
export declare const repeat: {
    <T>(): Curried2<T, number, T[]>;
    <T_1>(x: T_1): Curried1<number, T_1[]>;
    <T_2>(x: T_2, n: number): T_2[];
};
/**
 * Sort array
 *
 * Comparison function receives two arguments representing array elements and
 * should return:
 *   - negative number in case first argument is more significant then second
 *   - zero in case first argument is equaly significant as second
 *   - positive number in case first argument is less significant then second
 */
export declare function _sort<T>(fn: ((x: T, y: T) => number), arr: T[]): T[];
/**
 * Curried `_sort`
 */
export declare const sort: {
    <T>(): Curried2<((x: T, y: T) => number), T[], T[]>;
    <T_1>(fn: (x: T_1, y: T_1) => number): Curried1<T_1[], T_1[]>;
    <T_2>(fn: (x: T_2, y: T_2) => number, arr: T_2[]): T_2[];
};
/**
 * Sort array based on results of appling function to it's elements
 *
 * Resulting order is determined by comparring function application results
 * with greater then and lesser then operators.
 */
export declare function _sortBy<T>(fn: ((x: T) => any), arr: T[]): T[];
/**
 * Curried `_sortBy`
 */
export declare const sortBy: {
    <T>(): Curried2<((x: T) => any), T[], T[]>;
    <T_1>(fn: (x: T_1) => any): Curried1<T_1[], T_1[]>;
    <T_2>(fn: (x: T_2) => any, arr: T_2[]): T_2[];
};
/**
 * Create object containing only subset of selected properties
 */
export declare function _pick<T extends Record<string, any>>(arr: (keyof T)[], obj: T): T;
/**
 * Curried `_pick`
 */
export declare const pick: {
    <T extends Record<string, any>>(): Curried2<string[], T, T>;
    <T_1 extends Record<string, any>>(arr: string[]): Curried1<T_1, T_1>;
    <T_2 extends Record<string, any>>(arr: string[], obj: T_2): T_2;
};
/**
 * Change array or object by appling function to it's elements
 *
 * For each element, provided function is called with element value,
 * index/key and original container.
 */
export declare function _map<T1, T2>(fn: ((val: T1, index?: number, arr?: T1[]) => T2), arr: T1[]): T2[];
export declare function _map<T1, T2>(fn: ((val: T1, key?: string, obj?: Record<string, T1>) => T2), obj: Record<string, T1>): Record<string, T2>;
/**
 * Curried `_map`
 */
export declare const map: {
    <T1, T2>(): (Curried2<((val: T1, index?: number, arr?: T1[]) => T2), T1[], T2[]> | Curried2<((val: T1, key?: string, obj?: Record<string, T1>) => T2), Record<string, T1>, Record<string, T2>>);
    <T1_1, T2_1>(fn: (val: T1_1, index?: number, arr?: T1_1[] | undefined) => T2_1): Curried1<T1_1[], T2_1[]>;
    <T1_2, T2_2>(fn: (val: T1_2, key?: string, obj?: Record<string, T1_2> | undefined) => T2_2): Curried1<Record<string, T1_2>, Record<string, T2_2>>;
    <T1_3, T2_3>(fn: (val: T1_3, index?: number, arr?: T1_3[] | undefined) => T2_3, arr: T1_3[]): T2_3[];
    <T1_4, T2_4>(fn: (val: T1_4, key?: string, obj?: Record<string, T1_4> | undefined) => T2_4, obj: Record<string, T1_4>): Record<string, T2_4>;
};
/**
 * Change array to contain only elements for which function returns `true`
 */
export declare function _filter<T>(fn: ((val: T) => boolean), arr: T[]): T[];
/**
 * Curried `_filter`
 */
export declare const filter: {
    <T>(): Curried2<((val: T) => boolean), T[], T[]>;
    <T_1>(fn: (val: T_1) => boolean): Curried1<T_1[], T_1[]>;
    <T_2>(fn: (val: T_2) => boolean, arr: T_2[]): T_2[];
};
/**
 * Append value to end of array
 */
export declare function _append<T>(val: T, arr: T[]): T[];
/**
 * Curried `_append`
 */
export declare const append: {
    <T>(): Curried2<T, T[], T[]>;
    <T_1>(val: T_1): Curried1<T_1[], T_1[]>;
    <T_2>(val: T_2, arr: T_2[]): T_2[];
};
/**
 * Reduce array or object by appling function
 *
 * For each element, provided function is called with accumulator,
 * elements value, element index/key and original container.
 */
export declare function _reduce<T1, T2>(fn: ((acc: T2, val: T1, index?: number, arr?: T1[]) => T2), val: T2, arr: T1[]): T2;
export declare function _reduce<T1, T2>(fn: ((acc: T2, val: T1, key?: string, obj?: Record<string, T1>) => T2), val: T2, obj: Record<string, T1>): T2;
/**
 * Curried `_reduce`
 */
export declare const reduce: {
    <T1, T2>(): (Curried3<((acc: T2, val: T1, index?: number, arr?: T1[]) => T2), T2, T1[], T2> | Curried3<((acc: T2, val: T1, key?: string, obj?: Record<string, T1>) => T2), T2, Record<string, T1>, T2>);
    <T1_1, T2_1>(fn: (acc: T2_1, val: T1_1, index?: number, arr?: T1_1[] | undefined) => T2_1): Curried2<T2_1, T1_1[], T2_1>;
    <T1_2, T2_2>(fn: (acc: T2_2, val: T1_2, key?: string, obj?: Record<string, T1_2> | undefined) => T2_2): Curried2<T2_2, Record<string, T1_2>, T2_2>;
    <T1_3, T2_3>(fn: (acc: T2_3, val: T1_3, index?: number, arr?: T1_3[] | undefined) => T2_3, val: T2_3): Curried1<T1_3[], T2_3>;
    <T1_4, T2_4>(fn: (acc: T2_4, val: T1_4, key?: string, obj?: Record<string, T1_4> | undefined) => T2_4, val: T2_4): Curried1<Record<string, T1_4>, T2_4>;
    <T1_5, T2_5>(fn: (acc: T2_5, val: T1_5, index?: number, arr?: T1_5[] | undefined) => T2_5, val: T2_5, arr: T1_5[]): T2_5;
    <T1_6, T2_6>(fn: (acc: T2_6, val: T1_6, key?: string, obj?: Record<string, T1_6> | undefined) => T2_6, val: T2_6, obj: Record<string, T1_6>): T2_6;
};
/**
 * Merge two objects
 *
 * If same property exist in both arguments, second argument's value is used
 * as resulting value
 */
export declare function _merge<T extends Record<string, any>>(x: T, y: T): T;
/**
 * Curried `_merge`
 */
export declare const merge: {
    <T extends Record<string, any>>(): Curried2<T, T, T>;
    <T_1 extends Record<string, any>>(x: T_1): Curried1<T_1, T_1>;
    <T_2 extends Record<string, any>>(x: T_2, y: T_2): T_2;
};
/**
 * Merge multiple objects
 *
 * If same property exist in multiple arguments, value from the last argument
 * containing that property is used
 */
export declare function mergeAll<T extends Record<string, any>>(objs: T[]): T;
/**
 * Find element in array or object for which provided function returns `true`
 *
 * Until element is found, provided function is called for each element with
 * arguments: current element, current index/key and initial container.
 *
 * If searched element is not found, `undefined` is returned.
 */
export declare function _find<T>(fn: ((val: T, index?: number, arr?: T) => boolean), arr: T[]): T | undefined;
export declare function _find<T>(fn: ((val: T, key?: string, obj?: Record<string, T>) => boolean), obj: Record<string, T>): T | undefined;
/**
 * Curried `_find`
 */
export declare const find: {
    <T>(): (Curried2<((val: T, index?: number, arr?: T) => boolean), T[], T | undefined> | Curried2<((val: T, key?: string, obj?: Record<string, T>) => boolean), Record<string, T>, T | undefined>);
    <T_1>(fn: (val: T_1, index?: number, arr?: T_1 | undefined) => boolean): Curried1<T_1[], T_1 | undefined>;
    <T_2>(fn: (val: T_2, key?: string, obj?: Record<string, T_2> | undefined) => boolean): Curried1<Record<string, T_2>, T_2 | undefined>;
    <T_3>(fn: (val: T_3, index?: number, arr?: T_3 | undefined) => boolean, arr: T_3[]): T_3 | undefined;
    <T_4>(fn: (val: T_4, key?: string, obj?: Record<string, T_4> | undefined) => boolean, obj: Record<string, T_4>): T_4 | undefined;
};
/**
 * Find element's index/key in array or object for which provided function
 * returns `true`
 *
 * Until element is found, provided function is called for each element with
 * arguments: current element, current index/key and initial container.
 *
 * If searched element is not found, `undefined` is returned.
 */
export declare function _findIndex<T>(fn: ((val: T, index?: number, arr?: T) => boolean), arr: T[]): number | undefined;
export declare function _findIndex<T>(fn: ((val: T, key?: string, obj?: Record<string, T>) => boolean), obj: Record<string, T>): string | undefined;
/**
 * Curried `_findIndex`
 */
export declare const findIndex: {
    <T>(): (Curried2<((val: T, index?: number, arr?: T) => boolean), T[], number | undefined> | Curried2<((val: T, key?: string, obj?: Record<string, T>) => boolean), Record<string, T>, string | undefined>);
    <T_1>(fn: (val: T_1, index?: number, arr?: T_1 | undefined) => boolean): Curried1<T_1[], number | undefined>;
    <T_2>(fn: (val: T_2, key?: string, obj?: Record<string, T_2> | undefined) => boolean): Curried1<Record<string, T_2>, string | undefined>;
    <T_3>(fn: (val: T_3, index?: number, arr?: T_3 | undefined) => boolean, arr: T_3[]): number | undefined;
    <T_4>(fn: (val: T_4, key?: string, obj?: Record<string, T_4> | undefined) => boolean, obj: Record<string, T_4>): string | undefined;
};
/**
 * Concatenate two arrays
 */
export declare function _concat<T>(x: T[], y: T[]): T[];
/**
 * Curried `_concat`
 */
export declare const concat: {
    <T>(): Curried2<T[], T[], T[]>;
    <T_1>(x: T_1[]): Curried1<T_1[], T_1[]>;
    <T_2>(x: T_2[], y: T_2[]): T_2[];
};
/**
 * Create union of two arrays using `equals` to check equality
 */
export declare function _union<T>(x: T[], y: T[]): T[];
/**
 * Curried `_union`
 */
export declare const union: {
    <T>(): Curried2<T[], T[], T[]>;
    <T_1>(x: T_1[]): Curried1<T_1[], T_1[]>;
    <T_2>(x: T_2[], y: T_2[]): T_2[];
};
/**
 * Check if array contains value using `equals` to check equality
 *
 * TODO: add support for objects (should we check for keys or values?)
 */
export declare function _contains<T>(val: T, arr: T[]): boolean;
/**
 * Curried `_contains`
 */
export declare const contains: {
    <T>(): Curried2<T, T[], boolean>;
    <T_1>(val: T_1): Curried1<T_1[], boolean>;
    <T_2>(val: T_2, arr: T_2[]): boolean;
};
/**
 * Insert value into array on specified index
 */
export declare function _insert<T>(idx: number, val: T, arr: T[]): T[];
/**
 * Curried `_insert`
 */
export declare const insert: {
    <T>(): Curried3<number, T, T[], T[]>;
    <T_1>(idx: number): Curried2<T_1, T_1[], T_1[]>;
    <T_2>(idx: number, val: T_2): Curried1<T_2[], T_2[]>;
    <T_3>(idx: number, val: T_3, arr: T_3[]): T_3[];
};
/**
 * Get array slice
 */
export declare function _slice<T>(begin: number, end: number | null, arr: T[]): T[];
/**
 * Curried `_slice`
 */
export declare const slice: {
    <T>(): Curried3<number, number | null, T[], T[]>;
    <T_1>(begin: number): Curried2<number | null, T_1[], T_1[]>;
    <T_2>(begin: number, end: number | null): Curried1<T_2[], T_2[]>;
    <T_3>(begin: number, end: number | null, arr: T_3[]): T_3[];
};
/**
 * Reverse array
 */
export declare function reverse<T>(arr: T[]): T[];
/**
 * Array length
 */
export declare function length(arr: unknown[]): number;
/**
 * Increment value
 */
export declare function inc(val: number): number;
/**
 * Decrement value
 */
export declare function dec(val: number): number;
/**
 * Logical not
 */
export declare function not(val: any): boolean;
