import { Foundation } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#ffd700",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#000000",
          marginBottom: 20,
          alignContent: "center",
        },
        tabBarIconStyle: { marginTop: 5 },
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
          title: "Soundboard",
          tabBarIcon: (props) => <Foundation name="play-circle" {...props} />,
        }}
      />
    </Tabs>
  );
}
