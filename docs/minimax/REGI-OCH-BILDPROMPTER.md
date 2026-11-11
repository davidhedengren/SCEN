# Minimax och beskärning i SCEN

Omarbetad föreläsningsversion: 21 scener i samma ordning som originalets 21 bilder. Exemplen och deras förklaringar är samlade som i originalet. Den återkommande sidfoten är flyttad till titel och talaranteckningar. Originaltexten finns också per scen i anteckningarna.

[Manus](../../presentationer/minimax-och-beskarning.md) · [Original-PowerPoint](original.pptx) · [Originalets textutdrag](originaltext.json) · [Scenmappning](scenmappning.json)

## Regin

Presentationen har **21 scener**, en per originalbild. Ordningen följer originalet med ett undantag: **Användningsområden och Begränsningar (original 3 och 4) ligger efter minimaxuppgiften, direkt före alfa-beta-beskärning.** Eleverna förstår användningsområdena bättre när de vet vad MAX och MIN är, och begränsningen ”trädet blir för stort” blir en naturlig brygga till beskärningen. Talaranteckningen på Begränsningar har en sådan brygga.

| Scen | Innehåll | Original |
|---|---|---|
| 1–2 | Titel, vad minimax är | 1–2 |
| 3–4 | Minimax i tre-i-rad, beslutsträdet | 5–6 |
| 5–6 | Exempel 1 och 2 | 7–8 |
| 7 | Aktivitet: spela med grannen | 9 |
| 8 | Exempel 3 | 10 |
| 9–11 | Generell version (två scener), uppgift: vilket värde får rotnoden? | 11–13 |
| 12–13 | Användningsområden, begränsningar | 3–4 |
| 14–17 | Alfa-beta: idén, varför, α och β, steg för steg | 14–17 |
| 18–21 | Aktivitet, facit, nodräkning, extrauppgift MCTS | 18–21 |

- **Scen 2, 3, 7, 21:** *Bild och förklaring.* Numrerade rader; aktuell rad får accentram, tidigare rader tonas ned men går att läsa.
- **Scen 12, 13, 15:** *Bildband och kort.* Scen 12 har en ingress om att minimax fungerar överallt där två sidor har motsatta mål. Scen 15 har bonsaibilden som band.
- **Scen 4–6 och 8:** spelträden för tre-i-rad ritas från riktiga spelställningar; värdena räknas med minimax i byggskriptet och avslöjas nerifrån och upp.
- **Talträd (scen 9–11, 14, 17–20):** trianglar uppåt för MAX (turkos), nedåt för MIN (bärnsten). Noden i fokus fylls, får skarp ljus kant och ett mjukt sken; resten tonas ned. Beskurna grenar är streckade med rött kryss, och löv som inte undersökts är streckade konturer.
- **Slutvägen:** det sista steget på scen 10, 11, 14, 17 och 19 visar en vit, lysande linje från roten till lövet som ger rotens värde. På scen 11 är det ett eget klick (”Slutvägen”).
- **Scen 14:** beskärningen visas som djupet först-sökning, en nod i taget med räknare för undersökta löv, i samma rytm som scen 17 men utan α och β. Både mitten- och högergrenen stegas nod för nod: ner till noden, lövet, beskärning. Originalets formuleringar ligger på klick 8, 9 och 12.
- **Scen 16:** *Symbolnyckel.* ”uppdateras vid maxnoder” och ”uppdateras vid minnoder” är framhävda.
- **Scen 17:** följer simuleringen på ai-aktiviteter.se: varje nod visar sitt eget α och β; ett ändrat värde visas som ”8 → 5”.
- **Scen 19:** facit i *Resonemang med logg*. Raderna skrivs fram tecken för tecken (`rörelse: skrivmaskin`), som om algoritmen skriver.

Förklaringstexterna under diagrammen är skrivna i ord (”väljer det största av 4, 3 och 2”), så att presentationen går att läsa i efterhand. Skrivsättet max(4, 3, 2) finns bara i själva träden. Lärarinstruktioner står i talaranteckningarna, aldrig på bilden.

Stanna före svarsklicken. Be om både värde och motivering: ”Vem väljer här?” och ”Vad vet vi redan som gör resten ointressant?” Alla scener har kvar originalets text i talaranteckningarna som stöd.

## Mallarna i denna version

Alla fem mallar använder bara temats variabler och fungerar i ljusa och mörka teman. Diagrammen i `bilder/minimax/v3/` har genomskinlig bakgrund men färger valda för mörka teman (presentationen använder Natt).

