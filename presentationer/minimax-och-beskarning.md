---
titel: Minimax-algoritmen och beskärning
kurs: Artificiell Intelligens 1
tema: natt
---

[bildregi]
rubrik: Minimax-algoritmen
etikett: Presentation av David Hedengren
bild: bilder/minimax/original/image1.png
alt: Originalets schackbräde i turkost ljus.
bildläge: hero
säker-yta: 4 12 48 67
mörkning: 0 0 61 100 0.75
startutsnitt: 50 50 1
slututsnitt: 50 50 1
> Bildförslag: prompt 1 i docs/minimax/REGI-OCH-BILDPROMPTER.md. Originalbilden används tills vidare.
> Källa: originalbild 1. Presentation av David Hedengren.
> Originaltext: Minimax-algoritmen

---

[text-bild]
rubrik: Minimax-algoritmen
text: En beslutsfattande algoritm som kan användas för att hitta den bästa strategin i ett spel med två spelare. (t.ex. 3-i-rad eller schack)
bild: bilder/minimax/original/image2.png
- Algoritmen utforskar alla möjliga drag och väljer det som maximerar vinsten och minimerar den största möjliga förlusten
> Källa: originalbild 2. Presentation av David Hedengren.
> Originaltext: Minimax-algoritmen
> Originaltext: En beslutsfattande algoritm som kan användas för att hitta den bästa strategin i ett spel med två spelare. (t.ex. 3-i-rad eller schack)
> Originaltext: Algoritmen utforskar alla möjliga drag och väljer det som maximerar vinsten och minimerar den största möjliga förlusten
> Originaltext: Vi kallar spelarna Max och Min där Max försöker maximera sin vinst
> Originaltext: Och Min försöker minimera Max’s vinst

---

[motsats]
rubrik: Max och Min
- Max | Vi kallar spelarna Max och Min där Max försöker maximera sin vinst
- Min | Och Min försöker minimera Max’s vinst
> Be eleverna beskriva varför Min bedömer samma utfall annorlunda.
> Källa: originalbild 2. Presentation av David Hedengren.
> Originaltext: Minimax-algoritmen
> Originaltext: En beslutsfattande algoritm som kan användas för att hitta den bästa strategin i ett spel med två spelare. (t.ex. 3-i-rad eller schack)
> Originaltext: Algoritmen utforskar alla möjliga drag och väljer det som maximerar vinsten och minimerar den största möjliga förlusten
> Originaltext: Vi kallar spelarna Max och Min där Max försöker maximera sin vinst
> Originaltext: Och Min försöker minimera Max’s vinst

---

[omlopp]
rubrik: Användningsområden
bild: bilder/minimax/original/image3.png
- Spelutveckling | Minimax används för att skapa intelligenta motståndare i spel som schack, dam, tic-tac-toe och andra spel där miljön är fullt observerbar
- Ekonomi | Minimax kan användas i ekonomiska modeller för att förutsäga resultatet av beslut och för att optimera investeringsstrategier
- Robotik | Minimax kan användas för att styra robotar i komplexa miljöer, till exempel för att maximera effektivitet I rörelser och minska energiförbrukning
> Sakgranskning föreslås i regidokumentet; originalets formuleringar är kvar.
> Källa: originalbild 3. Presentation av David Hedengren.
> Originaltext: Användningsområden
> Originaltext: Spelutveckling
> Originaltext: Minimax används för att skapa intelligenta motståndare i spel som schack, dam, tic-tac-toe och andra spel där miljön är fullt observerbar
> Originaltext: Ekonomi
> Originaltext: Minimax kan användas i ekonomiska modeller för att förutsäga resultatet av beslut och för att optimera investeringsstrategier
> Originaltext: Robotik
> Originaltext: Minimax kan användas för att styra robotar i komplexa miljöer, till exempel för att maximera effektivitet I rörelser och minska energiförbrukning

---

