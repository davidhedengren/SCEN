---
titel: Minimax-algoritmen och beskärning
kurs: Artificiell Intelligens 1
tema: natt
---

[bildregi]
rubrik: Minimax-algoritmen
etikett: Presentation av David Hedengren
bild: bilder/minimax/minimax-ett-drag.png
alt: Ett schackbräde till höger med två kungar i turkost och varmt ljus; en hand står inför ett drag.
bildläge: hero
säker-yta: 4 18 41 62
mörkning: 0 0 0 0 0
startutsnitt: 50 50 1
slututsnitt: 50 50 1
rörelse: ingen
rubrikrörelse: tona
> Den nya bilden ersätter titelmotivet. Originalmotivet finns bevarat i bilder/minimax/original/image1.png.
> Källa: originalbild 1. Presentation av David Hedengren.
> Originaltext: Minimax-algoritmen

---

[egen: bild-och-forklaring]
rubrik: Minimax-algoritmen
bild: bilder/minimax/original/image2.png
alt: Minimax-algoritmen
text: En beslutsfattande algoritm som kan användas för att hitta den bästa strategin i ett spel med två spelare. (t.ex. 3-i-rad eller schack)
rörelse: tona
fokus: ingen
- Algoritmen | Algoritmen utforskar alla möjliga drag och väljer det som maximerar vinsten och minimerar den största möjliga förlusten
- Max | Vi kallar spelarna Max och Min där Max försöker maximera sin vinst
- Min | Och Min försöker minimera Max’s vinst
> Källa: originalbild 2. Presentation av David Hedengren.
> Originaltext: Minimax-algoritmen
> Originaltext: En beslutsfattande algoritm som kan användas för att hitta den bästa strategin i ett spel med två spelare. (t.ex. 3-i-rad eller schack)
> Originaltext: Algoritmen utforskar alla möjliga drag och väljer det som maximerar vinsten och minimerar den största möjliga förlusten
> Originaltext: Vi kallar spelarna Max och Min där Max försöker maximera sin vinst
> Originaltext: Och Min försöker minimera Max’s vinst

---

[egen: bild-och-forklaring]
rubrik: Användningsområden
bild: bilder/minimax/original/image3.png
alt: Användningsområden
text:
rörelse: tona
fokus: ingen
- Spelutveckling | Minimax används för att skapa intelligenta motståndare i spel som schack, dam, tic-tac-toe och andra spel där miljön är fullt observerbar
- Ekonomi | Minimax kan användas i ekonomiska modeller för att förutsäga resultatet av beslut och för att optimera investeringsstrategier
- Robotik | Minimax kan användas för att styra robotar i komplexa miljöer, till exempel för att maximera effektivitet I rörelser och minska energiförbrukning
> Källa: originalbild 3. Presentation av David Hedengren.
> Originaltext: Användningsområden
> Originaltext: Spelutveckling
> Originaltext: Minimax används för att skapa intelligenta motståndare i spel som schack, dam, tic-tac-toe och andra spel där miljön är fullt observerbar
> Originaltext: Ekonomi
> Originaltext: Minimax kan användas i ekonomiska modeller för att förutsäga resultatet av beslut och för att optimera investeringsstrategier
> Originaltext: Robotik
> Originaltext: Minimax kan användas för att styra robotar i komplexa miljöer, till exempel för att maximera effektivitet I rörelser och minska energiförbrukning

---

[egen: bild-och-forklaring]
rubrik: Begränsningar
bild: bilder/minimax/original/image3.png
alt: Begränsningar
text:
rörelse: tona
fokus: ingen
- Beräkningskostnad | Kan bli mycket tidskrävande och kräva stora mängder beräkningsresurser, särskilt i spel med stora sökträd och många möjliga drag. Ett sökträd för ett helt parti schack har ca 35^{100} noder
- Kan inte hantera osäkerhet | Minimax fungerar bäst i spel med perfekt information och kan inte hantera dolda eller osäkra faktorer (som i t.ex. poker)
- Motståndarens strategi | Minimax-algoritmen fungerar mindre bra om  om motståndaren inte spelar optimalt.
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

[egen: bild-och-forklaring]
rubrik: Minimax i 3-i-rad
bild: bilder/minimax/original/image5.png
alt: Minimax i 3-i-rad
text: Vi använder ett beslutsträd för att strukturera och analysera spelet
rörelse: tona
fokus: ingen
- Nod | Varje nod i trädet motsvarar en spelställning
- Gren | Varje gren representerar ett möjligt speldrag
- Max och Min | Max och Min turas om att göra sina drag
- Poängfunktion | Varje lövnod utvärderas med en poängfunktion: Vinst för X = 1. Vinst för 0 = -1. Oavgjort = 0.
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

