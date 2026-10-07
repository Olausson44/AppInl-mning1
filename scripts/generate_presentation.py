import os
import io
from PIL import Image, ImageDraw, ImageFont
import pygments
from pygments.lexers import TypeScriptLexer
from pygments.formatters import ImageFormatter
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "temp_slides")
os.makedirs(OUTPUT_DIR, exist_ok=True)
PPTX_FILE_PRIMARY = "DJ-Floorball-Presentation-Minimalistisk.pptx"
PPTX_FILE_ALT = "DJ-Floorball-Presentation-Uppdaterad.pptx"

# Minimalist Dark Palette (Clean, spacious, high contrast)
BG_COLOR = RGBColor(9, 13, 22)           # Minimal matte dark navy (#090d16)
CARD_BG = RGBColor(17, 24, 39)           # Dark matte slate (#111827)
CARD_BORDER = RGBColor(31, 41, 55)       # Subtle border (#1f2937)
TEXT_WHITE = RGBColor(255, 255, 255)     # Crisp white (#ffffff)
TEXT_SLATE = RGBColor(209, 213, 219)     # Soft slate (#d1d5db)
TEXT_MUTED = RGBColor(107, 114, 128)     # Muted gray (#6b7280)
ACCENT_CYAN = RGBColor(56, 189, 248)     # Cyan highlight (#38bdf8)
ACCENT_GREEN = RGBColor(52, 211, 153)    # Mint highlight (#34d399)
ACCENT_AMBER = RGBColor(251, 146, 60)    # Floorball orange (#fb923c)
ACCENT_PURPLE = RGBColor(192, 132, 252)  # Violet highlight (#c084fc)

def generate_code_card(filename, code, output_name, font_size=14):
    formatter = ImageFormatter(
        font_name="Consolas",
        font_size=font_size,
        style="dracula",
        line_numbers=True,
        line_number_bg="#13151f",
        line_number_fg="#565f89"
    )
    raw_png = pygments.highlight(code, TypeScriptLexer(), formatter)
    code_img = Image.open(io.BytesIO(raw_png))

    header_h = 42
    pad_x = 18
    pad_y = 16
    total_w = max(code_img.width + pad_x * 2, 540)
    total_h = code_img.height + header_h + pad_y * 2

    card = Image.new("RGBA", (total_w, total_h), (21, 23, 33, 255))
    draw = ImageDraw.Draw(card)

    # Clean minimal header bar
    draw.rectangle([(0, 0), (total_w, header_h)], fill=(16, 17, 25, 255))
    draw.line([(0, header_h), (total_w, header_h)], fill=(35, 38, 54, 255), width=1)

    # Mac-style dots
    draw.ellipse([(16, 15), (28, 27)], fill=(255, 95, 86, 255))
    draw.ellipse([(36, 15), (48, 27)], fill=(255, 189, 46, 255))
    draw.ellipse([(56, 15), (68, 27)], fill=(39, 201, 63, 255))

    # Filename
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
    except:
        font = ImageFont.load_default()
    draw.text((85, 12), filename, fill=(200, 205, 220, 255), font=font)

    # Paste code
    card.paste(code_img, (pad_x, header_h + pad_y))

    # Border
    draw.rectangle([(0, 0), (total_w - 1, total_h - 1)], outline=(45, 48, 68, 255), width=1)

    out_path = os.path.join(OUTPUT_DIR, output_name)
    card.save(out_path)
    return out_path

def create_slide_base(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()
    return slide

def add_header(slide, tag_text, tag_color, title_text, subtitle_text):
    # Tag Pill / Label
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.46), Inches(7.5), Inches(0.32))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag_text.upper()
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = tag_color
    p_tag.font.name = "Segoe UI"

    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.80), Inches(11.5), Inches(0.65))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.size = Pt(28)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_t.font.name = "Segoe UI"

    # Subtitle
    if subtitle_text:
        s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.40), Inches(11.5), Inches(0.38))
        tf_s = s_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle_text
        p_s.font.size = Pt(14)
        p_s.font.color.rgb = TEXT_MUTED
        p_s.font.name = "Segoe UI"

def add_card_box(slide, left, top, width, height, title, items, border_color=None):
    rect = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    rect.fill.solid()
    rect.fill.fore_color.rgb = CARD_BG
    rect.line.color.rgb = border_color if border_color else CARD_BORDER
    rect.line.width = Pt(1.2)

    tx_box = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.18), width - Inches(0.5), height - Inches(0.36))
    tf = tx_box.text_frame
    tf.word_wrap = True

    if title:
        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(17)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE
        p_title.font.name = "Segoe UI"
        p_title.space_after = Pt(10)
        start_idx = 1
    else:
        start_idx = 0

    for i, item in enumerate(items):
        if start_idx == 0 and i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        
        p.space_after = Pt(7)
        if isinstance(item, tuple):
            prefix, body = item
            run1 = p.add_run()
            run1.text = prefix + " "
            run1.font.bold = True
            run1.font.size = Pt(13)
            run1.font.color.rgb = ACCENT_CYAN
            run1.font.name = "Segoe UI"

            run2 = p.add_run()
            run2.text = body
            run2.font.bold = False
            run2.font.size = Pt(12)
            run2.font.color.rgb = TEXT_SLATE
            run2.font.name = "Segoe UI"
        else:
            run = p.add_run()
            run.text = item
            run.font.size = Pt(12)
            run.font.color.rgb = TEXT_SLATE
            run.font.name = "Segoe UI"

