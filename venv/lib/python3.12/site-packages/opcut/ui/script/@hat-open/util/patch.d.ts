import { JData } from './json.js';
export type JPatchOpAdd = {
    op: 'add';
    path: string;
    value: JData;
};
export type JPatchOpRemove = {
    op: 'remove';
    path: string;
};
export type JPatchOpReplace = {
    op: 'replace';
    path: string;
    value: JData;
};
export type JPatchOpMove = {
    op: 'move';
    from: string;
    path: string;
};
export type JPatchOpCopy = {
    op: 'copy';
    from: string;
    path: string;
};
export type JPatchOpTest = {
    op: 'test';
    path: string;
    value: JData;
};
export type JPatchOp = JPatchOpAdd | JPatchOpRemove | JPatchOpReplace | JPatchOpMove | JPatchOpCopy | JPatchOpTest;
export type JPatch = JPatchOp[];
export declare const patch: import("./curry.js").Curried2<JPatch, JData, JData>;