[egen: resonemang-i-bild]
rubrik: Beslutsträd för 3-i-rad
bild: bilder/minimax/v2/speltrad-0.svg
alt: Tre-i-rad: ett tomt bräde, nio möjliga första drag och nästa nivå av trädet.
text: Varje nod är en spelställning. Varje gren är ett möjligt drag.
fokus: ingen
rörelse: ingen
övergång: tona
- Rotnod | bilder/minimax/v2/speltrad-1.svg | Varje nod motsvarar en spelställning.
- Möjliga drag | bilder/minimax/v2/speltrad-2.svg | Varje gren representerar ett möjligt speldrag.
- Fortsätt trädet | bilder/minimax/v2/speltrad-3.svg | Efter ett drag följer motståndarens möjliga svar.
> Källa: originalbild 6. Presentation av David Hedengren.
> Originaltext: Rotnod
> Originaltext: Beslutsträd för 3-i-rad

---

[egen: resonemang-i-bild]
rubrik:
bild: bilder/minimax/v2/spel-7-0.svg
alt: O väljer mellan två fortsättningar med minimaxvärdena 1 och 0.
text: O:s tur. Följ värdena från löven till roten.
fokus: ingen
rörelse: ingen
övergång: tona
- Lövnoderna | bilder/minimax/v2/spel-7-1.svg | Vinst för X = 1. Oavgjort = 0.
- Max väljer | bilder/minimax/v2/spel-7-2.svg | Max-värde: 1 i den vänstra grenen, 0 i den högra.
- Min väljer | bilder/minimax/v2/spel-7-3.svg | Min-värde: 0. O väljer utfallet som är sämst för X.
> Källa: originalbild 7. Presentation av David Hedengren.
> Originaltext: ”Jag baserar mitt drag nu på vad min motståndare kommer göra i nästa drag och för att göra det funderar jag över vad jag skulle göra efter det och så vidare”
> Originaltext: Min-värde: 0
> Originaltext: Max-värde: 1
> Originaltext: Max-värde: 0
> Originaltext: Värde: 1
> Originaltext: Värde: 0
> Originaltext: O:s tur

---

[egen: resonemang-i-bild]
rubrik:
bild: bilder/minimax/v2/spel-8-0.svg
alt: X har tre möjliga drag med minimaxvärdena 0, -1 och 1.
text: X:s tur. Följ hur Max och Min värderar de möjliga utfallen.
fokus: ingen
rörelse: ingen
övergång: tona
- Vänstra grenens utfall | bilder/minimax/v2/spel-8-1.svg | De två utfallen är 1 och 0.
- Min-värde: 0 | bilder/minimax/v2/spel-8-2.svg | Max väljer 1 respektive 0; Min väljer sedan 0.
- Min-värde: -1 | bilder/minimax/v2/spel-8-3.svg | I mitten kan Min nå utfallet -1.
- Värde: 1 | bilder/minimax/v2/spel-8-4.svg | Det högra draget ger en direkt vinst för X.
- Max-värde: 1 | bilder/minimax/v2/spel-8-5.svg | Max väljer det största värdet: 1.
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

[egen: bild-och-forklaring]
rubrik: Aktivitet: Spela tre-i-rad med grannen
bild: bilder/minimax/original/image7.png
alt: Aktivitet: Spela tre-i-rad med grannen
text: Öppna filen ”Lektionsaktivitet – Minimax i Tre-i-rad” från Teams och läs instruktionerna
rörelse: tona
fokus: ingen
- 1. Spela | Spela ett parti tre-i-rad med grannen. Notera varje drag och dess position på ett papper eller på datorn.
- 2. Välj en spelställning | Välj en specifik spelställning från partiet. Rita ett spelträd som visar alla möjliga drag från denna ställning.
- 3. Analysera | Använd Minimax-algoritmen för att analysera spelträdet. Arbeta bakåt från lövnoderna för att bestämma värdet av tidigare noder. Identifiera det optimala draget baserat på din analys
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

