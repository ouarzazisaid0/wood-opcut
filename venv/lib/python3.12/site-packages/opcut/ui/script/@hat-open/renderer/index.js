import * as u from '@hat-open/util';
import * as vdom from './vdom.js';
export class RenderEvent extends CustomEvent {
    constructor(state) {
        super('render', { detail: state });
    }
}
export class ChangeEvent extends CustomEvent {
    constructor(state) {
        super('change', { detail: state });
    }
}
/**
 * Virtual DOM renderer
 *
 * Available events:
 *  - RenderEvent
 *  - ChangeEvent
 */
export class Renderer extends EventTarget {
    _state = null;
    _changes = [];
    _promise = null;
    _timeout = null;
    _lastRender = null;
    _vtCb = null;
    _maxFps = 30;
    _vNode = document.body;
    /**
     * Calls `init` method
     */
    constructor(el = null, initState = null, vtCb = null, maxFps = 30) {
        super();
        this.init(el, initState, vtCb, maxFps);
    }
    /**
     * Initialize renderer
     *
     * If `el` is `null`, document body is used.
     */
    init(el, initState = null, vtCb = null, maxFps = 30) {
        this._state = null;
        this._changes = [];
        this._promise = null;
        this._timeout = null;
        this._lastRender = null;
        this._vtCb = vtCb;
        this._maxFps = maxFps;
        this._vNode = el || document.body;
        if (u.isNil(initState))
            return new Promise(resolve => { resolve(); });
        return this.set(initState);
    }
    /**
      * Render
      */
    render() {
        if (!this._vtCb)
            return;
        this._lastRender = performance.now();
        const vNode = vdom.convertVNode(this._vtCb(this));
        vdom.patch(this._vNode, vNode);
        this._vNode = vNode;
        this.dispatchEvent(new RenderEvent(this._state));
    }
    /**
     * Get current state value referenced by `paths`
     */
    get(...paths) {
        return u.get(paths, this._state);
    }
    set(x, y) {
        const path = (arguments.length < 2 ? [] : x);
        const value = (arguments.length < 2 ? x : y);
        return this.change(path, _ => value);
    }
    change(x, y) {
        const path = (arguments.length < 2 ? [] : x);
        const cb = (arguments.length < 2 ? x : y);
        this._changes.push([path, cb]);
        if (!this._promise)
            this._promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        this._change();
                    }
                    catch (e) {
                        this._promise = null;
                        reject(e);
                        throw e;
                    }
                    this._promise = null;
                    resolve();
                }, 0);
            });
        return this._promise;
    }
    _change() {
        while (this._changes.length > 0) {
            let change = false;
            while (this._changes.length > 0) {
                const [path, cb] = this._changes.shift();
                const view = u.get(path);
                const oldState = this._state;
                this._state = u.change(path, cb, this._state);
                if (this._state && u.equals(view(oldState), view(this._state)))
                    continue;
                change = true;
                if (!this._vtCb || this._timeout)
                    continue;
                const delay = (!this._lastRender || !this._maxFps ?
                    0 :
                    (1000 / this._maxFps) -
                        (performance.now() - this._lastRender));
                this._timeout = setTimeout(() => {
                    this._timeout = null;
                    this.render();
                }, (delay > 0 ? delay : 0));
            }
            if (change)
                this.dispatchEvent(new ChangeEvent(this._state));
        }
    }
}
/**
 * Default renderer
 */
const defaultRenderer = (() => {
    if (!window)
        return new Renderer();
    const parent = window;
    if (!parent.__hat_default_renderer)
        parent.__hat_default_renderer = new Renderer();
    return parent.__hat_default_renderer;
})();
export default defaultRenderer;
