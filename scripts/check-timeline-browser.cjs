const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

const variants = [
  { id: 'tl-2', layout: 'timeline', title: 'Två avgörande skiften', text: 'Från utgångspunkt till ett nytt läge.', steps: true, items: ['1950 | En idé formuleras | Den första principen blir möjlig att diskutera.', '2026 | Helheten återvänder | Sambanden kan nu läsas som en sammanhängande utveckling.'] },
  { id: 'tl-3', layout: 'timeline', title: 'Tre steg i en förändring', steps: true, items: ['Start | Frågan öppnas', 'Skifte | Förutsättningarna förändras', 'Nu | Ett nytt mönster blir synligt'] },
  { id: 'tl-4', layout: 'timeline', title: 'Fyra händelser med olika rytm', steps: true, items: ['1950 | Första signalen', '1997 | Ett nytt arbetssätt | Den längre förklaringen ska vara fullt läsbar utan att kompositionen flyttar sig när fokus vandrar.', '2012 | Riktningen ändras', '2026 | Helheten kan återställas'] },
  { id: 'tl-5', layout: 'timeline', title: 'Fem brytpunkter', steps: true, items: Array.from({ length: 5 }, (_, i) => `${2000 + i * 5} | Händelse ${i + 1} | En kort konsekvens som ger punkten mening.`) },
  { id: 'tl-6', layout: 'timeline', title: 'Sex punkter i en tät men läsbar kronologi', text: 'Samtliga punkter ska behålla sina fasta positioner.', steps: true, items: Array.from({ length: 6 }, (_, i) => `${1980 + i * 8} | Längre händelserubrik ${i + 1} | Förklaringen beskriver vad som förändras och varför händelsen hör hemma i helheten.`) }
];

