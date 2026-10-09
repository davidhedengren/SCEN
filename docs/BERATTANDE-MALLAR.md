# Berättande mallar: Ett beslut i korsningen

Öppna **Ett beslut i korsningen** under **Scen · Berättande mallar** i biblioteket. En fristående version finns i `dist/ett-beslut-i-korsningen.html` och kan öppnas direkt utan server. Använd högerpil eller klick för nästa steg, vänsterpil för att gå tillbaka och N för talaranteckningar.

Presentationens fem avsnitt använder samma korsningsbild. Fyra egna mallar visar olika sätt att rikta uppmärksamheten. De finns under **Mallar** i appen och kan användas i andra presentationer. Manus: `presentationer/ett-beslut-i-korsningen.md`.

## Mallarna

| Mall | Syfte och användning | Skillnad och fokusförlopp | Innehåll |
|---|---|---|---|
| `[egen: genomlysning]` | Synliggör informationslager och sådant som behöver tolkas i ett gemensamt motiv. | Ett begreppsligt lager lyfts per klick; de andra ligger kvar. Slutet visar alla. Till skillnad från Bildregis detaljmarkeringar är lagren schematiska och pekar inte ut exakta koordinater. | Bild, valfri rubrik och ingress, 2–4 poster `lager \| förklaring`, slutsats i `svar`. |
| `[egen: omformning]` | Kopplar konkreta observationer till en abstrakt modell. | Samma textobjekt flyttar från ett utspritt läge till en ordnad följd och visar sin begreppsetikett. Det är en omorganisation av innehåll, inte en inzoomning. | Bild, 2–4 poster `observation \| begrepp`, slutsats i `svar`. |
| `[egen: tva-forlopp]` | Jämför två uttryckligen beskrivna händelsekedjor från samma start. | Fokus följer först den övre banan och sedan den undre, till sist båda. Till skillnad från Vägval jämförs förloppen över tid. Heldragen respektive streckad bana skiljer dem även utan färg. | Utgångsläge i `text`; exakt 4 poster: val/händelse och följd för bana A, därefter val/händelse och följd för bana B. Varje post är `rubrik \| förklaring`. |
| `[egen: aterkomst]` | Besvarar en tidigare fråga genom att återvända till dess motiv. | Insikterna tänds en efter en över den välbekanta bilden. Slutet förenar dem med slutsatsen. Använd samma bild som i öppningen. | Bild, 2–4 poster `insikt \| förklaring`, sammanfattning i `svar`. |

Mallarna är allmänna: använd dem för historia (källbild → tolkning), biologi (organism → funktion), teknik (apparat → mekanism), svenska (iakttagelser → argument) eller AI (observation → beslut). Bild, ämnesord och påståenden kommer från presentationens manus; de finns inte i mallkoden.

Sikta på korta rubriker och förklaringar som ryms i två eller tre rader. Omformningens begrepp bör vara korta. Mallarna anpassar färger och typsnitt till presentationens tema. De fungerar utan rubrik. `steg: nej` visar det samlade innehållet direkt; `rörelse: ingen` och systemets reducerade rörelse stänger av förflyttningarna.

## Så fortsätter berättelsen mellan avsnitten

Använd samma `bild:` och `övergång: morph` i angränsande avsnitt. Bildens identitet följer med genom övergången. Den befintliga motorn behåller fortfarande separata avsnitt och deras klicksteg; den här presentationen demonstrerar en visuell sammanhållning ovanpå det formatet. Objektrörelsen i Omformning sker inom samma avsnitt.

Egna mallar får tre nya platshållare: `{{bildid}}` för bildens stabila övergångsidentitet, `{{alt}}` för en säker bildbeskrivning och `{{slutsteg}}` för ett avslutande klick efter listan. Mallarna använder vanliga Scen-klicksteg, temavariabler och CSS, utan egen JavaScript-kod.

## Bilder

