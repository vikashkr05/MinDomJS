# MinDomJS
Light weight super-fast JavaScript library with Virtual DOM implementation, MinDomJS does not use any third-party dependency.
* It is very useful in developing component-based web applications.
* Uses props and state for data management.
* Has similar lifecycles compared to react.
* Auto redraw when set state is called.
* Has its own publisher / subscriber channel for communication between components.
* Maintains components as child nodes for updating and redrawing when state changes.
## LightComponent
All the component should extend LightComponent class. It contains all lifecycle methods.
### creation lifecycle
#### constructor
Constructor gets called when component instance gets created.
* It accepts props, elementReference and publisher/subscriber event as constructor props.
#### willMount
willMount gets called before rendering in creation phase.
* Define all the child nodes in this lifeCycle method.
#### render
render gets called both on creation and update phase.
* props and state will be available as parameter in the render function.
* Render function should return an virtual DOM.
#### didMount
didMount gets called after rendering in creation phase.
* Make all the API or http request in this function.
### update lifecycle
#### willUpdate
willUpdate gets called before rendering in update phase.
* props, previous state, next state will be available as parameter in the function.
#### render
#### didUpdate
didUpdate get called after rendering in update phase.
### unmount lifecycle
#### willUnmount
Function gets called when child node unmounts.
#### updateProps
use updateProps to update child props.
### other methods
#### addChildNode
Function to add child node
#### addChildNodes
Function to add child nodes
#### removeChildNode
Function to remove child node
#### setState
* setState function is used to update the component state.
* UI will get re rendered once set state is called.
* Batching is implemented to update the multiple state once before redraw.
## createElement
This function is used to create virtual DOM
* eg: createElement(tagName, {attributes}, [ children ])
## lightDom
This provides the rendering functions to render the virtual DOM to real DOM
eg: lightDom.render(Component, rootElement)