[fokus]
rubrik: Begränsningar
- Beräkningskostnad | Kan bli mycket tidskrävande och kräva stora mängder beräkningsresurser, särskilt i spel med stora sökträd och många möjliga drag. Ett sökträd för ett helt parti schack har ca 35^{100} noder
- Kan inte hantera osäkerhet | Minimax fungerar bäst i spel med perfekt information och kan inte hantera dolda eller osäkra faktorer (som i t.ex. poker)
- Motståndarens strategi | Minimax-algoritmen fungerar mindre bra om  om motståndaren inte spelar optimalt.
> Originalets nätverksbild har flyttats till föregående scen där den finns kvar. Se förslag på sakgranskning i regin.
> Källa: originalbild 4. Presentation av David Hedengren.
> Originaltext: Begränsningar
> Originaltext: Beräkningskostnad
> Originaltext: Kan bli mycket tidskrävande och kräva stora mängder beräkningsresurser, särskilt i spel med stora sökträd och många möjliga drag.
> Originaltext: Ett sökträd för ett helt parti schack har ca 35^{100} noder
> Originaltext: Kan inte hantera osäkerhet
> Originaltext: Minimax fungerar bäst i spel med perfekt information och kan inte hantera dolda eller osäkra faktorer (som i t.ex. poker)
> Originaltext: Motståndarens strategi
> Originaltext: Minimax-algoritmen fungerar mindre bra om  om motståndaren inte spelar optimalt.

---

[text-bild]
rubrik: Minimax i 3-i-rad
bild: bilder/minimax/original/image5.png
text: Vi använder ett beslutsträd för att strukturera och analysera spelet
- Varje nod i trädet motsvarar en spelställning
- Varje gren representerar ett möjligt speldrag
- Max och Min turas om att göra sina drag
> Originalets neonbräde är en symbolbild. De exakta spelställningarna visas i diagrammen.
> Källa: originalbild 5. Presentation av David Hedengren.
> Originaltext: Minimax i 3-i-rad
> Originaltext: Varje nod i trädet motsvarar en spelställning
> Originaltext: Varje gren representerar ett möjligt speldrag
> Originaltext: Max och Min turas om att göra sina drag
> Originaltext: Varje lövnod utvärderas med en poängfunktion:
> Originaltext: Vinst för X = 1
> Originaltext: Vinst för 0 = -1
> Originaltext: Oavgjort = 0
> Originaltext: Vi använder ett beslutsträd för att strukturera och analysera spelet

---

[typografi]
etikett: Varje lövnod utvärderas med en poängfunktion:
- statement | Vinst för X = **1** | X
- kontrast | Vinst för 0 = **-1** | 0
- slutsats | Oavgjort = **0** | Oavgjort
> Källa: originalbild 5. Presentation av David Hedengren.
> Originaltext: Minimax i 3-i-rad
> Originaltext: Varje nod i trädet motsvarar en spelställning
> Originaltext: Varje gren representerar ett möjligt speldrag
> Originaltext: Max och Min turas om att göra sina drag
> Originaltext: Varje lövnod utvärderas med en poängfunktion:
> Originaltext: Vinst för X = 1
> Originaltext: Vinst för 0 = -1
> Originaltext: Oavgjort = 0
> Originaltext: Vi använder ett beslutsträd för att strukturera och analysera spelet

---

[bildregi]
rubrik:
text: 
bild: bilder/minimax/original-06.svg
alt: Beslutsträd för 3-i-rad
bildläge: spotlight
beskärning: contain
mörkning: 0 0 0 0 0
säker-yta: 2 0 94 14
övergång: morph
- rot | Rotnod | 45 | 10 | 11 | 17 | Varje nod i trädet motsvarar en spelställning
- drag | Möjliga drag | 6 | 44 | 91 | 18 | Varje gren representerar ett möjligt speldrag
- vidare | Nästa drag | 0 | 61 | 100 | 32 | Max och Min turas om att göra sina drag
> Källa: originalbild 6. Presentation av David Hedengren.
> Originaltext: Rotnod
> Originaltext: Beslutsträd för 3-i-rad

