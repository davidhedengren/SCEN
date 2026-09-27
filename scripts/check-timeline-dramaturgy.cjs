const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
global.window = global;
vm.runInThisContext(read('src/engine.js'));

assert.equal(typeof Scen.dramaturgyPhase, 'function', 'Motorn ska exponera en generell dramaturgisk tillståndsfunktion för spelare och framtida live-preview.');
assert.equal(typeof Scen.applyDramaturgy, 'function', 'Motorn ska exponera samma DOM-tillämpning som spelaren använder.');

const focusSteps = [1, 2, 3, 4];
const restoreStep = 5;
const expected = [
  { state: 'overview', focus: -1 },
  { state: 'focus', focus: 0 },
  { state: 'focus', focus: 1 },
  { state: 'focus', focus: 2 },
  { state: 'focus', focus: 3 },
  { state: 'restored', focus: -1 }
];
expected.forEach((want, step) => assert.deepEqual(Scen.dramaturgyPhase(focusSteps, restoreStep, step, false), want));
for (let step = restoreStep; step >= 0; step--) {
  assert.deepEqual(Scen.dramaturgyPhase(focusSteps, restoreStep, step, false), expected[step], `Bakåtnavigering ska återskapa steg ${step} deterministiskt.`);
}
assert.deepEqual(Scen.dramaturgyPhase(focusSteps, restoreStep, 0, true), { state: 'restored', focus: -1 }, 'Statisk vy ska använda det återställda helhetsläget.');

const slide = {
  id: 'timeline-pilot', layout: 'timeline', title: 'Fyra skiften', steps: true,
  items: ['1950 | Första förändringen', '1997 | Ett nytt arbetssätt etableras', '2012 | Systemet får en ny riktning', '2026 | Helheten blir synlig igen']
};
const html = Scen.renderSlide(slide, 0, { theme: { id: 'scen' } }, value => value);
assert.match(html, /data-dramaturgy="focus-restore"/);
assert.match(html, /data-dramaturgy-state="overview"/);
assert.equal((html.match(/data-dramaturgy-focus="\d+"/g) || []).length, 4, 'Varje tidslinjepunkt ska vara ett semantiskt fokusmål.');
assert.equal((html.match(/data-dramaturgy-item/g) || []).length, 4, 'Alla punkter ska finnas kvar som kontext genom hela sekvensen.');
assert.equal((html.match(/data-step="\d+"/g) || []).length, 5, 'Fyra fokusklick ska följas av ett eget restore-klick.');
assert.match(html, /data-dramaturgy-restore/);
assert.match(html, /class="tl-progress"/);

const noMotion = Scen.renderSlide({ ...slide, ba: 'none' }, 0, { theme: { id: 'nattbana' } }, value => value);
assert.match(noMotion, /data-body-motion="none"/);
assert.doesNotMatch(noMotion, /class="tl-stage[^>]*data-anim=/, 'Rörelse: ingen ska stänga av Tidslinjens egen entrérörelse.');
assert.equal((noMotion.match(/data-step="\d+"/g) || []).length, 5, 'Rörelse: ingen får inte ändra informationssekvensen.');

const staticHtml = Scen.renderSlide({ ...slide, steps: false }, 0, { theme: { id: 'atlas' } }, value => value);
assert.match(staticHtml, /data-dramaturgy-static="true"/);
assert.match(staticHtml, /data-dramaturgy-state="restored"/);
assert.equal((staticHtml.match(/data-step="\d+"/g) || []).length, 0);

console.log('OK: generell dramaturgi och Tidslinjens overview → focus-n → restored är deterministiska.');
