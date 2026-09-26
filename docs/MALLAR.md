# Mallar

Genererad av `node scripts/scen.mjs mallar` från `src/manus.js`. Ändra inte för hand.

Varje bild i ett manus börjar med mallens namn inom hakparentes. Samma katalog läser Claude när den planerar en presentation.

| Mall | Kategori | Syfte |
|---|---|---|
| `[etapper]` | Redaktionellt | En process i tre eller fyra etapper. Rubrikerna följer en stigande ordning, utan att höjden representerar mätdata. |
| `[vägval]` | Redaktionellt | Två alternativ jämförs kriterium för kriterium. Varje klick visar båda sidor av samma rad. |
| `[lager]` | Redaktionellt | Går från övergripande sammanhang till en konkret kärna. Tre indragna nivåer blir synliga i ordning. |
| `[resonemang]` | Redaktionellt | Ett resonemang byggs i vänsterkolumnen och landar i en tydlig slutsats till höger. |
| `[helhet]` | Redaktionellt | Fyra delar i en asymmetrisk helhetsbild. Den första får mer plats, därefter tre kompletterande perspektiv. |
| `[lameller]` | Struktur | En bildöppning där sju lameller lämnar scenen i olika riktningar. |
| `[register]` | Signatur | Ett horisontellt register där aktuell panel vidgas vid varje klick. |
| `[samband]` | Signatur | Premisser binds till en gemensam slutsats med ritade förbindelser. |
| `[marginal]` | Signatur | Stor bild och marginalanteckningar som vecklas fram med tunna linjer. |
| `[sats]` | Signatur | Två eller tre termer med förklaringar och en avslutande slutsats. |
| `[titel]` | Struktur | Öppning eller avslutning. Stor rubrik, underrubrik och en rad med namn eller datum. Bild i högerkanten om du vill. |
| `[avsnitt]` | Struktur | Avsnittsbyte. Kort etikett och stor rubrik som visar var i lektionen ni är. |
| `[påstående]` | Struktur | En mening som ska fastna. Markera nyckelord med **fetstil**. |
| `[punkter]` | Listor och steg | Tre till sex punkter som visas en i taget. Underpunkter med indrag. |
| `[kort]` | Listor och steg | Två till sex begrepp med kort förklaring, som kort. Bild bredvid eller som band överst. |
| `[tidslinje]` | Listor och steg | Händelser i tidsordning, eller numrerade steg i en aktivitet. |
| `[text-bild]` | Bild | Text och punkter bredvid en bild. Byt sida med bild-vänster. |
| `[helbild]` | Bild | En bild som tar hela ytan, med kort rubrik och bildtext. |
| `[jämförelse]` | Data | Två sidor mot varandra: för och emot, före och efter. |
| `[tabell]` | Data | Tabell, gärna som övning där facit klickas fram rad för rad. |
| `[tal]` | Data | Ett tal som räknas upp, med förklaring. |
| `[två-tal]` | Data | Två eller tre tal bredvid varandra som ska jämföras. |
| `[citat]` | Struktur | Ett citat med källa. |
| `[fråga]` | Interaktivt | Fråga med alternativ. Svaret visas på klick. |
| `[omröstning]` | Interaktivt | Omröstning på storskärmen. Räkna händer med tangenterna 1–9 eller klicka på ett alternativ. Markera rätt svar med *. |
| `[reflektion]` | Interaktivt | Reflektionsfråga med timer. Klicka för att starta tiden. Valfria steg som tänk, par, dela. |
| `[definition]` | Struktur | Ett begrepp med definition och ett exempel som visas på klick. |
| `[samtal]` | Interaktivt | Ett AI-samtal som visas replik för replik. Skriv vem | repliken. |
| `[omslag]` | Redaktionellt | Tidskriftsomslag för start eller nytt kapitel. Enorm rubrik, liten etikett, kort text, ett stort dekorativt tal i bakgrunden och bild i högerkanten. |
| `[karta]` | Redaktionellt | Visar ett ramverk som numrerade kort. Sätt aktiv för att markera var i ramverket ni är, och återanvänd kartan som avsnittsbyte. |
| `[triad]` | Redaktionellt | Två till fyra premisser som leder fram till en slutsats. Premisserna kommer en i taget och slutsatsen landar stort sist. |
| `[motsats]` | Redaktionellt | Två begrepp mot varandra. Första klicket visar det ena, andra klicket låter det andra ta scenen, tredje visar ett exempel som binder ihop. |
| `[bildkant]` | Redaktionellt | En bild som spiller ut över kanten i ett hörn, med rubrik och punkter i motsatt hörn. Ger fart åt en bild som annars bara hade stått i en ruta. |
| `[båge]` | Banor | Öppning eller kapitelstart. Stora bågar ritas upp över bilden, etiketten glider längs en av dem och en planet rullar in på sin bana. Ett stort konturtal kan ligga i hörnet. |
| `[omlopp]` | Banor | Ett begrepp i mitten och tre till sex delar som kretsar runt det. Varje del åker in längs banan på klick. |
| `[gradskiva]` | Banor | En skala från ett ytterläge till ett annat. Nålen svänger till varje läge på klick och bågen fylls, medan förklaringen byts i mitten. |
| `[bro]` | Banor | En ren processbana med tydlig typografi, numrerade hållplatser och en accentfärg. En markör följer varje klick. Aktuell rubrik framhävs och tidigare steg tonas ned. Stäng av fokus med tona: nej. |
| `[ringar]` | Banor | Två eller tre begrepp som delvis överlappar, som ett Venndiagram. Det gemensamma skrivs i mitten och visas sist. |
| `[lins]` | Banor | En bild där en rund lins lyser upp en detalj i taget. Resten är nedtonad. Varje rad: x y i procent | rubrik | text. |
| `[mätare]` | Banor | Ett tal som andel av något, som en mätare som fylls medan talet räknas upp. Skriv 73 %, 4 av 8 eller ett tal med max. |
| `[ridå]` | Ljus | Öppning eller avslutning. En ridå i bakgrundens färg glider isär med en glödande kant och visar en bild i helformat som sakta zoomar. Rubriken är stor och sitter nere till vänster. |
| `[strålkastare]` | Ljus | En mening i riktigt stor text där strålkastaren tänder en fras i taget. Hela meningen syns svagt från början, så publiken ser vart du är på väg. Skriv en fras per rad. |
| `[fokus]` | Ljus | En lista i stor text där bara den aktiva raden är skarp och förklaringen fälls ut under den. De andra ligger kvar suddiga i bakgrunden. |
| `[ordbild]` | Ljus | Ett enda ord i jättestor text som är fyllt med en bild som sakta panorerar. Bilden lyser också svagt i bakgrunden. Bra som avsnittsstart. |
| `[bildfält]` | Ljus | En bild som fyller två tredjedelar av ytan och tonar mjukt in i mörkret, utan kant eller ram. Text och punkter på den mörka sidan. |
| `[delning]` | Ljus | Två motsatser som två stora färgfält, ett mörkt och ett i accentfärg som sveper in. En tredje rad blir ett exempel uppe till höger. |
| `[ljustal]` | Ljus | Ett stort tal som räknas upp i glödande text. Är talet en andel, som 73 % eller 4 av 8, fylls en tjock stapel under det. |
| `[fri]` | Struktur | En tom bild där du placerar text, bilder, former och pilar fritt med fria lager. |

