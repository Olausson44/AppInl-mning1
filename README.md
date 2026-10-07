# DJ-Floorball 🏑

Det här är min app för inlämning 1 i kursen Applikationsutveckling (APP) på SUVNET25.

**GitHub-repo:** [https://github.com/Olausson44/AppInl-mning1](https://github.com/Olausson44/AppInl-mning1)

---

## 1. Beskrivning

När man sitter i sekretariatet på en innebandymatch är det ofta stressigt. Man ska hinna starta och stoppa matchklockan, hålla koll på utvisningar och samtidigt spela musik vid mål, pauser och domaravblåsningar. Ofta sitter man med en laptop eller Spotify där man måste leta efter låtar, och det blir lätt fel.

Jag har byggt **DJ-Floorball** för att lösa detta direkt i mobilen:
- **Soundboard:** Körs i liggande läge för att ge stora och tydliga knappar för Mål, Utvisning och Paus. Pausknappen visar namnet på låten som spelas, och man ser vilken låt som är näst på tur och kan bläddra i kön.
- **Spellista:** En lista i stående läge där man ser alla låtar. Det går att filtrera på kategori (Alla, Paus, Mål, Utvisning) och man kan även lägga till egna mp3-filer från telefonen via en knapp.
- **Låtdetaljer & starttider (Cue-points):** Klickar man på en låt kan man lyssna på den, spola fram och tillbaka 10 sekunder och ställa in exakt var låten ska börja spelas med ett reglage (t.ex. vid refrängen/droppet). Starttiden sparas så soundboarden alltid startar låten därifrån. För egna importerade låtar kan man också välja om den ska vara Mål, Utvisning eller Paus, eller ta bort låten helt.
- **Pausfrågesport:** En flik som hämtar sportfrågor från ett Web-API för att fördriva tiden under periodpauserna.

Appen är tänkt för sekretariatet, match-DJ:s, ledare och föreningar som vill ha en snabb och enkel lösning i mobilen under matcherna.

---

## 2. Så bygger och kör du projektet

1. **Klona repot från GitHub:**
   ```bash
   git clone https://github.com/Olausson44/AppInl-mning1.git
   cd AppInl-mning1
   ```

2. **Installera alla paket:**
   ```bash
   npm install
   ```

3. **Starta appen:**
   ```bash
   npx expo start
   ```

4. **Öppna i telefonen:**
   - Öppna **Expo Go** på din telefon och skanna QR-koden som kommer upp i terminalen (se till att datorn och telefonen är på samma Wi-Fi).

---

## 3. Använda React Native-komponenter

Jag har använt 5 stycken komponenter från React Native i projektet:

1. **`View`**: Används för att bygga upp strukturen på alla skärmar, dela upp sektioner och lägga saker i rader eller kolumner med flexbox.
2. **`Text`**: Används för alla texter, titlar på låtar, speltider, knappar och frågor.
3. **`Pressable`**: Används för alla klickbara knappar i appen, till exempel de stora knapparna på soundboarden, tillbaka-knappar, filterknapparna och spola-knapparna.
4. **`FlatList`**: Används i spellistan för att visa och scrolla igenom alla låtar smidigt utan att appen laggar.
5. **`ActivityIndicator`**: En laddningssnurra som visas på frågesports-skärmen medan en ny fråga hämtas från internet.

---

## 4. Använda Expo SDK-moduler

Här är de 6 Expo-modulerna jag har använt:

1. **`expo-audio`**: Den nya ljudmodulen i Expo SDK 52. Används för att spela upp ljudfilerna, pausa, hålla koll på speltid och hoppa till sparade starttider.
2. **`expo-screen-orientation`**: Används för att styra skärmläget. Den låser skärmen till liggande läge på Soundboarden och till stående läge på Spellistan, detaljvyn och frågesporten.
3. **`expo-haptics`**: Gör så att telefonen vibrerar lite när man trycker på knapparna i soundboarden, så man känner att trycket registrerades även om det är mycket ljud i hallen.
4. **`expo-status-bar`**: Styr statusfältet högst upp på telefonen så det döljs i liggande läge.
5. **`expo-document-picker`**: Öppnar telefonens filväljare så att man kan bläddra bland sina egna filer och importera egna ljud och låtar till spellistan.
6. **`@expo/vector-icons`**: Ikoner i appen, till exempel play, paus, pilar och musiknoter.

---

## 5. Navigering (Expo Router)

Appen använder **Expo Router** med filbaserad navigering för att knyta ihop funktionerna:
- **Bottenflikar (`Tabs` i `src/app/_layout.tsx`):** Gör det enkelt att växla mellan startskärmen (`index.tsx`), soundboarden (`soundboard.tsx`), spellistan (`playlist.tsx`) och pausfrågesporten (`trivia.tsx`).
- **Dynamisk rutt med parameter (`src/app/song/[id].tsx`):** När användaren trycker på en låt i spellistan skickas låtens id med som en parameter via `router.push('/song/' + item.id)`. Detaljvyn tar emot parametern med `useLocalSearchParams<{ id: string }>()` för att hämta låten, provspela den och låta användaren spara en anpassad starttid (cue-point) i `AsyncStorage`, eller ändra kategori och ta bort låten.

---

## 6. Externa moduler från reactnative.directory (VG)

1. **`@react-native-async-storage/async-storage`**:
   Används för att spara data lokalt på telefonen. Den sparar vilka starttider man satt på låtarna (`marker_${id}`), vilken låt man senast spelade i soundboarden, samt listan över egna importerade låtar så att de finns kvar även när man stänger ner appen.
2. **`@react-native-community/slider`**:
   Ett skjutreglage på låtdetaljskärmen där man drar fram och tillbaka för att välja exakt startsekund för låten.

---

## 7. Web-API (VG)

I filen `src/app/trivia.tsx` hämtar jag data från ett öppet sport-API via `fetch()`:
- **API:** Open Trivia Database (`https://opentdb.com/api.php?amount=1&category=21&type=multiple&encode=url3986`).
- **Hur det fungerar:** Appen skickar en förfrågan, tar emot svaret som JSON, avkodar specialtecken i texten, slumpar ordningen på de fyra svarsalternativen och visar frågan. Svarar man rätt eller fel markeras det med grönt eller rött.

---

## 8. Användning av AI (VG)

- **Verktyg:** Jag har använt Antigravity (med Gemini Flash) som ett bollplank under utvecklingen.
- **Vad jag använde det till:** 
  - Framförallt för att förstå hur den nya ljudmodulen `expo-audio` fungerar, eftersom den gamla `expo-av` inte längre rekommenderas i Expo SDK 52.
  - För att bolla idéer kring layouten och hur man löser praktiska problem, som att musiken ska pausas när man byter flik (`useFocusEffect`), eller hur man hanterar egna importerade låtar i `AsyncStorage`.
- **Hur jag verifierat koden:** 
  - Jag har kört TypeScript-kontroll (`npx tsc --noEmit`) och linter (`npx expo lint`) kontinuerligt för att se att det inte finns några typfel eller varningar i koden.
  - Jag har testat allting direkt i Expo Go på min egen telefon under arbetets gång.
  - Jag har gått igenom och sett till att jag förstår hur koden är uppbyggd så att jag kan förklara varje del på den muntliga presentationen.

---

## 9. Uppfyllda krav

### Krav för Godkänt (G)
- [x] Minst 4 RN-komponenter använda (`View`, `Text`, `Pressable`, `FlatList`, `ActivityIndicator`).
- [x] Minst 4 Expo SDK-moduler använda (`expo-audio`, `expo-screen-orientation`, `expo-haptics`, `expo-status-bar`, `expo-document-picker`, `@expo/vector-icons`).
- [x] Komponenter och moduler listade i README.
- [x] Expo Router används för navigering, och minst en skärm tar emot en parameter (`src/app/song/[id].tsx` med `useLocalSearchParams`).
- [x] Git och GitHub använt med commits löpande under arbetets gång.
- [x] Projektmappen innehåller denna README.md.
- [x] Inlämnad i tid.
- [x] Muntlig presentation genomförd.

### Krav för Väl Godkänt (VG)
- [x] Alla krav för godkänt uppfyllda.
- [x] Ytterligare extern modul från reactnative.directory använd (`@react-native-async-storage/async-storage` och `@react-native-community/slider`).
- [x] Appen hämtar data från ett Web-API (Open Trivia DB i `trivia.tsx`).
- [x] Användning av AI är dokumenterad i README och förberedd för presentationen.
