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
const templated = deck.slides.filter(s => ['resonemang-i-bild','resonemang-med-logg'].includes(s.tpl));
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
// Användningsområden och Begränsningar (original 3 och 4) ligger efter minimaxuppgiften, före alfa-beta.
// Varje scen pekar på rätt originalbild i sin anteckning.
assert(mapping.every((row,i)=>row[0]===i+1));
deck.slides.forEach((s,i)=>{const m=/originalbild (\d+)\./.exec(JSON.stringify(s.notes||''));if(m)assert.equal(+m[1],mapping[i][1],`scen ${i+1}`);});
assert(!deck.slides.some(s=>s.imageDirection?.mode==='spotlight'));
// A different caption must never change the diagram's coordinate system.
const bounds = text => /viewBox="([^"]+)"/.exec(text)?.[1];
for (const slide of templated) {
  const refs=Scen.imagesOf(slide);
  const base=read(refs[0]);
  for (const ref of refs) {
    const svg=read(ref);
    assert.equal(bounds(svg),bounds(base),`Olika bildutsnitt i ${ref}`);
    // Fokusmarkeringar omsluter den faktiska noden i SAMMA SVG, inte en gissad yta i visningen.
    const attr=(s,n)=>new RegExp(`\\b${n}="([^"]+)"`).exec(s)?.[1];
    const toPoints=s=>s.split(' ').map(p=>p.split(',').map(Number));
    const polygons=new Map([...svg.matchAll(/<g\s+data-node="([^"]+)"[^>]*><polygon\s+points="([^"]+)"/g)].map(m=>[m[1],toPoints(m[2])]));
    for (const match of svg.matchAll(/<polygon\s+data-focus-node="([^"]+)"[^>]*>/g)) {
      const points=polygons.get(match[1]);assert(points,`${ref}: fokus utan nod`);
      const halo=toPoints(attr(match[0],'points'));
      const xs=halo.map(p=>p[0]),ys=halo.map(p=>p[1]);
      assert(points.every(([px,py])=>px>Math.min(...xs)&&px<Math.max(...xs)&&py>Math.min(...ys)&&py<Math.max(...ys)),`${ref}: markeringen missar noden ${match[1]}`);
    }
    const boards=new Map([...svg.matchAll(/<rect\s+data-board="([^"]+)"[^>]*>/g)].map(m=>[m[1],m[0]]));
    for (const match of svg.matchAll(/<rect\s+data-focus-board="([^"]+)"[^>]*>/g)) {
      const board=boards.get(match[1]);assert(board,`${ref}: fokus utan bräde`);
      const box=s=>['x','y','width','height'].map(n=>+attr(s,n));
      const [fx,fy,fw,fh]=box(match[0]),[bx,by,bw,bh]=box(board);
      assert(fx<bx&&fy<by&&fx+fw>bx+bw&&fy+fh>by+bh,`${ref}: ramen missar brädet ${match[1]}`);
    }
  }
}
// Markeringarna finns verkligen, så att kontrollen ovan inte blir tom.
const allSvg=templated.flatMap(s=>Scen.imagesOf(s)).map(read).join('');
assert((allSvg.match(/data-focus-node=/g)||[]).length>20);
assert((allSvg.match(/data-focus-board=/g)||[]).length>20);
// Oberoende minimax för spelställningarna i scen 7, 8 och 10.
const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const ttt=(b,p)=>{for(const[a,c,d]of LINES)if(b[a]!=='.'&&b[a]===b[c]&&b[a]===b[d])return b[a]==='X'?1:-1;const e=[...b].flatMap((x,i)=>x==='.'?[i]:[]);if(!e.length)return 0;const v=e.map(i=>ttt(b.slice(0,i)+p+b.slice(i+1),p==='X'?'O':'X'));return p==='X'?Math.max(...v):Math.min(...v);};
const after=(b,i,p)=>b.slice(0,i)+p+b.slice(i+1);
assert.equal(ttt('.XOOXXX.O','O'),0);
assert.equal(ttt('.XOOX.X.O','X'),1);
const s10='O.OOXXX..';
assert.deepEqual([1,7,8].map(i=>ttt(after(s10,i,'X'),'O')),[0,-1,-1]);
assert.equal(ttt(s10,'X'),0);
assert(/X nere till höger[^\n]*−1/.test(read('presentationer/minimax-och-beskarning.md')),'Rättelsen i scen 10 ska stå i anteckningen');
const data=JSON.parse(read('docs/minimax/diagramdata-v2.json'));
assert.equal(Object.keys(data.source20.nodes).length,22);
assert.equal(data.source20.edges.length,21);
assert.equal(data.source20.nodes[data.source20.root].role,'min');
console.log('OK: originalets 21 scener, identiska bildutsnitt, exakt fokus runt trianglar och återställt övningsträd.');
