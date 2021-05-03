import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import Draggable from "./Draggable";

const { width } = Dimensions.get("window");

class App extends Component {
  /*
    sequence: [{x,y,id}, ...]
    clicked: str. 가장 최근에 선택된 공의 id
  */
  state = {
    sequence: [],
    clicked: null,
  };

  componentDidMount() {
    AsyncStorage.getItem("@sequence").then((item) => {
      // 저장된 데이터가 있을 시, 불러온다.
      if (item) this.setState({ sequence: JSON.parse(item) });
    });
  }

  onPressAdd = () => {
    this.setState({
      sequence: [...this.state.sequence, { x: 0, y: 0, id: uuid.v4() }],
    });
  };

  onPressRemove = () => {
    const { clicked } = this.state;

    if (clicked == null) {
      Alert.alert("", "아무 공도 선택되지 않았습니다.");
    } else {
      this.setState({
        sequence: this.state.sequence.filter(({ x, y, id }) => id != clicked),
        clicked: null,
      });
    }
  };

  onPressSave = () => {
    const arr2json = JSON.stringify(this.state.sequence);

    AsyncStorage.setItem("@sequence", arr2json).then((item) => {
      Alert.alert("", "저장 완료.");
    });
  };

  // 공을 움직인 뒤 손을 떼었을 때의 공의 좌표값을 업데이트
  updateCoordinate = ({ x, y, id }) => {
    const sequence = this.state.sequence.map((item) =>
      item.id == id ? { x, y, id } : item
    );

    this.setState({ sequence, clicked: id });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ height: 500, width, borderWidth: 2, borderColor: "green" }}
        >
          {this.state.sequence.map(({ x, y, id }) => (
            <Draggable
              x={x}
              y={y}
              id={id}
              key={id}
              updateCoordinate={this.updateCoordinate}
            />
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "green",
            }}
            onPress={this.onPressAdd}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
              추가
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
            }}
            onPress={this.onPressRemove}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
              삭제
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "blue",
            }}
            onPress={this.onPressSave}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
              저장
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default App;