def set_speaker_notes(slide, notes_text):
    slide.notes_slide.notes_text_frame.text = notes_text

print("Building minimalist presentation with deep technical insights...")
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# ==============================================================================
# SLIDE 1: Cover Slide (Minimalist)
# ==============================================================================
slide1 = create_slide_base(prs)

badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(3.2), Inches(0.38))
badge.fill.solid()
badge.fill.fore_color.rgb = RGBColor(17, 30, 52)
badge.line.color.rgb = ACCENT_CYAN
b_tf = badge.text_frame
b_p = b_tf.paragraphs[0]
b_p.text = "SUVNET25 • INLÄMNING 1"
b_p.font.size = Pt(11)
b_p.font.bold = True
b_p.font.color.rgb = ACCENT_CYAN
b_p.alignment = PP_ALIGN.CENTER

title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(11.5), Inches(1.7))
t_tf = title_box.text_frame
t_p = t_tf.paragraphs[0]
t_p.text = "DJ-Floorball 🏑"
t_p.font.size = Pt(46)
t_p.font.bold = True
t_p.font.color.rgb = TEXT_WHITE
t_p.font.name = "Segoe UI"

t_sub = t_tf.add_paragraph()
t_sub.text = "Mobil match-DJ & soundboard för innebandysekretariatet"
t_sub.font.size = Pt(21)
t_sub.font.color.rgb = ACCENT_AMBER
t_sub.font.name = "Segoe UI"
t_sub.space_before = Pt(8)

add_card_box(slide1, Inches(0.8), Inches(4.1), Inches(3.6), Inches(2.5), "Teknisk Stack", [
    ("•", "React Native & TypeScript"),
    ("•", "Expo SDK 52 & Expo Router"),
    ("•", "Fokus: expo-audio & orientation"),
    ("•", "Reaktiv arkitektur & Web-API")
], border_color=ACCENT_CYAN)

add_card_box(slide1, Inches(4.7), Inches(4.1), Inches(3.6), Inches(2.5), "Lösning & Syfte", [
    ("•", "Byggd för matchsekretariatet"),
    ("•", "Eliminerar stress under match"),
    ("•", "Omedelbar respons på mål/utvisning"),
    ("•", "Stora knappar & haptisk feedback")
], border_color=ACCENT_GREEN)

add_card_box(slide1, Inches(8.6), Inches(4.1), Inches(3.9), Inches(2.5), "Presentation (~12 min)", [
    ("•", "Live-demo direkt från Expo Go"),
    ("•", "Djupdykning i uppspelningsarkitektur"),
    ("•", "Arbetsprocess & reflektion"),
    ("•", "Uppfyllnad av alla G- & VG-krav")
], border_color=ACCENT_AMBER)

set_speaker_notes(slide1, 
"""[TALARNOTIS - SLIDE 1: INTRO (ca 1 min)]
Hej allihopa och hej läraren!
Idag presenterar jag DJ-Floorball – en mobilapp byggd med React Native, Expo och TypeScript.
Syftet med appen är att lösa en stressig situation i innebandysekretariatet: att sköta musiken och ljudeffekterna vid mål och utvisningar snabbt och felfritt direkt från mobilen.
Under presentationen ska jag visa appen live i Expo Go, gå igenom hur jag strukturerat koden – särskilt hur jag byggt en reaktiv ljudarkitektur som hindrar ljudkrockar och växlar play/stop dynamiskt – och avsluta med reflektion och mina uppfyllda VG-krav.""")

# ==============================================================================
# SLIDE 2: Bakgrund & Idén
# ==============================================================================
slide2 = create_slide_base(prs)
add_header(slide2, "Bakgrund & Idé", ACCENT_AMBER, "Problemet i Sekretariatet & Lösningen", "Från stress med laptops och Spotify till ett dedikerat mobilverktyg")

add_card_box(slide2, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "Problemet vid match", [
    ("Hög arbetsbelastning:", "Sekretariatet ska hålla koll på matchklockan, domarens tecken, protokoll och utvisningar samtidigt."),
    ("Laptops & Spotify strular:", "Att leta låtar och dra i reglage under brinnande match tar tid och leder ofta till fel låt eller missat intro."),
    ("Tidsfördröjning:", "Låtar har ofta 15–20 sekunders lugnt intro. När refrängen väl kommer har domaren redan blåst igång spelet igen!"),
    ("Ljudlig miljö:", "I sporthallar med publik är det svårt att veta om ett knapptryck faktiskt tog.")
], border_color=RGBColor(239, 68, 68))

add_card_box(slide2, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Lösningen: DJ-Floorball", [
    ("Maximerade knappar:", "Liggande soundboard med stora, tydliga knappar för Mål, Utvisning och Paus."),
    ("Smarta Cue-points:", "Varje låt kan sparas med en exakt startsekund så den dundrar igång direkt vid refrängen/droppet!"),
    ("Haptisk bekräftelse:", "Telefonen vibrerar distinkt vid tryck så att man känner att låten startats."),
    ("Automatisk skärmrotation:", "Roterar automatiskt till liggande på soundboard och stående i spellistan."),
    ("Paus-quiz (Web-API):", "Underhåller sekretariatet under periodpauserna med livefrågor.")
], border_color=ACCENT_GREEN)

