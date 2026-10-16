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
rubrik: Åtta ormar där vi vet svaret
bild: bilder/beslutstrad-apor/ormar-traning.svg
alt: Fyra giftiga och fyra ofarliga tecknade ormar. De giftiga har triangulärt huvud och smala pupiller.
bildläge: guided
textband: kompakt
maxzoom: 1.65
- giftiga | Giftiga | 27.6 | 47.4 | 34 | 74 | Alla fyra har triangulärt huvud och smala pupiller.
- huvud | Triangulärt huvud räcker inte | 64.1 | 29.4 | 17 | 36 | Orm 05 har triangulärt huvud men runda pupiller. Den är ofarlig.
- pupill | Smala pupiller räcker inte | 64.1 | 65.5 | 17 | 36 | Orm 07 har smala pupiller men runt huvud. Den är också ofarlig.
- färg | Färgen avslöjar inget | 50 | 47 | 96 | 86 | Det finns röda ormar i båda grupperna.
> Fråga klassen innan första klicket: vad har de giftiga ormarna gemensamt som de ofarliga saknar?
> Ormarna är ett urval ur aktiviteten på ai-aktiviteter.se/beslutstrad, där hela träningsdatan har 20 ormar.

---

[träd]
etikett: Exempel
rubrik: Är ormen giftig?
text: Två frågor räcker för att sortera alla åtta ormarna rätt.
slutsats: Varje fråga handlar om något man kan se.
- Huvudform?
  - Runt: Ofarlig
  - Triangulärt: Pupiller?
    - Runda: Ofarlig
    - Smala: Giftig
- fokus: väg Runt | Första frågan | Runt huvud: 07 och 08. Båda är ofarliga.
- fokus: väg Triangulärt > Runda | Andra frågan | Triangulärt huvud men runda pupiller: 05 och 06 är ofarliga.
- fokus: väg Triangulärt > Smala | Giftiga | Triangulärt huvud och smala pupiller: 01–04.
@bild 144 640 540 310 passning=hela | bilder/beslutstrad-apor/ormar-mini.svg
> Miniatyrerna är de åtta ormarna från förra bilden. Följ varje orm genom trädet tillsammans med klassen.

---

[träd]
etikett: Testdata
rubrik: Är ormen giftig?
text: En orm som trädet aldrig har sett.
slutsats: Nu gör ni samma sak, fast med apor och utan facit.
- Huvudform?
  - Runt: Ofarlig
  - Triangulärt: Pupiller?
    - Runda: Ofarlig
    - Smala: Giftig
- fokus: väg Triangulärt > Smala | En ny orm | Triangulärt huvud och smala pupiller. Trädet svarar giftig. | bilder/beslutstrad-apor/orm-ny.svg
> Fråga klassen innan klicket: vad svarar trädet? Ormen kommer från testdatan i ai-aktiviteter.se/beslutstrad och är giftig.

---

[etapper]
etikett: Så går det till
rubrik: Från apkort till ett prövat träd
- Utforska | I par: sortera träningsaporna och leta efter mönster.
- Bygg trädet | Rita ett beslutsträd som avgör om en apa bits.
- Byt och testa | Använd en annan grupps träd på nya apor.
- Utvärdera | Jämför med facit. Vilket träd fungerade bäst?
> Ur instruktionen: reglerna ska skrivas så tydligt att en annan grupp kan använda dem utan att fråga.

---

[bildregi]
etikett: Träningsdata
rubrik: Vad ska ni titta på?
text: 27 apor där vi vet svaret: 13 bits och 14 bits inte.
bild: bilder/beslutstrad-apor/traningsdata.png
alt: Tretton apor som bits till vänster och fjorton apor som inte bits till höger.
bildläge: guided
textband: kompakt
maxzoom: 3
- m1 | Munnen | 11.04 | 23.3 | 9 | 8 | Visar tänderna (apa 01).
- m2 | Munnen | 32.29 | 23.3 | 9 | 8 | Ler (apa 05).
- m3 | Munnen | 42.92 | 23.3 | 9 | 8 | Sur (apa 09).
- m4 | Munnen | 21.67 | 42.2 | 9 | 8 | Öppen (apa 14).
- m5 | Munnen | 11.04 | 62.5 | 9 | 10 | Tungan ute (apa 17).
- o1 | Ögonen | 11.04 | 18.1 | 9 | 6 | Båda öppna (apa 01).
- o2 | Ögonen | 11.04 | 36.9 | 9 | 6 | Ett öga blinkar (apa 10).
- o3 | Ögonen | 57.08 | 18.1 | 9 | 6 | Stängda (apa 04).
- o4 | Ögonen | 67.71 | 18.1 | 9 | 6 | Kryss (apa 07).
- s1 | Saker och detaljer | 88.96 | 38.7 | 10.5 | 18.5 | Glasögon (apa 25).
- s2 | Saker och detaljer | 57.08 | 57.6 | 10.5 | 18.5 | Rosett (apa 30).
- s3 | Saker och detaljer | 78.33 | 57.6 | 10.5 | 18.5 | Mask (apa 37).
- s4 | Saker och detaljer | 57.08 | 76.5 | 10.5 | 18.5 | Plåster (apa 39).
- s5 | Saker och detaljer | 78.33 | 38.7 | 10.5 | 18.5 | Rufsigt hår (apa 24).
> Visa vad man kan titta på, men inte vilka egenskaper som spelar roll. Det ska eleverna komma fram till själva.
> Sista klicket visar alla apor i färg igen. Diskutera egenskaperna innan ni går vidare.
> Eleverna har samma apor som kort. Testaporna delas inte ut än.

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
text: Tre frågor räcker för både träningsdatan och testdatan. Vi skickar några testapor genom trädet.
slutsats: 27 av 27 träningsapor och 13 av 13 testapor. Men det finns fler träd som fungerar.
- Öppen mun?
  - Ja: Bits
  - Nej: Bär den något?
    - Ja: Bits inte
    - Nej: Något öga öppet?
      - Ja: Bits
      - Nej: Bits inte
- fokus: väg Ja | Apa 13 | Öppen mun. Den bits. | bilder/beslutstrad-apor/kort-13.png
- fokus: väg Nej > Ja | Apa 29 | Ingen öppen mun, men en mask. Den bits inte. | bilder/beslutstrad-apor/kort-29.png
- fokus: väg Nej > Nej > Ja | Apa 06 | Inget på sig och ett öppet öga. Den bits. | bilder/beslutstrad-apor/kort-06.png
- fokus: väg Nej > Nej > Nej | Apa 08 | Inget på sig och stängda ögon. Den bits inte. | bilder/beslutstrad-apor/kort-08.png
- fokus: väg Nej > Ja | Apa 26 | Plåstret räknas som en sak. Den bits inte. | bilder/beslutstrad-apor/kort-26.png
> Visa först efter att eleverna har testat sina egna träd och sett facit.
> Fråga klassen före varje klick: vart går apan i trädet?
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
rubrik: Så lär sig en dator också
text: Ni har gjort övervakad inlärning för hand.
- Träningsdata | Exempel där svaret är känt. Modellen byggs av dem.
- Testdata | Nya exempel som modellen aldrig sett. De visar om den fungerar.
- Överanpassning | Modellen lär sig träningsdatan utantill och klarar nya fall sämre.
> Fråga avslutningsvis: hur gick er egen inlärning till? Jämför med hur en dator bygger ett träd. Ingen modell är 100 procent rätt, och vi väljer den som klarar testdatan bäst.