---

[citat]
text: ”Jag baserar mitt drag nu på vad min motståndare kommer göra i nästa drag och för att göra det funderar jag över vad jag skulle göra efter det och så vidare”
bild: bilder/minimax/original/image6.png
etikett: Minimax
> Formuleringen kommer från originalet; ingen extern tillskrivning.
> Källa: originalbild 7. Presentation av David Hedengren.
> Originaltext: ”Jag baserar mitt drag nu på vad min motståndare kommer göra i nästa drag och för att göra det funderar jag över vad jag skulle göra efter det och så vidare”
> Originaltext: Min-värde: 0
> Originaltext: Max-värde: 1
> Originaltext: Max-värde: 0
> Originaltext: Värde: 1
> Originaltext: Värde: 0
> Originaltext: O:s tur

---

[bildregi]
rubrik:
text: 
bild: bilder/minimax/spel-min.svg
alt: O:s tur
bildläge: spotlight
beskärning: contain
mörkning: 0 0 0 0 0
säker-yta: 2 0 94 14
övergång: morph
- lov | Utfallen | 0 | 62 | 100 | 33 | Värde: 1 eller 0
- max | Max väljer | 0 | 36 | 100 | 25 | Max-värde: 1 och Max-värde: 0
- min | Min väljer | 37 | 0 | 44 | 32 | Min-värde: 0
> Källa: originalbild 7. Presentation av David Hedengren.
> Originaltext: ”Jag baserar mitt drag nu på vad min motståndare kommer göra i nästa drag och för att göra det funderar jag över vad jag skulle göra efter det och så vidare”
> Originaltext: Min-värde: 0
> Originaltext: Max-värde: 1
> Originaltext: Max-värde: 0
> Originaltext: Värde: 1
> Originaltext: Värde: 0
> Originaltext: O:s tur

---

[bildregi]
rubrik:
text: 
bild: bilder/minimax/original-08.svg
alt: X:s tur
bildläge: spotlight
beskärning: contain
mörkning: 0 0 0 0 0
säker-yta: 2 0 94 14
övergång: morph
- utfall | Utfallen | 0 | 70 | 100 | 29 | Värde: 1, 0 eller -1
- min | Motståndarens svar | 5 | 31 | 74 | 20 | Min väljer det lägre värdet.
- rot | Beslutet | 39 | 0 | 60 | 45 | Max-värde: 1
> Källa: originalbild 8. Presentation av David Hedengren.
> Originaltext: Värde: 1
> Originaltext: Värde: 0
> Originaltext: Värde: 1
> Originaltext: Värde: 0
> Originaltext: Värde: -1
> Originaltext: Max-värde: 1
> Originaltext: Max-värde: 0
> Originaltext: Min-värde: 0
> Originaltext: Max-värde: 0
> Originaltext: Min-värde: -1
> Originaltext: Max-värde: 1
> Originaltext: X:s tur

---

[etapper]
rubrik: Spela tre-i-rad med grannen
etikett: Aktivitet
- Spela ett parti | Spela ett parti tre-i-rad med grannen. Notera varje drag och dess position på ett papper eller på datorn.
- Välj en spelställning | Välj en specifik spelställning från partiet. Rita ett spelträd som visar alla möjliga drag från denna ställning.
- Analysera | Använd Minimax-algoritmen för att analysera spelträdet. Arbeta bakåt från lövnoderna för att bestämma värdet av tidigare noder. Identifiera det optimala draget baserat på din analys
> Öppna filen ”Lektionsaktivitet – Minimax i Tre-i-rad” från Teams och läs instruktionerna.
> Källa: originalbild 9. Presentation av David Hedengren.
> Originaltext: Aktivitet: Spela tre-i-rad med grannen
> Originaltext: Spela ett parti tre-i-rad med grannen.
> Originaltext: Notera varje drag och dess position på ett papper eller på datorn.
> Originaltext: 2. Välj en specifik spelställning från partiet.
> Originaltext: Rita ett spelträd som visar alla möjliga drag från denna ställning.
> Originaltext: 3. Använd Minimax-algoritmen för att analysera spelträdet.
> Originaltext: Arbeta bakåt från lövnoderna för att bestämma värdet av tidigare noder
> Originaltext: Identifiera det optimala draget baserat på din analys
> Originaltext: Öppna filen ”Lektionsaktivitet – Minimax i Tre-i-rad” från Teams och läs instruktionerna

