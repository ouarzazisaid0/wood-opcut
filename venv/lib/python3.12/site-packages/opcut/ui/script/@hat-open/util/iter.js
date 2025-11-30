import { curry } from './curry.js';
export function* _islice(start, stop, x) {
    if (start < 0) {
        start = x.length + start;
        if (start < 0)
            start = 0;
    }
    if (stop == null || stop > x.length) {
        stop = x.length;
    }
    else if (stop < 0) {
        stop = x.length + stop;
    }
    for (let i = start; i < stop; ++i)
        yield x[i];
}
export const islice = curry(_islice);
