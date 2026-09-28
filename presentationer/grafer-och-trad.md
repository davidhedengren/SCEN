---
titel: Grafer, träd och beslutsträd inom AI
tema: natt
---

[titel]
etikett: Klassisk AI
rubrik: Grafer, träd och beslutsträd
text: Strukturer som låter en dator representera relationer och fatta beslut.
bild: bilder/grafer-och-trad/natverk-titel.jpg
> Presentation av David Hedengren.

---

[typografi]
etikett: Klassisk AI
- statement | Grafer och träd **representerar** relationer. | Etablering
- focus | Sökalgoritmer **navigerar** dem. | Fokus
- precisering | Så blir problemlösning till **beslut**. | Precisering
> Grafer och träd används för att representera och analysera relationer mellan data. Sökalgoritmer utnyttjar strukturerna för att hitta lösningar.

---

[ordbild]
etikett: Del 1
rubrik: Grafer
text: Noder och kanterna mellan dem.
bild: bilder/grafer-och-trad/natverk-karta.jpg

---

[graf]
etikett: Datastruktur
rubrik: En graf består av noder och kanter
text: En graf är en datastruktur där noder är sammankopplade med kanter.
slutsats: Samma struktur kan beskriva vägar, vänskaper, länkar eller tillstånd i ett spel.
- nod: Göteborg | 4 52
- nod: Falköping | 38 12
- nod: Jönköping | 70 30
- nod: Nässjö | 96 50
- nod: Malmö | 34 96
- kant: Göteborg - Falköping
- kant: Falköping - Jönköping
- kant: Jönköping - Nässjö
- kant: Göteborg - Malmö
- kant: Jönköping - Malmö
- kant: Nässjö - Malmö
- fokus: noder | Noder | Punkterna i grafen. De representerar tillstånd eller objekt, här orter.
- fokus: kanter | Kanter | Representerar relationer mellan noderna. De kan vara riktade eller oriktade.
- fokus: Jönköping | En nod och dess kanter | Jönköping har kanter till tre andra orter.
> Riktad kant: relationen gäller bara åt ett håll, som en enkelriktad gata eller att följa någon på sociala medier.

---

[graf]
etikett: Viktad graf
rubrik: Vikter gör vägar jämförbara
text: I en viktad graf har varje kant ett värde, till exempel avstånd, kostnad eller tid.
slutsats: Ruttoptimering är att hitta vägen med lägst summa. Sökalgoritmer gör det i stora grafer.
- nod: Göteborg | 4 52
- nod: Falköping | 38 12
- nod: Jönköping | 70 30
- nod: Nässjö | 96 50
- nod: Malmö | 34 96
- kant: Göteborg - Falköping | 70
- kant: Falköping - Jönköping | 50
- kant: Jönköping - Nässjö | 25
- kant: Göteborg - Malmö | 190
- kant: Jönköping - Malmö | 150
- kant: Nässjö - Malmö | 160
- fokus: vikter | Vikter | Varje kant har ett värde. Här är det påhittade restider i minuter.
- fokus: Göteborg > Malmö > Nässjö | En möjlig väg | Via Malmö kommer vi fram, men vägen är lång.
- fokus: Göteborg > Falköping > Jönköping > Nässjö | Kortaste vägen | Samma start och mål. Lägst summa av vikterna.
> Vikterna är exempelvärden, inte verkliga restider. Fråga gärna klassen innan klick 3: vilken väg är kortast?

---

[prisma]
etikett: Grafer i AI
rubrik: En struktur, många användningar
fråga: Vad hänger ihop med vad?
gemensamt: Alla beskriver relationer som noder och kanter.
- Sociala nätverk | Relationer mellan användare | Används för att rekommendera kontakter
- Rekommendationer | Användare och produkter | Hittar produkter eller tjänster någon troligen gillar
- Ruttoptimering | Platser och vägar | Hittar den kortaste vägen mellan två punkter
- Bildigenkänning | Objekt i en bild | Identifierar objekt och relationerna mellan dem

---

[ordbild]
etikett: Del 2
rubrik: Träd
text: En graf med hierarki och utan cykler.
bild: bilder/grafer-och-trad/trad-ljus.jpg

---

[träd]
etikett: Datastruktur
rubrik: Ett träd är en graf med hierarki
text: Varje nod har högst en förälder, och det finns inga cykler.
slutsats: Ett binärt träd: varje nod har högst två barn. Här har varje förälder två.
- 1
  - 2
    - 4
    - 5
  - 3
    - 6
    - 7
