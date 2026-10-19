---
titel: Beslutsträd med apor
kurs: Artificiell Intelligens 1
tema: natt
---

[ridå]
etikett: Lektionsaktivitet
rubrik: Bits apan?
text: Bygg ett beslutsträd för hand och pröva det på apor som det aldrig har sett.
bild: bilder/beslutstrad-apor/apor-alla.jpg
alt: Fyrtio tecknade apor på blå och gröna kort, med olika munnar, ögon och saker på huvudet.
> Aktiviteten bygger på The Good-Monkey-Bad-Monkey Game ur AI Unplugged (Annabel Lindner och Stefan Seegerer). Apkorten är CC BY-NC.
> Material: utskrivna apkort (träningsdata och testdata i separata högar), penna och papper. Instruktionen ligger i Teams.

---

[typografi]
etikett: Uppdraget
- statement | Ni är **djurvårdare** och matar aporna. | Situation
- focus | Vissa apor **bits**. | Problem
- precisering | Snart kommer nya apor. Vilka av dem **bits**? | Uppdrag
> Vi vet redan vilka av de nuvarande aporna som bits. De är vår träningsdata. Nu vill vi hitta regler som fungerar på nya apor, helst utan att komma nära tänderna.

---

[bildregi]
etikett: Exempel
rubrik: Åtta ormar där vi vet om de är giftiga eller inte
bild: bilder/beslutstrad-apor/ormar-traning.svg
alt: Fyra giftiga och fyra ofarliga tecknade ormar. De giftiga har triangulärt huvud och smala pupiller.
bildläge: guided
textband: kompakt
maxzoom: 1.65
- giftiga | Giftiga | 27.6 | 47.4 | 34 | 74 | Alla fyra har triangulärt huvud och smala pupiller.
- huvud | Triangulärt huvud räcker inte | 64.1 | 29.4 | 17 | 36 | Orm 05 har triangulärt huvud men runda pupiller och den är ofarlig.
- pupill | Smala pupiller räcker inte | 64.1 | 65.5 | 17 | 36 | Orm 07 har smala pupiller men runt huvud och är också ofarlig.
- färg | Färgen avslöjar inget | 50 | 47 | 96 | 86 | Det finns röda ormar i båda grupperna.
> Fråga klassen innan första klicket: vad har de giftiga ormarna gemensamt som de ofarliga saknar?
> Ormarna är ett urval ur aktiviteten på ai-aktiviteter.se/beslutstrad, där hela träningsdatan har 20 ormar.

---

[träd]
etikett: Exempel
rubrik: Är ormen giftig?
text: Genom att fråga om huvudform och pupiller kan vi sortera alla åtta ormarna i exemplet rätt.
slutsats: Varje fråga (nod) handlar om något man kan se på bilderna.
- Huvudform?
  - Runt: Ofarlig
  - Triangulärt: Pupiller?
    - Runda: Ofarlig
    - Smala: Giftig
- fokus: rot | Första frågan | Huvudformen delar ormarna i två grupper.
- fokus: väg Runt | Runt huvud | 07 och 08. Båda är ofarliga.
- fokus: väg Triangulärt | Triangulärt huvud | 01–06 går vidare till nästa fråga: pupillerna.
- fokus: väg Triangulärt > Runda | Runda pupiller | 05 och 06 är ofarliga.
- fokus: väg Triangulärt > Smala | Smala pupiller | 01–04 är giftiga.
@bild 144 640 540 310 passning=hela | bilder/beslutstrad-apor/ormar-mini.svg
> Miniatyrerna är de åtta ormarna från förra bilden. Följ varje orm genom trädet tillsammans med klassen.

---

[träd]
etikett: Testdata
rubrik: Är ormen giftig?
text: Två ormar som trädet aldrig har sett. Vi följer dem en fråga i taget.
slutsats: Eran uppgift är att göra samma sak, fast av en större datamängd med apor.
- Huvudform?
  - Runt: Ofarlig
  - Triangulärt: Pupiller?
    - Runda: Ofarlig
    - Smala: Giftig
