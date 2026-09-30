# Manusformatet

En presentation är en textfil. Den börjar med ett huvud, sedan kommer bilderna, åtskilda av en rad med bara `---`.

```
---
titel: Källkritik i AI-åldern
tema: klassrum
---

[titel]
rubrik: Källkritik i AI-åldern
text: Hur vet vi vad som är sant?
etikett: Samhällskunskap 1b

---

[punkter]
rubrik: Innan du litar på en källa
- Vem står bakom?
- När publicerades den?
  - Underpunkt med två mellanslag före
tona: ja
> Talaranteckning. Syns bara för dig (tangent N och talarvyn).
```

## Huvudet

| Nyckel | Värden |
|---|---|
| `titel` | Presentationens namn |
| `kurs` | Valfritt. Biblioteket grupperar presentationerna under en rubrik per kurs, t.ex. `Artificiell Intelligens 1` |
| `tema` | `scen`, `djup`, `bana`, `nattbana`, `atlas`, `natt`, `tidskrift`, `kritvit`, `klassrum`, `solnedgang`, `skog`, `retro` |
| `färg` | Bara för temat `scen`: `blue`, `green`, `orange`, `teal`, `purple`, `red`, `graphite` |
| `läge` | Bara för temat `scen`: `ljust`, `mörkt` |

## En bild

Första raden är mallen inom hakparentes, t.ex. `[kort]`. Alla mallar finns i [MALLAR.md](MALLAR.md). Därefter kommer fält som `nyckel: värde`, listor som `- text` och anteckningar som `> text`.

| Nyckel | Används till |
|---|---|
| `rubrik` | Bildens rubrik |
| `text` | Ingress, underrubrik, definition eller slutsats beroende på mall. `slutsats` betyder samma sak. |
| `etikett` | Liten text ovanför rubriken, eller källa och bildtext |
| `svar` | Svaret i `[fråga]` och förklaringen i `[omröstning]` |
| `exempel` | Exemplet i `[definition]` |
| `tal` | Talet i `[tal]`, bakgrundstalet i `[omslag]` |
| `tid` | Minuter i `[reflektion]` |
| `aktiv` | Vilken del som lyser i `[karta]` |
| `max` | Maxvärdet i `[mätare]` när talet inte är en andel |
| `mitten` | Det gemensamma i `[ringar]` |
| `start`, `slut` | Utgångs- och slutläge i `[skiften]` |
| `fråga` | Det stabila analysobjektet i centrum av `[prisma]` |
| `gemensamt`, `spänning` | Gemensam grund och kvarvarande skillnad i `[prisma]` och `[sammanflöde]` |
| `orsak`, `konsekvens` | Start och utfall i den kausala banan `[verkningar]` |
| `villkor`, `alternativ` | Begränsning och konkurrerande förklaring i `[verkningar]` |
| `källa`, `helhet`, `reservation` | Proveniens, samlad tolkning och avgränsning i `[belägg]` |
| `syntes` | Den nya slutsats som växer fram i `[sammanflöde]` |
| `bild` | Sökväg till en bild, t.ex. `bilder/kurs/foto.jpg` |
| `alt` | Bildbeskrivning för skärmläsare |
| `bildläge` | `[bildregi]`: `hero`, `detail`, `spotlight` eller `reveal` |
| `fokuspunkt` | `[bildregi]`: bildens semantiska fokuspunkt som `x y` i procent |
| `beskärning` | `[bildregi]`: `cover` eller medvetet letterboxad `contain` |
| `startutsnitt`, `slututsnitt` | `[bildregi]`: `x y skala` för planerad kamerarörelse |
| `säker-yta` | `[bildregi]`: `x y bredd höjd` för typografi |
| `mörkning` | `[bildregi]`: `x y bredd höjd opacitet` för lokal textkontrast |
| `riktning`, `hastighet` | `[bildregi]`: planerad rörelseriktning och `slow`, `medium` eller `fast` |
| `band` | `ja` visar bilden som band överst (`[kort]`, `[motsats]`) |
| `bild-vänster` | `ja` byter sida på bilden |
| `vänster`, `höger` | Kolumnrubriker i `[jämförelse]`. Listan efter hamnar i den kolumnen. |
| `visa` | Tabeller: `allt`, `rader`, `facit` (sista kolumnen) eller `facit-rader` (allt utom första kolumnen) |
| `rubrikrad` | Tabeller: `nej` om första raden inte är rubriker |
| `steg` | `nej` visar allt direkt i stället för ett klick i taget |
| `tona` | `ja` tonar ner tidigare punkter |
| `övergång` | `automatisk`, `båge`, `tona`, `glid`, `skjut`, `stig`, `zooma`, `svep`, `morph`, `ingen` |
| `bakgrund` | `ingen`, `fokusljus`, `ljus`, `banor`, `vektorfält`, `nätverk`, `vågor`. `fokusljus` är ett mjukt ljus som följer fokus vid varje klick och står stilla däremellan. De andra rör sig hela tiden och passar bäst på titel- och avsnittsbilder. |
| `rubrikrörelse`, `rörelse` | `mask`, `ord för ord`, `skärpa`, `stig`, `tona`, `skrivmaskin`, `svep`, `ingen`. `skrivmaskin` skriver fram texten tecken för tecken med ett blinkande block, som i en kommandotolk. Flera texter på samma bild skrivs en i taget. Passar en fråga eller ett påstående som ska få liv, inte långa stycken. |

