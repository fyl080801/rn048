import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LayoutChangeEvent,
  Button
} from "react-native";
import { TouchContainer } from "./TouchContainer";
import { CellColors } from "./Enums";
import NumberItem from "./NumberItem";

type Props = {
  boxWidth: number;
};

type State = {
  data: NumberItem[][];
  moves?: number;
  adds?: number;
  scores: number;
};

export default class App extends Component<Props, State> {
  private cacheState: State;
  constructor(props: Props) {
    super(props);

    this.cacheState = initGame();
    this.state = this.cacheState;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchContainer
          onUp={this.toUp.bind(this)}
          onDown={this.toDown.bind(this)}
          onLeft={this.toLeft.bind(this)}
          onRight={this.toRight.bind(this)}
          onMoved={this.onMoved.bind(this)}
        >
          <View style={styles.box}>
            {this.state.data.map((val, id1) =>
              val.map((item, id2) => (
                <View
                  style={[
                    styles.cell,
                    getColorStyle(this.state.data[id1][id2].value)
                  ]}
                  key={id1 + "_" + id2}
                >
                  {this.state.data[id1][id2].value !== 0 ? (
                    <Text style={styles.text}>
                      {this.state.data[id1][id2].value}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
        </TouchContainer>
        <View style={styles.controls}>
          <View style={styles.title}>
            <Text>{this.state.scores}</Text>
          </View>
          <View style={styles.title}>
            <Button title="重置" onPress={this.reset.bind(this)} />
          </View>
        </View>
      </View>
    );
  }

  reset() {
    this.cacheState = initGame();
    this.setState(this.cacheState);
  }

  toUp() {
    this.moveUp();
    this.addUp();
  }

  toDown() {
    this.moveDown();
    this.addDown();
  }

  toLeft() {
    this.moveLeft();
    this.addLeft();
  }

  toRight() {
    this.moveRight();
    this.addRight();
  }

  onMoved() {
    var isEnd = true;
    if (this.cacheState.adds > 0 || this.cacheState.moves > 0) {
      var empty = [];
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          if (this.cacheState.data[i][j].isEmpty()) {
            empty.push(this.cacheState.data[i][j]);
          }
        }
      }
      if (empty.length > 0) {
        empty[Math.floor(Math.random() * empty.length)].reset(
          (Math.round(Math.random()) + 1) * 2
        );
      }

      // 结束检测
      if (empty.length <= 1) {
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 3; j++) {
            if (
              this.cacheState.data[i][j].check(this.cacheState.data[i][j + 1])
            ) {
              isEnd = false;
              break;
            }
          }
        }

        for (var j = 0; j < 4; j++) {
          for (var i = 0; i < 3; i++) {
            if (
              this.cacheState.data[i][j].check(this.cacheState.data[i + 1][j])
            ) {
              isEnd = false;
              break;
            }
          }
        }
      } else {
        isEnd = false;
      }
    }

    this.cacheState.adds = 0;
    this.cacheState.moves = 0;
    this.setState(this.cacheState);
    if (isEnd) {
      alert("no move");
    }
  }

  private moveLeft() {
    var i, j, k;
    for (i = 0; i < 4; i++) {
      for (j = 1; j < 4; j++) {
        k = j;
        while (k - 1 >= 0 && this.cacheState.data[i][k - 1].isEmpty()) {
          if (
            !this.cacheState.data[i][k].isEmpty() ||
            !this.cacheState.data[i][k - 1].isEmpty()
          )
            this.cacheState.moves++;
          this.cacheState.data[i][k].swap(this.cacheState.data[i][k - 1]);
          k--;
        }
      }
    }
  }

  private addLeft() {
    var i, j;
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 3; j++) {
        if (this.cacheState.data[i][j].check(this.cacheState.data[i][j + 1])) {
          this.cacheState.data[i][j].combine(this.cacheState.data[i][j + 1]);
          this.cacheState.adds++;
          this.cacheState.scores += this.cacheState.data[i][j].value;
          this.moveLeft();
        }
      }
    }
  }

  private moveRight() {
    var i, j, k;
    for (i = 0; i < 4; i++) {
      for (j = 2; j >= 0; j--) {
        k = j;
        while (k + 1 <= 3 && this.cacheState.data[i][k + 1].isEmpty()) {
          if (
            !this.cacheState.data[i][k + 1].isEmpty() ||
            !this.cacheState.data[i][k].isEmpty()
          )
            this.cacheState.moves++;
          this.cacheState.data[i][k + 1].swap(this.cacheState.data[i][k]);
          k++;
        }
      }
    }
  }

  private addRight() {
    var i, j;
    for (i = 0; i < 4; i++) {
      for (j = 3; j >= 1; j--) {
        if (this.cacheState.data[i][j].check(this.cacheState.data[i][j - 1])) {
          this.cacheState.data[i][j].combine(this.cacheState.data[i][j - 1]);
          this.cacheState.adds++;
          this.cacheState.scores += this.cacheState.data[i][j].value;
          this.moveRight();
        }
      }
    }
  }

  private moveUp() {
    var i, j, k;
    for (j = 0; j < 4; j++) {
      for (i = 1; i < 4; i++) {
        k = i;
        while (k - 1 >= 0 && this.cacheState.data[k - 1][j].isEmpty()) {
          if (
            !this.cacheState.data[k][j].isEmpty() ||
            !this.cacheState.data[k - 1][j].isEmpty()
          )
            this.cacheState.moves++;
          this.cacheState.data[k][j].swap(this.cacheState.data[k - 1][j]);
          k--;
        }
      }
    }
  }

  private addUp() {
    var i, j;
    for (j = 0; j < 4; j++) {
      for (i = 0; i < 3; i++) {
        if (this.cacheState.data[i][j].check(this.cacheState.data[i + 1][j])) {
          this.cacheState.data[i][j].combine(this.cacheState.data[i + 1][j]);
          this.cacheState.adds++;
          this.cacheState.scores += this.cacheState.data[i][j].value;
          this.moveUp();
        }
      }
    }
  }

  private moveDown() {
    var i, j, k;
    for (j = 0; j < 4; j++) {
      for (i = 2; i >= 0; i--) {
        k = i;
        while (k + 1 <= 3 && this.cacheState.data[k + 1][j].isEmpty()) {
          if (
            !this.cacheState.data[k + 1][j].isEmpty() ||
            !this.cacheState.data[k][j].isEmpty()
          )
            this.cacheState.moves++;
          this.cacheState.data[k + 1][j].swap(this.cacheState.data[k][j]);
          k++;
        }
      }
    }
  }

  private addDown() {
    var i, j;
    for (j = 0; j < 4; j++) {
      for (i = 3; i >= 1; i--) {
        if (this.cacheState.data[i - 1][j].check(this.cacheState.data[i][j])) {
          this.cacheState.data[i][j].combine(this.cacheState.data[i - 1][j]);
          this.cacheState.adds++;
          this.cacheState.scores += this.cacheState.data[i][j].value;
          this.moveDown();
        }
      }
    }
  }
}