set_speaker_notes(slide2, 
"""[TALARNOTIS - SLIDE 2: BAKGRUND (ca 1.5 min)]
Alla som suttit i ett innebandysekretariat vet hur stressigt det kan vara. Du ska starta och stoppa klockan på signal, hantera utvisningar och samtidigt spela rätt musik.
Problemet med att köra Spotify på en dator eller mobil är att man måste scrolla, låtar har långa intron och man hinner inte få igång mållåten innan domaren blåser igång spelet igen.
DJ-Floorball löser detta genom stora färgkodade knappar, förinställda cue-points så att musiken startar direkt vid refrängen, automatisk skärmrotation för stora tryckytor och haptisk feedback i handen.""")

# ==============================================================================
# SLIDE 3: Appen i Aktion (Live Demo)
# ==============================================================================
slide3 = create_slide_base(prs)
add_header(slide3, "Applikationen i Aktion", ACCENT_GREEN, "Översikt & Live-Demo", "Fyra fokuserade funktioner – visas live på mobiltelefonen")

add_card_box(slide3, Inches(0.8), Inches(1.95), Inches(5.6), Inches(2.35), "1. Soundboard (Liggande)", [
    ("•", "Låser skärmen till liggande läge."),
    ("•", "Stora knappar: Mål, Utvisning, Paus."),
    ("•", "Reaktiva knappar: Växlar färg och ikon."),
    ("•", "Haptisk vibration vid varje tryck.")
], border_color=ACCENT_CYAN)

add_card_box(slide3, Inches(6.8), Inches(1.95), Inches(5.7), Inches(2.35), "2. Spellista (Stående)", [
    ("•", "Roterar automatiskt till stående läge."),
    ("•", "Filter: Alla, Paus, Mål, Utvisning."),
    ("•", "FlatList för hög prestanda."),
    ("•", "Knapp för att importera egna MP3-filer.")
], border_color=ACCENT_AMBER)

add_card_box(slide3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.35), "3. Cue-points & Detaljer", [
    ("•", "Dynamisk rutt via Expo Router (/song/[id])."),
    ("•", "Testlyssna och spola +/- 10 sekunder."),
    ("•", "Slider-reglage för exakt startsekund."),
    ("•", "Sparar inställningen i AsyncStorage.")
], border_color=ACCENT_GREEN)

add_card_box(slide3, Inches(6.8), Inches(4.5), Inches(5.7), Inches(2.35), "4. Pausfrågesport (Web-API)", [
    ("•", "Hämtar sportfrågor via öppet REST-API."),
    ("•", "Färgmarkering vid rätt/fel svar."),
    ("•", "ActivityIndicator vid asynkron laddning."),
    ("•", "Underhållning under periodpauserna.")
], border_color=ACCENT_PURPLE)

set_speaker_notes(slide3, 
"""[TALARNOTIS - SLIDE 3: LIVE DEMO (ca 2.5 min)]
[VISA APPEN LIVE PÅ TELEFONEN I EXPO GO!]
Låt oss kika på appen i praktiken!
1. Titta vad som händer när jag klickar på Soundboard: appen roterar direkt till liggande läge. Här har jag jättestora knappar för Mål, Utvisning och Paus.
Lägg märke till att när jag trycker på Paus startar musiken, bakgrundsfärgen skiftar direkt till rött och ikonen växlar från play till stop. Trycker jag på Mål tystnar paussången automatiskt och mållåten drar igång – inga ljud krockar!
2. När jag klickar över till Spellistan roterar den sömlöst till stående läge. Här har jag en FlatList med kategorifilter och en knapp för att importera egna filer.
3. Klickar jag in på en låt ser ni detaljvyn. Med skjutreglaget kan jag välja exakt startsekund och spara.
4. Till sist har vi Pausfråga med live sportfrågor.
Nu ska vi dyka ner i koden och se exakt hur ljudarkitekturen och de dynamiska knapparna är byggda!""")

# ==============================================================================
# SLIDE 4: Expo Router & Navigering
# ==============================================================================
code_router = """// src/app/_layout.tsx - Tabs med dold detaljflik
<Tabs screenOptions={{ headerStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: "#ffd700" }}>
  <Tabs.Screen name="soundboard" options={{ title: "Soundboard", headerShown: false }} />
  <Tabs.Screen name="playlist" options={{ title: "Spellista" }} />
  <Tabs.Screen name="trivia" options={{ title: "Pausfråga" }} />
  <Tabs.Screen name="song/[id]" options={{ href: null, title: "Låtdetaljer" }} />
</Tabs>

// src/app/song/[id].tsx - Tar emot dynamisk ruttparameter
export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSong, setSelectedSong] = useState(
    sounds.find((s) => s.id === Number(id))
  );"""

img_router = generate_code_card("src/app/song/[id].tsx & _layout.tsx", code_router, "code_router.png", font_size=14.5)

slide4 = create_slide_base(prs)
add_header(slide4, "Navigering & Routing (Krav)", ACCENT_CYAN, "Expo Router & Dynamisk Parametrering", "Filbaserad routing med parametrar i src/app/")

