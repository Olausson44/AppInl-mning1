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
  const [customBreakSounds, setCustomBreakSounds] = useState<SoundTrack[]>([]);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      async function loadCustom() {
        const saved = await AsyncStorage.getItem("custom_songs");
        if (saved) {
          const list: SoundTrack[] = JSON.parse(saved);
          setCustomBreakSounds(list.filter((s) => s.category === "break"));
        }
      }
      loadCustom();
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
  const breakSounds = [
    ...sounds.filter((s) => s.category === "break"),
    ...customBreakSounds,
  ];
  const penaltySounds = sounds.filter((s) => s.category === "penalty");
  const nextBreakSong = breakSounds[(currentIndex + 1) % breakSounds.length];

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
      {/* Centrerad topp-panel med nästa låt och bläddring */}
      <View style={styles.topBar}>
        <View style={styles.nextSongContainer}>
          <Pressable style={styles.arrowButton} onPress={handlePrevious}>
            <Foundation name="previous" size={24} color="#ffd700" />
          </Pressable>

          <View style={styles.nextSongTextWrapper}>
            <Text style={styles.nextSongLabel}>NÄSTA I KÖN</Text>
            <Text style={styles.nextSongTitle} numberOfLines={1}>
              {nextBreakSong?.title}
            </Text>
          </View>

          <Pressable style={styles.arrowButton} onPress={handleNext}>
            <Foundation name="next" size={24} color="#ffd700" />
          </Pressable>
        </View>
      </View>

      {/* Huvuddelen med knapparna (vänster och höger) */}
      <View style={styles.mainRow}>
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
          {/* Stor start/stopp-knapp med låtens namn inuti */}
          <Pressable
            style={[
              styles.buttonBreak,
              { backgroundColor: isBreakPlaying ? "#ef4444" : "#22c553" },
            ]}
            onPress={() => handlePlay("break", breakSounds[currentIndex])}
          >
            <Foundation
              name={isBreakPlaying ? "stop" : "play"}
              size={36}
              color="#ffffff"
            />
            <Text style={styles.buttonBreakStatus}>
              {isBreakPlaying ? "STOPP" : "SPELA PAUS"}
            </Text>
            <Text style={styles.buttonBreakSongTitle} numberOfLines={2}>
              {breakSounds[currentIndex]?.title}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#121212",
  },
  topBar: {
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  nextSongContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: "70%",
    maxWidth: 420,
  },
  arrowButton: {
    padding: 8,
  },
  nextSongTextWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  nextSongLabel: {
    color: "#ffd700",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  nextSongTitle: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  mainRow: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  leftContainer: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBreak: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 6,
    height: 190,
    width: 290,
  },
  buttonBreakStatus: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 6,
  },
  buttonBreakSongTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.95,
    paddingHorizontal: 8,
  },
  buttonGoal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 6,
    height: 85,
    width: 260,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
