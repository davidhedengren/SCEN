# Så använder du Kunskapsgymmet och Uppgiftslabbet

En praktisk rundtur för lärarkollegor: **74 scener, 184 visningslägen och cirka 14 minuter**, plus frågor. Presentationen börjar med hela webbläsarvyer. Kameran zoomar sedan mot en inramad del medan resten tonas ned. Efter sista fokussteget går nästa klick direkt till nästa vy, utan en extra återgång till helbild.

## Visa eller redigera

- [Fristående HTML](../../dist/kunskapsgymmet-och-uppgiftslabbet.html): cirka 38 MiB, med inbäddade bilder, tre filmer, spelare och typsnitt.
- [SCEN-manus](../../presentationer/kunskapsgymmet-och-uppgiftslabbet.md): innehåll, fokusområden och talaranteckningar.
- I SCEN-biblioteket: **Kollegial utveckling → Så använder du Kunskapsgymmet och Uppgiftslabbet**.
- Både den vanliga webbappen och den inbakade appen `scen.html` är uppdaterade.

Högerpil går framåt ett klick i taget. Vänsterpil går tillbaka. **N** visar anteckningar, **P** öppnar talarvyn och **F** växlar helskärm. Låt filmerna spela klart innan nästa klick; de stannar på sista rutan. Vid bakåtsteg återställs filmen så att den kan visas igen.

## Arbetsmoment

| Scener | Visar |
| --- | --- |
| 1–11 | Elevens enklaste väg: startsida utan tilldelat pass, kurs → kapitel → område → uppgift, ledtråd, kontroll och lösning |
| 12–22 | Först därefter mer stöd: genomgång, personlig tränare, passval och uppdragsbok |
| 23–33 | Topplistor, miniräknare, formelblad och hur ett tilldelat lärarpass visas |
| 34–46 | Tydligt rollbyte till lärare: grupper, pass till en/flera/hela gruppen och delning med eleverna |
| 47–59 | Passresultat, individuell statistik, möjlighet till riktat elevpass och gruppens områdesstatistik |
| 60–67 | Tydligt verktygsbyte till Uppgiftslabbet: lärarens material, uppgiftsbank, fyra drag och dokumentlayout |
| 68–74 | Uppgiftsredigering, delning med kollegor, biblioteket och avslutning |

De tre inspelningarna visar faktisk svarskontroll med XP-animation (cirka fyra sekunder), fyra separata drag till ett övningsblad (cirka tolv sekunder) och knappen Redigera som öppnar dokumentet (cirka tre sekunder). De är ljudlösa och startar på presentatörens klick.

Varje byte av meny eller vy föregås av en markering av knappen i den föregående sidan. Även återvägar som Klar och Avbryt visas. Uppdragsbokens stängningssteg är borttaget enligt önskemål. Byte från elev till lärarkonto och från Kunskapsgymmet till Uppgiftslabbet anges uttryckligen.

Lärarpasset heter **Inför Prov v.48** och har datum 27 november 2026. Övningsbladet i Uppgiftslabbet heter fortfarande **Energi i vardagen**. Den personliga tränaren förklaras på scenerna och i talaranteckningarna: rekommenderat pass, valda kapitel och alternativen i Byt pass.

Elevexemplet är den befintliga uppgiften **3.242**, ett s–t-diagram där läget ökar från 4 m till 25 m under 6 s. Hastigheten är `(25 − 4) / (6 − 0) = 3,5 m/s`. Den befintliga ledtråden uppmärksammar att startläget inte är noll. Den fullständiga lösningen visar beräkningen och förklarar varför slutläget 25 m inte ska delas direkt med tiden.

Den första uppgiften startas direkt från områdeskortet **s–t-diagram**, utan att använda personlig tränare eller tilldelat pass. Genomgången **Läs ett läge–tid-diagram** kommer i nästa avsnitt som ett möjligt stöd för eleven. Den är den femte av sex i Rörelse (`fy1-grund-3-07`). Samma lutningsmetod förklaras med en annan graf, 8 m på 4 s. Knappen Träna det här visas som en möjlighet att fortsätta med samma metod; i demonstrationen stängs genomgången och vi går vidare till den personliga tränaren.

