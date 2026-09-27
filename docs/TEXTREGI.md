# SCEN Textregi

Textregi behandlar terminal, kod och typografi som dramaturgiskt material. Varje klick ska motsvara en förändring i betydelse, fokus eller berättelse — inte bara en ny textyta.

Grundprincipen är densamma som för Tidslinje och Bildregi:

> Kontexten finns kvar. Fokus vandrar. Relationer blir synliga. Helheten återvänder.

Principen används olika beroende på scen. Kodförklaring återställer helheten efter fokusrörelsen. Terminalen bygger i stället ett bestående körprotokoll. Typografiska sekvenser landar i ett avsiktligt slutpåstående utan ett artificiellt restore-klick.

## Fyra mallar

| Mall | Dramaturgi |
|---|---|
| `[terminal]` | Prompt/kommando → output → resultat/fel → nästa steg. Kommandon kan skrivas fram; befintlig text skrivs inte om. |
| `[kodförklaring]` | Helt kodblock → rad/token-fokus → annotation/resultat → nästa fokus → restore. Kodens geometri är stabil. |
| `[typografi]` | Ett stort statement ersätts eller preciseras i kommunikativa steg. |
| `[texttempo]` | Typografisk uppbyggnad, kontrast, precisering och slutsats med avsiktlig pacing. |

## Terminal

Varje listpunkt använder:

```text
roll | innehåll | annotation
```

Tillåtna roller är `prompt`, `kommando`, `output`, `fel`, `success`, `fokus` och `annotation`. Engelska rollnamn (`command`, `error`, `focus`) normaliseras till samma semantik.

```text
[terminal]
etikett: TERMINAL NARRATIVE / RELEASE 02
rubrik: Från kommando till bevis
- kommando | npm run bygg | Kommandot skrivs fram eftersom någon faktiskt skriver det.
- output | dist/scen.html 426 kB | Artefakten finns nu.
- success | ✓ 8 presentationer inbakade | Resultatet får fokus.
- kommando | git status --short | Nästa kommando ställer en ny fråga.
- output | (ingen output) | Tystnaden betyder att arbetsytan är ren.
```

Bara rollen `kommando` använder typewriter, och endast när `rörelse` inte är `ingen`. Alla roller har egna `data-semantic-role`-värden så att visuell representation kan bytas utan att innehållet ändras.

## Kodförklaring

Koden skrivs i `text`. Fortsättningsrader behåller indrag. Varje listpunkt använder:

```text
radnummer | token | annotation | resultat
```

```text
[kodförklaring]
etikett: CODE EXPLANATION / REDUCER
rubrik: En rad förändrar tillståndet
text: const total = values.reduce((sum, value) => {
  const next = sum + value;
  return next;
}, 0);
- 1 | reduce | Reduce håller ihop förloppet. | En lista blir ett värde.
- 2 | sum + value | Här sker förändringen. | 12 + 5 blir 17.
- 3 | return next | Tillståndet skickas vidare. | Nästa varv börjar med 17.
```

Radnumret är 1-baserat. Token är valfri men bör vara en exakt del av raden. Under fokus ligger hela blocket kvar i samma position; övriga rader tonas ned och annotationen kopplas till den aktiva raden. Ett sista restore-klick återställer kodblocket.

## Typografiskt statement och tempo

Varje listpunkt använder:

```text
roll | formulering | liten stegetikett
```

Roller som `statement`, `fråga`, `svar`, `fokus`, `ersättning`, `kontrast`, `paus`, `precisering` och `slutsats` beskriver stegets kommunikativa funktion.

```text
[typografi]
etikett: TYPOGRAPHIC STATEMENT
- statement | Vi bygger inte fler bilder. | Utgångspunkt
- fokus | **Vi regisserar uppmärksamhet.** | Fokus
- precisering | En presentation är inte en fil.\\n**Den är en följd av beslut.** | Precisering
```

```text
[texttempo]
etikett: TYPOGRAPHIC PACING
- statement | AI kan lösa uppgiften. | Påstående
- kontrast | AI kan lösa uppgiften.\\n**Men inte på det sätt vi tänkte.** | Kontrast
- precisering | Därför förändras lärarens roll. | Precisering
- slutsats | **Från svarsgivare**\\ntill regissör av tänkande. | Slutsats
```

Använd `**...**` för det ord eller den fras som bär stegets kontrast. `\\n` ger en avsiktlig radbrytning i listvärdet. En enkel backslash bevaras bokstavligt, så exempelvis `C:\new\file.txt` förblir en Windows-sökväg. Textstorleken anpassas i tre semantiska längdklasser, men scenens position och visuella axel förblir stabila.

## Generella primitives

- `Scen.normalizeTextDirection(slide)` normaliserar roller och strukturerade listposter utan att känna till demonstrationsinnehåll.
- `Scen.dramaturgyTarget(...)` skiljer ett klicks **cue** från den semantiska **target** som ska få fokus. Samma target kan representeras av kodrad, token, annotation eller typografiskt tillstånd.
- `Scen.applyDramaturgy(...)` använder fortfarande de gemensamma tillstånden `overview`, `focus` och `restored`.
- `data-dramaturgy-cue` beskriver klicksekvensen; `data-dramaturgy-target` beskriver de visuella bärare som påverkas.
- `data-dramaturgy-reveal="progressive"` håller framtida terminalrader dolda samtidigt som tidigare output ligger kvar som kontext.
- `data-semantic-role` håller isär innehåll, semantisk roll, dramaturgiskt tillstånd och CSS-representation.

## Motion och statiska vyer

`rörelse: ingen` och `prefers-reduced-motion` bevarar exakt samma klick, fokus och slutläge men tar bort typewriter och CSS-övergångar. Kommandon känns fortfarande igen genom prompt, roll och typografi.

Statiska thumbnails visar:

- terminalens fullständiga protokoll,
- kodblocket återställt som helhet,
- typografiska sekvensens avsiktliga slutformulering.

## Demo och QA

Starta från projektroten:

```bash
npm start
```

Öppna sedan `demo/textregi-pilot.html`. Demon har scen-, tema- och rörelsekontroller samt framåt, bakåt och omstart.

Fokuserade kontroller:

```bash
npm run test:textregi
npm run test:textregi:browser
```

Browser-QA täcker båda temafamiljerna, framåt/bakåt, restore och designade slutlägen, kort/lång text, långa kodrader, 16:9-overflow, `rörelse: ingen`, `prefers-reduced-motion` och statiska thumbnails.
