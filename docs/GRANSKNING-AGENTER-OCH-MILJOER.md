# Granskning: AI-agenter och miljöer

Underlag: de ursprungliga 20 bilderna i `presentationer/ai-agenter-och-miljoer.md`, renderad översikt och närmare visuell kontroll av centrala scener. Numreringen nedan avser den versionen.

Efter granskningen bad användaren om de visuella förbättringarna med oförändrade formuleringar. Den nya sensorbilden, fokusväxlingen på bild 7, den lugnare sammanfattningen och fallvisningen är nu införda. Byt antagande har lagts till som bild 19; övningen och aktiviteten blir bild 20–21. Alla texter och talaranteckningar från de tidigare 20 bilderna är bevarade. Formuleringsförslagen nedan är fortfarande förslag.

Exemplet **Ett beslut i korsningen** är färdigt i biblioteket och som fristående presentation: `dist/ett-beslut-i-korsningen.html`. Där demonstreras Genomlysning, Omformning, Två förlopp och Återkomst. Se `BERATTANDE-MALLAR.md` för användning.

## Prioritering

Presentationens starkaste grepp är att korsningen återkommer och får ny betydelse när eleverna lär sig begreppen. Behåll det, den rubriklösa sensorbilden och växlingen mellan bilder och korta påståenden.

Jag skulle först göra följande:

1. **Skärpa begreppen.** Framför allt observerbarhet, determinism, rationalitet och statisk miljö. Några nuvarande formuleringar blandar ihop information, slump och förmågan att förutse framtiden.
2. **Göra övergången på bild 7 konkret.** Följ bilen från ett beslut till villkoren för beslutet. Den nuvarande tidslinjen antyder att rationell agent är ett steg efter AI-agent.
3. **Lätta sammanfattningen på bild 18.** Låt korsningen och dess sex fokusområden bära återkomsten. Den långa rubriken och ingressen tar i dag stor plats.
4. **Låta övningen pröva resonemang.** Visa ett fall i taget med tydliga antaganden och motiveringar. Behåll tabellen som arbetsblad och samlad översikt.
5. **Skapa en sensorversion av exakt samma korsningsbild.** Den befintliga sensorbilden har en annan komposition. En matchande bild skulle ge en tydligare övergång från fotografi till tolkning.

## Bild för bild