add_card_box(slide4, Inches(0.8), Inches(1.95), Inches(5.4), Inches(4.9), "Navigeringsarkitektur", [
    ("Filbaserad Router:", "Använder moderna Expo Router enligt kurskravet (ligger helt i src/app/)."),
    ("Fliklayout (_layout.tsx):", "En Tabs-navigator styr huvudflödet. Fliken song/[id] döljs från menyraden med href: null."),
    ("Dynamisk Parameter:", "När en låt väljs navigeras användaren till /song/${id}."),
    ("useLocalSearchParams():", "Fångar upp id:t i detaljvyn för att matcha rätt låt och ladda dess starttider."),
    ("Eget krav:", "Expo Router räknas separat och inte som en av mina 4 Expo-moduler.")
], border_color=ACCENT_CYAN)

slide4.shapes.add_picture(img_router, Inches(6.5), Inches(1.95), Inches(6.0))

set_speaker_notes(slide4, 
"""[TALARNOTIS - SLIDE 4: EXPO ROUTER (ca 1 min)]
För navigeringen använder jag Expo Router. I _layout.tsx har jag mina huvudflikar, och detaljskärmen döljs med href: null för att hålla menyn ren.
Kravet att ta emot en parameter uppfylls i song/[id].tsx där useLocalSearchParams hämtar låtens ID och slår upp rätt ljudspår och cue-points.
Expo Router är ett eget krav och räknas inte in bland mina Expo SDK-moduler.""")

# ==============================================================================
# SLIDE 5: HUVUDMODUL 1 & SPELARARKITEKTUR (EXPO-AUDIO)
# ==============================================================================
code_audio_advanced = """// src/app/soundboard.tsx - Reaktiv Spelararkitektur & Villkorsstyrd UI

// 1. En enda delad spelare förhindrar ljudkrockar
const player = useAudioPlayer(sounds[currentIndex].source);
const status = useAudioPlayerStatus(player);
const [activeButton, setActiveButton] = useState<"break" | "goal" | "penalty" | null>(null);

// 2. Reaktiv statusberäkning: vem låter just nu?
const isBreakPlaying = status.playing && activeButton === "break";

// 3. Spela låt, ersätt förra automatiskt och spola till cue-point
const handlePlay = async (type, song) => {
  if (status.playing && activeButton === type) {
    player.pause();
    setActiveButton(null);
  } else {
    player.replace(song.source); // Tystar och ersätter förra låten omedelbart!
    player.play();
    if (startTime > 0) player.seekTo(startTime); // Klipper direkt till droppet!
    setActiveButton(type);
  }
};

// 4. Villkorsstyrd styling (Ternary operators) för ikon och röd/grön färg
<Pressable style={{ backgroundColor: isBreakPlaying ? "#ef4444" : "#22c553" }}>
  <Foundation name={isBreakPlaying ? "stop" : "play"} size={36} color="#fff" />
  <Text>{isBreakPlaying ? "STOPP" : "SPELA PAUS"}</Text>
</Pressable>"""

img_audio_adv = generate_code_card("src/app/soundboard.tsx", code_audio_advanced, "code_audio_adv.png", font_size=12.5)

slide5 = create_slide_base(prs)
add_header(slide5, "Expo SDK • Huvudmodul 1 & Spelararkitektur", ACCENT_GREEN, "expo-audio & Reaktiv Spelarlogik", "Singulär spelarinstans, dynamisk play/stop (färg & ikon) och cue-points")

add_card_box(slide5, Inches(0.8), Inches(1.95), Inches(5.4), Inches(4.9), "Arkitektur & Kärnlogik", [
    ("Singulär spelare (Inga ljudkrockar):", "Skapar en enda delad useAudioPlayer. När en ny knapp trycks körs player.replace(), vilket automatiskt avbryter förra låten. Två låtar kan aldrig spelas samtidigt!"),
    ("Reaktiv statuskontroll:", "useAudioPlayerStatus ger status.playing i realtid. Tillsammans med state activeButton vet appen exakt vilken knapp som låter."),
    ("Ternary-styrd UI (Färg & Ikon):", "Knappen ändrar färg till rött (#ef4444) vid uppspelning och ikonen växlar mellan 'play' och 'stop' via villkorsuttryck."),
    ("Smart Cue-point seeking:", "player.seekTo(startTime) spolar direkt till droppet/refrängen – sparad i minnet via AsyncStorage."),
    ("Viktiga metoder i expo-audio:", "play(), pause(), replace(), seekTo(sec), setVolume(val).")
], border_color=ACCENT_GREEN)

slide5.shapes.add_picture(img_audio_adv, Inches(6.5), Inches(1.95), Inches(6.0))

