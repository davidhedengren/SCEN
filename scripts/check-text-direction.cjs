const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const ctx={window:{},console,structuredClone:global.structuredClone};ctx.window.window=ctx.window;
vm.runInNewContext(read('src/engine.js'),ctx);ctx.Scen=ctx.window.Scen;vm.runInNewContext(read('src/manus.js')+'\nwindow.__Manus=Manus;',ctx);
const {Scen}=ctx.window,Manus=ctx.window.__Manus;

for(const layout of ['terminal','kodforklaring','typografisk','texttempo']) assert(Scen.LAYOUTS[layout],`${layout} ska vara registrerad som förstaklasslayout.`);
assert.equal(typeof Scen.normalizeTextDirection,'function','Textpilotens semantiska innehåll ska normaliseras generellt.');
assert.equal(typeof Scen.dramaturgyTarget,'function','Cue och visuellt mål ska kunna hållas isär i dramaturgisystemet.');
assert.equal(JSON.stringify(Scen.dramaturgyTarget([1,2],[3,7],4,9,2,false)),JSON.stringify({state:'focus',focus:1,target:7}));
assert.equal(JSON.stringify(Scen.dramaturgyTarget([1,2],[3,7],4,9,4,false)),JSON.stringify({state:'restored',focus:-1,target:9}));
assert.equal(JSON.stringify(Scen.dramaturgyTarget([1,2],[3,7],4,9,0,true)),JSON.stringify({state:'restored',focus:-1,target:9}));

const manuscript=`[terminal]
etikett: RELEASE / 02
rubrik: Från kommando till bevis
- kommando | npm run bygg | Kommandot skrivs eftersom någon faktiskt skriver det.
- output | dist/scen.html 426 kB | Artefakten finns nu.
- success | ✓ Bygg klar | Resultatet är berättelsens fokus.
- kommando | git status --short | Nästa fråga är om arbetsytan är ren.
- output | (ingen output) | Tystnaden är själva resultatet.

---

[kodförklaring]
etikett: REDUCER
rubrik: En rad förändrar tillståndet
text: function add(total, value) {
  return total + value;
}
- 2 | total + value | Uttrycket skapar nästa ackumulerade värde. | 12 + 5 = 17
- 1 | add | Funktionen namnger operationen. | Ett nytt totalvärde returneras.

---

[typografi]
etikett: STATEMENT
- statement | Verktyget är inte poängen. | Etablering
- focus | **Omdömet** är poängen. | Fokus
- precision | Verktyget förstärker **omdömet**. | Precisering

---

[texttempo]
etikett: PACING
- statement | AI kan lösa uppgiften. | Påstående
- contrast | AI kan lösa uppgiften. **Men inte på det sätt vi tänkte.** | Kontrast
- conclusion | Förmågan förändras. **Ansvaret består.** | Slutsats`;
const deck=Manus.parse(manuscript);
assert.deepEqual(Array.from(deck.slides,x=>x.layout),['terminal','kodforklaring','typografisk','texttempo']);
const round=Manus.parse(Manus.stringify({title:'Textpilot',theme:{id:'scen'},slides:deck.slides}));
assert.deepEqual(Array.from(round.slides,x=>x.layout),['terminal','kodforklaring','typografisk','texttempo']);
assert.equal(round.slides[1].text,'function add(total, value) {\n  return total + value;\n}');
assert.equal(round.slides[2].items.length,3);

const multilineManuscript=String.raw`[typografi]
etikett: MULTILINE
- precisering | Första raden\\n**Andra raden.** | Precisering`;
const multilineSlide=Manus.parse(multilineManuscript).slides[0];
assert.equal(multilineSlide.items[0],'precisering | Första raden\n**Andra raden.** | Precisering','Ett dokumenterat \\\\n i en listpost ska bli en semantisk radbrytning.');
const multilineText=Manus.stringify({title:'Multiline',theme:{id:'scen'},slides:[multilineSlide]});
assert(multilineText.includes(String.raw`Första raden\\n**Andra raden.**`),'Stringifiering ska koda listpostens radbrytning med den entydiga listsekvensen \\\\n.');
assert.equal(Manus.parse(multilineText).slides[0].items[0],multilineSlide.items[0],'Flerradig typografi ska överleva manus-roundtrip.');
assert(Scen.renderSlide(multilineSlide,0,{theme:{id:'scen'}}).includes('Första raden<br><mark>Andra raden.</mark>'),'Rendereraren ska göra semantisk radbrytning till <br>.');

