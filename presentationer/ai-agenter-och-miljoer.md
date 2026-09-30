---
titel: AI-agenter och miljöer
kurs: Artificiell Intelligens 1
tema: natt
---

[bildregi]
etikett: Introduktion · David Hedengren
rubrik: AI-agenter och miljöer
bild: bilder/ai-agenter-miljoer/korsning.jpg
alt: Regnvåt stadskorsning i skymning sedd uppifrån, med bilar, cyklist och fotgängare.
bildläge: hero
fokuspunkt: 62 64
startutsnitt: 50 50 1.08
slututsnitt: 50 50 1
säker-yta: 4 14 34 60
mörkning: 0 0 42 100 0.5
hastighet: slow
> En värld där saker händer hela tiden, oavsett vad vi gör. Det är den sortens värld en AI-agent ska klara av.

---

[kretslopp]
etikett: Begrepp 1
rubrik: Vad är en agent?
text: En aktör som uppfattar sin omgivning och agerar i den.
slutsats: Här står inget om AI. En agent kan vara en människa, ett djur eller en maskin.
mitten: Agenten
retur: Agenten reagerar på förändringar, varv efter varv.
miljö: bilder/ai-agenter-miljoer/korsning.jpg | 80
- Uppfattar | Med sinnen, sensorer eller data.
- Beslutar | Utifrån sitt mål.
- Agerar | Med kroppen eller aktuatorer.
- Omgivningen förändras | Både av agentens handling och av sig själv.
> Klick 1–4 går runt loopen: uppfatta, besluta, agera, och omgivningen förändras. Klick 5 sluter ringen: agenten börjar om och uppfattar den nya situationen. Sista klicket visar hela loopen.
> Agenten interagerar med sin miljö, samlar in information och reagerar på förändringar.
> Observera: här står inget om AI. En agent kan vara en människa, ett djur eller en maskin.
> Miljön bakom är samma korsning som på titelbilden. Den följer med genom hela delen om agenten.

---

[bildregi]
etikett: Exempel
rubrik: Agent eller AI-agent?
text: Agent betyder inte AI. Fotgängaren är en agent. En självkörande bil är en AI-agent.
bild: bilder/ai-agenter-miljoer/korsning.jpg
alt: Stadskorsning i skymning med fotgängare på ett övergångsställe och bilar.
bildläge: spotlight
fokuspunkt: 62 64
säker-yta: 4 14 34 60
mörkning: 0 0 42 100 0.55
- manniska | Människan: agent | 75 | 70 | 16 | 12 | Ser trafiken, bestämmer sig och går över gatan.
- bil | Självkörande bil: AI-agent | 59 | 59 | 12 | 12 | Använder AI för att välja och planera sina handlingar.
> Tänk dig att bilen är självkörande. Båda uppfattar, beslutar och agerar i samma korsning, men bara bilen använder AI.
> Det här kommer tillbaka senare: i trafiken finns många agenter samtidigt.

---

[bildregi]
etikett: Perception
rubrik: Korsningen, som bilen ser den
text: Sensorerna gör gatan till punkter och rutor. Det är den bilden AI-agenten fattar beslut utifrån.
bild: bilder/ai-agenter-miljoer/sensorvy.jpg
alt: Regnig stadskorsning på natten, täckt av blå mätpunkter. Fotgängare, bilar och en cyklist har var sin genomskinlig ruta runt sig.
bildläge: spotlight
fokuspunkt: 50 60
säker-yta: 3 4 40 30
mörkning: 0 0 52 40 0.7
- fotgangare | Fotgängare | 25 | 47 | 9 | 17 | En ruta i punktmolnet. Vart är den på väg?
- bil | Bil | 45 | 64 | 18 | 24 | En annan förare. Vad den gör härnäst påverkar AI-agentens nästa beslut.
- cyklist | Cyklist | 80 | 70 | 10 | 21 | Ännu en agent, med egna mål.
> Bilden är en illustration av hur sensordata kan se ut, inte en skärmbild från en riktig bil.
> Koppla till loopen: det här är steget Uppfattar. Rutorna är det agenten vet om korsningen.
> Fråga klassen: vad i bilden har ingen ruta? Trafikljusen, till exempel. Här börjar frågan om vad agenten kan se, som kommer tillbaka när vi går igenom miljöerna.