set_speaker_notes(slide5, 
"""[TALARNOTIS - SLIDE 5: EXPO-AUDIO & ARKITEKTUR (ca 2 min)]
Här vill jag göra en riktig djupdykning i appens viktigaste tekniska del: expo-audio och hur jag hanterat spelararkitekturen.
En vanlig fallgrop i musik-appar är att man råkar starta flera låtar samtidigt så det blir ett fruktansvärt oväsen.
För att lösa det har jag designat komponenten med en 'singulär spelarinstans'. Jag har bara en enda useAudioPlayer i hela komponenten.
När funktionären trycker på en knapp – säg 'Mål' medan en pauslåt redan rullar – kör koden player.replace(). Då tystnar den förra låten omedelbart och den nya laddas in. Det är alltså tekniskt omöjligt att två låtar spelas samtidigt!

Men hur vet gränssnittet vilken knapp som spelar, och hur växlar den mellan Play och Stopp?
Det löser jag reaktivt:
Med useAudioPlayerStatus får jag variabeln status.playing.
Samtidigt har jag ett React-state som heter activeButton, som håller reda på om det är 'break', 'goal' eller 'penalty' som aktiverats.
Då kan jag räkna ut isBreakPlaying som status.playing OCH activeButton === 'break'.

I JSX använder jag sedan ternary operators för att styra hela utseendet:
Är isBreakPlaying sant? Då blir bakgrundsfärgen röd (#ef4444), ikonen blir en stopp-fyrkant och texten visar 'STOPP'.
Är den inte aktiv? Då är den grön med en play-triangel.
Och med player.seekTo spolar spelaren direkt till min sparade cue-point vid droppet. Det här ger en otroligt responsiv och stabil spelarupplevelse!""")

# ==============================================================================
# SLIDE 6: HUVUDMODUL 2: expo-screen-orientation (Djupdykning)
# ==============================================================================
code_orient = """// Hårdvarustyrd orientering via useFocusEffect

// soundboard.tsx: Tvinga liggande läge för maximala knappar
useFocusEffect(
  useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      player.pause(); // Pausa vid flikbyte
    };
  }, [player])
);

// playlist.tsx: Återställ till stående läge för scrollning
useFocusEffect(
  useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, [])
);"""

img_orient = generate_code_card("src/app/soundboard.tsx & playlist.tsx", code_orient, "code_orient.png", font_size=14)

slide6 = create_slide_base(prs)
add_header(slide6, "Expo SDK • Huvudmodul 2 (Djupdykning)", ACCENT_CYAN, "expo-screen-orientation: Hårdvarurotation", "Styr telefonens visningsläge automatiskt beroende på skärm och syfte")

add_card_box(slide6, Inches(0.8), Inches(1.95), Inches(5.4), Inches(4.9), "Kärnfunktioner & Metoder", [
    ("ScreenOrientation.lockAsync():", "Talar med operativsystemets hårdvarulager och låser skärmens visningsläge."),
    ("OrientationLock.LANDSCAPE:", "Låser till liggande läge – maximerar knapparnas yta på Soundboarden."),
    ("OrientationLock.PORTRAIT_UP:", "Låser till normalt stående läge – ger bekväm enhandsscroll i spellistan."),
    ("ScreenOrientation.unlockAsync():", "Släpper orienteringslåset och tillåter fri sensorrotation."),
    ("getOrientationAsync():", "Läser av aktuell fysisk vinkel på enheten."),
    ("addOrientationChangeListener():", "Event-lyssnare som triggas när enhetens vinkel förändras.")
], border_color=ACCENT_CYAN)

slide6.shapes.add_picture(img_orient, Inches(6.5), Inches(1.95), Inches(6.0))

set_speaker_notes(slide6, 
"""[TALARNOTIS - SLIDE 6: EXPO-SCREEN-ORIENTATION (ca 1.5 min)]
Min andra huvudmodul är expo-screen-orientation.
Den valde jag för att den är extremt visuell och visar hur en mobilapp kan utnyttja hårdvaran för en överlägsen användarupplevelse.
Modulen erbjuder funktioner som:
- lockAsync(), vilket tvingar skärmen i ett visst läge oavsett om användaren har telefonens allmänna skärmlås påslaget.
- OrientationLock.LANDSCAPE för liggande läge och PORTRAIT_UP för stående läge.
- unlockAsync() och addOrientationChangeListener för att hantera fri rotation.
I mitt projekt anropar jag lockAsync inuti useFocusEffect.
På Soundboarden låser jag den till LANDSCAPE för att ge jättestora knappar som är enkla att träffa i matchstress. Men så fort användaren klickar till Spellistan låser jag den direkt till PORTRAIT_UP så att man kan scrolla naturligt med en hand. Detta sker helt automatiskt vid flikbyte!""")

# ==============================================================================
# SLIDE 7: ÖVRIGA EXPO-MODULER (Kort översikt)
# ==============================================================================
slide7 = create_slide_base(prs)
add_header(slide7, "Expo SDK • Modul 3 & 4 (Översikt)", ACCENT_AMBER, "expo-haptics & expo-document-picker", "Kompletterande hårdvarumoduler – uppfyller kravet på minst 4 Expo-moduler")

add_card_box(slide7, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "Modul 3: expo-haptics", [
    ("Taktil feedback:", "Styr telefonens interna vibrationsmotor (Taptic Engine / Haptic Motor)."),
    ("Kärnmetod:", "Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)"),
    ("Varför i appen?", "I en sporthall är det fullt av ljud från publik, domare och musik. Den fysiska vibrationen ger funktionären en omedelbar bekräftelse på att mållåten faktiskt startats utan att behöva titta ned på skärmen."),
    ("Andra metoder i modulen:", "notificationAsync() för larm/fel, och selectionAsync() för lätta klick.")
], border_color=ACCENT_AMBER)

