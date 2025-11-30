/**
 * Curry function with fixed arguments lenth
 *
 * Function arity is determined based on function's length property.
 */
export function curry(fn) {
    return curryN(fn.length, fn);
}
/**
 * Curry function with fixed arguments lenth
 *
 * Function arity is provided as first argument.
 */
export function curryN(arity, fn) {
    function wrapper(prevArgs) {
        return function (...args) {
            const allArgs = [...prevArgs, ...args];
            if (allArgs.length >= arity)
                return fn(...allArgs);
            return wrapper(allArgs);
        };
    }
    return wrapper([]);
}