Bildregi kan dessutom bära en framtida Image Brief med `bild-id`, `filnamn`, `scen`, `syfte`, `motiv`, `komposition`, `motivplacering`, `format`, `undvik` och `prompt`. Detaljområden skrivs som `- id | etikett | x | y | bredd | höjd | annotation`. Se [BILDREGI.md](BILDREGI.md).

Terminal och typografisk dramaturgi använder fyra förstaklassmallar:

```text
[terminal]
- roll | innehåll | annotation

[kodförklaring]
text: kodblocket, med bevarade indrag på fortsättningsrader
- radnummer | token | annotation | resultat

[typografi]
- semantisk roll | formulering | stegetikett

[texttempo]
- semantisk roll | formulering | stegetikett
```

Terminalroller är bland annat `kommando`, `output`, `fel` och `success`. Typografiska roller är bland annat `statement`, `fokus`, `kontrast`, `precisering` och `slutsats`. Roller beskriver betydelse; rendereraren avgör den visuella representationen. Se [TEXTREGI.md](TEXTREGI.md).

### Listor med två delar

Kort, tidslinje, karta, triad, motsats, samtal och två tal använder `- rubrik | text`:

```
[motsats]
rubrik: Statisk eller dynamisk?
- Statisk | Förändras bara när agenten agerar.
- Dynamisk | Förändras hela tiden.
- Exempel | Schack är statiskt, trafiken är dynamisk.
```

### Analysmallar med strukturerade listor

De fem analysmallarna använder lodstreck för att skilja semantiska delar. Delarna har olika roller och bör inte slås ihop:

```text
[skiften]
- tid | händelse | förändring

[prisma]
- perspektiv | vad det betonar | grund

[verkningar]
- mekanism | vad mekanismen förändrar

[belägg]
- exakt utdrag ur texten | iakttagelse | tolkning

[sammanflöde]
- bidrag | vad bidraget tillför
```

I `[skiften]` är den tredje delen central: varje brytpunkt ska uttrycka vad som blir annorlunda efter händelsen. I `[sammanflöde]` används dessutom alltid `gemensamt`, `spänning` och `syntes` för att skilja mallen från en vanlig premiss–slutsats-layout.

### Flöde och urval

```text
[flöde]
- bana: namn        (valfri, högst två banor)
- steg | text       (högst fem steg per bana; ett steg som heter ? blir en stängd låda)
slutsats: visas när hela kedjan lyser

[urval]
vänster: namn på helheten
höger: namn på urvalet
- grupp | andel i helheten | andel i urvalet   (högst fyra grupper)
slutsats: visas när helheten återvänder
reservation: källa, annars står det "Illustration, inte verkliga siffror."
```

I `[flöde]` tänder varje klick samma steg i alla banor, så två processer jämförs steg för steg. I `[urval]` räknas andelarna om till procent, och meningen om den mest underrepresenterade gruppen skrivs automatiskt utifrån siffrorna.

### Förgrening

```text
[förgrening]
- namn | | | text                  (stammen: inget "ur")
- namn | tid | ur | text           (högst åtta grenar)
slutsats: visas när hela trädet syns
```

### Inzoomning, fyrfält och vågskål

```text
[inzoomning]
- namn | text                    (en nivå per rad, yttersta först, högst fem)
slutsats: visas när kameran zoomar ut

[fyrfält]
- x: vänster pol | höger pol
- y: nedre pol | övre pol
- namn | x y | text              (x och y från 0 till 100, högst åtta saker)
slutsats: visas när hela fältet syns

[vågskål]
vänster: För
höger: Emot
- För | argument | 2             (sidan är samma ord som i vänster eller höger, vikt 1–3)
slutsats: visas när balansen syns
```