## Redaktionellt

### `[etapper]` Etapper

En process i tre eller fyra etapper. Rubrikerna följer en stigande ordning, utan att höjden representerar mätdata.

**Undvik när:** Högst fyra steg. Använd inte för jämförelser mellan likvärdiga alternativ.

```
[etapper]
rubrik: Från fråga till insikt
etikett: Process
fokus: mjuk
- Fråga | Formulera vad vi vill förstå.
- Undersöka | Samla det som kan ge svar.
- Förstå | Dra en välgrundad slutsats.
```

### `[vägval]` Vägval

Två alternativ jämförs kriterium för kriterium. Varje klick visar båda sidor av samma rad.

**Undvik när:** Högst fyra kriterier. Varje rad skrivs kriterium | vänster | höger.

```
[vägval]
rubrik: Två vägar framåt
vänster: Självständigt
höger: Tillsammans
fokus: mjuk
- Tempo | Egen rytm | Gemensam takt
- Perspektiv | Egen fördjupning | Flera synsätt
- Återkoppling | Egen kontroll | Löpande samtal
```

### `[lager]` Lager

Går från övergripande sammanhang till en konkret kärna. Tre indragna nivåer blir synliga i ordning.

**Undvik när:** Högst tre nivåer. Använd bara när det finns en faktisk hierarki eller fördjupning.

