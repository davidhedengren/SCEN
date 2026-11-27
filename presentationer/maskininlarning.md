---
titel: Maskininlärning
kurs: Artificiell Intelligens 1
tema: natt
---

[titel]
etikett: Artificiell intelligens · David Hedengren
rubrik: Maskininlärning
text: Hur lär sig en modell att känna igen en katt?
bild: bilder/maskininlarning/robot.webp
alt: Originalets robot i ett laboratorium.
> Öppna med en fråga. Hur skulle ni beskriva en katt för någon som aldrig har sett en? Spara en av klassens regler till bilden med nakenkatten.
> Bildförslag: Titelporträttet kan ersättas med ett fotografiskt stilleben av märkta djurbilder. Prompt A i regidokumentet.

---

[definition]
rubrik: Vad lär sig en modell?
text: Maskininlärning är en del av AI där en algoritm använder exempel för att hitta mönster i data.
exempel: En bildmodell tränas på foton av katter och hundar. Sedan får den bestämma vilket djur som syns på ett nytt foto.
> Be om en möjlig regel från eleverna. Spetsiga öron? Päls? Finns det hundar som också passar in på regeln?

---

[remsor]
rubrik: Vad får modellen lära sig av?
- Övervakad inlärning | Varje träningsexempel har ett känt svar, till exempel ”katt”.
- Oövervakad inlärning | Algoritmen letar efter grupper i data som saknar etiketter.
- Förstärkningsinlärning | En agent prövar handlingar och lär sig av belöningen i sin miljö.
> Säg de engelska namnen supervised learning, unsupervised learning och reinforcement learning. En spelagent kan få poäng vid vinst. En robot kan få belöning när den når ett mål. Resten av genomgången fördjupar de två första sätten.

---

[vägval]
etikett: Övervakad inlärning
rubrik: Vilken sorts svar vill vi ha?
vänster: Klassificering
höger: Regression
- Fråga | Vilket djur syns? | Vad kostar huset?
- Etikett i träningen | Katt eller hund | Försäljningspris i kronor
- Modellens svar | En kategori | Ett tal på en skala
> Andra klassificeringsproblem är att filtrera skräppost och att bedöma om en recension uttrycker en positiv eller negativ åsikt. Förväntat antal annonsklick och storleken på en försäkringsersättning är andra numeriska mål.

---

[etapper]
rubrik: Från märkta bilder till en modell i bruk
- Träna | Algoritmen får både bilderna och deras etiketter.
- Testa | Modellen svarar på undanlagda bilder. Vi jämför svaren med facit.
- Använd | Modellen får en ny bild som vi vill ha ett svar på.
> En möjlig uppdelning är 80 % träning och 20 % test. Dela upp materialet före träningen. Om eleverna föreslår att testa med samma foton, fråga vad modellen kan ha lärt sig utantill.

---

[text-bild]
etikett: Träning
rubrik: Vad får modellen se?
bild: bilder/maskininlarning/traningsbilder.webp
alt: Sju av originalets märkta träningsbilder, fyra katter och tre hundar.
- Fotografiet är **indata**.
- Ordet under fotografiet är **etiketten**.
- Under träningen kopplar algoritmen mönster i bilderna till etiketterna.
> Bildförslag: För en ny enhetlig fotoserie, se prompt C i regidokumentet.
> Låt eleverna peka på två djur med samma etikett som ändå ser ganska olika ut. De sju korten visar exempel ur träningsmaterialet.

---

[text-bild]
etikett: Testning
rubrik: Fyra bilder som modellen aldrig har sett
bild: bilder/maskininlarning/testbilder.webp
alt: Två katter och två hundar på fyra fotografier märkta A till D.
- Modellen får bara se fotografierna.
- Den svarar ”katt” på tre bilder och ”hund” på en.
- I facit finns två katter och två hundar. Kan alla fyra svar vara rätt?
> Stanna vid frågan. Även om båda katterna känns igen måste minst en hund ha fått svaret katt. Visa sedan den faktiska matrisen från exemplet.

---

