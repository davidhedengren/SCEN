---
titel: AI-agenter och miljöer
tema: atlas
---

[omslag]
etikett: David Hedengren
rubrik: Introduktion till AI-agenter och miljöer
tal: 01
bild: bilder/ai-agenter/ai01.jpg

---

[definition]
etikett: Vad är en AI-agent?
rubrik: AI-agent
text: Ett system som kan uppfatta sin omgivning (med t.ex. **sensorer** eller genom att analysera data), fatta beslut och vidta åtgärder (med **aktuatorer**).
> Den interagerar med sin miljö, samlar in information och reagerar på förändringar.
> Fråga klassen efter exempel på sensorer och aktuatorer.

---

[triad]
rubrik: Vad är en AI-agent?
bild: bilder/ai-agenter/ai02.jpg
- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.
- Perception | Samlar in data om sin omgivning genom sensorer eller annan inmatning.
- Målorientering | Använder sin autonomi och perception för att fatta beslut och ta de bästa möjliga åtgärderna för att nå sitt mål.
slutsats: En rationell agent strävar alltid efter att fatta **de bästa besluten** för att uppnå sina mål.

---

[bildkant]
etikett: Miljöer
rubrik: Olika typer av AI-miljöer
text: Det finns olika typer av miljöer där AI-agenter kan verka. De kan klassificeras enligt flera dimensioner som påverkar hur agenten interagerar med sin omgivning och fattar beslut.
bild: bilder/ai-agenter/ai03.jpg

---

[karta]
rubrik: Olika typer av AI-miljöer
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 1
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[bildkant]
etikett: Dimension 1
rubrik: Fullständigt observerbara miljöer
text: Agenten har tillgång till all information om miljön. Den kan se allt som händer och fatta beslut baserat på komplett kunskap.
bild: bilder/ai-agenter/ai04.jpg
- **Fördel:** enkel modellering, inga osäkerhetsfaktorer.
- **Nackdel:** orealistisk i verkliga scenarier.

---

[bildkant]
etikett: Dimension 1
rubrik: Partiellt observerbara miljöer
text: Agenten har bara delvis information om miljön och måste hantera osäkerhet och göra antaganden.
bild: bilder/ai-agenter/ai05.jpg
bild-vänster: ja
- **Sensordata:** agenten samlar in information genom sensorer.
- **Okänd information:** det finns alltid information som är osynlig för agenten.
- **Beslutsfattande:** agenten måste fatta beslut med ofullständig information.

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 2
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[bildkant]
etikett: Dimension 2
rubrik: Singelagentmiljö
text: Endast en agent interagerar med miljön och behöver inte koordinera med andra agenter.
bild: bilder/ai-agenter/ai06.jpg
- **Fördelar:** enkelhet, och effektivt eftersom det inte finns någon konkurrens.
- **Nackdelar:** begränsad kapacitet och begränsad tillämpbarhet.

---

[bildkant]
etikett: Dimension 2
rubrik: Multiagentmiljö
text: Flera agenter interagerar med miljön, men också med varandra.
bild: bilder/ai-agenter/ai07.jpg
bild-vänster: ja
- **Fördelar:** ökad effektivitet, flexibilitet i problemlösning och samarbete för att nå gemensamma mål.
- **Nackdelar:** komplexitet i koordinering, risk för konflikter och utmaningar i beslutsfattande.

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 3
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[motsats]
etikett: Dimension 3
rubrik: Statisk/dynamisk miljö
bild: bilder/ai-agenter/ai08.jpg
- Statisk | En statisk miljö förändras inte med tiden, utom när agenten interagerar med den.
- Dynamisk | En dynamisk miljö förändras hela tiden, oavsett om agenten agerar eller inte.
- Exempel | Ett schackspel är statiskt, medan trafikmiljön är dynamisk och förändras oavsett vad en självkörande bil gör.

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 4
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[motsats]
etikett: Dimension 4
rubrik: Deterministiska/stokastiska miljöer
bild: bilder/ai-agenter/ai09.jpg
bild-vänster: ja
- Deterministisk | I en deterministisk miljö är utfallet av en viss handling alltid förutsägbart.
- Stokastisk | I en stokastisk miljö innehåller handlingar en viss grad av slump eller osäkerhet.
- Exempel | Ett schackspel är deterministiskt, medan ett kortspel som poker är stokastiskt.

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 5
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[motsats]
etikett: Dimension 5
rubrik: Diskreta/kontinuerliga miljöer
bild: bilder/ai-agenter/ai10.jpg
band: ja
- Diskret | I en diskret miljö är tillstånden och handlingarna indelade i separata steg eller enheter.
- Kontinuerlig | I en kontinuerlig miljö är både tillstånd och handlingar oändligt många, utan tydliga avgränsningar.
- Exempel | Schack är en diskret miljö, medan robotik i verkligheten är en kontinuerlig miljö.