| Bild | Rekommendation |
|---|---|
| 1 | Behåll öppningen. Ställ muntligt frågan: ”Vad behöver bilen veta innan den kör vidare?” Återvänd till frågan i slutet. |
| 2 | Behåll kretsloppet och samma bakgrund. Det etablerar en modell som går att återanvända. |
| 3 | Låt eleverna först peka ut en agent. Tänd sedan markeringarna. Behåll förtydligandet i anteckningarna att vi tänker oss att bilen är självkörande. |
| 4 | Behåll utan rubrik och ingress. Byt på sikt till en sensorillustration av samma korsning. Ändra anteckningens ”det agenten vet” till ”det systemet har upptäckt och uppskattat”; detektioner kan vara osäkra. |
| 5 | Precisera talaranteckningen: AI kan användas både för att tolka omgivningen och för att välja eller planera handlingar. ”AI:n sitter i beslutsfattandet” blir för snävt. |
| 6 | Korta Målorientering till ”Väljer handlingar utifrån ett mål.” Undvik att redan i definitionen förutsätta att agenten väljer de bästa möjliga handlingarna. Presentera egenskaperna som den modell av agenter som används i lektionen. |
| 7 | Ersätt den additiva tidslinjen med en brygga: ”Hur väljer bilen när den inte ser allt?” Rationalitet ska beskrivas som ett krav på beslutsfattandet, inte som en nivå som kommer efter AI. |
| 8 | Låt de sex vardagsfrågorna dominera och använd fackorden som stöd. Behåll ordningen genom resten av presentationen. Korsningen kan fortsätta här; robotdammsugaren blir sedan ett nytt övningsfall. |
| 9 | Definiera full observerbarhet med information om relevant aktuellt tillstånd. Ta bort likställandet med komplett kunskap, enkel modellering och frånvaro av osäkerhet. |
| 10 | Behåll pokerbilden. Skilj på vad eleven för tillfället uppmärksammar och vad spelaren faktiskt kan se. Spotlighten styr publikens blick; den avgör inte agentens tillgång till information. |
| 11 | Behåll jämförelseformen men byt Fördelar/Nackdelar mot ”Vad behöver agenten ta hänsyn till?” och konkreta exempel. Multiagentmiljöer kan innehålla både samarbete och konkurrens. |
| 12 | Behåll omröstningen och förklaringen. Lägg gärna en enklare muntlig fråga redan på bild 3, så att första aktiva deltagandet kommer tidigare. |
| 13 | Lägg till ”samma tillstånd” i definitionen av determinism. Skilj osynlig information från slump i tillståndsövergången. |
| 14 | Skriv att episoder är oberoende i den valda uppgiften. För sekventiell miljö räcker ”Ett beslut kan påverka senare situationer och beslut.” Varje handling behöver inte påverka alla kommande handlingar. |
| 15 | Knyt statisk/dynamisk till vad som händer medan agenten överväger sitt beslut. Schackexemplet behöver antagandet att vi bortser från klockan. |
| 16 | Behåll växlingen mellan schackbrädet och robotarmen: samma bild visar två modelleringsnivåer. Precisera till ”Schackdragen beskrivs diskret. Robotarmens position och rörelse kan beskrivas kontinuerligt.” |
| 17 | Behåll schack som genomarbetat exempel. Ange ”utan klocka” och ersätt ”alla drag och deras konsekvenser är förutsägbara” med ”Ett lagligt drag ger ett bestämt nytt brädläge.” |
| 18 | Föreslagen kort rubrik: ”Samma korsning. Sex nya frågor.” Ta bort den upprepande ingressen. Ett rubriklöst återbesök fungerar också. Behåll de sex fokusområdena och en avslutande helhetsvy. |
| 19 | Gör ett fall i taget stort nog att diskutera. Be om antagande, klassificering och motivering. Den fulla tabellen fungerar bättre som arbetsblad och slutöversikt. Facit är dolt när startläget har stabiliserats; det kontrollerades i webbläsaren. |
| 20 | Behåll aktiviteten. Visa de centrala diskussionsfrågorna även här: ”Vad kunde du se? Vad behövde du anta? Ändrades reglerna, informationen eller båda?” Klargör hur dolda rutor väljs i den faktiska spelversionen. |

## Konkreta formuleringar

**Bild 7, rationalitet:**

> En rationell agent väljer den handling som, utifrån tillgänglig information, förväntas ge bäst resultat enligt målet.

Rationalitet innebär inte att utfallet alltid blir bra. En agent kan fatta ett välgrundat beslut och ändå få ett dåligt utfall. Egenskapen är inte begränsad till AI-agenter.

**Bild 8, sex frågor:**

1. Kan agenten uppfatta hela det relevanta tillståndet?
2. Behöver den ta hänsyn till andra agenters handlingar?
3. Ger samma handling i samma tillstånd alltid samma nästa tillstånd?
4. Kan ett beslut påverka senare situationer och beslut?
5. Kan miljön förändras medan agenten tänker?
6. Beskriver vi tillstånd och handlingar i steg eller med kontinuerliga värden?

**Bild 9, fullständigt observerbar:**

> Agenten kan uppfatta hela det tillstånd som är relevant för uppgiften.

Talaranteckning: I schackmodellen kan agenten uppfatta det aktuella spelläget och känna till relevant spelhistorik. Den behöver fortfarande resonera om möjliga framtida drag. Full observerbarhet betyder inte att motståndarens framtida val är kända.

**Bild 10, partiellt observerbar:**

> En del av det relevanta tillståndet är dolt eller osäkert. Agenten behöver fatta beslut ändå.

Talaranteckning: Alla synliga kort och satsningar kan vara tillgängliga för spelaren även när presentationens spotlight riktas någon annanstans. Motståndarnas dolda kort förblir okända när hela fotografiet visas.

**Bild 11, konkret jämförelse:**

