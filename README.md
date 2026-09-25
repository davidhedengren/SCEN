# Scen

Presentationer för lektioner. Du skriver innehållet som text, väljer mallar och ett tema, och Scen sköter layout, animationer och klicksteg.

- **Manus som källa.** Varje presentation är en läsbar textfil i `presentationer/`. Den går att versionshantera, jämföra och ge till Claude.
- **Mallar.** 23 mallar, från punktlistor och tabeller med facit till omröstningar, reflektion med timer och redaktionella omslag. Egna mallar skriver du i HTML och CSS.
- **Teman.** Nio visuella identiteter med egna typsnitt, färger, former och rörelser. Byt med ett klick.
- **Ingen installation.** Öppna `index.html` via en webbserver eller GitHub Pages. Inga beroenden, inget byggsteg.
- **Import från PowerPoint.** En `.pptx` blir en Scen-presentation direkt i webbläsaren.
- **Fristående filer.** Varje presentation kan sparas som en enda `.html` som spelas upp offline, med talarvy.

## Kom igång

```bash
git clone https://github.com/<ditt-namn>/scen.git
cd scen
npm start            # öppnar http://localhost:5173
```

`npm start` kör `npx serve`. Vilken statisk webbserver som helst fungerar, till exempel `python3 -m http.server`. Att dubbelklicka på `index.html` räcker inte: webbläsaren hämtar då inte presentationerna i mappen.

### Publicera med GitHub Pages

1. Pusha repot till GitHub.
2. Gå till **Settings → Pages**, välj **Deploy from a branch**, grenen `main` och mappen `/ (root)`.
3. Efter någon minut ligger Scen på `https://<ditt-namn>.github.io/scen/`.

Filen `.nojekyll` måste finnas kvar. Utan den gör GitHub om manusfilerna till webbsidor.

## Mappar

```
index.html               appen: bibliotek, redigerare och visning
src/
  engine.js, engine.css  motorn: mallar, teman, animationer, övergångar, visning
  manus.js               manusformatet och mallkatalogen
  app.js, app.css        bibliotek, redigerare, lagring, export
  pptx.js                import av PowerPoint
presentationer/          dina presentationer som manus (.md)
  index.json             listan som appen läser
bilder/                  bilder, en mapp per presentation
mallar/                  egna mallar (.json) och index.json
docs/
  MANUS.md               manusformatet
  MALLAR.md              alla mallar och teman (genereras)
  EGNA-MALLAR.md         så skriver du en egen mall
scripts/scen.mjs         kommandon: bygg, exportera, index, mallar, kolla
CLAUDE.md                instruktioner för Claude Code
.claude/skills/planera/  skill som planerar en presentation från en brief
```

## Arbetsflöde

1. **Skriv eller planera.** Skriv ett manus i `presentationer/`, eller be Claude Code: *"planera en lektion om källkritik för åk 8, 12 bilder"*. Skillen `planera` väljer mallar ur `docs/MALLAR.md` och skriver manuset.
2. **Lägg in bilder** i `bilder/<presentation>/` och peka på dem med `bild: bilder/<presentation>/fil.jpg`.
3. **Uppdatera listan:** `npm run index`.
4. **Titta och justera** i webbläsaren. I redigeraren finns knappen **Manus**, där du redigerar all text och ser resultatet direkt.
5. **Spara tillbaka.** Ändringar i webbläsaren sparas lokalt. Välj **Spara på datorn → Manus (.md)** och lägg filen i `presentationer/`. Committa.
6. **Dela.** `npm run exportera` gör en fristående `.html` per presentation i `dist/`, med bilderna inbäddade.

## Kommandon

| Kommando | Vad det gör |
|---|---|
| `npm start` | Startar en lokal server |
| `npm run index` | Uppdaterar `presentationer/index.json` och `mallar/index.json` |
| `npm run kolla` | Läser alla manus och varnar för saknade bilder och rubriker |
| `npm run exportera` | Exporterar alla presentationer till `dist/` |
| `node scripts/scen.mjs exportera presentationer/x.md` | Exporterar en presentation |
| `npm run mallar` | Skriver om `docs/MALLAR.md` från mallkatalogen |
| `npm run bygg` | Bygger `dist/scen.html`, hela appen i en fil |

## Scen i claude.ai

`dist/scen.html` kan publiceras som artefakt i claude.ai. Då sparas presentationerna i ditt Claude-konto, och knapparna för Claude (skapa presentation, ändra bild, skapa mall) blir aktiva. Mappen `presentationer/` finns inte där. Importera manus med **Importera** i stället.

Utanför claude.ai sparas det du gör i webbläsarens lagring. Det som ska vara kvar hör hemma som manus i repot.

## Tangenter vid visning

`→` eller mellanslag går vidare, `←` går tillbaka. `O` ger översikt, `N` visar anteckningar, `P` öppnar talarvyn i ett eget fönster, `F` ger helskärm, `B` svart skärm, `T` prövar nästa tema, `R` spelar bilden igen och `1–9` räknar röster i en omröstning.

## Tack

Idéerna om manus, mallkatalog, teman och planerare kommer från [Slidecraft](https://github.com/Pluggentipsar/slidecraft) av Joel Rangsjö. Fem av mallarna är gjorda direkt efter Slidecrafts mallar, se `LICENSE`.
