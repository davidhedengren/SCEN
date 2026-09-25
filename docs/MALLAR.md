# Mallar

Genererad av `node scripts/scen.mjs mallar` från `src/manus.js`. Ändra inte för hand.

Varje bild i ett manus börjar med mallens namn inom hakparentes. Samma katalog läser Claude när den planerar en presentation.

| Mall | Kategori | Syfte |
|---|---|---|
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

## Struktur

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

## Redaktionellt

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

## Egna mallar i repot

- `[egen: numrerade-kort]` **Numrerade kort**. Tre till fyra steg eller principer med stora siffror.

## Teman

| Tema | Beskrivning |
|---|---|
| `scen` | Systemets typsnitt. Följer ljust och mörkt läge, välj färg själv. |
| `atlas` | Redaktionellt och mörkt. Kursiv serif, mono-etiketter och bärnsten. Rubriker glider fram ur en mask. |
| `natt` | Mörk och futuristisk med turkos. Sora och IBM Plex Sans. |
| `tidskrift` | Som ett fint magasin. Serif, varmt mörkt och guld. |
| `kritvit` | Vitt, svart och en röd accent. Tät, fet grotesk. |
| `klassrum` | Ljust och lättläst med Lexend. Varm orange accent. |
| `solnedgang` | Varmt och berättande. Playfair Display och Manrope. |
| `skog` | Mörkgrönt och mossa. Fraunces och Nunito Sans. |
| `retro` | Retrofuturism. Neongult och magenta på djuplila. |
