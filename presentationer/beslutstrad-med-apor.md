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

[lins]
etikett: Exempel
rubrik: Åtta ormar där vi vet svaret
tal: 170
bild: bilder/beslutstrad-apor/ormar-traning.svg
alt: Fyra giftiga och fyra ofarliga tecknade ormar. De giftiga har triangulärt huvud och smala pupiller.
källrad: Ormar: ai-aktiviteter.se/beslutstrad
- 19 31 | Giftiga | Orm 01 har triangulärt huvud och smala pupiller. Det har alla fyra giftiga.
- 64 31 | Triangulärt huvud räcker inte | Orm 05 har triangulärt huvud men runda pupiller. Den är ofarlig.
- 64 68 | Smala pupiller räcker inte | Orm 07 har smala pupiller men runt huvud. Den är också ofarlig.
- 81 79 | Färgen avslöjar inget | Det finns röda ormar i båda grupperna.
> Fråga klassen innan första klicket: vad har de giftiga ormarna gemensamt som de ofarliga saknar?
> Ormarna är ett urval ur aktiviteten på ai-aktiviteter.se/beslutstrad, där hela träningsdatan har 20 ormar.

---

[träd]
etikett: Exempel
rubrik: Är ormen giftig?
text: Två frågor räcker för att sortera alla åtta ormarna rätt.
slutsats: Nu gör ni samma sak, fast med apor och utan facit.
- Huvudform?
  - Runt: Ofarlig
  - Triangulärt: Pupiller?
    - Runda: Ofarlig
    - Smala: Giftig
- fokus: rot | Första frågan | Huvudformen delar ormarna. Alla med runt huvud är ofarliga.
- fokus: väg Triangulärt > Runda | Andra frågan | Bland de triangulära skiljer pupillerna. Runda pupiller: ofarlig.
- fokus: väg Triangulärt > Smala | En ny orm | Triangulärt huvud och smala pupiller. Trädet svarar giftig, utan att någon behöver komma nära.
> Poängen: varje fråga handlar om något man kan se. Trädet går att följa för någon som aldrig har sett träningsdatan.

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

[lins]
etikett: Träningsdata
rubrik: 27 apor där vi vet svaret
tal: 150
bild: bilder/beslutstrad-apor/traningsdata.png
alt: Tretton apor som bits till vänster och fjorton apor som inte bits till höger.
källrad: Apkort: Annabel Lindner och Stefan Seegerer, CC BY-NC
- 11 37 | Munnen | Visar tänderna, ler, är sur, är öppen eller räcker ut tungan.
- 32 50 | Ögonen | Båda öppna, en blinkar, stängda eller kryss.
- 89 50 | Saker och detaljer | Glasögon, rosett, mask, plåster eller rufsigt hår.
> Visa vad man kan titta på, men inte vilka egenskaper som spelar roll. Det ska eleverna komma fram till själva.
> Eleverna har samma apor som kort. Testaporna delas inte ut än.

---

[reflektion]
etikett: I par
rubrik: Bygg ett beslutsträd som avgör om en apa bits
tid: 15
- Sortera korten i bits och bits inte
- Leta efter frågor som skiljer grupperna åt
- Rita trädet så att en annan grupp kan följa det
> Tips till par som fastnar: vilken enda fråga delar korten så rent som möjligt? Börja där.
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
text: Tre frågor räcker för både träningsdatan och testdatan.
slutsats: 27 av 27 träningsapor och 13 av 13 testapor. Men det finns fler träd som fungerar.
- Öppen mun?
  - Ja: Bits
  - Nej: Bär den något?
    - Ja: Bits inte
    - Nej: Något öga öppet?
      - Ja: Bits
      - Nej: Bits inte
- fokus: väg Ja | Öppen mun | Alla apor med öppen mun bits, vad de än har på sig.
- fokus: väg Nej > Ja | Bär den något? | Glasögon, mask, rosett eller plåster. Då bits den inte.
- fokus: väg Nej > Nej > Ja | Ögonen avgör | Minst ett öppet öga: bits. Stängda ögon eller kryss: bits inte.
> Visa först efter facit, annars avslöjar trädet svaret.
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
