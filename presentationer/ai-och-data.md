---
titel: AI och data
kurs: Artificiell Intelligens 1
tema: natt
---

[titel]
etikett: Artificiell Intelligens 1 · David Hedengren
rubrik: AI och data
text: Hur AI lär sig – och varför datan avgör resultatet
bakgrund: fokusljus
> Välkommen! Idag handlar lektionen om AI och data: hur AI-system lär sig av data, varför datans kvalitet är avgörande och vilka problem som kan uppstå, som bias och bristande transparens.

---

[reflektion]
etikett: Uppstart
rubrik: Vilka digitala spår har du lämnat sedan du vaknade?
text: Vad skulle en AI kunna lära sig av dem?
tid: 2
bakgrund: fokusljus
- Tänk själv
- Prata i par
- Dela med klassen
> Exempel om det behövs: stegräknaren i mobilen, ett gillat inlägg, en sökning på nätet, musik, ett kortköp eller Swish, en delad plats.
> Poängen: vi skapar data hela tiden, ofta utan att tänka på det, och det är sådan data som AI-system tränas på.

---

[karta]
rubrik: Dagens lektion
bakgrund: fokusljus
steg: nej
- Vad är data? | Grunden för all AI
- Datakvalitet | Skräp in, skräp ut
- Bias | När AI blir orättvis
- Transparens | Att förstå AI:ns beslut
- Datamängder | Exempel från verkligheten

---

[omlopp]
etikett: Del 1 · Vad är data?
rubrik: Data
bakgrund: fokusljus
- Siffror | Temperaturer, betyg, priser
- Text | Chattar, artiklar, recensioner
- Bilder | Foton, röntgenbilder, skanningar
- Ljud | Tal, musik, röstmeddelanden
- Video | Filmklipp, trafikkameror
> Data är information i form av samlade fakta som kan dokumenteras och lagras digitalt.
> Data är grunden för dagens AI, särskilt maskininlärning, där system lär sig av exempel i stället för färdiga regler.
> Fråga klassen: vilka av exemplen från uppstarten passar in i vilken kategori?

---

[flöde]
etikett: Del 1 · Vad är data?
rubrik: Regler eller exempel?
slutsats: Maskininlärning klarar komplexa problem – om datan är bra.
bakgrund: fokusljus
- bana: Traditionell programmering
- Regler | Människan skriver dem
- Datorn | Följer reglerna
- Resultat | Bra i enkla sammanhang, sämre i komplexa
- bana: Maskininlärning
- Data och rätt svar | Exempel att lära av
- AI:n | Hittar mönster själv
- Modell | Kan förutsäga nya fall
> Klick 1–3 jämför de två sätten steg för steg. Sista klicket visar båda kedjorna och slutsatsen.
> Traditionellt skriver människor instruktioner för varje tänkbar situation. AI-system använder i stället stora mängder data för att själva hitta mönster och samband. Det är därför data är så central.

---

[delning]
etikett: Exempel · Handskrivna siffror
rubrik: Hur lär man en dator läsa handstil?
bakgrund: fokusljus
- Med regler | Alla skriver olika. Exakta regler för varje siffra är nästan omöjliga att skriva.
- Med exempel | Tusentals märkta bilder: ”den här bilden visar en 7:a”. AI:n hittar mönstret.
- Kort sagt | Ju mer data, desto bättre lär sig systemet. Utan data ingen AI.
> Vi kan inte skriva regler för alla handstilar. I stället visar vi AI:n tusentals märkta bilder. Samma princip gäller stora språkmodeller som ChatGPT: de tränas på enorma mängder text.
> Fråga: Vad skulle hända om några bilder var felmärkta? Det leder in på datakvalitet.

---

[typografi]
etikett: Del 2 · Datakvalitet
bakgrund: fokusljus
- statement | **Felaktig, irrelevant eller skev** data in … | Dålig data
- precisering | … ger **felaktiga eller orättvisa** resultat ut. | Dåligt resultat
- slutsats | Skräp in, **skräp ut**. | Slutsats
> Matar man in dålig data i ett AI-system blir resultatet också dåligt: AI-modellen lär sig mönstren i datan, även de felaktiga.
> En AI kan aldrig bli bättre än datan den tränas på.
> Ett känt uttryck inom dataanalys och AI. Datakvalitet handlar om att datan måste vara korrekt, relevant och representativ. Det tittar vi på härnäst.

