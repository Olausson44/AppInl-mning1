import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { sounds, SoundTrack } from "../sounds";

export default function Playlist() {
  const [filter, setFilter] = useState<"all" | "break" | "goal" | "penalty">("all");
  const [customSongs, setCustomSongs] = useState<SoundTrack[]>([]);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

      async function loadCustomSongs() {
        const saved = await AsyncStorage.getItem("custom_songs");
        if (saved) {
          setCustomSongs(JSON.parse(saved));
        }
      }
      loadCustomSongs();
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

  const allSounds = [...sounds, ...customSongs];

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

            <Pressable style={styles.importButton} onPress={pickSong}>
              <Foundation name="plus" size={18} color="#000000" />
              <Text style={styles.importButtonText}>
                Importera låt från telefonen
              </Text>
            </Pressable>

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
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd700",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  importButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },
});