add_card_box(slide7, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Modul 4: expo-document-picker", [
    ("Systemets filväljare:", "Öppnar mobilens interna filhanterare (Filer / Android Storage)."),
    ("Kärnmetod:", "DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true })"),
    ("Varför i appen?", "Gör appen flexibel för alla föreningar. Vem som helst kan importera sina egna MP3-mållåtar eller vinjetter direkt från telefonens minne in i spellistan!"),
    ("Övriga Expo-paket:", "expo-status-bar (döljer statusfält i liggande) och @expo/vector-icons för ikoner.")
], border_color=ACCENT_GREEN)

set_speaker_notes(slide7, 
"""[TALARNOTIS - SLIDE 7: ÖVRIGA MODULER (ca 1 min)]
För att uppfylla kravet på minst 4 Expo SDK-moduler har jag även använt två till:
Modul 3 är expo-haptics. Med Haptics.impactAsync får funktionären en fysisk vibration i fingret varje gång en knapp trycks ned på soundboarden. Det ger en direkt bekräftelse i en bullrig sporthall.
Modul 4 är expo-document-picker. Med DocumentPicker.getDocumentAsync kan föreningar importera sina egna mållåtar i MP3-format direkt från telefonens filhanterare.
Därmed har vi fyra tydliga hårdvarunära Expo-moduler som alla har en konkret funktion i appen!""")

# ==============================================================================
# SLIDE 8: React Native Core-komponenter
# ==============================================================================
slide8 = create_slide_base(prs)
add_header(slide8, "React Native Komponenter (Krav)", ACCENT_CYAN, "5 st Officiella Core Components", "Minst 4 krävs – alla importerade direkt från 'react-native'")

add_card_box(slide8, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "De 5 använda komponenterna", [
    ("1. View:", "Byggstenen för layout, behållare och flexbox-struktur på samtliga vyer."),
    ("2. Text:", "Renderar all text: titlar, låttider, frågetext och knappetiketter."),
    ("3. Pressable:", "Modern touch-komponent för interaktiva knappar med tryckfeedback och villkorsstyrd styling."),
    ("4. FlatList:", "Prestandaoptimerad scrollista med virtualisering för spellistan."),
    ("5. ActivityIndicator:", "Nativ laddningssnurra som visas medan triviafrågor hämtas över nätverket.")
], border_color=ACCENT_CYAN)

add_card_box(slide8, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Designbeslut & Gränsdragningar", [
    ("Inga API:er som komponenter:", "StyleSheet och Alert används i appen men räknas strikt som API:er enligt uppgiftsinstruktionen."),
    ("Pressable framför TouchableOpacity:", "Pressable ger bättre respons och direkt stöd för att koordinera med haptiska vibrationer och färgskiften."),
    ("FlatList framför ScrollView:", "Hanterar stora spellistor utan minnesläckor genom att endast rendera synliga element."),
    ("Resultat:", "5 renodlade baskomponenter – godkända med god marginal.")
], border_color=ACCENT_GREEN)

set_speaker_notes(slide8, 
"""[TALARNOTIS - SLIDE 8: REACT NATIVE-KOMPONENTER (ca 1 min)]
Kravet för godkänt är att använda minst 4 komponenter från React Native. Jag använder 5:
View för flexbox-layout, Text för typografi, Pressable för responsiva knappar, FlatList för en snabb spellista och ActivityIndicator som laddningssnurra i frågesporten.
Jag har noga undvikit att räkna StyleSheet eller Alert som komponenter eftersom de är API:er.""")

# ==============================================================================
# SLIDE 9: Externa Moduler & Web-API (VG)
# ==============================================================================
code_vg = """// 1. AsyncStorage: Persistent lagring av starttider & egna låtar
await AsyncStorage.setItem(`marker_${song.id}`, seconds.toString());
await AsyncStorage.setItem("custom_songs", JSON.stringify(customList));

const stored = await AsyncStorage.getItem(`marker_${song.id}`);
const startTime = stored !== null ? parseFloat(stored) : 0;

// 2. Community Slider: Grafiskt reglage från reactnative.directory
<Slider
  minimumValue={0}
  maximumValue={status.duration > 0 ? status.duration : 100}
  value={sliderPosition}
  onValueChange={(val) => setSliderPosition(val)} // Uppdaterar siffran i realtid
  onSlidingComplete={(val) => {
    setSliderPosition(val);
    player.seekTo(val); // Spolar & provlyssnar först när fingret släpps!
  }}
  minimumTrackTintColor="#2db312"
  thumbTintColor="#aae422"
/>

// 3. Web-API: Hämtar live sportfrågor via fetch()
const res = await fetch("https://opentdb.com/api.php?amount=1&category=21&type=multiple");
const data = await res.json();"""

img_vg = generate_code_card("src/app/song/[id].tsx & trivia.tsx", code_vg, "code_vg.png", font_size=11.5)

slide9 = create_slide_base(prs)
add_header(slide9, "Väl Godkänt (VG-Krav)", ACCENT_PURPLE, "AsyncStorage, Slider & Web-API", "Persistent diskminne, Community Slider och asynkront REST-API via fetch()")

