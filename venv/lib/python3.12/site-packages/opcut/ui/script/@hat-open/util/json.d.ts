export type JArray = JData[];
export type JObject = {
    [key: string]: JData;
};
export type JData = null | boolean | number | string | JArray | JObject;
export type JPath = number | string | JPath[];
/**
 * Get value referenced by path
 *
 * If input value doesn't contain provided path value, `null` is returned.
 */
export declare function _get(path: JPath, x: JData): JData;
/**
 * Curried `_get`
 */
export declare const get: import("./curry.js").Curried2<JPath, JData, JData>;
/**
 * Change value referenced with path by appling function
 */
export declare function _change(path: JPath, fn: (val: JData) => JData, x: JData): JData;
/**
 * Curried `_change`
 */
export declare const change: import("./curry.js").Curried3<JPath, (val: JData) => JData, JData, JData>;
/**
 * Replace value referenced with path with another value
 */
export declare function _set(path: JPath, val: JData, x: JData): JData;
/**
 * Curried `_set`
 */
export declare const set: import("./curry.js").Curried3<JPath, JData, JData, JData>;
/**
 * Omitting value referenced by path
 */
export declare function _omit(path: JPath, x: JData): JData;
/**
 * Curried `_omit`
 */
export declare const omit: import("./curry.js").Curried2<JPath, JData, JData>;
/**
 * Change by moving value from source path to destination path
 */
export declare function _move(srcPath: JPath, dstPath: JPath, x: JData): JData;
/**
 * Curried `_move`
 */
export declare const move: import("./curry.js").Curried3<JPath, JPath, JData, JData>;