---

[karta]
rubrik: Olika typer av AI-miljöer
aktiv: 6
steg: nej
- Fullständigt/partiellt observerbar
- Singel/multiagent
- Statisk/dynamisk
- Deterministisk/stokastisk
- Diskret/kontinuerlig
- Episodisk/sekventiell

---

[motsats]
etikett: Dimension 6
rubrik: Episodiska/sekventiella miljöer
bild: bilder/ai-agenter/ai11.jpg
- Episodisk | I en episodisk miljö är varje handling fristående och påverkar inte framtida handlingar.
- Sekventiell | I en sekventiell miljö påverkar varje handling framtida tillstånd och beslut.
- Exempel | Bildklassificering är episodisk, medan ett planeringsproblem för en självkörande bil är sekventiellt.

---

[omslag]
etikett: Sammanfattning
rubrik: Att välja rätt modell för AI-miljön är avgörande för att designa effektiva AI-system.
text: AI-agenter verkar i olika miljöer med olika egenskaper. Att förstå dessa egenskaper är avgörande för att designa effektiva AI-system som kan navigera i komplexa och dynamiska omvärldar.
bild: bilder/ai-agenter/ai12.jpg

---

[tabell]
rubrik: Övning i par: fyll i och diskutera tabellen
visa: facit-rader
| Uppgift | Fullt/partiellt\nobserverbart | Singel/\nmultiagent | Deterministisk/\nstokastisk | Episodisk/\nsekventiell | Statiskt/\ndynamiskt | Diskret/\nkontinuerligt |
| Schack mot dator | Fullt | Singel | Deterministisk | Sekventiell | Statisk | Diskret |
| Korsord | Fullt | Singel | Deterministisk | Episodisk | Statisk | Diskret |
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
> Antal agenter: Single-agent om det är spelaren mot datorn, men eftersom datorn också räknas som en agent kan det tolkas som multi-agent. I detta fall fokuserar vi på en persons perspektiv mot en AI.
> Deterministisk: Alla drag och deras konsekvenser är förutsägbara och leder till ett bestämt utfall.
> Sekventiell: Varje drag påverkar brädets framtida tillstånd, så alla beslut måste tas med hänsyn till kommande drag.
> Statisk: Brädets tillstånd förändras inte utanför agenternas kontroll.
> Diskret: Schack har ett begränsat antal möjliga drag och tillstånd.
>
> Korsord
> Observerbarhet: Fullt observerbart eftersom alla rutor och ledtrådar är synliga och tillgängliga för spelaren från början.
> Antal agenter: Single-agent eftersom en person vanligtvis löser korsordet ensam. (Flera personer kan hjälpa till, men det betraktas som en enskild agentuppgift).
> Deterministisk: Lösningarna är deterministiska eftersom varje korrekt ord har en fast plats i rutnätet och påverkar andra ord förutsägbart.
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

[tidslinje]
rubrik: Aktivitet: observerbarhet i luffarschack
- 1 | Spela några partier luffarschack med en kompis.
- 2 | Spela sedan den modifierade versionen där vissa slumpmässigt valda rutor är dolda.
- 3 | Diskutera frågorna som ligger i Teams.
