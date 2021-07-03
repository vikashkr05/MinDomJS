import classNames from "classnames";

import {
    LightComponent,
    createElement
} from "../../../../library/src/index";

export default class SelectButton extends LightComponent {
    static defaultProps = {
        size: "small",
        type: "primary",
        display: "--",
        isSelected: false,
        clickEventCallback: () => {}
    }

    constructor(props, elementRef, events) {
        super(props, elementRef, events);
        this.state = {
            isSelected: this.props.isSelected
        }
        this.clickHandler = this.clickHandler.bind(this)
    }

    clickHandler(event) {
        this.setState((state) => ({ isSelected: !state.isSelected }));
        this.props.clickEventCallback(event, !this.state.isSelected)
    }

    render(props, state) {
        return createElement(
            "button", {
                class: classNames(
                    "select-button",
                    `select-button-type-${props.type}`,
                    `select-button-size-${props.size}`, {
                        "select-button-selected": state.isSelected,
                    }),
                event_click: this.clickHandler,
                ["aria-selected"]: state.isSelected
            }, [props.display]
        )
    }
}