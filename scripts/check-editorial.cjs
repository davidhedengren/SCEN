const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const r=path.resolve(__dirname,'..');global.window=global;const read=p=>fs.readFileSync(path.join(r,p),'utf8');
vm.runInThisContext(read('src/engine.js'));vm.runInThisContext(read('src/manus.js')+';global.Manus=Manus;');
const ids=['etapper','vagval','lager','resonemang','helhet'];
for(const id of ids){const sample=Manus.parseBlock(Manus.CATALOG.find(x=>x.l===id).ex);
 for(const theme of ['bana','nattbana'])for(const color of Object.keys(Scen.ACCENTS))for(const focus of Object.keys(Scen.FOCUS_STYLES)){
  const slide={...sample,accent:color,focus},deck={title:'Kontroll',theme:{id:theme},slides:[slide]};
  const h=Scen.renderSlide(slide,0,deck,x=>x);assert(!h.includes('undefined'));assert(h.includes('data-slide-accent="true"'));assert(h.includes(Scen.ACCENTS[color][0]));assert.equal(h.includes('data-focus='),focus!=='none');
  const steps=[...h.matchAll(/data-step="(\d+)"/g)].map(x=>+x[1]);assert.deepEqual(steps,steps.map((_,i)=>i+1));assert.equal(steps.length,sample.items.length+(id==='resonemang'?1:0));
  const parsed=Manus.parse(Manus.stringify(deck)).slides[0];assert.equal(parsed.accent,color);assert.equal(parsed.focus,focus);assert.deepEqual(parsed.items,slide.items);assert.equal(parsed.lt,slide.lt);assert.equal(parsed.rt,slide.rt);
  const off=Scen.renderSlide({...slide,steps:false},0,deck,x=>x);assert(!off.includes('data-step='));assert(!off.includes('data-focus='));
 }
 const escaped=Scen.renderSlide({...sample,title:'<script>bad',items:['<img onerror=x> | & test']},0,{theme:{id:'scen'}},x=>x);assert(escaped.includes('&lt;script&gt;'));assert(!escaped.includes('<img onerror'));
}
// Exercise the actual common step updater, with simple DOM stand-ins.
const source=read('src/engine.js'),start=source.indexOf('  function setSteps('),end=source.indexOf('  function stopTimers',start);const update=vm.runInNewContext('('+source.slice(start,end).trim()+')',{reduced:()=>true,running:[],playNamed:()=>({}),startTimer:()=>{}});
const groups=Array.from({length:4},()=>[{classList:{s:new Set(),toggle(k,on){on?this.s.add(k):this.s.delete(k);}}}]);const section={_groups:groups,dataset:{focus:'soft'},querySelectorAll:()=>[]};
for(const n of [0,1,2,3,4,3,1,0]){update(section,n,false);groups.forEach(([e],i)=>{assert.equal(e.classList.s.has('in'),i<n);assert.equal(e.classList.s.has('step-current'),i===n-1);assert.equal(e.classList.s.has('step-past'),i<n-1);});}
console.log('OK: 350 template/theme/color/focus combinations, manuscript persistence, steps off, escaping and forward/back focus.');
