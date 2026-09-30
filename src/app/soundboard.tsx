import { Foundation } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { sounds, SoundTrack } from "..//sounds";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";


export default function Soundboard() {
  useFocusEffect(
  useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [penaltyIndex, setPenaltyIndex]= useState(0);
  const player = useAudioPlayer(sounds[currentIndex].source);
  const status = useAudioPlayerStatus(player);
  const [activeButton, setActiveButton] = useState<"break" | "penalty" | "goal" | null>(null);
  const isBreakPlaying = status.playing && activeButton === "break";
  const isPenaltyPlaying = status.playing && activeButton === "penalty";
  const isGoalPlaying = status.playing && activeButton === "goal";
  const goalSounds = sounds.filter((s)=> s.category === "goal");
  const breakSounds = sounds.filter((s)=> s.category === "break");
  const penaltySounds = sounds.filter((s)=> s.category === "penalty");

  const handlePlay = (type: "break" | "goal" | "penalty", song: SoundTrack ) =>{
if (status.playing && activeButton === type)
{
  player.pause();
  player.seekTo(0);
  if(type === "penalty")
  {
 setPenaltyIndex((penaltyIndex + 1) % penaltySounds.length);
  }
  if(type === "break")
  {
  setCurrentIndex((currentIndex +1) % breakSounds.length);
  }
  
  setActiveButton(null);
}
else{
  player.replace(song.source);
  player.seekTo(song.timeMarker ||0);
  player.play();
  
  
  setActiveButton(type);

}
  }


  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Pressable
          style={[styles.buttonGoal, {backgroundColor: isPenaltyPlaying? "#ef4444" : "#d0df08" },]}
          onPress={() => handlePlay("penalty", penaltySounds[penaltyIndex])}
        >
          <Text style={styles.buttonText}>
            {!isPenaltyPlaying? "PENALTY" : "Stop"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.buttonGoal, {backgroundColor: isGoalPlaying? "#ef4444" : "#312ee9" },]}
          onPress={() => handlePlay("goal", goalSounds[0])}
        >
          <Text style={styles.buttonText}>
            {!isGoalPlaying ? "GOAL" : "Stop"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.songTitle}>{sounds[currentIndex].title}</Text>

        <Pressable
          style={[
            styles.buttonBreak,
            { backgroundColor: isBreakPlaying ? "#ef4444" : "#22c553" },
          ]}
          onPress={() =>handlePlay("break", breakSounds[currentIndex])}
        >
          <Foundation
            name={status.playing ? "stop" : "play"}
            size={24}
            color="#ffffff"
          />

          <Text style={styles.buttonText}>
            {!isBreakPlaying ? "Start" : "Stop"}
          </Text>
        </Pressable>
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
    gap:60,
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
  buttonBreak: {
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
      color: "#ffd700",      // Guld som matchar menyn! (Eller "#ffffff" för krispigt vitt)
      fontSize: 18,          // Lite större och tydligare text
      fontWeight: "bold",    // Fet stil
      marginBottom: 12,      // Lite luft ner till den stora knappen
      textAlign: "center",   // Centrerad text
    }
});