```
[lager]
rubrik: Från helhet till detalj
fokus: mjuk
- Sammanhang | Varför spelar frågan roll?
- Princip | Vad är det som styr?
- Tillämpning | Hur använder vi principen?
```

### `[resonemang]` Resonemang

Ett resonemang byggs i vänsterkolumnen och landar i en tydlig slutsats till höger.

**Undvik när:** Högst tre led. Slutsatsen ska stödjas av innehållet.

```
[resonemang]
rubrik: Gör tankegången synlig
fokus: mjuk
- Iakttagelse | Vad kan vi faktiskt se?
- Tolkning | Hur kan det förklaras?
- Prövning | Håller förklaringen?
text: En slutsats som går att följa.
```

### `[helhet]` Helhet

Fyra delar i en asymmetrisk helhetsbild. Den första får mer plats, därefter tre kompletterande perspektiv.

**Undvik när:** Fyra delar rekommenderas. Första delen får större visuell vikt; ytorna representerar inga mängder.

```
[helhet]
rubrik: Det som håller ihop arbetet
fokus: mjuk
- Riktning | Vad vill vi uppnå?
- Människor | Vilka behöver vara med?
- Arbetssätt | Hur tar vi oss framåt?
- Uppföljning | Hur vet vi att det fungerar?
```

### `[omslag]` Omslag

Tidskriftsomslag för start eller nytt kapitel. Enorm rubrik, liten etikett, kort text, ett stort dekorativt tal i bakgrunden och bild i högerkanten.

**Undvik när:** Mer än två meningar text.

*Efter Slidecraft-mallen `EditorialHero` (MIT).*

```
[omslag]
etikett: Kapitel 2
rubrik: Miljön styr agenten
text: Samma algoritm beter sig olika i olika världar.
tal: 02
```

### `[karta]` Karta

Visar ett ramverk som numrerade kort. Sätt aktiv för att markera var i ramverket ni är, och återanvänd kartan som avsnittsbyte.

**Undvik när:** Mer än åtta delar.

*Efter Slidecraft-mallen `DimensionMap` (MIT).*

```
[karta]
rubrik: Fyra frågor om en källa
- Vem | Vem står bakom?
- När | Hur aktuell är den?
- Varför | Vad vill avsändaren?
- Hur | Går det att kontrollera?
aktiv: 2
```

### `[triad]` Triad

Två till fyra premisser som leder fram till en slutsats. Premisserna kommer en i taget och slutsatsen landar stort sist.

**Undvik när:** När det inte finns någon tydlig slutsats.

*Efter Slidecraft-mallen `TriadStatement` (MIT).*

```
[triad]
rubrik: Varför kunskap spelar roll
- Frågor | För att ställa bra frågor krävs kunskap.
- Svar | För att värdera svar krävs kunskap.
slutsats: AI **förstärker** det du redan kan.
```

### `[motsats]` Motsats

Två begrepp mot varandra. Första klicket visar det ena, andra klicket låter det andra ta scenen, tredje visar ett exempel som binder ihop.

**Undvik när:** Mer än två sidor. Använd kort.

*Efter Slidecraft-mallen `SpotlightContrast` (MIT).*

```
[motsats]
etikett: Dimension 3
rubrik: Statisk eller dynamisk?
- Statisk | Förändras bara när agenten agerar.
- Dynamisk | Förändras hela tiden, oavsett agenten.
- Exempel | Schack är statiskt, trafiken är dynamisk.
```

### `[bildkant]` Bildkant

En bild som spiller ut över kanten i ett hörn, med rubrik och punkter i motsatt hörn. Ger fart åt en bild som annars bara hade stått i en ruta.

**Undvik när:** Bilder där det viktiga ligger i kanten.

*Efter Slidecraft-mallen `ImageBleed` (MIT).*

```
[bildkant]
etikett: Exempel
rubrik: Kaströrelse
text: Två rörelser på en gång.
- Konstant fart framåt
- Fritt fall nedåt
```

## Struktur

### `[lameller]` Lameller

En bildöppning där sju lameller lämnar scenen i olika riktningar.

**Undvik när:** Långa rubriker; håll dig till ungefär sex ord.

