import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { sounds, SoundTrack } from "../sounds";

export default function Playlist() {
  const [selectedSong, setSelectedSong] = useState<SoundTrack | null>(null);

  return (
    <View>
      {sounds.map((s) => (
        <Pressable key={s.id} onPress={() => setSelectedSong(s)}>
          <Text>{s.title}</Text>
        </Pressable>
      ))}
      <Modal visible={selectedSong !== null}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ textAlign: "center" }}>{selectedSong?.id}</Text>
          <Text>{selectedSong?.title}</Text>
          <Pressable onPress={() => setSelectedSong(null)}>
            <Text>Stäng</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
