---
titel: Statistik i GeoGebra
kurs: Matematik 2
tema: djup
---

[titel]
etikett: Matematik 2c
rubrik: Statistik i GeoGebra
text: Från kalkylblad till medelvärde, standardavvikelse, lådagram, r-värde och normalfördelning.
> Alla skärmbilder är tagna i GeoGebra Classic på geogebra.org/classic, på svenska. Desktopversionen GeoGebra Classic 6 ser likadan ut.
> Exempeldata: längden i cm hos 15 elever, och timmar man pluggat mot poäng på ett prov för 8 elever. Talen är påhittade exempel.

---

[etapper]
etikett: Arbetsgången
rubrik: Fyra steg varje gång
- Öppna kalkylbladet | Välj Kalkylblad när GeoGebra startar.
- Skriv in värdena | Ett värde per cell, uppifrån och ned i kolumn A.
- Markera och analysera | Markera cellerna och välj ett analysverktyg.
- Läs av | Statistiken och diagrammet visas till höger.
> Samma arbetsgång gäller för envariabelanalys och tvåvariabelanalys. Normalfördelningen räknas i stället i Sannolikhet.

---

[avsnitt]
etikett: Del 1
rubrik: Envariabelanalys
text: Medelvärde, median, standardavvikelse, kvartiler och lådagram.

---

[bildregi]
etikett: Steg 1
rubrik: Öppna kalkylbladet
bild: bilder/statistik-geogebra/01-start.png
alt: GeoGebra Classic när programmet startar, med en lista över perspektiv till höger.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Klicka på Kalkylblad | 91.4 | 58.1 | 16.5 | 5.3 | Listan visas när GeoGebra startar.
> Har listan stängts: öppna menyn uppe till höger (tre streck), välj Perspektiv och sedan Kalkylblad.

---

[bildregi]
etikett: Steg 2
rubrik: Börja i cell A1
bild: bilder/statistik-geogebra/02-kalkylblad.png
alt: Ett tomt kalkylblad till vänster och ett koordinatsystem till höger.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Klicka i cell A1 | 5.4 | 10 | 4.6 | 3 | Skriv ett värde och tryck Enter. Markören hoppar ned till nästa cell.
- steg2 | Analysverktygen | 4.4 | 2.8 | 3 | 5 | Histogramikonen öppnar analysverktygen. Den används snart.
> Skriv bara tal i kolumnen, ingen rubrik. Decimaltal skrivs med punkt, till exempel 172.5.

---

[bildregi]
etikett: Steg 2
rubrik: Ett värde per cell
bild: bilder/statistik-geogebra/03-data.png
alt: Kolumn A innehåller femton längder i centimeter.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | 15 längder i kolumn A | 5.4 | 29.5 | 4.8 | 42 | Längden i cm hos 15 elever.
> Kontrollera att antalet stämmer: 15 värden ska ligga i A1 till A15.

---

[bildregi]
etikett: Steg 3
rubrik: Markera alla värden
bild: bilder/statistik-geogebra/04-markera.png
alt: Cellerna A1 till A15 är markerade.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Dra från A1 till A15 | 5.4 | 29.5 | 4.8 | 42 | Hela listan ska vara markerad innan du väljer verktyg.

---

[bildregi]
etikett: Steg 3
rubrik: Välj Envariabelanalys
bild: bilder/statistik-geogebra/05-verktyg.png
alt: Verktygsmenyn är öppen med Envariabelanalys, Tvåvariabels regressionsanalys och Flervariabelanalys.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Klicka på histogramikonen | 4.4 | 2.8 | 3 | 5 | En meny med tre analysverktyg öppnas.
- steg2 | Klicka på Envariabelanalys | 11.5 | 9.3 | 16.5 | 4.4 | En variabel: en lista med tal.

---

[bildregi]
etikett: Steg 4
rubrik: Analysen öppnas till höger
bild: bilder/statistik-geogebra/06-analys.png
alt: Ett histogram över längderna visas bredvid kalkylbladet.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Ett histogram visas direkt | 70 | 53 | 60 | 88 | Staplarna visar hur många elever som har en längd i varje intervall.
- steg2 | Klicka på Σx | 88.8 | 8.2 | 2.4 | 4 | Då visas all statistik.
> Blir analysfönstret smalt: dra i kanten mellan fönstren.

---

[bildregi]
etikett: Steg 4
rubrik: Läs av statistiken
bild: bilder/statistik-geogebra/07-statistik.png
alt: Statistiktabell med n, Medel, σ, s, Σx, Σx², Min, Q1, Median, Q3 och Max bredvid histogrammet.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 2.4
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Medelvärde | 49.9 | 12.2 | 19.5 | 2.5 | Medel = 172 cm. Summan 2580 delat med 15.
- steg2 | Standardavvikelse | 49.9 | 15.4 | 19.5 | 4.6 | σ = 7,02 och s = 7,27. Mer om skillnaden på nästa bild.
- steg3 | Min, kvartiler och max | 49.9 | 27 | 19.5 | 10.6 | Min 158, Q1 168, median 172, Q3 177, max 186.
> Kvartilavståndet är Q3 − Q1 = 177 − 168 = 9 cm. Variationsbredden är 186 − 158 = 28 cm.
> GeoGebra skriver decimalpunkt. I svaret skriver vi decimalkomma.