```
[lameller]
etikett: Scen / Signatur 01
rubrik: Ge idén
  hela scenen.
text: En öppning med riktning, rytm och luft.
bild: bilder/ai-agenter/ai01.jpg
```

### `[titel]` Titel

Öppning eller avslutning. Stor rubrik, underrubrik och en rad med namn eller datum. Bild i högerkanten om du vill.

**Undvik när:** Mitt i presentationen. Använd avsnitt i stället.

```
[titel]
rubrik: Källkritik i AI-åldern
text: Hur vet vi vad som är sant när texter och bilder kan skapas på sekunder?
etikett: Samhällskunskap 1b · vecka 38
bakgrund: nätverk
```

### `[avsnitt]` Avsnitt

Avsnittsbyte. Kort etikett och stor rubrik som visar var i lektionen ni är.

**Undvik när:** När rubriken är en hel mening. Använd påstående.

```
[avsnitt]
etikett: Del 2
rubrik: Så fungerar en språkmodell
bakgrund: vektorfält
```

### `[påstående]` Påstående

En mening som ska fastna. Markera nyckelord med **fetstil**.

**Undvik när:** Mer än en idé. Dela upp på flera bilder.

```
[påstående]
etikett: Viktigt
rubrik: En språkmodell förutsäger nästa ord. Den **vet** ingenting.
```

### `[citat]` Citat

Ett citat med källa.

**Undvik när:** Citat utan tydlig källa.

```
[citat]
text: Den som inte kan tänka själv får andra att tänka åt sig.
etikett: Okänd källa. Byt mot ett citat du kan belägga.
```

### `[definition]` Definition

Ett begrepp med definition och ett exempel som visas på klick.

**Undvik när:** Flera begrepp. Använd kort.

```
[definition]
etikett: Begrepp
rubrik: Hallucination
text: När en AI-modell påstår något som låter rimligt men är fel.
exempel: Modellen hittar på en källa som inte finns.
```

### `[fri]` Fri yta

En tom bild där du placerar text, bilder, former och pilar fritt med fria lager.

**Undvik när:** När en mall redan passar. Mallar håller ihop utseendet.

```
[fri]
@text 144 140 1200 160 storlek=96 typsnitt=rubrik | Fri yta
@text 144 330 900 200 storlek=40 färg=dampad | Dra, skala och skriv direkt på bilden.
@cirkel 1260 180 420 420 färg=accent linje=8
@pil 900 640 380 120 vinkel=-20 steg
```

## Signatur

### `[register]` Register

Ett horisontellt register där aktuell panel vidgas vid varje klick.

**Undvik när:** Fler än fem paneler eller långa panelrubriker.

```
[register]
rubrik: Tre perspektiv. En fråga.
- Upptäck | Vad ser vi? Börja med det som går att observera.
- Tolka | Vilka förklaringar passar våra observationer?
- Pröva | Vad skulle kunna visa att vår tolkning är fel?
```

### `[samband]` Samband

Premisser binds till en gemensam slutsats med ritade förbindelser.

**Undvik när:** Fler än fyra premisser; ett samband är inte automatiskt ett bevis.

```
[samband]
rubrik: Vad behöver en agent?
etikett: Tillsammans
- Observation | Information om omgivningen.
- Mål | Något att försöka uppnå.
- Handling | Ett sätt att påverka omgivningen.
text: En återkopplande process.
```

### `[marginal]` Marginal

Stor bild och marginalanteckningar som vecklas fram med tunna linjer.

**Undvik när:** Fler än tre anteckningar. Linjerna är redaktionella, inte exakta mätmarkörer.

```
[marginal]
rubrik: Läs rörelsen.
bild: bilder/kastrorelse/parabel.svg
- Horisontellt | Konstant hastighet när luftmotståndet försummas.
- Vertikalt | Tyngdkraften ändrar hastigheten.
- Tillsammans | Rörelserna ger en parabel.
```

### `[sats]` Sats

Två eller tre termer med förklaringar och en avslutande slutsats.

**Undvik när:** Långa formler. Exemplet antar start i origo och försummar luftmotstånd.

```
[sats]
rubrik: Två rörelser. En bana.
- x(t) = v_{0x}t | Jämn rörelse horisontellt.
- y(t) = v_{0y}t − gt^2/2 | Konstant acceleration vertikalt.
text: Samma tid t binder ihop rörelserna.
```

