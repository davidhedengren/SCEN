# SCEN Bildregi

Bildregi gör bilden till en dramaturgisk scen i stället för ett placerat objekt. Piloten använder samma generella tillståndssystem som Tidslinje: semantiska tillstånd beräknas av spelaren och CSS ansvarar för kamera, nedtoning, annotation och mask.

Grundprincipen är:

> Kontexten finns kvar. Fokus vandrar. Relationer blir synliga. Helheten återvänder.

Principen används efter scenens kommunikativa behov. Cinematic hero har exempelvis en lugn kamerarörelse utan en påtvingad focus/fade-sekvens. Crop/mask reveal använder progressivt avslöjande eftersom ny information är själva poängen.

## Sex lägen

| `bildläge` | Dramaturgi |
|---|---|
| `hero` | Helbild med långsam kamerarörelse mellan start- och slututsnitt. |
| `detail` | Helhet → en eller flera betydelsefulla detaljer → eget restore-klick. |
| `vandring` / `guided` | Helbild → kamera, inramning och nedtoning kring varje detalj → helbild. |
| `spotlight` | Helheten ligger kvar; ett område får fokus och en annotation. Avslutas med restore. |
| `reveal` | Definierade bildområden avslöjas i ordning. Ingen artificiell restore krävs. |
| `levande` | Stillbild → zoom på första klicket → film på nästa. Filmen spelar en gång och stannar på sista rutan. |

## Levande bild

### Vandring över en sida

`bildläge: vandring` kombinerar en mjuk kamera med en rektangulär fokusram.
Bilden är kvar i sin helhet; området utanför ramen tonas ned. Varje detaljrad
flyttar kameran och ramen tillsammans. Som standard återställer ett sista klick helbilden.
Med `återställ: nej` följs sista detaljen direkt av nästa scen. Det passar till
exempel när en markerad knapp ska följas av den meny som knappen öppnar.
Bakåt från nästa scen återvänder då till den sista markerade detaljen.
Inställningen finns även som kryssruta i redigeraren och gäller också detaljresa
och spotlight. Utelämnad inställning eller `återställ: ja` behåller återgången.
Förklaringen ligger i ett separat band och flyttas upp när fokus ligger längst ned.

Det är samma återanvändbara Bildregi-layout, med ett nytt kameraläge. Det passar
webbgränssnitt, kartor, diagram, dokument, konstbilder och andra bilder där
publiken behöver förstå detaljernas placering. Till skillnad från `detail`
markeras målområdet och omgivningen tonas ned; till skillnad från `spotlight`
rör sig även kameran. Använd hela skärmbilder i 16:9 för exakt överensstämmelse
mellan originalets procentkoordinater och presentationsytan.

```text
[bildregi]
rubrik: Hitta rätt på sidan
text: Börja med helheten. Flytta sedan fokus med högerpil.
bild: bilder/kurs/hela-sidan.png
bildläge: vandring
- meny | Välj område | 12 | 40 | 20 | 30 | Sidans innehåll väljs här.
- arbete | Arbeta i mitten | 52 | 45 | 40 | 45 | Här visas ditt urval.
```

Koordinaterna är centrum X/Y samt bredd/höjd i procent av den visade bildytan.
Kameran begränsas till bildens kanter och högst 2,2 gångers zoom.
En film med samma format kan startas på ett visst fokussteg med `film:` och
`filmsteg:` precis som i Spotlight. Använd filmens första ruta som grundbild.
Bakåtsteg, omstart, statiska miniatyrer och reducerad rörelse använder samma
regler som övrig Bildregi; filmer börjar bara på sitt angivna steg.

### Film på klick

Film kan också kopplas till en befintlig Spotlight-ruta utan zoom. Behåll `bildläge: spotlight`, lägg till `film:` och ange detaljens id i `filmsteg:`, exempelvis `filmsteg: dyn`. Filmen startar på samma klick som markerar området och återställs till stillbilden när fokus flyttas. Alla vanliga detaljmarkeringar och klicksteg finns kvar. Använd filmens första bildruta som stillbild så att bytet till rörelse blir mjukt.

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