---

[samband]
etikett: Tillsammans ger de
rubrik: Tre krav på bra data
text: Bra data
bakgrund: fokusljus
- Korrekt | Uppgifterna stämmer. Katter märkta som hundar lär modellen fel.
- Relevant | Hänger ihop med problemet. Bostadspriser: storlek, läge, rum – inte vädret.
- Representativ | Speglar verkligheten där modellen används, inte bara ett land.
> Korrekt: uppgifterna måste stämma. Relevant: datan måste hänga ihop med det modellen ska lösa. Representativ: datan måste täcka de fall och variationer som finns där modellen används.
> Be eleverna hitta på ett eget exempel för varje krav.

---

[två-tal]
rubrik: Mer data – bättre AI?
text: Men kvantitet är inte allt. En bra modell är också rättvis, pålitlig och användbar.
bakgrund: fokusljus
- 10 | meningar: du lär dig lite av ett nytt språk
- 100+ | böcker: du upptäcker komplexa och subtila mönster
> Samma gäller AI: mer data gör systemet bättre på att generalisera och hantera nya situationer.
> Mer data gör systemet bättre på att generalisera och hantera nya situationer. Men mycket data hjälper inte om datan är felaktig eller skev.
> Rättvis: behandlar olika grupper likvärdigt. Pålitlig: ger konsekventa och stabila resultat. Användbar: fungerar i verkligheten och inte bara i tester.
> En rättvis modell missgynnar inte personer på grund av kön, ålder eller ursprung. Två särskilt viktiga frågor är bias och transparens.

---

[definition]
etikett: Del 3 · Bias
rubrik: Bias
text: När en AI-modell behandlar vissa grupper eller situationer på ett systematiskt orättvist sätt.
exempel: Kön, etnicitet, språkbruk eller geografi. Oftast uppstår det i träningsdatan, men också i hur modellen konstrueras eller hur resultaten tolkas.
bakgrund: fokusljus
> Fråga gärna först: Har ni hört ordet bias förut? Vad tror ni det betyder?
> Bias uppstår oftast i datan, men kan också smyga sig in i hur modellen byggs eller hur resultaten tolkas.

---

[verkningar]
etikett: Exempel · Studievägledning
rubrik: När AI:n förstärker gamla mönster
orsak: I datan valde elever med föräldrar utan högre utbildning oftare yrkesprogram.
konsekvens: AI:n förstärker gamla mönster i träningsdatan.
bakgrund: fokusljus
- AI:n lär sig mönstret | Föräldrarnas utbildning blir en signal
- Råden följer mönstret | Yrkesprogram föreslås även när betyg och intressen passar ett högskoleförberedande program
> En AI ger studievägledning till högstadieelever, baserat på tidigare val.
> Exemplet ligger nära eleverna. Fråga hur de skulle känna om en AI gav dem råd baserat på föräldrarnas utbildning.

---

[etapper]
etikett: Exempel · Rekrytering
rubrik: Mellanchefer och padel
bakgrund: fokusljus
fokus: mjuk
- Träningsdata | AI:n tränas på tidigare chefsrekryteringar. Många av cheferna nämnde padel i sina cv:n.
- Mönstret | AI:n drar slutsatsen: ”padel = bra chefskandidat”.
- Nya ansökningar | Sökande som nämner padel hamnar högt, oavsett kompetens.
- Resultat | Meriterade kandidater som inte spelar padel sorteras bort.
> Ingen styrde resultatet medvetet. AI:n lärde sig efterlikna gamla mönster som inte säger något om vad som gör någon till en bra chef.
> Gå igenom kedjan steg för steg. Poängen är att bias kan uppstå helt utan onda avsikter: snedvriden träningsdata räcker.
> Fråga: Hur hade man kunnat upptäcka det här problemet?

---

[urval]
etikett: Del 3 · Därför uppstår bias
rubrik: Speglar träningsdatan verkligheten?
slutsats: AI-system för hudcancer har fungerat sämre på mörk hud, eftersom träningsbilderna främst visade ljus hud.
reservation: Illustration av principen, inte verkliga andelar.
vänster: Patienterna
höger: Träningsbilderna
bakgrund: fokusljus
- Ljusare hud | 60 | 90
- Mörkare hud | 40 | 10
> Klick 1 visar vilka som finns med i träningsdatan. Klick 2 visar gruppen som nästan saknas. Klick 3 visar helheten igen.
> Andelarna är påhittade för att visa principen. Det verkliga problemet är att bilddatabaser för hudcancer har dominerats av ljus hud.

