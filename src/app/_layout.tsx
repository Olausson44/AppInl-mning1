import { Foundation } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === "android" ? 22 : 12);

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#ffd700",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: "#000000",
            borderTopColor: "#222222",
            height: 64 + bottomInset,
            paddingBottom: bottomInset + 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          },
          tabBarIconStyle: { marginTop: 0 },
          tabBarActiveTintColor: "#ffd700",
          tabBarInactiveTintColor: "#ffffff",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dj-Floorball",
            tabBarIcon: (props) => <Foundation name="home" {...props} />,
          }}
        />
        <Tabs.Screen
          name="soundboard"
          options={{
            headerShown: false,
            title: "Soundboard",
            tabBarIcon: (props) => <Foundation name="play-circle" {...props} />,
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: "Spellista",
            tabBarIcon: (props) => <Foundation name="list" {...props} />,
          }}
        />
        <Tabs.Screen
          name="trivia"
          options={{
            title: "Pausfråga",
            tabBarIcon: (props) => <Foundation name="megaphone" {...props} />,
          }}
        />
        <Tabs.Screen
          name="song/[id]"
          options={{
            href: null,
            title: "Låtdetaljer",
          }}
        />
      </Tabs>
    </>
  );
}