add_card_box(slide9, Inches(0.8), Inches(1.95), Inches(5.4), Inches(4.9), "AsyncStorage & Slider-Arkitektur", [
    ("AsyncStorage (Diskminne):", "Asynkron key-value-lagring av cue-points (marker_${id}), köstatus (last_break_index) och JSON-serialisering av custom_songs."),
    ("Community Slider (reactnative.directory):", "Externt dragreglage som koordinerar cue-points med ljudmotorn:"),
    ("• Dynamiskt maxvärde:", "maximumValue sätts reaktivt efter låtens faktiska speltid via status.duration."),
    ("• Prestandaoptimering:", "onValueChange uppdaterar siffran mjukt i realtid, medan onSlidingComplete anropar player.seekTo() först när fingret släpps – förhindrar ljudlagg och krascher!"),
    ("Web-API (Open Trivia DB):", "Hämtar sportfrågor via fetch(), avkodar URL-strängar och slumpar svarsalternativ under periodpauserna.")
], border_color=ACCENT_PURPLE)

slide9.shapes.add_picture(img_vg, Inches(6.5), Inches(1.95), Inches(6.0))

set_speaker_notes(slide9, 
"""[TALARNOTIS - SLIDE 9: ASYNCSTORAGE, SLIDER & VG-KRAV (ca 2.5 min)]
För kraven för Väl Godkänt krävs minst en extern modul från reactnative.directory och ett fungerande Web-API.
Jag har använt två externa moduler: AsyncStorage och Community Slider, och här vill jag förklara hur de fungerar och samverkar:

1. HUR FUNGERAR ASYNCSTORAGE?
AsyncStorage är mobilens motsvarighet till webbens localStorage – en lokal databas som sparar data direkt på telefonens fysiska disk så att den överlever app-omstarter.
Skillnaden mot webben är att AsyncStorage är helt asynkront och icke-blockerande. Alla metoder – setItem och getItem – returnerar Promises och hanteras med async/await så att appens gränssnitt aldrig låser sig.
Eftersom modulen bara lagrar strängar gör jag två saker:
- För starttider sparar jag sekunden som sträng under nyckeln marker_${song.id} och läser ut den med parseFloat.
- För egna importerade låtar gör jag JSON-serialisering med JSON.stringify() när jag sparar listan och JSON.parse() när jag läser in den vid appstart.
- Jag sparar även last_break_index så att kön inte återställs till låt 1 varje gång appen öppnas.

2. HUR FUNGERAR COMMUNITY SLIDER?
Slidern har plockats bort ur React Natives standardpaket och måste installeras från reactnative.directory. Den samverkar tätt med ljudmotorn:
- Dynamisk längd: Jag sätter maximumValue dynamiskt baserat på status.duration. Det betyder att reglaget anpassar sig exakt efter hur lång just den här ljudfilen är!
- Viktig prestandadetalj: Jag skiljer noga på onValueChange och onSlidingComplete. Om man hade spolat ljudet under onValueChange medan man drar hade telefonen försökt byta ljudposition hundra gånger i sekunden, vilket skapar hackande ljud och lagg. Därför uppdaterar onValueChange bara siffran på skärmen, medan onSlidingComplete kör player.seekTo() först när man släpper fingret så man kan provlyssna på droppet!
- När man är nöjd sparar SAVE-knappen tiden till AsyncStorage.

3. WEB-API (TRIVIA):
Till sist anropar jag ett öppet REST-API – Open Trivia Database – i trivia.tsx via fetch() för att hämta sportfrågor och svarsalternativ under pauserna.
Detta binder ihop data, hårdvarulagring och nätverk och uppfyller alla VG-krav!""")

# ==============================================================================
# SLIDE 10: Arbetsprocess & Git
# ==============================================================================
slide10 = create_slide_base(prs)
add_header(slide10, "Arbetsprocess & Git (Krav)", ACCENT_CYAN, "Planering, Struktur och Versionshantering", "Agilt arbetssätt, mobil-först och kontinuerliga commits på GitHub")

add_card_box(slide10, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "Arbetsprocess & Metod", [
    ("Problemcentrerad design:", "Utgick från den fysiska situationen i sekretariatet och designade gränssnittet efter snabbhet och enkelhet."),
    ("TypeScript-first:", "Definierade tidigt interfaces för SoundTrack och kategorier i src/sounds.ts för strikt typkontroll."),
    ("Mobil-först med Expo Go:", "Testade löpande på fysisk telefon under hela utvecklingen för att kalibrera haptik och rotation."),
    ("Kvalitetskontroller:", "Körde regelbundet 'npx tsc --noEmit' och 'npx expo lint' för att hålla koden ren från buggar.")
], border_color=ACCENT_CYAN)

add_card_box(slide10, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Git & GitHub-historik", [
    ("Löpande commits (G-krav):", "Commits är spridda över hela utvecklingsperioden, inte allt i en klump på slutet."),
    ("Beskrivande historik:", "Varje commit har ett tydligt syfte – t.ex. layout, AsyncStorage, expo-audio och API-koppling."),
    ("Publikt repo på GitHub:", "Olausson44/AppInl-mning1 med full historik."),
    ("Korrekt inlämning:", "Zippat med .git-mappen intakt och node_modules uteslutet.")
], border_color=ACCENT_GREEN)

set_speaker_notes(slide10, 
"""[TALARNOTIS - SLIDE 10: ARBETSPROCESS (ca 1 min)]
Jag har arbetat strikt mobil-först. Genom att ha telefonen uppkopplad mot Expo Go under hela resan kunde jag direkt känna hur haptiken kändes i handen och hur rotationen betedde sig.
I Git har jag committat löpande under hela projektet med tydliga meddelanden för varje feature, och koden har verifierats kontinuerligt med TypeScript och linting.""")

