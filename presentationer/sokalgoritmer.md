---
titel: Sökalgoritmer och sökningar
kurs: Artificiell Intelligens 1
tema: natt
---

[bildregi]
etikett: Artificiell Intelligens 1 · David Hedengren
rubrik: Sökalgoritmer och sökningar
text: Hur en dator hittar vägen: BFS, DFS, girig bäst först och A*.
bild: bilder/sokalgoritmer/natverk.jpg
alt: Ett mörkt nätverk av noder där en lysande väg letar sig fram till en nod längst upp till höger.
bildläge: hero
fokuspunkt: 88 12
startutsnitt: 50 50 1.06
slututsnitt: 58 42 1.12
säker-yta: 4 14 40 64
mörkning: 0 0 46 100 0.35
hastighet: slow
> Idag handlar det om hur en AI kan söka efter en lösning: en väg genom ett träd, en graf eller en labyrint.

---

[bro]
etikett: Sökalgoritm
rubrik: Så fungerar en sökalgoritm
text: I frontiern finns de noder som upptäckts, men ännu inte utforskats.
vänster: Frontiern innehåller startnoden
höger: Målet är hittat
retur: Upprepa. Är frontiern tom finns ingen lösning.
- Ta ut | en nod ur frontiern
- Målet? | då är lösningen hittad
- Utforska | lägg nodens barn i frontiern
> Start: börja med en frontier som innehåller rotnoden, grundtillståndet.
> Upprepa följande steg: om frontiern är tom finns det ingen lösning, alla möjliga noder har utforskats utan att målet hittats. Ta bort en nod från frontiern för att utforska den. Om noden är målet är lösningen hittad. Utforska noden och lägg till dess barnnoder i frontiern.

---

[sökning]
etikett: Exempel
rubrik: Hitta en väg från A till E
text: Frontiern innehåller de noder som upptäckts men ännu inte utforskats.
slutsats: Målet är hittat först när noden tas ut ur frontiern och utforskas.
- algoritm: bfs
- mål: E
- A
  - B
    - C
      - E
    - D
      - F
- not: 6 | C lades i frontiern före D och utforskas därför först. Mer om det när vi pratar om köer.
> Varje klick är ett steg i algoritmen. Algoritmstegen till vänster lyser i takt med grafen, och raden under grafen säger vad som händer.
> Poängen: E upptäcks redan när C utforskas, men lösningen är hittad först när E tas ut ur frontiern.

---

[ridå]
etikett: Datastrukturer
rubrik: Olika köer
text: Vem står på tur?
bild: bilder/sokalgoritmer/ko.jpg
> Vilken nod i frontiern som utforskas härnäst beror på vilken sorts kö algoritmen använder.

---

[kö]
etikett: Datastrukturer
rubrik: Olika köer i algoritmer
text: Köer är en datastruktur som används i sökalgoritmer för att hålla reda på vilka noder som ska besökas.
slutsats: Vilken nod i frontiern som utforskas beror på vilken kö algoritmen använder.
- kö: fifo | FIFO-kö | First in, first out | frontier.pop(0)
- kö: stack | Stack (LIFO-kö) | Last in, first out | frontier.pop()
- kö: prio | Prioriteringskö | Lägst värde först
- in: A 3
- in: B 1
- in: C 2
- ut
- ut
> A, B och C läggs in i alla tre köerna. Siffran är prioriteten, som bara prioritetskön bryr sig om.
> Vid första "ta ut": FIFO-kön lämnar ut A (först in), stacken C (sist in) och prioritetskön B (lägst värde).
> BFS använder en FIFO-kö, DFS en stack och de informerade sökningarna en prioritetskö.

---

[rad]
etikett: Bredden först
rubrik: Bredden först-sökning (Breadth-First Search, BFS)
text: En algoritm som utforskar ett sökträd genom att besöka alla noder på en viss nivå innan den går vidare till nästa nivå. BFS använder en FIFO-kö.
flöde: ja
- Start | Börjar vid en given startnod.
- Nivå 1 | Alla barnnoder till startnoden utforskas.
- Nivå 2 | Alla noder som är anslutna till noderna på nivå 1 utforskas.
- Tills målet | Processen fortsätter tills målnoden hittas eller alla noder har besökts.
> BFS använder en FIFO-kö där noderna utforskas i den ordning de läggs till i frontiern.

---

[kodförklaring]
etikett: Bredden först
rubrik: BFS i Python
text: def bfs(graph, start, goal):
    frontier = [start]
    visited = set()
    while frontier:
        current = frontier.pop(0)
        if current in visited:
            continue
        visited.add(current)
        if current == goal:
            return f"Found {goal}"
        for neighbor in graph[current]:
            if neighbor not in visited:
                frontier.append(neighbor)
    return f"{goal} not found"
