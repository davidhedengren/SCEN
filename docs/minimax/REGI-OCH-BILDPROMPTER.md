# Minimax och beskärning i SCEN

Omarbetad föreläsningsversion: 21 scener i samma ordning som originalets 21 bilder. Exemplen och deras förklaringar är samlade som i originalet. Den återkommande sidfoten är flyttad till titel och talaranteckningar. Originaltexten finns också per scen i anteckningarna.

[Manus](../../presentationer/minimax-och-beskarning.md) · [Original-PowerPoint](original.pptx) · [Originalets textutdrag](originaltext.json) · [Scenmappning](scenmappning.json)

## Regin

Den omarbetade versionen har **21 scener i originalets ordning**, en per originalbild. Spelställningar, argument, uppgifter och deras kopplingar är åter samlade. Den nya genererade schackbilden används på titeln; övriga symbolbilder är originalets.

- **Scen 2–5:** originalets bild och namngivna förklaringar bredvid varandra. Ett klick visar och framhäver nästa förklaring. Tidigare förklaringar fortsätter vara läsbara. Ingen cirkulerande text.
- **Scen 6–10:** spelbräden och förgreningar kommer direkt från originalets vektorformer. I scen 7 ligger robotbilden, citatet och det konkreta spelträdet åter på samma bild. Utfall och nodvärden avslöjas från löven uppåt.
- **Scen 11–14:** stora trianglar i originalets riktning: uppåt för MAX, nedåt för MIN. I minimax räknas en gren per klick. I introduktionen till beskärning syns originalets lövvärden; röda kryss markerar exakt vilka grenar som kan lämnas outforskade.
- **Scen 16–17:** definitionerna av alfa och beta följs av ett eget konkret förlopp. α och β står vid noderna och uppdateras vid varje söksteg. Framtida värden är dolda i denna förloppsvisning.
- **Scen 18–19:** olöst övning följd av stegvis facit med samma diagrampositioner. Den tidigare godkända rättelsen till värdet 3 är kvar.
- **Scen 20:** samtliga 22 noder och 21 förbindelser är återgivna. Roten är MIN, precis som i originalet. Grenarna har spridits ut för att göra de små noderna lättare att läsa.

Stanna före svarsklicken. Be om både värde och motivering: ”Vem väljer här?” och ”Vad vet vi redan som gör resten ointressant?” Alla scener har kvar originalets text i talaranteckningarna som stöd.

## Mallarna i denna version

### Resonemang i bild

`[egen: resonemang-i-bild]` används för spelträd och andra bildförlopp.

1. **Syfte:** följa en visuell beräkning i ett stabilt koordinatsystem.
2. **När:** en lösning, undersökning eller bild förändras mellan tydliga tillstånd.
3. **Skillnad mot Bildregi:** diagraminnehållet kan ändras, till exempel när ett värde blir känt. Markeringarna finns i själva SVG-bilden; de placeras inte utifrån visningsytans procentkoordinater.
4. **Fokus:** grundbild → ett tillstånd per klick, med markerad nod eller värde och en kort förklaring nedanför. Bakåt återställer föregående tillstånd. Utan klicksteg visas slutläget.
5. **Innehåll:** en grundbild, valfri rubrik och etikett, sedan `etikett | bildsökväg | förklaring` per steg. Alla tillstånd har samma bildutsnitt. En fast yta för bildtext gör att en längre förklaring inte krymper diagrammet.
6. **Återanvändning:** matematiska lösningar, fysikexperiment, historiska kartor, textrevision, kodspårning och medicinska förlopp.

Mallen beräknar inte algoritmer. Diagramtillstånden är förberedda SVG-bilder. En framtida trädmodell bör göra beräkningen automatiskt när läraren ändrar lövvärdena.

### Bild och förklaring

`[egen: bild-och-forklaring]` används för definitioner, tillämpningar, begränsningar och instruktioner.

1. **Syfte:** förena originalets illustration med dess förklarande text.
2. **När:** 2–4 namngivna förklaringar hör till ett stabilt motiv.
3. **Skillnad mot Text och bild:** alla delrubriker finns från början, medan klick visar förklaringarna och framhäver aktuell rad. Mallen hanterar längre originalformuleringar och en gemensam slutvy.
4. **Fokus:** nästa rad markeras med en accentlinje; redan visade förklaringar ligger kvar med hög läsbarhet. Sista klicket återger helheten.
5. **Innehåll:** valfri bild, rubrik och ingress; `rubrik | förklaring` per punkt. Utan bild får förklaringen hela bredden.
6. **Återanvändning:** begrepp, historiska dokument, litterär analys, fysikens villkor, användningsområden och praktiska instruktioner.

## Tre förslag till nästa mallar

### 1. Värden vandrar

En generell trädmodell med regler för hur barnens värden sammanställs i föräldern. Vid varje klick markeras indata, operation och resultat. På vägen upp syns varför värdet ändras.

Passar minimax, kostnadsträd, sannolikhetsträd, organisationsbudgetar och uttrycksträd. Till skillnad från befintliga Träd ska den hålla både struktur och beräknat tillstånd, inte bara flytta fokus. Innehåll: noder, barnrelationer, värden och en uttrycklig sammanställningsregel. Det är det mest värdefulla nästa utvecklingssteget.

### 2. Tillräckligt för ett beslut

En del av underlaget är känt. Nästa klick visar en avgörande gräns, och resterande undersökning markeras som onödig. Jämförelsen med ett redan säkrat alternativ ligger synlig.

