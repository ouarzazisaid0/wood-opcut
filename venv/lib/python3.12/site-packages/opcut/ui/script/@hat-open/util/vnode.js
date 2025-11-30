import { curry } from './curry.js';
import { _get, _change, _omit } from './json.js';
import { isString, isArray, isObject, isNil } from './misc.js';
export function isVNodeWithoutData(node) {
    return node.length < 2 || !isObject(node[1]);
}
export function isVNodeWithData(node) {
    return node.length > 1 && isObject(node[1]);
}
export function isVNode(child) {
    return isArray(child) && child.length > 0 && isString(child[0]);
}
export function getVNodeChildren(node) {
    return node.slice(isVNodeWithData(node) ? 2 : 1);
}
export function getFlatVNodeChildren(node) {
    const children = [];
    const childrenStart = (isVNodeWithData(node) ? 2 : 1);
    for (let i = childrenStart; i < node.length; ++i) {
        const child = node[i];
        if (isString(child) || isVNode(child)) {
            children.push(child);
        }
        else {
            for (const flatChild of flattenVNodeChildren(child))
                children.push(flatChild);
        }
    }
    return children;
}
export function* flattenVNodeChildren(children) {
    for (const child of children) {
        if (isString(child) || isVNode(child)) {
            yield child;
        }
        else {
            yield* flattenVNodeChildren(child);
        }
    }
}
export function _changeVNodeData(fn, node) {
    const data = fn(isVNodeWithData(node) ? node[1] : null);
    if (isNil(data)) {
        if (isVNodeWithoutData(node))
            return node;
        const result = Array.from(node);
        result.splice(1, 1);
        return result;
    }
    return [node[0], data, ...getVNodeChildren(node)];
}
export const changeVNodeData = curry(_changeVNodeData);
export function _changeVNodeChildren(fn, node) {
    const children = fn(getVNodeChildren(node));
    const head = node.slice(0, (isVNodeWithoutData(node) ? 1 : 2));
    return [...head, ...children];
}
export const changeVNodeChildren = curry(_changeVNodeChildren);
export function _queryVNodePath(selector, tree) {
    const first = _queryAllVNodePaths(selector, tree).next();
    return (first.done ? null : first.value);
}
export const queryVNodePath = curry(_queryVNodePath);
export function* _queryAllVNodePaths(selector, tree) {
    if (isString(tree))
        return;
    if (isVNode(tree) && testSelector(selector, tree))
        yield [];
    const childrenStart = (isVNode(tree) ?
        (isVNodeWithData(tree) ? 2 : 1) :
        0);
    for (let i = childrenStart; i < tree.length; ++i)
        for (const path of _queryAllVNodePaths(selector, tree[i]))
            yield [i, ...path];
}
export const queryAllVNodePaths = curry(_queryAllVNodePaths);
export function _getVNode(path, tree) {
    const node = _get(path, tree);
    return (isVNode(node) ? node : null);
}
export const getVNode = curry(_getVNode);
export function _changeVNode(path, fn, tree) {
    return _change(path, node => (isVNode(node) ? fn(node) : node), tree);
}
export const changeVNode = curry(_changeVNode);
export function _setVNode(path, node, tree) {
    return _change(path, x => (isArray(x) || isString(x) ? node : x), tree);
}
export const setVNode = curry(_setVNode);
export function _omitVNode(path, tree) {
    if (isNil(_getVNode(path, tree)))
        return tree;
    return _omit(path, tree);
}
export const omitVNode = curry(_omitVNode);
function testSelector(selector, node) {
    selector;
    node;
    // TODO
    return false;
}
