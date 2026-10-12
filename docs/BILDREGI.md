# SCEN Bildregi

Bildregi gör bilden till en dramaturgisk scen i stället för ett placerat objekt. Piloten använder samma generella tillståndssystem som Tidslinje: semantiska tillstånd beräknas av spelaren och CSS ansvarar för kamera, nedtoning, annotation och mask.

Grundprincipen är:

> Kontexten finns kvar. Fokus vandrar. Relationer blir synliga. Helheten återvänder.

Principen används efter scenens kommunikativa behov. Cinematic hero har exempelvis en lugn kamerarörelse utan en påtvingad focus/fade-sekvens. Crop/mask reveal använder progressivt avslöjande eftersom ny information är själva poängen.

## Fem lägen

| `bildläge` | Dramaturgi |
|---|---|
| `hero` | Helbild med långsam kamerarörelse mellan start- och slututsnitt. |
| `detail` | Helhet → en eller flera betydelsefulla detaljer → eget restore-klick. |
| `spotlight` | Helheten ligger kvar; ett område får fokus och en annotation. Avslutas med restore. |
| `reveal` | Definierade bildområden avslöjas i ordning. Ingen artificiell restore krävs. |
| `levande` | Stillbild → zoom på första klicket → film på nästa. Filmen spelar en gång och stannar på sista rutan. |

## Levande bild

Använd läget när publiken först ska observera en stillbild och sedan se vad som förändras. Det skiljer sig från en filmloop i `miljö:`: rörelsen startas uttryckligen av presentatören och är en del av klickföljden. Samma struktur fungerar för exempelvis trafik, biologiska förlopp, fysikexperiment, maskiner och scenkonst. Bild, film och fokuspunkt kommer helt från manuset.

```text
[bildregi]
bild: bilder/kurs/forsta-bildrutan.jpg
film: bilder/kurs/forlopp.mp4
alt: Beskriv motivet och vad som förändras.
bildläge: levande
startutsnitt: 50 50 1
slututsnitt: 65 72 1.9
```

Rubrik och text är valfria. Använd filmens första bildruta som `bild:` för ett mjukt byte till rörelse. Utsnitten anger centrum i procent och skala; skala 1 visar helheten, större värden zoomar in. Centrum begränsas så att zoomen inte lämnar tomma kanter. Videon bör ha samma format som stillbilden, helst 16:9.

Filmen är ljudlös och laddas först vid uppspelningssteget. Vänsterpil till zoomsteget återställer filmen till början, R återställer hela scenen och ett byte av scen stoppar filmen. Bakåtnavigering till scenens slut, miniatyrer, redigerarens förhandsvisning och `steg: nej` visar stillbilden utan att spela film. Reducerad rörelse och `rörelse: ingen` tar bort den animerade zoomningen; filmen kan fortfarande startas uttryckligen med nästa klick. MP4 och WebM följer med i fristående export och den inbakade appen.

Kontroller: `npm run test:film` verifierar manus, resurser för export och klickstruktur. Uppspelningen har även kontrollerats i Chromium i Natt och Klassrum: zoom, start, slutruta, bakåtsteg, snabb växling framåt/bakåt, omstart, byte av scen, miniatyrer, reducerad rörelse och saknad film. Både export från appen och export via byggskriptet har spelats upp utan nätanslutning. Hela `npm test` stannar fortfarande på det tidigare felet i `check-editorial.cjs` (Etapper förväntas ha tre steg men har fyra).

## Bildmetadata i manus

```text
[bildregi]
etikett: HELHET → DETALJ → HELHET
rubrik: Strategin finns i relationerna
text: Helheten etableras före varje precis förflyttning.
bild: bilder/ai-agenter/ai04.jpg
alt: Schackbräde i futuristiskt kontrollrum
bildläge: detail
fokuspunkt: 50 50
beskärning: cover
startutsnitt: 50 50 1
slututsnitt: 50 50 1
säker-yta: 5 9 36 34
mörkning: 2 4 42 43 0.64
riktning: none
hastighet: medium
- centrum | Konfliktens centrum | 50 | 54 | 24 | 32 | Mittfältet visar var alternativen möts.
- system | Systemets blick | 49 | 18 | 20 | 22 | Instrumentpanelen gör analysen till en del av miljön.
```

Koordinater och storlekar anges i procent av bilden:

- `fokuspunkt`: `x y`
- `startutsnitt` och `slututsnitt`: `x y skala`
- `säker-yta`: `x y bredd höjd`
- `mörkning`: `x y bredd höjd opacitet`
- detaljrad: `id | etikett | x | y | bredd | höjd | annotation`

`beskärning: cover` är standard och garanterar att kamerarörelse och zoom inte lämnar tomma ytor. `contain` finns för material där hela originalet måste synas, men kan ge letterboxing och ska väljas medvetet.

`rörelse: ingen` och `prefers-reduced-motion` bevarar samma klick- och informationssekvens men tar bort kamerarörelse och semantiska övergångar.

## Visual Direction

Hermes kan senare fungera som art director utan att generera bilden. En presentationsövergripande Visual Direction bör beskriva:

- visuellt språk, ljus, färg och materialitet
- återkommande kompositionsprinciper
- motivens typiska placering
- hur mycket negativ yta som behövs
- tillåtna kamerarörelser och tempo
- relationen mellan foto/illustration, typografi, diagram och SCEN-grafik
- när en scen uttryckligen **inte** ska använda en bild

Visual Direction ligger på presentationsnivå. Bildmetadata och Image Brief ligger på bildnivå.

## Image Brief

Följande manusfält lagras i `slide.imageBrief` och kan läsas via `Scen.imageBrief(slide, defaults)`:

```text
bild-id: hero-01
filnamn: hero-01.webp
scen: Kapitelöppning
syfte: Etablera spänningen mellan människa och system.
motiv: En ensam operatör framför en stor kontrollmiljö.
komposition: Operatören i höger tredjedel, lugn yta till vänster.
motivplacering: höger tredjedel
format: 16:9
undvik: text över ansikte; symmetrisk centrering; aggressiv zoom
prompt: Cinematic wide frame ...
```

Den normaliserade briefen innehåller dessutom automatiskt:

- säker/negativ textyta
- fokuspunkt
- planerad crop
- start- och slututsnitt
- rörelseriktning och hastighet
- semantiska detaljområden

Det gör att prompten för en extern bildgenerator kan ta hänsyn till den planerade SCEN-rörelsen redan när bilden komponeras. Piloten anropar ingen bildgenerator eller extern bildtjänst.

## Arkitektur

- `Scen.normalizeImageDirection(slide)` normaliserar bildmetadata och detaljområden.
- `Scen.imageBrief(slide, defaults)` skapar en maskinläsbar brief eller returnerar `null` för scener utan bildbehov.
- `Scen.applyDramaturgy(...)` förblir den gemensamma tillståndsmotorn. Bildregi läser samma `overview`, `focus` och `restored` där dessa tillstånd är meningsfulla.
- Rendereraren deklarerar semantiska fokusområden; spelaren har ingen separat bildanimationsgren.
- CSS använder gemensamma dramaturgitokens för tempo och easing.
- Statiska vyer och thumbnails landar i en begriplig slutbild.

Piloten migrerar inte befintliga bildmallar och bygger inte Mallar-showroomet.
