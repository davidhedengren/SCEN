const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), rd = p => fs.readFileSync(path.join(root, p), 'utf8');
global.window = global; vm.runInThisContext(rd('src/engine.js')); vm.runInThisContext(rd('src/manus.js') + ';global.Manus=Manus;');

const ex = Manus.parseBlock(Manus.CATALOG.find(c => c.l === 'bro').ex);
const deck = { theme: { id: 'scen' } };
const cues = h => (h.match(/data-dramaturgy-cue/g) || []).length;

// Loop: en cue per hållplats, en för returen, sedan återställning
assert.ok(ex.ret, 'Katalogexemplet ska visa loopen');
const loop = Scen.renderSlide(ex, 0, deck, x => x);
const n = Scen.lines(ex.items).length;
assert.equal(cues(loop), n + 1);
assert.ok(loop.includes('data-dramaturgy-restore') && loop.includes('data-bro-loop="true"') && loop.includes('br-ripple'));

// Öppen process: samma dramaturgi, men ingen retur
const open = Scen.renderSlide({ ...ex, ret: '' }, 0, deck, x => x);
assert.equal(cues(open), n + 1);
assert.ok(!open.includes('data-bro-loop') && !open.includes('br-ripple') && !open.includes('br-retlab'));

// Utan klicksteg: allt visas direkt
const flat = Scen.renderSlide({ ...ex, steps: false }, 0, deck, x => x);
assert.ok(flat.includes('data-dramaturgy-static="true"') && cues(flat) === 0);

// 0–6 hållplatser renderar, högst fem visas, varje hållplats har nod och etikett
for (let k = 0; k <= 6; k++) {
  const sl = { layout: 'bro', title: 'Test', items: Array.from({ length: k }, (_, i) => `Steg ${i + 1} | Text`), ret: k % 2 ? 'Tillbaka' : '' };
  const h = Scen.renderSlide(sl, 0, deck, x => x), m = Math.min(k, 5);
  assert.equal((h.match(/br-stop /g) || []).length, m);
  assert.equal((h.match(/class="br-node/g) || []).length, m);
  assert.equal(cues(h), m + 1);
}

// Manus: retur överlever en rundresa
const text = Manus.stringify({ slides: [ex], theme: {} });
assert.ok(/^retur: /m.test(text));
assert.equal(Manus.parse(text).slides[0].ret, ex.ret);
assert.equal(Manus.stringify(Manus.parse(text)), text);

console.log('OK: Bro som öppen process och loop, 0–6 hållplatser, statiskt läge och manus med retur.');
