const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
global.window = global;
vm.runInThisContext(read('src/engine.js'));
vm.runInThisContext(read('src/manus.js') + ';global.Manus=Manus;');

function deckFrom(text, theme = 'scen') {
  const parsed = Manus.parse(text);
  return Manus.applyMeta({ title: 'Visuell mallkontroll', theme: { id: theme }, slides: parsed.slides, templates: {} }, parsed.meta);
}

const demoText = read('demo/fem-nya-mallar.md');
const catalog = Object.fromEntries(Manus.CATALOG.map(entry => [entry.l, entry]));
const ids = ['skiften', 'prisma', 'verkningar', 'belagg', 'sammanflode'];

function sample(id) { return Manus.parseBlock(catalog[id].ex); }
function variants() {
  const out = [];
  const add = (id, kind, values) => out.push(Object.assign(sample(id), { title: kind === 'kort' ? 'Kort' : 'En avsiktligt lång rubrik som prövar typografins hierarki utan att tränga undan scenens huvudsakliga resonemang' }, values));
  add('skiften', 'kort', { items: ['Nu | Beslut | Villkoren ändras', 'Sen | Genomförande | Ett nytt arbetssätt blir möjligt'], text: 'Två tydliga skiften.' });
  add('skiften', 'lång', { items: Array.from({ length: 6 }, (_, i) => `${2000 + i * 4} | Brytpunkt ${i + 1} med längre beskrivning | Förändringen efter punkt ${i + 1} påverkar nästa fas`), text: 'Sex brytpunkter hålls samman av en övergripande förändringslinje.' });
  add('prisma', 'kort', { question: 'Vad ser vi?', items: ['A | Form | Grund A', 'B | Funktion | Grund B', 'C | Kontext | Grund C'], common: 'Samma föremål.', tension: 'Olika prioriteringar.' });
  add('prisma', 'lång', { question: 'Hur bör en komplex förändring värderas när flera grupper har legitima men delvis oförenliga behov?', items: Array.from({ length: 5 }, (_, i) => `Perspektiv ${i + 1} | Betonar en särskild aspekt ${i + 1} | Utgår från ett längre men fortfarande avgränsat resonemang`), common: 'Alla försöker skapa ett hållbart resultat över tid.', tension: 'Tid, kvalitet och ansvar vägs på olika sätt.' });
  add('verkningar', 'kort', { cause: 'Påverkan', items: ['Mekanism | Något förändras'], effect: 'Effekt', condition: '', alternative: '' });
  add('verkningar', 'lång', { cause: 'En omfattande förändring i systemets ursprungliga förutsättningar', items: ['Första mekanismen | Balansen rubbas och aktörerna får nya incitament', 'Andra mekanismen | Beteenden anpassas gradvis till de nya villkoren', 'Tredje mekanismen | Återkoppling förstärker eller bromsar utvecklingen'], effect: 'Ett nytt men villkorat jämviktsläge växer fram', condition: 'Förloppet förutsätter att andra centrala faktorer inte förändras kraftigt samtidigt.', alternative: 'En parallell utveckling kan förklara en del av samma observerade effekt.' });
  add('belagg', 'kort', { source: 'Kort källa', text: 'Ett ord förändrar tonen.', items: ['förändrar | Ett förändringsverb används | Texten signalerar rörelse'], whole: 'Ordvalet styr riktningen.', reservation: '' });
  add('belagg', 'lång', { source: 'Längre demonstrationskälla med full proveniens', text: 'När beslutet beskrivs som nödvändigt minskar utrymmet för alternativ, men formuleringen öppnar samtidigt för fortsatt prövning och gemensamt ansvar.', items: ['beskrivs som nödvändigt | Modaliteten begränsar alternativen | Avsändaren stärker kravet', 'öppnar samtidigt | En kontrast markeras | Texten undviker en helt sluten position', 'gemensamt ansvar | Ansvaret fördelas kollektivt | Läsaren görs delaktig i lösningen'], whole: 'Texten kombinerar krav, öppenhet och kollektivt ansvar.', reservation: 'Analysen gäller formuleringen och avgör inte om argumentet är sakligt korrekt.' });
  add('sammanflode', 'kort', { items: ['A | Bidrar med ett krav', 'B | Bidrar med ett annat', 'C | Bidrar med en gräns'], common: 'En gemensam riktning.', tension: 'En kvarvarande konflikt.', synthesis: 'En ny slutsats.' });
  add('sammanflode', 'lång', { items: Array.from({ length: 5 }, (_, i) => `Bidrag ${i + 1} | Tillför ett tydligt men relativt långt underlag till den samlade bedömningen`), common: 'Samtliga bidrag pekar mot behovet av en lösning som är begriplig, genomförbar och hållbar.', tension: 'Det går inte att samtidigt maximera snabbhet, omfattning och långsiktig kvalitet.', synthesis: 'Prioritera den minsta hållbara lösningen, gör avvägningen synlig och planera nästa beslutspunkt redan från början.' });
  return out;
}