[egen: resonemang-i-bild]
rubrik:
bild: bilder/minimax/v2/spel-10-0.svg
alt: Spelträdet för tre-i-rad med växling mellan Max och Min.
text: Max: vinst = 1 · Min: vinst = -1 · X:s tur
fokus: ingen
rörelse: ingen
övergång: tona
- Lövnoder | bilder/minimax/v2/spel-10-1.svg | Börja med de färdiga spelens värden.
- Max | bilder/minimax/v2/spel-10-2.svg | Välj det största värdet bland barnen.
- Min | bilder/minimax/v2/spel-10-3.svg | Välj det minsta värdet bland barnen.
- Roten | bilder/minimax/v2/spel-10-4.svg | Max-värde: 0. Bästa motspel leder till oavgjort.
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
bild: bilder/minimax/v2/val-0.svg
alt: Max väljer mellan värdena 4, 3 och 2.
text: ▲ Max drag · ▼ Min drag
fokus: ingen
rörelse: ingen
övergång: tona
- Max drag | bilder/minimax/v2/val-1.svg | max(4, 3, 2) = 4
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
bild: bilder/minimax/v2/minimax-0.svg
alt: Spelträd med tre grenar och bladvärdena 8, 5, 6; 9, 3, 7; 2, 4, 6.
text: Alla lövvärden syns. Räkna från löven mot roten.
fokus: ingen
rörelse: ingen
övergång: tona
- Vänster | bilder/minimax/v2/minimax-1.svg | min(8, 5, 6) = 5
- Mitten | bilder/minimax/v2/minimax-2.svg | min(9, 3, 7) = 3
- Höger | bilder/minimax/v2/minimax-3.svg | min(2, 4, 6) = 2
- Roten | bilder/minimax/v2/minimax-4.svg | max(5, 3, 2) = 5
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
rubrik: Uppgift – Vilket värde får rotnoden?
bild: bilder/minimax/v2/rotnod-0.svg
alt: Spelträd med MIN i roten; övning i att beräkna nodvärden.
text: Låt eleverna räkna först. Klicka sedan fram en nivå i taget.
fokus: ingen
rörelse: ingen
övergång: tona
- Första nivån | bilder/minimax/v2/rotnod-1.svg | Jämför löven under varje MAX-nod.
- Nästa nivå | bilder/minimax/v2/rotnod-2.svg | MIN väljer det minsta värdet i varje gren.
- Nivån under roten | bilder/minimax/v2/rotnod-3.svg | MAX väljer det största barnvärdet.
- Rotnoden | bilder/minimax/v2/rotnod-4.svg | Roten är MIN i detta träd. Värdet är 2.
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
bild: bilder/minimax/v2/beskarning-0.svg
alt: Samma spelträd där tre grenar kan beskäras.
text: Vänstra grenen ger 5. Kan någon av de andra grenarna bli bättre för Max?
fokus: ingen
rörelse: ingen
övergång: tona
- Mittenvägen | bilder/minimax/v2/beskarning-1.svg | Kommer inte kunna vara högre än 3, Max kommer därför inte välja mittenvägen (eftersom 5>3)
- Högra vägen | bilder/minimax/v2/beskarning-2.svg | De sista två grenarna kan också beskäras eftersom oavsett vad de har för värde kommer inte Max välja den högra vägen
- Beskärning | bilder/minimax/v2/beskarning-3.svg | Vi kan beskära (prune) trädet här och behöver inte utforska några grenar nedanför
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

[egen: bild-och-forklaring]
rubrik: Varför beskärning?
bild:
alt: Varför beskärning?
text:
rörelse: tona
fokus: ingen
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

