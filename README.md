# DJ-Floorball 🏑🎶

En modern mobilapplikation för innebandymatcher och sportevenemang. Appen fungerar som en komplett ljudcentral för sekretariatet och match-DJ:n – med ett snabbreaktivt soundboard, anpassningsbar spellista, import av egna låtar och sportfrågesport under periodpauserna.

Inlämningsuppgift 1 i kursen **Applikationsutveckling (APP) - SUVNET25**.

---

## 1. Beskrivning

**Vad appen gör:**
Under en innebandymatch uppstår korta avbrott och situationer (mål, utvisning, time-out, periodpaus) där musik och ljudeffekter behöver spelas på bråkdelen av en sekund. 
DJ-Floorball löser detta genom:
- **Soundboard (Liggande läge):** Stora, tydliga och färgkodade knappar för Mål, Utvisning och Paus/Avbrott. Visar aktuell låt direkt på pausknappen samt nästa låt i kön med smidig bläddring.
- **Spellista (Stående läge):** Lista med alla ljudeffekter och låtar. Filtrering på kategori (Alla, Paus, Mål, Utvisning) i smidiga filterknappar, samt möjlighet att importera egna ljudfiler direkt från telefonens lagring.
- **Låtdetaljer & Cue-point redigering:** Varje låt har en dedikerad detaljskärm där man kan provlyssna, spola fram/bakåt 10 sekunder och med ett reglage ställa in exakt var låten ska börja spelas (cue-point / "drop"). Denna starttid sparas i telefonens lokala minne och respekteras i soundboardet. För importerade låtar kan man enkelt välja/byta kategori (Paus, Mål, Utvisning) eller ta bort låten.
- **Pausfrågesport (Web-API):** Genererar färska sportfrågor från ett externt API under längre periodpauser för att underhålla publiken eller sekretariatet.

**Vem appen är för:**
Sekretariat, DJ:s, lagledare och föreningsentusiaster som vill ha ett pålitligt och blixtsnabbt verktyg direkt i mobilen utan krångliga mixers eller datorer.

---

## 2. Så bygger och kör du projektet

Följ dessa steg för att köra projektet lokalt med Expo Go på din mobiltelefon eller emulator:

