---
titel: AI:s historia
kurs: Artificiell Intelligens 1
tema: natt
---

[tidsresa]
etikett: Artificiell Intelligens 1
rubrik: AI:s historia
text: Från Turingtestet till ChatGPT
slutsats: 1950 · 1956 · 1997 · 2012 · 2022
märke: David Hedengren
> Introduktion: AI-historien går i vågor — stora förväntningar, bakslag och comeback. Vi följer de viktigaste milstolparna från 1950 till idag.
> Tidslinjen längst ned är hela resan. Allt ligger i mörker än så länge och tänds när vi kommer dit.

---

[tidsresa]
etikett: Översikt
rubrik: Utvecklingen har gått i vågor
- 1950–1990 | Symboliska AI-eran | Regler, logik och expertsystem. Människan skriver alla instruktioner. | bilder/ai-historia/regler.svg
- 1966–1980 | Första AI-vintern | Förväntningarna infriades inte. Finansiering och intresse minskade. | bilder/ai-historia/vinter.svg
- 1990–2010 | Andra AI-vintern | Förväntningarna infriades inte. Finansiering och intresse minskade. | bilder/ai-historia/vinter.svg
- 2012– | Deep Learning-eran | Neurala nätverk, enorma datamängder och beräkningskraft. Datorn lär sig mönster själv. | bilder/ai-historia/natverk.svg
> Poängen: AI-historien är inte en rak linje uppåt. Optimism följs av besvikelse — och gamla idéer (t.ex. perceptronen) kommer tillbaka när tekniken hinner ikapp.
> Epokerna och vintrarna ligger kvar som band under tidslinjen resten av presentationen.

---

[tidsresa]
etikett: Starten på AI som forskningsfält
rubrik: Kan maskiner tänka?
- 1950 | Turingtestet | Alan Turing publicerar artikeln ”Kan maskiner tänka?”. En person kommunicerar med både en människa och en dator utan att veta vem som är vem. Kan personen inte avgöra vilken som är maskinen, menade Turing att datorn kan sägas vara intelligent. | Kallas även the imitation game — Turings eget namn på testet. | Omdiskuterat: testet mäter hur väl en maskin efterliknar mänsklig konversation, inte om den förstår. | bilder/ai-historia/turing.svg
> Fråga klassen: räcker det att bete sig intelligent för att vara intelligent? Kopplar till diskussionsfråga 5.

---

[tidsresa]
etikett: 1955–1956
rubrik: AI blir ett eget forskningsfält
- 1955 | Logic Theorist | Ett av de första AI-programmen. Det kunde bevisa matematiska satser inom logik och anses vara det första riktiga AI-systemet. | Visade att datorer kunde resonera steg för steg. | bilder/ai-historia/logic.svg
- 1956 | Dartmouthkonferensen | Forskare samlades för att undersöka om datorer kunde efterlikna mänskligt tänkande. Här föreslogs termen artificiell intelligens. | Synen på intelligens som logik och tydliga regler präglade forskningen i decennier. | bilder/ai-historia/dartmouth.svg
> Dartmouth 1956 är fältets officiella födelse — begreppet artificiell intelligens myntas där.

---

[tidsresa]
etikett: 1960- och 70-talen
rubrik: Symbolisk AI
text: Man bygger datorprogram som använder symboler och tydliga regler för att resonera logiskt, dra slutsatser och lösa problem. **Kunskapen kommer från människan, inte från data.**
- spann: 1960–1979 | Symbolisk AI
- Regelbaserad logik | OM feber OCH hosta → SÅ misstänk influensa. Datorn följer förprogrammerade regler. | bilder/ai-historia/regler.svg
- Program som resonerar | Under den här perioden utvecklades AI som kunde spela schack, föra enkla dialoger och tolka logiska resonemang.
- Ingen inlärning | Systemet blir aldrig bättre av sig självt — all kunskap måste matas in i förväg.
> Symbolisk AI = uppifrån-och-ner. Jämför senare med djupinlärning, som lär sig nerifrån-och-upp ur data.

