import { Foundation } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { sounds, SoundTrack } from "../sounds";

export default function Soundboard() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, []),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [penaltyIndex, setPenaltyIndex] = useState(0);
  const player = useAudioPlayer(sounds[currentIndex].source);
  const status = useAudioPlayerStatus(player);
  const [activeButton, setActiveButton] = useState<
    "break" | "penalty" | "goal" | null
  >(null);
  const isBreakPlaying = status.playing && activeButton === "break";
  const isPenaltyPlaying = status.playing && activeButton === "penalty";
  const isGoalPlaying = status.playing && activeButton === "goal";
  const goalSounds = sounds.filter((s) => s.category === "goal");
  const breakSounds = sounds.filter((s) => s.category === "break");
  const penaltySounds = sounds.filter((s) => s.category === "penalty");

  // Ladda in senast spelade Break-låt när appen öppnas
  useEffect(() => {
    async function loadLastPlayed() {
      const saved = await AsyncStorage.getItem("last_break_index");
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < breakSounds.length) {
          setCurrentIndex(idx);
        }
      }
    }
    loadLastPlayed();
  }, [breakSounds.length]);

  const handleNext = async () => {
    if (status.playing) {
      player.pause();
      player.seekTo(0);
      setActiveButton(null);
    }
    const nextIndex = (currentIndex + 1) % breakSounds.length;
    setCurrentIndex(nextIndex);
    await AsyncStorage.setItem("last_break_index", nextIndex.toString());
  };

  const handlePrevious = async () => {
    if (status.playing) {
      player.pause();
      player.seekTo(0);
      setActiveButton(null);
    }
    const prevIndex =
      (currentIndex - 1 + breakSounds.length) % breakSounds.length;
    setCurrentIndex(prevIndex);
    await AsyncStorage.setItem("last_break_index", prevIndex.toString());
  };

  const handlePlay = async (
    type: "break" | "goal" | "penalty",
    song: SoundTrack,
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (status.playing && activeButton === type) {
      player.pause();
      player.seekTo(0);
      if (type === "penalty") {
        setPenaltyIndex((penaltyIndex + 1) % penaltySounds.length);
      }
      if (type === "break") {
        const nextIndex = (currentIndex + 1) % breakSounds.length;
        setCurrentIndex(nextIndex);
        await AsyncStorage.setItem("last_break_index", nextIndex.toString());
      }

      setActiveButton(null);
    } else {
      // Hämta sparad starttid från telefonens minne först
      const stored = await AsyncStorage.getItem(`marker_${song.id}`);
      const startTime =
        stored !== null ? parseFloat(stored) : song.timeMarker || 0;

      // Om det är en break-låt: kom ihåg att det är den vi spelar
      if (type === "break") {
        await AsyncStorage.setItem("last_break_index", currentIndex.toString());
      }

      player.replace(song.source);
      player.play();

      // Spola till sparad starttid så fort låten laddats in av telefonen
      if (startTime > 0) {
        player.seekTo(startTime);
        setTimeout(() => {
          player.seekTo(startTime);
        }, 150);
      }

      setActiveButton(type);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Pressable
          style={[
            styles.buttonGoal,
            { backgroundColor: isPenaltyPlaying ? "#ef4444" : "#d0df08" },
          ]}
          onPress={() => handlePlay("penalty", penaltySounds[penaltyIndex])}
        >
          <Text style={styles.buttonText}>
            {!isPenaltyPlaying ? "PENALTY" : "Stop"}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.buttonGoal,
            { backgroundColor: isGoalPlaying ? "#ef4444" : "#312ee9" },
          ]}
          onPress={() => handlePlay("goal", goalSounds[0])}
        >
          <Text style={styles.buttonText}>
            {!isGoalPlaying ? "GOAL" : "Stop"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {breakSounds[currentIndex]?.title}
        </Text>

        <View style={styles.breakControls}>
          <Pressable style={styles.navButton} onPress={handlePrevious}>
            <Foundation name="previous" size={32} color="#ffd700" />
          </Pressable>

          <Pressable
            style={[
              styles.buttonBreak,
              { backgroundColor: isBreakPlaying ? "#ef4444" : "#22c553" },
            ]}
            onPress={() => handlePlay("break", breakSounds[currentIndex])}
          >
            <Foundation
              name={status.playing ? "stop" : "play"}
              size={28}
              color="#ffffff"
            />
            <Text style={styles.buttonText}>
              {!isBreakPlaying ? "Start" : "Stop"}
            </Text>
          </Pressable>

          <Pressable style={styles.navButton} onPress={handleNext}>
            <Foundation name="next" size={32} color="#ffd700" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    gap: 15,

    backgroundColor: "#121212",
  },
  leftContainer: {
    flex: 1,
    gap: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#e9eff7",
  },
  breakControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  navButton: {
    backgroundColor: "#1e1e1e",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    width: 60,
  },
  buttonBreak: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 6,
    height: 180,
    width: 200,
  },
  buttonPenalty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    elevation: 6,
    height: 100,
    width: 100,
  },
  buttonGoal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    elevation: 6,
    height: 100,
    width: 250,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  songTitle: {
    color: "#ffd700", // Guld som matchar menyn! (Eller "#ffffff" för krispigt vitt)
    fontSize: 18, // Lite större och tydligare text
    fontWeight: "bold", // Fet stil
    marginBottom: 12, // Lite luft ner till den stora knappen
    textAlign: "center", // Centrerad text
  },
});