---

[delning]
etikett: Standardavvikelse
rubrik: σ eller s?
- Hela gruppen | σ, när alla i gruppen är med. Man delar med n.
- Ett stickprov | s, när datan är ett urval. Man delar med n − 1. På miniräknaren heter den sx.
- Exempel | 15 elever ur en skola är ett stickprov. Svara med s ≈ 7,3 cm.
> Formeln för stickprov: s = √(Σ(x − x̄)² / (n − 1)). GeoGebra räknar ut båda, så det viktiga är att välja rätt rad.
> I de flesta uppgifter i Matematik 2 är datan ett stickprov, och då gäller s.

---

[fråga]
rubrik: De 15 eleverna är ett urval ur skolan. Vilken rad läser du av?
svar: s = 7,27. Datan är ett stickprov, så standardavvikelsen är s (sx).
- σ = 7,02
- * s = 7,27
- Σx = 2580
- Q3 = 177

---

[bildregi]
etikett: Lådagram
rubrik: Byt diagram till lådagram
bild: bilder/statistik-geogebra/08-ladagram.png
alt: Ett lådagram över längderna med lådan från 168 till 177 och morrhår från 158 till 186.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Välj Boxplot (Lådagram) | 67.8 | 7.6 | 16 | 3.4 | Listan ovanför diagrammet byter diagramtyp.
- steg2 | Lådan går från Q1 till Q3 | 80.3 | 52.4 | 9.4 | 43.5 | Strecket i lådan är medianen, 172 cm. Hälften av eleverna finns i lådan.
- steg3 | Morrhåren når min och max | 79.8 | 52.4 | 29 | 45 | Från 158 cm till 186 cm.
> I listan finns också stolpdiagram, prickdiagram och stam-och-bladdiagram.

---

[avsnitt]
etikett: Del 2
rubrik: Tvåvariabelanalys
text: Spridningsdiagram, regressionslinje och r-värde.

---

[bildregi]
etikett: Två variabler
rubrik: x i kolumn A, y i kolumn B
bild: bilder/statistik-geogebra/09-tva-data.png
alt: Kolumn A innehåller antal timmar 1 till 8 och kolumn B poäng, markerade A1 till B8.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Markera båda kolumnerna | 7.6 | 19.8 | 9.2 | 22.6 | A: timmar man pluggat. B: poäng på provet.
> x-värdena ska stå till vänster och y-värdena till höger. Annars byts axlarna.

---

[bildregi]
etikett: Två variabler
rubrik: Välj Tvåvariabels regressionsanalys
bild: bilder/statistik-geogebra/10-tva-meny.png
alt: Verktygsmenyn med Tvåvariabels regressionsanalys.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Samma ikon som förut | 4.4 | 2.8 | 3 | 5 | Klicka på histogramikonen.
- steg2 | Klicka på Tvåvariabels regressionsanalys | 11.5 | 14 | 16.5 | 4.4 | Två variabler: par av x och y.

---

[bildregi]
etikett: Två variabler
rubrik: Spridningsdiagram och regressionsmodell
bild: bilder/statistik-geogebra/11-tva-analys.png
alt: Ett spridningsdiagram med åtta punkter och listan Regressionsmodell längst ned.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Punkterna visas direkt | 70.3 | 43.3 | 59.5 | 67 | Ser det ut som en rät linje?
- steg2 | Välj Linjär | 46.4 | 84.8 | 12 | 3.2 | Under Regressionsmodell väljer du Linjär. Klicka sedan på Σx.

---

[bildregi]
etikett: Två variabler
rubrik: Läs av r och linjens ekvation
bild: bilder/statistik-geogebra/12-tva-statistik.png
alt: Statistiktabell med Sx, Sy och r = 0,9672 och regressionslinjen y = 2,0833x + 9,75.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 2.4
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Sx och Sy | 49.9 | 19.4 | 19.5 | 4.4 | Standardavvikelsen för x och för y, båda som stickprov.
- steg2 | r = 0,9672 | 49.9 | 22.6 | 19.5 | 2.2 | Korrelationskoefficienten. Nära 1 betyder ett starkt positivt linjärt samband.
- steg3 | Linjens ekvation | 57.1 | 84.7 | 8.6 | 2.6 | y = 2,08x + 9,75. Varje extra timme ger cirka 2 poäng till.
> Fältet Beräkna under ekvationen ger y för ett valt x, till exempel prognosen för 10 timmar.
> r säger hur väl punkterna följer en rät linje. Ett starkt samband betyder inte att det ena orsakar det andra.

