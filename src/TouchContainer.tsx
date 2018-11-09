import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    GestureResponderEvent
} from "react-native";

const pressTimeout = 200;

interface TouchProps {
    onRight: () => {};
    onLeft: () => {};
    onUp: () => {};
    onDown: () => {};
    onMoved: () => {};
}

export class TouchContainer extends Component<TouchProps> {
    private startTime: number;
    private startX;
    private startY;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPressIn={this.onPressIn.bind(this)}
                onPressOut={this.onPressOut.bind(this)}
                onPress={this.onPress.bind(this)}
                onLongPress={this.onLonePress.bind(this)}
            >
                {/* {React.cloneElement(
                    React.Children.only(this.props.children),
                    {}
                )} */}
                {this.props.children}
            </TouchableWithoutFeedback>
        );
    }

    onPressIn(evt: GestureResponderEvent) {
        this.startTime = evt.nativeEvent.timestamp;
        this.startX = evt.nativeEvent.locationX;
        this.startY = evt.nativeEvent.locationY;
    }

    onPressOut(evt: GestureResponderEvent) {
        if (evt.nativeEvent.timestamp - this.startTime > pressTimeout) return;

        var offsetX = this.startX - evt.nativeEvent.locationX;
        var offsetY = this.startY - evt.nativeEvent.locationY;

        // x>y: 横向, x<y: 纵向
        var dir = Math.abs(offsetX) - Math.abs(offsetY) > 0;
        if (dir && offsetX < 0) {
            this.props.onRight();
            this.props.onMoved();
            return;
        }
        if (dir && offsetX > 0) {
            this.props.onLeft();
            this.props.onMoved();
            return;
        }
        if (!dir && offsetY < 0) {
            this.props.onDown();
            this.props.onMoved();
            return;
        }
        if (!dir && offsetY > 0) {
            this.props.onUp();
            this.props.onMoved();
            return;
        }
    }

    onPress() {}

    onLonePress() {}
}
