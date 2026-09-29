// Denna fil genereras automatiskt av scripts/generate-sounds.js
export type SoundCategory = "break" | "goal" | "penalty";

export interface SoundTrack {
  id: number;
  title: string;
  source: any;
  category: SoundCategory;
}

export const sounds: SoundTrack[] = [
  {
    id: 1,
    title: "Baby's Gang - Happy Song (Pulsedriver Clap Your Hands Remix)",
    source: require("../assets/musik2025/Baby's Gang - Happy Song (Pulsedriver Clap Your Hands Remix).mp3"),
    category: "break",
  },
  {
    id: 2,
    title: "Benjamin Zane - Stand Up (Electric Bullets Remix)",
    source: require("../assets/musik2025/Benjamin Zane - Stand Up (Electric Bullets Remix) [fDNzHtuPois].mp3"),
    category: "break",
  },
  {
    id: 3,
    title: "Björn Ranelid feat. Sara Li Mirakel",
    source: require("../assets/musik2025/Björn Ranelid feat. Sara Li Mirakel.mp3"),
    category: "break",
  },
  {
    id: 4,
    title: "Blasterjaxx & Timmy Trumpet - Time To Say Goodbye",
    source: require("../assets/musik2025/Blasterjaxx & Timmy Trumpet - Time To Say Goodbye (Official Music Video).mp3"),
    category: "break",
  },
  {
    id: 5,
    title: "Bästa Kompisar - Coola Kids ft. Dunderpatrullen",
    source: require("../assets/musik2025/Bästa Kompisar - Coola Kids ft. Dunderpatrullen.mp3"),
    category: "break",
  },
  {
    id: 6,
    title: "Carl Deman - Vafan (Lyrics)",
    source: require("../assets/musik2025/Carl Deman - Vafan (Lyrics).mp3"),
    category: "break",
  },
  {
    id: 7,
    title: "Casanovas - Så kommer känslorna tillbaka (J.O.X EPA Remix)",
    source: require("../assets/musik2025/Casanovas - Så kommer känslorna tillbaka (J.O.X EPA Remix) Lyric Video.mp3"),
    category: "break",
  },
  {
    id: 8,
    title: "Främling - EPA Remix",
    source: require("../assets/musik2025/Främling - EPA Remix [SBOlrPwIkVo].mp3"),
    category: "break",
  },
  {
    id: 9,
    title: "Interactive & Amfree - Can You Feel the Love Tonight",
    source: require("../assets/musik2025/Interactive & Amfree - Can You Feel the Love Tonight [x3hMv0No84o].mp3"),
    category: "break",
  },
  {
    id: 10,
    title: "iZZy D JaY - היה הוה יהיה",
    source: require("../assets/musik2025/iZZy D JaY - היה הוה יהיה.mp3"),
    category: "break",
  },
  {
    id: 11,
    title: "JAJA DING DONG (Remix)",
    source: require("../assets/musik2025/JAJA DING DONG (Remix).mp3"),
    category: "break",
  },
  {
    id: 12,
    title: "Katastrofe - Sangen Du Hater",
    source: require("../assets/musik2025/Katastrofe - Sangen Du Hater.mp3"),
    category: "break",
  },
  {
    id: 13,
    title: "Laserturken - Kaos med han REMIX HOUSE!!! BÄSTA LÅTEN!!!",
    source: require("../assets/musik2025/Laserturken - Kaos med han REMIX HOUSE!!! BÄSTA LÅTEN!!!.mp3"),
    category: "break",
  },
  {
    id: 14,
    title: "Lato Lato Song (LIMIC Remix)",
    source: require("../assets/musik2025/Lato Lato Song (LIMIC Remix) [T2nZ_P-4ics].mp3"),
    category: "break",
  },
  {
    id: 15,
    title: "Let's Go Crazy (Radio Edit)",
    source: require("../assets/musik2025/Let's Go Crazy (Radio Edit) [xjAf1uoUNNg].mp3"),
    category: "break",
  },
  {
    id: 16,
    title: "Letkis-Jenka (J.O.X Remix)",
    source: require("../assets/musik2025/Letkis-Jenka (J.O.X Remix) [2TWwFvFiScg].mp3"),
    category: "break",
  },
  {
    id: 17,
    title: "Om du vill (J.O.X Remix)",
    source: require("../assets/musik2025/Om du vill (J.O.X Remix) [ZvV_pzg8gP4].mp3"),
    category: "break",
  },
  {
    id: 18,
    title: "OMI - Hula Hoop (DJ Justin Bounce Remix)",
    source: require("../assets/musik2025/OMI - Hula Hoop (DJ Justin Bounce Remix) [kDejs_LpEIc].mp3"),
    category: "break",
  },
  {
    id: 19,
    title: "Yihaa (Remix)",
    source: require("../assets/musik2025/Goal/Yihaa (Remix).mp3"),
    category: "goal",
  },
  {
    id: 20,
    title: "Norlie & KKV - Din Idiot",
    source: require("../assets/musik2025/Penalty/Norlie & KKV - Din Idiot [4UxMpjjCsI4].mp3"),
    category: "penalty",
  },
  {
    id: 21,
    title: "Så får man inte göra",
    source: require("../assets/musik2025/Penalty/Så får man inte göra.mp3"),
    category: "penalty",
  },
];
