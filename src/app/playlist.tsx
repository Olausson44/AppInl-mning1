import { useState, useEffect, useCallback } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "expo-router";

import { sounds, SoundTrack } from "../sounds";

export default function Playlist() {
  const [selectedSong, setSelectedSong] = useState<SoundTrack | null>(null);
useFocusEffect(
  useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []));
  return (
    <View>
      {sounds.map((s) => (
        <Pressable key={s.id} onPress={() => setSelectedSong(s)}>
          <Text>{s.title}</Text>
        </Pressable>
      ))}
      <Modal visible={selectedSong !== null} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={{ textAlign: "center", fontSize: 24 }}>{selectedSong?.title}</Text>
        
        <Pressable onPress={() => setSelectedSong(null)} style={{ marginTop: 20 }}>
          <Text style={styles.modaltext}>Stäng</Text>
        </Pressable>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#ffffff", // Vit fin bakgrund på popupen
    },
  modaltext:{
color: "#f10909"
  },
  modalbutton:{
    flex: 1,
    alignContent: "flex-end"
  }
})