I `[fyrfält]` skrivs vilken fyrdel saken ligger i ut automatiskt, till exempel "Sannolik · Stor skada". I `[vågskål]` tippar balken efter summan av vikterna, högst tre argument per sida.

### Omlopp med bilder

En del i `[omlopp]` kan få en bild som tredje fält: `- Avlaten | Syndernas förlåtelse går inte att köpa | bilder/x.jpg`. Med `bild:` får kärnan en grundbild. När en del har fokus visas dess bild i kärnan.

### Kodskrivning

```text
[kodskrivning]
rubrik: BFS i Python
text: def bfs(graph, start, goal):
    ko = [start]
- takt: rad                  (valfri: en rad per klick; annars skrivs koden i realtid)
- 2 | ko = [start] | Kön börjar med startnoden. | resultat (valfritt)
- 5 | ko.pop(0) -> ko.pop() | Nu blir det en stack.
```

Koden skrivs fram i ett terminalfönster med blinkande markör. Ett klick under skrivningen visar hela koden direkt. Därefter markerar varje klick en rad och ett uttryck. Skriv koden utan tomma rader. Filnamnet i fönstret tas från funktionens namn, till exempel `bfs.py`.

Med `gammalt -> nytt` som uttryck byts koden ut i det klicket: det som skiljer raderas och skrivs om, och det nya står kvar i resten av klicken. Så kan en bild visa hur en variant skiljer sig, till exempel BFS och DFS i samma kod.

### Formel

```text
[formel]
rubrik: Kostnaden för en nod
formel: f(n) = g(n) + h(n)
- h(n) | Uppskattad kostnad till målet.      (termerna i den ordning de ska tändas, högst fem)
- g(n) | Kostnad för att nå noden.
slutsats: visas när hela formeln syns i färg
```

Formeln står i stor text. Varje klick tänder en term i formeln och visar förklaringen under. Termerna får färg i tur och ordning: den första orange (accent 2), den andra i accentfärgen, den tredje i textfärgen. Samma färger används för g och h i `[rutnät]` med `siffror: g+h`.

### Sökning, rutnät och kö

Algoritmerna räknas fram automatiskt. Du skriver grafen eller labyrinten och väljer algoritm, och varje klick blir ett steg i rätt ordning.

```text
[sökning]
- algoritm: bfs              (bfs eller dfs)
- mål: E                     (flera mål: E, L)
- läge: kö                   (kö, vandring eller övning)
- not: 4 | kommentar         (visas vid klick 4)
- algoritmen: dold           (valfri: tar bort algoritmstegen, den skrivna raden står där i stället)
- kötyp: dold                (valfri: döljer BFS/DFS och köns namn, t.ex. innan köerna gåtts igenom)
- A                          (trädet med indrag, eller nod- och kantrader som i [graf])
  - B
    - C

[sökning] i läget övning
- läge: övning
- uppgift: Exempel | E       (upp till tre träd, två klick per träd: ordningen, sedan vägen)
- A
  - B

[rutnät]
- algoritm: bfs              (bfs, dfs, girig eller a*; två med komma, t.ex. bfs, dfs, söker bredvid varandra)
- takt: ruta                 (BFS går annars en nivå per klick; ett tal, t.ex. 3, ger tre rutor per klick)
- siffror: h                 (h = Manhattan-avståndet till målet, eller g+h)
- not: 6 | kommentar
- #..B                       (# vägg, . fri ruta, A start, B mål)
- A.#.

[kö]
- kö: fifo | FIFO-kö | First in, first out
- kö: stack | Stack | Last in, first out
- kö: prio | Prioritetskö | Lägst värde först
- in: A 3                    (element och prioritet)
- ut
- takt: samtidigt            (valfri: alla köer gör samma steg på en gång)
```

I `[kö]` går köerna en i taget: elementen läggs in i ett klick, sedan är varje `ut` ett klick. Det som tas ut står kvar i en rad under kön, så att köerna kan jämföras på slutet. Ett fjärde fält efter förklaringen visar en kodrad under könamnet, men lägg hellre koden på en egen kodbild så att den går att hoppa över.

Raderna som beskriver vad algoritmen gör, till exempel "Utforskar A." eller "Lägst f i kön", skrivs fram som i en kommandotolk när klicket kommer. Egna kommentarer med `not:` visas som vanlig text under.

Konventioner: BFS använder en FIFO-kö. DFS använder en stack, så den nod som lades till sist utforskas först; i ett träd blir det den högra grenen. Girig bäst först väljer lägst h, A* lägst g + h. Vid lika värden väljs den senast tillagda. I rutnät prövas grannarna i ordningen upp, vänster, höger, ned.

