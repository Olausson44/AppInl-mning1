import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { sounds } from "../../sounds";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import{useEffect, useState} from "react";
import { StyleSheet } from "react-native";

export default function SongDetail() {
    
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedSong = sounds.find((s) => s.id === Number(id));
  const player = useAudioPlayer(selectedSong?.source);
  const status = useAudioPlayerStatus(player);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [savedStartTime, setSavedStartTime] = useState(selectedSong?.timeMarker);

  useEffect(() => {
      // När låt-ID ändras: ladda in den nya låtens sparade starttid!
      setSavedStartTime(selectedSong?.timeMarker);
      setSliderPosition(selectedSong?.timeMarker || 0);
    }, [id]);
  
  const handlePlay = () => {
    if (status.playing) {
      player.pause();
      player.seekTo(0);
    } else {
      player.seekTo(sliderPosition);
      player.play();
    }
  };

  const handleSaveStartTime = () => {
    if (selectedSong) {
      selectedSong.timeMarker = sliderPosition;
      setSavedStartTime(sliderPosition);
    }
  };

  return (
    <View>
      <View>
        <Text style={{ fontSize: 18, color: "red", padding: 10 }}>Hej{id}</Text>

        <Pressable onPress={() => router.navigate(`/playlist`)}>
          <Text style={{ fontSize: 18, color: "red", padding: 10 }}>Close</Text>
        </Pressable>

        <Text>
          {selectedSong?.id}
          {selectedSong?.title}
        </Text>
      </View>
      <View>
        <Pressable onPress={() => handlePlay()}>
          <Text style={styles.playbutton}>{!status.playing ? "Play" : "Stop"}</Text>
        </Pressable>
        
        <Slider
          style={{ width: 400, height: 100 }}
          minimumValue={0}
          maximumValue={status.duration}
          onValueChange={(value) => setSliderPosition(value)}
          onSlidingComplete={(value) => player.seekTo(value)}
          minimumTrackTintColor="#2db312"
          maximumTrackTintColor="#eb0f0f"
          thumbSize={32}
          thumbTintColor="#aae422"
        />
        <Pressable onPress={handleSaveStartTime}>
          <Text style={styles.playbutton}>SAVE</Text> 
        </Pressable>
        <Text>Reglagets position: {sliderPosition}</Text>
        <Text>Aktuell speltid: {status.currentTime}</Text>
        <Text>Sparad starttid: {savedStartTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    playbutton: {
      flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    elevation: 6,
    height: 200,
    width: 300,  
    }
})