- 2 | frontier = [start] | Frontiern börjar med startnoden.
- 5 | frontier.pop(0) | Tar ut den nod som lades in först: en FIFO-kö.
- 9 | current == goal | Är noden målet? Då är lösningen hittad.
- 13 | frontier.append(neighbor) | Barnnoderna läggs sist i kön.
> Jämför med algoritmstegen: ta ut en nod, kontrollera om det är målet, lägg till barnen.
> visited ser till att samma nod inte utforskas två gånger.

---

[träd]
etikett: Bredden först
rubrik: BFS utforskar nivå för nivå
text: Alla noder på en nivå utforskas innan sökningen går vidare till nästa nivå.
slutsats: Ordningen blir A, B, C, D, E, F, G, H, I, J, K, L, M, N, O.
- A
  - B
    - D
      - H
      - I
    - E
      - J
      - K
  - C
    - F
      - L
      - M
    - G
      - N
      - O
- fokus: nivå 1 | Nivå 0 | Startnoden A.
- fokus: nivå 2 | Nivå 1 | B och C, barnen till A.
- fokus: nivå 3 | Nivå 2 | D, E, F och G.
- fokus: nivå 4 | Nivå 3 | H till O, trädets löv.

---

[rutnät]
etikett: Exempel
rubrik: BFS i en labyrint
text: Vi följer en nivå i taget.
slutsats: En BFS föreslår därför vägen som visas: 6 steg.
- algoritm: bfs
- .#####
- ......
- .##.##
- .##B##
- .#..##
- .#.###
- A..###
> Varje klick är en nivå: alla rutor på samma avstånd från A utforskas samtidigt. Den streckade ramen är frontiern, nästa nivå.
> Sista klicket ritar vägen. BFS hittar alltid den kortaste vägen, mätt i antal steg.

---

[sökning]
etikett: Bredden först
rubrik: Hitta en väg från A till F med BFS
slutsats: BFS hittar F på nivå 2. Vägen är A, C, F.
- algoritm: bfs
- mål: F
- A
  - B
    - D
      - H
      - I
    - E
      - J
      - K
  - C
    - F
      - L
      - M
    - G
      - N
      - O
> FIFO-kön gör att hela nivå 1 utforskas innan nivå 2.
> Lägg märke till att F upptäcks när C utforskas, men hittas först när den tas ut ur frontiern.

---

[rutor]
etikett: Bredden först
rubrik: Fördelar med BFS
- Garanterar kortaste vägen | BFS hittar alltid den kortaste vägen mellan två noder i en graf, mätt i antalet kanter.
- Utforskar alla noder på samma nivå | BFS utforskar noder nivå för nivå, vilket gör det användbart för att hitta alla noder på ett visst avstånd från startnoden.
- Många tillämpningar | BFS är effektivt för många olika problem som exempelvis ruttplanering, labyrintlösning och spelutveckling.

---

[sökning]
etikett: Övning
rubrik: Övning: bredden först-sökning
text: Målnoderna är markerade. a) I vilken ordning utforskas noderna? b) Vilken väg returnerar BFS?
- algoritm: bfs
- läge: övning
- uppgift: Exempel | E
- A
  - B
    - D
  - C
    - E
    - F
    - G
      - H
- uppgift: Uppgift 1 | I
- A
  - B
    - D
      - H
      - I
      - J
    - E
  - C
    - F
      - K
      - L
    - G
- uppgift: Uppgift 2 | E, L
- A
  - B
    - D
      - H
      - I
      - J
    - E
  - C
    - F
      - K
      - L
    - G
> När algoritmen har nått fram till en lösning i sin sökning returnerar den lösningen.
> Klick 1 och 2 visar exemplets facit. Låt eleverna lösa uppgift 1 och 2 innan du klickar vidare.
> Facit uppgift 1: a) A, B, C, D, E, F, G, H, I. b) A, B, D, I.
> Facit uppgift 2: a) A, B, C, D, E. b) A, B, E.

---

[rutnät]
etikett: Övning
rubrik: Hur skulle en BFS-algoritm söka igenom följande labyrint?
text: Vi följer en nivå i taget.
- algoritm: bfs
- .#.#.###..#B
- .#.#...#.##.
- ...#.#...##.
- #.##.#.#.##.
- #....#.#....
- ###.##.#####
- A...##......
> Låt eleverna först rita sin lösning. Varje klick visar sedan en nivå.
> Vägen till B är 23 steg.

---

