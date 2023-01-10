import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function Task({ text, active }) {
  const [checkbox, setCheckbox] = useState(false);
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={active ? styles.square : styles.completed}></View>
        <Text style={active ? styles.itemText : styles.textOverline}>
          {text}
        </Text>
      </View>
      {/* <View style={active ? styles.circular : styles.completedcir}></View> */}
      <BouncyCheckbox isChecked={!active} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55BC56",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  completed: {
    width: 24,
    height: 24,
    backgroundColor: "#fca5a5",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  textOverline: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#afaaaa",
  },
  completedcir: {
    width: 12,
    height: 12,
    backgroundColor: "#55bcf6",
    borderRadius: 5,
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: "#55bcf6",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