Det tilldelade passet **Inför Prov v.48** visas först i slutet av elevens fördjupning. Därefter byter presentationen uttryckligen till lärarkontot och visar hur sådana pass skapas och följs upp. Övergången till Uppgiftslabbet är ett eget avsnitt som förklarar att verktyget här används för lärarens undervisningsmaterial och samarbete med kollegor.

Inget uppgifts- eller genomgångsinnehåll ersätts i appen. Fångsten använder bankens befintliga text, diagram, ledtråd och lösning. Eleven använder ledtråden före kontrollen; inspelningen visar appens faktiska belöning **+4 XP**, med total XP från 560 till 564. Topplistebilderna har tagits om med samma XP-läge.

## Bilder och demonstrationsdata

Underlaget är hela 16:9-webbläsarvyer, fotograferade vid 1600 × 900 med dubbel pixeltäthet. Inga urklippta detaljbilder används i den ombyggda presentationen. Kameran, ramen och nedtoningen utförs av SCEN under visningen. På långa sidor finns olika scrollpositioner; sidornas verkliga menyer och omgivning finns kvar. Inspelningarnas första rutor används som deras grundbilder.

Källor den 15–16 oktober 2026:

| Repository | Git HEAD vid fotograferingen |
| --- | --- |
| Kunskapsgymmet | `6f702503637fc3af68d24ff6b1e350eb6f2a6dbb` samt den lokala ändringen för träningspassens elevval; s–t-momentet fotograferat från `59194db` |
| Uppgiftslabbet | `859b53892c5bb0cd5e94418701be38aa247ea85a` |

Gränssnitten är verkliga lokala kopior. Konton, grupper, pass, topplistor och resultat är fiktiva demonstrationer. Inga riktiga elevuppgifter hämtas och inga inbjudningar skickas. Skärmbildsskripten serverar apparnas publika adresser från lokala kopior, blockerar Supabase och ersätter tjänsteanrop med lokala svar. Svarskontroll, XP-animation, dragning och öppning av dokumentet körs däremot av apparnas egna funktioner. Pekarmarkören i filmerna är ett presentationshjälpmedel ovanpå den verkliga pekarrörelsen.

Uppskattad behärskning, andel rätt, genomförande och XP förklaras som olika mått. Historiekortet är märkt under uppbyggnad. Delning visas för ett fiktivt godkänt lärarkonto. PDF- och Word-knapparna visas, men exportfunktionerna har inte testats i detta presentationsarbete.

Elevvalet är implementerat i Kunskapsgymmets riktiga formulär, medan databassvaren i fotograferingen är lokala fixtures. Produktionsaktivering kräver Kunskapsgymmets `sql/2026-10-16-traningspass-elevval.sql`; se dess `docs/traningspass-elevval.md`. En Git-publicering av presentationen aktiverar inte databasfunktionen.

## Kamera och manus

Presentationens bildvandringar använder `textband: kompakt` och `maxzoom: 1.65`. Rubriketiketten täcker en mindre del av sidan, överflödig ingresstext är borttagen och fokus behåller mer av sidans omgivning. Övriga presentationer behåller sina tidigare standardvärden.

Det återanvändbara läget är **Bildregi → Vandring: zoom och markering** (`bildläge: vandring`). Se [BILDREGI.md](../BILDREGI.md). Det fungerar även för kartor, diagram, dokument och andra bildmotiv. Målområdenas koordinater står i manuset och kan ändras oberoende av motor och bildfiler.

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
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture-support.py
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture-recipients.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/.onboarding/playwright PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture-learning-flow.py
```

Det skriver över underlaget i `bilder/verktygspresentation/vandring/`. `regions.json` innehåller uppmätta komponentpositioner som stöd för redigering av manuset. Uppdatera manusets målområden om appens layout ändras. Skriptet är anpassat för denna molnmiljös sökvägar och Playwright-version. Bibliotek och typsnitt hämtas från `cdn.jsdelivr.net` och cachas under `/workspace/.onboarding/cache`.

## Verifiering

Samtliga 74 scener och 184 visningslägen är kontrollerade i SCEN vid 1920 × 1080: bilder laddas, filmer spelas till slutet, ramar håller sig på skärmen, direktövergången från sista fokus till nästa vy fungerar och inga JavaScript-fel eller externa nätverksanrop registreras. Dessutom kontrolleras kamera och filmer i Djup och Klassrum vid 1280 × 720, med reducerad rörelse, bakåtsteg, statiskt läge och byte av scen.

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