[remsor]
etikett: Djupet först
rubrik: Djupet först-sökning (Depth-First Search, DFS)
text: En DFS utforskar grafer och träd genom att gå så djupt som möjligt längs varje gren innan den backar. DFS använder en stack (LIFO-kö).
- Start | Börjar vid en given startnod.
- Djupt | Går vidare till en barnnod och följer vägen tills den når ett löv.
- Backa | Utan nya grannar backar DFS till den senaste noden med oupptäckta grannar.
- Tills målet | Processen fortsätter tills målnoden hittas eller alla noder har besökts.
> Djupt: algoritmen går vidare till den första tillgängliga barnnoden och fortsätter att följa denna väg tills den når ett löv.
> Backa: när DFS når en nod utan nya grannar backar algoritmen tillbaka till den senaste noden med oupptäckta grannar och utforskar nästa tillgängliga väg.
> DFS använder en stack, där den senaste noden som lagts till i frontiern utforskas först.

---

[kodförklaring]
etikett: Djupet först
rubrik: DFS i Python
text: def dfs(graph, start, goal):
    frontier = [start]
    visited = set()
    while frontier:
        current = frontier.pop()
        if current in visited:
            continue
        visited.add(current)
        if current == goal:
            return f"Found {goal}"
        for neighbor in graph[current]:
            if neighbor not in visited:
                frontier.append(neighbor)
    return f"{goal} not found"
- 5 | frontier.pop() | Tar ut den nod som lades in sist: en stack.
- 13 | frontier.append(neighbor) | Barnen läggs överst. Den sist tillagda utforskas först.
> Koden är nästan densamma som för BFS. Den enda skillnaden är pop() i stället för pop(0).
> Därför utforskar DFS här trädets högra gren först: det barn som lades in sist ligger överst i stacken.

---

[sökning]
etikett: Djupet först
rubrik: DFS följer en gren i taget
text: DFS går så djupt som möjligt och backar sedan till närmaste nod med obesökta grannar.
slutsats: Besöksordningen blir A, C, G, O, N, F, M, L, B, E, K, J, D, I, H.
- algoritm: dfs
- läge: vandring
- A
  - B
    - D
      - H
      - I
    - E
      - J
      - K
  - C
    - F
      - L
      - M
    - G
      - N
      - O
> Varje klick flyttar ringen ett steg. Siffrorna visar i vilken ordning noderna besöks.
> Samma ordning som stacken ger: barnet som lades in sist, alltså det högra, utforskas först.

---

[rutnät]
etikett: Exempel
rubrik: DFS i en labyrint
text: Vi följer en gren till slutet och går vidare till nästa.
slutsats: En DFS skulle därför kunna föreslå vägen som visas: 10 steg.
- algoritm: dfs
- .#####
- ......
- .##.##
- .##B##
- .#..##
- .#.###
- A..###
> Grannarna prövas i ordningen upp, vänster, höger, ned.
> Jämför med BFS i samma labyrint: där blev vägen 6 steg.

---

[sökning]
etikett: Djupet först
rubrik: Hitta en väg från A till F med DFS
slutsats: DFS hittar F efter att ha gått ned i den högra grenen först.
- algoritm: dfs
- mål: F
- A
  - B
    - D
      - H
      - I
    - E
      - J
      - K
  - C
    - F
      - L
      - M
    - G
      - N
      - O
- not: 4 | Vi utforskar den nod som lades till sist, högst upp i stacken.
- not: 5 | Redan här har vi hittat F och lagt till den i frontiern, men det är inte förrän vi utforskar noden som algoritmen förstår att lösningen är hittad!
> Stacken står upp: in och ut sker överst.

---

[sökning]
etikett: Diskutera
rubrik: Vad hade DFS returnerat om det även fanns en nod F här?
text: Noden B har bytts mot ett F. Båda F är mål.
- algoritm: dfs
- läge: övning
- mål: F
- A
  - F
    - D
      - H
      - I
    - E
      - J
      - K
  - C
    - F
      - L
      - M
    - G
      - N
      - O
> Låt eleverna diskutera först. Klick 1 visar ordningen, klick 2 vägen.
> DFS returnerar A, C, F fast A, F hade varit kortare. DFS garanterar inte den kortaste vägen.

---

[kärna]
etikett: Djupet först
rubrik: Fördelar med DFS
text: DFS
- Effektivitet | DFS är effektiv för problem med en stor sökrymd, eftersom den bara behöver utforska en del av sökrymden.
- Minnesanvändning | Den kräver mindre minne än bredden först-sökningar, eftersom den bara behöver lagra information om den nuvarande grenen.
- Djupa lösningar | Den kan hitta lösningar snabbare än BFS, om lösningarna är djupt ner i trädet.

---

[delning]
etikett: Djupet först
rubrik: Nackdelar med DFS
- Garanterar inte kortaste vägen | Eftersom DFS följer en gren hela vägen ner kan en kortare lösning finnas på en nivå högre upp.
- Kan fastna i djupa grenar | I oändliga eller mycket djupa träd kan DFS fastna och aldrig återvända till tidigare oupptäckta vägar.
- Exempel | I diskussionen returnerade DFS vägen A, C, F fast A, F var kortare.

