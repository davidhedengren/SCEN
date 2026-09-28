---
titel: AI-agenter i ljus
tema: djup
---

[ridå]
etikett: David Hedengren
rubrik: AI-agenter och miljöer
text: En introduktion till hur agenter uppfattar, beslutar och handlar.
bild: bilder/ai-agenter/ai01.jpg
bakgrund: ljus

---

[strålkastare]
etikett: Vad är en AI-agent?
övergång: djup
bakgrund: ljus
- Ett system som
- uppfattar sin omgivning,
- fattar beslut
- och vidtar åtgärder.
text: Med **sensorer** tar den in data. Med **aktuatorer** påverkar den världen.
> Fråga klassen efter exempel på sensorer och aktuatorer.

---

[fokus]
etikett: Tre egenskaper
rubrik: Vad gör en agent till en agent?
övergång: djup
bakgrund: ljus
- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.
- Perception | Samlar in data om sin omgivning genom sensorer eller annan inmatning.
- Målorientering | Använder autonomi och perception för att ta de bästa möjliga åtgärderna mot sitt mål.

---

[bildfält]
etikett: Miljöer
rubrik: Agenten lever i en miljö
text: Miljöer kan beskrivas längs flera dimensioner. De avgör hur agenten måste tänka och agera.
bild: bilder/ai-agenter/ai03.jpg
övergång: djup
- Vad agenten kan se
- Vem mer som finns där
- Hur världen förändras

---

[ordbild]
etikett: Sex dimensioner
rubrik: Miljön
text: Observerbarhet, agenter, förändring, utfall, tillstånd och handlingar.
bild: bilder/ai-agenter/ai04.jpg
övergång: djup
bakgrund: ljus

---

[delning]
etikett: Dimension 1
rubrik: Hur mycket ser agenten?
övergång: djup
- Fullständigt | Agenten har tillgång till all information och kan se allt som händer.
- Partiellt | Agenten ser bara en del av miljön och måste göra antaganden.
- Exempel | Schack är fullständigt observerbart. I poker är motståndarens kort dolda.

---

[delning]
etikett: Dimension 2
rubrik: Ensam eller bland andra?
övergång: djup
- Singelagent | En agent, ingen koordinering med andra. Enkelt och effektivt.
- Multiagent | Flera agenter som påverkar varandra. Samarbete eller konkurrens.
- Exempel | Ett korsord löser du ensam. Trafiken är full av andra förare.

---

[lins]
etikett: Klassificera miljön
rubrik: Schack mot dator
bild: bilder/ai-agenter/ai04.jpg
tal: 210
övergång: tona
- 28 51 | Deterministiskt | Alla drag och deras konsekvenser är förutsägbara.
- 52 60 | Fullt observerbart | Alla pjäser och positioner är synliga för båda spelarna.
- 75 55 | Sekventiellt | Varje drag påverkar brädets framtida tillstånd.

---

[fokus]
etikett: Dimension 3 till 6
rubrik: Fyra frågor till om miljön
övergång: djup
bakgrund: ljus
- Statisk eller dynamisk | Står världen still medan agenten tänker? Schack gör det, trafiken gör det inte.
- Deterministisk eller stokastisk | Blir utfallet alltid detsamma? I poker finns slumpen med.
- Diskret eller kontinuerlig | Finns det tydliga steg? Schack har rutor, en robotarm rör sig fritt.
- Episodisk eller sekventiell | Påverkar ett beslut nästa? Bildklassificering nej, en självkörande bil ja.

---

[ljustal]
etikett: Övningen
rubrik: Uppgifter som bara är delvis observerbara
tal: 4 av 8
text: Poker, självkörande bil, robotdammsugare och diagnos av sjukdom.
övergång: djup
bakgrund: ljus

---

[ridå]
etikett: Sammanfattning
rubrik: Rätt modell av miljön ger rätt agent.
text: Förstår vi miljöns egenskaper kan vi bygga AI-system som klarar en komplex och föränderlig värld.
bild: bilder/ai-agenter/ai12.jpg
övergång: djup
