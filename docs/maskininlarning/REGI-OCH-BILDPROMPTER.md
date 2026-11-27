# Maskininlärning – regi och bildprompter

Manuset bygger på David Hedengrens *Maskininlärning.pptx*. I klassrummet kan genomgången delas efter kattmodellen, efter regression och efter logistisk regression. De fyra aktiviteterna fungerar som arbetsstopp.

## Klickregi i klassrummet

- **Scen 6.** Visa det första kortet och låt klassen läsa etiketten. Högerpil skickar kortet längs banan in i kuben. De följande sex klicken matar in ett nytt märkt exempel vardera.
- **Scen 7 och 11.** Under testet passerar fyra omärkta fotografier kuben i originalets ordning. Vänta in svaret efter varje klick. Stanna vid den lilla hunden och låt eleverna beskriva felet innan matrisen visas. På scen 11 får de pröva sin egen regel på nakenkatten före klicket.
- **Scen 8 och 22.** Följ samma diagram medan loggen skriver ut ett beslut i taget. Vid kNN, be om en gissning innan den tredje grannens röst avgör.
- **Scen 18.** Starta klippet med högerpil. Linjen rör sig genom lägena i originalets regressionsdiagram medan det lodräta felet för en utvald punkt förändras. Mellanlägena är en visuell interpolation. Nästa klick öppnar diskussionsfrågan.
- **Scen 30.** Starta klippet och följ först en punkt, sedan ett kryss. Förbindelser visar tilldelningen, kryssen flyttar sig till medelvärdena och vita ringar fångar punkter som byter grupp. Vänta in det stabila slutläget innan nästa klick.

## Från PowerPoint till SCEN

| Originalbild | SCEN | Vad eleverna arbetar med |
|---|---|---|
| 1–3 | 1–3 | Titelroboten, frågan om en katt och tre sätt att lära från data. |
| 4–5 | 4–5 | Två sorters målvärden och skillnaden mellan träning, test och användning. |
| 6–7 | 6–7 | Originalets sju märkta träningsbilder och fyra separata testbilder. |
| 8–11 | 8–10 | Katt är positiv klass. Läs först en rad, sedan en kolumn. Rösta före uträkningen. |
| 12–14 | 11–12 | Nakenkatten prövar klassens regler. Kuben leder vidare till algoritmerna. |
| 15–16 | 13, 15 | En respektive flera indatavariabler. Vikter och konstantterm tänds i uttrycken. |
| 17–18 | 18 | Gradientnedstigning och originalets diagram över linjer efter olika antal iterationer. |
| 19–21 | 14–17, 19 | Alla fyra hus, de två första förutsägelserna och en tolkning av en möjlig modell. |
| 22 | 20 | Linjär regression i Orange med Diabetes och instruktionen i Teams. |
| 23–25 | 21–22 | Originalets rödblå punktfält. En fråga med en blå granne, sedan ett fall där k ändrar beslutet. |
| 26–28 | 23–26 | Orange-aktivitet, originalmatrisens 683 prov, uträknat facit och rekommendationssystem med kNN. |
| 29–30 | 27 | Sigmoidkurva, beslutsgräns och originalets modellvärde 0,40. |
| 31–32 | 28–29 | Originalets robot och omärkta punktmoln öppnar samtalet om klustring. |
| 33–38 | 30–31 | Tilldelning, flyttning och ny tilldelning på ett fast punktfält. Sedan avståndsformeln. |
| 39 | 32–33 | Iris-aktiviteten följs av en ny avslutningsfråga om när artetiketter behövs. |

**Bildregi.** I kNN-fälten följer markeringarna avstånden i originalets punktfigur. Rött och blått skiljs även med cirklar och romber. I k-means återkommer originalets 30 datapunkter. Två valda startcentrum, nya klustertilldelningar och medelpunkter är beräknade för utkastet. Ett spår visar hur varje centroid glider till gruppens medelpunkt. En ring markerar en datapunkt som bytt kluster. I Orange-matrisen och kattmatrisen går facit längs raderna i båda fallen.