---

[text-bild]
rubrik: Lektionsaktivitet – Minimax i Tre-i-rad
text: Öppna filen ”Lektionsaktivitet – Minimax i Tre-i-rad” från Teams och läs instruktionerna
bild: bilder/minimax/original/image7.png
> Originalets spelbräde behålls här som illustration. Teams-filen har inte bifogats och är inte inbäddad.
> Källa: originalbild 9. Presentation av David Hedengren.
> Originaltext: Aktivitet: Spela tre-i-rad med grannen
> Originaltext: Spela ett parti tre-i-rad med grannen.
> Originaltext: Notera varje drag och dess position på ett papper eller på datorn.
> Originaltext: 2. Välj en specifik spelställning från partiet.
> Originaltext: Rita ett spelträd som visar alla möjliga drag från denna ställning.
> Originaltext: 3. Använd Minimax-algoritmen för att analysera spelträdet.
> Originaltext: Arbeta bakåt från lövnoderna för att bestämma värdet av tidigare noder
> Originaltext: Identifiera det optimala draget baserat på din analys
> Originaltext: Öppna filen ”Lektionsaktivitet – Minimax i Tre-i-rad” från Teams och läs instruktionerna

---

[bildregi]
rubrik:
text: 
bild: bilder/minimax/original-10.svg
alt: Spelträdet från originalet
bildläge: spotlight
beskärning: contain
mörkning: 0 0 0 0 0
säker-yta: 2 0 94 14
övergång: morph
- rot | X:s tur | 34 | 0 | 25 | 30 | = max (vinst = 1)
- niva | O:s svar | 5 | 23 | 90 | 27 | = min (vinst = -1)
- lov | Jämför utfallen | 0 | 49 | 100 | 47 | Följ värdena tillbaka till roten.
> Källa: originalbild 10. Presentation av David Hedengren.
> Originaltext: = min (vinst = -1)
> Originaltext: = max (vinst = 1)
> Originaltext: 1
> Originaltext: 1
> Originaltext: 0
> Originaltext: 0
> Originaltext: -1
> Originaltext: -1
> Originaltext: 0
> Originaltext: 1
> Originaltext: 1
> Originaltext: 0
> Originaltext: 0
> Originaltext: -1
> Originaltext: 0
> Originaltext: 0
> Originaltext: (X:s tur)

---

[egen: resonemang-i-bild]
rubrik: Generell version av minimax-algoritmen
etikett: Från spelställningar till värden
bild: bilder/minimax/max-0.svg
alt: Generell version av minimax-algoritmen
text: Vilket värde får rotnoden?
övergång: morph
rörelse: tona
fokus: ingen
- MAX väljer | bilder/minimax/max-1.svg | 4 är störst av 4, 3 och 2.
> Källa: originalbild 11. Presentation av David Hedengren.
> Originaltext: Generell version av minimax-algoritmen
> Originaltext: Max drag
> Originaltext: Min drag
> Originaltext: 4
> Originaltext: 3
> Originaltext: 2
> Originaltext: 4
> Originaltext: 4

---

