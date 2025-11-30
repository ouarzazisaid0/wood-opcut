export interface Future<T> extends Promise<T> {
    done: () => boolean;
    result: () => T;
    setResult: (result: T) => void;
    setError: (error: any) => void;
}
/**
 * Create promise that resolves in `t` milliseconds
 */
export declare function sleep(t: number): Promise<void>;
/**
 * Delay function call `fn(...args)` for `t` milliseconds
 */
export declare function delay<TArgs extends [...any[]], TResult>(fn: (...args: TArgs) => TResult, t?: number, ...args: TArgs): Promise<TResult>;
/**
 * Create new future instance
 */
export declare function createFuture<T>(): Future<T>;