Passar beskärning, matematiska olikheter, urvalsprocesser, diagnostik och ekonomiska beslut. Kräver att föreläsaren anger en faktisk beslutsregel; ett exempel ska inte automatiskt tolkas som bevis. Skillnaden mot en vanlig reveal är att det okända får förbli okänt även i slutläget. Innehåll: känt underlag, regel, gräns och delar som kan lämnas outforskade.

### 3. Samma problem, två förlopp

Två synkroniserade vyer visar samma struktur med olika metod. En räknare visar faktiska besökta objekt. Gemensamma steg sker samtidigt; skillnader framhävs där metoderna avviker.

Passar minimax/alfa-beta, sorteringsalgoritmer, produktionsflöden, experimentella metoder och alternativa rättsprocesser. Den befintliga Flöde-mallen visar jämförbara processled; här behövs separata tillstånd och olika antal arbetssteg. Definiera alltid vad räknaren räknar och hur tidpunkterna synkroniseras.

## Bildprompter

Den genererade bilden enligt **prompt 1** är nu inlagd på titeln. Övriga två bilder är valfria; originalets bilder används på övriga bildscener. Låt AI skapa stämningsbilder, inte algoritmdiagram: text, siffror, grenar och exakta bräden lägger vi i SCEN.

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

## Innehåll som behöver lärarens bedömning

Endast den uttryckligen godkända rättelsen nedan är genomförd. Övriga formuleringar behålls i scenerna; förslag är inte införda som nya fakta.

- **Originalbild 19 — rättad med godkännande 2026-10-13:** MAX över löven 2 och 3 ska ge 3, inte 2. MIN ovanför blir då min(7, 3) = 3, inte 2. Roten är fortfarande max(5, 3) = 5. Sju facitklick förklarar beräkningen och beskärningen.
- **Originalbild 4, ”35^100 noder”:** detta är en grov modell med antaganden om förgreningsfaktor och djup, inte ett exakt räknat schackträd. Föreslagen formulering: ”Redan en grov modell med 35 möjliga drag i 100 halvdrag ger omkring 35^100 möjliga förlopp.” Antagandena behöver en källa innan de presenteras som etablerad uppskattning.
- **Originalbild 4, icke-optimal motståndare:** standardminimax skyddar mot optimalt motspel. Det utnyttjar däremot inte nödvändigtvis en svag motståndares specifika misstag maximalt. Föreslagen precisering: ”Minimax räknar med bästa möjliga motspel; en modell av motståndarens misstag kan ibland ge bättre praktiskt spel.”
- **Originalbild 4, osäkerhet:** grundversionen här utgår från deterministiskt spel med full information. Det finns utvidgningar för slump och annan information; det kategoriska påståendet är för brett.
- **Originalbild 3, ekonomi och robotik:** ange konkreta exempel på adversariell eller robust optimering. Effektiv rörelse och låg energiförbrukning är i sig inte belägg för att minimax används.
- **Originalbild 9, illustration:** det insatta slutbrädet visar redan en vinst. Behåll som symbol, men be eleverna välja en tidigare spelställning med få tomma rutor för att begränsa arbetet.

## Bevarat material och externa beroenden

- Alla 21 originalbilder finns i den oförändrade bifogade PowerPoint-filen. Alla 27 mediafiler finns i `bilder/minimax/original/`; flera små bilder är PowerPoints automatiska reservbilder för formler, inte separata illustrationer.
- Originalets symbolbilder 2, 3, 5, 6 och 7 används i presentationen. Titelbild 1 är ersatt av den genererade schackbilden och finns bevarad i originalmappen. Nätverksbilden används på samma två bilder som i originalet.
- Spelställningarna och förbindelserna hämtas från originalets former. Spelbrädenas positioner, kryss och ringar bevaras. Numeriska träd har ritats större med samma struktur, lövvärden och nodtyper. Fokusmarkeringar och beskärningskryss ligger i diagrammets egen SVG. Original-PowerPoint är underlag för innehåll och ursprunglig animation.
- SCEN-versionen är en redigerad föreläsningsversion, inte en pixelidentisk import. Varje scen har hänvisning till originalbild och dess text i anteckningarna. Dubbletter som användes för PowerPoint-animationer är inte separata innehållspunkter i SCEN.
- Teams-övningsfilen har inte bifogats. Instruktionen att öppna den finns kvar.
- [Originalets MCTS-klipp på YouTube](https://www.youtube.com/watch?v=lhFXKNyA0QA) är bevarat som länk, inte nedladdat eller inbäddat.

## Verifiering av första versionen

- Manusvalidering, bygg och fristående export genomförda.
- Alla 21 scener öppnade i Natt och Klassrum. Diagramsteg testade framåt och bakåt; exakt ett bildtillstånd syns åt gången.
- Visning utan klicksteg visar slutläget. Exporten har testats med externa nätverksanrop blockerade.
- `test:bildsteg`, `test:berattande`, `test:film` och `test:inlasning` godkända. Bildstegstestet kontrollerar också identiska bildutsnitt och att varje nodmarkering verkligen omsluter rätt triangel. Hela projektets testsvit är inte grön sedan tidigare: det befintliga editorial-testet för Etapper förväntar tre steg där mallen har fyra inklusive återställning. Det felet är separat från denna konvertering.

## Återskapa diagrammen

`python scripts/build-minimax-visuals.py` läser den bevarade PowerPoint-filen och skriver SVG-tillstånden i `bilder/minimax/v2/`. För detta författarverktyg behövs `python-pptx`; presentationen och SCEN har ingen sådan beroende vid visning. Underlaget för nodräkningsövningens noder och förbindelser sparas i [diagramdata-v2.json](diagramdata-v2.json).
