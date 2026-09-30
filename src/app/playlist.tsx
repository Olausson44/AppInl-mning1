import { useState, useEffect, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect, router } from "expo-router";

import { sounds, SoundTrack } from "../sounds";

export default function Playlist() {
  
useFocusEffect(
  useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []));
  return (
    <View>
      {sounds.map((s) => (
        <Pressable key={s.id} onPress={() => router.push(`/song/${s.id}`)}>
          <Text>{s.title}</Text>
        </Pressable>
      ))}
      
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