---

[spektrum]
etikett: Korrelation
rubrik: Vad betyder r-värdet?
slutsats: Ju närmare −1 eller 1, desto bättre följer punkterna en rät linje.
vänster: r = −1
höger: r = 1
- 3 | r nära −1 | Starkt negativt samband. Punkterna följer en fallande linje.
- 50 | r nära 0 | Inget linjärt samband.
- 98 | r = 0,967 | Vårt exempel: starkt positivt samband.

---

[avsnitt]
etikett: Del 3
rubrik: Normalfördelning
text: Andelar och sannolikheter när μ och σ är kända.

---

[bildregi]
etikett: Normalfördelning
rubrik: Öppna Sannolikhet
bild: bilder/statistik-geogebra/13-start-sannolikhet.png
alt: GeoGebra Classic vid start med perspektivet Sannolikhet i listan.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Klicka på Sannolikhet | 91.4 | 63.5 | 16.5 | 5.3 | Där finns en kalkylator för normalfördelningen.

---

[bildregi]
etikett: Normalfördelning
rubrik: Skriv in μ och σ
bild: bilder/statistik-geogebra/14-normal.png
alt: Normalfördelning med μ = 180 och σ = 7. Området mellan 173 och 187 är skuggat, P = 0,6827.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | μ = 180 och σ = 7 | 27.6 | 64.2 | 24.8 | 5.6 | Längden hos 18-åriga män antas vara normalfördelad.
- steg2 | Välj typ av intervall | 6.3 | 80.3 | 10.8 | 4.4 | Vänstersidigt, mellan två gränser, utanför eller högersidigt.
- steg3 | Svaret står längst ned | 10.5 | 85.6 | 19.5 | 3.8 | P(173 ≤ X ≤ 187) = 0,6827. Cirka 68 % ligger inom en standardavvikelse.
> Exemplets μ och σ är påhittade för att räkningen ska bli tydlig.

---

[bildregi]
etikett: Normalfördelning
rubrik: Hur många är längre än 190 cm?
bild: bilder/statistik-geogebra/15-normal-hoger.png
alt: Högersidigt intervall med gränsen 190. Svansen till höger är skuggad och P = 0,0766.
bildläge: guided
återställ: nej
textband: kompakt
maxzoom: 1.65
beskärning: cover
övergång: tona
rubrikrörelse: ingen
- steg1 | Välj högersidigt intervall | 10.4 | 80.3 | 2.6 | 4.4 | Det sista intervallet: från en gräns och uppåt.
- steg2 | Skriv gränsen 190 | 4.8 | 85.6 | 5.6 | 3.8 | Fältet till vänster om ≤ X.
- steg3 | Läs av svaret | 13 | 85.6 | 5.6 | 3.8 | P(X ≥ 190) ≈ 0,077. Ungefär 7,7 % är längre än 190 cm.
- steg4 | Det skuggade området | 74.5 | 50.5 | 21 | 11 | Arean under kurvan är sannolikheten.
> Kontroll: 190 ligger 10/7 ≈ 1,4 standardavvikelser över medelvärdet. Svaret ska då vara mellan 2,3 % och 16 %.

---

[rad]
etikett: Tumregel
rubrik: Andelar i en normalfördelning
text: Gäller alla normalfördelningar, oavsett μ och σ.
slutsats: Tumregeln ger en snabb kontroll av svaret från GeoGebra.
- 68 % | inom μ ± σ. Här 173–187 cm.
- 95 % | inom μ ± 2σ. Här 166–194 cm.
- 99,7 % | inom μ ± 3σ. Här 159–201 cm.
> Tumregelns andelar är avrundade. GeoGebra ger 0,6827, 0,9545 och 0,9973.

---

[lexikon]
etikett: Sammanfattning
rubrik: Det viktigaste
- Medelvärde | Läge | Summan av värdena delat med antalet. | 2580 / 15 = 172 cm
- Median | Läge | Det mittersta värdet när värdena står i storleksordning. | 172 cm
- Standardavvikelse s | Spridning | Hur mycket värdena i genomsnitt avviker från medelvärdet, för ett stickprov (sx). | s ≈ 7,27 cm
- Kvartiler | Spridning | Q1 och Q3 delar datan i fjärdedelar. Kvartilavståndet är Q3 − Q1. | 177 − 168 = 9 cm
- Lådagram | Diagram | Visar min, Q1, median, Q3 och max. | Lådan 168–177 cm
- r-värde | Samband | Hur väl punkterna följer en rät linje, mellan −1 och 1. | r ≈ 0,967
- Normalfördelning | Modell | Klockformad fördelning som bestäms av μ och σ. | P(X ≥ 190) ≈ 0,077
