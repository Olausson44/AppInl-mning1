// Denna fil genereras automatiskt av scripts/generate-sounds.js
export type SoundCategory = "break" | "goal" | "penalty";

export interface SoundTrack {
  id: number;
  title: string;
  source: any;
  timeMarker?: number;
  category: SoundCategory;
}

export const sounds: SoundTrack[] = [
  {
    id: 1,
    title: "Baby's Gang - Happy Song (Pulsedriver Clap Your Hands Remix)",
    source: require("../assets/musik2025/Baby's Gang - Happy Song (Pulsedriver Clap Your Hands Remix).mp3"),
    timeMarker: 60,
    category: "break",
  },
  {
    id: 2,
    title: "Blasterjaxx & Timmy Trumpet - Time To Say Goodbye",
    source: require("../assets/musik2025/Blasterjaxx & Timmy Trumpet - Time To Say Goodbye (Official Music Video).mp3"),
    timeMarker: 60,
    category: "break",
  },
  {
    id: 3,
    title: "Yihaa (Remix)",
    source: require("../assets/musik2025/Goal/Yihaa (Remix).mp3"),
    timeMarker: 60,
    category: "goal",
  },
  {
    id: 4,
    title: "Så får man inte göra",
    source: require("../assets/musik2025/Penalty/Så får man inte göra.mp3"),
    timeMarker: 60,
    category: "penalty",
  },
];