---

[typografi]
etikett: Begrepp 2
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/korsning.jpg | 84
- statement | En **agent** uppfattar, beslutar och agerar. | Agent
- precisering | En **AI-agent** är en artificiell agent som använder AI för att välja eller planera sina handlingar. | AI-agent
> AI:n sitter i beslutsfattandet. Uppfatta och agera gör alla agenter.
> Ursprunglig formulering: ett system som kan uppfatta sin omgivning (med t.ex. sensorer eller genom att analysera data), fatta beslut och vidta åtgärder (med aktuatorer).

---

[kärna]
etikett: Tre egenskaper
rubrik: Vad gör en agent till en agent?
text: Agent
slutsats: Målorientering bygger på de två första.
miljö: bilder/ai-agenter-miljoer/korsning.jpg | 84
- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.
- Perception | Samlar in data om sin omgivning genom sensorer eller annan inmatning.
- Målorientering | Använder sin autonomi och perception för att fatta beslut och ta de bästa möjliga åtgärderna för att nå sitt mål.
> Målorientering bygger på de två första: agenten använder sin autonomi och perception för att nå målet.

---

[tidslinje]
rubrik: Från agent till miljö
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/korsning.jpg | 84
- Agent | Grunden | Uppfattar, beslutar och agerar.
- AI-agent | Plus AI | AI används i beslutsfattandet.
- Rationell agent | Plus bästa valet | Väljer den bästa handlingen utifrån mål och information.
- Miljön | Villkoret | Avgör hur bra beslut agenten kan fatta.
> Varje begrepp bygger på det föregående. En rationell agent strävar alltid efter att fatta de bästa besluten för att uppnå sina mål.
> Det sista steget är vändpunkten i lektionen: hur bra beslut agenten kan fatta beror på vilken miljö den befinner sig i. Nu flyttar vi blicken från agenten till världen den verkar i.

---

[rutor]
etikett: Miljön
rubrik: Sex frågor om agentens värld
text: Miljöer kan klassificeras i dimensioner som påverkar hur agenten interagerar med sin omgivning och fattar beslut.
miljö: bilder/ai-agenter-miljoer/robotdammsugare.jpg | 72
- Fullständigt / partiellt observerbar | Ser agenten allt som händer i miljön?
- Singel / multiagent | Är agenten ensam, eller finns det andra agenter?
- Deterministisk / stokastisk | Leder samma handling alltid till samma utfall?
- Episodisk / sekventiell | Påverkar ett beslut de beslut som kommer sedan?
- Statisk / dynamisk | Förändras miljön även när agenten inte agerar?
- Diskret / kontinuerlig | Är tillstånd och handlingar indelade i tydliga steg?
> Samma ordning som i övningstabellen i slutet av lektionen.
> I bakgrunden arbetar en robotdammsugare i ett vardagsrum. Den finns med i övningen. Vilken värld lever den i? Leksaker, stolsben och mattor, och allt kan ha flyttats sedan i går.

---

[bildregi]
etikett: 1 / 6 · Observerbarhet
rubrik: Fullständigt observerbar
text: Agenten har tillgång till all information om miljön och fattar beslut med komplett kunskap. Enkelt att modellera, men orealistiskt i verkliga scenarier.
bild: bilder/ai-agenter-miljoer/schack-robotarm.jpg
alt: Schackparti mellan en människa och en robotarm. Hela brädet är jämnt upplyst.
bildläge: hero
fokuspunkt: 60 66
startutsnitt: 50 50 1
slututsnitt: 50 50 1.05
säker-yta: 4 5 38 46
mörkning: 0 0 46 56 0.55
hastighet: slow
> Här behövs inget strålkastarljus. Allt syns: alla pjäser och deras positioner, för båda spelarna.
> Fördel: enkel modellering, inga osäkerhetsfaktorer. Nackdel: orealistisk i verkliga scenarier.

