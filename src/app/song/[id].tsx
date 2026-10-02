import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as ScreenOrientation from "expo-screen-orientation";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { sounds } from "../../sounds";

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedSong = sounds.find((s) => s.id === Number(id));
  const player = useAudioPlayer(selectedSong?.source);
  const status = useAudioPlayerStatus(player);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [savedStartTime, setSavedStartTime] = useState<number | undefined>(
    selectedSong?.timeMarker,
  );

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, [])
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

  const handlePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.seekTo(sliderPosition);
      player.play();
    }
  };

  const handleSaveStartTime = async () => {
    await AsyncStorage.setItem(`marker_${id}`, sliderPosition.toString());
    setSavedStartTime(sliderPosition);
    Alert.alert(
      "Sparat!",
      `Starttiden är nu sparad till ${sliderPosition.toFixed(1)}s`,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.navigate(`/playlist`)}>
          <Text style={{ fontSize: 18, color: "#ffd700", padding: 10 }}>Tillbaka</Text>
        </Pressable>

        <Text style={styles.titleText}>
          {selectedSong?.title}
        </Text>
      </View>
      <View style={styles.controls}>
        <Pressable onPress={() => handlePlay()}>
          <Text style={styles.playbutton}>
            {!status.playing ? "Play" : "Stop"}
          </Text>
        </Pressable>

        <Slider
          style={{ width: "90%", height: 60 }}
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
        <Pressable onPress={handleSaveStartTime}>
          <Text style={styles.savebutton}>SAVE</Text>
        </Pressable>
        <Text style={styles.infoText}>Reglagets position: {sliderPosition.toFixed(1)}s</Text>
        <Text style={styles.infoText}>Aktuell speltid: {status.currentTime.toFixed(1)}s</Text>
        <Text style={styles.infoText}>Sparad starttid: {savedStartTime !== undefined ? savedStartTime.toFixed(1) + "s" : "Ingen"}</Text>
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
  playbutton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22c553",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: "80%",
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
});
