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

// The lesson follows the original again; overlays in slide coordinates are not used for diagrams.
assert.equal(deck.slides.length,21);
assert(mapping.every((row,i)=>row[0]===i+1&&row[1]===i+1));
assert(!deck.slides.some(s=>s.imageDirection?.mode==='spotlight'));
// A different caption must never change the diagram's coordinate system.
const bounds = text => /viewBox="([^"]+)"/.exec(text)?.[1];
for (const slide of templated) {
  const refs=Scen.imagesOf(slide);
  const base=read(refs[0]);
  for (const ref of refs) {
    const svg=read(ref);
    assert.equal(bounds(svg),bounds(base),`Olika bildutsnitt i ${ref}`);
    // Highlight rectangles surround the actual triangle in the SAME SVG, not a guessed viewport area.
    const attr=(s,n)=>new RegExp(`\\b${n}="([^"]+)"`).exec(s)?.[1];
    const polygons=new Map([...svg.matchAll(/<g\s+data-node="([^"]+)"[^>]*><polygon\s+points="([^"]+)"/g)].map(m=>[m[1],m[2].split(' ').map(p=>p.split(',').map(Number))]));
    for (const match of svg.matchAll(/<rect\s+data-focus-node="([^"]+)"[^>]*>/g)) {
      const points=polygons.get(match[1]);assert(points,`${ref}: fokus utan nod`);
      const x=+attr(match[0],'x'),y=+attr(match[0],'y'),w=+attr(match[0],'width'),h=+attr(match[0],'height');
      assert(points.every(([px,py])=>px>x&&px<x+w&&py>y&&py<y+h),`${ref}: rutan missar noden`);
    }
  }
}
const data=JSON.parse(read('docs/minimax/diagramdata-v2.json'));
assert.equal(Object.keys(data.source20.nodes).length,22);
assert.equal(data.source20.edges.length,21);
assert.equal(data.source20.nodes[data.source20.root].role,'min');
console.log('OK: originalets 21 scener, identiska bildutsnitt, exakt fokus runt trianglar och återställt övningsträd.');