---

[bildregi]
etikett: 1 / 6 · Observerbarhet
rubrik: Partiellt observerbar
text: Agenten har bara delvis information och måste hantera osäkerhet och göra antaganden.
bild: bilder/ai-agenter-miljoer/poker-pov.jpg
alt: Pokerbord ur spelarens perspektiv. De egna korten ligger uppvända, motståndarnas kort är dolda.
bildläge: spotlight
fokuspunkt: 50 50
säker-yta: 3 3 36 36
mörkning: 0 0 42 46 0.7
- egna | Sensordata | 26 | 78 | 26 | 22 | Agenten samlar in information. Här: sina egna kort.
- dolda | Okänd information | 58 | 24 | 14 | 20 | Det finns alltid information som är osynlig för agenten.
- beslut | Beslutsfattande | 49 | 48 | 20 | 18 | Agenten måste fatta beslut med ofullständig information.
> Jämför med förra bilden: där var allt upplyst. Här ser agenten bara det som strålkastaren visar.
> Sista klicket visar hela bordet igen, det vill säga det agenten inte kan se.

---

[vägval]
etikett: 2 / 6 · Singel / multiagent
rubrik: Ensam eller bland andra?
vänster: Singelagent
höger: Multiagent
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/korsning.jpg | 84
fokus: mjuk
- Vad | Endast en agent, ingen koordinering med andra | Agenterna interagerar med miljön och med varandra
- Fördelar | Enkelhet, effektivt eftersom ingen konkurrerar | Ökad effektivitet, flexibilitet, samarbete mot gemensamma mål
- Nackdelar | Begränsad kapacitet och tillämpbarhet | Svår koordinering, risk för konflikter, svårare beslut
> Varje klick visar båda sidor av samma rad, så att klassen jämför singel och multi punkt för punkt.
> Lägg märke till att "effektivt" finns på båda sidor, av olika skäl. Varför?
> Kom ihåg: agent betyder inte AI. I trafiken är den självkörande bilen en AI-agent, men fotgängaren och bilföraren är också agenter.

---

[omröstning]
rubrik: Schack mot dator: singel- eller multiagentmiljö?
svar: Två agenter fattar beslut i samma miljö. Motståndarens drag påverkar direkt vilka handlingar och resultat som är möjliga för den andra agenten.
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/schack-robotarm.jpg | 84
- Singelagent
- * Multiagent
- Det beror på perspektivet
> Räkna händer med tangenterna 1–3, 0 nollställer. Klicka vidare för att visa svaret.
> Människan är en agent och schackprogrammet är en AI-agent. Båda väljer drag, och dragen påverkar varandras möjligheter och resultat: en konkurrerande (adversarial) multiagentmiljö.
> Att vi studerar en agents beslut gör inte miljön till en singelagentmiljö. Det avgörande är om det finns andra agenter vars handlingar påverkar utfallet.
> Specialfall: om motståndaren bara spelar upp en helt förutbestämd sekvens av drag och inte själv fattar beslut, kan den modelleras som en del av miljön. Vanligt schack mot människa eller schackdator är multiagent.

---

[typografi]
etikett: 3 / 6 · Deterministisk / stokastisk
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/poker-pov.jpg | 84
- statement | Samma handling. **Samma** utfall. | Deterministisk
- ersättning | Samma handling. **Osäkert** utfall. | Stokastisk
- precisering | Schack är deterministiskt.\\nPoker är **stokastiskt**. | Exempel
> Deterministisk: utfallet av en viss handling är alltid förutsägbart.
> Stokastisk: handlingar innehåller en viss grad av slump eller osäkerhet.

---