[egen: resonemang-i-bild]
etikett: Klassificeringsmatris
rubrik: Vilken sorts fel gjorde modellen?
text: Katt är positiv klass. Läs från djuret i facit till modellens svar.
bild: bilder/maskininlarning/kattmatris-alla.svg
alt: Facit i rader och förutsägelser i kolumner. Två katter blev katter, en hund blev katt och en hund blev hund.
- Sant positiv · TP | bilder/maskininlarning/kattmatris-tp.svg | Två katter fick svaret katt. Modellen hittade dem båda.
- Falskt negativ · FN | bilder/maskininlarning/kattmatris-fn.svg | Ingen katt fick svaret hund. Modellen missade alltså ingen katt.
- Falskt positiv · FP | bilder/maskininlarning/kattmatris-fp.svg | En hund fick svaret katt. Här ligger modellens enda fel.
- Sant negativ · TN | bilder/maskininlarning/kattmatris-tn.svg | En hund fick svaret hund. Tre av de fyra svaren blev rätt.
> Läs först kattens rad. Två rätt identifierade katter och ingen missad katt. Läs sedan kolumnen för svaret katt. Där finns också en hund. TP = sant positiv, FN = falskt negativ, FP = falskt positiv och TN = sant negativ. På engelska confusion matrix. I en medicinsk klassificering skulle ett falskt positivt svar vara ett falskt alarm och ett falskt negativt svar ett missat fall.

---

[omröstning]
rubrik: Modellen svarade ”katt” tre gånger. Hur ofta hade den rätt då?
svar: Två av de tre bilderna föreställde katter. Den tredje föreställde en hund.
- En gång av tre
- * Två gånger av tre
- Tre gånger av fyra
> Fråga vilken kolumn de just använde. Tre av fyra besvarar också en viktig fråga, men vilken?

---

[tabell]
rubrik: Tre frågor om samma fyra bilder
visa: facit
| Mått | Vad räknar vi? | Resultat |
| Accuracy · träffsäkerhet | Rätt svar bland alla bilder | (2 + 1) / 4 = 75 % |
| Precision | Faktiska katter bland svaren ”katt” | 2 / (2 + 1) = 2/3 ≈ 67 % |
| Recall · känslighet | Hittade katter bland alla faktiska katter | 2 / (2 + 0) = 100 % |
> Accuracy = (TP + TN) / antal testfall. Precision = TP / (TP + FP). Recall = TP / (TP + FN), enligt definitionsbilden i underlaget. Be eleverna förklara hur modellen samtidigt kan hitta alla katter och ta fel på en hund.

---

[text-bild]
etikett: Tillämpning
rubrik: Katten som saknar päls
bild: bilder/maskininlarning/nakenkatt.webp
alt: Originalets ljusa nakenkatt med stora öron.
- En ny bild skickas till modellen.
- Modellen svarar **katt**.
- Vilka av klassens regler från början av lektionen fungerar även här?
> Knyt tillbaka till den regel klassen föreslog. Ett rätt svar på den här bilden räcker inte för att avgöra vad modellen tittade på.

---

[egen: bild-och-forklaring]
rubrik: Vad finns i lådan?
bild: bilder/maskininlarning/modell.webp
alt: En genomlyst kub med kretsar, originalets symbol för modellen.
- Algoritm | En följd av instruktioner för att lösa en uppgift.
- Tränad modell | Resultatet som vi kan använda för att göra en ny förutsägelse.
- Exempel på metoder | Linjär och logistisk regression, kNN, beslutsträd och Naive Bayes.
> I originalet ställs frågan ”Algoritm?”. Låt eleverna skilja på instruktionerna för träningen och det som sedan används. Förutom linjär regression, kNN och logistisk regression finns bland annat beslutsträd och Naive Bayes-klassificerare.
> Bildförslag: Se prompt B för en ny version av kuben.

---

[formel]
etikett: Linjär regression
rubrik: En rät linje kan ge en förutsägelse
formel: ŷ = w · x + b
slutsats: Samma form som y = kx + m. Hatten på ŷ markerar ett förutsagt värde.
- x | Indata, till exempel bostadens area.
- w | Vikten är linjens lutning. Den anger ändringen i ŷ när x ökar ett steg.
- b | Konstanttermen är modellens värde vid x = 0. Den kallas också bias.
> Rita gärna en brantare linje med samma skärning och fråga vilken parameter du ändrade.

---

[tabell]
etikett: Linjär regression · träningsdata
rubrik: Vad vet vi om de fyra husen?
| Area i m² | Antal rum | Pool (1 = ja) | Slutpris i tkr |
| 100 | 4 | 1 | 2 500 |
| 80 | 3 | 0 | 1 800 |
| 120 | 5 | 1 | 3 200 |
| 90 | 4 | 0 | 2 000 |
> Bildförslag: En villabild kan introducera egenskaperna. Se prompt D i regidokumentet.
> Låt eleverna peka ut modellens tre indata och dess målvärde. Tkr betyder tusen kronor. Tabellen är PowerPointens räkneexempel.

