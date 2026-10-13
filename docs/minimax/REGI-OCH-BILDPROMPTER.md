# Minimax och beskärning i SCEN

Första körbara versionen: 26 scener, byggda från originalets 21 bilder. Originalets exempel, övningar och symbolbilder finns kvar. Längre bilder har delats upp. Den återkommande sidfoten är flyttad till titel och talaranteckningar. Originaltexten finns också per scen i anteckningarna.

[Manus](../../presentationer/minimax-och-beskarning.md) · [Original-PowerPoint](original.pptx) · [Originalets textutdrag](originaltext.json) · [Scenmappning](scenmappning.json)

## Regin

1. **Ett beslut mot en motståndare.** Schackbilden introducerar ämnet. Max och Min får varsitt perspektiv.
2. **Från spel till träd.** Tre-i-rad visas med samma spelställningar som i originalet. Highlight-rutor styr uppmärksamheten mellan rot, drag och utfall. Ingen kamerazoom.
3. **Från löv till beslut.** I det generella trädet är bladvärdena synliga, men föräldravärdena dolda. Ett klick räknar en gren och markerar de värden som jämförs. Rotens värde avslöjas sist.
4. **Från fullständig sökning till beskärning.** Samma träd får ligga kvar. Nu är framtida bladvärden dolda och sökningen går vänster till höger. Det syns exakt när det finns tillräckligt underlag för att avstå en gren. Beskurna löv markeras med streckad förbindelse och ordet ”Beskuren”; deras värden avslöjas inte.
5. **Sätt namn på upptäckten.** Först intuitionen, sedan α, β och stoppvillkoret. En kort återkoppling på samma träd kopplar symbolerna till konkreta gränser.
6. **Eleverna tar över.** Olöst träd först, facit i följande scen. Ett resonemang per klick, med highlight på berörd nod. Därefter nodräkningsövningen och MCTS.

Stanna före svarsklicken. Be om både värde och motivering: ”Vem väljer här?” och ”Vad vet vi redan som gör resten ointressant?” Undvik en automatisk genomspelning av algoritmen; eleverna ska hinna förutsäga nästa steg.

## Den nya mallen: Resonemang i bild

Implementerad som `[egen: resonemang-i-bild]` i bibliotekets mallar.

- **Syfte:** följa en visuell förklaring utan att byta koordinatsystem.
- **När:** en uträkning, undersökning eller bild förändras mellan tydliga tillstånd.
- **Skillnad:** Bildregi pekar på delar av en befintlig bild. Denna mall byter även bildens innehåll, exempelvis från okänt nodvärde till beräknat värde.
- **Fokus:** grundbild → ett tillstånd per klick, med highlight i diagrammet och en kort förklaring under. Bakåt återställer föregående tillstånd. Utan klicksteg visas slutläget.
- **Innehåll:** en grundbild, valfri rubrik och etikett, sedan `etikett | bildsökväg | förklaring` per steg. Bilderna ska ha identiska mått och stabila positioner.
- **Återanvändning:** matematiska lösningar, fysikexperiment, historiska kartor, textrevision, kodspårning och medicinska förlopp.

Mallen beräknar inte algoritmer. Diagramtillstånden i denna presentation är förberedda SVG-bilder. Värdena är granskade mot träden. En framtida trädmodell bör göra beräkningen automatiskt när läraren ändrar lövvärdena.

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

Inga nya bilder behövs för att använda versionen. Originalets bilder är inlagda. Börja gärna med **bild 1**; övriga två är valfria. Låt AI skapa stämningsbilder, inte algoritmdiagram: text, siffror, grenar och exakta bräden lägger vi i SCEN.

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
- Originalets symbolbilder 1, 2, 3, 5, 6 och 7 används i den nya presentationen. Nätverksbilden behöver inte visas två gånger i följd.
- Spelställningarna och det stora nodräkningsträdet är vektoriserade från originalets former. Anpassad färg och beskärning ger ett enhetligt uttryck. Original-PowerPoint är facit för formatering och ursprunglig animation; de nya SVG-filerna återger inte PowerPoints animationstider.
- SCEN-versionen är en redigerad föreläsningsversion, inte en pixelidentisk import. Varje scen har hänvisning till originalbild och dess text i anteckningarna. Dubbletter som användes för PowerPoint-animationer är inte separata innehållspunkter i SCEN.
- Teams-övningsfilen har inte bifogats. Instruktionen att öppna den finns kvar.
- [Originalets MCTS-klipp på YouTube](https://www.youtube.com/watch?v=lhFXKNyA0QA) är bevarat som länk, inte nedladdat eller inbäddat.

## Verifiering av första versionen

- Manusvalidering, bygg och fristående export genomförda.
- Alla 26 scener öppnade i Natt och Klassrum. Diagramsteg testade framåt och bakåt; exakt ett bildtillstånd syns åt gången.
- Visning utan klicksteg visar slutläget. Exporten har testats med externa nätverksanrop blockerade.
- `test:bildsteg`, `test:berattande`, `test:film` och `test:inlasning` godkända. Hela projektets testsvit är inte grön sedan tidigare: det befintliga editorial-testet för Etapper förväntar tre steg där mallen har fyra inklusive återställning. Det felet är separat från denna konvertering.