## Listor och steg

### `[punkter]` Punktlista

Tre till sex punkter som visas en i taget. Underpunkter med indrag.

**Undvik när:** När punkterna har rubrik och förklaring. Använd kort.

```
[punkter]
rubrik: Innan du litar på en källa
- Vem står bakom?
- När publicerades den?
- Finns det andra som säger samma sak?
  - Hitta minst två oberoende källor
tona: ja
```

### `[kort]` Kort

Två till sex begrepp med kort förklaring, som kort. Bild bredvid eller som band överst.

**Undvik när:** Långa texter. Korten ska läsas på ett ögonblick.

```
[kort]
rubrik: Tre egenskaper hos en AI-agent
- Autonomi | Fattar egna beslut
- Perception | Tar in data om omgivningen
- Målorientering | Väljer det som bäst når målet
```

### `[tidslinje]` Tidslinje

Händelser i tidsordning, eller numrerade steg i en aktivitet.

**Undvik när:** Mer än sex händelser.

```
[tidslinje]
rubrik: AI:s historia i fyra steg
- 1950 | Turing föreslår sitt test
- 1997 | Deep Blue slår Kasparov
- 2012 | Djupinlärning slår igenom
- 2022 | ChatGPT lanseras
```

## Bild

### `[text-bild]` Text och bild

Text och punkter bredvid en bild. Byt sida med bild-vänster.

**Undvik när:** När bilden är huvudsaken. Använd helbild.

```
[text-bild]
rubrik: Kaströrelse
- I x-led är farten konstant
- I y-led verkar g nedåt
- Banan blir en **parabel**
```

### `[helbild]` Helbild

En bild som tar hela ytan, med kort rubrik och bildtext.

**Undvik när:** Bilder med liten upplösning.

```
[helbild]
rubrik: Solvarv i Mojaveöknen
etikett: Foto: exempel
```

## Data

### `[jämförelse]` Jämförelse

Två sidor mot varandra: för och emot, före och efter.

**Undvik när:** Mer än två alternativ. Använd kort.

```
[jämförelse]
rubrik: Sökmotor eller språkmodell?
vänster: Sökmotor
- Hittar befintliga sidor
- Visar källan
höger: Språkmodell
- Skriver ny text
- Kan hitta på
```

### `[tabell]` Tabell

Tabell, gärna som övning där facit klickas fram rad för rad.

**Undvik när:** Tabeller med fler än åtta rader.

```
[tabell]
rubrik: Klassificera miljön
visa: facit-rader
| Uppgift | Observerbar | Agenter |
| Schack | Fullt | Multi |
| Poker | Partiellt | Multi |
```

### `[tal]` Stort tal

Ett tal som räknas upp, med förklaring.

**Undvik när:** När talet behöver jämföras. Använd två tal.

```
[tal]
rubrik: Så många elever har testat AI i skolarbetet
tal: 7 av 10
text: Exempelsiffra. Byt mot er egen enkät.
```

### `[två-tal]` Två tal

Två eller tre tal bredvid varandra som ska jämföras.

**Undvik när:** Fler än tre tal.

```
[två-tal]
rubrik: Före och efter
- 12 min | läste eleverna i snitt
- 31 min | efter läsprojektet
text: Exempeldata.
```

## Interaktivt

### `[fråga]` Fråga och svar

Fråga med alternativ. Svaret visas på klick.

**Undvik när:** När klassen ska rösta. Använd omröstning.

```
[fråga]
rubrik: Vilken landar först?
- Kulan som släpps
- Kulan som kastas
- Samtidigt
svar: Samtidigt. Farten framåt påverkar inte fallet.
```

### `[omröstning]` Omröstning

Omröstning på storskärmen. Räkna händer med tangenterna 1–9 eller klicka på ett alternativ. Markera rätt svar med *.

**Undvik när:** Öppna frågor. Använd reflektion.

```
[omröstning]
rubrik: Kan en språkmodell ljuga?
- Ja
- Nej
- * Den kan ha fel utan att veta om det
svar: Den har ingen avsikt, men kan låta säker när den har fel.
```

### `[reflektion]` Reflektion

Reflektionsfråga med timer. Klicka för att starta tiden. Valfria steg som tänk, par, dela.

**Undvik när:** Frågor med ett rätt svar.