| | Singelagent | Multiagent |
|---|---|---|
| Beslut | En agents val står i centrum för uppgiften. | Andra agenters val påverkar möjligheter och resultat. |
| Att ta hänsyn till | Uppgiften och miljöns förändringar. | Även andra agenters handlingar och möjliga reaktioner. |
| Exempel | En person löser ett korsord. | Två spelare spelar schack; trafikanter samspelar i en korsning. |

**Bild 13, determinism:**

> Samma tillstånd + samma handling → samma nästa tillstånd.

> Samma tillstånd + samma handling → flera möjliga nästa tillstånd.

Talaranteckning: Den andra raden beskriver en stokastisk övergångsmodell. Att agenten saknar information bevisar inte i sig att övergången är stokastisk. I schack ger ett valt lagligt drag ett bestämt brädläge; i poker tillför kortutdelningen slump. Trafik kan modelleras stokastiskt, men det är en modell av osäkra förlopp som behöver anges.

**Bild 15, statisk och dynamisk:**

> Statisk: miljön förändras inte medan agenten överväger sitt nästa beslut.

> Dynamisk: miljön kan förändras medan agenten överväger sitt nästa beslut.

Talaranteckning: Använd schack utan klocka som det statiska exemplet. Dynamisk betyder inte att varje del av miljön oavbrutet rör sig.

**Bild 19, instruktion till eleverna:**

> Beskriv era antaganden. Klassificera miljön. Motivera med något i fallet. Kan ett annat rimligt antagande ändra svaret?

## Gör övningens antaganden synliga

Tabellen behandlar flera uppgifter som om de hade en enda möjlig klassificering. Anteckningen om labyrinten tar redan upp en alternativ modell; lyft fram den poängen i själva övningen.

- **Labyrint:** Hela kartan tillgänglig eller okänd labyrint som utforskas? Observerbarheten ändras.
- **Schack:** Med eller utan klocka? Förklara vilken modell som används i lektionen.
- **Bildklassificering:** Oberoende, stillastående bilder och fasta svarskategorier är en tydlig avgränsad uppgift. Att klassificeraren använder fasta vikter avgör inte ensamt alla egenskaper hos miljön. Håll uppgiftens tillstånd, handlingar och algoritmens utförande isär.
- **Robotdammsugare:** Känd karta? Tillförlitliga rörelser? Människor i rummet? Ange vad modellen innehåller innan facit visas. En annan aktiv robot kan till exempel göra samspelet mellan agenter centralt.
- **Medicinsk diagnos:** Ett fryst patientfall som klassificeras en gång skiljer sig från en läkare som väljer undersökningar över tid medan patientens tillstånd förändras. Osäker diagnos är inte i sig ett bevis på stokastiska tillståndsövergångar. Specificera uppgiften eller välj ett enklare fall i introduktionsövningen.

## En ny mall som motiverar sin plats: Byt antagande

**Syfte:** Visa hur en bedömning förändras när en uttalad förutsättning ändras.

**Användning:** När publiken behöver förstå villkoren bakom ett svar. Här passar den efter schackexemplet och som inledning till övningen.

**Skillnad:** Prövning låter ett fast fall möta kriterier. Två förlopp följer två händelsekedjor. Byt antagande håller fallet stilla och ändrar en förutsättning; bedömningen uppdateras på samma plats.

**Fokusförlopp:**

1. Ett enkelt labyrintschema och agentens position visas. Fråga: ”Vad kan agenten se?”
2. Antagandet ”Hela kartan är tillgänglig” tänds. Efter en paus visas bedömning och motivering.
3. Antagandet ändras till ”Agenten ser bara närmaste korridoren”. Samma labyrint finns kvar under en mask; varken väggar eller agent flyttas.
4. Bedömningen växlar från fullt till partiellt observerbar. Endast den ändrade delen markeras. Övriga egenskaper står kvar dämpade.
5. Helheten återkommer med slutsatsen: ”Klassificeringen beror på vilken uppgift och modell vi beskriver.”

**Innehåll:** Valfri rubrik, gemensamt fall i text/bild/diagram, två eller tre namngivna antaganden, bedömningar, motiveringar och en slutsats. Svaren ska kunna vara helt dolda före sitt klick. Färg kompletteras med tydliga ord och markeringar.

