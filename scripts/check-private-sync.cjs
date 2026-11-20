const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

// Kör den riktiga synkningen mot isolerade skrivbord och ett versions-API med
// samma unika nycklar som i Postgres. Ingen anslutning till användarens projekt.
const source = fs.readFileSync(require.resolve('../src/cloud.js'),'utf8');
const code = source.slice(source.indexOf('  function workspace('),source.lastIndexOf('  return {init};'));
const held = new Map();
const locks = { request(name, task) {
  const call = (held.get(name) || Promise.resolve()).then(task);
  held.set(name,call.catch(()=>{})); return call;
} };
const workspace = vm.runInNewContext(code+'\nworkspace',{
  crypto:webcrypto, navigator:{locks,onLine:true}, Scen:{imagesOf:()=>[]},
  fail:message=>{throw new Error(message);}, selected:'select=*'
});
function device(api) {
  const data = new Map(), key = (s,k)=>s+'!'+JSON.stringify(k);
  return workspace(api,{
    get:async(s,k)=>structuredClone(data.get(key(s,k))),
    put:async(s,k,v)=>data.set(key(s,k),structuredClone(v)),
    all:async s=>Array.from(data).filter(([k])=>k.startsWith(s+'!')).map(([,v])=>structuredClone(v))
  },'owner');
}
(async()=>{
  const versions = [], response = rows=>({json:async()=>structuredClone(rows)});
  const api = async (request,options={})=>{
    const url = new URL(request,'http://scen.test');
    if (options.method === 'POST') {
      const row = JSON.parse(options.body);
      if (versions.some(v=>v.change_id===row.change_id || (v.deck_id===row.deck_id && v.revision===row.revision))) {
        throw Object.assign(new Error('Versionen finns'),{status:409});
      }
      versions.push(row);return response([]);
    }
    const rows=versions.filter(v=>['deck_id','change_id','revision'].every(f=>!url.searchParams.has(f) || 'eq.'+v[f]===url.searchParams.get(f)));
    if (url.pathname.endsWith('/scen_library')) return response([...new Map(rows.map(v=>[v.deck_id,v])).values()]);
    return response(rows);
  };
  let online=true;
  const a=device(api), b=device((...args)=>{if(!online) throw new TypeError('Nätavbrott');return api(...args);});
  await a.save({id:'demo',title:'Start',slides:[]}); await a.retry();
  const [original]=await b.list(); assert.equal(original.title,'Start');
  online=false;
  await b.save({...original,title:'Från B'});
  await assert.rejects(b.retry()); assert.match(await b.status('demo'),/lokalt/);
  await a.save({...original,title:'Från A'}); await a.retry();
  online=true; await b.retry();
  const copies=await b.list();
  assert.deepEqual(Array.from(copies,d=>d.title).sort(),['Från A','Från B (parallell ändring)']);
  await b.restore('demo',1);
  assert((await b.list()).some(d=>d.title==='Start (version 1)'));
  assert.equal(versions.filter(v=>v.deck_id==='demo').length,2);
  console.log('OK: privat bibliotek, lokalt utkast, två datorer, samtidiga ändringar och återställning.');
})().catch(e=>{console.error(e);process.exitCode=1;});