[egen: resonemang-i-bild]
rubrik: Generell version av minimax-algoritmen
etikett: Ett värde per klick
bild: bilder/minimax/minimax-0.svg
alt: Generell version av minimax-algoritmen
text: Räkna från löven uppåt. Stanna före varje klick och låt gruppen föreslå ett värde.
övergång: morph
rörelse: tona
fokus: ingen
- MIN: gren 1 | bilder/minimax/minimax-1.svg | min(8, 5, 6) = 5
- MIN: gren 2 | bilder/minimax/minimax-2.svg | min(9, 3, 7) = 3
- MIN: gren 3 | bilder/minimax/minimax-3.svg | min(2, 4, 6) = 2
- MAX: roten | bilder/minimax/minimax-4.svg | max(5, 3, 2) = 5
> Källa: originalbild 12. Presentation av David Hedengren.
> Originaltext: Generell version av minimax-algoritmen
> Originaltext: 5
> Originaltext: 5
> Originaltext: 3
> Originaltext: 2
> Originaltext: 8
> Originaltext: 5
> Originaltext: 6
> Originaltext: 9
> Originaltext: 3
> Originaltext: 7
> Originaltext: 2
> Originaltext: 4
> Originaltext: 6
> Originaltext: 5
> Originaltext: 3
> Originaltext: 2

---

[egen: resonemang-i-bild]
rubrik: Vilket värde får rotnoden?
etikett: Uppgift
bild: bilder/minimax/uppgift-rot.svg
alt: Vilket värde får rotnoden?
text: Arbeta från lövnoderna mot roten.
övergång: morph
rörelse: tona
fokus: ingen
- Originalets facit | bilder/minimax/original-13.svg | Följ växlingen mellan MIN och MAX. Roten i detta träd är MIN.
> Källa: originalbild 13. Presentation av David Hedengren.
> Originaltext: Uppgift – Vilket värde får rotnoden?
> Originaltext: 4
> Originaltext: 3
> Originaltext: 2
> Originaltext: 6
> Originaltext: 6
> Originaltext: 1
> Originaltext: 5
> Originaltext: 2
> Originaltext: 2
> Originaltext: 3
> Originaltext: 6
> Originaltext: 9
> Originaltext: 9
> Originaltext: 2
> Originaltext: 2
> Originaltext: 1
> Originaltext: 0
> Originaltext: 4
> Originaltext: 8
> Originaltext: 8
> Originaltext: 6
> Originaltext: 4
> Originaltext: 2
> Originaltext: 1
> Originaltext: 1
> Originaltext: 1
> Originaltext: 4
> Originaltext: 3
> Originaltext: 2
> Originaltext: 6
> Originaltext: 1
> Originaltext: 5
> Originaltext: 2
> Originaltext: 2
> Originaltext: 3
> Originaltext: 6
> Originaltext: 9
> Originaltext: 2
> Originaltext: 1
> Originaltext: 2
> Originaltext: 4
> Originaltext: 8
> Originaltext: 6
> Originaltext: 3
> Originaltext: 1
> Originaltext: 4
> Originaltext: 3
> Originaltext: 2
> Originaltext: 4
> Originaltext: 2
> Originaltext: 2

---

