import './less/index.less';
import classNames from "classnames";
import {
    LightComponent,
    createElement,
    lightDom
} from "../../library/src/index";

import SelectButton from "./js/components/SelectButton";

class Test extends LightComponent {

    constructor(props, elementRef, events) {
        super(props, elementRef, events);
        this.state = {
            count: 0
        };
        this.incrementHandler = this.incrementHandler.bind(this);
        this.decrementHandler = this.decrementHandler.bind(this);
    }

    incrementHandler() {
        this.setState(state => ({ count: state.count + 1 }))
    }

    decrementHandler() {
        this.setState(state => ({ count: state.count + -1 }))
    }

    willMount(events) {
        this.addChildNodes({
            "selectButton1": new SelectButton({
                    display: "Increment",
                    clickEventCallback: this.incrementHandler
                },
                null,
                events
            ),
            "selectButton2": new SelectButton({
                    display: "Decrement",
                    type: "secondary",
                    clickEventCallback: this.decrementHandler
                },
                null,
                events
            )
        })
    }

    render(props, state) {
        return createElement("div", { class: "container" }, [
            createElement(
                "header", { class: "header" }, [
                    createElement("h1", {}, ["Welcome to light JS examples"])
                ]

            ),
            createElement(
                "main", { class: "body" }, [
                    createElement("div", { class: "button-wrapper" }, [this.childNodes["selectButton1"].draw()]),
                    createElement("div", { class: "label" }, [this.state.count]),
                    createElement("div", { class: "button-wrapper" }, [this.childNodes["selectButton2"].draw()])
                ]
            ),
            createElement(
                "footer", { class: "footer" }, [
                    createElement("h5", {}, ["Developer:- Ganapathy"])
                ]
            ),
        ])
    }
}
lightDom.render(Test, document.getElementById("root"))