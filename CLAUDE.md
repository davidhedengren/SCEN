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

## Känslan när man presenterar

En Scen-presentation ska kännas som en berättelse eller en kort dokumentär, inte som en uppsättning bilder. Den bär en fråga genom hela lektionen och landar där den började.

- **Kapitel med en röd tråd.** Dela in presentationen i kapitel med egna etiketter. Varje kapitel har en fråga eller en tanke som driver det framåt.
- **Återkommande motiv.** Plantera något tidigt och ta tillbaka det senare: en fråga som får vänta på sitt svar, en bild eller en röst från början som återkommer i slutet. Avslutningen knyter an till inledningen.
- **En miljö per kapitel.** Använd `miljö:` med ett foto eller en kort filmloop som står kvar över flera bilder, så att kapitlet får ett rum. Bilden är stämning och ska vara nedtonad, inte dekor. Be om bildprompter när miljöer saknas.
- **En tanke per bild, få ord.** En stor mening, gärna med en kort kursiv ingress ovanför. Resonemanget står i talaranteckningarna, inte på bilden.
- **Röster.** Låt människor tala med `[röster]` och `[mobil]`: elever, forskare, debattörer, en gruppchatt. Ordagranna citat får källa.
- **Rytm.** Växla mellan stora påståenden, röster, data, bilder och frågor till publiken. Lägg in pauser där publiken får tänka, till exempel en reflektion eller en fråga som får stå kvar.
- **Tema.** Temat Reportage (mörkt, varmvit text, korallröd accent, smala versaler, kursiv serif och filmkorn) passar berättande föreläsningar. Andra teman går bra, men känslan och dramaturgin ska vara densamma.
- **Låna känsla, inte form.** Hämtar vi inspiration från någon annans presentation tar vi med idéerna (berättande, miljöer, röster, rytm) men aldrig formuleringar, bilder, färger, typsnitt eller uppställningar rakt av. Resultatet ska se ut som Scen.

## Göra om en PowerPoint

- Ta inte bort delar av originalet på egen hand: bilder, ikoner, kartor, porträtt, symboler eller textrader. Lista dem i regin och fråga vad de fyller för syfte. Bestäm sedan tillsammans med läraren.
- Symbolbilder behålls. Kan en bild inte användas, till exempel av licensskäl, säg det och föreslå en prompt för en ny bild med samma motiv.
- Rätta inga sakfel utan lov. Föreslå rättelser och vänta på svar.

## Designprinciper

Behandla varje bild som en scen där publikens uppmärksamhet styrs över tid. Den centrala designfrågan är alltid: **”Vad ska publiken titta på just nu?”**

- Använd layout, typografi, kontrast, storlek, position, transparens och rörelse för att styra fokus.
- Tidigare innehåll får gärna finnas kvar som kontext, men ska tonas ned när fokus flyttas.
- Progressive disclosure och highlight/fade är centrala principer: visa, framhäv och tona ned innehåll i den ordning som bäst stödjer förståelsen.
- Animation ska ha en kommunikativ funktion. Undvik dekorativa animationer som inte hjälper publiken att följa resonemanget.
- Symboliska bilder är välkomna. En stämningsbild som bär innehållets idé, som en soluppgång för upplysningen eller en pensel för nytolkning, ger igenkänning och rytm. Det som ska undvikas är dekorativ rörelse, inte bilder.
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
