const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');global.window=global;const rd=p=>fs.readFileSync(path.join(root,p),'utf8');const engine=rd('src/engine.js');
vm.runInThisContext(engine);vm.runInThisContext(rd('src/manus.js')+';global.Manus=Manus;');
for(const layout of ['bro','cards','bullets','timeline','sats','register','samband']) for(const focus of Object.keys(Scen.FOCUS_STYLES)){
 const c=Manus.CATALOG.find(x=>x.l===layout),slide={...Manus.parseBlock(c.ex),focus};
 for(const theme of ['bana','nattbana']){
 const html=Scen.renderSlide(slide,0,{theme:{id:theme}},x=>x);assert.equal(html.includes('data-focus='),focus!=='none');if(focus!=='none')assert(html.includes(`data-focus="${focus}"`));
 assert(!Scen.renderSlide({...slide,steps:false},0,{theme:{id:theme}},x=>x).includes('data-focus='));
 }
 const parsed=Manus.parse(Manus.stringify({title:'Test',theme:{id:'bana'},slides:[slide]}));assert.equal(parsed.slides[0].focus,focus);
}
const body=engine.slice(engine.indexOf('  function setSteps('),engine.indexOf('  function stopTimers('));
const setSteps=new Function('reduced','running','startTimer',body+';return setSteps;')(()=>true,[],()=>{});
const make=()=>{const flags=new Set();return {dataset:{},classList:{toggle(k,v){v?flags.add(k):flags.delete(k)},contains:k=>flags.has(k)}}};
const sec={_groups:[[make(),make()],[make()],[make()]],querySelectorAll:()=>[],dataset:{focus:'soft'}};
for(const n of [0,1,2,3,2,1,0]){setSteps(sec,n,false);sec._groups.forEach((g,i)=>g.forEach(el=>{assert.equal(el.classList.contains('in'),i<n);assert.equal(el.classList.contains('step-current'),i===n-1);assert.equal(el.classList.contains('step-past'),i<n-1)}));}
const bro=Manus.parseBlock(Manus.CATALOG.find(c=>c.l==='bro').ex);assert(Scen.renderSlide(bro,0,{}).includes('data-focus="soft"'));bro.dim=false;assert(!Scen.renderSlide(bro,0,{}).includes('data-focus='));const out=Manus.parse(Manus.stringify({slides:[bro],theme:{}}));assert.equal(out.slides[0].dim,false);
console.log('OK: focus modes in seven layouts and two themes; round trips; grouped steps forward/back/reset; Bro defaults and opt-out.');