### Resonemang i bild (förbättrad)

`[egen: resonemang-i-bild]` används för spelträd och andra bildförlopp.

1. **Syfte:** följa en visuell beräkning i ett stabilt koordinatsystem.
2. **När:** en lösning, undersökning eller bild förändras mellan tydliga tillstånd.
3. **Skillnad mot Bildregi:** diagraminnehållet kan ändras, till exempel när ett värde blir känt. Markeringarna finns i själva SVG-bilden.
4. **Fokus:** grundbild → ett tillstånd per klick. Textlisten nedanför har stegnummer, etikett och förklaring, och står still så att diagrammet inte hoppar. Etiketten (t.ex. ”Exempel 2 · X:s tur”) visas som en liten skylt bredvid rubriken.
5. **Innehåll:** grundbild, valfri rubrik och etikett, sedan `etikett | bildsökväg | förklaring` per steg.
6. **Återanvändning:** matematiska lösningar, fysikexperiment, historiska kartor, textrevision, kodspårning och medicinska förlopp.

### Resonemang med logg (ny)

`[egen: resonemang-med-logg]` skriver algoritmens ”tankar” som en logg i kommandotolksstil. I den här presentationen används den bara på scen 19 (facit), med `rörelse: skrivmaskin` så att varje rad skrivs fram tecken för tecken.

**Varför bara på facit?** När ett begrepp är nytt (scen 10 och 17) ska blicken vara på ett ställe: beräkningen och jämförelsen α ≥ β står vid noden där de görs, och en kort mening räcker under. En växande logg bredvid skulle dela uppmärksamheten mellan träd och text, och tävla med lärarens röst. På facit har eleverna redan räknat själva. Där är historiken poängen: de jämför sin lösning rad för rad, och hela spåret står kvar.

1. **Syfte:** visa både vad som händer i diagrammet och varför, i den ordning det sker.
2. **När:** algoritmer, kodspårning, beräkningar steg för steg, laborationsprotokoll och beslutsprocesser där ordningen är poängen.
3. **Skillnad mot Resonemang i bild:** förklaringen byts inte ut vid varje klick utan läggs till. Hela resonemanget står kvar som historik, så eleverna kan läsa tillbaka.
4. **Fokus:** ingressen är loggens första kommandorad (`$ …`). Varje klick byter bild och skriver en numrerad rad. Aktuell rad lyser med markör, tidigare rader tonas ned, och när loggen är full rullar äldre rader ut upptill. Utan klicksteg visas slutbilden med hela loggen.
5. **Innehåll:** grundbild, rubrik, etikett, ingress; `etikett | bildsökväg | rad` per steg. `**ord**` framhäver ett ord i raden (här ”beskär”).
6. **Återanvändning:** sorteringsalgoritmer, programspårning i programmering, reaktionssteg i kemi, ekvationslösning, ett experimentprotokoll i fysik, källkritisk granskning steg för steg.

Diagrammen bredvid loggen ritas smalare (1160 px i stället för 1760 px) så att de fyller sin del av bilden.

### Bild och förklaring (förbättrad)

1. **Syfte:** förena en illustration med 2–4 namngivna förklaringar.
2. **När:** begrepp, instruktioner, uppgifter och användningsområden som hör till ett motiv.
3. **Skillnad mot Text och bild:** alla rubriker syns från start och numreras; klick fyller i förklaringen.
4. **Fokus:** aktuell rad får accentram och färgad rubrik, tidigare rader tonas ned. Sista klicket visar allt lika.
5. **Innehåll:** valfri bild, etikett, rubrik och ingress; `rubrik | förklaring` per punkt. Utan bild får texten hela bredden.
6. **Återanvändning:** historiska dokument, litterär analys, laborationsinstruktioner, begreppsgenomgångar.

### Bildband och kort (ny)

1. **Syfte:** sätta en stämning med en bred bild och ställa 2–4 jämbördiga kategorier bredvid varandra.
2. **När:** användningsområden, begränsningar, skäl, aspekter, för- och nackdelar.
3. **Skillnad mot Kort och Numrerade kort:** bildbandet tonar in i rubriken, korten har stegvis innehåll med lyft och tonar ned tidigare kort. Utan bild fungerar den som en ren kortvy.
4. **Fokus:** alla kortrubriker syns från start → ett kort i taget fylls i och lyfts → slutläge där alla kort är lika.
5. **Innehåll:** valfri bild, etikett, rubrik, ingress; `rubrik | förklaring` per kort.
6. **Återanvändning:** samhällskunskapens perspektiv, religionernas högtider, kemins reaktionstyper, programmeringsparadigm, projektets risker.