Exemplet använder den befintliga `bilder/ai-agenter-miljoer/korsning.jpg`. Inga nya bilder behöver genereras. Informationslagren är schematiska; bilden används inte som påstådda sensordata. En framtida övergång till en fotorealistisk sensorvy behöver två bilder med exakt samma kameravinkel och objektplacering. Den befintliga separata sensorbilden används därför inte i denna sekvens.

## Kontroller

Exemplet har kontrollerats i Chromium: klick framåt och bakåt, teman Signal och Klassrum, korta och längre texter, mallarnas dokumenterade listlängder, rubriklöst innehåll, statisk visning, reducerad rörelse och miniatyrer. Inläsning från biblioteket, kopiering till redigeraren och bildbeskrivningarnas escaping har också kontrollerats. Både den fristående exporten och den inbakade appen har renderats utan nätåtkomst, med bilder och mallar inkluderade.

Bygg, manusrundtur och kontroller för mallar, bildregi, textregi, signaturer och elevexport har passerat. `npm run kolla` tillåter nu rubriklösa bilder enligt användarens instruktion och godkänner samtliga manus.

## Byt antagande och fallvisning

Den senare visuella omarbetningen av **AI-agenter och miljöer** lägger till en femte berättande mall. `[egen: byt-antagande]` behåller ett gemensamt fall medan en förutsättning ändras. Till skillnad från Prövning ändras villkoret mellan bedömningarna. Varje post skrivs `antagande | bedömning | motivering`: ett klick visar antagandet, nästa visar svaret. Slutet jämför två eller tre antaganden. Bild, rubrik, sammanhang i `text` och slutsats i `svar` är valfria.

Mallen passar AI (tillgång till information), matematik (definitionsområde), fysik (friktion), historia (källans avsändare), samhällskunskap (budgetantaganden) och svenska (berättarperspektiv). Allt ämnesinnehåll kommer från manuset. Med ett fjärde fält `vy: x y bredd höjd` kan antagandet få ett synfält i procent av den gemensamma bildytan. I labyrintexemplet döljs informationen utanför området kring agenten när det andra antagandet visas. Diagrammet och agenten flyttar sig inte; slutet återställer hela kartan.

Den befintliga tabellmallen har fått `visa: fall`. Första kolumnen anger fallet och övriga kolumnrubriker blir frågor. Svaren är dolda före sitt klick. Nästa klick byter till nästa fall med dolda svar, och sista klicket visar hela tabellen. Det fungerar bäst med högst åtta fall och sex svarskolumner. Samma tabellvärden används i båda vyerna. `steg: nej` och miniatyrer visar hela tabellen.

Originalpresentationen innehåller nu 21 bilder. De tidigare 20 bildernas formuleringar, svar och talaranteckningar är bevarade. Bild 4 använder den genererade `sensorvy-korsning.png`, med markeringar i Scen. Bild 7 använder Lexikon för fokusväxling mellan samma begrepp. Sammanfattningen har mindre rubriktypografi och tonar ned texten när ett detaljområde lyfts. Labyrintexemplet har lagts till före övningen.

Den nya mallen och fallvisningen har kontrollerats i Chromium i Natt och Klassrum: varje fråga före sitt svar, framåt/bakåt, statiskt läge, reducerad rörelse, miniatyrer och längre texter. Innehåll från inaktiva bilder ska förbli dolt. `npm run test:berattande` kontrollerar fallvisningens steg, tabellvärden, manusrundtur och escaping.

Den fullständiga `npm test` stannar fortfarande på det sedan tidigare konstaterade felet i `check-editorial.cjs`: testet väntar tre steg men den befintliga Etapper-mallen har fyra inklusive återställningen. De separata kontrollerna för mallar, tidslinje, bildregi, textregi, bro och elevexport passerar. Befintliga tester som använder Chromium `--dump-dom` har miljöproblem i denna container; den visuella kontrollen av ändringarna kördes med Playwright.
