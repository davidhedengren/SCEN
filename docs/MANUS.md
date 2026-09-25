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
| `tema` | `scen`, `atlas`, `natt`, `tidskrift`, `kritvit`, `klassrum`, `solnedgang`, `skog`, `retro` |
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
| `bild` | Sökväg till en bild, t.ex. `bilder/kurs/foto.jpg` |
| `alt` | Bildbeskrivning för skärmläsare |
| `band` | `ja` visar bilden som band överst (`[kort]`, `[motsats]`) |
| `bild-vänster` | `ja` byter sida på bilden |
| `vänster`, `höger` | Kolumnrubriker i `[jämförelse]`. Listan efter hamnar i den kolumnen. |
| `visa` | Tabeller: `allt`, `rader`, `facit` (sista kolumnen) eller `facit-rader` (allt utom första kolumnen) |
| `rubrikrad` | Tabeller: `nej` om första raden inte är rubriker |
| `steg` | `nej` visar allt direkt i stället för ett klick i taget |
| `tona` | `ja` tonar ner tidigare punkter |
| `övergång` | `automatisk`, `tona`, `glid`, `skjut`, `stig`, `zooma`, `svep`, `morph`, `ingen` |
| `bakgrund` | `ingen`, `vektorfält`, `nätverk`, `vågor` |
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

## Automatisk morph

När två bilder i rad har samma rubrik eller samma bild glider de mellan lägena. Samma sak gäller korten i två `[karta]` efter varandra. Använd det medvetet, till exempel en `[karta]` med `aktiv: 1`, `aktiv: 2` och så vidare som avsnittsbyten.
