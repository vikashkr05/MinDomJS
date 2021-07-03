import LightComponent from "./LightComponent";
import LightPublisherSubscriber from "./LightPublisherSubscriber";
import { renderToDOM, diff } from "./lightDomHelper";

/**
 * @description IIFE Function to create object for rendering light components
 * @returns {Object} light DOM object containing render function
 */
const lightDom = (() => {
    const isLightComponent = (component) => component.prototype instanceof LightComponent;
    const isElement = (element) => element instanceof Element || element instanceof HTMLDocument;

    return {
        /**
         * Function to render light component
         * @param {LightComponent} Component - light component to render 
         * @param {Node} element - root node where light component get appended  
         * @param {Function} callBack - callback function which gets called after rendering  
         */
        render: (Component, element, callBack) => {

            let currentVDOM = null;
            let timerId = null;
            let mainElement;
            const events = new LightPublisherSubscriber();

            if (!(Component && typeof Component === "function") && isLightComponent(Component)) {
                throw new Error("Component should extend light component")
            }
            if (!isElement) {
                throw new Error("element should be HTML element")
            }

            const compRef = new Component({}, null, events);
            currentVDOM = compRef.draw();

            // redraws the UI
            const reRender = () => {
                const nextVDOM = compRef.draw();
                diff(currentVDOM, nextVDOM)(mainElement)
                currentVDOM = nextVDOM;
            }

            // batch the updates
            events.subscribe("stateChange", (forceUpdate = false) => {
                if (forceUpdate) {
                    reRender();
                    return;
                }
                clearTimeout(timerId);
                timerId = setTimeout(() => {
                    reRender();
                }, 0);
            });

            return mainElement = renderToDOM(element, currentVDOM, callBack)
        }
    }
})();

export default lightDom;