[fokus]
etikett: 4 / 6 · Episodisk / sekventiell
rubrik: Påverkar ett beslut nästa?
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/domino.jpg | 80
- Episodisk | Varje handling är fristående och påverkar inte framtida handlingar.
- Sekventiell | Varje handling påverkar framtida tillstånd och beslut.
- Exempel | Bildklassificering är episodisk. Planering för en självkörande bil är sekventiell.
> Dominobrickorna i bakgrunden: varje bricka påverkar nästa, precis som i en sekventiell miljö.

---

[bildregi]
etikett: 5 / 6 · Statisk / dynamisk
rubrik: Statisk eller dynamisk?
text: Statisk: förändras bara när agenten agerar, som ett schackspel. Dynamisk: förändras hela tiden, som trafiken runt en självkörande bil.
bild: bilder/ai-agenter-miljoer/korsning.jpg
alt: Stadskorsning i skymning med ljusspår från trafiken.
bildläge: hero
fokuspunkt: 62 64
startutsnitt: 50 50 1
slututsnitt: 50 50 1.12
säker-yta: 4 12 34 64
mörkning: 0 0 42 100 0.55
hastighet: medium
> Samma korsning som i början. Ljusspåren visar att världen rör sig oavsett vad bilen gör.

---

[bildregi]
etikett: 6 / 6 · Diskret / kontinuerlig
rubrik: Diskret eller kontinuerlig?
text: Schack är en diskret miljö. Robotik i verkligheten är en kontinuerlig miljö.
bild: bilder/ai-agenter-miljoer/schack-robotarm.jpg
alt: Schackparti mellan en människa och en robotarm som lyfter en springare.
bildläge: spotlight
fokuspunkt: 60 60
säker-yta: 4 5 38 46
mörkning: 0 0 46 56 0.55
- rutor | Diskret | 56 | 76 | 16 | 14 | Tillstånd och handlingar i separata steg: en ruta i taget.
- arm | Kontinuerlig | 71 | 36 | 16 | 30 | Robotarmens rörelse har oändligt många lägen, utan tydliga avgränsningar.
> Samma bild innehåller båda. Spelet är diskret, robotarmens rörelse är kontinuerlig. Det beror på vad vi väljer att modellera.

---

[fokus]
etikett: Helheten
rubrik: Schack mot dator: sex svar
bakgrund: fokusljus
miljö: bilder/ai-agenter-miljoer/schack-robotarm.jpg | 84
- Fullständigt observerbar | Alla pjäser och positioner syns för båda spelarna.
- Multiagent | Två agenter vars drag påverkar varandra: en konkurrerande miljö.
- Deterministisk | Alla drag och deras konsekvenser är förutsägbara.
- Sekventiell | Varje drag påverkar brädets framtida tillstånd.
- Statisk | Brädet förändras inte utanför agenternas kontroll.
- Diskret | Ett begränsat antal möjliga drag och tillstånd.
> Samma sex frågor som förut, nu besvarade för ett exempel. Så här ska ni göra i övningen.

---

[bildregi]
etikett: Sammanfattning
rubrik: Rätt modell av miljön är avgörande för effektiva AI-system.
text: AI-agenter verkar i miljöer med olika egenskaper. Att förstå dem är avgörande för system som ska navigera i komplexa och dynamiska omvärldar.
bild: bilder/ai-agenter-miljoer/korsning.jpg
alt: Stadskorsning i skymning med bilar, cyklist, fotgängare och trafikljus.
bildläge: spotlight
fokuspunkt: 62 64
säker-yta: 3 8 40 78
mörkning: 0 0 42 100 0.55
- obs | Partiellt observerbar | 70 | 40 | 12 | 16 | Träd, hus och andra fordon skymmer. Bilen ser bara en del av vägen.
- multi | Multiagent | 75 | 70 | 16 | 12 | Fotgängare, cyklister och förare är också agenter.
- stok | Stokastisk | 58 | 59 | 10 | 10 | Vad föraren framför gör härnäst går inte att veta säkert.
- sekv | Sekventiell | 52 | 74 | 12 | 10 | Att svänga eller bromsa nu påverkar nästa situation.
- dyn | Dynamisk | 48 | 58 | 6 | 10 | Trafikljusen slår om och alla rör sig, oavsett vad bilen gör.
- kont | Kontinuerlig | 58 | 86 | 14 | 10 | Hastighet och styrning har inga tydliga steg.
> Sammanfattning före övningen. Samma korsning som i början: tänk dig att en av bilarna är självkörande. Nu kan vi läsa miljön med alla sex frågorna, i samma ordning som tabellen.
> Scenen visar svaren för raden "Självkörande bil i trafik". Använd den som ett genomarbetat exempel, eller låt eleverna börja med de andra raderna.

