# Från uppgift till nästa steg

En presentation av **Kunskapsgymmet och Uppgiftslabbet** för lärarkollegor. 19 scener, 39 visningslägen och talaranteckningar för cirka **14 minuter**. Exemplet *Energi i vardagen* binder ihop elevens träning, lärarens uppföljning och arbetet med uppgiftsmaterial.

## Visa eller redigera

- [Fristående HTML](../../dist/kunskapsgymmet-och-uppgiftslabbet.html): ladda ned och öppna i en modern webbläsare. Bilder, typsnitt, mallar och spelare är inbäddade.
- [SCEN-manus](../../presentationer/kunskapsgymmet-och-uppgiftslabbet.md): redigera innehåll och talaranteckningar här.
- I SCEN:s vanliga `index.html` finns presentationen under **Kollegial utveckling**. Välj **Spela**, eller **Gör en egen kopia** för att redigera i SCEN.

Högerpil går framåt ett klick i taget; vänsterpil går tillbaka. **N** visar anteckningar, **P** öppnar talarvyn och **F** växlar helskärm. På scenerna med inzoomning går sista klicket tillbaka till översikten. Repetera gärna med projektorn före visningen.

Den separata, sedan tidigare inbakade appfilen `scen.html` har inte byggts om. Använd den nya exporten eller biblioteket i `index.html` för denna presentation.

## Berättelsen

| Scener | Innehåll | Ungefärlig tid |
| --- | --- | --- |
| 1–2 | Verktygens roller och det gemensamma undervisningsexemplet | 1:20 |
| 3–5 | Elevens pass, uppgift, ledtråd, återkoppling och lösning | 2:20 |
| 6–10 | Grupper, skapa och dela pass, resultat per område och elev | 4:00 |
| 11–15 | Välj uppgifter, bygg uppgiftsblad, redigera dokument och uppgifter | 4:00 |
| 16–19 | Dela med kollegor, sparade dokument, undervisningscykel och nästa steg | 2:30 |

Tidsangivelserna i manusets talaranteckningar är vägledande. Ge kollegorna tid att läsa skärmbilderna och stanna gärna vid en funktion som väcker frågor.

## Skärmbilder och exempeldata

Skärmbilderna är tagna i Chromium från apparnas verkliga lokala gränssnitt den 15 oktober 2026. De är inte tecknade imitationer. Namn, konton, grupper, träningspass och resultat är fiktiva demonstrationer som injiceras i den isolerade webbläsaren. Uppgifterna och deras illustrationer kommer från de befintliga uppgiftsbankerna.

Bildskripten fångar nätverksanrop: apparnas publika adresser serveras från de lokala kopiorna, Supabase blockeras och tjänsteanrop för grupper, resultat och delning ersätts med lokala demonstrationssvar. Inga riktiga elevuppgifter hämtas och inga produktionsdata ändras. Delningsbilderna visar gränssnittet för godkända lärarkonton; ingen inbjudan skickas till någon kollega.

Källversioner vid fotograferingen:

| Repository | Git HEAD |
| --- | --- |
| Kunskapsgymmet | `6f702503637fc3af68d24ff6b1e350eb6f2a6dbb` |
| Uppgiftslabbet | `859b53892c5bb0cd5e94418701be38aa247ea85a` |
| SCEN | `073b7fc5ed57190096324662c0f380307436915b` |

Presentationen skiljer mellan genomförda uppgifter, andel rätt och uppskattad behärskning. Den utlovar ingen automatisk överföring från uppgiftsblad till träningspass. PDF- och Word-knapparna visas, men dessa exportfunktioner har inte funktionstestats i detta presentationsarbete.

## Bygg om presentationen

Kör från SCEN-repot:

```sh
node scripts/scen.mjs index
node scripts/scen.mjs kolla
node scripts/scen.mjs exportera presentationer/kunskapsgymmet-och-uppgiftslabbet.md
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/package.py
```

Det sista steget bäddar in typsnitten **Familjen Grotesk** och **Hanken Grotesk** samt deras OFL-licenser. Utan det steget använder standardexporten externa webbtypsnitt. Licenstexterna finns även i denna mapp. Fontsource-versionen är låst till 5.3.0.

För nya skärmbilder behövs Python Playwright, Chromium-wrappern `/workspace/.onboarding/bin/chromium-cloud` och lokala HTTP-servrar: SCEN på 5173, Uppgiftslabbet på 8082 och Kunskapsgymmet på 8083. Miljöns sparade startinstruktioner beskriver dessa. Kör sedan:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture.py
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/capture-ul.py
```

Skripten skriver över skärmbilderna i `bilder/verktygspresentation/`. De behöver `cdn.jsdelivr.net` vid första körningen för appbibliotek och typsnitt; hämtningarna cachas under `/workspace/.onboarding/cache`. De är anpassade för denna molnmiljös sökvägar. Bygg om exporten efter bildändringar.

## Kontroller

Presentationens samtliga 19 scener och 39 visningslägen har körts i den faktiska SCEN-spelaren vid 1920 × 1080. Alla bilder laddas, fria textlager ryms och inga JavaScript-fel eller externa nätverksanrop registreras. Skärmbilder har även granskats visuellt. Kontrollen kan upprepas med:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verktygspresentation/review.py
```

Rapport och granskningsbilder skrivs till `/workspace/.onboarding/presentation-review/` utanför repot. Presentationen har också öppnats via SCEN-biblioteket. Tangentnavigation och anteckningar kontrolleras separat vid 1280 × 720 med nätverket avstängt efter lokal inläsning. Direkt öppning av `file://` blockeras av molnwebbläsarens administratörspolicy; just det öppningssättet kunde därför inte verifieras här.

SCEN:s manuskontroll och test av mallinläsning är godkända, liksom Uppgiftslabbets 18 tester för uppgiftsgranskning. Hela SCEN:s `npm test` är **inte** grön: den stannar på det befintliga felet i `scripts/check-editorial.cjs:9` (4 steg i stället för förväntade 3), som redan beskrivs i `docs/BILDREGI.md`. Applikationskod, uppgiftsbanker och befintliga tester har inte ändrats för presentationen.