# ==============================================================================
# SLIDE 11: Reflektion & AI-användning
# ==============================================================================
slide11 = create_slide_base(prs)
add_header(slide11, "Reflektion & AI-användning (Krav)", ACCENT_AMBER, "Utmaningar, Lärdomar & AI som Partner", "Ärlig analys av svårigheter samt dokumentation av AI-verktyg")

add_card_box(slide11, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "Reflektion & Utmaningar", [
    ("Utmaning: Nya expo-audio:", "Eftersom modulen är helt ny i SDK 52 saknades äldre forumtrådar. Att synka seekTo och replace krävde noggrann analys."),
    ("Utmaning: Skärmrotation:", "Att växla orientering mellan flikar utan UI-blinkningar löstes genom ren användning av useFocusEffect."),
    ("Vad jag skulle gjort annorlunda:", "Lagrat spelaren i en global Audio Context så att musiken hade kunnat fortsätta rulla i bakgrunden vid flikbyte."),
    ("Viktigaste lärdomen:", "Hårdvarunära funktioner (haptik, rotation, minne) gör en enorm skillnad för användarupplevelsen på mobil.")
], border_color=ACCENT_AMBER)

add_card_box(slide11, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Användning av AI (VG-Krav)", [
    ("Verktyg:", "Antigravity (med Claude-modeller) som tekniskt bollplank och parprogrammerare."),
    ("Vad AI användes till:", "För att snabbt förstå API-ytan i nya expo-audio och bolla städmönster vid sidfokus (useFocusEffect)."),
    ("Hur koden verifierats:", "Full förståelse för varje rad enligt kursregeln. Verifierat via 'tsc --noEmit', 'expo lint' och skarpa tester på mobilen."),
    ("Resultat:", "Snabbare problemlösning med full personlig kodkontroll.")
], border_color=ACCENT_PURPLE)

set_speaker_notes(slide11, 
"""[TALARNOTIS - SLIDE 11: REFLEKTION & AI (ca 1.5 min)]
Den största tekniska utmaningen var expo-audio, eftersom modulen är så ny och saknar äldre dokumentation på nätet. Det krävdes en del testande för att få seekTo att tajma perfekt vid byte av låt. Om jag byggde om appen idag skulle jag ha lyft ut spelaren i en global Context så att musiken inte behöver tystna när man byter flik.
När det gäller AI har jag använt Antigravity som parprogrammerare, främst för att navigera de nya hookarna i SDK 52. Jag har varit extremt noga med att förstå och verifiera varje enskild kodrad med TypeScript, linter och tester på min mobil. Jag kan förklara varje funktion i projektet.""")

# ==============================================================================
# SLIDE 12: Sammanfattning & Frågor
# ==============================================================================
slide12 = create_slide_base(prs)
add_header(slide12, "Sammanfattning & Avslutning", ACCENT_GREEN, "Uppfyllda Krav & Frågestund", "En sammanfattning av resultatet och öppning för frågor")

add_card_box(slide12, Inches(0.8), Inches(1.95), Inches(5.6), Inches(4.9), "Uppfyllda Krav för Godkänt (G)", [
    ("5 RN-komponenter:", "View, Text, Pressable, FlatList, ActivityIndicator."),
    ("4 Expo SDK-moduler:", "Fokus på expo-audio & screen-orientation, kompletterat med haptics & document-picker."),
    ("Expo Router:", "Filbaserad routing med parametriserad detaljvy (/song/[id])."),
    ("Git & GitHub:", "Löpande commit-historik i publikt repo."),
    ("Dokumentation:", "Fullständig README.md med instruktioner.")
], border_color=ACCENT_GREEN)

add_card_box(slide12, Inches(6.8), Inches(1.95), Inches(5.7), Inches(4.9), "Uppfyllda Krav för VG", [
    ("Externa moduler:", "AsyncStorage & Community Slider från reactnative.directory."),
    ("Web-API:", "Open Trivia Database integrerat via fetch() i trivia.tsx."),
    ("AI-dokumentation:", "Fullständigt redogjord i README och presentation."),
    ("Slutsats:", "En funktionell app som löser ett verkligt problem under innebandymatcher!"),
    ("🎤 Frågor?", "Tack för att ni lyssnade! Vad har ni för frågor?")
], border_color=ACCENT_AMBER)

set_speaker_notes(slide12, 
"""[TALARNOTIS - SLIDE 12: AVSLUTNING (ca 1 min)]
För att summera:
Projektet uppfyller samtliga krav för både Godkänt och Väl Godkänt – fem komponenter, fyra Expo-moduler med djupdykning i ljud och rotation, dynamisk Expo Router-navigering, två externa paket, ett fungerande Web-API och noggrann AI-dokumentation.
Framförallt fungerar appen i verkligheten och löser ett genuint problem för innebandyföreningar.
Tack så mycket för att ni lyssnade, och nu tar jag gärna emot frågor från er och läraren!""")

# Save presentation
prs.save(PPTX_FILE_PRIMARY)
print(f"Minimalist presentation saved to: {os.path.abspath(PPTX_FILE_PRIMARY)}")

try:
    prs.save(PPTX_FILE_ALT)
    print(f"Also updated: {os.path.abspath(PPTX_FILE_ALT)}")
except Exception:
    pass