[egen: resonemang-i-bild]
rubrik: Alfa-beta-beskärning (pruning)
etikett: Följ sökningen
bild: bilder/minimax/beskar-0.svg
alt: Alfa-beta-beskärning (pruning)
text: Samma träd, nu undersökt från vänster till höger.
övergång: morph
rörelse: tona
fokus: ingen
- Första lövet | bilder/minimax/beskar-1.svg | Värdet 8 är nu undersökt.
- MIN uppdaterar | bilder/minimax/beskar-2.svg | Värdet 5 är lägre än 8.
- Vänstra grenen | bilder/minimax/beskar-3.svg | min(8, 5, 6) = 5.
- Ett säkrat alternativ | bilder/minimax/beskar-4.svg | MAX kan välja en gren med värdet 5.
- Mittenvägen | bilder/minimax/beskar-5.svg | Först ser vi 9. Det räcker inte för att avgöra grenen.
- Här beskär vi | bilder/minimax/beskar-6.svg | Kommer inte kunna vara högre än 3, Max kommer därför inte välja mittenvägen (eftersom 5>3)
- Högra vägen | bilder/minimax/beskar-7.svg | De sista två grenarna kan också beskäras eftersom oavsett vad de har för värde kommer inte Max välja den högra vägen
- Samma beslut | bilder/minimax/beskar-8.svg | Vi kan beskära (prune) trädet här och behöver inte utforska några grenar nedanför
> Källa: originalbild 14. Presentation av David Hedengren.
> Originaltext: Alfa-beta-beskärning (pruning)
> Originaltext: 5
> Originaltext: 5
> Originaltext: ≤3
> Originaltext: ≤2
> Originaltext: 8
> Originaltext: 5
> Originaltext: 6
> Originaltext: 9
> Originaltext: 3
> Originaltext: 7
> Originaltext: 2
> Originaltext: 4
> Originaltext: 6
> Originaltext: 5
> Originaltext: 3
> Originaltext: 2
> Originaltext: Kommer inte kunna vara högre än 3, Max kommer därför inte välja mittenvägen (eftersom 5>3)
> Originaltext: X
> Originaltext: Vi kan beskära (prune) trädet här och behöver inte utforska några grenar nedanför
> Originaltext: X
> Originaltext: X
> Originaltext: De sista två grenarna kan också beskäras eftersom oavsett vad de har för värde kommer inte Max välja den högra vägen

---

[fokus]
rubrik: Varför beskärning?
- Minskad beräkningskostnad | Alfa-beta beskärning reducerar antalet noder som måste utforskas i spelträdet genom att eliminera grenar som inte påverkar det slutliga resultatet. Detta gör Minimax betydligt snabbare och mer effektiv.
- Djupare träd | Gör det möjligt att utforska djupare träd
- Snabbare beslut | Genom att undvika utforskning av irrelevanta grenar, kan algoritmen fatta beslut snabbare. Detta är särskilt viktigt i komplexa spel som schack, där antalet möjliga drag kan bli astronomiskt stort.
> Källa: originalbild 15. Presentation av David Hedengren.
> Originaltext: Varför beskärning?
> Originaltext: Minskad beräkningskostnad
> Originaltext: Alfa-beta beskärning reducerar antalet noder som måste utforskas i spelträdet genom att eliminera grenar som inte påverkar det slutliga resultatet. Detta gör Minimax betydligt snabbare och mer effektiv.
> Originaltext: Djupare träd
> Originaltext: Gör det möjligt att utforska djupare träd
> Originaltext: Snabbare beslut
> Originaltext: Genom att undvika utforskning av irrelevanta grenar, kan algoritmen fatta beslut snabbare. Detta är särskilt viktigt i komplexa spel som schack, där antalet möjliga drag kan bli astronomiskt stort.

---

[fokus]
rubrik: Alfa- och betavärden
text: Algoritmen tilldelar varje nod ett alfavärde (α) och ett betavärde β och gör en Depth First Search i trädet.
- Alfa: α | Alfavärdet (α) är det hittills bästa värde som Max kan garantera. Från början ges noden alfavärdet (α=−∞) och uppdateras vid maxnoder om ett högre värde hittats.
- Beta: β | Betavärdet (β) är det hittills bästa värde som Min kan garantera. Betavärdet sätts från början till β=+∞ och uppdateras vid minnoder om ett lägre värde hittats.
> Källa: originalbild 16. Presentation av David Hedengren.
> Originaltext: Alfa- och betavärden
> Originaltext: Algoritmen tilldelar varje nod ett alfavärde (𝛼) och ett betavärde 𝛽 och gör en Depth First Search i trädet.
> Originaltext: Alfavärdet (𝛼) är det hittills bästa värde som Max kan garantera.
> Originaltext: Från början ges noden alfavärdet (𝛼=−∞) och uppdateras vid maxnoder om ett högre värde hittats.
> Originaltext: Betavärdet (𝛽) är det hittills bästa värde som Min kan garantera.
> Originaltext: Betavärdet sätts från början till 𝛽=+∞ och uppdateras vid minnoder om ett lägre värde hittats.
> Originaltext: Om 𝛼≥𝛽 behöver grenen inte utforskas mer och kan beskäras.

