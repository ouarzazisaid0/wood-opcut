import * as snabbdom from 'snabbdom';
import * as u from '@hat-open/util';
// patched version of snabbdom's modules/attributes.js
const attributesModule = (() => {
    function updateAttrs(oldVnode, vnode) {
        let key;
        const elm = vnode.elm;
        let oldAttrs = oldVnode.data.attrs;
        let attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs)
            return;
        if (oldAttrs === attrs)
            return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        for (key in attrs) {
            const cur = attrs[key];
            const old = oldAttrs[key];
            if (old !== cur) {
                if (cur === true) {
                    elm.setAttribute(key, "");
                }
                else if (cur === false) {
                    elm.removeAttribute(key);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }
    return { create: updateAttrs, update: updateAttrs };
})();
// patched version of snabbdom's modules/props.js
const propsModule = (() => {
    function updateProps(oldVnode, vnode) {
        let key;
        let cur;
        let old;
        const elm = vnode.elm;
        let oldProps = oldVnode.data.props;
        let props = vnode.data.props;
        if (!oldProps && !props)
            return;
        if (oldProps === props)
            return;
        oldProps = oldProps || {};
        props = props || {};
        for (key in oldProps) {
            if (!props[key]) {
                if (key === 'style') {
                    elm[key] = '';
                }
                else {
                    delete elm[key];
                }
            }
        }
        for (key in props) {
            cur = props[key];
            old = oldProps[key];
            if (old !== cur && (key !== "value" || elm[key] !== cur)) {
                elm[key] = cur;
            }
        }
    }
    return { create: updateProps, update: updateProps };
})();
export const patch = snabbdom.init([
    attributesModule,
    snabbdom.classModule,
    snabbdom.datasetModule,
    snabbdom.eventListenersModule,
    propsModule,
    snabbdom.styleModule
]);
export function convertVNode(node) {
    if (!u.isVNode(node))
        throw Error("invalid node");
    const data = (u.isVNodeWithData(node) ? node[1] : {});
    const children = u.pipe(u.getFlatVNodeChildren, u.map(i => u.isString(i) ? i : convertVNode(i)))(node);
    return snabbdom.h(node[0], data, children);
}
