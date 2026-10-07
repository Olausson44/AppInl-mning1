import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { sounds, SoundTrack } from "../sounds";

function shuffleList<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function Playlist() {
  const [filter, setFilter] = useState<"all" | "break" | "goal" | "penalty">("all");
  const [customSongs, setCustomSongs] = useState<SoundTrack[]>([]);
  const [playlistOrder, setPlaylistOrder] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

      async function loadData() {
        const saved = await AsyncStorage.getItem("custom_songs");
        if (saved) {
          setCustomSongs(JSON.parse(saved));
        }
        const savedOrder = await AsyncStorage.getItem("playlist_order");
        if (savedOrder) {
          setPlaylistOrder(JSON.parse(savedOrder));
        }
      }
      loadData();
    }, [])
  );

  const pickSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const cleanName = file.name.replace(/\.[^/.]+$/, "");

        const newTrack: SoundTrack = {
          id: Date.now(),
          title: cleanName,
          source: { uri: file.uri },
          category: "break",
        };

        const updated = [newTrack, ...customSongs];
        setCustomSongs(updated);
        await AsyncStorage.setItem("custom_songs", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Fel vid import av låt:", error);
    }
  };

  const rawSounds = [...sounds, ...customSongs];

  const allSounds =
    playlistOrder.length > 0
      ? [...rawSounds].sort((a, b) => {
          const idxA = playlistOrder.indexOf(a.id);
          const idxB = playlistOrder.indexOf(b.id);
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        })
      : rawSounds;

  const handleShuffle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const shuffled = shuffleList(rawSounds);
    const newOrder = shuffled.map((s) => s.id);
    setPlaylistOrder(newOrder);
    await AsyncStorage.setItem("playlist_order", JSON.stringify(newOrder));
  };

  const filteredSounds =
    filter === "all"
      ? allSounds
      : allSounds.filter((s) => s.category === filter);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "goal":
        return { label: "MÅL", bg: "#1e3a8a", text: "#93c5fd" };
      case "penalty":
        return { label: "UTVISNING", bg: "#713f12", text: "#fde047" };
      default:
        return { label: "PAUS", bg: "#14532d", text: "#86efac" };
    }
  };

  const renderItem = ({ item }: { item: SoundTrack }) => {
    const badge = getCategoryBadge(item.category);

    return (
      <Pressable
        style={styles.songCard}
        onPress={() => router.push(`/song/${item.id}`)}
      >
        <View style={styles.songIconBox}>
          <Foundation name="music" size={24} color="#ffd700" />
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        <Foundation name="arrow-right" size={20} color="#666666" />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSounds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Matchlåtar ({filteredSounds.length} st)
            </Text>
            <Text style={styles.headerSubtitle}>
              Tryck på en låt för att justera dess startposition och provlyssna.
            </Text>

            <View style={styles.actionRow}>
              <Pressable style={styles.importButton} onPress={pickSong}>
                <Foundation name="plus" size={16} color="#000000" />
                <Text style={styles.importButtonText}>Importera låt</Text>
              </Pressable>

              <Pressable style={styles.shuffleButton} onPress={handleShuffle}>
                <Foundation name="shuffle" size={16} color="#ffd700" />
                <Text style={styles.shuffleButtonText}>Slumpa ordning</Text>
              </Pressable>
            </View>

            <View style={styles.filterRow}>
              <Pressable
                style={[
                  styles.filterPill,
                  filter === "all" && styles.filterPillActive,
                ]}
                onPress={() => setFilter("all")}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === "all" && styles.filterPillTextActive,
                  ]}
                >
                  Alla ({allSounds.length})
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterPill,
                  filter === "break" && styles.filterPillActive,
                ]}
                onPress={() => setFilter("break")}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === "break" && styles.filterPillTextActive,
                  ]}
                >
                  Paus ({allSounds.filter((s) => s.category === "break").length})
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterPill,
                  filter === "goal" && styles.filterPillActive,
                ]}
                onPress={() => setFilter("goal")}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === "goal" && styles.filterPillTextActive,
                  ]}
                >
                  Mål ({allSounds.filter((s) => s.category === "goal").length})
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterPill,
                  filter === "penalty" && styles.filterPillActive,
                ]}
                onPress={() => setFilter("penalty")}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === "penalty" && styles.filterPillTextActive,
                  ]}
                >
                  Utvisning ({allSounds.filter((s) => s.category === "penalty").length})
                </Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: "#ffd700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 14,
  },
  songCard: {
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  songIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
    width: "100%",
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: "#ffd700",
    borderColor: "#ffd700",
  },
  filterPillText: {
    color: "#94a3b8",
    fontSize: 11.5,
    fontWeight: "600",
    textAlign: "center",
  },
  filterPillTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    width: "100%",
  },
  importButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd700",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  importButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "bold",
  },
  shuffleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#ffd700",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  shuffleButtonText: {
    color: "#ffd700",
    fontSize: 13,
    fontWeight: "bold",
  },
});
