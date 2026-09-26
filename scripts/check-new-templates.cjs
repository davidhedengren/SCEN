const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
global.window = global;
vm.runInThisContext(read('src/engine.js'));
vm.runInThisContext(read('src/manus.js') + ';global.Manus=Manus;');

const ids = ['skiften', 'prisma', 'verkningar', 'belagg', 'sammanflode'];
const tags = ['skiften', 'prisma', 'verkningar', 'belägg', 'sammanflöde'];
for (let i = 0; i < ids.length; i++) {
  assert.equal(Manus.TAGS[tags[i]], ids[i], `Manustaggen [${tags[i]}] saknas`);
  assert(Scen.LAYOUTS[ids[i]], `Layouten ${ids[i]} saknas`);
  assert(Manus.CATALOG.some(entry => entry.l === ids[i]), `Katalogposten ${ids[i]} saknas`);
}

const samples = {
  skiften: `[skiften]\netikett: Kronologi\nrubrik: Ett förlopp som byter riktning\nstart: Utgångsläge\nslut: Nytt läge\n- 1900 | Ett beslut fattas | Institutionerna ändras\n- 1950 | En ny metod införs | Arbetet organiseras om\n- 2000 | Systemet öppnas | Fler kan delta\nslutsats: Varje brytpunkt ändrar villkoren för nästa.`,
  prisma: `[prisma]\netikett: Perspektiv\nrubrik: Samma fråga, olika blickar\nfråga: Hur bör förändringen bedömas?\n- Perspektiv A | Fördelning | Utgår från jämlikhet\n- Perspektiv B | Genomförbarhet | Utgår från resurser\n- Perspektiv C | Lång sikt | Utgår från följdeffekter\ngemensamt: Alla försöker lösa samma grundproblem.\nspänning: De värderar kostnader och risker olika.`,
  verkningar: `[verkningar]\netikett: Kausalitet\nrubrik: Från påverkan till effekt\norsak: En yttre faktor förändras\n- Mekanism 1 | Systemets jämvikt rubbas\n- Mekanism 2 | Beteendet anpassas\nkonsekvens: Ett nytt stabilt läge uppstår\nvillkor: Kedjan gäller när övriga faktorer hålls ungefär konstanta.\nalternativ: En parallell faktor kan också bidra.`,
  belagg: `[belägg]\netikett: Källanalys\nrubrik: Från formulering till tolkning\nkälla: Exempelkälla, 2026\ntext: Vi måste ändra riktning nu, innan möjligheten går förlorad.\n- ändra riktning | Ett handlingskrav uttrycks | Avsändaren beskriver nuläget som otillräckligt\n- innan möjligheten går förlorad | Tidspress byggs upp | Brådska används för att stärka argumentet\nhelhet: Formuleringen kombinerar krav och tidspress.\nreservation: Texten visar retoriken, inte om hotet är verkligt.`,
  sammanflode: `[sammanflöde]\netikett: Syntes\nrubrik: Ett beslut med flera krav\n- Användare | Behöver enkelhet och tydlighet\n- Verksamhet | Behöver hållbar ekonomi\n- Teknik | Behöver robust drift\ngemensamt: Lösningen måste fungera över tid.\nspänning: Snabb leverans står mot långsiktig kvalitet.\nsyntes: Välj den minsta lösning som kan växa utan att byggas om.`
};

const expectedSteps = {
  skiften: 4,
  prisma: 5,
  verkningar: 5,
  belagg: 6,
  sammanflode: 6
};

for (const id of ids) {
  const parsed = Manus.parse(samples[id]).slides[0];
  assert.equal(parsed.layout, id);
  const deck = { title: 'Mallkontroll', theme: { id: 'scen' }, slides: [parsed] };
  const roundtrip = Manus.parse(Manus.stringify(deck)).slides[0];
  assert.deepEqual(roundtrip, parsed, `${id} överlever inte manus roundtrip`);

  for (const theme of ['scen', 'bana', 'natt', 'kritvit']) {
    const themed = { ...deck, theme: { id: theme } };
    const html = Scen.renderSlide(parsed, 0, themed, value => value);
    assert(html.includes(`data-layout="${id}"`));
    assert(!html.includes('undefined'));
    assert(!html.includes('<script>'));
    const steps = [...html.matchAll(/data-step="(\d+)"/g)].map(match => Number(match[1]));
    assert.deepEqual(steps, steps.map((_, index) => index + 1), `${id} har icke-sekventiella klicksteg`);
    assert.equal(steps.length, expectedSteps[id], `${id} har fel antal klicksteg`);

    const staticHtml = Scen.renderSlide({ ...parsed, steps: false }, 0, themed, value => value);
    assert(!staticHtml.includes('data-step='), `${id} lämnar klicksteg när steg är avstängda`);

    const noMotion = Scen.renderSlide({ ...parsed, ba: 'none' }, 0, themed, value => value);
    assert(noMotion.includes('data-step-anim="none"'), `${id} respekterar inte rörelse: ingen för klicksteg`);
    assert(noMotion.includes('data-body-motion="none"'), `${id} markerar inte bilden som helt rörelsefri`);
    assert(!/data-step-anim="(?:fade|mask|rise|left|right|zoom|pop|blur|wipe)"/.test(noMotion), `${id} hårdkodar fortfarande en kroppsrörelse`);
  }
}

const skiften = Scen.renderSlide(Manus.parse(samples.skiften).slides[0], 0, { theme: { id: 'scen' } }, x => x);
assert.equal((skiften.match(/class="sk-change"/g) || []).length, 3, 'Skiften måste göra förändringen strukturellt synlig för varje brytpunkt');
assert(skiften.includes('Institutionerna ändras'));

const belagg = Scen.renderSlide(Manus.parse(samples.belagg).slides[0], 0, { theme: { id: 'scen' } }, x => x);
assert.equal((belagg.match(/class="bl-mark k\d"/g) || []).length, 2, 'Belägg måste markera exakta textställen');
assert(belagg.includes('class="bl-ob k0"'));
assert(belagg.includes('class="bl-int k0"'));

const sammanflode = Scen.renderSlide(Manus.parse(samples.sammanflode).slides[0], 0, { theme: { id: 'scen' } }, x => x);
for (const cls of ['sf-common', 'sf-tension', 'sf-synthesis']) {
  assert(sammanflode.includes(`class="${cls}"`), `Sammanflöde saknar ${cls}`);
}

const appSource = read('src/app.js');
assert(appSource.includes("'skiften','prisma','verkningar','belagg','sammanflode'"), 'Editorn saknar de nya mallarna i standardberäkningen för klickfokus');
const cssSource = read('src/engine.css');
assert(cssSource.includes('[data-body-motion="none"].fn-layout'), 'Rörelsefria analysmallar stänger inte av CSS-övergångar');

const malicious = Manus.parse(`[belägg]\nrubrik: <script>bad</script>\nkälla: Källa\ntext: Säker text.\n- Säker | Observation | <img onerror=x>`).slides[0];
const escaped = Scen.renderSlide(malicious, 0, { theme: { id: 'scen' } }, x => x);
assert(escaped.includes('&lt;script&gt;'));
assert(!escaped.includes('<img onerror'));

console.log('OK: fem nya förstaklassmallar, manus-roundtrip, strukturell logik, teman, klicksteg, statiskt läge och escaping.');
