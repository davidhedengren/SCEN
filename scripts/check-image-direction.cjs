const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const { resolveServedPath } = require('./image-direction-qa-utils.cjs');
const ctx={window:{},console,structuredClone:global.structuredClone};ctx.window.window=ctx.window;
vm.runInNewContext(read('src/engine.js'),ctx);ctx.Scen=ctx.window.Scen;vm.runInNewContext(read('src/manus.js')+'\nwindow.__Manus=Manus;',ctx);
const {Scen}=ctx.window,Manus=ctx.window.__Manus;
assert(Scen.LAYOUTS.bildregi,'Bildregi ska vara registrerad som layout.');
assert.equal(typeof Scen.normalizeImageDirection,'function');
assert.equal(typeof Scen.imageBrief,'function');
const manuscript=`[bildregi]
rubrik: Blicken hittar sambandet
text: En bild kan regisseras utan att förlora sin helhet.
bild: ai10.jpg
bildläge: detalj
fokuspunkt: 64 42
beskärning: cover
startutsnitt: 50 50 1
slututsnitt: 62 44 1.16
säker-yta: 5 12 38 72
mörkning: 3 8 43 82 0.58
riktning: höger
hastighet: långsam
bild-id: hero-01
filnamn: ai10.jpg
scen: Bildregi pilot
syfte: Visa hur fokus kan vandra i en sammanhållen bild.
motiv: En robot i ett ljuslandskap.
komposition: Motiv till höger och negativ yta till vänster.
motivplacering: höger tredjedel
format: 16:9
undvik: text över ansiktet; aggressiv zoom
prompt: Cinematic wide frame with calm negative space.
  Keep the portal and the robot in the same visual world.
- port | Portalen | 24 | 32 | 18 | 24 | Här öppnas den visuella riktningen.
- robot | Rörelsen | 67 | 34 | 16 | 34 | Figuren bär scenens handling.
steg: ja
rörelse: auto`;
const parsed=Manus.parse(manuscript).slides[0];
assert.equal(parsed.layout,'bildregi');
assert.equal(parsed.imageDirection.mode,'detail');
assert.deepEqual(Array.from(parsed.imageDirection.focus),[64,42]);
assert.deepEqual(Array.from(parsed.imageDirection.safe),[5,12,38,72]);
assert.equal(parsed.imageBrief.id,'hero-01');
assert.equal(parsed.imageBrief.purpose,'Visa hur fokus kan vandra i en sammanhållen bild.');
const round=Manus.parse(Manus.stringify({title:'Bildregi',slides:[parsed]})).slides[0];
assert.equal(round.imageDirection.mode,'detail');
assert.deepEqual(Array.from(round.imageDirection.end),[62,44,1.16]);
assert.equal(round.imageBrief.prompt,'Cinematic wide frame with calm negative space.\nKeep the portal and the robot in the same visual world.');
const normalized=Scen.normalizeImageDirection(parsed);
assert.equal(normalized.mode,'detail');
assert.equal(normalized.details.length,2);
assert.equal(normalized.details[1].id,'robot');
assert.equal(normalized.crop,'cover');
const brief=Scen.imageBrief(parsed,{scene:'Fallback scene'});
assert.equal(brief.imageId,'hero-01');
assert.equal(brief.filename,'ai10.jpg');
assert.equal(brief.aspectRatio,'16:9');
assert.equal(brief.plannedMotion.direction,'right');
assert.equal(brief.detailAreas.length,2);
assert.equal(brief.prompt,'Cinematic wide frame with calm negative space.\nKeep the portal and the robot in the same visual world.');
assert.equal(Scen.imageBrief({layout:'statement',title:'Typografi'},{}),null,'Scener utan bild ska inte få en påtvingad bildbrief.');
assert.equal(resolveServedPath(ROOT,'/bilder/ai-agenter/ai01.jpg'),path.join(ROOT,'bilder','ai-agenter','ai01.jpg'));
assert.equal(resolveServedPath(ROOT,'/%2e%2e/'+path.basename(ROOT)+'-evil/secret.txt'),null,'QA-servern får inte godkänna en syskonkatalog med samma sökvägsprefix.');
assert.equal(resolveServedPath(ROOT,'/%2e%2e/secret.txt'),null,'QA-servern får inte tillåta traversal utanför repot.');
const deck={theme:{id:'scen'},slides:[]};
const make=(mode,details=[])=>({layout:'bildregi',title:'Test',text:'Kort förklaring',image:'img:test.jpg',steps:true,ba:'auto',items:details,imageDirection:{mode,focus:[50,50],crop:'cover',start:[50,50,1],end:[55,48,1.1],safe:[6,10,38,76],shade:[2,6,46,88,.55],direction:'right',speed:'slow'}});
const cases={
 hero:make('hero'),
 detail:make('detail',['a | Första detaljen | 28 | 38 | 18 | 24 | Förklaring A','b | Andra detaljen | 69 | 35 | 16 | 28 | Förklaring B']),
 spotlight:make('spotlight',['a | Nod A | 30 | 44 | 14 | 20 | Annotation A','b | Nod B | 72 | 40 | 16 | 24 | Annotation B']),
 reveal:make('reveal',['a | Vänster | 0 | 0 | 34 | 100 | Första ledtråden','b | Mitten | 33 | 0 | 34 | 100 | Sambandet','c | Höger | 66 | 0 | 34 | 100 | Helheten'])
};
for(const [mode,slide] of Object.entries(cases)){
 const html=Scen.renderSlide(slide,0,deck,x=>x);
 assert(html.includes('data-layout="bildregi"'));
 assert(html.includes(`data-image-mode="${mode}"`));
 assert(html.includes('data-image-stage'));
 assert(html.includes('--image-start-scale:'));
 if(mode==='hero') assert(!html.includes('data-dramaturgy-item'),'Hero ska använda kamerarörelse utan påtvingad focus/fade-sekvens.');
 else assert.equal((html.match(/data-dramaturgy-item/g)||[]).length,slide.items.length);
 if(mode==='detail'||mode==='spotlight') assert(html.includes('data-dramaturgy-restore'),'Detalj och spotlight ska återvända till helheten med eget klick.');
 if(mode==='reveal') assert(!html.includes('data-dramaturgy-restore'),'Reveal ska landa i fullt avslöjad bild utan artificiellt restore-klick.');
}
console.log('OK: Bildregi-metadata, Image Brief, manus-roundtrip och fyra dramaturgier är definierade.');