**Återanvändning utan ändrad mallkod:** AI (tillgänglig information), matematik (ändrat definitionsområde), fysik (med eller utan friktion), historia (ny information om en källas avsändare), samhällskunskap (budget under olika antaganden) och svenska (tolkning när berättarperspektivet ändras).

Mallen är implementerad som `[egen: byt-antagande]` med två klick per antagande och en avslutande jämförelse. Den gemensamma bilden står kvar under hela sekvensen. Ett valfritt synfält kan dölja delar av bilden när antagandet ändras; i labyrintexemplet blir bara området kring agenten synligt. Slutet återställer hela kartan. Mallen fungerar utan rubrik och utan animation.

## Så kan befintliga mallar användas

- **Omformning, bild 6–7:** Koppla konkreta observationer till Uppfatta, Bedöma och Agera. Låt sedan frågan om tillgänglig information föra berättelsen till miljön.
- **Bildregi, bild 9–10 och 16:** Behåll exakt riktade markeringar för synligt/dolt och bräde/robotarm. Begreppsliga lager i Genomlysning ersätter inte koordinatbundna markeringar.
- **Två förlopp:** Använd för två uttryckligen beskrivna händelsekedjor. För att lära ut determinism måste samma initiala tillstånd och handling anges; att visa två olika val med olika följder demonstrerar inte stokastik.
- **Bildregi, bild 18:** Behåll sex markeringar och korta texten. Den nya Återkomst-mallen är dokumenterad för två till fyra insikter; pressa inte in sex poster bara för att använda en ny mall.
- **Prövning, övningen:** Fungerar för en mindre uppsättning kriterier med belägg. Den är dokumenterad för högst fem kriterier. Dela upp diskussionen eller bygg en tydlig navigering om alla sex miljödimensioner ska behandlas i samma scen.

## En ny bild att generera

Prioritera en matchande sensorillustration. Använd **`bilder/ai-agenter-miljoer/korsning.jpg` som referensbild** i bildverktyget och välj redigering av bilden. Behåll originalets proportioner och upplösning, helst 1672 × 941 eller högre med samma proportioner.

Prompt:

> Redigera den bifogade bilden till en pedagogisk visualisering av maskinell perception. Bevara exakt samma kameravinkel, perspektiv, utsnitt, byggnader, vägmarkeringar, trafikljus och placeringar av samtliga bilar, fotgängare och cyklisten. Ingenting får flyttas, läggas till eller tas bort. Lägg ett tunt, återhållet cyanblått punktmoln och diskreta konturlinjer över den befintliga scenen. Fotografiet och den regnvåta gatans ljus ska fortfarande vara igenkännbara under lagret. Behåll den mörka fasaden till vänster lugn och mörk. Inga texter, bokstäver, siffror, symboler, etiketter, ramar runt objekt eller gränssnittselement. Samma bildproportioner som referensen. Resultatet ska kunna tonas in exakt ovanpå originalfotografiet utan att motivet hoppar.

Markeringar och texter läggs sedan i Scen så att de går att styra och ändra. Kontrollera att bilderna verkligen passar ovanpå varandra; en bildgenerator kan ändra geometri trots prompten. Justera bild 4:s koordinater till den nya bilden. Den ska fortsatt sakna rubrik och ingress. Kalla bilden en illustration av perception, inte verkliga sensordata eller bilens exakta kameravy.

Labyrinten till Byt antagande bör vara ett enkelt diagram i Scen. Den behöver ingen genererad bild: väggar, agent och mask måste vara exakt kontrollerbara.

## Föreslagen berättelse

Korsningen → vilka är agenter? → vad uppfattar bilen? → hur fattar den beslut? → vilka villkor ställer miljön? → sex frågor → schack som arbetat exempel → byt ett antagande → elevernas egna motiveringar → återvänd till korsningen → pröva begränsad information i spelet.

Återanvänd samma bildutsnitt över angränsande scener, låt samma objekt vara visuella hållpunkter och flytta fokus när resonemanget kräver det. Korta pausfrågor och återkommande motiv ger sammanhang. Rubriker används där de tillför orientering; en scen som redan bär sin idé behöver ingen.