---

[tabell]
rubrik: Övning i par: fyll i och diskutera tabellen
visa: facit-rader
bakgrund: fokusljus
fokus: mjuk
| Uppgift | Fullt/partiellt\nobserverbart | Singel/\nmultiagent | Deterministisk/\nstokastisk | Episodisk/\nsekventiell | Statiskt/\ndynamiskt | Diskret/\nkontinuerligt |
| Schack mot dator | Fullt | Multi | Deterministisk | Sekventiell | Statisk | Diskret |
| Korsord | Fullt | Singel | Deterministisk | Sekventiell | Statisk | Diskret |
| Poker | Partiellt | Multi | Stokastisk | Sekventiell | Statisk | Diskret |
| Bildklassificering | Fullt | Singel | Deterministisk | Episodisk | Statisk | Diskret |
| Självkörande bil i trafik | Partiellt | Multi | Stokastisk | Sekventiell | Dynamisk | Kontinuerlig |
| Robotdammsugare | Partiellt | Singel | Stokastisk | Sekventiell | Dynamisk | Kontinuerlig |
| Navigering genom labyrint | Fullt | Singel | Deterministisk | Sekventiell | Statisk | Diskret |
| Diagnos av sjukdom utifrån symptom | Partiellt | Singel | Stokastisk | Episodisk | Statisk | Diskret |
> Visa tabellen tom medan eleverna arbetar. Klicka sedan fram facit en rad i taget.
>
> Schack mot dator
> Observerbarhet: Fullt observerbart eftersom alla bitar på schackbrädet och deras positioner är synliga för både spelaren och datorn.
> Antal agenter: Multi-agent eftersom både spelaren och datorn är agenter som fattar beslut, och deras drag påverkar varandras möjligheter och resultat (en konkurrerande miljö).
> Deterministisk: Alla drag och deras konsekvenser är förutsägbara och leder till ett bestämt utfall.
> Sekventiell: Varje drag påverkar brädets framtida tillstånd, så alla beslut måste tas med hänsyn till kommande drag.
> Statisk: Brädets tillstånd förändras inte utanför agenternas kontroll.
> Diskret: Schack har ett begränsat antal möjliga drag och tillstånd.
>
> Korsord
> Observerbarhet: Fullt observerbart eftersom alla rutor och ledtrådar är synliga och tillgängliga för spelaren från början.
> Antal agenter: Single-agent eftersom en person vanligtvis löser korsordet ensam. (Flera personer kan hjälpa till, men det betraktas som en enskild agentuppgift).
> Deterministisk: Lösningarna är deterministiska eftersom varje korrekt ord har en fast plats i rutnätet och påverkar andra ord förutsägbart.
> Sekventiell: Varje ord påverkar framtida möjligheter genom att fylla i bokstäver som är gemensamma med andra ord.
> Statisk: Korsordet förändras inte av sig självt, utan enbart när spelaren fyller i det.
> Diskret: Varje ruta är en enskild enhet och varje inmatning är en diskret bokstav.
>
> Poker
> Observerbarhet: Partiellt observerbart eftersom spelarna inte kan se varandras kort.
> Antal agenter: Multi-agent eftersom flera spelare interagerar.
> Stokastisk: Slumpen avgör vilka kort som delas ut, vilket gör spelet osäkert.
> Sekventiell: Varje satsning påverkar hur nästa runda spelas och hur spelet utvecklas.
> Statisk: Spelmiljön (korten och spelreglerna) förändras inte utan spelarens interaktion.
> Diskret: Spelet har ett antal fördefinierade val, som att satsa, lägga sig eller höja.
>
> Bildklassificering
> Observerbarhet: Fullt observerbart eftersom hela bilden är tillgänglig för AI-agenten.
> Antal agenter: Single-agent eftersom endast ett system analyserar bilden.
> Deterministisk: Systemet klassificerar bilden baserat på fasta regler eller inlärd information, utan slump.
> Episodisk: Varje bild klassificeras oberoende av tidigare eller framtida bilder.
> Statisk: Bildens innehåll förändras inte medan den analyseras.
> Diskret: Systemet väljer mellan ett antal fördefinierade kategorier (t.ex. "katt", "hund").
>
> Självkörande bil i trafiken
> Observerbarhet: Partiellt observerbart eftersom bilen inte kan ha fullständig information om alla andra förares beteenden eller dolda objekt.
> Antal agenter: Multi-agent eftersom flera bilar (agenter) interagerar med varandra i trafiken.
> Stokastisk: Även om bilen kan göra noggranna beräkningar, är det fortfarande osäkert hur andra förare eller väderförhållanden kommer att bete sig.
> Sekventiell: Varje beslut, som att svänga eller bromsa, påverkar framtida situationer på vägen.
> Dynamisk: Trafikmiljön förändras konstant och oberoende av bilen (t.ex. genom andra bilar och trafikljus).
> Kontinuerlig: Hastighet och styrning är kontinuerliga variabler.
>
> Robotdammsugare
> Observerbarhet: Partiellt observerbart eftersom roboten inte kan se hela rummet samtidigt.
> Antal agenter: Single-agent eftersom roboten agerar ensam.
> Stokastisk: Det finns en viss osäkerhet om hur roboten interagerar med hinder eller möbler.
> Sekventiell: Varje rörelse påverkar var roboten är i nästa ögonblick och vilka beslut den kommer att ta.
> Dynamisk: Miljön kan förändras när människor flyttar på saker eller går in i rummet.
> Kontinuerlig: Robotens rörelser är kontinuerliga, eftersom den rör sig genom rummet.
>
> Navigering genom en labyrint
> Observerbarhet: Fullt observerbart om hela labyrinten är synlig för agenten. Om delar är dolda kan det vara partiellt observerbart.
> Antal agenter: Single-agent om endast en agent navigerar genom labyrinten.
> Deterministisk: Varje rörelse har en förutsägbar effekt (t.ex. gå åt vänster flyttar agenten åt vänster).
> Sekventiell: Varje rörelse påverkar agentens nästa position och möjliga val.
> Statisk: Labyrinten förändras inte oberoende av agenten.
> Diskret: Rörelserna sker i diskreta steg (t.ex. upp, ner, vänster, höger).
>
> Diagnos av sjukdom utifrån symptom
> Observerbarhet: Partiellt observerbart eftersom läkaren eller AI-systemet inte kan se alla aspekter av patientens hälsa direkt (dolda faktorer).
> Antal agenter: Single-agent eftersom AI-systemet eller läkaren ensam analyserar symptomen.
> Stokastisk: Diagnosen är inte alltid säker, eftersom olika sjukdomar kan ha liknande symptom.
> Episodisk: Varje diagnos är en separat episod och påverkar inte andra diagnoser.
> Statisk: Miljön (patientens symptom) ändras inte under analysen.
> Diskret: Diagnosen leder till ett val mellan fördefinierade sjukdomar eller tillstånd.

---

[rad]
etikett: Aktivitet
rubrik: Observerbarhet i luffarschack
flöde: ja
- Spela | Spela några partier luffarschack med en kompis.
- Dölj rutor | Spela versionen där några slumpvis valda rutor är dolda.
- Diskutera | Diskutera frågorna som ligger i Teams.
> Nu upplever ni dimension 1 själva: hur förändras spelet när ni inte ser allt?