- fokus: steg Triangulärt > Smala | Ny orm 1 | Triangulärt huvud och smala pupiller. Trädet svarar giftig. | bilder/beslutstrad-apor/orm-ny.svg
- fokus: steg Triangulärt > Runda | Ny orm 2 | Triangulärt huvud men runda pupiller. Trädet svarar ofarlig. | bilder/beslutstrad-apor/orm-ny-2.svg
> Första klicket visar ormen vid roten. Varje klick därefter går en fråga ner i trädet. Fråga klassen före varje klick: vilket svar gäller för den här ormen?
> Båda ormarna kommer från testdatan i ai-aktiviteter.se/beslutstrad. Ny orm 1 är giftig och ny orm 2 är ofarlig, så trädet gissar rätt på båda.

---

[etapper]
etikett: Så går det till
rubrik: Bygg ett beslutsträd och testa nya apor
- Utforska | I par: sortera träningsaporna och leta efter mönster.
- Bygg trädet | Rita ett beslutsträd som avgör om en apa bits eller inte.
- Byt och testa | Använd en annan grupps träd på nya apor.
- Utvärdera | Jämför med facit. Vilket träd fungerade bäst?
> Ur instruktionen: reglerna ska skrivas så tydligt att en annan grupp kan använda dem utan att fråga.

---

[bildregi]
etikett: Träningsdata
rubrik: Undersök egenskaper hos aporna
text: 27 apor där vi vet svaret. Här ligger de blandade.
bild: bilder/beslutstrad-apor/traningsdata-blandad.png
alt: De 27 träningsaporna blandade i fyra rader, utan uppdelning i bits och bits inte.
bildläge: guided
textband: kompakt
maxzoom: 3
- m1 | Munnen | 14.69 | 58.24 | 9.84 | 8.17 | Visar tänderna (apa 01).
- m2 | Munnen | 14.69 | 79.17 | 9.84 | 8.17 | Ler (apa 05).
- m3 | Munnen | 73.54 | 58.24 | 9.84 | 8.17 | Sur (apa 09).
- m4 | Munnen | 26.46 | 16.39 | 9.84 | 8.17 | Öppen (apa 14).
- m5 | Munnen | 50 | 16.39 | 9.84 | 9.72 | Tungan ute (apa 17).
- o1 | Ögonen | 14.69 | 52.41 | 9.84 | 5.83 | Båda öppna (apa 01).
- o2 | Ögonen | 61.77 | 73.33 | 9.84 | 5.83 | Ett öga blinkar (apa 10).
- o3 | Ögonen | 50 | 31.48 | 9.84 | 5.83 | Stängda (apa 04).
- o4 | Ögonen | 85.31 | 10.56 | 9.84 | 5.83 | Kryss (apa 07).
- s1 | Saker och detaljer | 38.23 | 75.28 | 11.59 | 20.61 | Glasögon (apa 25).
- s2 | Saker och detaljer | 38.23 | 12.5 | 11.59 | 20.61 | Rosett (apa 30).
- s3 | Saker och detaljer | 85.31 | 33.43 | 11.59 | 20.61 | Mask (apa 37).
- s4 | Saker och detaljer | 73.54 | 12.5 | 11.59 | 20.61 | Plåster (apa 39).
- s5 | Saker och detaljer | 38.23 | 33.43 | 11.59 | 20.61 | Rufsigt hår (apa 24).
> Aporna är blandade så att det inte syns vilka som bits. Gå igenom vad man kan titta på, inte vilka egenskaper som spelar roll.
> Sista klicket visar alla apor igen. Diskutera egenskaperna innan ni går vidare.
> Eleverna har samma apor som kort. Testaporna delas inte ut än.

---

