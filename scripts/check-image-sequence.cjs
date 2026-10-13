// Image sequences must retain all media in an offline export and survive manuscript edits.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
global.window = global;
vm.runInThisContext(read('src/engine.js'));
vm.runInThisContext(read('src/manus.js') + ';global.Manus=Manus;');
const slide = Manus.parseBlock('[egen: resonemang-i-bild]\nbild: bilder/start.svg\n- Första steget | bilder/ett.svg | Jämför två värden.\n- Svaret | bilder/tva.svg | Ett motiverat beslut.');
assert.deepEqual(Scen.imagesOf(slide), ['bilder/start.svg', 'bilder/ett.svg', 'bilder/tva.svg']);
for (const steps of [true, false]) {
  const parsed = Manus.parse(Manus.stringify({title:'Kontroll',slides:[{...slide,steps}]})).slides[0];
  assert.deepEqual(parsed.items, slide.items);
  assert.equal(parsed.steps, steps);
  assert.equal(parsed.tpl, slide.tpl);
}
const deck = Manus.parse(read('presentationer/minimax-och-beskarning.md'));
const templated = deck.slides.filter(s => s.tpl === 'resonemang-i-bild');
assert(templated.length >= 6);
for (const s of templated) for (const ref of Scen.imagesOf(s)) assert(fs.existsSync(path.join(root, ref)), ref);
// Independent checks of the worked examples and approved correction.
const rootValue = Math.max(...[[8,5,6],[9,3,7],[2,4,6]].map(xs=>Math.min(...xs)));
assert.equal(rootValue, 5);
const left = Math.min(Math.max(5,3),Math.max(8,2));
const right = Math.min(Math.max(7,1),Math.max(2,3));
assert.equal(right, 3);
assert.equal(Math.max(left,right), 5);
const mapping = JSON.parse(read('docs/minimax/scenmappning.json'));
assert.deepEqual([...new Set(mapping.map(x=>x[1]))].sort((a,b)=>a-b),Array.from({length:21},(_,i)=>i+1));
console.log('OK: bildstegens resurser, manusrundtur, räkneexempel och täckning av samtliga originalbilder.');
