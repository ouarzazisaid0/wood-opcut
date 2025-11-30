import * as snabbdom from 'snabbdom';
import * as u from '@hat-open/util';
export { VNode } from 'snabbdom';
export declare const patch: (oldVnode: Element | DocumentFragment | snabbdom.VNode, vnode: snabbdom.VNode) => snabbdom.VNode;
export declare function convertVNode(node: u.VNode): snabbdom.VNode;