### Symbolnyckel (ny)

1. **Syfte:** förklara beteckningar så att symbolen och betydelsen hålls ihop.
2. **När:** 2–4 symboler, storheter, förkortningar eller regler som ska läras in.
3. **Skillnad mot Definition och Formel:** flera symboler i samma vy med gemensam kolumn; ingen härledning.
4. **Fokus:** symbolerna syns från start → en betydelse i taget, symbolen lyfts med accent och tidigare rader tonas ned → hela nyckeln.
5. **Innehåll:** `symbol | betydelse`; `**ord**` framhäver namnet i betydelsen.
6. **Återanvändning:** fysikens storheter, kemiska beteckningar, kartsymboler, musiknotation, logiska operatorer, förkortningar i samhällskunskap.

## Tre förslag till nästa mallar

### 1. Värden vandrar

En generell trädmodell med regler för hur barnens värden sammanställs i föräldern. Vid varje klick markeras indata, operation och resultat. Byggskriptet för den här presentationen gör redan detta för minimax; nästa steg är att flytta logiken in i SCEN så att läraren kan ändra lövvärden i manuset.

### 2. Tillräckligt för ett beslut

En del av underlaget är känt. Nästa klick visar en avgörande gräns, och resterande undersökning markeras som onödig. Passar beskärning, olikheter, urvalsprocesser och diagnostik.

### 3. Samma problem, två förlopp

Två synkroniserade vyer visar samma struktur med olika metod, med en räknare för besökta objekt. Passar minimax/alfa-beta och sorteringsalgoritmer.

## Bildprompter

Den genererade bilden enligt **prompt 1** är nu inlagd på titeln. Bilden enligt prompt 4 är inlagd på scen 15. Övriga är valfria; originalets bilder används på övriga bildscener. Låt AI skapa stämningsbilder, inte algoritmdiagram: text, siffror, grenar och exakta bräden lägger vi i SCEN.

Använd samma färgvärld genom serien: mörk blåsvart bakgrund, mjukt turkost ljus, en liten varm bärnstensfärgad kontrast. 16:9, minst 1920 × 1080. Inga texter, logotyper, vattenstämplar eller inritade highlight-rutor. Använd gärna första bilden som stilreferens för de andra.

### Bild 1 — Ett drag, många möjliga framtider

**Placering:** titel, som ersättningsförslag till originalets schackbild. Filnamn: `minimax-ett-drag.png`.

> Cinematic editorial photograph, 16:9 landscape. A real chessboard viewed from a low three-quarter angle, positioned entirely in the right 55 percent of the image. Two opposing chess pieces face each other, one illuminated by soft turquoise light and the other by restrained warm amber light. A human hand hovers above one piece, paused just before making a decision. Quiet, precise, thoughtful atmosphere; realistic materials and credible chess pieces. Deep blue-black background, subtle depth of field. Keep the left 45 percent dark, smooth and almost empty for a large title added later. No writing, no numbers, no arrows, no diagrams, no logos, no decorative holographic interfaces. High-end documentary lighting, not fantasy art.

**Vad bilden gör:** etablerar ett beslut med en tänkande motpart. SCEN lägger titel och eventuell markering i den fria ytan.

### Bild 2 — Två perspektiv på samma spel

**Placering:** eventuell visuell brygga till Max och Min. Filnamn: `minimax-tva-perspektiv.png`.

> Cinematic overhead editorial photograph, 16:9 landscape. Two people sit opposite one another at a dark matte table, only their hands and forearms visible at the far left and far right edges. A small, simple, empty tic-tac-toe grid is engraved in a square wooden tile at the exact center, with a few loose X and O tokens beside it, not placed on the grid. Soft turquoise light comes from the left player's side and warm amber light from the right player's side. Symmetrical, calm, minimal composition with generous negative space. Realistic tactile materials, deep blue-black surroundings. No text, no numbers, no arrows, no graphical interface, no extra grid lines, no logos. Match the lighting and restrained palette of the reference image.

**Vad bilden gör:** samma bräde, två intressen. Vi lägger Max/Min och exakta spelställningar ovanpå i SCEN. Bilden ska inte användas för att dra slutsatser om lagliga drag.

### Bild 3 — Vi behöver inte följa alla vägar