function initGame() {
  var newState: State = { data: [], adds: 0, moves: 0, scores: 0 };
  for (var i = 0; i < 4; i++) {
    newState.data[i] = [];
    for (var j = 0; j < 4; j++) {
      newState.data[i][j] = new NumberItem(0);
    }
  }

  var idx1 = Math.floor(Math.random() * 4);
  var idy1 = Math.floor(Math.random() * 4);
  var idx2 = 0;
  var idy2 = 0;
  do {
    idx2 = Math.floor(Math.random() * 4);
    idy2 = Math.floor(Math.random() * 4);
  } while (idx1 === idx2 && idy1 === idy2);

  newState.data[idx1][idy1].reset(2);
  newState.data[idx2][idy2].reset(2);

  return newState;
}

function getWidth() {
  if (!this.width) {
    const { height, width } = Dimensions.get("window");
    this.height = height;
    this.width = width;
  }
  return this.width - 20;
}

function getCellLength() {
  if (!this.width) {
    const { height, width } = Dimensions.get("window");
    this.height = height;
    this.width = width;
  }
  return (this.width - 20 - 25) / 4;
}

function getColorStyle(val) {
  return val === 0 ? {} : { backgroundColor: CellColors[val] };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    alignContent: "center",
    backgroundColor: "#faf8ef",
    padding: 10,
    paddingTop: 20,
    alignItems: "flex-end"
  },
  box: {
    backgroundColor: "#bbada0",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 5,
    height: getWidth()
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center"
  },
  cell: {
    width: getCellLength(),
    height: getCellLength(),
    marginRight: 5,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cdc1b4",
    borderRadius: 4
  },
  text: {
    fontSize: 25
  },
  title: {
    width: "50%"
  }
});
