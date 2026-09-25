# Scen – instruktioner för Claude

Scen är ett presentationssystem för lärare. Presentationer är manus (textfiler) i `presentationer/`, mallar och teman finns i `src/`. Allt är vanlig JavaScript utan beroenden och byggsteg.

## Språk

Allt användaren ser är på svenska: manus, mallnamn, knappar, felmeddelanden, dokumentation. Skriv enkelt och konkret.

## Filer

- `src/engine.js` – motorn. `renderSlide()` gör HTML för varje mall, `player()` sköter visning, steg, övergångar och bakgrunder. `THEMES` innehåller teman. Samma fil bäddas in i exporterade presentationer, så den får inte bero på appen.
- `src/engine.css` – utseendet för alla mallar. Allt ligger under `.scen` och använder temats CSS-variabler.
- `src/manus.js` – manusformatet (`parse`, `stringify`) och `CATALOG`, mallkatalogen som både människor och Claude läser.
- `src/app.js` – bibliotek, redigerare, lagring, import och export, Claude-funktioner i claude.ai.
- `presentationer/*.md` – manus. `presentationer/index.json` listar dem (uppdateras med `npm run index`).
- `mallar/*.json` – egna mallar i HTML och CSS, se `docs/EGNA-MALLAR.md`.
- `docs/MALLAR.md` – genereras från `CATALOG`. Redigera inte för hand.

## Skriva en presentation

Läs `docs/MANUS.md` och `docs/MALLAR.md`. Använd skillen `planera`. Kör `npm run kolla` efteråt.

- En idé per bild. Rubriker under 70 tecken, punkter under 90.
- Variera mallarna. Ta med en interaktiv bild (`[omröstning]`, `[reflektion]` eller `[fråga]`) ungefär var åttonde bild.
- Hitta aldrig på statistik, citat, årtal eller källor. Saknas underlag: skriv förslag i talaranteckningar i stället.
- Bilder ligger i `bilder/<presentation>/`. Saknas bild: skriv `> Bildförslag: …` i anteckningen.

## Lägga till en inbyggd mall

Gör alla sex stegen, annars syns mallen inte överallt:

1. `src/engine.js`: lägg till namnet i `LAYOUTS` och ett `case` i `renderSlide()`. Använd `st()` för klicksteg, `A()` för animation och `tA()` för rubrikens animation så att temat styr.
2. `src/engine.css`: stilar under `.scen [data-layout="namn"]`. Bara temavariabler, inga hårdkodade färger.
3. `src/manus.js`: manusnamnet i `TAGS`, listfältet i `LIST_FIELD`, `STEPPED` om den har klicksteg, och en post i `CATALOG` med `syfte`, `undvik` och ett fungerande `ex`.
4. `src/app.js`: fälten i `FIELDS`, standardinnehåll i `DEFAULTS`, en liten skiss i `WF`.
5. Kör `npm run mallar` och `npm run kolla`.
6. Öppna appen och kontrollera mallen i minst ett ljust och ett mörkt tema, både i miniatyr och vid visning med alla klicksteg.

## Kontroll

- `npm run kolla` ska gå igenom.
- `node scripts/scen.mjs bygg` får inte ge fel. Ingen fil i `src/` får innehålla texten `</script`.
- Manus → presentation → manus ska ge samma text (`Manus.stringify(Manus.parse(x))`).