[fri]
@text 144 70 1632 110 storlek=76 typsnitt=rubrik | Sortera era kort
@form 144 220 800 720 färg=accent2 bakgrund=yta
@form 976 220 800 720 bakgrund=yta
@text 200 250 700 110 storlek=84 färg=accent2 typsnitt=rubrik | Bits
@text 1032 250 700 110 storlek=84 färg=accent typsnitt=rubrik | Bits inte
@text 200 400 160 110 storlek=88 | 01
@text 370 400 160 110 storlek=88 | 02
@text 540 400 160 110 storlek=88 | 05
@text 710 400 160 110 storlek=88 | 09
@text 200 525 160 110 storlek=88 | 10
@text 370 525 160 110 storlek=88 | 14
@text 540 525 160 110 storlek=88 | 15
@text 710 525 160 110 storlek=88 | 16
@text 200 650 160 110 storlek=88 | 17
@text 370 650 160 110 storlek=88 | 28
@text 540 650 160 110 storlek=88 | 33
@text 710 650 160 110 storlek=88 | 35
@text 200 775 160 110 storlek=88 | 36
@text 1032 400 160 110 storlek=88 | 04
@text 1202 400 160 110 storlek=88 | 07
@text 1372 400 160 110 storlek=88 | 12
@text 1542 400 160 110 storlek=88 | 19
@text 1032 525 160 110 storlek=88 | 22
@text 1202 525 160 110 storlek=88 | 23
@text 1372 525 160 110 storlek=88 | 24
@text 1542 525 160 110 storlek=88 | 25
@text 1032 650 160 110 storlek=88 | 30
@text 1202 650 160 110 storlek=88 | 32
@text 1372 650 160 110 storlek=88 | 37
@text 1542 650 160 110 storlek=88 | 38
@text 1032 775 160 110 storlek=88 | 39
@text 1202 775 160 110 storlek=88 | 40
@text 144 965 1632 60 storlek=36 färg=dampad | 13 apor bits och 14 bits inte. Lägg korten i två högar.
> Bilden visar bara nummer, så att eleverna själva letar fram och sorterar sina kort.
> Nästa bild visar aporna sorterade, med ledtrådar. Den kan stå kvar när paren har kommit en bit.

---

[bildregi]
etikett: I par
rubrik: Bygg ett beslutsträd som avgör om en apa bits
text: Rita trädet så att en annan grupp kan följa det.
bild: bilder/beslutstrad-apor/traningsdata.png
alt: Tretton apor som bits till vänster och fjorton apor som inte bits till höger.
bildläge: guided
textband: kompakt
maxzoom: 1.4
- l1 | Ledtråd 1 | 27 | 48.1 | 43 | 76 | Finns det någon egenskap som bara finns hos apor som bits?
- l2 | Ledtråd 2 | 27 | 57.6 | 43 | 57 | Titta på munnen. Vilken sorts mun finns bara bland apor som bits?
- l3 | Ledtråd 3 | 73 | 57.6 | 43 | 57 | Titta på aporna som inte bits. Vad har många av dem på sig?
- l4 | Ledtråd 4 | 50 | 19.8 | 92 | 20 | Jämför ögonen i översta raden. Vad skiljer apor som bits från apor som inte bits?
- l5 | Ledtråd 5 | 50 | 47 | 96 | 86 | Spelar tungan eller håret någon roll? Leta efter dem i båda grupperna.
> Låt den här bilden stå kvar medan paren bygger. Klicka fram en ledtråd i taget när många har fastnat.
> Ledtråd 2: alla sex träningsapor med öppen mun bits. Ledtråd 3: glasögon, rosett, mask och plåster. Ledtråd 4: översta raden till vänster har öppna ögon, till höger stängda eller kryss.
> Ett träd behöver inte vara perfekt på träningsdatan. Låt eleverna själva upptäcka hur svårt det är att få med alla.

---

[helbild]
etikett: Byt träd med en annan grupp. Följ deras träd och skriv bits eller bits inte för varje apa.
rubrik: Testdata: 13 nya apor
bild: bilder/beslutstrad-apor/testdata.png
alt: Tretton apor som eleverna inte har sett, utan svar.
> Dela ut testkorten först nu. Eleverna följer den andra gruppens träd och gissar inte själva.

---

[helbild]
etikett: Räkna hur många av de 13 som trädet fick rätt.
rubrik: Facit
bild: bilder/beslutstrad-apor/testdata-facit.png
alt: De tretton testaporna med facit. Apa 06, 13, 18 och 34 bits. De andra bits inte.
> Bits: 06, 13, 18 och 34. Bits inte: 03, 08, 11, 20, 21, 26, 27, 29 och 31.
> Facit följer AI Unplugged, version 2, och stämmer med datasetet Apor data.