```
[reflektion]
rubrik: När hjälper AI ditt lärande, och när tar den över?
tid: 3
- Tänk själv
- Prata i par
- Dela med klassen
```

### `[samtal]` AI-samtal

Ett AI-samtal som visas replik för replik. Skriv vem | repliken.

**Undvik när:** Långa svar. Korta ner repliker.

```
[samtal]
rubrik: Vad hände här?
- Elev | Vem vann Nobelpriset i litteratur 2031?
- AI | Det var den svenska författaren Maja Lind.
- Elev | Hur vet du det?
- AI | Jag har inte tillgång till uppgifter om 2031. Svaret var gissat.
```

## Banor

### `[båge]` Båge

Öppning eller kapitelstart. Stora bågar ritas upp över bilden, etiketten glider längs en av dem och en planet rullar in på sin bana. Ett stort konturtal kan ligga i hörnet.

**Undvik när:** Långa rubriker, över sex ord.

```
[båge]
etikett: Fysik 1 · Kapitel 3
rubrik: Kaströrelse
text: Två rörelser på en gång: jämn fart framåt och fritt fall nedåt.
tal: 03
```

### `[omlopp]` Omlopp

Ett begrepp i mitten och tre till sex delar som kretsar runt det. Varje del åker in längs banan på klick.

**Undvik när:** Delar som har en ordning. Använd bro eller tidslinje.

```
[omlopp]
etikett: Tre egenskaper
rubrik: AI-agent
- Autonomi | Fattar egna beslut
- Perception | Tar in data om omgivningen
- Målorientering | Väljer det som bäst når målet
```

### `[gradskiva]` Gradskiva

En skala från ett ytterläge till ett annat. Nålen svänger till varje läge på klick och bågen fylls, medan förklaringen byts i mitten.

**Undvik när:** Saker utan ordning längs en skala.

```
[gradskiva]
rubrik: Hur mycket ser agenten?
- Inget | Agenten gissar helt i blindo.
- Delar | Sensorer ger en del av bilden.
- Allt | Hela miljön är synlig, som i schack.
```

### `[bro]` Bro

En ren processbana med tydlig typografi, numrerade hållplatser och en accentfärg. En markör följer varje klick. Aktuell rubrik framhävs och tidigare steg tonas ned. Stäng av fokus med tona: nej.

**Undvik när:** Fler än fem hållplatser.

```
[bro]
rubrik: Från omgivning till handling
vänster: Omgivningen
höger: Åtgärd
- Uppfattar | med sensorer eller data
- Beslutar | utifrån sitt mål
- Agerar | med aktuatorer
```

### `[ringar]` Ringar

Två eller tre begrepp som delvis överlappar, som ett Venndiagram. Det gemensamma skrivs i mitten och visas sist.

**Undvik när:** Begrepp som inte har något gemensamt.

```
[ringar]
rubrik: Singel eller multi?
- Singelagent | En agent, ingen koordinering
- Multiagent | Flera agenter som påverkar varandra
mitten: Schack mot dator kan ses på båda sätten
```

### `[lins]` Lins

En bild där en rund lins lyser upp en detalj i taget. Resten är nedtonad. Varje rad: x y i procent | rubrik | text.

**Undvik när:** Bilder utan tydliga detaljer att peka på.

```
[lins]
rubrik: Titta närmare
- 30 55 | Banan | Bågen är en parabel.
- 70 50 | Toppen | Här är farten i y-led noll.
```

### `[mätare]` Mätare

Ett tal som andel av något, som en mätare som fylls medan talet räknas upp. Skriv 73 %, 4 av 8 eller ett tal med max.

**Undvik när:** Tal som inte är en andel.

```
[mätare]
etikett: Övningen
rubrik: Partiellt observerbara uppgifter
tal: 4 av 8
text: Poker, trafik, robotdammsugare och diagnos.
```

## Ljus

### `[ridå]` Ridå

Öppning eller avslutning. En ridå i bakgrundens färg glider isär med en glödande kant och visar en bild i helformat som sakta zoomar. Rubriken är stor och sitter nere till vänster.

**Undvik när:** Bilder utan motiv, eller mer än en mening i rubriken.

```
[ridå]
etikett: Fysik 1
rubrik: Kaströrelse
text: Två rörelser på en gång.
```

### `[strålkastare]` Strålkastare