---

[formel]
rubrik: Varje egenskap får en vikt
formel: ŷ = w₁x₁ + w₂x₂ + w₃x₃ + b
slutsats: Med fler egenskaper får modellen fler vikter.
- w₁x₁ | Arean i m² multipliceras med prisbidraget per m².
- w₂x₂ | Antalet rum multipliceras med prisbidraget per rum.
- w₃x₃ | Pool bidrar med w₃ om värdet är 1 och med 0 om värdet är 0.
- b | Konstanttermen läggs till för varje hus.
> Den allmänna formen är ŷ = w₁x₁ + … + wₙxₙ + b. Originalets exempel på en möjlig modell är ŷ = 15x₁ + 120x₂ + 800x₃ + 200. Fråga vad 10 extra m², ett extra rum respektive en pool skulle betyda om övriga indata hölls konstanta. Svar 150, 120 och 800 tkr.

---

[omröstning]
etikett: Hus 1 · 100 m², fyra rum och pool
rubrik: Hur långt från slutpriset hamnar den första gissningen?
text: Hus 1 såldes för 2 500 tkr. Modellen ger 10 · 100 + 50 · 4 + 500 · 1 + 100 = 1 800 tkr.
svar: Slutpris minus modellens pris blir 2 500 − 1 800 = 700 tkr. Modellen underskattar priset.
- 700 tkr över slutpriset
- * 700 tkr under slutpriset
> Startvikterna är 10, 50 och 500 med konstantterm 100. Be eleverna ange tecknet om vi i stället tar modellens pris minus slutpriset.

---

[formel]
etikett: Hus 2 · 80 m², tre rum och ingen pool
rubrik: Vad händer när modellen får nya vikter?
formel: ŷ = 12 · 80 + 80 · 3 + 600 · 0 + 150
slutsats: Huset såldes för 1 800 tkr. Modellen ligger 450 tkr för lågt.
- 12 · 80 | Areans bidrag är 960 tkr.
- 80 · 3 | Rummens bidrag är 240 tkr.
- 600 · 0 | Poolens bidrag är noll för just det här huset.
- 150 | Tillsammans blir det 1 350 tkr.
> De nya vikterna är illustrativa, precis som i underlaget. Där visas också nästa uppsättning, 14, 90 och 700 med konstantterm 180. Fråga vilken vikt som inte kan påverka förutsägelsen för ett hus utan pool.

---

[text-bild]
etikett: Gradientnedstigning · gradient descent
rubrik: Hur hittar algoritmen en bättre linje?
bild: bilder/maskininlarning/linjer.webp
alt: Samma mätpunkter med linjer efter noll, två och fyra iterationer och en slutlig anpassning.
- Börja med värden på vikterna och konstanttermen.
- Beräkna felet och lutningen hos förlustfunktionen.
- Ta ett litet steg i den riktning där förlusten minskar. Upprepa.
> Följ en datapunkt från startlinjen till slutlinjen. Avståndet i höjdled är felet i just den förutsägelsen. Förlusten sammanfattar felen, till exempel medelvärdet av deras kvadrater. Steglängden påverkar hur långt parametrarna flyttas.

---

[tabell]
rubrik: Hur mycket ändras priset i modellen?
visa: facit
| Möjlig modell i tkr | Ändring, övrigt lika | Prisändring |
| ŷ = 15x₁ + 120x₂ + 800x₃ + 200 | 10 m² större area | +150 tkr |
| Samma modell | Ett extra rum | +120 tkr |
| Samma modell | Från ingen pool till pool | +800 tkr |
> Låt eleverna jämföra en konkret förändring i taget. Fråga sedan hur mycket större area som skulle ge samma förändring som ett extra rum. Åtta kvadratmeter ger 8 · 15 = 120 tkr.

---

[egen: bild-och-forklaring]
etikett: Aktivitet i Orange
rubrik: Bygg en regressionsmodell
bild: bilder/maskininlarning/orange.webp
alt: Orange-symbolen från originalpresentationen.
- Öppna | Följ ”Aktivitet – Linjär regression med diabetes dataset” i Teams.
- Undersök | Ta reda på vilken kolumn som är modellens målvärde.
- Redovisa | Välj en rad. Jämför förutsägelsen med målvärdet och tolka skillnaden.
> Följ klassens aktivitet i Teams för själva arbetsgången. Avsluta med en jämförelse med huspriset. Vad gäller felet för den här gången?

