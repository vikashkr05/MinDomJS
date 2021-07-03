/**
 * Function to merge the props
 * @private
 * @param {Object} defaultProps - default static props
 * @param {Object} props - props passed to component
 * @returns {Object} returns merged props
 */
const mergeProps = (defaultProps, props) => ({...defaultProps, ...props });

/**
 * Function to set the state
 * @private
 * @param {Object} state - state object
 * @param {Array} stateQueue - array of state handlers
 * @returns {undefined} does not return any value
 */
const setState = (state, stateQueue) => {
    const isStateObject = typeof state === "object";
    const isStateFunc = typeof state === "function";
    if (isStateObject) {
        stateQueue.push((nextState) => ({...state, ...nextState }));
    }
    if (isStateFunc) {
        stateQueue.push(state);
    }
}

/**
 * Function to update the UI
 * @private
 * @param {Object} events - pub/sub event
 * @param {Boolean} forceUpdate - indicator for force update
 * @returns {undefined} does not return any value
 */
const updateUI = (events, forceUpdate) => {
    events && typeof events.publish === "function" && events.publish("stateChange", forceUpdate)
}

/**
 * Class LightComponent
 * @description LightComponent class to build a light web application
 * Uses light weight virtual DOM for rendering
 */
export default class LightComponent {
    // declare all the default props
    static defaultProps = {};

    /**
     * LightComponent constructor 
     * @param {props} props - props passed while creating instance
     * @param {ref} elementRef - element ref passed while creating instance
     * @param {events} events - publisher subscriber event attached to every component to update the state
     */
    constructor(props = {}, elementRef = null, events = null) {
        this.props = {};
        this.state = {};
        this.isLightComponent = true;
        this.events = events;
        this.childNodes = {};
        this.stateQueue = [];
        this.elementRef = null;
        this.timerId = null;
        this.props = mergeProps(this.constructor.defaultProps || {}, props);
        this.elementRef = elementRef;
        this.initialLoad = true;
    }

    /**
     * Function to update prop
     * Parent comp can update child props using this method
     * @param {Object} newProps - new props
     * @returns { undefined } does not return any value
     */
    updateProps(newProps) {
        Object.assign(this.props, newProps)
    }

    /**
     * Function to add child node
     * @param {String} childName - child name
     * @param {LightComponent} child - instance of child component
     * @returns { undefined } does not return any value
     */
    addChildNode(childName, child) {
        if (childName && typeof child === "object" && child.isLightComponent) {
            this.childNodes[childName] = child;
        }
    }

    /**
     * Function to add child nodes
     * @param {Object<string:LightComponent> } childNodes - object containing child nodes
     * @returns { undefined } does not return any value
     */
    addChildNodes(childNodes) {
        if (childNodes && typeof childNodes === "object") {
            Object.assign(this.childNodes, Object.entries(childNodes)
                .reduce((childMap, [childName, childNode]) => {
                    if (childNode.isLightComponent) {
                        childMap[childName] = childNode;
                    }
                    return childMap;
                }, {})
            )
        }
    }

    /**
     * Function to remove the child from child nodes 
     * @param {String} childName - child name
     * @returns { undefined } does not return any value
     */
    removeChildNode(childName) {
        this.childNodes[childName] && this.childNodes[childName].willUnmount();
        delete this.childNodes[childName]
    }

    /**
     * Function to set the state
     * This function re-render the UI after setting the state.
     * States are updated in batch before rendering to improve performance 
     * State updates are asynchronous  
     * @param {Object|Function} state - state or state updater
     * @returns { undefined } does not return any value
     */
    setState(state) {
        setState(state, this.stateQueue);
        updateUI(this.events);
    }

    /**
     * Function to re-render the UI forcefully 
     * @returns { undefined } does not return any value
     */
    forceUpdate() {
        updateUI(this.events, true);
    }

    /**
     * @description  Lifecycle function
     * This function is called on mounting phase, before the render function
     * @returns { undefined } does not return any value
     */
    willMount(events) {

    }

    /**
     * @description  Lifecycle function
     * This function is called on update phase, before the render function
     * @returns { undefined } does not return any value
     */
    willUpdate(props, prevState, nextState) {

    }

    /**
     * @description  Lifecycle function
     * This function returns the virtual dom for rendering UI 
     * @returns { Object } virtual DOM
     */
    render(props, state) {
        return []
    }

    /**
     * @description  Lifecycle function
     * This function is called on mount phase, after the render function
     * @returns { undefined } does not return any value
     */
    didMount() {

    }

    /**
     * @description  Lifecycle function
     * This function is called on update phase, after the render function
     * @returns { undefined } does not return any value
     */
    didUpdate(props, nextState) {

    }

    /**
     * @description  Lifecycle function
     * This function is called on unmount phase, when child nodes are removed
     * @returns { undefined } does not return any value
     */
    willUnmount() {

    }

    /**
     * @private
     * @description function to draw the UI
     * @returns {Object} returns virtual DOM
     */
    draw() {
        if (this.initialLoad) {
            this.initialLoad = false;
            this.willMount(this.events);
            const vDom = this.render(this.props, this.state);
            this.didMount();
            return vDom;
        } else {
            const nextState = this.stateQueue.reduce(
                (state, nextState) => {
                    return {...state, ...nextState(state) }
                }, this.state);
            this.willUpdate(this.props, this.state, nextState);
            this.state = Object.assign({}, this.state, nextState);
            const vDom = this.render(this.props, this.state);
            this.didUpdate(this.props, this.state);
            this.stateQueue = [];
            return vDom;
        }
    }
}