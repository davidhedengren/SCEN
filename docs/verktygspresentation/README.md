# Så använder du Kunskapsgymmet och Uppgiftslabbet

En praktisk rundtur för lärarkollegor: **28 scener, 99 visningslägen och cirka 13 minuter**, plus frågor. Presentationen börjar med hela webbläsarvyer. Kameran zoomar sedan mot en inramad del medan resten tonas ned. Sista klicket i varje vandringsscen återställer helheten.

## Visa eller redigera

- [Fristående HTML](../../dist/kunskapsgymmet-och-uppgiftslabbet.html): cirka 16 MB, med inbäddade bilder, tre filmer, spelare och typsnitt.
- [SCEN-manus](../../presentationer/kunskapsgymmet-och-uppgiftslabbet.md): innehåll, fokusområden och talaranteckningar.
- I SCEN-biblioteket: **Kollegial utveckling → Så använder du Kunskapsgymmet och Uppgiftslabbet**.
- Både den vanliga webbappen och den inbakade appen `scen.html` är uppdaterade.

Högerpil går framåt ett klick i taget. Vänsterpil går tillbaka. **N** visar anteckningar, **P** öppnar talarvyn och **F** växlar helskärm. Låt filmerna spela klart innan nästa klick; de stannar på sista rutan. Vid bakåtsteg återställs filmen så att den kan visas igen.

## Arbetsmoment

| Scener | Visar |
| --- | --- |
| 1–5 | Elevens startsida, matematik- och fysikkurser, kurssida och uppdragsbok |
| 6–9 | Uppgift, svarskontroll i rörelse, XP-ökning och lösning |
| 10–12 | Elevtopplista, klasstopplista och en kort publikfråga |
| 13–17 | Min undervisning, grupp, passinställningar, områden, kod och länk |
| 18–20 | Resultat per område och elev, behärskning och nästa träningspass |
| 21–24 | Banken, fyra riktiga drag till bladet, Redigera och dokumentlayout |
| 25–28 | Uppgiftsredigering, delning med kollegor, sparat material och avslutande fråga |

De tre inspelningarna visar faktisk svarskontroll med XP-animation (cirka fem sekunder), fyra separata drag till ett övningsblad (cirka tolv sekunder) och knappen Redigera som öppnar dokumentet (cirka tre sekunder). De är ljudlösa och startar på presentatörens klick.

## Bilder och demonstrationsdata

Underlaget är hela 16:9-webbläsarvyer, fotograferade vid 1600 × 900 med dubbel pixeltäthet. Inga urklippta detaljbilder används i den ombyggda presentationen. Kameran, ramen och nedtoningen utförs av SCEN under visningen. På långa sidor finns olika scrollpositioner; sidornas verkliga menyer och omgivning finns kvar. Inspelningarnas första rutor används som deras grundbilder.

Källor den 15 oktober 2026:

| Repository | Git HEAD vid fotograferingen |
| --- | --- |
| Kunskapsgymmet | `6f702503637fc3af68d24ff6b1e350eb6f2a6dbb` |
| Uppgiftslabbet | `859b53892c5bb0cd5e94418701be38aa247ea85a` |

Gränssnitten är verkliga lokala kopior. Konton, grupper, pass, topplistor och resultat är fiktiva demonstrationer. Inga riktiga elevuppgifter hämtas och inga inbjudningar skickas. Skärmbildsskripten serverar apparnas publika adresser från lokala kopior, blockerar Supabase och ersätter tjänsteanrop med lokala svar. Svarskontroll, XP-animation, dragning och öppning av dokumentet körs däremot av apparnas egna funktioner. Pekarmarkören i filmerna är ett presentationshjälpmedel ovanpå den verkliga pekarrörelsen.

Uppskattad behärskning, andel rätt, genomförande och XP förklaras som olika mått. Historiekortet är märkt under uppbyggnad. Delning visas för ett fiktivt godkänt lärarkonto. PDF- och Word-knapparna visas, men exportfunktionerna har inte testats i detta presentationsarbete.

## Kamera och manus

Det nya återanvändbara läget är **Bildregi → Vandring: zoom och markering** (`bildläge: vandring`). Se [BILDREGI.md](../BILDREGI.md). Det fungerar även för kartor, diagram, dokument och andra bildmotiv. Målområdenas koordinater står i manuset och kan ändras oberoende av motor och bildfiler.

## Bygg om

Från SCEN-repot:

```sh
node scripts/scen.mjs kolla
node scripts/scen.mjs bygg
node scripts/scen.mjs exportera presentationer/kunskapsgymmet-och-uppgiftslabbet.md
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/package.py
```

Paketeringen bäddar in Familjen Grotesk och Hanken Grotesk från Fontsource 5.3.0, inklusive OFL-licenserna i denna mapp. Det steget behövs efter varje ny standardexport för att bevara externa typsnitt som inbäddade data.

För nya bilder och filmer behövs Python Playwright, Chromium-wrappern `/workspace/.onboarding/bin/chromium-cloud`, systemets FFmpeg samt lokala HTTP-servrar: SCEN på 5173, Uppgiftslabbet på 8082 och Kunskapsgymmet på 8083. I denna miljö används systemets FFmpeg även av Playwright:

```sh
mkdir -p /workspace/.onboarding/playwright/ffmpeg-1011
ln -sf /usr/bin/ffmpeg /workspace/.onboarding/playwright/ffmpeg-1011/ffmpeg-linux
PLAYWRIGHT_BROWSERS_PATH=/workspace/.onboarding/playwright PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture-tour.py
```

Det skriver över underlaget i `bilder/verktygspresentation/vandring/`. `regions.json` innehåller uppmätta komponentpositioner som stöd för redigering av manuset. Uppdatera manusets målområden om appens layout ändras. Skriptet är anpassat för denna molnmiljös sökvägar och Playwright-version. Bibliotek och typsnitt hämtas från `cdn.jsdelivr.net` och cachas under `/workspace/.onboarding/cache`.

## Verifiering

Samtliga 28 scener och 99 visningslägen kontrolleras i SCEN vid 1920 × 1080: bilder laddas, filmer spelas till slutet, ramar håller sig på skärmen, återställning fungerar och inga JavaScript-fel eller externa nätverksanrop registreras. Dessutom kontrolleras kamera och filmer i Djup och Klassrum vid 1280 × 720, med reducerad rörelse, bakåtsteg, statiskt läge och byte av scen.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/review.py
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/check-camera.py
npm run kolla
npm run test:inlasning
npm run test:bildregi
npm run test:film
npm run test:bildsteg
```

Granskningsbilder och rapport finns under `/workspace/.onboarding/presentation-review/` utanför repot. Relevant automatisk verifiering kompletteras med visuell granskning av målområdena. Hela SCEN:s `npm test` har sedan tidigare ett känt fel i `scripts/check-editorial.cjs:9` (4 steg jämfört med förväntade 3), även beskrivet i `docs/BILDREGI.md`. Det felet har inte ändrats för detta arbete.