---

[formel]
rubrik: När kan vi beskära?
formel: α ≥ β
- α | Det hittills bästa värde som Max kan garantera.
- β | Det hittills bästa värde som Min kan garantera.
slutsats: Om α≥β behöver grenen inte utforskas mer och kan beskäras.
> Källa: originalbild 16. Presentation av David Hedengren.
> Originaltext: Alfa- och betavärden
> Originaltext: Algoritmen tilldelar varje nod ett alfavärde (𝛼) och ett betavärde 𝛽 och gör en Depth First Search i trädet.
> Originaltext: Alfavärdet (𝛼) är det hittills bästa värde som Max kan garantera.
> Originaltext: Från början ges noden alfavärdet (𝛼=−∞) och uppdateras vid maxnoder om ett högre värde hittats.
> Originaltext: Betavärdet (𝛽) är det hittills bästa värde som Min kan garantera.
> Originaltext: Betavärdet sätts från början till 𝛽=+∞ och uppdateras vid minnoder om ett lägre värde hittats.
> Originaltext: Om 𝛼≥𝛽 behöver grenen inte utforskas mer och kan beskäras.

---

[egen: resonemang-i-bild]
rubrik: Beta ≤ Alfa
etikett: Koppla regeln till trädet
bild: bilder/minimax/beskar-4.svg
alt: Beta ≤ Alfa
text: MAX har α = 5. Visa var stoppvillkoret blir sant.
övergång: morph
rörelse: tona
fokus: ingen
- Mitten: β = 3 | bilder/minimax/beskar-6.svg | Beta ≤ Alfa, Vi behöver inte fortsätta söka i grenen
- Höger: β = 2 | bilder/minimax/beskar-7.svg | Beta ≤ Alfa, Vi behöver inte fortsätta söka i grenen
- Rotens värde: 5 | bilder/minimax/beskar-8.svg | De beskurna grenarna behöver inte utvärderas.
> Källa: originalbild 17. Presentation av David Hedengren.
> Originaltext: 𝛼=𝛽=
> Originaltext: −∞+∞
> Originaltext: 8
> Originaltext: 5
> Originaltext: 6
> Originaltext: 9
> Originaltext: 3
> Originaltext: 7
> Originaltext: 2
> Originaltext: 4
> Originaltext: 6
> Originaltext: 5
> Originaltext: 3
> Originaltext: 2
> Originaltext: X
> Originaltext: X
> Originaltext: X
> Originaltext: 𝛼=𝛽=
> Originaltext: 5
> Originaltext: +∞
> Originaltext: 8
> Originaltext: −∞8
> Originaltext: −∞5
> Originaltext: 5
> Originaltext: 5
> Originaltext: 𝛼=𝛽=
> Originaltext: −∞+∞
> Originaltext: 5+∞
> Originaltext: 5
> Originaltext: 9
> Originaltext: 5
> Originaltext: 3
> Originaltext: 9
> Originaltext: 3
> Originaltext: Beta≤ Alfa , Vi behöver inte fortsätta söka i grenen
> Originaltext: 𝛼=𝛽=
> Originaltext: 5+∞
> Originaltext: 2
> Originaltext: 52
> Originaltext: Beta≤ Alfa , Vi behöver inte fortsätta söka i grenen

---

[egen: resonemang-i-bild]
rubrik: Vilka grenar kan beskäras?
etikett: Aktivitet
bild: bilder/minimax/ovning-0.svg
alt: Vilka grenar kan beskäras?
text: Sök från vänster till höger. Markera det ni kan hoppa över och förklara varför.
övergång: morph
rörelse: tona
fokus: ingen
> Källa: originalbild 18. Presentation av David Hedengren.
> Originaltext: Aktivitet – Vilka grenar kan beskäras?
> Originaltext: 2
> Originaltext: 2
> Originaltext: 3
> Originaltext: 3
> Originaltext: 5
> Originaltext: 8
> Originaltext: 7
> Originaltext: 1

