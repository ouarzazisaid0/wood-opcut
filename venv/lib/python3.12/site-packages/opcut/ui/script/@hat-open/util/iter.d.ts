import { Curried1, Curried2, Curried3 } from './curry.js';
export declare function _islice<T>(start: number, stop: number | null, x: T[]): Generator<T>;
export declare const islice: {
    <T>(): Curried3<number, number | null, T[], Generator<T>>;
    <T_1>(begin: number): Curried2<number | null, T_1[], Generator<T_1, any, unknown>>;
    <T_2>(begin: number, end: number | null): Curried1<T_2[], Generator<T_2, any, unknown>>;
    <T_3>(begin: number, end: number | null, arr: T_3[]): Generator<T_3, any, unknown>;
};