---

[egen: resonemang-i-bild]
etikett: Närmaste granne
rubrik: Vilken klass får den nya punkten?
text: Varje färgad punkt har redan en etikett. Leta upp den som ligger närmast frågetecknet.
bild: bilder/maskininlarning/granne0.svg
alt: Rödmarkerade cirklar och blå romber med en ny vit punkt i det blå området.
- k = 1 | bilder/maskininlarning/granne1.svg | Den närmaste grannen är blå. Den nya punkten får därför klassen blå.
> Ge klassen några sekunder före klicket. Metoden sparar de märkta exemplen och jämför avstånden när en ny punkt ska klassificeras. Samma idé kan användas för regression med grannarnas numeriska värden.

---

[egen: resonemang-i-bild]
etikett: k närmaste grannar · kNN
rubrik: Kan samma punkt få två olika svar?
text: Frågetecknet har flyttat. Förutsäg resultatet först för en granne, sedan för tre.
bild: bilder/maskininlarning/grannar0.svg
alt: Samma träningspunkter, nu med den vita punkten nära gränsen mellan klasserna.
- k = 1 | bilder/maskininlarning/grannar1.svg | Den röda cirkeln är närmast. Med en enda röst blir svaret röd.
- k = 3 | bilder/maskininlarning/grannar3.svg | Två blå romber och en röd cirkel röstar. Två av tre ger klassen blå.
> Var uppmärksam på att det är frågepunkten som flyttat sedan föregående scen. Mellan klicken på den här scenen ändras bara k.

---

[etapper]
etikett: Aktivitet i Orange · Breast Cancer Wisconsin
rubrik: Pröva kNN på märkta tumördata
- Läs in data | Välj Breast Cancer Wisconsin. Leta upp klassetiketten för varje prov.
- Klassificera | Använd kNN för att skilja på godartade och elakartade tumörer.
- Utvärdera | Öppna klassificeringsmatrisen. Vilken ruta visar en missad elakartad tumör?
> Datasetet beskriver egenskaper hos cellprover. Här betyder positiv klass elakartad. Be eleverna identifiera raden för faktiskt elakartade och kolumnen för förutsagt godartade.

---

[tabell]
etikett: Orange · klassificeringsmatris
rubrik: Hur många elakartade fall missade modellen?
| Facit ↓ / Modellens svar → | Godartad | Elakartad | Totalt |
| Godartad | 435 | 9 | 444 |
| Elakartad | 16 | 223 | 239 |
| Totalt | 451 | 232 | 683 |
> Låt eleverna själva beräkna accuracy, precision och recall för elakartad klass före nästa scen. Originalets Orange-matris ger TP = 223, TN = 435, FP = 9 och FN = 16. I en egen körning kan fördelningen bli annorlunda.

---

[tabell]
rubrik: Samma modell sedd från tre håll
visa: facit
| Fråga | Mått | Värde i exemplet |
| Hur många svar blev rätt? | Accuracy = (TP + TN) / totalt | 658 / 683 ≈ 96,3 % |
| Hur ofta stämde svaret ”elakartad”? | Precision = TP / (TP + FP) | 223 / 232 ≈ 96,1 % |
| Hur många elakartade hittades? | Recall = TP / (TP + FN) | 223 / 239 ≈ 93,3 % |
> Fråga varför precision och recall får olika nämnare trots att båda har 223 i täljaren.

---

[reflektion]
etikett: Aktivitet · rekommendationssystem med kNN
rubrik: Vems filmsmak säger mest om din nästa favorit?
tid: 2
- Välj två personer som har betygsatt några av samma filmer.
- Hur skulle du avgöra vems smak som mest liknar din?
- Fortsätt med ”Aktivitet – Rekommendationssystem med KNN” i Teams.
> Be om ett konkret förslag på ett avstånd mellan två personers betyg. Återknyt till de tre grannarnas röster innan klassen öppnar instruktionen.

---

