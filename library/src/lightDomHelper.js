/**
 * Function to zip the child patches and parent child nodes
 * @param {Array} child patches
 * @param {NodeList} childNodes - child nodes 
 * @returns {Array} zipped array
 */
const zip = (xs, ys) => {
    const zipped = [];
    for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]]);
    }
    return zipped;
};

/**
 * Function to diff the attributes
 * @param {Object} oldAttrs - old attributes
 * @param {Object} newAttrs - new attributes
 * @returns {Node} returns element
 */
const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];
    // set new attributes
    for (const [key, value] of Object.entries(newAttrs)) {
        if (!(key in oldAttrs) || newAttrs[key] !== oldAttrs[key]) {
            patches.push($node => {
                if (key === "refElement") {
                    setReferenceToElement($node, key)
                } else if (key.split("_")[0] === "event") {
                    $node.addEventListener(key.split("_")[1], value)
                } else {
                    $node.setAttribute(key, value);
                }
                return $node;
            });
        }
    }

    // remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(k);
                return $node;
            });
        }
    }
    return $node => {
        for (const patch of patches) {
            patch($node);
        }
    };
};


/**
 * Function to diff the children
 * @param {Array} oldVChildren - old children
 * @param {Array} newVChildren - new children
 * @returns {Node} returns element
 */
const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = [];
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]));
    });

    const additionalPatches = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    }
    return $parent => {
        for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
            patch(child);
        }

        for (const patch of additionalPatches) {
            patch($parent);
        }
        return $parent;
    };
};

/**
 * Function to diff the virtual doms
 * @param {Object} vOldNode - old virtual dom 
 * @param {Object} vNewNode - new virtual dom
 * @returns {Function} Function which accepts node to be updated
 */
export const diff = (vOldNode, vNewNode) => {
    if (vNewNode === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        };
    }
    if (typeof vOldNode === 'string' ||
        typeof vNewNode === 'string' ||
        typeof vOldNode === 'number' ||
        typeof vNewNode === 'number' ||
        typeof vOldNode === 'boolean' ||
        typeof vNewNode === 'boolean'
    ) {
        if (vOldNode !== vNewNode) {
            return $node => {
                const $newNode = render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            };
        } else {
            return $node => undefined;
        }
    }
    if (vOldNode.tagName !== vNewNode.tagName) {
        return $node => {
            const $newNode = render(vNewNode);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }
    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
    return $node => {
        patchAttrs($node);
        patchChildren($node);
        return $node;
    };
};

/**
 * Creates the virtual DOM Object
 * @param {String} tagName - virtual Dom
 * @param {Object}  attrs - attributes 
 * @param {Object} children - children
 * @returns {Object} returns the Virtual Dom element
 */
export const createVirtualElement = (tagName, attrs = {}, children = []) => {
    const virtualElement = Object.create(null);
    Object.assign(virtualElement, {
        tagName,
        attrs,
        children,
    });
    return virtualElement;
};

/**
 * Create a document element
 * @param {String} tagName - tagname
 * @returns {Node} returns the Node element based on tag name
 */
const createElement = (tagName) => document.createElement(tagName);

/**
 * Create a text node
 * @param {String} text - text
 * @returns {TextNode} returns the Text node with value
 */
const createTextNode = (text) => document.createTextNode(text);

/**
 * sets the reference to element
 * @param {DOMElement} element - Dom element
 * @param {Function} refElement - callback function to set the element
 * @returns {undefined} does not return any value
 */
const setReferenceToElement = (element, refElement) => {
    refElement && refElement(element)
};

/**
 * Function to render Element
 * @param {Object} virtualDom - virtual  dom object 
 * @returns { Node } returns element
 */
const renderElement = ({ tagName, attrs, children }) => {
    const element = createElement(tagName);
    for (const [key, value] of Object.entries(attrs)) {
        if (key === "refElement") {
            setReferenceToElement(element, key)
        } else if (key.split("_")[0] === "event") {
            element.addEventListener(key.split("_")[1], value)
        } else {
            element.setAttribute(key, value);
        }
    }
    for (const child of children) {
        element.appendChild(render(child));
    }
    return element;
};

/**
 * Function to render virtual element
 * @param {Object} virtualDom - virtual dom object 
 * @returns { Node } returns element
 */
const render = (vNode) => {
    if (typeof vNode === 'string' || typeof vNode === 'number' || typeof vNode === 'boolean') {
        return createTextNode(vNode);
    }
    // we assume everything else to be a virtual element
    return renderElement(vNode);
};

/**
 * Renders the virtual DOM to root element
 * @param {Node} rootElement - root element
 * @param {Object} virtualDom - virtualDom
 * @param {Function} callBack - callback function
 * @returns {DOMElement} returns the reference of root element
 */
export const renderToDOM = (rootElement, virtualDom, callBack) => {
    const newElement = render(virtualDom);
    rootElement.append(newElement);
    if (callBack && typeof callBack === "function") {
        callBack(element);
    }
    return newElement;
};