**Originalets övriga motiv.** Robotporträttet bakom definitionen, de horisontella banden med dataströmmar, personen framför en skärm, nätverket bakom algoritmerna och de böjda ljusbanorna bakom husen fungerar som kapitelmarkörer i PowerPointen. I det här utkastet får rubriken och temats bakgrund bära samma funktion. Kuben, djurfotografierna, Orange-symbolen, de två öppningsrobotarna och de figurer som bär data finns med. Pilar, etiketter, matrisrutor och flödesscheman har fått motsvarigheter i SCEN:s klicksteg, diagram och tabeller.

## Bildprompter

Prompterna är för alternativa bilder vid en senare bildsättning. Varje prompt kan användas separat. Text, klassetiketter, axlar och uträkningar sätts i presentationen.

### A · Titelbild till scen 1

> Fotografera ett ljust arbetsbord i en svensk gymnasiesal snett ovanifrån. På bordet ligger lösa matta fotografier av olika katter och hundar, några redan sorterade i två högar. En hand håller ett nytt fotografi precis ovanför mellanrummet. Låt handen, fotografiet och de två högarna bilda ett tydligt blickfång. Naturligt sidoljus, dämpat blågrönt och varmt papper. Stående 4:5, motivet fungerar även beskuret till en kvadrat. Inga texter, logotyper, datorskärmar eller grafiska överlägg.

### B · Modellens låda till scen 12

> En enda liten genomskinlig kub av optiskt glas på ett mörkblått laboratoriebord. Inuti löper tunna ledningar med ett varmt ljus genom mitten. På bordet till vänster ligger en svagt oskarp djurbild som anknyter till bildklassificering. Studioporträtt av ett fysiskt föremål, ren silhuett, väl avskilt från bakgrunden. Kvadratiskt utsnitt, hela kuben synlig, ingen text, inga pilar eller logotyper.

### C · Bildserie för träning, test och användning i scenerna 6, 7 och 11

> Skapa ett enda naturtroget studiofoto av [DJUR]. Fotografera hela djuret i ögonhöjd på en matt varmvit bakgrund. Mjukt ljus från vänster, naturlig päls eller hud, samma kameravinkel och skala i hela serien. Lämna marginal runt öron, tassar och svans. Kvadratiskt format. Inga tillbehör, bokstäver, etiketter eller ramar.

För träningsserien används fyra olika katter och tre olika hundar. För testserien används två nya katter och två nya hundar. För tillämpningen byts motivet ut mot en ljus nakenkatt med stora öron. Bygg korten med separata bilder så att text och facit går att ändra.

### D · Huspriser i scenerna 14–19

> Redaktionellt arkitekturfotografi av en ordinär svensk villa med två plan och en liten utomhuspool vid altanen. Betrakta huset snett från trädgården så att både byggnadens volym och poolen går att uppfatta. Vardaglig miljö, mulet dagsljus, dämpade gröna och blå toner. Liggande 16:9, inga människor, prisetiketter, husnummer eller mäklarlogotyper.

Bilden kan introducera de tre egenskaperna före hustabellen. Exakta mått och priser hämtas ur tabellen.

### E · Irisprover vid aktiviteten i scen 32

> Makrofotografi ovanifrån av tre irisblommor lagda var för sig på ett mörkt provbord, med tydligt synliga kronblad och foderblad i något olika proportioner. En enkel linjal ligger bredvid som diskret storleksreferens utan läsbara siffror. Mjukt riktat dagsljus, realistiska växtdelar, naturvetenskaplig läroboksfotografi. Liggande 3:2. Inga artnamn, diagram eller tryckta etiketter.

## Redaktionell notering

I kattexemplet är precisionen 2/3, avrundat cirka 67 %. Recall är TP / (TP + FN), vilket ger 2 / (2 + 0) = 100 %. Uttrycket med FP i nämnaren på originalbild 11 och avrundningen till 66 % har rättats efter avstämning med David.
