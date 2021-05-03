import React, { Component } from "react";
import { StyleSheet, PanResponder, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default class Draggable extends Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
    };
  }

  // 기본값
  static defaultProps = {
    x: 0,
    y: 0,
  };

  componentWillMount() {
    const { updateCoordinate, id } = this.props;
    console.log(this.props);

    this._val = { x: 0, y: 0 };
    this.state.pan.addListener((value) => {
      this._val = value;

      // y 경계값 설정.
      if (value.y > 440) {
        value.y = 440;
      }
    });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),
      onResponderMove: (evt, gestureState) => {
        this.pan(gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 공을 움직인 뒤 손가락을 떼었을 때, 좌표값 업데이트
        updateCoordinate({ x: this._val.x, y: this._val.y, id });
      },
    });

    // 기본값이 아닌 어떤 임의의 좌표값이 주어졌을 경우, 그 값들로 초기화
    if (this.props.x != 0 || this.props.y != 0) {
      this.state.pan.setValue({ x: this.props.x, y: this.props.y });
    }
  }

  render() {
    // 공 경계선 설정,
    boundX = this.state.pan.x.interpolate({
      inputRange: [0, width - 60],
      outputRange: [0, width - 60],
      extrapolate: "clamp",
    });
    boundY = this.state.pan.y.interpolate({
      inputRange: [0, 500 - 60],
      outputRange: [0, 500 - 60],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[
          styles.circle,
          { transform: [{ translateX: boundX }, { translateY: boundY }] },
        ]}
      />
    );
  }
}

let CIRCLE_RADIUS = 30;
let styles = StyleSheet.create({
  circle: {
    backgroundColor: "blue",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});
