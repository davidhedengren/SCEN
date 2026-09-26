# Fem redaktionella mallar

Öppna **Fem redaktionella mallar**. Använd högerpil och vänsterpil för klickstegen.

## Etapper

En process i tre eller fyra etapper. Rubrikerna följer en stigande ordning, utan att höjden representerar mätdata. Högst fyra steg. Använd inte för jämförelser mellan likvärdiga alternativ.

## Vägval

Två alternativ jämförs kriterium för kriterium. Varje klick visar båda sidor av samma rad. Högst fyra kriterier. Varje rad skrivs kriterium | vänster | höger.

## Lager

Går från övergripande sammanhang till en konkret kärna. Tre indragna nivåer blir synliga i ordning. Högst tre nivåer. Använd bara när det finns en faktisk hierarki eller fördjupning.

## Resonemang

Ett resonemang byggs i vänsterkolumnen och landar i en tydlig slutsats till höger. Högst tre led. Slutsatsen ska stödjas av innehållet.

## Helhet

Fyra delar i en asymmetrisk helhetsbild. Den första får mer plats, därefter tre kompletterande perspektiv. Fyra delar rekommenderas. Första delen får större visuell vikt; ytorna representerar inga mängder.

## Anpassning

Alla fem har Mjuk som standard: tidigare steg tonas ned till 52 procent. Välj annan fokusstil under Rörelse. Accentfärg för bilden har sju färger eller Följ presentationens tema. Temat styr typsnitt, bakgrund och standardfärg. Färgen följer med när du sparar och laddar HTML eller manus. Manus använder exempelvis `accent: grön` och `fokus: mjuk`.

## Kontroller

`node scripts/check-editorial.cjs` kontrollerar 350 kombinationer av mall, tema, färg och fokus, sparning/laddning via manus samt framåt/bakåt i klickfokus. Visuell webbläsarkontroll har inte genomförts i denna miljö.
