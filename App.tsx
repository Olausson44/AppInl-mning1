import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

export default function App() {
  const [buttonValue, setbuttonValue] = useState(0);
  return (
    <View style={[styles.container, { backgroundColor: "blue" }]}>
      <Pressable
        style={styles.button}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setbuttonValue(buttonValue + 1);
        }}
      >
        <Text>Klicka mig!</Text>
      </Pressable>
      <Text style={styles.counter}>{buttonValue}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#46e91e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9,
    marginTop: 20,
  },
  counter: {
    marginTop: 20,
    color: "#ffff",
    fontSize: 26,
  },
});
