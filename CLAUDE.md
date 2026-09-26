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

## Designprinciper

Behandla varje bild som en scen där publikens uppmärksamhet styrs över tid. Den centrala designfrågan är alltid: **”Vad ska publiken titta på just nu?”**

- Använd layout, typografi, kontrast, storlek, position, transparens och rörelse för att styra fokus.
- Tidigare innehåll får gärna finnas kvar som kontext, men ska tonas ned när fokus flyttas.
- Progressive disclosure och highlight/fade är centrala principer: visa, framhäv och tona ned innehåll i den ordning som bäst stödjer förståelsen.
- Animation ska ha en kommunikativ funktion. Undvik dekorativa animationer som inte hjälper publiken att följa resonemanget.
- Undvik generiska layouter av typen ”rubrik + kort + bullets”. Utgå i stället från bildens kommunikativa uppgift.
- Kvalitet går före kvantitet. Lägg hellre till en genomarbetad mall än flera svaga eller överlappande varianter.
- Scenen ska vara begriplig även utan animation. Rörelsen ska förstärka strukturen, inte bära hela betydelsen.

## Återanvändbara mallar

En Scen-mall ska vara en generell, återanvändbar presentationsstruktur. Den får inte vara hårdkodad för en specifik presentation, lektion, kurs eller ett specifikt ämne.

Håll isär:

- **Strukturell mallogik** – informationshierarki, placering, steg och fokusförflyttning.
- **Visuellt tema** – färger, typsnitt, former, ytor och rörelsekaraktär.
- **Presentationsspecifikt innehåll** – rubriker, text, data, bilder, exempel och ämnesspråk.

En mall ska kunna användas i historia, religion, samhällskunskap, svenska, språk, matematik, fysik, kemi, biologi, teknik, AI och vanliga professionella presentationer utan att mallkoden behöver ändras.

Sträva efter mallfamiljer baserade på kommunikativ funktion, exempelvis:

- Fokus
- Fråga
- Påstående
- Jämförelse
- Före/efter
- Tidslinje
- Process
- Orsak och konsekvens
- Perspektiv
- Argumentation
- Citat och tolkning
- Bildanalys
- Källanalys
- Begreppsförklaring
- System
- Hierarki
- Stegvis lösning
- Sammanfattning
- Syntes

### Före implementation av en ny mall

Beskriv kort:

1. Mallens syfte.
2. När den bör användas.
3. Hur den skiljer sig från befintliga mallar.
4. Hur fokus förändras över tid.
5. Vilka innehållstyper den stödjer.
6. Hur återanvändbar den är.

Använd kontrollfrågan: **”Kan denna mall användas i minst fem tydligt olika typer av presentationer utan att mallkoden behöver ändras?”** Om svaret är nej ska konceptet generaliseras före implementation.

### Efter implementation av en ny mall

Kontrollera:

- korta och långa rubriker
- olika mängd innehåll
- att inget överlappar
- kontrast och läsbarhet
- highlight/fade
- animationernas kommunikativa funktion
- att scenen fungerar även utan animation
- 16:9-layout
- att befintliga presentationer inte går sönder
- projektets tester

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