- fokus: rot | Rotnod | Den översta noden i trädet.
- fokus: barn 1 | Barnnoder | En nod som är direkt efterföljare till en annan nod. 2 och 3 är barn till 1.
- fokus: föräldrar | Föräldranoder | En nod som har barnnoder.
- fokus: löv | Lövnoder | En nod som inte har några barn.

---

[omröstning]
rubrik: Ett binärt träd har tre helt fyllda nivåer. Hur många lövnoder har det?
svar: Fyra. I exemplet är det noderna 4, 5, 6 och 7.
- 2
- 3
- * 4
- 7
> "Helt fyllda nivåer" behövs: ett binärt träd med tre nivåer kan annars ha allt från ett till fyra löv.
> Alternativet 7 är antalet noder totalt, en vanlig förväxling.

---

[fokus]
etikett: Träd i AI
rubrik: Tre sorters träd
- Sökträd | Organiserar data så att den går snabbt att söka i.
- Beslutsträd | Visualiserar och strukturerar beslutsprocesser.
- Spelträd | Simulerar möjliga drag för att hitta den bästa strategin.

---

[träd]
etikett: Beslutsträd
rubrik: Vad kostar bostaden?
text: Ett beslutsträd representerar en serie beslut och deras möjliga resultat.
slutsats: Trädet ställer frågorna i tur och ordning tills det når ett löv.
- Kvadratmeter?
  - ≤ 100: Antal rum?
    - ≤ 4: < 1 Mkr
    - > 4: 1–2 Mkr
  - > 100: Antal rum?
    - ≤ 4: 2 Mkr
    - > 4: > 2 Mkr
- fokus: föräldrar | Noder är frågor | Noderna representerar oftast frågor om attribut i datan.
- fokus: grenar | Grenar är svar | Varje gren är ett möjligt svar på en fråga.
- fokus: löv | Löv är resultat | Varje löv är ett slutligt resultat.
- fokus: väg ≤ 100 > > 4 | Ett fall | 80 kvadratmeter och fem rum. Trädet svarar 1–2 Mkr.

---

[etapper]
etikett: Lektionsaktivitet
rubrik: Beslutsträd med apor
- Utforska | Träningsdata: apor där vi vet om de bits eller inte.
- Skapa regler | I par: kriterier som avgör om en apa bits.
- Testa | Byt träd med en annan grupp och bedöm nya apor.
- Utvärdera | Jämför med facit. Vilka regler höll?
> Ni är djurvårdare på en djurpark och ansvarar för att mata aporna. Instruktionen och bilderna på aporna finns i Teams.
> Kriterierna kan baseras på apans ansiktsuttryck, till exempel tänder, mun eller ögon.

---

[träd]
etikett: Exempel
rubrik: Bits apan?
text: Ett beslutsträd som en grupp kan ha byggt av träningsdatan.
slutsats: Testa trädet på testdatan. Ett bra träd gissar rätt på apor det aldrig har sett.
- Visar tänderna?
  - Ja: Bits
  - Nej: Öppen mun?
    - Nej: Bits inte
    - Ja: Öppna ögon?
      - Ja: Bits
      - Nej: Bits inte
- fokus: rot | Första frågan | Trädet börjar alltid med tänderna.
- fokus: väg Ja | Tänderna syns | Svaret kommer direkt: bits.
- fokus: väg Nej > Ja > Ja | Fler frågor | Tänderna syns inte, men munnen och ögonen är öppna: bits.
- fokus: väg Nej > Nej | Stängd mun | Två frågor räcker: bits inte.

---

[sats]
rubrik: Tre strukturer, ett syfte
text: Verktyg för att representera data, fatta beslut och göra förutsägelser.
- Grafer | Nätverk av noder: rutter, flöden och relationer.
- Träd | Hierarkier: effektiv sökning och sortering.
- Beslutsträd | Alternativ och utfall i en grenad struktur.

---

[kort]
etikett: Uppgifter
rubrik: Nu är det er tur
- 1 Egen graf | Minst fem noder, till exempel ett vägnät. Vad kan grafen användas till?
- 2 Valfritt träd | Minst tre nivåer, till exempel ett släktträd eller en katalogstruktur.
- 3 Beslutsträd | Ett vardagligt val med minst fyra noder. Förklara logiken.
- 4 Träd i AI | Hur kan ett träd användas i ett AI-system? Varför är träd viktiga?