---

[tidsresa]
etikett: Parallellt spår
rubrik: Perceptron — den första lärande modellen
slutsats: Men: perceptronen klarade bara mönster som var tydliga, så intresset minskade snabbt. Idén kom tillbaka långt senare som neurala nätverk, som är centrala i dagens AI.
- 1958 | Perceptron | Inspirerad av hur nervceller i hjärnan fungerar. Kunde lära sig känna igen enkla mönster i data istället för att följa färdiga regler. | Träning med hålkort: information lagrades som mönster av små hål i kartong. | Efter cirka 50 försök kunde perceptronen skilja kort markerade till vänster från kort markerade till höger. | bilder/ai-historia/perceptron.svg | bilder/ai-historia/halkort.jpeg
> Perceptronen är det tydligaste exemplet på en övergiven idé som återkom: den är förfadern till dagens neurala nätverk (kapitel 3).
> Lägg märke till att linjen hoppar tillbaka till 1958. Perceptronen är ett parallellt spår vid sidan av den symboliska AI:n.

---

[tidsresa]
etikett: Expertsystem
rubrik: Datorn som efterliknar en expert
text: Ett expertsystem försöker efterlikna hur en mänsklig expert resonerar inom ett visst ämnesområde. Experternas kunskap matas in som regler.
- 1966 | ELIZA | Räknas som den första chatboten. Ett textbaserat program som simulerade en terapeut genom att omformulera användarens påståenden till frågor. | Saknade verklig förståelse — men skapade illusionen av ett samtal. | bilder/ai-historia/eliza.svg
- 1966 | DENDRAL | Expertsystem för att analysera kemiska ämnens struktur. Tolkade resultat från masspektrometri och föreslog hur molekylen kunde vara uppbyggd. | Visade att experters tysta kunskap kunde omvandlas till datorprogram. | bilder/ai-historia/dendral.svg
- 1980-tal | MYCIN | Kunde ge förslag på antibiotikabehandlingar utifrån patientens symtom och provsvar. | 1980-talets tydligaste exempel på expertsystem i praktisk användning. | bilder/ai-historia/mycin.svg
> ELIZA är viktig både tekniskt och etiskt — Weizenbaum, som byggde den, blev senare en av AI-etikens tidigaste kritiker.

---

[tidsresa]
etikett: Ca 1966–1980
rubrik: Den första AI-vintern
- 1966–1980 | Första AI-vintern | **Varför?** De symboliska metoderna fungerade bara bra i tydliga och välordnade miljöer. | Svårt att få system att förstå naturligt språk eller anpassa sig till nya, oväntade händelser. | bilder/ai-historia/vinter.svg
- 1973 | Lighthill-rapporten | Kritiserade bristen på konkreta resultat och ifrågasatte fältets långsiktiga potential. | bilder/ai-historia/lighthill.svg
- Följderna | Det statliga stödet för AI-projekt i Storbritannien minskade kraftigt. | Rapporten fick negativ inverkan på forskningsklimatet globalt. | Forskningen fortsatte i betydligt långsammare takt och med mindre resurser.
> AI-vinter = period när förväntningarna inte infrias, pengarna försvinner och intresset svalnar. Notera: forskningen dör inte, den saktar ner.

---

[tidsresa]
etikett: 1980-talet och framåt
rubrik: Ny optimism — och ett nytt bakslag
- Framgången | Expertsystem började användas inom fler områden — juridik, teknik, ekonomi och medicin. MYCIN gav förslag på antibiotikabehandlingar.
- Begränsningarna |  | Dyra att utveckla och krävde mycket underhåll | Svåra att uppdatera när kunskapen förändrades | Klarade inte situationer utanför sina regler
- 1990–2010 | Andra AI-vintern | Förhoppningarna om att systemen skulle revolutionera industrin och skapa intelligenta assistenter infriades inte i den utsträckning man hoppats. | När de kommersiella framgångarna uteblev och investeringarna inte gav den avkastning man räknat med, minskade intresset för AI igen. | bilder/ai-historia/vinter.svg
> Mönstret upprepas: hype → begränsningar syns → finansiering dras in. Diskussionsfråga: kan det hända igen?

