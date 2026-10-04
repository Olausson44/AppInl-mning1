import { Foundation } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DJ FLOORBALL</Text>
        <Text style={styles.subtitle}>Match & Arena Soundboard</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.card}
          onPress={() => router.push("/soundboard")}
        >
          <Foundation name="play-circle" size={36} color="#ffd700" />
          <Text style={styles.cardText}>Soundboard</Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/playlist")}
        >
          <Foundation name="list" size={36} color="#ffd700" />
          <Text style={styles.cardText}>Spellista</Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/trivia")}
        >
          <Foundation name="megaphone" size={36} color="#ffd700" />
          <Text style={styles.cardText}>Pausfråga</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#ffd700",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 720,
  },
  card: {
    flex: 1,
    height: 130,
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "#2c2c2e",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
