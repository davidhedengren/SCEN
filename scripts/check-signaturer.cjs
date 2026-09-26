const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');global.window=global;const read=p=>fs.readFileSync(path.join(root,p),'utf8');
vm.runInThisContext(read('src/engine.js'));vm.runInThisContext(read('src/manus.js')+';global.Manus=Manus;');
const names=['lameller','register','samband','marginal','sats'];
for(const name of names){const c=Manus.CATALOG.find(c=>c.l===name);assert(c);const s=Manus.parseBlock(c.ex);assert.equal(s.layout,name);
 for(const id of ['bana','nattbana','scen']){const html=Scen.renderSlide(s,0,{theme:{id},slides:[s]},x=>x);assert(html.includes(`data-layout="${name}"`));assert(!html.includes('undefined'));const steps=[...html.matchAll(/data-step="(\d+)"/g)].map(m=>+m[1]);assert.deepEqual(steps,steps.map((_,i)=>i+1));if(name!=='lameller')assert(steps.length>=3);}
 const deck={title:'Test',theme:{id:'bana'},slides:[s]};const text=Manus.stringify(deck),parsed=Manus.parse(text);assert.equal(parsed.slides[0].layout,name);assert.equal(Manus.stringify(Manus.applyMeta({title:'Test',theme:{},slides:parsed.slides},parsed.meta)),text);
}
const html=read('scen.html'),embedded=html.match(/window.SCEN_IMAGES = (.*);\nwindow.SCEN_REPO/);assert(embedded);const images=JSON.parse(embedded[1]);assert(Object.keys(images).length>=13);assert(images['bilder/kastrorelse/parabel.svg'].startsWith('data:image/svg+xml;base64,'));
for(const block of html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)){if(block[0].includes('type="application/json"'))continue;new vm.Script(block[1]);}
console.log('OK: five layouts, three themes, sequential steps, manuscript round trips, embedded assets and JavaScript syntax.');