function htmlFor(deck, target, step, staticMode) {
  const data = Scen.exportData(deck, {}, false);
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const engine = read('src/engine.js').replace(/<\/script/gi, '<\\/script');
  const css = read('src/engine.css');
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><style>${css}</style><style>html,body{width:100%;height:100%;margin:0;background:#000;overflow:hidden}#scen-root{position:fixed;inset:0}</style></head><body><div id="scen-root"></div><script>window.__qaErrors=[];addEventListener('error',e=>__qaErrors.push(String(e.error||e.message)));addEventListener('unhandledrejection',e=>__qaErrors.push(String(e.reason)));</script><script>${engine}</script><script>const deck=${json};const target=${target},wanted=${step},staticMode=${staticMode ? 'true' : 'false'};const root=document.getElementById('scen-root');if(staticMode)root.appendChild(Scen.thumb(deck.slides[target],deck,{},target));else Scen.standalone(deck);let tries=0;function probe(){const active=document.querySelector('.slide.active'),index=active?Number(active.dataset.i):-1,total=active?active.querySelectorAll('[data-step]').length:0,shown=active?active.querySelectorAll('[data-step].in').length:0;if(active&&index===target&&(staticMode||shown>=Math.min(wanted,total))){const sr=active.getBoundingClientRect();const visible=el=>{for(let n=el;n&&n!==active.parentElement;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.05)return false;}return true};const els=[...active.querySelectorAll('h1,h2,h3,p,blockquote')].filter(el=>{const r=el.getBoundingClientRect();return visible(el)&&r.width>1&&r.height>1});const overflow=els.filter(el=>{const r=el.getBoundingClientRect();return r.left<sr.left-2||r.top<sr.top-2||r.right>sr.right+2||r.bottom>sr.bottom+2;}).map(el=>el.className||el.tagName);const overlaps=[];for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){if(els[i].contains(els[j])||els[j].contains(els[i]))continue;const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect(),w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(w>8&&h>8&&w*h>180)overlaps.push([String(els[i].className||els[i].tagName),String(els[j].className||els[j].tagName)]);}const graphicOverlaps=[];if(active.dataset.layout==='prisma'){const core=active.querySelector('.pr-core')?.getBoundingClientRect();active.querySelectorAll('.pr-node').forEach((node,j)=>{const r=node.getBoundingClientRect(),w=core?Math.min(r.right,core.right)-Math.max(r.left,core.left):0,h=core?Math.min(r.bottom,core.bottom)-Math.max(r.top,core.top):0;if(w>8&&h>8)graphicOverlaps.push('pr-node-'+j)})}const semantic=[];if(active.dataset.bodyMotion==='none'){const moving=[...active.querySelectorAll('[data-step],.sk-fill,.sk-dot,.pr-ray,.pr-core,.vk-flow,.vk-node,.bl-mark,.bl-link,.sf-stream')].filter(el=>getComputedStyle(el).transitionDuration.split(',').some(v=>parseFloat(v)>0));if(moving.length)semantic.push('rörelse: ingen lämnar CSS-övergångar')}if(staticMode){const fill=active.querySelector('.sk-fill,.vk-flow');if(fill&&fill.getBoundingClientRect().width<100)semantic.push('ofullständig statisk progressionslinje');if(active.querySelectorAll('[data-step]:not(.in)').length)semantic.push('dolda statiska steg')}const result={errors:__qaErrors,index,layout:active.dataset.layout,total,shown,staticMode,overflow,overlaps,graphicOverlaps,semantic,scroll:[active.scrollWidth,active.clientWidth,active.scrollHeight,active.clientHeight]};document.documentElement.dataset.qa=btoa(unescape(encodeURIComponent(JSON.stringify(result))));return;}if(++tries>180){document.documentElement.dataset.qa=btoa(JSON.stringify({errors:['timeout'],index,total,shown}));return;}dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));setTimeout(probe,35)}setTimeout(probe,120);</script></body></html>`;
}

function startServer() {
  const variantSlides = variants();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/qa.html') return res.writeHead(404).end('Not found');
    const mode = url.searchParams.get('mode') || 'demo';
    const theme = url.searchParams.get('theme') || 'scen';
    const baseDeck = mode === 'variants' ? { title: 'Varianter', theme: { id: theme }, slides: variantSlides, templates: {} } : deckFrom(demoText, theme);
    const deck = url.searchParams.get('motion') === 'none' ? { ...baseDeck, slides: baseDeck.slides.map(slide => ({ ...slide, ba: 'none' })) } : baseDeck;
    const target = Number(url.searchParams.get('slide') || 0);
    const step = Number(url.searchParams.get('step') || 999);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlFor(deck, target, step, url.searchParams.get('static') === '1'));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function findBrowser() {
  const candidates = [process.env.SCEN_CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
  for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
  throw new Error('Ingen Chrome eller Edge hittades.');
}

function runBrowser(browser, url, screenshot) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'scen-template-qa-'));
  return new Promise((resolve, reject) => {
    const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--force-device-scale-factor=1', '--virtual-time-budget=2500', '--dump-dom'];
    if (screenshot) args.push(`--screenshot=${screenshot}`);
    args.push(url);
    const child = spawn(browser, args, { windowsHide: true });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      fs.rmSync(profile, { recursive: true, force: true });
      if (code !== 0) return reject(new Error(`Browser exit ${code}: ${stderr}`));
      const match = stdout.match(/data-qa="([^"]+)"/);
      if (!match) return reject(new Error('Visuell testprob saknas.'));
      resolve(JSON.parse(Buffer.from(match[1], 'base64').toString('utf8')));
    });
  });
}

