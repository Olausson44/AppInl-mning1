import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { sounds } from "../sounds";

export default function Playlist() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    }, []),
  );

  return (
    <View>
      <FlatList
        data={sounds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/song/${item.id}`)}>
            <Text>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
