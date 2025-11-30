import * as u from '@hat-open/util';
import * as vdom from './vdom.js';
export type VtFn = (r: Renderer) => u.VNode;
export type ChangeFn = (x: u.JData) => u.JData;
export declare class RenderEvent extends CustomEvent<u.JData> {
    readonly type: 'render';
    constructor(state: u.JData);
}
export declare class ChangeEvent extends CustomEvent<u.JData> {
    readonly type: 'change';
    constructor(state: u.JData);
}
/**
 * Virtual DOM renderer
 *
 * Available events:
 *  - RenderEvent
 *  - ChangeEvent
 */
export declare class Renderer extends EventTarget {
    _state: u.JData;
    _changes: [u.JPath, ChangeFn][];
    _promise: Promise<void> | null;
    _timeout: ReturnType<typeof setTimeout> | null;
    _lastRender: number | null;
    _vtCb: VtFn | null;
    _maxFps: number;
    _vNode: Element | vdom.VNode;
    /**
     * Calls `init` method
     */
    constructor(el?: Element | null, initState?: u.JData, vtCb?: VtFn | null, maxFps?: number);
    /**
     * Initialize renderer
     *
     * If `el` is `null`, document body is used.
     */
    init(el: Element | null, initState?: u.JData, vtCb?: VtFn | null, maxFps?: number): Promise<void>;
    /**
      * Render
      */
    render(): void;
    /**
     * Get current state value referenced by `paths`
     */
    get(...paths: u.JPath[]): u.JData;
    /**
     * Set current state value referenced by `path`
     *
     * If `path` is not provided, `[]` is assumed.
     */
    set(value: u.JData): Promise<void>;
    set(path: u.JPath, value: u.JData): Promise<void>;
    /**
     * Change current state value referenced by `path`
     *
     * If `path` is not provided, `[]` is assumed.
     */
    change(cb: ChangeFn): Promise<void>;
    change(path: u.JPath, cb: ChangeFn): Promise<void>;
    _change(): void;
}
/**
 * Default renderer
 */
declare const defaultRenderer: Renderer;
export default defaultRenderer;
