import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as ScreenOrientation from "expo-screen-orientation";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { sounds, SoundCategory, SoundTrack } from "../../sounds";

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSong, setSelectedSong] = useState<SoundTrack | undefined>(
    sounds.find((s) => s.id === Number(id))
  );
  const player = useAudioPlayer(selectedSong?.source);
  const status = useAudioPlayerStatus(player);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [savedStartTime, setSavedStartTime] = useState<number | undefined>(
    selectedSong?.timeMarker,
  );

  useEffect(() => {
    async function findSong() {
      const foundInBuiltin = sounds.find((s) => s.id === Number(id));
      if (foundInBuiltin) {
        setSelectedSong(foundInBuiltin);
      } else {
        const saved = await AsyncStorage.getItem("custom_songs");
        if (saved) {
          const list: SoundTrack[] = JSON.parse(saved);
          const found = list.find((s) => s.id === Number(id));
          if (found) {
            setSelectedSong(found);
          }
        }
      }
    }
    findSong();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

      return () => {
        player.pause();
      };
    }, [player])
  );

  // Ladda in rätt ljudfil i spelaren när låten ändras
  useEffect(() => {
    if (selectedSong?.source) {
      player.replace(selectedSong.source);
    }
  }, [selectedSong, player]);

  // Pausa när man lämnar skärmen
  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  useEffect(() => {
    async function loadSavedTime() {
      const storedTime = await AsyncStorage.getItem(`marker_${id}`);
      if (storedTime !== null) {
        const time = parseFloat(storedTime);
        setSavedStartTime(time);
        setSliderPosition(time);
      } else {
        const initial = selectedSong?.timeMarker || 0;
        setSavedStartTime(initial);
        setSliderPosition(initial);
      }
    }

    loadSavedTime();
  }, [id, selectedSong]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const seekBackward = () => {
    const newPos = Math.max(0, sliderPosition - 10);
    setSliderPosition(newPos);
    player.seekTo(newPos);
  };

  const seekForward = () => {
    const maxDuration = status.duration > 0 ? status.duration : 100;
    const newPos = Math.min(maxDuration, sliderPosition + 10);
    setSliderPosition(newPos);
    player.seekTo(newPos);
  };

  const handlePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.seekTo(sliderPosition);
      player.play();
    }
  };

  const isCustomSong = !sounds.some((s) => s.id === Number(id));

  const handleDeleteSong = () => {
    Alert.alert(
      "Ta bort låt",
      "Vill du ta bort denna importerade låt från spellistan?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            player.pause();
            const saved = await AsyncStorage.getItem("custom_songs");
            if (saved) {
              const list: SoundTrack[] = JSON.parse(saved);
              const updated = list.filter((s) => s.id !== Number(id));
              await AsyncStorage.setItem("custom_songs", JSON.stringify(updated));
              await AsyncStorage.removeItem(`marker_${id}`);
            }
            router.replace("/playlist");
          },
        },
      ]
    );
  };

  const handleSaveStartTime = async () => {
    await AsyncStorage.setItem(`marker_${id}`, sliderPosition.toString());
    setSavedStartTime(sliderPosition);
    Alert.alert(
      "Sparat!",
      `Starttiden är nu sparad till ${formatTime(sliderPosition)}`,
    );
  };

  const handleChangeCategory = async (newCategory: SoundCategory) => {
    Haptics.selectionAsync();
    if (!selectedSong) return;

    setSelectedSong((prev) => (prev ? { ...prev, category: newCategory } : prev));

    const saved = await AsyncStorage.getItem("custom_songs");
    if (saved) {
      const list: SoundTrack[] = JSON.parse(saved);
      const updatedList = list.map((s) =>
        s.id === Number(id) ? { ...s, category: newCategory } : s
      );
      await AsyncStorage.setItem("custom_songs", JSON.stringify(updatedList));
    }
  };

  const handleBack = () => {
    player.pause();
    router.navigate("/playlist");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <Text style={{ fontSize: 18, color: "#ffd700", padding: 10 }}>Tillbaka</Text>
        </Pressable>

        <Text style={styles.titleText}>
          {selectedSong?.title}
        </Text>
      </View>

      {isCustomSong ? (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeading}>KATEGORI FÖR DENNA LÅT</Text>
          <View style={styles.categoryRow}>
            <Pressable
              style={[
                styles.categoryPill,
                selectedSong?.category === "break" && styles.categoryPillActiveBreak,
              ]}
              onPress={() => handleChangeCategory("break")}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedSong?.category === "break" && styles.categoryPillTextActive,
                ]}
              >
                Paus
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryPill,
                selectedSong?.category === "goal" && styles.categoryPillActiveGoal,
              ]}
              onPress={() => handleChangeCategory("goal")}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedSong?.category === "goal" && styles.categoryPillTextActive,
                ]}
              >
                Mål
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryPill,
                selectedSong?.category === "penalty" && styles.categoryPillActivePenalty,
              ]}
              onPress={() => handleChangeCategory("penalty")}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedSong?.category === "penalty" && styles.categoryPillTextActive,
                ]}
              >
                Utvisning
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.builtInBadge}>
          <Text style={styles.builtInBadgeText}>
            Kategori: {selectedSong?.category === "goal" ? "Mål" : selectedSong?.category === "penalty" ? "Utvisning" : "Paus"}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <View style={styles.playbackRow}>
          <Pressable style={styles.seekButton} onPress={seekBackward}>
            <Text style={styles.seekButtonText}>-10s</Text>
          </Pressable>

          <Pressable style={styles.playbutton} onPress={() => handlePlay()}>
            <Text style={styles.playButtonText}>
              {!status.playing ? "Play" : "Stop"}
            </Text>
          </Pressable>

          <Pressable style={styles.seekButton} onPress={seekForward}>
            <Text style={styles.seekButtonText}>+10s</Text>
          </Pressable>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status.duration > 0 ? status.duration : 100}
            value={sliderPosition}
            onValueChange={(value) => setSliderPosition(value)}
            onSlidingComplete={(value) => {
              setSliderPosition(value);
              player.seekTo(value);
            }}
            minimumTrackTintColor="#2db312"
            maximumTrackTintColor="#eb0f0f"
            thumbTintColor="#aae422"
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>0:00</Text>
            <Text style={styles.timeLabel}>
              {status.duration > 0 ? formatTime(status.duration) : "0:00"}
            </Text>
          </View>
        </View>

        <Pressable onPress={handleSaveStartTime}>
          <Text style={styles.savebutton}>SAVE</Text>
        </Pressable>

        {isCustomSong && (
          <Pressable style={styles.deleteButton} onPress={handleDeleteSong}>
            <Text style={styles.deleteButtonText}>Ta bort importerad låt</Text>
          </Pressable>
        )}

        <Text style={styles.infoText}>
          Reglagets position: {formatTime(sliderPosition)}
        </Text>
        <Text style={styles.infoText}>
          Aktuell speltid: {formatTime(status.currentTime)}
        </Text>
        <Text style={styles.infoText}>
          Sparad starttid: {savedStartTime !== undefined ? formatTime(savedStartTime) : "Ingen"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  controls: {
    alignItems: "center",
    gap: 16,
  },
  playbackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
  },
  seekButton: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  seekButtonText: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16,
  },
  playbutton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22c553",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
  },
  playButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  sliderContainer: {
    width: "90%",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  timeLabel: {
    color: "#94a3b8",
    fontSize: 14,
  },
  savebutton: {
    color: "#ffffff",
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    overflow: "hidden",
  },
  infoText: {
    color: "#e2e8f0",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#7f1d1d",
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  deleteButtonText: {
    color: "#fca5a5",
    fontWeight: "bold",
    fontSize: 15,
  },
  categoryContainer: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  categoryHeading: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  categoryPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  categoryPillActiveBreak: {
    backgroundColor: "#14532d",
    borderColor: "#22c55e",
  },
  categoryPillActiveGoal: {
    backgroundColor: "#1e3a8a",
    borderColor: "#3b82f6",
  },
  categoryPillActivePenalty: {
    backgroundColor: "#713f12",
    borderColor: "#eab308",
  },
  categoryPillText: {
    color: "#a3a3a3",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryPillTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  builtInBadge: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
  },
  builtInBadgeText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
});
