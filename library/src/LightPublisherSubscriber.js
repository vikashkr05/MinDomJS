/**
 * @class LightPublisherSubscriber
 * @description pub/sub for handling events 
 */
export default class LightPublisherSubscriber {
    constructor() {
        this.events = {};
    }

    /**
     * Function to subscribe for event chanel 
     * @param {String} name - event name
     * @param {Function} func - event handler
     * @returns {undefined} does not return any value
     */
    subscribe(name, func) {
        if (name && typeof name === "string" && typeof func === "function") {
            if (this.events[name]) {
                this.events.name.push(func);
            } else {
                this.events[name] = [func]
            }
        }
    }

    /**
     * Function to unsubscribe event
     * @param {String} name - event name
     * @param {Function} func - event handler
     * @returns {undefined} does not return any value
     */
    unsubscribe(name, func) {
        if (name && typeof name === "string" && typeof func === "function" && this.events[name]) {
            if (this.events[name].length === 1) {
                delete this.events[name]
            } else {
                this.events[name] = this.events[name].filter(item => item !== func)
            }
        }
    }

    /**
     * Function to publish the event 
     * @param {String} name - event name
     * @param {Object} binding - context which need to be bounded
     * @param {*} args - arguments for handler 
     * @returns {undefined} does not return any value
     */
    publish(name, binding, ...args) {
        if (name && typeof name === "string" && this.events[name]) {
            this.events[name].forEach(event => event.apply(binding || this, args));
        }
    }
}