**Placering:** valfritt avsnittsbyte före beskärning. Filnamn: `minimax-vagval.png`.

> Cinematic architectural photograph, 16:9 landscape. A minimal dark architectural space seen from slightly above, with three clearly separated corridors branching from one shared foreground area. The left corridor is softly lit in turquoise and remains clearly visible. The other two corridors recede into quiet shadow but are still physically present. Refined concrete, subtle atmospheric depth, restrained amber accent at the junction. Clean composition, no maze, no people, no neon spectacle. Leave the upper-left area uncluttered for an optional caption. No text, no numbers, no symbols, no arrows, no logos. Match the same deep blue-black, turquoise and amber palette as the reference image.

**Vad bilden gör:** en visuell paus före beräkningen. Den är en metafor; beviset för att en gren kan beskäras kommer i det exakta trädet efteråt. Behövs inte om du vill hålla lektionen tätare.

### Bild 4 — Beskärning (inlagd)

**Placering:** scen 15 *Varför beskärning?*, som bildband överst. Filnamn: `bilder/minimax/minimax-beskarning.jpg`.

> Cinematic macro photograph, 16:9 landscape. Precise pruning shears closing on a thin branch of a small, elegant bonsai tree. The trimmed twig and a few small leaves are falling away; the rest of the tree remains healthy and clearly structured. Composition is wide and shallow: the shears, branch and foliage sit in the upper half and center of the frame, while the bottom third is calm, dark and nearly empty because it will fade into a title. Deep blue-black background, soft turquoise rim light on the tree, a restrained warm amber highlight on the blades. Realistic materials, shallow depth of field. No text, no numbers, no arrows, no diagrams, no logos. Match the palette of the reference image.

**Vad bilden gör:** en symbol för att ta bort det som inte påverkar resultatet. Bildbandet visar bara den övre delen, så motivet ska ligga högt.

### Bild 5 — Nytt bildband för användningsområden (valfri)

**Placering:** scen 3, ersätter originalets nätverksbild som är för lågupplöst för ett helt bildband (799 × 365 px). Filnamn: `minimax-anvandning.png`. Originalbilden behålls om du hellre vill det.

> Cinematic editorial still life, ultra-wide 21:9 landscape, at least 2560 × 1100. Three objects on a long dark matte table, evenly spaced from left to right: a chess board with a few pieces mid-game, a printed financial chart on paper beside a pen, and a small industrial robot arm. All three are lit by soft turquoise light from above with a single restrained amber accent. Objects sit in the upper 60 percent of the frame; the bottom 40 percent is smooth dark table surface. Deep blue-black surroundings, realistic materials, calm documentary mood. No text, no numbers, no logos, no holographic interfaces.

### Bild 6 — Nytt bildband för begränsningar (valfri)

**Placering:** scen 4. Filnamn: `minimax-begransning.png`.

> Cinematic photograph, ultra-wide 21:9 landscape, at least 2560 × 1100. A single path in a dark forest splits into more and more branching trails that disappear into dense fog. The nearest fork is clearly lit in soft turquoise; the farther branches fade into blue-black mist, impossible to follow. Motif in the upper 60 percent, bottom 40 percent dark and calm. Restrained amber glow far away. No text, no numbers, no symbols, no logos, no people.

**Vad bilden gör:** antalet vägar växer snabbare än vi hinner följa dem, vilket är kärnan i beräkningskostnaden.

### Bild 7 — Monte Carlo (valfri)

**Placering:** scen 21. Filnamn: `minimax-mcts.png`.

> Cinematic overhead photograph, 16:9 landscape. A dark game board with several pale dice mid-roll, each trailing a faint turquoise light path that branches across the surface like the beginnings of a tree. One path is brighter than the others. Deep blue-black background, a small warm amber accent. Leave the left half calm and dark for text. No text, no numbers on the dice faces visible in focus, no logos.

## Innehåll som behöver lärarens bedömning

Endast de uttryckligen godkända rättelserna nedan är genomförda. Övriga formuleringar behålls i scenerna; förslag är inte införda som nya fakta.