---

[prisma]
etikett: Del 3 · Bias i verkliga AI-system
rubrik: Tre fall, samma grundproblem
fråga: Varför blev AI:n orättvis?
gemensamt: Datan speglade en snedvriden verklighet.
bakgrund: fokusljus
- Rekrytering | Amazons verktyg | Tränat på cv:n från mest män
- Sjukvård | Hudcancer | Bilderna visade främst ljus hud
- Vårdbehov | Kostnad som mått | Mindre vård tolkades som friskare
> Amazon: verktyget straffade enligt Reuters (2018) bland annat cv:n som innehöll ordet ”women's”, t.ex. ”women's chess club”.
> Hudcancer: bilddatabaser har dominerats av ljus hud.
> Vårdbehov: en amerikansk studie i Science (2019) visade att en algoritm som använde vårdkostnader som mått på vårdbehov underskattade behoven hos svarta patienter. Grupper som historiskt fått mindre vård bedömdes felaktigt som friskare.
> Slutsats: träningsdata måste vara varierad och representativ.

---

[helhet]
etikett: Del 3 · Bias
rubrik: Hur kan vi hantera bias?
bakgrund: fokusljus
- Granska träningsdatan | Vilka grupper är underrepresenterade? Saknas viktig information?
- Testa brett | Pröva modellen på många grupper och situationer. Är resultaten lika tillförlitliga?
- Använd tekniska verktyg | Analysverktyg och algoritmer kan hitta och korrigera bias.
- Var öppen med begränsningar | Berätta när, hur och för vem systemet fungerar.
> Helt bias-fri AI är svårt, men vi kan bli medvetna om riskerna och minska påverkan.
> Utvecklingsteam med olika bakgrunder upptäcker lättare blinda fläckar. I kapitel 6 återkommer vi till bias med fokus på etiska och samhälleliga konsekvenser.

---

[strålkastare]
etikett: Del 4 · Transparens
text: Extra viktigt när AI påverkar människors liv: i rättsväsendet, sjukvården, rekrytering och skolan.
bakgrund: fokusljus
- Transparens betyder att vi kan förstå
- hur en AI-modell fungerar,
- hur den har tränats
- och varför den fattar sina beslut.
> En transparent AI kan svara på: Vilken data användes för att träna modellen? Vilka beslut fattade modellen, och varför? Vad gör modellen när den stöter på okänd eller ovanlig information?
> Transparens handlar om insyn. Ju större påverkan ett beslut har på en människas liv, desto viktigare är det att kunna förstå och ifrågasätta beslutet.

---

[texttempo]
etikett: Exempel · Du ansöker om ett lån
bakgrund: fokusljus
- statement | Din ansökan har avslagits. | Utan transparens
- kontrast | Din ansökan har avslagits, **eftersom din inkomst ligger under vår gräns och det finns sena betalningar i din kredithistorik.** | Med transparens
- slutsats | Samma beslut.\\n**Helt olika upplevelse.** | Slutsats
> Banken använder AI för kreditbedömning och din ansökan avslås.
> Med transparens får kunden en tydlig bild av varför beslutet fattades och möjlighet att agera. Fråga: Vilket svar skulle du vilja få?

---

[flöde]
etikett: Del 4 · Transparens
rubrik: Svarta lådan-problemet
slutsats: Lösningen är förklarbar AI (XAI): visa vilka faktorer som påverkade mest, ge liknande exempel från träningsdatan, eller låt en annan AI förklara svaret.
bakgrund: fokusljus
- Indata | Till exempel din ansökan
- ? | Ingen kan förklara exakt hur svaret togs fram
- Beslut | Till exempel ja eller nej
> Svaret kan vara rätt eller fel, men ingen kan förklara exakt hur det togs fram.
> Svarta lådan-problemet är ett av de största hindren för transparens. Det har lett till ett helt forskningsområde, förklarbar AI (XAI), där målet är metoder som gör besluten begripliga.

---