### Kretslopp

```text
[kretslopp]
rubrik: Så fungerar en sökalgoritm
text: visas i mitten under mittordet innan första klicket
slutsats: visas i mitten när hela kretsloppet syns
mitten: Kön            (det som går runt)
start: Lägg startnoden i kön          (valfri ingång)
retur: Upprepa tills en utgång nås.         (valfri, sluter ringen)
- Kön tom? | Finns det inga noder kvar? | Ingen lösning
- Ta ut en nod | En nod tas ut ur kön.
```

Stegen sitter på en ring, högst sex. Varje klick flyttar en ljusring till nästa steg och mitten förklarar steget. Ett tredje fält blir en utgång ut ur ringen. Ett steg som slutar med frågetecken får ja mot utgången och nej vidare i ringen.

### Ordning i ett träd

I `[träd]` visar `- fokus: ordning | rubrik | text` i vilken ordning noderna gås igenom: en ring glider från nod till nod, varje nod tänds och får sitt nummer, och ett spår ritas mellan noderna. `ordning` och `ordning bfs` går nivå för nivå från vänster till höger, `ordning dfs` går djupet först med vänster gren först, och `ordning A C G O` följer de noder du skriver. Numren står kvar när slutsatsen visas.

### Ordbild och bildfält med fokuspunkt

I `[ordbild]` och `[bildfält]` väljer `fokuspunkt: x y` (procent) vilken del av bilden som syns, till exempel `fokuspunkt: 85 30` för ett motiv uppe till höger. I ordbild är det den del som fyller ordet. Utan fokuspunkt används bildens mitt.

### Tid i förgrening

Tiden kan vara ett år (`1054`) eller ett sekel (`1500-talet`). `ur` är namnet på grenen den växer ur. Tidsaxeln är schematisk: varje förgreningstid får en egen kolumn, så täta perioder inte trängs ihop. Om två eller fler grenar växer ur samma gren vid samma tid slutar föräldern där, som vid en delning. Klicken följer grenarna i tidsordning.

### Tabeller

```
[tabell]
rubrik: Klassificera miljön
visa: facit-rader
| Uppgift | Observerbar | Agenter |
| Schack | Fullt | Multi |
| Poker | Partiellt | Multi |
```

Skriv `\n` i en cell för radbrytning.

### Omröstning

Markera rätt svar med `*`:

```
[omröstning]
rubrik: Kan en språkmodell ljuga?
- Ja
- Nej
- * Den kan ha fel utan att veta om det
```

## Text

`**ord**` markeras med temats färg. `x^2` och `x^{2}` blir upphöjt, `v_{0}` nedsänkt.

## Fria lager

Text, bilder, rutor, cirklar, pilar och markeringar kan ligga var som helst ovanpå vilken bild som helst. I redigeraren lägger du till dem med knapparna under bilden, drar dem på plats och dubbelklickar för att skriva. I manus ser de ut så här:

```
[fri]
@text 144 140 1200 160 storlek=96 typsnitt=rubrik | Fri yta
@text 144 330 900 200 storlek=40 färg=dampad | Två rader\nmed radbrytning
@bild 1100 200 640 480 | bilder/kurs/foto.jpg
@cirkel 1260 180 420 420 färg=accent linje=8
@pil 900 640 380 120 vinkel=-20 steg
@markering 140 600 700 90
```

Efter `@typ` kommer x, y, bredd och höjd i pixlar på en yta som är 1920 × 1080. `[fri]` är en tom bild med bara lager.

| Nyckel | Värden |
|---|---|
| `storlek` | Textstorlek i pixlar |
| `färg` | `text`, `dampad`, `accent`, `accent2`, `yta`, `vit`, `svart` |
| `typsnitt` | `rubrik` ger temats rubriktypsnitt |
| `bakgrund` | `yta`, `accent` eller `markering` bakom texten eller i formen |
| `justering` | `center` eller `höger` |
| `vinkel` | Grader, t.ex. `-20` |
| `linje` | Linjebredd för ruta, cirkel och pil |
| `passning` | Bilder: `hela` visar hela bilden i stället för att fylla rutan |
| `rörelse` | Animation, t.ex. `stig`, `zooma`, `ingen` |
| `fet`, `steg` | Fetstil, och att lagret visas först på klick |

## Automatisk morph

När två bilder i rad har samma rubrik eller samma bild glider de mellan lägena. Samma sak gäller korten i två `[karta]` efter varandra. Använd det medvetet, till exempel en `[karta]` med `aktiv: 1`, `aktiv: 2` och så vidare som avsnittsbyten.
