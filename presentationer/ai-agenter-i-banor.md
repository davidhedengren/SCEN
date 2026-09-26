---
titel: AI-agenter i banor
tema: bana
---

[båge]
etikett: AI-agenter och miljöer
rubrik: Introduktion till AI-agenter och miljöer
text: Presentation av David Hedengren
tal: 01
bakgrund: banor

---

[omlopp]
etikett: Vad är en AI-agent?
rubrik: AI-agent
text: Ett system som uppfattar sin omgivning, fattar beslut och vidtar åtgärder.
övergång: båge
- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.
- Perception | Samlar in data om sin omgivning genom sensorer.
- Målorientering | Använder autonomi och perception för att nå sitt mål.

---

[bro]
etikett: Så arbetar agenten
rubrik: Från omgivning till handling
vänster: Omgivningen
höger: Åtgärd
övergång: båge
- Uppfattar | med sensorer eller genom att analysera data
- Beslutar | utifrån sitt mål
- Agerar | med aktuatorer

---

[omlopp]
etikett: Sex dimensioner
rubrik: AI-miljö
övergång: båge
- Observerbarhet | fullständig eller partiell
- Agenter | singel eller multi
- Förändring | statisk eller dynamisk
- Utfall | deterministiskt eller stokastiskt
- Tillstånd | diskreta eller kontinuerliga
- Handlingar | episodiska eller sekventiella

---

[gradskiva]
etikett: Dimension 1
rubrik: Hur mycket ser agenten?
övergång: båge
- Partiellt | Agenten har bara delvis information om miljön och måste göra antaganden.
- Fullständigt | Agenten har tillgång till all information och kan se allt som händer.

---

[ringar]
etikett: Dimension 2
rubrik: Singel eller multiagent?
övergång: båge
- Singelagent | En agent, ingen koordinering med andra
- Multiagent | Flera agenter som påverkar varandra
mitten: Schack mot dator kan tolkas på båda sätten

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

[mätare]
etikett: Övningen
rubrik: Partiellt observerbara uppgifter
tal: 4 av 8
text: Poker, självkörande bil, robotdammsugare och diagnos av sjukdom.
övergång: båge