function page(theme, motion, holdSlide, holdStep) {
  const engine = read('src/engine.js').replace(/<\/script/gi, '<\\/script');
  const css = read('src/engine.css');
  const slides = variants.map(slide => ({ ...slide, ...(motion === 'none' ? { ba: 'none' } : {}) }));
  const deck = { title: 'Tidslinjepilot', theme: { id: theme, look: theme === 'scen' ? 'light' : undefined }, slides, templates: {} };
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><style>${css}</style><style>html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#000}#root{position:fixed;inset:0}.sc-bar,.sc-toast{display:none!important}</style></head><body><div id="root"></div><script>${engine}</script><script>
const deck=${JSON.stringify(deck).replace(/</g, '\\u003c')};
const holdSlide=${JSON.stringify(holdSlide)},holdStep=${JSON.stringify(holdStep)};
const result={theme:${JSON.stringify(theme)},motion:${JSON.stringify(motion)},reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,errors:[],slides:[]};
document.documentElement.dataset.qaStage='script-started';
addEventListener('error',e=>result.errors.push(String(e.error||e.message)));
addEventListener('unhandledrejection',e=>result.errors.push(String(e.reason)));
const pv=Scen.player(document.getElementById('root'),deck,{mode:'present',hint:false});
document.documentElement.dataset.qaStage='player-created';
const settle=async sec=>{void sec.offsetWidth;await new Promise(r=>setTimeout(r,20));sec.getAnimations({subtree:true}).forEach(a=>{try{a.finish()}catch{}});void sec.offsetWidth;};
const snap=sec=>{
 const items=[...sec.querySelectorAll('[data-dramaturgy-item]')];
 return {state:sec.dataset.dramaturgyState||'',focus:sec.dataset.dramaturgyFocus==null?-1:+sec.dataset.dramaturgyFocus,progress:+getComputedStyle(sec).getPropertyValue('--dramaturgy-progress'),opacities:items.map(x=>+getComputedStyle(x).opacity),current:items.map(x=>x.classList.contains('dramaturgy-current')),past:items.map(x=>x.classList.contains('dramaturgy-past')),future:items.map(x=>x.classList.contains('dramaturgy-future'))};
};
(async()=>{
 document.documentElement.dataset.qaStage='waiting-fonts';
 await document.fonts.ready;
 document.documentElement.dataset.qaStage='fonts-ready';
 for(let i=0;i<deck.slides.length;i++){
  document.documentElement.dataset.qaStage='slide-'+i;
  pv.go(i,{anim:false});pv.replay();let sec=pv.el.querySelector('.slide.active');await settle(sec);
  const entry={count:sec.querySelectorAll('[data-dramaturgy-item]').length,steps:pv.steps(),forward:[snap(sec)],backward:[],geometry:{},motion:{}};
  for(let q=0;q<entry.steps;q++){pv.next();await settle(sec);entry.forward.push(snap(sec));}
  const sr=sec.getBoundingClientRect(),items=[...sec.querySelectorAll('[data-dramaturgy-item]')],rects=items.map(x=>x.getBoundingClientRect());
  const railRect=sec.querySelector('.tl-rail').getBoundingClientRect(),markerRects=items.map(x=>x.querySelector('.tl-marker').getBoundingClientRect());
  entry.geometry.inside=rects.every(r=>r.left>=sr.left-1&&r.top>=sr.top-1&&r.right<=sr.right+1&&r.bottom<=sr.bottom+1);
  entry.geometry.noOverlap=rects.every((a,ai)=>rects.every((b,bi)=>bi<=ai||Math.min(a.right,b.right)-Math.max(a.left,b.left)<=2||Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)<=2));
  entry.geometry.railDelta=markerRects.map(r=>(r.top+r.height/2)-(railRect.top+railRect.height/2));
  entry.geometry.railAligned=entry.geometry.railDelta.every(delta=>Math.abs(delta)<=2);
  entry.geometry.scroll=pv.el.scrollWidth<=pv.el.clientWidth+1&&pv.el.scrollHeight<=pv.el.clientHeight+1;
  entry.geometry.fixed=rects.map(r=>[r.left,r.top,r.width,r.height]);
  entry.motion.item=getComputedStyle(items[0]).transitionDuration;
  entry.motion.marker=getComputedStyle(items[0].querySelector('.tl-marker')).transitionDuration;
  entry.motion.progress=getComputedStyle(sec.querySelector('.tl-progress')).transitionDuration;
  for(let q=entry.steps;q>0;q--){pv.prev();await settle(sec);entry.backward.push(snap(sec));}
  const thumb=Scen.thumb(deck.slides[i],deck,{},i);thumb.style.cssText='position:fixed;left:-4000px;top:0;width:960px';document.body.appendChild(thumb);await settle(thumb);
  const ts=thumb.querySelector('.slide'),ti=[...ts.querySelectorAll('[data-dramaturgy-item]')];
  entry.static={state:ts.dataset.dramaturgyState,progress:+getComputedStyle(ts).getPropertyValue('--dramaturgy-progress'),opacities:ti.map(x=>+getComputedStyle(x).opacity)};
  thumb.remove();result.slides.push(entry);
 }
 if(Number.isFinite(holdSlide)){
  pv.go(holdSlide,{anim:false});pv.replay();const held=pv.el.querySelector('.slide.active');await settle(held);
  for(let q=0;q<holdStep;q++){pv.next();await settle(held);}
 }
 document.documentElement.dataset.qa=btoa(unescape(encodeURIComponent(JSON.stringify(result))));
})().catch(e=>{result.errors.push(String(e&&e.stack||e));document.documentElement.dataset.qa=btoa(unescape(encodeURIComponent(JSON.stringify(result))));});
</script></body></html>`;
}

function server() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/qa.html') return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const holdSlide=url.searchParams.has('holdSlide')?Number(url.searchParams.get('holdSlide')):null;
    const holdStep=url.searchParams.has('holdStep')?Number(url.searchParams.get('holdStep')):0;
    res.end(page(url.searchParams.get('theme') || 'scen', url.searchParams.get('motion') || 'auto', holdSlide, holdStep));
  });
}

function findBrowser() {
  const candidates = [process.env.SCEN_CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
  for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
  throw new Error('Ingen Chrome eller Edge hittades.');
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function readDebugPort(profile) {
  const file = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 200; i++) {
    if (fs.existsSync(file)) {
      try { return Number(fs.readFileSync(file, 'utf8').split(/\r?\n/)[0]); }
      catch (error) { if (error.code !== 'EBUSY') throw error; }
    }
    await wait(25);
  }
  throw new Error('Chrome öppnade ingen DevTools-port.');
}
function cdpSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url); let next = 0; const pending = new Map();
    socket.addEventListener('open', () => resolve({
      call(method, params = {}) { return new Promise((ok, fail) => { const id = ++next; pending.set(id, { ok, fail }); socket.send(JSON.stringify({ id, method, params })); }); },
      close() { socket.close(); }
    }));
    socket.addEventListener('message', event => { const msg = JSON.parse(event.data); if (!msg.id || !pending.has(msg.id)) return; const { ok, fail } = pending.get(msg.id); pending.delete(msg.id); msg.error ? fail(new Error(msg.error.message)) : ok(msg.result); });
    socket.addEventListener('error', reject);
  });
}
async function run(browser, url, reduced, screenshot) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'scen-timeline-'));
  const child = spawn(browser,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update',`--user-data-dir=${profile}`,'--window-size=1920,1080','--force-device-scale-factor=1','--remote-debugging-port=0','about:blank'],{windowsHide:true,stdio:'ignore'});
  let cdp;
  try {
    const port = await readDebugPort(profile);
    let target;
    for (let i = 0; i < 80; i++) {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()).catch(() => []);
      target = list.find(entry => entry.type === 'page');
      if (target) break;
      await wait(25);
    }
    if (!target) throw new Error('Chrome skapade ingen sida för browser-QA.');
    cdp = await cdpSocket(target.webSocketDebuggerUrl);
    await cdp.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    await cdp.call('Page.enable');
    await cdp.call('Page.navigate', { url });
    let encoded = '', stage = '';
    for (let i = 0; i < 600; i++) {
      const probe = await cdp.call('Runtime.evaluate', { expression: `({qa:document.documentElement.dataset.qa||'',stage:document.documentElement.dataset.qaStage||''})`, returnByValue: true });
      encoded = probe.result.value.qa; stage = probe.result.value.stage;
      if (encoded) break;
      await wait(25);
    }
    if (!encoded) throw new Error(`QA-resultat saknas vid steg ${stage || 'okänt'}.`);
    if (screenshot) {
      const image = await cdp.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(screenshot, Buffer.from(image.data, 'base64'));
    }
    return JSON.parse(Buffer.from(encoded,'base64').toString('utf8'));
  } finally {
    if (cdp) cdp.close();
    if (child.exitCode == null) {
      child.kill();
      await Promise.race([once(child, 'close'), wait(2000)]);
    }
    for (let i = 0; i < 10; i++) {
      try { fs.rmSync(profile,{recursive:true,force:true}); break; }
      catch (error) { if (i === 9) throw error; await wait(100); }
    }
  }
}

function validate(result, zeroMotion) {
  assert.deepEqual(result.errors, [], result.errors.join('\n'));
  result.slides.forEach((entry, index) => {
    assert.equal(entry.count, index + 2);
    assert.equal(entry.steps, entry.count + 1);
    assert.equal(entry.forward[0].state, 'overview');
    assert.equal(entry.forward[0].focus, -1);
    assert(entry.forward[0].opacities.every(v => v >= .3), 'Alla punkter ska vara synliga i overview.');
    for (let focus = 0; focus < entry.count; focus++) {
      const state = entry.forward[focus + 1];
      assert.equal(state.state, 'focus');assert.equal(state.focus, focus);assert.equal(state.current.filter(Boolean).length, 1);
      assert(Math.abs(state.progress - (entry.count > 1 ? focus / (entry.count - 1) : 1)) < .001);
      assert(state.opacities[focus] > .95, 'Aktuell punkt ska ha full tydlighet.');
      const contextOpacities = state.opacities.filter((_, item) => item !== focus);
      contextOpacities.forEach(opacity => {
        assert(opacity >= .28, 'Historik och framtid ska förbli läsbara som kontext.');
        assert(opacity <= .44, 'Icke-aktiva punkter ska vara tydligt nedtonade under fokus.');
      });
      assert(state.opacities[focus] - Math.max(...contextOpacities) >= .55, 'Den aktiva punkten ska omedelbart dominera över kontexten.');
      const pastOpacity = state.opacities.find((_, item) => state.past[item]);
      const futureOpacity = state.opacities.find((_, item) => state.future[item]);
      if (pastOpacity != null && futureOpacity != null) assert(pastOpacity > futureOpacity, 'Historik ska vara tydligare än framtida kontext.');
    }
    const restored = entry.forward.at(-1);
    assert.equal(restored.state, 'restored');assert.equal(restored.focus, -1);assert.equal(restored.progress, 1);
    assert(restored.opacities.every(v => v > .95));
    const expectedBack = entry.forward.slice(0, -1).reverse();
    assert.equal(entry.backward.length, expectedBack.length);
    entry.backward.forEach((state, i) => { assert.equal(state.state, expectedBack[i].state);assert.equal(state.focus, expectedBack[i].focus);assert(Math.abs(state.progress - expectedBack[i].progress) < .001); });
    assert(entry.geometry.inside && entry.geometry.noOverlap && entry.geometry.railAligned && entry.geometry.scroll, `Geometrifel för ${entry.count} punkter: ${JSON.stringify(entry.geometry)}.`);
    assert.equal(entry.static.state, 'restored');assert.equal(entry.static.progress, 1);assert(entry.static.opacities.every(v => v > .95));
    const durations = [entry.motion.item, entry.motion.marker, entry.motion.progress].flatMap(v => String(v).split(',')).map(v => parseFloat(v) || 0);
    if (zeroMotion) assert(durations.every(v => v === 0), `Rörelse skulle vara avstängd men var ${durations.join(', ')}.`);
    else assert(durations.some(v => v > 0), `Normal tidslinje saknar semantiska övergångar (media reduce=${result.reduced}).`);
  });
}

async function main() {
  const s = server();s.listen(0,'127.0.0.1');await once(s,'listening');
  const port=s.address().port,browser=findBrowser();
  const outDir=process.env.SCEN_QA_DIR||path.join(os.tmpdir(),'scen-timeline-qa');fs.mkdirSync(outDir,{recursive:true});
  try {
    for (const theme of ['scen','klassrum','atlas','nattbana']) validate(await run(browser,`http://127.0.0.1:${port}/qa.html?theme=${theme}&motion=auto`,false),false);
    validate(await run(browser,`http://127.0.0.1:${port}/qa.html?theme=scen&motion=none`,false),true);
    validate(await run(browser,`http://127.0.0.1:${port}/qa.html?theme=nattbana&motion=auto`,true),true);
    await run(browser,`http://127.0.0.1:${port}/qa.html?theme=scen&holdSlide=2&holdStep=2`,false,path.join(outDir,'timeline-light-focus-2.png'));
    await run(browser,`http://127.0.0.1:${port}/qa.html?theme=scen&holdSlide=2&holdStep=5`,false,path.join(outDir,'timeline-light-restored.png'));
    await run(browser,`http://127.0.0.1:${port}/qa.html?theme=nattbana&holdSlide=4&holdStep=4`,false,path.join(outDir,'timeline-dark-long-focus-4.png'));
    console.log(`OK: Tidslinje 2–6 punkter, overview/focus/restore, bakåt, statiskt läge, motion none, reduced motion och fyra teman. Skärmbilder: ${outDir}`);
  } finally { s.close(); }
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
