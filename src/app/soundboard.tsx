import { Foundation } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Pressable, StyleSheet, Text, View } from "react-native";
const soundSource = require("../../assets/DjTunder.mp3");

export default function Soundboard() {
  const player = useAudioPlayer(soundSource);
  const status = useAudioPlayerStatus(player);

  const playsound = () => {
    if (status.playing) {
      player.pause();
      player.seekTo(0);
    } else {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soundboard</Text>
      <Text style={styles.subtitle}>Press to play sound!</Text>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: status.playing ? "#ef4444" : "#22c553" },
        ]}
        onPress={playsound}
      >
        <Foundation
          name={status.playing ? "stop" : "play"}
          size={24}
          color="#ffffff"
        />

        <Text style={styles.buttonText}>
          {!status.playing ? "Start" : "Stop"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