const literalPathManuscript=String.raw`[terminal]
- kommando | type C:\new\file.txt | En Windows-sökväg ska förbli bokstavlig.`;
const literalPathSlide=Manus.parse(literalPathManuscript).slides[0];
assert.equal(literalPathSlide.items[0],String.raw`kommando | type C:\new\file.txt | En Windows-sökväg ska förbli bokstavlig.`,'En enkel backslash följd av n får inte bli radbrytning.');
const literalPathRound=Manus.parse(Manus.stringify({title:'Path',theme:{id:'scen'},slides:[literalPathSlide]})).slides[0];
assert.equal(literalPathRound.items[0],literalPathSlide.items[0],'Windows-sökvägar ska överleva manus-roundtrip.');
const literalPathHtml=Scen.renderSlide(literalPathRound,0,{theme:{id:'scen'}});
assert(literalPathHtml.includes(String.raw`C:\new\file.txt`)&&!literalPathHtml.includes('C:<br>ew'),'En Windows-sökväg får inte renderas som flera rader.');

const normalizedTerminal=Scen.normalizeTextDirection(deck.slides[0]);
assert.equal(normalizedTerminal.mode,'terminal');
assert.deepEqual(Array.from(normalizedTerminal.items,x=>x.role),['command','output','success','command','output']);
assert.equal(normalizedTerminal.items[0].animation,'type');
assert.equal(normalizedTerminal.items[1].animation,'fade');
const terminalRoles=Scen.normalizeTextDirection({layout:'terminal',items:['annotation | Förklaring | Kontext','aktiv | Viktig rad | Läs nu']});
assert.deepEqual(Array.from(terminalRoles.items,x=>x.role),['annotation','focus'],'Terminalroller ska inte kollapsa annotation eller aktiv rad till output.');
const typographyRoles=Scen.normalizeTextDirection({layout:'typografisk',items:['ersättning | Nytt ord | Byte','avslöjande | Svaret | Reveal','uppbyggnad | Nästa led | Tempo']});
assert.deepEqual(Array.from(typographyRoles.items,x=>x.role),['replacement','reveal','buildup'],'Dokumenterade svenska typografiroller ska bevaras semantiskt.');
const roleManuscript=`[terminal]\n- annotation | Förklaring | Kontext\n- aktiv | Viktig rad | Läs nu\n\n---\n\n[typografi]\n- ersättning | Nytt ord | Byte\n- avslöjande | Svaret | Reveal\n- uppbyggnad | Nästa led | Tempo`;
const roleRound=Manus.parse(Manus.stringify({title:'Roles',theme:{id:'scen'},slides:Manus.parse(roleManuscript).slides}));
const roleHtml=roleRound.slides.map((slide,index)=>Scen.renderSlide(slide,index,{theme:{id:'scen'}})).join('');
for(const role of ['annotation','focus','replacement','reveal','buildup']) assert(roleHtml.includes(`data-semantic-role="${role}"`),`Rollen ${role} ska överleva parse → stringify → parse → render.`);
const normalizedCode=Scen.normalizeTextDirection(deck.slides[1]);
assert.equal(normalizedCode.mode,'code');
assert.equal(normalizedCode.items[0].line,2);
assert.equal(normalizedCode.items[0].token,'total + value');
assert.equal(normalizedCode.items[0].result,'12 + 5 = 17');

const theme={theme:{id:'scen'}};
const terminal=Scen.renderSlide(deck.slides[0],0,theme);
assert(terminal.includes('data-layout="terminal"'));
assert(terminal.includes('data-text-mode="terminal"'));
assert(terminal.includes('data-semantic-role="command"'));
assert(terminal.includes('data-step-anim="type"'));
assert(terminal.includes('data-dramaturgy="semantic-text"'));
assert.equal((terminal.match(/data-dramaturgy-item/g)||[]).length,5);

const code=Scen.renderSlide(deck.slides[1],1,theme);
assert(code.includes('data-layout="kodforklaring"'));
assert(code.includes('data-code-line="2"'));
assert(code.includes('data-code-token'));
assert(code.includes('data-dramaturgy-cue'));
assert(code.includes('data-dramaturgy-target'));
assert(code.includes('data-dramaturgy-restore'));
assert(code.includes('&lt;')===false,'Kod utan vinkelparenteser ska inte skapa falska escapes.');
assert(!code.includes('<script>'),'Kod får aldrig injiceras som HTML.');

for(const [index,layout] of [[2,'typografisk'],[3,'texttempo']]){
 const html=Scen.renderSlide(deck.slides[index],index,theme);
 assert(html.includes(`data-layout="${layout}"`));
 assert(html.includes('data-text-sequence'));
 assert(html.includes('data-dramaturgy-overview-target="0"'));
 assert(html.includes(`data-dramaturgy-restored-target="${deck.slides[index].items.length-1}"`));
 assert.equal((html.match(/data-dramaturgy-cue/g)||[]).length,deck.slides[index].items.length-1);
 assert(!html.includes('<span data-dramaturgy-restore'),'Typografiska sekvenser ska landa i ett designat slutläge utan ett artificiellt restore-klick.');
}
console.log('OK: terminal, kodförklaring och två typografiska dramaturgier använder generella semantiska textprimitives.');