---

[tidsresa]
etikett: Ett enstaka genombrott
rubrik: Deep Blue besegrar världsmästaren
slutsats: Mitt under den andra AI-vintern: utvecklingen hade inte helt stannat av.
- 1997 | Deep Blue | IBM:s system besegrar den regerande världsmästaren Garry Kasparov i schack. En viktig milstolpe — inte bara för AI:s image i samhället, utan också som symbol för hur beräkning och strategi kunde kombineras. | Deep Blue visade att AI kunde överträffa mänskliga experter i mycket strukturerade spelmiljöer. | Styrkan låg i att beräkna enormt stora mängder möjliga drag — inte i att lära sig. | bilder/ai-historia/deepblue.svg
> Skilj på Deep Blue (beräkning, sökning) och AlphaGo (inlärning + sökning) — det är diskussionsfråga 8 i boken.

---

[tidsresa]
etikett: Språk och datamängder
rubrik: Watson vinner Jeopardy
slutsats: Tekniken bakom byggde dock fortfarande på äldre principer.
- 2011 | Watson | Watson vann över de bästa mänskliga mästarna i Jeopardy. | 200 miljoner sidor text i träningen — inklusive hela Wikipedia | 1 miljon dollar i prispengar togs hem av IBM:s system | bilder/ai-historia/watson.svg
- Naturligt språk i realtid | Watson kunde analysera och tolka frågor ställda i naturligt språk och svara i realtid. | Vinsten väckte stor uppmärksamhet och blev ett exempel på hur AI kunde hantera språk och stora datamängder.
> Watson är sista stora exemplet före djupinlärningens genombrott — imponerande resultat med i grunden gammal teknik.

---

[tidsresa]
etikett: Genombrott för neurala nätverk
rubrik: AlexNet och djupinlärningen
slutsats: Kombinationen av mycket data, stor datorkraft och djupare nätverk fick namnet djupinlärning — och markerade starten på en ny era för AI.
- 2012 | AlexNet | AlexNet vinner bildigenkänningstävlingen ImageNet — startskottet för modern AI. | Datorn lär sig genom att steg för steg justera hur den tolkar mönster i data. | Den tränas att känna igen vad som kännetecknar till exempel en bil, en hund eller ett ansikte genom att öva på tusentals exempel. | bilder/ai-historia/alexnet.svg
- Tre ingredienser | Ingen av dem var ny. Det var kombinationen som gjorde genombrottet. | Många lager — ett djupt neuralt nätverk | Enorma bilddata — tusentals märkta exempel | GPU:er — kraftfull grafikberäkning | bilder/ai-historia/natverk.svg
> Tre ingredienser gjorde genombrottet möjligt: data, beräkningskraft och djupare nätverk. Ingen av dem var ny — kombinationen var det.

---

[tidsresa]
etikett: Nästa milstolpe
rubrik: AlphaGo klarar det som ansågs omöjligt
slutsats: Antalet positioner på spelbrädet uppskattas vara fler än antalet atomer i hela universum.
- 2016 | AlphaGo | Googles program besegrar världsmästaren i brädspelet go. | Go har ett mycket större strategiskt djup än schack så ren beräkning räcker inte. | AlphaGo kombinerade avancerade neurala nätverk med smarta sätt att utforska möjliga drag. | Visade att olika AI-tekniker kan samarbeta för att lösa problem som tidigare ansetts omöjliga. | bilder/ai-historia/alphago.svg
- 2017 | AlphaGo Zero | Tränade sig helt själv. | AlphaZero — flera olika spel
> Jämför med Deep Blue: AlphaGo lär sig utvärdera ställningar istället för att bara räkna igenom dem.

---