[vägval]
etikett: Del 4 · Transparens
rubrik: Bias och transparens hänger ihop
vänster: Utan transparens
höger: Med förklarbar AI
bakgrund: fokusljus
fokus: mjuk
- Insyn | Vi förstår inte hur systemet fungerar | Vi ser varför besluten fattas
- Bias | Blir svår att upptäcka och åtgärda | Kan upptäckas och rättas till
- Följden | Orättvisa beslut lever kvar utan granskning | AI kan accepteras i vården och rättsväsendet
> EU:s AI-förordning (AI Act) ställer krav på transparens och mänsklig kontroll när AI används i känsliga områden, t.ex. rekrytering, utbildning och kreditbedömning.
> En AI som ger svar utan att man förstår varför kan dölja bias. Därför är förklarbar AI avgörande för om AI ska kunna accepteras i viktiga samhällsfunktioner.
> Mer om EU:s AI-förordning i kapitel 6.

---

[kort]
etikett: Del 5 · Datamängder
rubrik: Data i verkligheten
bakgrund: fokusljus
steg: nej
- ImageNet | Över 14 miljoner bilder i tusentals kategorier, från ”katt” till ”skivstång”
- MNIST | 70 000 handskrivna siffror, klassiska i undervisning
- Språkmodeller | Enorma textmängder: Wikipedia, böcker, artiklar och dialoger
- Taldata | Tusentals timmar inspelat tal med text, ofta från frivilliga
- Sjukvårdsdata | Anonymiserade journaler: en rad per patient, kolumner för ålder och symptom
- Självspel | AI:n spelar mot sig själv och lär sig av varje parti
> ImageNet har varit avgörande för bildigenkänning. MNIST är klassisk i undervisning: samma teknik som när mobilen förstår en siffra du ritar.
> Taldata: öppna projekt som Mozilla Common Voice låter frivilliga spela in sig själva på olika språk. Tabelldata är vanligt inom medicin och ekonomi.

---

[bro]
etikett: Del 5 · Förstärkningsinlärning
rubrik: AlphaGo – AI som skapar sin egen data
text: Varje parti blir en datapunkt att lära sig av.
vänster: Spelet
höger: Ny erfarenhet
retur: Spela igen
bakgrund: fokusljus
- Prova ett drag
- Vinst eller förlust?
- Lär av resultatet
> Förstärkningsinlärning: modellen lär sig genom att prova sig fram. AlphaGo spelade miljontals partier mot sig själv, och varje parti blev en datapunkt att lära sig av.
> Googles AlphaGo slog 2016 sydkoreanen Lee Sedol med 4–1 och 2017 den kinesiske go-mästaren Ke Jie med 3–0. Go ansågs länge för komplext för datorer.
> Nyans: den AlphaGo som slog Lee Sedol lärde sig först av mänskliga partier och förbättrades sedan genom självspel. AlphaGo Zero (2017) lärde sig enbart genom att spela mot sig själv.

---

[karta]
etikett: Sammanfattning
rubrik: Det här tar vi med oss
bakgrund: fokusljus
steg: nej
- Vad är data? | AI lär sig av exempel i stället för färdiga regler
- Datakvalitet | Skräp in, skräp ut: korrekt, relevant, representativ
- Bias | Uppstår oftast i snedvriden data
- Transparens | Gör besluten möjliga att granska och rätta
- Datamängder | AI lär sig som vi: observerar, lyssnar, läser, övar
> Datan är grunden för AI. Det gäller oavsett om det handlar om bilder, text, ljud, simuleringar eller siffror i en tabell.

---

[fokus]
etikett: Diskutera i grupp
rubrik: Fem frågor
bakgrund: fokusljus
- Bias i praktiken | Ge ett konkret exempel där bias i data kan leda till orättvisa resultat i ett AI-system.
- Sociala medier | Kan datan du möter i sociala medier påverka din verklighetsuppfattning? Ge exempel.
- Datans ursprung | Varför är det viktigt att vara transparent med varifrån datan i AI-system kommer?
- Korrekt eller förklarbar? | Mer korrekt men svår att förklara, eller lite mindre korrekt men helt förklarbar? Vad väljer du i vården, rättsväsendet eller skolan?
- Helt fri från bias? | Kan ett AI-system någonsin vara helt fritt från bias? Borde det vara det?
> Frågorna kommer från boken. Förslag: dela klassen i grupper som får var sin fråga, och låt dem redovisa kort.
> Fråga 4 fungerar bra som en fyra-hörn-övning eller debatt.