[egen: resonemang-i-bild]
etikett: Logistisk regression
rubrik: Hur blir en sannolikhet ett klassbeslut?
text: Sigmoidfunktionen p = 1 / (1 + e^{−z}) omvandlar modellens poäng z till en sannolikhet.
bild: bilder/maskininlarning/sigmoid.svg
alt: En stigande S-kurva tar modellens poäng till en sannolikhet mellan noll och ett.
- Ett nytt fall | bilder/maskininlarning/sigmoid-fall.svg | Modellen ger 0,40 för elakartad. Med gränsen 0,50 väljer den klassen godartad.
> I originalets förenklade exempel bygger poängen på tumörstorlek. Med flera egenskaper är z en viktad summa. Funktionen är p = 1 / (1 + e^(−z)). Den andra klassen får modellvärdet 0,60. Fråga vad som skulle hända med samma fall om vi sänkte gränsen till 0,35.

---

[text-bild]
etikett: Oövervakad inlärning
rubrik: Vad kan vi hitta utan etiketter?
bild: bilder/maskininlarning/klusterrobot.webp
alt: Originalets robot betraktar ett system av punkter och förbindelser.
- Tänk dig blomprover där artnamnen har täckts över.
- Vi har fortfarande kvar längder och bredder.
- Prover som liknar varandra kan samlas i **kluster**.
> Be eleverna föreslå två mätningar som skulle kunna göra blommor lätta att gruppera. Spara förslagen till Iris-aktiviteten.

---

[text-bild]
rubrik: Hur många grupper ser du?
bild: bilder/maskininlarning/punktmoln.webp
alt: Originalets omärkta punktmoln på två axlar.
- Föreslå en gruppering och jämför med en granne.
- Med **k-means** väljer vi antalet kluster i förväg.
- Sätter vi k = 3 söker algoritmen tre grupper.
> Skilj k i kNN (antal röstande grannar) från k i k-means (antal kluster). I nästa exempel följer vi ett nytt punktmoln genom hela beräkningen med k = 2.

---

[egen: resonemang-i-bild]
etikett: k-means · k = 2
rubrik: Följ två centroider genom punktmolnet
text: Varje kryss är en centroid. Vilket kryss ligger närmast varje punkt?
bild: bilder/maskininlarning/kluster0.svg
alt: Trettio datapunkter och två kryss. Kryssen är klustrens startcentrum.
- Tilldela | bilder/maskininlarning/kluster1.svg | Varje punkt får färg och form efter den centroid som ligger närmast.
- Flytta | bilder/maskininlarning/kluster2.svg | Varje kryss flyttas till medelvärdet av koordinaterna i sitt kluster.
- Tilldela igen | bilder/maskininlarning/kluster3.svg | De inringade punkterna har fått närmare till den andra centroiden och byter kluster.
- Upprepa | bilder/maskininlarning/kluster4.svg | Efter fler omgångar byter ingen punkt kluster. Då ligger också kryssen still.
> Punkten står kvar när den byter kluster. Be någon följa en enda punkt med blicken genom hela serien.

---

[formel]
rubrik: Hur avgör vi vilken centroid som ligger närmast?
formel: d = √((x_{i} − x_{c})² + (y_{i} − y_{c})²)
slutsats: Beräkna avståndet till båda centroiderna. Välj den som ger lägst d.
- x_{i} − x_{c} | Skillnaden mellan punktens och centroidens x-koordinater.
- y_{i} − y_{c} | Motsvarande skillnad i y-led.
> Det är Pythagoras sats. Som huvudräkning kan du ta en punkt i (1, 1) och en centroid i (4, 5). Kateterna är 3 och 4 och avståndet är 5.

---

[etapper]
etikett: Aktivitet i Orange · Iris
rubrik: Vilka blommor hamnar i samma kluster?
- Välj data | Öppna Iris. Låt bara blommornas mått ingå i klustringen.
- Gruppera | Kör k-means med k = 3. Visa klustren i ett spridningsdiagram.
- Jämför | Visa de kända artnamnen i efterhand. Var sammanfaller arter och kluster?
> Bildförslag: Se prompt E för ett fotografi av irisprover.
> Låt eleverna byta de två måtten på diagrammets axlar. Samma kluster kan se olika tydliga ut beroende på vilka mått som visas.

---

[fråga]
etikett: Avslutning
rubrik: Vilken uppgift kan du börja med innan du vet arten?
svar: K-means kan använda måtten direkt. För övervakad artklassificering behövs märkta träningsexempel.
- Träna en klassificerare att känna igen varje art
- * Gruppera blommorna efter likheter i deras mått
> Be om en sista mening från eleverna. Vad betyder k i kNN, och vad betyder k i k-means?