[tidsresa]
etikett: Språkmodellernas framväxt
rubrik: Från översättning till samtal
text: Naturlig språkbehandling (NLP) handlar om hur datorer kan förstå, tolka och skapa mänskligt språk. Med djupinlärning kunde modellerna fånga både sammanhang och nyanser i text.
- 2006 | Google Translate | Översättning mellan flera språk.
- 2010 | Siri | Röstassistent från Apple.
- 2014 | Alexa | Röststyrning i hemmet, Amazon.
- 2016 | Google Assistant | Taligenkänning kombinerat med NLP.
- 2018 | GPT-1 | Startskottet för stora språkmodeller. | bilder/ai-historia/gpt.svg
- Stora språkmodeller | (Large language models, LLM) Tränas på enorma textmängder och kan skapa sammanhängande, varierad och kreativ text. | Eftersom de inte bara analyserar utan faktiskt skapar nytt innehåll kallas de generativ AI. | bilder/ai-historia/sprak.svg
> Viktig poäng: NLP fanns långt före djupinlärningen — men det var djupinlärningen som gjorde språkmodellerna användbara på allvar.
> Linjen hoppar tillbaka till 2006 och klickar sig fram genom röstassistenterna till GPT-1.

---

[tidsresa]
etikett: Generativ AI · November 2022
rubrik: ChatGPT blir allmän egendom
slutsats: När du läser det här finns troligen ännu nyare modeller — det som idag känns imponerande kan snart ses som vardagligt.
- 2022 | ChatGPT | ChatGPT blir fritt tillgängligt för allmänheten och når på bara några månader hundratals miljoner användare — en av de snabbast växande digitala tjänsterna i historien. | bilder/ai-historia/chatgpt.svg
- Text och samtal | ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) och Copilot (Microsoft) kan skriva texter, föra samtal, analysera dokument och generera programmeringskod. | bilder/ai-historia/chatgpt.svg
- Bild | Modeller som DALL·E och Midjourney skapar detaljerade och fotorealistiska bilder enbart utifrån textbeskrivningar.
> Avsluta med perspektiv: utvecklingstakten är hög, så grunderna är viktigare än enskilda produktnamn.

---

[tidsresa]
etikett: Etikens ständiga roll
rubrik: Frågorna har funnits sedan början
- spann: 1966–2022 | Från ELIZA till idag
- Joseph Weizenbaum | Forskaren bakom ELIZA blev orolig när människor började reagera känslomässigt på programmet, trots att det bara följde enkla regler. | Weizenbaum menade att tekniken kunde lura människor att tro att datorer förstår — och varnade för att överlåta viktiga beslut till maskiner som saknar moral, ansvar och medkänsla. | bilder/ai-historia/etik.svg
- Ansvar | Vem bär ansvaret när en dator föreslår en felaktig diagnos eller fattar beslut som påverkar en människas liv? | bilder/ai-historia/etik.svg
- Neutralitet | Data och modeller bär med sig mänskliga fördomar, värderingar och begränsningar — de är inte neutrala. | bilder/ai-historia/etik.svg
- Genomskinlighet | AI-system riskerar att förstärka ojämlikhet eller fatta beslut som inte går att förstå i efterhand. | bilder/ai-historia/etik.svg
> Poäng: dagens etikdiskussion är inte ny — den har rötter långt tillbaka i historien. Fördjupning i kapitel 6.

---

[tidsresa]
etikett: Sammanfattning
rubrik: Tidslinje över AI:s utveckling
> Använd tidslinjen som repetition: låt eleverna själva placera in händelserna innan du visar den.
> Tidslinjen glider upp och visar alla händelser med årtal. Klicka för att visa namnen.

---

[reflektion]
etikett: Diskutera
rubrik: Frågor att ta ställning till
tid: 5
- Vilket AI-genombrott tycker du haft störst påverkan på samhället? Varför?
- Tror du att framtida AI-vintrar kan inträffa igen? Vad skulle kunna orsaka det?
> Låt eleverna diskutera i par innan helklassdiskussion. Fråga 4 knyter ihop hela genomgången.
