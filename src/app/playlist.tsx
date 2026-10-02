import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect, router } from "expo-router";

import { sounds } from "../sounds";

export default function Playlist() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, [])
  );

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