---

[sökning]
etikett: Övning
rubrik: Övning: djupet först-sökning
text: Målnoderna är markerade. a) I vilken ordning utforskas noderna? b) Vilken väg returnerar DFS?
- algoritm: dfs
- läge: övning
- uppgift: Exempel | E
- A
  - B
    - D
  - C
    - E
    - F
    - G
      - H
- uppgift: Uppgift 1 | I
- A
  - B
    - D
      - H
      - I
      - J
    - E
  - C
    - F
      - K
      - L
    - G
- uppgift: Uppgift 2 | E, L
- A
  - B
    - D
      - H
      - I
      - J
    - E
  - C
    - F
      - K
      - L
    - G
> Samma träd som i BFS-övningen. Jämför svaren.
> Facit uppgift 1: a) A, C, G, F, L, K, B, E, D, J, I. b) A, B, D, I.
> Facit uppgift 2: a) A, C, G, F, L. b) A, C, F, L. BFS hittade E på kortare väg.

---

[rutnät]
etikett: Övning
rubrik: Hur skulle en DFS-algoritm söka igenom följande labyrint?
text: Vi följer en gren till slutet och går vidare till nästa.
- algoritm: dfs
- .#.#.###..#B
- .#.#...#.##.
- ...#.#...##.
- #.##.#.#.##.
- #....#.#....
- ###.##.#####
- A...##......
> Grannarna prövas i ordningen upp, vänster, höger, ned.
> Låt eleverna rita sin lösning först. Varje klick visar sedan en ruta.

---

[bildfält]
etikett: Informerade sökningar
rubrik: Heuristik
text: En form av tumregel som, baserat på tidigare erfarenheter eller tillgänglig information, hjälper till att guida sökningen åt rätt håll snarare än att analysera alla möjliga alternativ noggrant.
bild: bilder/sokalgoritmer/labyrint.jpg
fokuspunkt: 55 50
- Algoritmer som använder heuristik nyttjar en prioritetskö.
- Heuristiken avgör vilken nod som utforskas först.
> BFS och DFS är oinformerade: de vet inget om var målet finns. En informerad sökning har en uppskattning av hur långt det är kvar.

---

[motsats]
etikett: Informerade sökningar
rubrik: Girig bäst först eller A*?
- Girig bäst först | Väljer den nod med lägst uppskattad kostnad till målet, h(n).
- A* | Väljer den nod med lägst summa: kostnaden för att nå noden plus en uppskattad kostnad för att nå målet från noden.
- Gemensamt | Båda använder en prioritetskö, men sorterar på olika värden.
> Girig bäst först heter Greedy best-first på engelska.

---

[sats]
etikett: A*-algoritmen
rubrik: Kostnaden för en nod
text: A* utforskar alltid den nod i frontiern som har lägst f(n).
- f(n) = g(n) + h(n) | Den uppskattade totala kostnaden för en väg genom noden n.
- g(n) | Kostnad att nå noden n.
- h(n) | Uppskattad kostnad att nå målet från n.

---

[rutnät]
etikett: Informerad sökning
rubrik: Girig bäst först-sökning
text: Här vet vi Manhattan-avståndet till målet från varje ruta.
slutsats: Vägen blev 33 steg. Girig bäst först tittar bara på h och kan därför välja en lång omväg.
- algoritm: girig
- siffror: h
- #..........B
- #.#########.
- #.#.......#.
- #.#.#####.#.
- #...#.....#.
- ###.#.#####.
- A...#.......
- not: 6 | 11 är lägre än 13, därför utforskas den rutan först.
> Manhattan-avståndet är antalet steg till målet om det inte fanns några väggar: steg i sidled plus steg i höjdled.
> Algoritmen väljer alltid den ruta i frontiern som har lägst h.

---

[rutnät]
etikett: Informerad sökning
rubrik: A*-sökning
text: Varje utforskad ruta visar g + h: kostnaden hit plus uppskattningen till målet.
slutsats: A* hittar den kortaste vägen: 21 steg.
- algoritm: a*
- siffror: g+h
- #..........B
- #.#########.
- #.#.......#.
- #.#.#####.#.
- #...#.....#.
- ###.#.#####.
- A...#.......
- not: 1 | g(n) = 1 är kostnaden hit. h(n) = 16 är den uppskattade kostnaden till målet.
- not: 6 | Den totala kostnaden 6 + 11 är lägre än 6 + 13.
- not: 15 | Här byter vi väg eftersom 6 + 13 är lägre än 15 + 6.
> Vid lika värden väljer A* här den ruta som lades till senast.
> Jämför med girig bäst först i samma labyrint: där blev vägen 33 steg.
