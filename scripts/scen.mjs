#!/usr/bin/env node
/* Scen – kommandon för repot. Inga beroenden, bara Node 18+.
 *
 *   node scripts/scen.mjs bygg                         → dist/scen.html (hela appen i en fil)
 *   node scripts/scen.mjs exportera presentationer/x.md → dist/x.html (fristående presentation)
 *   node scripts/scen.mjs exportera-alla               → alla presentationer till dist/
 *   node scripts/scen.mjs index                        → uppdaterar presentationer/index.json och mallar/index.json
 *   node scripts/scen.mjs mallar                       → skriver docs/MALLAR.md från mallkatalogen
 *   node scripts/scen.mjs kolla                        → läser alla manus och rapporterar problem
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

// Ladda motorn och manusformatet i Node (samma kod som i webbläsaren)
globalThis.window = globalThis;
vm.runInThisContext(rd('src/engine.js'), { filename: 'engine.js' });
vm.runInThisContext(rd('src/manus.js') + '\n;globalThis.Manus = Manus;', { filename: 'manus.js' });
const { Scen, Manus } = globalThis;

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif' };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = s => s.replace(/\.md$/i, '').replace(/^.*[\\/]/, '');

function readDeck(file) {
  const text = fs.readFileSync(path.resolve(ROOT, file), 'utf8');
  const p = Manus.parse(text);
  const deck = Manus.applyMeta({ title: slug(file), theme: {}, slides: p.slides, templates: {} }, p.meta);
  deck.theme = Object.assign({ id: 'scen', accent: 'auto', look: 'auto' }, deck.theme);
  return deck;
}
function loadRepoTemplates() {
  const out = {};
  const idx = path.join(ROOT, 'mallar/index.json');
  if (!fs.existsSync(idx)) return out;
  for (const f of JSON.parse(fs.readFileSync(idx, 'utf8'))) {
    try { const t = JSON.parse(rd('mallar/' + f)); if (t.id) out[t.id] = t; } catch (e) { console.warn('Kunde inte läsa mallar/' + f); }
  }
  return out;
}
function standalone(deck) {
  const images = {}, missing = [];
  for (const s of deck.slides) {
    const k = String(s.image || '').replace(/^img:/, '');
    if (!k || images[k] || /^(data:|https?:)/.test(k)) continue;
    const f = path.join(ROOT, k);
    if (fs.existsSync(f)) images[k] = `data:${MIME[k.split('.').pop().toLowerCase()] || 'application/octet-stream'};base64,` + fs.readFileSync(f).toString('base64');
    else missing.push(k);
  }
  const tpls = loadRepoTemplates();
  deck.slides.filter(s => s.layout === 'egen').forEach(s => { if (tpls[s.tpl]) deck.templates[s.tpl] = tpls[s.tpl]; else missing.push('mall ' + s.tpl); });
  const data = { v: 3, title: deck.title, theme: deck.theme, slides: deck.slides, templates: deck.templates, images, exportedAt: new Date().toISOString() };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const fonts = Scen.fontUrl();
  const html = '<!doctype html>\n<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="generator" content="Scen">' +
    `<title>${esc(deck.title)}</title><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${fonts}">` +
    `<style id="scen-engine-css">${rd('src/engine.css')}</style><style>html,body{height:100%;margin:0;background:#000;overflow:hidden}#scen-root{position:fixed;inset:0}</style></head>` +
    `<body><div id="scen-root"></div><script type="application/json" id="scen-data">${json}</script><script id="scen-engine">${rd('src/engine.js')}</script>` +
    '<script>Scen.standalone(JSON.parse(document.getElementById("scen-data").textContent));</script></body></html>';
  return { html, missing };
}
const cmds = {
  bygg() {
    let s = rd('index.html');
    s = s.replace('<link rel="stylesheet" href="src/app.css">', () => `<style id="app-css">${rd('src/app.css')}</style>`);
    s = s.replace('<link rel="stylesheet" id="scen-engine-css" href="src/engine.css">', () => `<style id="scen-engine-css">${rd('src/engine.css')}</style>`);
    for (const f of ['engine', 'pptx', 'manus', 'app']) {
      const tag = f === 'engine' ? '<script id="scen-engine" src="src/engine.js"></script>' : `<script src="src/${f}.js"></script>`;
      const js = rd(`src/${f}.js`);
      if (/<\/script/i.test(js)) throw new Error(`src/${f}.js innehåller </script och kan inte bäddas in`);
      s = s.replace(tag, () => (f === 'engine' ? '<script id="scen-engine">' : '<script>') + js + '</script>');
    }
    wr('dist/scen.html', s);
    console.log('dist/scen.html', Math.round(s.length / 1024) + ' kB. Den här filen kan publiceras som artefakt i claude.ai.');
  },
  exportera(file) {
    if (!file) return console.error('Ange ett manus, t.ex. presentationer/kastrorelse.md');
    const { html, missing } = standalone(readDeck(file));
    const out = 'dist/' + slug(file) + '.html';
    wr(out, html);
    console.log(out, Math.round(html.length / 1024) + ' kB');
    if (missing.length) console.warn('  Saknas: ' + missing.join(', '));
  },
  'exportera-alla'() { fs.readdirSync(path.join(ROOT, 'presentationer')).filter(f => f.endsWith('.md')).forEach(f => cmds.exportera('presentationer/' + f)); },
  index() {
    const md = fs.readdirSync(path.join(ROOT, 'presentationer')).filter(f => f.endsWith('.md')).sort();
    wr('presentationer/index.json', JSON.stringify(md, null, 2) + '\n');
    const tp = fs.existsSync(path.join(ROOT, 'mallar')) ? fs.readdirSync(path.join(ROOT, 'mallar')).filter(f => f.endsWith('.json') && f !== 'index.json').sort() : [];
    wr('mallar/index.json', JSON.stringify(tp, null, 2) + '\n');
    console.log(`${md.length} presentationer, ${tp.length} egna mallar`);
  },
  mallar() {
    const cats = [...new Set(Manus.CATALOG.map(c => c.cat))];
    let out = '# Mallar\n\nGenererad av `node scripts/scen.mjs mallar` från `src/manus.js`. Ändra inte för hand.\n\n' +
      'Varje bild i ett manus börjar med mallens namn inom hakparentes. Samma katalog läser Claude när den planerar en presentation.\n\n' +
      '| Mall | Kategori | Syfte |\n|---|---|---|\n' + Manus.CATALOG.map(c => `| \`[${c.tag}]\` | ${c.cat} | ${c.syfte} |`).join('\n') + '\n';
    for (const cat of cats) {
      out += `\n## ${cat}\n`;
      for (const c of Manus.CATALOG.filter(x => x.cat === cat)) {
        out += `\n### \`[${c.tag}]\` ${c.name}\n\n${c.syfte}\n\n**Undvik när:** ${c.undvik}\n` + (c.from ? `\n*Efter Slidecraft-mallen \`${c.from}\` (MIT).*\n` : '') + '\n```\n' + c.ex + '\n```\n';
      }
    }
    const tpls = Object.values(loadRepoTemplates());
    if (tpls.length) out += '\n## Egna mallar i repot\n\n' + tpls.map(t => `- \`[egen: ${t.id}]\` **${t.name}**. ${t.desc || ''}`).join('\n') + '\n';
    out += '\n## Teman\n\n| Tema | Beskrivning |\n|---|---|\n' + Object.entries(Scen.THEMES).map(([id, t]) => `| \`${id}\` | ${t.desc} |`).join('\n') + '\n';
    wr('docs/MALLAR.md', out);
    console.log('docs/MALLAR.md', Manus.CATALOG.length, 'mallar');
  },
  kolla() {
    let bad = 0;
    for (const f of fs.readdirSync(path.join(ROOT, 'presentationer')).filter(f => f.endsWith('.md'))) {
      const d = readDeck('presentationer/' + f);
      const probs = [];
      d.slides.forEach((s, i) => {
        const k = String(s.image || '').replace(/^img:/, '');
        if (k && !/^(data:|https?:)/.test(k) && !fs.existsSync(path.join(ROOT, k))) probs.push(`bild ${i + 1}: saknar ${k}`);
        if (!s.title && !['quote', 'image', 'egen'].includes(s.layout)) probs.push(`bild ${i + 1}: ingen rubrik`);
      });
      console.log(`${probs.length ? '✗' : '✓'} ${f}: ${d.slides.length} bilder, tema ${d.theme.id}`);
      probs.forEach(p => console.log('    ' + p));
      bad += probs.length;
    }
    process.exitCode = bad ? 1 : 0;
  }
};
const [cmd, ...args] = process.argv.slice(2);
if (!cmds[cmd]) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^[\s\S]*?\*\s/, '').replace(/^ \* ?/gm, '')); process.exit(cmd ? 1 : 0); }
cmds[cmd](...args);