async function main() {
  const server = await startServer();
  const browser = findBrowser();
  const port = server.address().port;
  const outDir = process.env.SCEN_QA_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'scen-template-shots-'));
  fs.mkdirSync(outDir, { recursive: true });
  const failures = [];
  try {
    const demo = deckFrom(demoText);
    for (let slide = 0; slide < demo.slides.length; slide++) {
      const rendered = Scen.renderSlide(demo.slides[slide], slide, demo, x => x);
      const total = [...rendered.matchAll(/data-step="(\d+)"/g)].length;
      for (let step = 0; step <= total; step++) {
        const shot = path.join(outDir, `${String(slide + 1).padStart(2, '0')}-${ids[slide]}-${String(step).padStart(2, '0')}.png`);
        const result = await runBrowser(browser, `http://127.0.0.1:${port}/qa.html?mode=demo&slide=${slide}&step=${step}&theme=atlas`, shot);
        if (result.errors.length || result.overflow.length || result.overlaps.length || result.graphicOverlaps.length || result.semantic.length || result.scroll[0] > result.scroll[1] || result.scroll[2] > result.scroll[3]) failures.push({ mode: 'demo', slide, step, result });
      }
      const noMotion = await runBrowser(browser, `http://127.0.0.1:${port}/qa.html?mode=demo&slide=${slide}&step=1&theme=atlas&motion=none`, null);
      if (noMotion.errors.length || noMotion.semantic.length) failures.push({ mode: 'motion-none', slide, result: noMotion });
    }
    const variantSlides = variants(), themes = ['scen', 'bana', 'natt', 'kritvit'];
    for (let slide = 0; slide < variantSlides.length; slide++) {
      const theme = themes[slide % themes.length];
      const shot = path.join(outDir, `variant-${String(slide + 1).padStart(2, '0')}-${variantSlides[slide].layout}-${theme}.png`);
      const result = await runBrowser(browser, `http://127.0.0.1:${port}/qa.html?mode=variants&slide=${slide}&step=999&theme=${theme}&static=1`, shot);
      if (result.errors.length || result.overflow.length || result.overlaps.length || result.graphicOverlaps.length || result.semantic.length || result.scroll[0] > result.scroll[1] || result.scroll[2] > result.scroll[3]) failures.push({ mode: 'variant', slide, theme, result });
    }
    assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
    console.log(`OK: ${ids.length} mallar granskade stegvis; kort/långt innehåll, min/max-objekt och fyra teman. Skärmbilder: ${outDir}`);
  } finally {
    server.close();
  }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