---

[omröstning]
rubrik: Hur många av de 13 testaporna fick trädet ni använde rätt?
- 13
- 11–12
- 8–10
- Färre än 8
> Räkna händer med tangenterna 1–4. Låt grupperna med flest rätt berätta vilken fråga trädet började med.
> Att alltid svara "bits inte" ger 9 av 13. Ett träd bör slå det.

---

[träd]
etikett: Ett möjligt träd
rubrik: Ett träd som klarar alla apor
text: Det går att konstruera ett träd med 3 frågor som kan klassificera alla apor både i träningsdatan och testdatan. Vi testar några testapor genom trädet.
slutsats: 27 av 27 träningsapor och 13 av 13 testapor. Men det finns fler träd som fungerar.
- Öppen mun?
  - Ja: Bits
  - Nej: Bär den något?
    - Ja: Bits inte
    - Nej: Något öga öppet?
      - Ja: Bits
      - Nej: Bits inte
- fokus: steg Ja | Apa 13 | Öppen mun. Den bits. | bilder/beslutstrad-apor/kort-13.png
- fokus: steg Nej > Ja | Apa 29 | Ingen öppen mun, men en mask. Den bits inte. | bilder/beslutstrad-apor/kort-29.png
- fokus: steg Nej > Nej > Ja | Apa 06 | Inget på sig och ett öppet öga. Den bits. | bilder/beslutstrad-apor/kort-06.png
- fokus: steg Nej > Nej > Nej | Apa 08 | Inget på sig och stängda ögon. Den bits inte. | bilder/beslutstrad-apor/kort-08.png
- fokus: steg Nej > Ja | Apa 26 | Plåstret räknas som en sak. Den bits inte. | bilder/beslutstrad-apor/kort-26.png
> Visa först efter att eleverna har testat sina egna träd och sett facit.
> Första klicket för varje apa visar den vid roten. Varje klick därefter går en fråga ner. Fråga klassen före varje klick: vad svarar apan på frågan?
> Trädet är samma som i AI Unplugged (Open mouth? Accessory? At least one eye open?). Plåstret räknas som en sak. Annars blir apa 26 fel.
> Rufsigt hår och tungan spelar ingen roll. Den som byggde regler på dem har hittat mönster som bara råkar finnas i träningsdatan.

---

[spegel]
etikett: Svåra fall
rubrik: Två apor som träningsdatan inte förberedde oss på
slutsats: En modell kan bara lära sig det som syns i träningsdatan.
- Apa 21 | Okänd mun | bilder/beslutstrad-apor/apa-21.png
- Apa 26 | Plåster och öppet öga | bilder/beslutstrad-apor/apa-26.png
- vänster: 50 71 | Ingen träningsapa har den munnen | Vad gör ett träd som bara frågar om munnen?
- höger: 62 18 | Plåstret eller ögat? | Alla träningsapor med plåster hade kryss i ögonen. Datan kan inte avgöra vad som spelar roll.
> Apa 21 bits inte och apa 26 bits inte.
> Ur AI Unplugged: när ett nytt fall skiljer sig mycket från träningsdatan är det svårt att förutsäga vad ett AI-system gör. Jämför med en självkörande bil som tvärbromsar för löv på vägen.

---

[sats]
rubrik: Hur lär sig en dator?
text: I kapitel 3 ska vi se hur vi kan använda maskininlärning för att låta ett AI-system bygga beslutsträd åt oss.
- Träningsdata | Exempel där svaret är känt. Modellen byggs av dessa exempel.
- Testdata | Nya exempel som modellen aldrig sett. De visar om den fungerar.
- Överanpassning | Modellen lär sig träningsdatan utantill och klarar nya fall sämre.
> Fråga avslutningsvis: hur gick er egen inlärning till? Jämför med hur en dator bygger ett träd. Ingen modell är 100 procent rätt, och vi väljer den som klarar testdatan bäst.
