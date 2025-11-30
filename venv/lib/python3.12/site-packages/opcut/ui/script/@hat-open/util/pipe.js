export function pipe(first, ...rest) {
    return function (...args) {
        if (!first)
            return args[0];
        let ret = first(...args);
        for (const fn of rest)
            ret = fn(ret);
        return ret;
    };
}