[egen: bild-och-forklaring]
rubrik: Alfa- och betavärden
bild:
alt: Alfa- och betavärden
text: Algoritmen tilldelar varje nod ett alfavärde (𝛼) och ett betavärde 𝛽 och gör en Depth First Search i trädet.
rörelse: tona
fokus: ingen
- α · Alfavärdet | Alfavärdet (𝛼) är det hittills bästa värde som Max kan garantera. Från början ges noden alfavärdet (𝛼=−∞) och uppdateras vid maxnoder om ett högre värde hittats.
- β · Betavärdet | Betavärdet (𝛽) är det hittills bästa värde som Min kan garantera. Betavärdet sätts från början till 𝛽=+∞ och uppdateras vid minnoder om ett lägre värde hittats.
- α ≥ β · Beskärning | Om 𝛼≥𝛽 behöver grenen inte utforskas mer och kan beskäras.
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
rubrik: Alfa- och betavärden
bild: bilder/minimax/v2/alpha-0.svg
alt: Djupet först genom ett spelträd, med alfa och beta vid noderna.
text: Djupet först, från vänster till höger. α och β visas vid noderna.
fokus: ingen
rörelse: ingen
övergång: tona
- β = 8 | bilder/minimax/v2/alpha-1.svg | Det första lövet ger MIN gränsen 8.
- β = 5 | bilder/minimax/v2/alpha-2.svg | MIN uppdaterar när ett lägre värde hittas.
- Min-värde: 5 | bilder/minimax/v2/alpha-3.svg | Det sista lövet ändrar inte grenens värde.
- α = 5 | bilder/minimax/v2/alpha-4.svg | Max kan nu garantera 5. Gränsen följer med till nästa gren.
- β = 9 | bilder/minimax/v2/alpha-5.svg | Mittenvägens första löv.
- β ≤ α | bilder/minimax/v2/alpha-6.svg | 3 ≤ 5. Vi behöver inte fortsätta söka i grenen.
- β ≤ α | bilder/minimax/v2/alpha-7.svg | 2 ≤ 5. Vi behöver inte fortsätta söka i grenen.
- Samma beslut | bilder/minimax/v2/alpha-8.svg | Rotens värde är 5. Sex av nio löv behövde undersökas.
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
rubrik: Aktivitet – Vilka grenar kan beskäras?
bild: bilder/minimax/v2/ovning-0.svg
alt: Fyra nivåer: MAX, MIN, MAX, MIN, och åtta bladvärden.
text: Arbeta från vänster till höger. Markera vilka grenar som kan hoppas över.
fokus: ingen
rörelse: ingen
övergång: tona
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
rubrik: Aktivitet – Vilka grenar kan beskäras?
bild: bilder/minimax/v2/ovning-0.svg
alt: Stegvis facit till övningen med åtta bladvärden.
text: Facit. Sök från vänster till höger och förklara varje värde.
fokus: ingen
rörelse: ingen
övergång: tona
- Första MAX | bilder/minimax/v2/ovning-1.svg | max(5, 3) = 5. MIN får gränsen β = 5.
- Beskär | bilder/minimax/v2/ovning-2.svg | 8 räcker. Lövet 2 i samma gren behöver inte undersökas.
- Vänstra MIN | bilder/minimax/v2/ovning-3.svg | Värdet blir 5. Rotens α uppdateras till 5.
- Högra sidan | bilder/minimax/v2/ovning-4.svg | max(7, 1) = 7.
- Sista MAX | bilder/minimax/v2/ovning-5.svg | max(2, 3) = 3.
- Högra MIN | bilder/minimax/v2/ovning-6.svg | min(7, 3) = 3.
- Roten | bilder/minimax/v2/ovning-7.svg | max(5, 3) = 5.
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
> Godkänd rättelse 2026-10-13: originalets 2 i MAX-noden över löven 2 och 3 samt i MIN-noden ovanför är rättade till 3. Roten är fortfarande 5.

---

[egen: resonemang-i-bild]
rubrik: Aktivitet – Hur många noder behöver utforskas?
bild: bilder/minimax/v2/rakna-noder.svg
alt: Oregelbundet minimax-träd med färdiga bladvärden och tomma interna noder.
text: Hur många noder besöks med alfa-beta-beskärning? Sök från vänster till höger.
fokus: ingen
rörelse: ingen
övergång: tona
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

[egen: bild-och-forklaring]
rubrik: Extrauppgift – Monte Carlo Tree Search (MCTS)
bild:
alt: Extrauppgift – Monte Carlo Tree Search (MCTS)
text: Bekanta dig med sökalgoritmen MCTS genom att söka på internet och/eller titta på klippet nedan
rörelse: tona
fokus: ingen
- Jämför | Jämför MCTS och Minimax.
- Likheter och skillnader | Vad finns det för likheter/skillnader?
- För- och nackdelar | Vad finns det för för- och nackdelar med respektive algoritm?
@text 126 936 1650 65 storlek=24 färg=dampad | Monte Carlo Tree Search: https://www.youtube.com/watch?v=lhFXKNyA0QA
> Originalets videolänk är bevarad. Teams-övningsfilen är inte bifogad.
> Källa: originalbild 21. Presentation av David Hedengren.
> Originaltext: Extrauppgift – Monte Carlo Tree Search algoritmen (MCTS)
> Originaltext: Bekanta dig med sökalgoritmen MCTS genom att söka på internet och/eller titta på klippet nedan
> Originaltext: Jämför MCTS och Minimax.
> Originaltext: Vad finns det för likheter/skillnader?
> Originaltext: Vad finns det för för- och nackdelar med respektive algoritm?
> Originaltext: Monte Carlo Tree Search