- **Originalbild 10 — rättad på lärarens begäran 2026-11-10:** högra MIN-noden (X nere till höger) hade värdet 0. O vinner då direkt med övre mitten, så värdet är min(−1, 0) = −1. Roten är fortfarande max(0, −1, −1) = 0. Alla spelträd för tre-i-rad räknas nu i byggskriptet och kontrolleras i `test:bildsteg`.
- **Originalbild 20 — ändrad på lärarens beslut 2026-11-10:** alla inre noder är tomma i aktiviteten. Originalets 3 i MAX-noden ovanför löven 1, 0 och 1 (där max(1, 0, 1) = 1) visas inte längre.
- **Originalbild 19 — rättad med godkännande 2026-10-13:** MAX över löven 2 och 3 ska ge 3, inte 2. MIN ovanför blir då min(7, 3) = 3, inte 2. Roten är fortfarande max(5, 3) = 5. Sju facitklick förklarar beräkningen och beskärningen.
- **Originalbild 4, ”35^100 noder”:** detta är en grov modell med antaganden om förgreningsfaktor och djup, inte ett exakt räknat schackträd. Föreslagen formulering: ”Redan en grov modell med 35 möjliga drag i 100 halvdrag ger omkring 35^100 möjliga förlopp.” Antagandena behöver en källa innan de presenteras som etablerad uppskattning.
- **Originalbild 4, icke-optimal motståndare:** standardminimax skyddar mot optimalt motspel. Det utnyttjar däremot inte nödvändigtvis en svag motståndares specifika misstag maximalt. Föreslagen precisering: ”Minimax räknar med bästa möjliga motspel; en modell av motståndarens misstag kan ibland ge bättre praktiskt spel.”
- **Originalbild 4, osäkerhet:** grundversionen här utgår från deterministiskt spel med full information. Det finns utvidgningar för slump och annan information; det kategoriska påståendet är för brett.
- **Originalbild 3, ekonomi och robotik:** ange konkreta exempel på adversariell eller robust optimering. Effektiv rörelse och låg energiförbrukning är i sig inte belägg för att minimax används.
- **Originalbild 9, illustration:** det insatta slutbrädet visar redan en vinst. Behåll som symbol, men be eleverna välja en tidigare spelställning med få tomma rutor för att begränsa arbetet.

## Bevarat material och externa beroenden

- Alla 21 originalbilder finns i den oförändrade bifogade PowerPoint-filen. Alla 27 mediafiler finns i `bilder/minimax/original/`; flera små bilder är PowerPoints automatiska reservbilder för formler, inte separata illustrationer.
- Originalets symbolbilder 2, 3, 5, 6 och 7 används i presentationen. Titelbild 1 är ersatt av den genererade schackbilden och finns bevarad i originalmappen. Nätverksbilden används på samma två bilder som i originalet.
- Spelställningarna är avskrivna från originalet och ligger som data i byggskriptet; trädens grenar och värden räknas fram ur dem. Kryss, ringar och grenarnas ordning följer originalet. Numeriska träd har samma struktur, lövvärden och nodtyper som originalet. Robotbilden och citatet i scen 7 ligger kvar på samma bild. Fokusmarkeringar och beskärningskryss ligger i diagrammets egen SVG. Original-PowerPoint är underlag för innehåll och ursprunglig animation.
- SCEN-versionen är en redigerad föreläsningsversion, inte en pixelidentisk import. Varje scen har hänvisning till originalbild och dess text i anteckningarna. Dubbletter som användes för PowerPoint-animationer är inte separata innehållspunkter i SCEN.
- Övningsfilen i Vklass har inte bifogats. Instruktionen säger att den finns i Vklass (originalet sa Teams).
- [Originalets MCTS-klipp på YouTube](https://www.youtube.com/watch?v=lhFXKNyA0QA) är bevarat som länk, inte nedladdat eller inbäddat.

## Verifiering av version 3

- `npm run kolla`, `npm run bygg` och fristående export utan fel.
- Alla 21 scener granskade i visningsläget med alla klicksteg, bland annat 3, 7, 8, 10, 15 och 16 steg för steg.
- `test:bildsteg` kontrollerar nu att varje fokusram omsluter rätt bräde eller triangel i samma SVG, att markeringar faktiskt finns, och räknar om minimaxvärdena i scen 7, 8 och 10 med en egen implementation.
- Övriga node-tester godkända. Webbläsartesterna `check-browser` och `check-timeline-browser` fallerar likadant på koden före ändringen i den här miljön.

## Återskapa diagrammen

`python3 scripts/build-minimax-visuals.py` skriver alla diagramtillstånd till `bilder/minimax/v3/`. Spelställningar och träd står som data i skriptet; värden räknas och kontrolleras med `assert`. Bara Pillow behövs (för att komprimera robotbilden i scen 7). Nodräkningsövningens noder och förbindelser läses från [diagramdata-v2.json](diagramdata-v2.json).
