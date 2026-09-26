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
| `bild` | Sökväg till en bild, t.ex. `bilder/kurs/foto.jpg` |
| `alt` | Bildbeskrivning för skärmläsare |
| `band` | `ja` visar bilden som band överst (`[kort]`, `[motsats]`) |
| `bild-vänster` | `ja` byter sida på bilden |
| `vänster`, `höger` | Kolumnrubriker i `[jämförelse]`. Listan efter hamnar i den kolumnen. |
| `visa` | Tabeller: `allt`, `rader`, `facit` (sista kolumnen) eller `facit-rader` (allt utom första kolumnen) |
| `rubrikrad` | Tabeller: `nej` om första raden inte är rubriker |
| `steg` | `nej` visar allt direkt i stället för ett klick i taget |
| `tona` | `ja` tonar ner tidigare punkter |
| `övergång` | `automatisk`, `båge`, `tona`, `glid`, `skjut`, `stig`, `zooma`, `svep`, `morph`, `ingen` |
| `bakgrund` | `ingen`, `banor`, `vektorfält`, `nätverk`, `vågor` |
| `rubrikrörelse`, `rörelse` | `mask`, `ord för ord`, `skärpa`, `stig`, `tona`, `skrivmaskin`, `svep`, `ingen` |

### Listor med två delar

Kort, tidslinje, karta, triad, motsats, samtal och två tal använder `- rubrik | text`:

```
[motsats]
rubrik: Statisk eller dynamisk?
- Statisk | Förändras bara när agenten agerar.
- Dynamisk | Förändras hela tiden.
- Exempel | Schack är statiskt, trafiken är dynamisk.
```

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