En mening i riktigt stor text där strålkastaren tänder en fras i taget. Hela meningen syns svagt från början, så publiken ser vart du är på väg. Skriv en fras per rad.

**Undvik när:** Mer än två meningar. Då blir texten för liten.

```
[strålkastare]
etikett: Vad är en AI-agent?
- Ett system som
- uppfattar sin omgivning,
- fattar beslut
- och vidtar åtgärder.
```

### `[fokus]` Fokus

En lista i stor text där bara den aktiva raden är skarp och förklaringen fälls ut under den. De andra ligger kvar suddiga i bakgrunden.

**Undvik när:** Fler än sju rader, eller långa namn.

```
[fokus]
etikett: Tre egenskaper
rubrik: Vad gör en agent till en agent?
- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.
- Perception | Samlar in data om sin omgivning.
- Målorientering | Väljer det som bäst når målet.
```

### `[ordbild]` Ordbild

Ett enda ord i jättestor text som är fyllt med en bild som sakta panorerar. Bilden lyser också svagt i bakgrunden. Bra som avsnittsstart.

**Undvik när:** Långa rubriker och bilder utan kontrast.

```
[ordbild]
etikett: Del 2
rubrik: Miljön
text: Sex sätt att beskriva världen som agenten lever i.
```

### `[bildfält]` Bildfält

En bild som fyller två tredjedelar av ytan och tonar mjukt in i mörkret, utan kant eller ram. Text och punkter på den mörka sidan.

**Undvik när:** Mer än fyra punkter.

```
[bildfält]
etikett: Miljöer
rubrik: Olika typer av AI-miljöer
text: Miljöer kan beskrivas längs flera dimensioner.
- Vad agenten ser
- Hur världen förändras
```

### `[delning]` Delning

Två motsatser som två stora färgfält, ett mörkt och ett i accentfärg som sveper in. En tredje rad blir ett exempel uppe till höger.

**Undvik när:** Mer än två sidor. Långa texter i fälten.

```
[delning]
etikett: Dimension 1
rubrik: Hur mycket ser agenten?
- Fullständigt | Agenten ser allt som händer i miljön.
- Partiellt | Agenten ser bara en del och måste gissa resten.
- Exempel | Schack är fullständigt, poker är partiellt.
```

### `[ljustal]` Ljustal

Ett stort tal som räknas upp i glödande text. Är talet en andel, som 73 % eller 4 av 8, fylls en tjock stapel under det.

**Undvik när:** Flera tal på samma bild.

```
[ljustal]
etikett: Övningen
rubrik: Partiellt observerbara uppgifter
tal: 4 av 8
text: Poker, trafik, robotdammsugare och diagnos.
```

## Egna mallar i repot

- `[egen: numrerade-kort]` **Numrerade kort**. Tre till fyra steg eller principer med stora siffror.

## Teman

| Tema | Beskrivning |
|---|---|
| `signal` | Djup midnattsblå, elektrisk cyan och violett. Fylliga färgfält och tydlig typografi. |
| `djup` | Mörkt och djupt med mjukt ljus i ytan, korallglöd och kall turkos. Familjen Grotesk och Hanken Grotesk. Inga ramar, stora ytor och tung typografi. |
| `scen` | Systemets typsnitt. Följer ljust och mörkt läge, välj färg själv. |
| `bana` | Ljust stengrått, grafit och signalorange. Syne och Figtree, med ett fint korn i ytan. Gjort för banmallarna. |
| `nattbana` | Banmallarna i mörker: nästan svart grafit, glödande orange och kobolt, med korn. |
| `atlas` | Redaktionellt och mörkt. Kursiv serif, mono-etiketter och bärnsten. Rubriker glider fram ur en mask. |
| `natt` | Mörk och futuristisk med turkos. Sora och IBM Plex Sans. |
| `tidskrift` | Som ett fint magasin. Serif, varmt mörkt och guld. |
| `kritvit` | Vitt, svart och en röd accent. Tät, fet grotesk. |
| `klassrum` | Ljust och lättläst med Lexend. Varm orange accent. |
| `solnedgang` | Varmt och berättande. Playfair Display och Manrope. |
| `skog` | Mörkgrönt och mossa. Fraunces och Nunito Sans. |
| `retro` | Retrofuturism. Neongult och magenta på djuplila. |