---

[egen: resonemang-i-bild]
rubrik: Vilka grenar kan beskäras?
etikett: Facit · ett steg per klick
bild: bilder/minimax/ovning-0.svg
alt: Vilka grenar kan beskäras?
text: Återkoppla ett resonemang i taget.
övergång: morph
rörelse: tona
fokus: ingen
- Vänstra MAX | bilder/minimax/ovning-1.svg | max(5, 3) = 5. MIN får β = 5.
- Beskär ett löv | bilder/minimax/ovning-2.svg | 8 räcker för att avstå grenen. Lövet 2 behöver inte undersökas.
- Vänstra MIN | bilder/minimax/ovning-3.svg | 5 blir ett säkrat alternativ för roten.
- Högra sidan | bilder/minimax/ovning-4.svg | max(7, 1) = 7.
- Sista MAX | bilder/minimax/ovning-5.svg | max(2, 3) = 3.
- Högra MIN | bilder/minimax/ovning-6.svg | min(7, 3) = 3.
- Roten | bilder/minimax/ovning-7.svg | max(5, 3) = 5.
> Källa: originalbild 19. Presentation av David Hedengren.
> Originaltext: Aktivitet – Vilka grenar kan beskäras?
> Originaltext: 5
> Originaltext: 5
> Originaltext: 5
> Originaltext: 8
> Originaltext: 7
> Originaltext: 2
> Originaltext: 2
> Originaltext: 2
> Originaltext: 2
> Originaltext: 3
> Originaltext: 3
> Originaltext: 5
> Originaltext: 8
> Originaltext: 7
> Originaltext: 1
> Godkänd rättelse: originalbild 19 anger 2 i MAX-noden över löven 2 och 3 samt i MIN-noden ovanför. Båda är rättade till 3 efter användarens godkännande 2026-10-13. Roten är fortfarande 5.

---

[egen: resonemang-i-bild]
rubrik: Hur många noder behöver utforskas?
etikett: Aktivitet
bild: bilder/minimax/rakna-noder.svg
alt: Hur många noder behöver utforskas?
text: Räkna besökta noder inklusive roten. Följ grenarna från vänster till höger.
övergång: morph
rörelse: tona
fokus: ingen
> Källa: originalbild 20. Presentation av David Hedengren.
> Originaltext: Aktivitet – Hur många noder behöver utforskas?
> Originaltext: 0
> Originaltext: 1
> Originaltext: 3
> Originaltext: 4
> Originaltext: 1
> Originaltext: 3
> Originaltext: 1
> Originaltext: 5
> Originaltext: 3
> Originaltext: 5
> Originaltext: 1
> Originaltext: 2
> Originaltext: 5

---

[punkter]
rubrik: Monte Carlo Tree Search (MCTS)
etikett: Extrauppgift
text: Bekanta dig med sökalgoritmen MCTS genom att söka på internet och/eller titta på klippet nedan
- Jämför MCTS och Minimax.
- Vad finns det för likheter/skillnader?
- Vad finns det för för- och nackdelar med respektive algoritm?
@text 144 945 1600 60 storlek=24 färg=dampad | Monte Carlo Tree Search: https://www.youtube.com/watch?v=lhFXKNyA0QA
> Originalets videolänk: https://www.youtube.com/watch?v=lhFXKNyA0QA
> Klippet bäddas inte in; länken finns också i regidokumentet.
> Källa: originalbild 21. Presentation av David Hedengren.
> Originaltext: Extrauppgift – Monte Carlo Tree Search algoritmen (MCTS)
> Originaltext: Bekanta dig med sökalgoritmen MCTS genom att söka på internet och/eller titta på klippet nedan
> Originaltext: Jämför MCTS och Minimax.
> Originaltext: Vad finns det för likheter/skillnader?
> Originaltext: Vad finns det för för- och nackdelar med respektive algoritm?
> Originaltext: Monte Carlo Tree Search