### Förutsättningar
- [Node.js](https://nodejs.org/) installerat på din dator (LTS rekommenderas).
- Appen **Expo Go** installerad på din telefon ([iOS App Store](https://apps.apple.com/app/expo-go/id982107779) eller [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)).
- Dator och telefon anslutna till samma Wi-Fi-nätverk.

### Steg-för-steg

1. **Klona repot:**
   ```bash
   git clone https://github.com/DITT-ANVANDARNAMN/AppInl-mning1.git
   cd AppInl-mning1
   ```

2. **Installera beroenden:**
   ```bash
   npm install
   ```

3. **Starta Expo utvecklingsserver:**
   ```bash
   npx expo start
   ```

4. **Öppna appen på telefonen:**
   - **Android:** Öppna Expo Go och skanna QR-koden som visas i terminalen.
   - **iOS:** Öppna vanliga Kamera-appen och skanna QR-koden, klicka sedan på länken som öppnar Expo Go.

---

## 3. Använda React Native-komponenter

I projektet används följande kärnkomponenter från `react-native`:

1. **`View`**: Används som grundläggande layoutbehållare och flexbox-struktur på alla skärmar (t.ex. knaprader, informationskort och headers).
2. **`Text`**: Visar all typografi i appen, såsom sångtitlar, speltid, poäng, kategorietiketter och quizfrågor.
3. **`Pressable`**: Används för alla interaktiva element och touch-knappar (soundboardens stora knappar, menyval, navigering, filterknappar och spola-knappar) med visuell respons vid tryck.
4. **`FlatList`**: Renderar den rullningsbara listan över låtar i `src/app/playlist.tsx` med optimerad prestanda och minneshantering.
5. **`ActivityIndicator`**: Visar en laddningssnurra i `src/app/trivia.tsx` medan ny frågesportsdata hämtas asynkront över nätverket.

---

## 4. Använda Expo SDK-moduler

Projektet använder följande Expo SDK-moduler (utöver Expo Router):

1. **`expo-audio`**: Den moderna ljudmotorn i Expo SDK 52+. Används med `useAudioPlayer` och `useAudioPlayerStatus` för uppspelning, pausning, spolning till specifika tidsmarkörer (cue-points) och tidsövervakning i både Soundboard och Låtdetaljer.
2. **`expo-screen-orientation`**: Låser och växlar automatiskt telefonens skärmorientering mellan landskapsläge (`LANDSCAPE` för soundboard och hemvy) och porträttläge (`PORTRAIT_UP` för spellista, låtdetaljer och trivia) för optimal ergonomi.
3. **`expo-haptics`**: Ger taktil haptisk återkoppling (vibrationer) i fingret via `Haptics.impactAsync` vid knapptryckningar på soundboarden så att DJ:n känner att ljudet triggats i matchbruset.
4. **`expo-status-bar`**: Styr statusfältets färg och synlighet (`hidden={true}` i liggande läge) för att ge en ren helskärmsupplevelse utan störande element.
5. **`expo-document-picker`**: Låter användaren välja och importera egna ljudfiler (`audio/*`) från telefonens interna lagring eller molntjänster direkt in i appens spellista.
6. **`@expo/vector-icons`**: Tillhandahåller snygga och konsekventa vektorikoner (från Foundation/Ionicons) för musiksymboler, inställningar, pilar och kontroller.

---

## 5. Externa moduler från reactnative.directory (VG-krav)

1. **`@react-native-async-storage/async-storage`**:
   - Används för persistent datalagring lokalt på enheten.
   - Sparar användarens anpassade starttider (`marker_${id}`), senast spelade låtindex (`last_break_index`), samt listan över egna importerade låtar (`custom_songs`).
2. **`@react-native-community/slider`**:
   - Ett smidigt grafiskt reglage i låtdetaljvyn (`src/app/song/[id].tsx`) för att enkelt dra och ställa in exakt tidsmarkör i sekunder.

---

## 6. Web-API Integration (VG-krav)

I `src/app/trivia.tsx` hämtas realtidsfrågor från ett externt REST Web-API:
- **API:** [Open Trivia Database](https://opentdb.com/api.php?amount=1&category=21&type=multiple) (Kategori 21: Sport).
- **Teknik:** Native `fetch()` med `async/await`.
- **Hantering:** Appen hanterar svar och JSON-parsning, avkodar HTML-entiteter (t.ex. `&quot;`, `&#039;`), slumpar svarsalternativen (ett korrekt och tre felaktiga) och hanterar nätverksfel och laddningsstatus med `ActivityIndicator`.

---

## 7. Användning av AI-verktyg & Verifiering (VG-krav)

### Vilka AI-verktyg har använts?
- **Antigravity AI (med Claude 3.7 Sonnet)** som utvecklingspartner och kodassistent.

### Vad har AI använts till?
1. **Arkitektur & Navigeringsdesign:** Strukturering av filbaserad navigering med Expo Router (`_layout.tsx`, dynamisk rutt `[id].tsx`, tabs).
2. **Felsökning av Expo Audio SDK 52:** Den tidigare modulen `expo-av` är föråldrad och ersatt med `expo-audio`. AI hjälpte till att navigera den nya hook-baserade livscykeln (`useAudioPlayer`, `player.replace()`, `player.seekTo()`).
3. **State Management & Lagring:** Genomtänkt dataflöde mellan `AsyncStorage`, spellistan, soundboarden och `useFocusEffect` för direkt uppdatering vid skärmbyte.
4. **UI/UX & Responsiv design:** Utformning av mörkt minimalistiskt tema, skärmorienteringslås och anpassad landskapslayout.

### Hur har koden verifierats?
1. **Statisk typkontroll och analys:** Varje kodändring har typkontrollerats med `npx tsc --noEmit` och lintats med `npx expo lint` med 0 varningar och 0 fel.
2. **Körtest på fysisk hårdvara:** Alla funktioner (ljuduppspelning, orienteringsskifte, haptik, import via dokumentväljaren och API-anrop) har kontinuerligt testats i realtid i Expo Go på en fysisk Android-enhet.
3. **Kodförståelse och granskning:** Koden har hållits modulär, läsbar och fri från onödig komplexitet så att varje funktion, hook (`useState`, `useEffect`, `useCallback`, `useFocusEffect`) och komponent kan redogöras för i detalj under den muntliga presentationen.

---

## 8. Checklista över uppfyllda krav

### Krav för Godkänt (G)
- [x] Projektet använder minst 4 RN-komponenter (`View`, `Text`, `Pressable`, `FlatList`, `ActivityIndicator`).
- [x] Projektet använder minst 4 moduler från Expo SDK (`expo-audio`, `expo-screen-orientation`, `expo-haptics`, `expo-status-bar`, `expo-document-picker`, `@expo/vector-icons`).
- [x] De använda komponenterna och modulerna är antecknade i `README.md`.
- [x] Expo Router används för navigering, och minst en skärm tar emot en parameter (`src/app/song/[id].tsx` via `useLocalSearchParams`).
- [x] Git och GitHub har använts med commits spridda över arbetets gång.
- [x] Projektmappen innehåller en komplett `README.md`.
- [x] Uppgiften inlämnad i tid.
- [x] Muntlig presentation genomförd (förberedd).

### Krav för Väl Godkänt (VG)
- [x] Alla punkter för godkänt är uppfyllda.
- [x] Ytterligare valfri extern modul från reactnative.directory används (`@react-native-async-storage/async-storage` samt `@react-native-community/slider`).
- [x] Appen hämtar data från ett externt Web-API (Open Trivia DB i `src/app/trivia.tsx`).
- [x] Användningen av AI-verktyg och verifieringsmetoder är dokumenterad i `README.md` och redo att reflekteras kring i presentationen.
