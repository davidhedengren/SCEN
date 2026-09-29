(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const rid = () => Math.random().toString(36).slice(2, 10);
const esc = Scen.esc;
const now = () => Date.now();
const clone = o => JSON.parse(JSON.stringify(o));
const IMG = Object.assign({}, window.SCEN_IMAGES || {});
let decks = [], deck = null, cur = 0, pv = null, presenter = null, dl = null, SAMPLER = null, myTpls = [];

/* =================== lagring =================== */
const Store = {
  mode: 'memory', db: null, uid: null, mem: { decks: {}, imgs: {} },
  async init() {
    const c = window.claude;
    if (c && typeof c.use === 'function') {
      try {
        const got = await Promise.race([
          Promise.all([c.use('db'), c.use('user'), c.use('downloads'), c.use('sample')]),
          new Promise(r => setTimeout(() => r(null), 6000))
        ]);
        if (got) {
          const [db, user, downloads, sample] = got;
          dl = downloads || null; SAMPLER = sample || null;
          if (db && user) {
            const uid = await user.id();
            if (uid) { this.db = db; this.uid = uid; this.mode = 'cloud'; return; }
          }
        }
      } catch (e) { /* faller tillbaka */ }
    }
    try { localStorage.setItem('scen:test', '1'); localStorage.removeItem('scen:test'); this.mode = 'local'; } catch (e) { this.mode = 'memory'; }
  },
  col() { return this.db.collection('data/users/' + this.uid); },
  imgCol(deckId) { return this.db.doc('data/users/' + this.uid + '/' + deckId).collection('img'); },
  async list() {
    if (this.mode === 'cloud') { const s = await this.col().get(); return s.docs.map(d => d.data()).filter(d => d && d.slides); }
    if (this.mode === 'local') {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('scen:deck:')) { try { out.push(JSON.parse(localStorage.getItem(k))); } catch (e) {} } }
      return out;
    }
    return Object.values(this.mem.decks).map(clone);
  },
  async listTemplates() {
    if (this.mode === 'cloud') { const s = await this.col().get(); return s.docs.map(d => d.data()).filter(d => d && d.kind === 'template'); }
    if (this.mode === 'local') {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('scen:tpl:')) { try { out.push(JSON.parse(localStorage.getItem(k))); } catch (e) {} } }
      return out;
    }
    return Object.values(this.mem.tpls || {}).map(clone);
  },
  async saveTemplate(t) {
    const body = clone(t); body.kind = 'template';
    if (this.mode === 'cloud') return this.col().doc(t.id).set(body);
    if (this.mode === 'local') { try { localStorage.setItem('scen:tpl:' + t.id, JSON.stringify(body)); } catch (e) { throw { code: 'quota', message: 'Webbläsarens lagring är full.' }; } return; }
    (this.mem.tpls = this.mem.tpls || {})[t.id] = body;
  },
  async removeTemplate(id) {
    if (this.mode === 'cloud') return this.col().doc(id).delete();
    if (this.mode === 'local') { try { localStorage.removeItem('scen:tpl:' + id); } catch (e) {} return; }
    if (this.mem.tpls) delete this.mem.tpls[id];
  },
  async save(d) {
    const body = JSON.parse(JSON.stringify(d));
    const size = JSON.stringify(body).length;
    if (size > 250000) throw { code: 'too_big', message: 'Presentationen har för mycket text för att sparas i ett stycke. Dela upp den i två.' };
    if (this.mode === 'cloud') {
      try { await this.col().doc(d.id).set(body); }
      catch (e) { if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 600 + Math.random() * 600)); await this.col().doc(d.id).set(body); } else throw e; }
      return;
    }
    if (this.mode === 'local') { try { localStorage.setItem('scen:deck:' + d.id, JSON.stringify(body)); } catch (e) { throw { code: 'quota', message: 'Webbläsarens lagring är full. Spara presentationen på datorn.' }; } return; }
    this.mem.decks[d.id] = body;
  },
  async saveImage(deckId, id, url) {
    if (this.mode === 'cloud') return this.imgCol(deckId).doc(id).set({ d: url, at: now() });
    if (this.mode === 'local') { try { localStorage.setItem('scen:img:' + deckId + ':' + id, url); } catch (e) { throw { code: 'quota', message: 'Webbläsarens lagring är full. Bilden kunde inte sparas.' }; } return; }
    this.mem.imgs[deckId + ':' + id] = url;
  },
  async loadImages(deckId) {
    const out = {};
    if (this.mode === 'cloud') { const s = await this.imgCol(deckId).get(); s.docs.forEach(d => { const v = d.data(); if (v && v.d) out[d.id] = v.d; }); return out; }
    if (this.mode === 'local') {
      const p = 'scen:img:' + deckId + ':';
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(p)) out[k.slice(p.length)] = localStorage.getItem(k); }
      return out;
    }
    Object.keys(this.mem.imgs).forEach(k => { if (k.startsWith(deckId + ':')) out[k.slice(deckId.length + 1)] = this.mem.imgs[k]; });
    return out;
  },
  async deleteImage(deckId, id) {
    if (this.mode === 'cloud') return this.imgCol(deckId).doc(id).delete();
    if (this.mode === 'local') { try { localStorage.removeItem('scen:img:' + deckId + ':' + id); } catch (e) {} return; }
    delete this.mem.imgs[deckId + ':' + id];
  },
  async remove(deckId) {
    const imgs = await this.loadImages(deckId);
    for (const id of Object.keys(imgs)) await this.deleteImage(deckId, id);
    if (this.mode === 'cloud') return this.col().doc(deckId).delete();
    if (this.mode === 'local') { try { localStorage.removeItem('scen:deck:' + deckId); } catch (e) {} return; }
    delete this.mem.decks[deckId];
  }
};
const errMsg = e => (e && e.message) || 'Något gick fel.';

/* =================== exempel =================== */
const PARABEL = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" font-family="Georgia,serif" font-style="italic" font-size="34">
<defs><marker id="h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#C47300"/></marker>
<marker id="g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7C879C"/></marker></defs>
<line x1="40" y1="560" x2="960" y2="560" stroke="#7C879C" stroke-width="3" stroke-dasharray="10 12"/>
<path d="M80 560Q470-140 860 560" fill="none" stroke="#2F5BF5" stroke-width="7" stroke-linecap="round"/>
<g stroke="#7C879C" stroke-width="4" marker-end="url(#g)"><line x1="80" y1="560" x2="196" y2="560"/><line x1="80" y1="560" x2="80" y2="351"/><line x1="470" y1="210" x2="586" y2="210"/><line x1="704" y1="336" x2="820" y2="336"/><line x1="704" y1="336" x2="704" y2="459"/></g>
<g stroke="#C47300" stroke-width="6" marker-end="url(#h)"><line x1="80" y1="560" x2="194" y2="353"/><line x1="704" y1="336" x2="818" y2="457"/></g>
<circle cx="80" cy="560" r="9" fill="#2F5BF5"/><circle cx="470" cy="210" r="9" fill="#2F5BF5"/><circle cx="704" cy="336" r="9" fill="#2F5BF5"/>
<g fill="#7C879C"><text x="206" y="552">v<tspan font-size="22" dy="8">x</tspan></text><text x="30" y="360">v<tspan font-size="22" dy="8">y</tspan></text><text x="596" y="200">v<tspan font-size="22" dy="8">x</tspan></text><text x="830" y="330">v<tspan font-size="22" dy="8">x</tspan></text></g>
<text x="190" y="330" fill="#C47300">v</text><text x="826" y="490" fill="#C47300">v</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
})();
IMG['ex-parabel'] = PARABEL;
const SAMPLE = {
  id: 'exempel', title: 'Kaströrelse', sample: true, theme: { accent: 'blue', look: 'auto' }, updatedAt: 0,
  slides: [
    { id: 's1', layout: 'title', title: 'Kaströrelse', text: 'Två rörelser på en gång: jämn fart framåt och fritt fall nedåt.', caption: 'Fysik 1 · Exempel från Scen', bg: 'nodes', notes: 'Rubriken glider till nästa bild med morph eftersom båda bilderna har samma rubrik.' },
    { id: 's2', layout: 'split', title: 'Kaströrelse', bullets: ['I x-led är hastigheten konstant: v_{x} = v_{0x}', 'I y-led verkar tyngdaccelerationen g nedåt', 'Tillsammans blir banan en **parabel**'], image: 'img:ex-parabel', steps: true, dim: true, notes: 'Fråga klassen först: vad händer med farten i x-led i banans topp?' },
    { id: 's3', layout: 'number', title: 'Tyngdacceleration nära jordytan', number: '9,82', text: 'm/s² för alla föremål, om luftmotståndet kan försummas', bg: 'waves', transition: 'rise' },
    { id: 's4', layout: 'question', title: 'Två kulor släpps från samma höjd. Den ena faller rakt ner, den andra skjuts iväg vågrätt. Vilken landar först?', bullets: ['Kulan som faller rakt ner', 'Kulan som skjuts iväg', 'De landar samtidigt'], answer: 'De landar samtidigt. Farten i x-led påverkar inte rörelsen i y-led.', notes: 'Låt eleverna rösta med fingrarna innan du visar svaret.', transition: 'fade' },
    { id: 's5', layout: 'compare', title: 'Två rörelser, två uppsättningar formler', lt: 'x-led', lb: ['a = 0', 'v_{x} = v_{0x}', 'x = v_{0x}·t'], rt: 'y-led', rb: ['a = −g', 'v_{y} = v_{0y} − g·t', 'y = v_{0y}·t − g·t^{2}/2'], steps: true, transition: 'push' },
    { id: 's6', layout: 'table', title: 'Vågrätt kast från 20 m höjd, v_{0} = 5 m/s', table: { header: true, reveal: 'answers', rows: [['t (s)', 'x (m)', 'y (m)'], ['0', '0', '20,0'], ['0,5', '2,5', '18,8'], ['1,0', '5,0', '15,1'], ['1,5', '7,5', '9,0'], ['2,0', '10,0', '0,4']] }, notes: 'Räkna y = 20 − 4,91·t² tillsammans innan varje svar visas.', transition: 'slide' },
    { id: 's7', layout: 'timeline', title: 'Från Aristoteles till månen', items: ['ca 350 f.Kr. | Aristoteles: ett kastat föremål behöver något som hela tiden driver det framåt', '1638 | Galilei visar i Discorsi att kastbanan är en parabel', '1687 | Newtons Principia förklarar rörelsen med kraft och gravitation', '1971 | David Scott släpper en hammare och en fjäder på månen. De landar samtidigt.'], steps: true, transition: 'wipe' },
    { id: 's8', layout: 'statement', title: 'Höjden bestämmer tiden i luften. Farten framåt bestämmer hur långt det går.', bg: 'field', transition: 'zoom' }
  ]
};

/* =================== småhjälp =================== */
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2800); }
function view(name) { $('#lib').hidden = name !== 'lib'; $('#ed').hidden = name !== 'ed'; $('#tplv').hidden = name !== 'tpl'; window.scrollTo(0, 0); }
const DF = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' });
const TF = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' });
function when(t) {
  if (!t) return '';
  const d = new Date(t), n = new Date();
  if (d.toDateString() === n.toDateString()) return 'i dag ' + TF.format(d);
  return DF.format(d) + (d.getFullYear() !== n.getFullYear() ? ' ' + d.getFullYear() : '');
}
function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
function modal(html, opts) {
  const m = $('#modal');
  m.innerHTML = `<div class="dlg" role="dialog" aria-modal="true">${html}</div>`;
  m.hidden = false;
  m.onclick = e => { if (e.target === m && !(opts && opts.sticky)) closeModal(); const a = e.target.closest('[data-close]'); if (a) closeModal(); };
  const f = m.querySelector('[autofocus], button, input'); f && f.focus();
  return m.firstElementChild;
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden && !presenter) closeModal(); });
function usedImages(d) {
  const set = new Set();
  d.slides.forEach(s => Scen.imagesOf(s).forEach(src => set.add(src)));
  return [...set];
}
function normalize(d) {
  d.theme = Object.assign({ id: 'scen', look: 'auto' }, d.theme || {});
  if (!Scen.THEMES[d.theme.id]) d.theme.id = 'scen';
  if (!d.theme.accent) d.theme.accent = d.theme.id === 'scen' ? 'blue' : 'auto';
  d.slides = (d.slides || []).map(s => Object.assign({ id: rid() }, s));
  if (!d.slides.length) d.slides.push({ id: rid(), layout: 'title', title: d.title || 'Namnlös presentation', bg: 'nodes' });
  return d;
}

/* =================== bibliotek =================== */
function storeChip() {
  const c = $('#storeChip');
  const t = { cloud: 'Sparas i ditt Claude-konto', local: 'Sparas i den här webbläsaren', memory: 'Sparas inte. Använd Spara på datorn' }[Store.mode];
  c.textContent = t; c.className = 'chip ' + Store.mode;
  c.title = { cloud: 'Bara du ser dina presentationer. De finns kvar när du öppnar Scen igen, på alla dina enheter.', local: 'Presentationerna finns bara i den här webbläsaren på den här datorn.', memory: 'Den här vyn kan inte spara. Ladda ner presentationen innan du stänger.' }[Store.mode];
}
let repoDecks = null, missingRepo = [], staleCode = false;
/* Webbläsaren får spara motorn i några minuter, men manusen hämtas alltid färska. Direkt efter en
   uppdatering kan ett manus alltså använda en mall som den sparade motorn inte känner till. */
function usesUnknownTemplates(txt, slides) {
  const tags = [...String(txt).matchAll(/^\s*\[([^\]\n:]+)(?::[^\]\n]*)?\]\s*$/gm)].map(m => m[1].trim().toLowerCase());
  return tags.some(t => !(t in Manus.TAGS)) || slides.some(s => s.layout && !Scen.LAYOUTS[s.layout]);
}
/* Hämtar programfilerna på nytt och laddar om sidan, högst en gång per minut. */
async function refreshCode() {
  try {
    const last = +sessionStorage.getItem('scen-uppdaterad') || 0;
    if (Date.now() - last < 60000) return false;
    sessionStorage.setItem('scen-uppdaterad', String(Date.now()));
  } catch (e) { return false; }
  await Promise.all(['index.html', 'src/engine.js', 'src/engine.css', 'src/manus.js', 'src/app.js', 'src/app.css', 'src/pptx.js'].map(f => fetch(f, { cache: 'reload' }).catch(() => {})));
  location.reload();
  return true;
}
async function loadRepoDecks() {
  if (repoDecks) return repoDecks;
  repoDecks = [];
  const baked = Array.isArray(window.SCEN_REPO) ? window.SCEN_REPO : null;
  try {
    let list = baked ? baked.map(x => x.fil) : null;
    if (!list) {
      const r = await fetch('presentationer/index.json', { cache: 'no-cache' });
      if (!r.ok) return repoDecks;
      list = await r.json();
    }
    for (const item of list) {
      const file = typeof item === 'string' ? item : item.fil;
      try {
        let txt;
        if (baked) txt = baked.find(x => x.fil === file).text;
        else {
          const res = await fetch('presentationer/' + file, { cache: 'no-cache' });
          txt = res.ok ? await res.text() : '';
          if (!res.ok || /^\s*<!doctype html/i.test(txt) || !/\[[^\]\n]+\]/.test(txt)) { missingRepo.push(file); continue; }
        }
        const p = Manus.parse(txt);
        if (!baked && usesUnknownTemplates(txt, p.slides)) staleCode = true;
        const d = normalize(Manus.applyMeta({ id: 'repo-' + file.replace(/\W+/g, '-'), title: file, slides: p.slides, repo: true, file, templates: {} }, p.meta));
        repoDecks.push(d);
      } catch (e) { /* hoppa över trasig fil */ }
    }
  } catch (e) { /* inte ett repo, t.ex. i claude.ai */ }
  if (staleCode && !(await refreshCode())) toast('Presentationerna använder mallar som inte har laddats än. Ladda om sidan med Ctrl+F5.');
  if (missingRepo.length) setTimeout(() => modal(`<h2>${plural(missingRepo.length, 'manus', 'manus')} gick inte att läsa</h2>
    <p>Scen hittar ${missingRepo.map(f => '<code>' + esc(f) + '</code>').join(', ')} i <code>presentationer/index.json</code>, men får inte tillbaka själva filen.</p>
    <p><b>På GitHub Pages beror det nästan alltid på att filen <code>.nojekyll</code> saknas.</b> Utan den gör GitHub om manusen till webbsidor. Lägg till den i repots översta mapp: <b>Add file → Create new file</b>, döp den till <code>.nojekyll</code>, lämna den tom och klicka <b>Commit changes</b>. Vänta en minut och ladda om sidan.</p>
    <p class="muted">Kontrollera också att filnamnet i index.json är exakt detsamma som filens namn, med små och stora bokstäver.</p>
    <div class="acts"><button class="btn primary" data-close>Okej</button></div>`), 300);
  return repoDecks;
}
async function showLibrary() {
  if (pv) { pv.destroy(); pv = null; }
  deck = null;
  view('lib');
  await loadRepoDecks();
  try { decks = await Store.list(); } catch (e) { decks = []; toast('Kunde inte hämta biblioteket: ' + errMsg(e)); }
  decks.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  renderGrid();
}
function renderGrid() {
  const g = $('#grid'); g.innerHTML = '';
  const entries = decks.map(d => [d, false]).concat(repoDecks && repoDecks.length ? repoDecks.map(d => [d, true]) : [[SAMPLE, true]]);
  const courses = [...new Set(entries.map(([d]) => (d.course || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'sv'));
  const groups = courses.length ? courses.concat('') : [''];
  groups.forEach(course => {
    const members = entries.filter(([d]) => (d.course || '').trim() === course);
    if (!members.length) return;
    if (courses.length) { const h = document.createElement('h2'); h.className = 'grid-group'; h.textContent = course || 'Övrigt'; g.appendChild(h); }
    members.forEach(([d, sample]) => g.appendChild(card(d, sample)));
  });
  const nb = document.createElement('button'); nb.type = 'button'; nb.className = 'empty-new'; nb.textContent = '+ Ny presentation';
  nb.onclick = newDeck;
  const wrap = document.createElement('div'); wrap.className = 'card'; wrap.appendChild(nb);
  g.appendChild(wrap);
  $('#libSub').textContent = decks.length ? plural(decks.length, 'presentation', 'presentationer') + '. Klicka på en för att redigera.' : 'Inga egna presentationer än. Börja med en ny, importera en PowerPoint eller spela exemplet.';
}
function card(d, sample) {
  const el = document.createElement('article'); el.className = 'card';
  const th = document.createElement('button'); th.type = 'button'; th.className = 'card-thumb';
  th.setAttribute('aria-label', (sample ? 'Spela exemplet ' : 'Redigera ') + d.title);
  th.appendChild(Scen.thumb(d.slides[0] || { layout: 'title', title: d.title }, d, IMG, 0));
  th.onclick = () => sample ? play(d, 0) : openDeck(d.id);
  el.appendChild(th);
  const h = document.createElement('h3'); h.textContent = d.title || 'Namnlös presentation'; el.appendChild(h);
  const meta = document.createElement('div'); meta.className = 'meta';
  meta.innerHTML = (sample ? `<span class="tag">${d.repo ? 'I repot' : 'Exempel'}</span>` : '') + `<span>${plural(d.slides.length, 'bild', 'bilder')}${d.updatedAt ? ' · ändrad ' + esc(when(d.updatedAt)) : ''}</span>`;
  el.appendChild(meta);
  const acts = document.createElement('div'); acts.className = 'acts';
  const B = (label, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small ' + (cls || ''); b.textContent = label; b.onclick = fn; acts.appendChild(b); return b; };
  if (sample) {
    B('Spela', () => play(d, 0));
    if (d.repo) B('Spara på datorn', () => exportDeck(d));
    B('Gör en egen kopia', () => duplicate(d, true));
  } else {
    B('Spela', async () => { const imgs = await safeImages(d.id); Object.assign(IMG, imgs); play(d, 0); });
    B('Spara på datorn', () => exportDeck(d));
    B('Duplicera', () => duplicate(d));
    B('Ta bort', () => {
      acts.hidden = true;
      const c = document.createElement('div'); c.className = 'confirm';
      c.innerHTML = `<span>Ta bort för gott?</span>`;
      const yes = document.createElement('button'); yes.type = 'button'; yes.className = 'btn small danger solid'; yes.textContent = 'Ta bort';
      const no = document.createElement('button'); no.type = 'button'; no.className = 'btn small'; no.textContent = 'Avbryt';
      no.onclick = () => { c.remove(); acts.hidden = false; };
      yes.onclick = async () => {
        yes.disabled = true; yes.textContent = 'Tar bort…';
        try { await Store.remove(d.id); decks = decks.filter(x => x.id !== d.id); renderGrid(); toast(`”${d.title}” är borttagen.`); }
        catch (e) { toast('Kunde inte ta bort: ' + errMsg(e)); c.remove(); acts.hidden = false; }
      };
      c.append(yes, no); el.appendChild(c); no.focus();
    }, 'danger');
  }
  el.appendChild(acts);
  return el;
}
async function safeImages(id) { try { return await Store.loadImages(id); } catch (e) { toast('Bilderna kunde inte hämtas: ' + errMsg(e)); return {}; } }
async function duplicate(src, fromSample) {
  const d = clone(src); delete d.sample;
  d.id = rid(); d.title = fromSample ? src.title : src.title + ' (kopia)'; d.createdAt = d.updatedAt = now();
  delete d.repo; delete d.file;
  const imgs = src.repo ? {} : fromSample ? { 'ex-parabel': PARABEL } : await safeImages(src.id);
  try {
    for (const [k, v] of Object.entries(imgs)) await Store.saveImage(d.id, k, v);
    await Store.save(d);
    Object.assign(IMG, imgs);
    decks.unshift(d); renderGrid();
    toast(src.repo ? 'Kopian är sparad i den här webbläsaren. Spara manus (.md) för att lägga tillbaka ändringar i repot.' : fromSample ? 'Exemplet finns nu bland dina presentationer.' : 'Kopian är sparad.');
    if (fromSample) openDeck(d.id);
  } catch (e) { toast('Kunde inte spara kopian: ' + errMsg(e)); }
}
async function newDeck() {
  const d = normalize({ id: rid(), title: 'Namnlös presentation', createdAt: now(), updatedAt: now(), slides: [{ id: rid(), layout: 'title', title: 'Namnlös presentation', text: '', bg: 'nodes' }] });
  try { await Store.save(d); } catch (e) { toast(errMsg(e)); }
  decks.unshift(d);
  deck = clone(d); cur = 0; showEditor();
  const t = $('#deckTitle'); t.focus(); t.select();
}
async function openDeck(id) {
  const d = decks.find(x => x.id === id); if (!d) return;
  Object.assign(IMG, await safeImages(id));
  deck = normalize(clone(d)); cur = 0; showEditor();
}

/* =================== uppspelning =================== */
function play(d, start) {
  const host = $('#present'); host.hidden = false;
  if (presenter) presenter.destroy();
  presenter = Scen.player(host, d, {
    mode: 'present', images: IMG, start: start || 0,
    onExit(i) {
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      presenter.destroy(); presenter = null; host.hidden = true;
      if (deck && d === deck) select(i);
    }
  });
  try { host.requestFullscreen && host.requestFullscreen().catch(() => {}); } catch (e) {}
}

/* =================== spara på datorn =================== */
const isPath = k => /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(k) && !/^(data:|blob:)/.test(k);
async function toDataUrl(url) {
  const b = await (await fetch(url)).blob();
  return await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
}
async function engineSources() {
  let css = ($('#scen-engine-css') || {}).textContent || '', js = ($('#scen-engine') || {}).textContent || '';
  if (!css.trim()) css = await (await fetch('src/engine.css')).text();
  if (!js.trim()) js = await (await fetch('src/engine.js')).text();
  return { css, js };
}
async function standaloneHtml(d, student = false) {
  const images = {};
  usedImages(d).forEach(id => { if (IMG[id]) images[id] = IMG[id]; });
  for (const k of usedImages(d)) {
    if (k && !images[k] && isPath(k)) { try { images[k] = await toDataUrl(k); } catch (e) { /* bilden saknas */ } }
  }
  const { css, js } = await engineSources();
  const data = Scen.exportData(d, images, student);
  const fonts = Scen.fontUrl();
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return '<!doctype html>\n<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="generator" content="Scen 2">' +
    `<title>${esc(d.title)}</title>` + (fonts ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${fonts}">` : '') + `<style id="scen-engine-css">${css}</style><style>html,body{height:100%;margin:0;background:#000;overflow:hidden}#scen-root{position:fixed;inset:0}</style></head>` +
    '<body><div id="scen-root"></div><script type="application/json" id="scen-data">' + json + '<' + '/script><script id="scen-engine">' + js + '<' + '/script>' +
    '<script>Scen.standalone(JSON.parse(document.getElementById("scen-data").textContent));<' + '/script></body></html>';
}
function fileName(t, ext) { return (String(t || 'presentation').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'presentation') + (ext || '.html'); }
async function saveFile(filename, blob) {
  if (dl) return dl.save({ filename, data: blob });
  if (window.claude) throw { code: 'unavailable', message: 'Den här vyn kan inte spara filer. Öppna Scen i claude.ai i en webbläsare.' };
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
  return { status: 'saved' };
}
function exportDeck(d) {
  const box = modal(`<h2>Spara på datorn</h2>
    <div class="exp-grid">
      <button type="button" class="exp" id="expStudent"><strong>Elevversion (.html)</strong><span>Fristående uppspelning med alla animationer. Inga redigeringsverktyg, talaranteckningar eller talarvy. Dela filen med eleverna.</span></button>
      <button type="button" class="exp" id="expHtml"><strong>Lärarversion (.html)</strong><span>En fil som spelas upp i alla webbläsare, även utan internet. Talarvy på P. Kan importeras igen.</span></button>
      <button type="button" class="exp" id="expMd"><strong>Manus (.md)</strong><span>Presentationen som text. Lägg den i mappen presentationer i ditt repo, eller ge den till Claude att bygga vidare på.</span></button>
    </div><div class="acts"><button class="btn" data-close>Avbryt</button></div>`);
  $('#expStudent').onclick = () => { closeModal(); exportAs(d, 'student'); };
  $('#expHtml').onclick = () => { closeModal(); exportAs(d, 'html'); };
  $('#expMd').onclick = () => { closeModal(); exportAs(d, 'md'); };
}
async function exportAs(d, kind) {
  if (!deck || d.id !== deck.id) Object.assign(IMG, await safeImages(d.id));
  try {
    if (kind === 'md') await saveFile(fileName(d.title, '.md'), new Blob([Manus.stringify(d)], { type: 'text/markdown' }));
    else await saveFile(fileName(d.title + (kind === 'student' ? ' – elevversion' : '')), new Blob([await standaloneHtml(d, kind === 'student')], { type: 'text/html' }));
    toast(kind === 'student' ? 'Elevversionen är sparad. Dela HTML-filen med eleverna.' : kind === 'md' ? 'Manuset är sparat.' : 'Sparad. Öppna filen i valfri webbläsare, eller importera den här för att redigera vidare.');
  } catch (e) {
    const c = e && e.code;
    if (c === 'declined') return;
    if (c === 'rate_limited') toast('En sparning väntar redan på svar.');
    else toast('Kunde inte spara filen: ' + errMsg(e));
  }
}

/* =================== import =================== */
function pickFile() { const f = $('#file'); f.value = ''; f.click(); }
async function handleFile(file) {
  if (!file) return;
  const name = file.name || '';
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'ppt') { modal(`<h2>Gamla .ppt-filer går inte att läsa</h2><p>Öppna filen i PowerPoint eller Keynote och spara den som <b>.pptx</b>, importera sedan den nya filen.</p><div class="acts"><button class="btn primary" data-close>Okej</button></div>`); return; }
  if (!['pptx', 'html', 'htm', 'json', 'md', 'txt'].includes(ext)) { toast('Scen kan importera .pptx, manus (.md) och sparade Scen-filer (.html).'); return; }
  const box = modal(`<h2>Importerar ${esc(name)}</h2><p class="muted" id="impMsg">Läser filen…</p><div class="bar"><i id="impBar"></i></div>`, { sticky: true });
  const msg = t => { const m = $('#impMsg'); if (m) m.textContent = t; };
  const bar = p => { const b = $('#impBar'); if (b) b.style.width = Math.round(p * 100) + '%'; };
  try {
    let d, imgs, report = null;
    if (ext === 'pptx') {
      const r = await PptxImport.run(file, (i, n) => { msg(`Läser bild ${i} av ${n}…`); bar(i / n * .8); });
      d = r.deck; imgs = r.images; report = r.report;
    } else {
      const txt = await file.text();
      let data;
      if (ext === 'md' || ext === 'txt') { const p = Manus.parse(txt); data = Manus.applyMeta({ title: name.replace(/\.(md|txt)$/i, ''), slides: p.slides }, p.meta); }
      else if (ext === 'json') data = JSON.parse(txt);
      else {
        const m = txt.match(/<script[^>]*id="scen-data"[^>]*>([\s\S]*?)<\/script>/i);
        if (!m) throw new Error('Filen är inte en presentation som sparats från Scen.');
        data = JSON.parse(m[1]);
      }
      d = { title: data.title, theme: data.theme, slides: data.slides, templates: data.templates || {} }; imgs = data.images || {};
    }
    d = normalize(Object.assign(d, { id: rid(), createdAt: now(), updatedAt: now() }));
    const keys = Object.keys(imgs);
    for (let i = 0; i < keys.length; i++) {
      msg(`Sparar bilder ${i + 1} av ${keys.length}…`); bar(.8 + .2 * (i + 1) / keys.length);
      await Store.saveImage(d.id, keys[i], imgs[keys[i]]);
      IMG[keys[i]] = imgs[keys[i]];
    }
    await Store.save(d);
    bar(1);
    decks.unshift(d); if (!deck) renderGrid();
    const li = [];
    if (report) {
      li.push(`<li>${plural(report.slides, 'bild', 'bilder')} importerade${report.merged ? `, varav ${plural(report.merged, 'uppbyggnad', 'uppbyggnader')} sammanslagna till klicksteg` : ''}.</li>`);
      if (report.images) li.push(`<li>${plural(report.images, 'bild', 'bilder')} komprimerade och sparade.</li>`);
      li.push(`<li>Layout, övergångar och animationer är valda automatiskt. Rubriker som återkommer glider mellan bilderna med morph.</li>`);
      if (report.skippedImages.length) li.push(`<li class="w">${plural(report.skippedImages.length, 'bild', 'bilder')} i ett format webbläsaren inte kan visa (t.ex. EMF) hoppades över.</li>`);
      if (report.charts) li.push(`<li class="w">${plural(report.charts, 'diagram', 'diagram')} kunde inte följa med. Lägg in dem som bild i stället.</li>`);
      if (report.hidden) li.push(`<li class="w">${plural(report.hidden, 'dold bild', 'dolda bilder')} hoppades över.</li>`);
    } else li.push(`<li>${plural(d.slides.length, 'bild', 'bilder')} importerade.</li>`);
    box.innerHTML = `<h2>${esc(d.title)} är importerad</h2><ul class="report">${li.join('')}</ul><div class="acts"><button class="btn" data-close>Stäng</button><button class="btn primary" id="impOpen">Öppna och redigera</button></div>`;
    $('#impOpen').onclick = () => { closeModal(); openDeck(d.id); };
    $('#impOpen').focus();
  } catch (e) {
    console.error(e);
    box.innerHTML = `<h2>Importen misslyckades</h2><p>${esc(errMsg(e))}</p><div class="acts"><button class="btn primary" data-close>Okej</button></div>`;
  }
}

/* =================== redigerare =================== */
const FIELDS = {etapper:[["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "Högst 4 rader: rubrik | text", "list"]],vagval:[["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "Högst 4 rader: kriterium | vänster | höger", "list"], ["lt", "Vänster alternativ", "text"], ["rt", "Höger alternativ", "text"]],lager:[["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "Högst 3 rader: rubrik | text", "list"]],resonemang:[["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "Högst 3 rader: rubrik | text", "list"], ["text", "Slutsats", "area"]],helhet:[["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "Högst 4 rader: rubrik | text", "list"]],
skiften: [["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["start", "Utgångsläge", "text"], ["end", "Slutläge", "text"], ["items", "3–6 brytpunkter: tid | händelse | förändring (förändring krävs)", "list"], ["text", "Övergripande slutsats", "area"]],
prisma: [["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["question", "Gemensam fråga", "area"], ["items", "3–5 perspektiv: perspektiv | betonar | grund", "list"], ["common", "Gemensamt", "area"], ["tension", "Spänning eller oenighet", "area"]],
verkningar: [["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["cause", "Orsak", "area"], ["items", "1–3 mekanismer: mekanism | förändring", "list"], ["effect", "Konsekvens", "area"], ["condition", "Villkor", "area"], ["alternative", "Alternativ förklaring", "area"]],
belagg: [["title", "Rubrik", "text"], ["source", "Källa", "text"], ["text", "Originaltext eller citat", "area"], ["items", "1–3 analyser: exakt utdrag | iakttagelse | tolkning", "list"], ["whole", "Helhetstolkning", "area"], ["reservation", "Reservation", "area"]],
sammanflode: [["caption", "Etikett", "text"], ["title", "Rubrik", "text"], ["items", "3–5 bidrag: bidrag | vad det tillför", "list"], ["common", "Gemensam grund", "area"], ["tension", "Kvarvarande spänning", "area"], ["synthesis", "Syntes", "area"]],
lameller: [["title", "Rubrik", "text"], ["caption", "Etikett", "text"], ["text", "Kort text", "area"], ["image", "Bild", "image"]],
register: [["title", "Rubrik", "text"], ["items", "Högst 5 rader: rubrik | text", "list"]],
samband: [["title", "Rubrik", "text"], ["items", "Högst 4 rader: rubrik | text", "list"], ["text", "Slutsats", "area"]],
marginal: [["title", "Rubrik", "text"], ["items", "Högst 3 rader: rubrik | text", "list"], ["image", "Bild", "image"]],
sats: [["title", "Rubrik", "text"], ["items", "Högst 3 rader: rubrik | text", "list"], ["text", "Slutsats", "area"]],
  title: [['title', 'Rubrik', 'text'], ['text', 'Underrubrik', 'area'], ['caption', 'Rad längst ner, t.ex. kurs och datum', 'text'], ['image', 'Bild i högerkanten', 'image']],
  section: [['caption', 'Etikett ovanför, t.ex. Del 2', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['image', 'Bild i högerkanten', 'image']],
  statement: [['caption', 'Etikett ovanför', 'text'], ['title', 'Påstående', 'area'], ['text', 'Tillägg', 'area'], ['image', 'Bild i högerkanten', 'image']],
  bullets: [['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['bullets', 'Punkter', 'list'], ['image', 'Bildband överst', 'image']],
  cards: [['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['items', 'Kort, ett per rad: rubrik | text', 'list'], ['image', 'Bild', 'image'], ['banner', 'Visa bilden som band överst', 'check'], ['flip', 'Bilden till vänster', 'check']],
  split: [['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['bullets', 'Punkter', 'list'], ['image', 'Bild', 'image'], ['flip', 'Bilden till vänster', 'check']],
  image: [['image', 'Bild', 'image'], ['title', 'Rubrik', 'text'], ['caption', 'Bildtext', 'text']],
  terminal: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Terminalhändelser: roll | innehåll | annotation', 'list']],
  kodforklaring: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Kodblock', 'area'], ['items', 'Fokus: radnummer | token | annotation | resultat', 'list']],
  kodskrivning: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Koden som skrivs fram (utan tomma rader)', 'area'], ['items', 'Markeringar efter skrivningen: radnummer | uttryck | förklaring | resultat. Uttrycket gammalt -> nytt byter ut koden i det klicket. Lägg till - takt: rad för att skriva en rad per klick.', 'list']],
  formel: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Formeln på en rad', 'text'], ['items', 'En term per rad, i den ordning de ska tändas: term | förklaring (högst fem)', 'list'], ['conclusion', 'Slutsats när hela formeln visas', 'area']],
  typografisk: [['caption', 'Etikett', 'text'], ['items', 'Formuleringar: roll | text | dramaturgisk funktion', 'list']],
  texttempo: [['caption', 'Etikett', 'text'], ['items', 'Resonemang: roll | text | dramaturgisk funktion', 'list']],
  compare: [['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['image', 'Bildband överst', 'image'], ['lt', 'Vänster kolumn: rubrik', 'text'], ['lb', 'Vänster kolumn: punkter', 'list'], ['rt', 'Höger kolumn: rubrik', 'text'], ['rb', 'Höger kolumn: punkter', 'list']],
  table: [['title', 'Rubrik', 'text'], ['table', 'Tabell', 'table']],
  number: [['title', 'Etikett', 'text'], ['number', 'Tal', 'text'], ['text', 'Förklaring', 'area']],
  timeline: [['title', 'Rubrik', 'text'], ['items', 'Händelser, en per rad: när | vad', 'list']],
  question: [['title', 'Fråga', 'area'], ['bullets', 'Svarsalternativ (valfritt)', 'list'], ['answer', 'Svar, visas när du klickar', 'area']],
  quote: [['text', 'Citat', 'area'], ['caption', 'Källa', 'text']],
  poll: [['title', 'Fråga', 'area'], ['text', 'Ingress', 'area'], ['bullets', 'Alternativ. Skriv * först på raden med rätt svar', 'list'], ['answer', 'Förklaring som visas med rätt svar', 'area']],
  reflect: [['caption', 'Etikett', 'text'], ['title', 'Fråga', 'area'], ['text', 'Instruktion', 'area'], ['minutes', 'Tid i minuter', 'text'], ['bullets', 'Steg (valfritt), t.ex. Tänk, Par, Dela', 'list']],
  define: [['caption', 'Etikett', 'text'], ['title', 'Begrepp', 'text'], ['text', 'Definition', 'area'], ['example', 'Exempel, visas på klick', 'area']],
  chat: [['title', 'Rubrik', 'text'], ['items', 'Repliker, en per rad: vem | text', 'list']],
  duo: [['title', 'Rubrik', 'text'], ['items', 'Tal, ett per rad: tal | förklaring', 'list'], ['text', 'Slutsats', 'area']],
  omslag: [['caption', 'Etikett, t.ex. kapitel', 'text'], ['title', 'Rubrik', 'area'], ['text', 'Kort text', 'area'], ['number', 'Dekorativt tal i bakgrunden, t.ex. 01', 'text'], ['image', 'Bild i högerkanten', 'image']],
  karta: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['items', 'Delar, en per rad: namn | beskrivning', 'list'], ['active', 'Markera del nummer (tomt = ingen)', 'text']],
  triad: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Premisser, en per rad: nyckelord | mening', 'list'], ['text', 'Slutsats, landar sist', 'area'], ['image', 'Bildband överst', 'image']],
  motsats: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Tre rader: vänster | text, höger | text, exempel | text', 'list'], ['image', 'Bild', 'image'], ['banner', 'Visa bilden som band överst', 'check'], ['flip', 'Bilden till höger', 'check']],
  bildkant: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['bullets', 'Punkter', 'list'], ['image', 'Bild i hörnet', 'image'], ['flip', 'Bilden nere till vänster', 'check']],
  tom: [],
  'båge': [['caption', 'Etikett längs bågen', 'text'], ['title', 'Rubrik', 'area'], ['text', 'Kort text', 'area'], ['number', 'Stort konturtal, t.ex. 03', 'text']],
  omlopp: [['caption', 'Etikett', 'text'], ['title', 'Begreppet i mitten', 'text'], ['text', 'Ingress', 'area'], ['items', 'Delar runt banan, en per rad: namn | text | bild (valfri)', 'list'], ['image', 'Bild i kärnan (valfri)', 'image']],
  gradskiva: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Lägen längs skalan, en per rad: namn | förklaring', 'list']],
  rad: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Högst fem, en ruta per rad: rubrik | text', 'list'], ['conclusion', 'Slutsats när alla rutor tänds', 'area']],
  rutor: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Högst sex, en ruta per rad: rubrik | text', 'list'], ['conclusion', 'Slutsats när alla rutor tänds', 'area']],
  remsor: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Högst fem band, ett per rad: rubrik | text', 'list'], ['conclusion', 'Slutsats när alla rutor tänds', 'area']],
  mosaik: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Första raden blir den stora rutan. Högst fem, en per rad: rubrik | text', 'list'], ['conclusion', 'Slutsats när alla rutor tänds', 'area']],
  karna: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Begreppet i mitten', 'text'], ['items', 'Högst fyra rutor runt kärnan: rubrik | text', 'list'], ['conclusion', 'Slutsats i kärnan när alla rutor tänds', 'area']],
  spegel: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Två sidor: namn | text | bild. Sedan vänster: eller höger: [x y |] iakttagelse | text', 'list'], ['conclusion', 'Slutsats när helheten visas', 'area']],
  ordpar: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['lt', 'Vänster kolumn', 'text'], ['rt', 'Höger kolumn', 'text'], ['items', 'Högst sex par: vänster ord | höger ord | förklaring', 'list'], ['conclusion', 'Slutsats när helheten visas', 'area']],
  spektrum: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['lt', 'Vänster ytterläge', 'text'], ['rt', 'Höger ytterläge', 'text'], ['items', 'Högst sex exempel: läge 0–100 | namn | text', 'list'], ['conclusion', 'Slutsats när helheten visas', 'area']],
  livslopp: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['scale', 'Etiketter under axeln, åtskilda med |', 'text'], ['items', 'bana: namn, sedan läge 0–100 | händelse | text. gräns: läge | text', 'list'], ['conclusion', 'Slutsats när helheten visas', 'area']],
  lexikon: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning under rubriken', 'area'], ['items', 'Högst åtta: begrepp | definition | exempel (eller begrepp | kategori | definition | exempel)', 'list'], ['conclusion', 'Slutsats när helheten visas', 'area']],
  graf: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning i sidokolumnen', 'area'], ['items', 'En per rad. nod: namn | x y (0–100). kant: A - B | vikt (A > B för riktad). fokus: noder, kanter, vikter, A, A - B eller A > B > C | rubrik | text', 'list'], ['conclusion', 'Slutsats när helheten visas igen', 'area']],
  flode: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress under rubriken (valfri)', 'area'], ['items', 'En per rad. bana: namn startar en bana (högst två). Övriga rader: steg | text (högst fem per bana). Ett steg som heter ? blir en stängd låda.', 'list'], ['conclusion', 'Slutsats när hela kedjan visas', 'area']],
  urval: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['lt', 'Namn på helheten', 'text'], ['rt', 'Namn på urvalet', 'text'], ['items', 'En grupp per rad: namn | andel i helheten | andel i urvalet (högst fyra grupper)', 'list'], ['conclusion', 'Slutsats när helheten visas igen', 'area'], ['reservation', 'Källa eller reservation (annars: Illustration, inte verkliga siffror.)', 'text']],
  forgrening: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'En gren per rad: namn | tid | ur (föräldern) | text. Stammen har inget ur. Högst åtta grenar.', 'list'], ['conclusion', 'Slutsats när hela trädet visas', 'area']],
  inzoomning: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'En nivå per rad, yttersta först: namn | text (högst fem)', 'list'], ['conclusion', 'Slutsats när hela vägen visas', 'area']],
  fyrfalt: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Axlar: - x: vänster pol | höger pol och - y: nedre pol | övre pol. Sedan en sak per rad: namn | x y (0–100) | text', 'list'], ['conclusion', 'Slutsats när hela fältet visas', 'area']],
  vagskal: [['caption', 'Etikett', 'text'], ['title', 'Rubrik (frågan)', 'text'], ['lt', 'Vänster sida', 'text'], ['rt', 'Höger sida', 'text'], ['items', 'Ett argument per rad: sida | argument | vikt 1–3 (högst tre per sida)', 'list'], ['conclusion', 'Slutsats när balansen visas', 'area']],
  sokning: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning (syns innan första klicket)', 'area'], ['items', 'Inställningar och träd: - algoritm: bfs eller dfs, - mål: E, - läge: frontier, vandring eller övning, - not: 3 | kommentar vid klick 3. Sedan trädet med indrag, eller nod- och kantrader som i graf. I övning börjar varje träd med - uppgift: namn | mål.', 'list'], ['conclusion', 'Slutsats när allt visas', 'area']],
  rutnat: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning', 'area'], ['items', 'Inställningar och rutnät: - algoritm: bfs, dfs, girig eller a* (två med komma, t.ex. bfs, dfs, visas bredvid varandra), - takt: ruta eller ett tal (rutor per klick; BFS går annars en nivå per klick), - siffror: h eller g+h, - not: 3 | kommentar. Sedan en rad per rutnätsrad med # vägg, . fri ruta, A start och B mål.', 'list'], ['conclusion', 'Slutsats när vägen visas', 'area']],
  ko: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning', 'area'], ['items', 'Köer: - kö: fifo, stack eller prio | namn | förklaring | kodrad. Sedan ett steg per rad: - in: A 3 (element och prioritet) eller - ut. En kö i taget; - takt: samtidigt kör alla köer på en gång.', 'list'], ['conclusion', 'Slutsats', 'area']],
  trad: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Inledning i sidokolumnen', 'area'], ['items', 'Trädet som indragen lista, två mellanslag per nivå. svar: nod ger grenen en etikett. fokus: rot, löv, föräldrar, grenar, nivå 2, barn X, en nod eller väg Ja > Nej | rubrik | text', 'list'], ['conclusion', 'Slutsats när helheten visas igen', 'area']],
  bro: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Text under bågen', 'area'], ['lt', 'Start på golvet', 'text'], ['rt', 'Slut på golvet', 'text'], ['ret', 'Retur längs golvet (gör bron till en loop)', 'text'], ['items', 'Hållplatser, högst fem, en per rad: namn | text', 'list']],
  ringar: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Två eller tre ringar: namn | text', 'list'], ['text', 'Det gemensamma i mitten', 'area']],
  lins: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['image', 'Bild', 'image'], ['items', 'Detaljer, en per rad: x y (procent) | rubrik | text', 'list'], ['number', 'Linsens radie i pixlar (t.ex. 230)', 'text']],
  'mätare': [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['number', 'Tal, t.ex. 73 % eller 4 av 8', 'text'], ['max', 'Maxvärde om talet inte är en andel', 'text'], ['text', 'Förklaring', 'area']],
  'ridå': [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'area'], ['text', 'Kort text', 'area'], ['image', 'Bild i helformat', 'image']],
  'strålkastare': [['caption', 'Etikett', 'text'], ['items', 'Meningen i delar, en fras per rad', 'list'], ['text', 'Efterord, visas sist', 'area']],
  fokus: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['items', 'Rader, en per rad: namn | förklaring', 'list']],
  ordbild: [['caption', 'Etikett', 'text'], ['title', 'Ordet', 'text'], ['text', 'Kort text', 'area'], ['image', 'Bild som fyller ordet', 'image']],
  'bildfält': [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Ingress', 'area'], ['bullets', 'Punkter', 'list'], ['image', 'Bild', 'image'], ['flip', 'Bilden till vänster', 'check']],
  delning: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['items', 'Två eller tre rader: vänster | text, höger | text, exempel | text', 'list']],
  ljustal: [['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['number', 'Tal, t.ex. 73 % eller 4 av 8', 'text'], ['max', 'Maxvärde om talet inte är en andel', 'text'], ['text', 'Förklaring', 'area']],
  egen: [['tpl', 'Mall', 'tplselect'], ['caption', 'Etikett', 'text'], ['title', 'Rubrik', 'text'], ['text', 'Text', 'area'], ['items', 'Lista, en per rad: rubrik | text', 'list'], ['answer', 'Svar', 'area'], ['image', 'Bild', 'image']]
};
const STEPPED = ["etapper","vagval","lager","resonemang","helhet","skiften","prisma","verkningar","belagg","sammanflode",'register','samband','marginal','sats','bullets', 'split', 'cards', 'compare', 'timeline', 'terminal', 'kodforklaring', 'typografisk', 'texttempo', 'chat', 'duo', 'egen', 'karta', 'triad', 'motsats', 'bildkant', 'omlopp', 'gradskiva', 'bro', 'ringar', 'lins', 'strålkastare', 'fokus', 'bildfält', 'delning'];
const DEFAULTS = {
  title: { title: 'Rubrik', text: 'Underrubrik', bg: 'nodes' },
  section: { caption: 'Del 1', title: 'Nytt avsnitt', bg: 'field' },
  statement: { title: 'En mening som ska fastna.' },
  bullets: { title: 'Rubrik', bullets: ['Första punkten', 'Andra punkten', 'Tredje punkten'], steps: true },
  split: { title: 'Rubrik', bullets: ['Första punkten', 'Andra punkten'], steps: true },
  image: { title: '' },
  cards: { title: 'Tre saker att minnas', items: ['Första | Förklaring', 'Andra | Förklaring', 'Tredje | Förklaring'], steps: true },
  compare: { title: 'Jämförelse', lt: 'Före', lb: ['Punkt', 'Punkt'], rt: 'Efter', rb: ['Punkt', 'Punkt'], steps: true },
  table: { title: 'Tabell', table: { header: true, reveal: 'rows', rows: [['Fråga', 'Svar'], ['', ''], ['', '']] } },
  number: { title: 'Etikett', number: '42', text: 'Vad talet betyder' },
  timeline: { title: 'Tidslinje', items: ['1900 | Händelse', '1950 | Händelse', '2000 | Händelse'], steps: true },
  question: { title: 'Vad tror du händer?', bullets: ['Alternativ A', 'Alternativ B'], answer: 'Rätt svar och varför.' },
  quote: { text: 'Citat', caption: 'Källa' },
  egen: { title: 'Rubrik', items: ['Första | Förklaring', 'Andra | Förklaring', 'Tredje | Förklaring'], steps: true }
};
['etapper','vagval','lager','resonemang','helhet','skiften','prisma','verkningar','belagg','sammanflode','lameller','register','samband','marginal','sats','terminal','kodforklaring','kodskrivning','typografisk','texttempo','poll', 'reflect', 'define', 'chat', 'duo', 'omslag', 'karta', 'triad', 'motsats', 'bildkant', 'båge', 'omlopp', 'gradskiva', 'bro', 'graf', 'trad', 'spegel', 'ordpar', 'spektrum', 'livslopp', 'lexikon', 'rad', 'rutor', 'remsor', 'mosaik', 'karna', 'flode', 'urval', 'forgrening', 'inzoomning', 'fyrfalt', 'vagskal', 'sokning', 'rutnat', 'ko', 'formel', 'ringar', 'lins', 'mätare', 'ridå', 'strålkastare', 'fokus', 'ordbild', 'bildfält', 'delning', 'ljustal'].forEach(l => { const c = Manus.CATALOG.find(x => x.l === l); if (c) { const p = Manus.parseBlock(c.ex); delete p.layout; DEFAULTS[l] = p; } });
const WF = {etapper:"<path class=\"l\" d=\"M15 30H55V45H100V60H145\"/>",vagval:"<path class=\"l\" d=\"M14 30H146M14 50H146M14 70H146M60 15V75M103 15V75\"/>",lager:"<path class=\"l\" d=\"M15 20H140M30 45H140M45 70H140\"/>",resonemang:"<path class=\"l\" d=\"M15 20H75M15 45H75M15 70H75M92 20V70\"/><rect class=\"a\" x=\"105\" y=\"30\" width=\"40\" height=\"30\"/>",helhet:"<rect class=\"a\" x=\"14\" y=\"20\" width=\"60\" height=\"54\"/><path class=\"l\" d=\"M88 20H145M88 45H145M88 70H145\"/>",
skiften:'<line class="l" x1="14" y1="48" x2="146" y2="48"/><circle class="a" cx="28" cy="48" r="4"/><circle class="a" cx="80" cy="48" r="5"/><circle class="a" cx="132" cy="48" r="4"/><path class="m" d="M28 38V22M80 58V75M132 38V22"/>',prisma:'<circle class="o" cx="80" cy="46" r="15"/><path class="l" d="M80 31L80 8M94 42L140 24M91 58L124 79M69 58L36 79M66 42L20 24"/><circle class="a" cx="80" cy="46" r="6"/>',verkningar:'<path class="l" d="M15 48H145"/><circle class="a" cx="18" cy="48" r="6"/><circle class="o" cx="60" cy="48" r="5"/><circle class="o" cx="100" cy="48" r="5"/><path class="a" d="M136 42l9 6-9 6"/>',belagg:'<rect class="m" x="14" y="18" width="76" height="7" rx="2"/><rect class="m" x="14" y="32" width="94" height="7" rx="2"/><rect class="a" x="48" y="31" width="34" height="9" rx="2"/><path class="l" d="M82 36H118V62"/><rect class="m" x="112" y="62" width="34" height="5" rx="2"/>',sammanflode:'<path class="l" d="M14 18C42 18 52 45 78 45M14 45H78M14 72C42 72 52 45 78 45M146 24C118 24 108 45 78 45"/><path class="a" d="M78 45C90 55 105 64 138 72"/><circle class="a" cx="78" cy="45" r="5"/>',
lameller:"<path class=\"l\" d=\"M25 10V80M50 10V80M75 10V80M100 10V80M125 10V80\"/><rect class=\"a\" x=\"12\" y=\"50\" width=\"100\" height=\"18\"/>",register:"<rect class=\"o\" x=\"12\" y=\"15\" width=\"30\" height=\"60\"/><rect class=\"a\" x=\"45\" y=\"15\" width=\"72\" height=\"60\"/><rect class=\"o\" x=\"120\" y=\"15\" width=\"28\" height=\"60\"/>",samband:"<path class=\"l\" d=\"M20 20H55L100 45H145M20 70H55L100 45\"/><circle class=\"a\" cx=\"130\" cy=\"45\" r=\"15\"/>",marginal:"<rect class=\"o\" x=\"12\" y=\"12\" width=\"80\" height=\"65\"/><path class=\"l\" d=\"M100 20H148M100 45H148M100 70H148\"/>",sats:"<text class=\"a\" x=\"20\" y=\"50\" style=\"font:30px serif\">x + y</text><path class=\"l\" d=\"M20 65H140\"/>",
  title: '<rect class="a" x="14" y="46" width="96" height="16" rx="3"/><rect class="m" x="14" y="68" width="62" height="5" rx="2"/>',
  section: '<rect class="a" x="14" y="30" width="28" height="4" rx="2"/><rect class="m" x="14" y="40" width="108" height="16" rx="3" style="opacity:.8"/>',
  statement: '<rect class="m" x="14" y="28" width="124" height="11" rx="3" style="opacity:.8"/><rect class="m" x="14" y="45" width="88" height="11" rx="3" style="opacity:.8"/>',
  bullets: '<rect class="m" x="14" y="12" width="74" height="9" rx="2" style="opacity:.8"/><line class="l" x1="14" y1="34" x2="140" y2="34"/><rect class="m" x="14" y="39" width="96" height="4" rx="2"/><line class="l" x1="14" y1="51" x2="140" y2="51"/><rect class="m" x="14" y="56" width="84" height="4" rx="2"/><line class="l" x1="14" y1="68" x2="140" y2="68"/><rect class="m" x="14" y="73" width="90" height="4" rx="2"/>',
  split: '<rect class="m" x="12" y="20" width="56" height="8" rx="2" style="opacity:.8"/><rect class="m" x="12" y="38" width="58" height="4" rx="2"/><rect class="m" x="12" y="48" width="50" height="4" rx="2"/><rect class="m" x="12" y="58" width="54" height="4" rx="2"/><rect class="o" x="82" y="14" width="66" height="62" rx="4"/><path class="a" d="M88 70l16-20 12 14 8-8 18 14z"/>',
  image: '<rect class="o" x="14" y="8" width="132" height="60" rx="4"/><path class="a" d="M22 62l30-32 22 22 14-12 50 22z" style="opacity:.8"/><rect class="m" x="14" y="75" width="54" height="6" rx="2"/>',
  terminal: '<rect class="o" x="28" y="12" width="120" height="66" rx="6"/><circle class="a" cx="38" cy="21" r="3"/><path class="l" d="M38 38H130M38 50H118M38 62H138"/><rect class="a" x="38" y="34" width="44" height="5" rx="2"/>',
  formel: '<g style="fill:var(--ink);opacity:.3"><rect x="16" y="26" width="20" height="16" rx="3"/><rect x="42" y="32" width="10" height="4" rx="2"/><rect x="92" y="32" width="10" height="4" rx="2"/></g><rect x="58" y="26" width="28" height="16" rx="3" style="fill:var(--accent)"/><rect x="108" y="26" width="28" height="16" rx="3" style="fill:var(--accent-2)"/><rect x="108" y="46" width="28" height="3" rx="1.5" style="fill:var(--accent-2)"/><g style="fill:var(--muted);opacity:.55"><rect x="40" y="60" width="80" height="5" rx="2"/><rect x="52" y="70" width="56" height="5" rx="2"/></g>',
  kodskrivning: '<rect x="10" y="10" width="140" height="70" rx="8" style="fill:none;stroke:var(--muted);stroke-width:2;opacity:.6"/><g style="fill:var(--muted);opacity:.35"><circle cx="20" cy="18" r="2.5"/><circle cx="28" cy="18" r="2.5"/><circle cx="36" cy="18" r="2.5"/></g><g style="fill:var(--accent)"><rect x="20" y="32" width="18" height="5" rx="2"/><rect x="30" y="44" width="22" height="5" rx="2"/></g><g style="fill:var(--ink);opacity:.55"><rect x="42" y="32" width="46" height="5" rx="2"/><rect x="56" y="44" width="30" height="5" rx="2"/><rect x="30" y="56" width="26" height="5" rx="2"/></g><rect x="60" y="54" width="6" height="9" style="fill:var(--accent)"/>',
  kodforklaring: '<rect class="o" x="14" y="12" width="98" height="66" rx="5"/><path class="l" d="M28 30H94M28 43H86M28 56H100"/><rect class="a" x="50" y="40" width="32" height="7" rx="2"/><path class="m" d="M122 30H148M122 43H144M122 56H150"/>',
  typografisk: '<rect class="m" x="18" y="29" width="124" height="15" rx="3"/><rect class="a" x="48" y="51" width="64" height="15" rx="3"/>',
  texttempo: '<rect class="m" x="14" y="22" width="112" height="12" rx="3"/><rect class="m" x="14" y="42" width="132" height="12" rx="3"/><rect class="a" x="14" y="62" width="78" height="12" rx="3"/>',
  cards: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><rect class="o" x="14" y="32" width="38" height="44" rx="4"/><rect class="o" x="61" y="32" width="38" height="44" rx="4"/><rect class="o" x="108" y="32" width="38" height="44" rx="4"/><rect class="a" x="20" y="38" width="22" height="5" rx="2"/><rect class="a" x="67" y="38" width="22" height="5" rx="2"/><rect class="a" x="114" y="38" width="22" height="5" rx="2"/><rect class="m" x="20" y="50" width="26" height="3"/><rect class="m" x="67" y="50" width="26" height="3"/><rect class="m" x="114" y="50" width="26" height="3"/>',
  compare: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><line class="l" x1="80" y1="30" x2="80" y2="80"/><rect class="a" x="14" y="32" width="30" height="5" rx="2"/><rect class="m" x="14" y="44" width="52" height="4" rx="2"/><rect class="m" x="14" y="54" width="46" height="4" rx="2"/><rect class="a" x="90" y="32" width="30" height="5" rx="2"/><rect class="m" x="90" y="44" width="52" height="4" rx="2"/><rect class="m" x="90" y="54" width="46" height="4" rx="2"/>',
  table: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><line class="l" x1="14" y1="38" x2="146" y2="38" style="stroke:var(--muted)"/><line class="l" x1="14" y1="50" x2="146" y2="50"/><line class="l" x1="14" y1="62" x2="146" y2="62"/><line class="l" x1="14" y1="74" x2="146" y2="74"/><rect class="m" x="14" y="30" width="20" height="4"/><rect class="m" x="60" y="30" width="20" height="4"/><rect class="a" x="106" y="42" width="22" height="4"/><rect class="a" x="106" y="54" width="22" height="4"/>',
  number: '<rect class="a" x="14" y="18" width="40" height="4" rx="2"/><rect class="m" x="14" y="28" width="86" height="30" rx="4" style="opacity:.8"/><rect class="m" x="14" y="64" width="70" height="5" rx="2"/>',
  timeline: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><line class="l" x1="14" y1="44" x2="146" y2="44"/><circle class="a" cx="18" cy="44" r="4"/><circle class="a" cx="60" cy="44" r="4"/><circle class="a" cx="102" cy="44" r="4"/><rect class="m" x="14" y="54" width="28" height="7" rx="2"/><rect class="m" x="56" y="54" width="28" height="7" rx="2"/><rect class="m" x="98" y="54" width="28" height="7" rx="2"/>',
  question: '<rect class="m" x="14" y="12" width="118" height="9" rx="2" style="opacity:.8"/><rect class="o" x="14" y="30" width="62" height="14" rx="3"/><rect class="o" x="84" y="30" width="62" height="14" rx="3"/><rect class="a" x="14" y="56" width="4" height="20"/><rect class="m" x="22" y="62" width="86" height="7" rx="2"/>',
  poll: '<rect class="m" x="14" y="12" width="90" height="8" rx="2" style="opacity:.8"/><rect class="o" x="14" y="28" width="132" height="13" rx="3"/><rect class="a" x="14" y="28" width="70" height="13" rx="3" style="opacity:.35"/><rect class="o" x="14" y="46" width="132" height="13" rx="3"/><rect class="a" x="14" y="46" width="30" height="13" rx="3" style="opacity:.35"/><rect class="o" x="14" y="64" width="132" height="13" rx="3" style="stroke:var(--accent)"/><rect class="a" x="14" y="64" width="100" height="13" rx="3" style="opacity:.35"/>',
  reflect: '<rect class="a" x="14" y="24" width="26" height="4" rx="2"/><rect class="m" x="14" y="34" width="70" height="10" rx="2" style="opacity:.8"/><rect class="m" x="14" y="50" width="56" height="10" rx="2" style="opacity:.8"/><circle cx="120" cy="46" r="20" fill="none" style="stroke:var(--line-2)" stroke-width="3"/><path d="M120 26a20 20 0 0 1 20 20" fill="none" style="stroke:var(--accent)" stroke-width="3"/>',
  define: '<rect class="a" x="14" y="20" width="24" height="4" rx="2"/><rect class="m" x="14" y="30" width="96" height="18" rx="3" style="opacity:.85"/><rect class="m" x="14" y="54" width="110" height="5" rx="2"/><rect class="o" x="14" y="66" width="120" height="12" rx="3"/>',
  chat: '<rect class="m" x="14" y="10" width="60" height="7" rx="2" style="opacity:.8"/><rect class="a" x="84" y="24" width="62" height="12" rx="5"/><rect class="o" x="14" y="42" width="84" height="14" rx="5"/><rect class="a" x="96" y="62" width="50" height="12" rx="5"/>',
  duo: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><rect class="a" x="14" y="32" width="50" height="22" rx="3"/><rect class="m" x="14" y="60" width="54" height="4" rx="2"/><line class="l" x1="80" y1="30" x2="80" y2="72"/><rect class="a" x="92" y="32" width="50" height="22" rx="3"/><rect class="m" x="92" y="60" width="54" height="4" rx="2"/>',
  omslag: '<text x="92" y="86" style="font:italic 700 70px Georgia,serif;fill:var(--line-2)">01</text><rect class="a" x="14" y="24" width="14" height="2"/><rect class="m" x="14" y="32" width="70" height="16" rx="2" style="opacity:.85"/><rect class="m" x="14" y="54" width="52" height="5" rx="2"/>',
  karta: '<rect class="m" x="14" y="12" width="60" height="7" rx="2" style="opacity:.8"/><rect class="o" x="14" y="30" width="38" height="40" rx="4"/><rect class="o" x="61" y="26" width="38" height="40" rx="4" style="stroke:var(--accent)"/><rect class="o" x="108" y="30" width="38" height="40" rx="4" style="opacity:.5"/><circle class="a" cx="80" cy="36" r="3"/>',
  triad: '<line class="l" x1="18" y1="16" x2="18" y2="50"/><rect class="m" x="26" y="16" width="90" height="5" rx="2"/><rect class="m" x="26" y="28" width="80" height="5" rx="2"/><rect class="m" x="26" y="40" width="86" height="5" rx="2"/><rect class="a" x="14" y="60" width="118" height="12" rx="2"/>',
  motsats: '<rect class="m" x="14" y="12" width="70" height="8" rx="2" style="opacity:.8"/><rect class="o" x="14" y="28" width="52" height="36" rx="4" style="opacity:.5"/><text x="72" y="54" style="font:italic 26px Georgia,serif;fill:var(--line-2)">/</text><rect class="o" x="86" y="26" width="60" height="40" rx="4" style="stroke:var(--accent)"/><rect class="m" x="14" y="72" width="100" height="4" rx="2"/>',
  bildkant: '<rect class="a" x="86" y="-4" width="80" height="54" rx="4" transform="rotate(4 120 20)" style="opacity:.8"/><rect class="m" x="14" y="56" width="66" height="9" rx="2" style="opacity:.8"/><rect class="m" x="14" y="70" width="50" height="4" rx="2"/>',
  'båge': '<path d="M 20 -20 A 120 120 0 0 1 140 100" fill="none" style="stroke:var(--line-2)" stroke-width="1.5"/><path d="M 44 -20 A 128 128 0 0 1 150 80" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle class="a" cx="118" cy="30" r="5"/><rect class="m" x="14" y="56" width="62" height="12" rx="2" style="opacity:.85"/><rect class="m" x="14" y="72" width="44" height="4" rx="2"/>',
  omlopp: '<ellipse cx="80" cy="48" rx="62" ry="28" fill="none" style="stroke:var(--muted)" stroke-width="1.5"/><circle cx="80" cy="48" r="15" fill="none" style="stroke:var(--line-2)" stroke-width="2"/><circle class="a" cx="80" cy="20" r="4.5"/><circle class="a" cx="134" cy="62" r="4.5"/><circle class="a" cx="26" cy="62" r="4.5"/>',
  gradskiva: '<path d="M 30 78 A 50 50 0 0 1 130 78" fill="none" style="stroke:var(--line-2)" stroke-width="5" stroke-linecap="round"/><path d="M 30 78 A 50 50 0 0 1 96 31" fill="none" style="stroke:var(--accent)" stroke-width="5" stroke-linecap="round"/><path d="M80 78 L 104 40" style="stroke:var(--ink,#222)" stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="78" r="5" style="fill:var(--ink,#222)"/>',
  rad: '<rect x="8" y="22" width="32" height="50" rx="4" style="fill:var(--line)" opacity=".5"/><rect x="46" y="22" width="32" height="50" rx="4" style="fill:var(--line)" opacity=".5"/><rect x="84" y="22" width="32" height="50" rx="4" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="122" y="22" width="32" height="50" rx="4" style="fill:var(--line)" opacity=".25"/>',
  rutor: '<rect x="20" y="12" width="56" height="32" rx="4" style="fill:var(--line)" opacity=".5"/><rect x="84" y="12" width="56" height="32" rx="4" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="20" y="50" width="56" height="32" rx="4" style="fill:var(--line)" opacity=".25"/><rect x="84" y="50" width="56" height="32" rx="4" style="fill:var(--line)" opacity=".25"/>',
  remsor: '<rect x="12" y="12" width="136" height="20" rx="3" style="fill:var(--line)" opacity=".5"/><rect x="12" y="37" width="136" height="20" rx="3" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="12" y="62" width="136" height="20" rx="3" style="fill:var(--line)" opacity=".25"/>',
  mosaik: '<rect x="12" y="12" width="70" height="70" rx="4" style="fill:var(--line)" opacity=".5"/><rect x="88" y="12" width="60" height="21" rx="3" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="88" y="37" width="60" height="21" rx="3" style="fill:var(--line)" opacity=".25"/><rect x="88" y="62" width="60" height="20" rx="3" style="fill:var(--line)" opacity=".25"/>',
  karna: '<ellipse cx="80" cy="47" rx="24" ry="18" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="8" y="12" width="36" height="30" rx="3" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="116" y="12" width="36" height="30" rx="3" style="fill:var(--line)" opacity=".3"/><rect x="8" y="52" width="36" height="30" rx="3" style="fill:var(--line)" opacity=".3"/><rect x="116" y="52" width="36" height="30" rx="3" style="fill:var(--line)" opacity=".3"/>',
  spegel: '<rect x="10" y="12" width="68" height="70" rx="4" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><rect x="84" y="12" width="68" height="70" rx="4" style="fill:var(--line)" opacity=".4"/><circle class="a" cx="44" cy="44" r="6"/>',
  ordpar: '<path d="M80 12V82" style="stroke:var(--line)" stroke-width="1.5"/><rect x="24" y="22" width="44" height="8" rx="2" style="fill:var(--muted)" opacity=".4"/><rect x="92" y="22" width="44" height="8" rx="2" style="fill:var(--muted)" opacity=".4"/><rect x="24" y="44" width="44" height="8" rx="2" style="fill:var(--muted)"/><path d="M70 48H90" style="stroke:var(--accent)" stroke-width="3"/><circle class="a" cx="80" cy="48" r="4"/><rect x="92" y="44" width="44" height="8" rx="2" style="fill:var(--accent)"/><rect x="24" y="66" width="44" height="8" rx="2" style="fill:var(--muted)" opacity=".4"/><rect x="92" y="66" width="44" height="8" rx="2" style="fill:var(--muted)" opacity=".4"/>',
  spektrum: '<rect x="12" y="44" width="136" height="6" rx="3" style="fill:var(--accent)"/><circle cx="36" cy="47" r="5" style="fill:var(--muted)"/><circle class="a" cx="92" cy="47" r="8"/><circle cx="128" cy="47" r="5" style="fill:var(--muted)"/><rect x="72" y="16" width="40" height="8" rx="2" style="fill:var(--accent)"/>',
  livslopp: '<path d="M40 32H150M40 64H150" style="stroke:var(--line)" stroke-width="2"/><path d="M96 16V80" style="stroke:var(--accent-2)" stroke-width="2" stroke-dasharray="4 4"/><circle class="a" cx="46" cy="32" r="5"/><circle cx="128" cy="32" r="5" style="fill:var(--muted)"/><circle cx="46" cy="64" r="5" style="fill:var(--muted)"/><circle cx="118" cy="64" r="5" style="fill:var(--muted)"/><rect x="8" y="28" width="22" height="8" rx="2" style="fill:var(--muted)"/><rect x="8" y="60" width="22" height="8" rx="2" style="fill:var(--muted)"/>',
  lexikon: '<rect x="10" y="14" width="44" height="12" rx="2" style="fill:var(--muted)" opacity=".4"/><rect x="10" y="34" width="44" height="12" rx="2" style="fill:var(--accent)"/><rect x="10" y="54" width="44" height="12" rx="2" style="fill:var(--muted)" opacity=".4"/><rect x="70" y="18" width="70" height="14" rx="2" style="fill:var(--ink)"/><rect x="70" y="40" width="80" height="6" rx="2" style="fill:var(--muted)"/><rect x="70" y="52" width="66" height="6" rx="2" style="fill:var(--muted)"/>',
  graf: '<path d="M22 30L70 14L130 36L96 78L30 66Z M70 14L96 78" fill="none" style="stroke:var(--line)" stroke-width="1.5"/><path d="M22 30L30 66L96 78" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle cx="70" cy="14" r="5" style="fill:var(--muted)"/><circle cx="130" cy="36" r="5" style="fill:var(--muted)"/><circle class="a" cx="22" cy="30" r="6"/><circle class="a" cx="30" cy="66" r="6"/><circle class="a" cx="96" cy="78" r="6"/>',
  flode: '<path d="M10 30H150M10 64H150" fill="none" style="stroke:var(--line)" stroke-width="2"/><path d="M10 30H80M10 64H80" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle cx="34" cy="30" r="5" style="fill:var(--muted)"/><circle class="a" cx="80" cy="30" r="6"/><circle cx="126" cy="30" r="5" style="fill:var(--muted)"/><circle cx="34" cy="64" r="5" style="fill:var(--muted)"/><rect x="68" y="54" width="24" height="20" rx="4" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/><circle cx="126" cy="64" r="5" style="fill:var(--muted)"/>',
  sokning: '<g style="stroke:var(--muted);stroke-width:2;opacity:.6"><line x1="112" y1="16" x2="92" y2="40"/><line x1="112" y1="16" x2="132" y2="40"/><line x1="92" y1="40" x2="82" y2="66"/><line x1="132" y1="40" x2="142" y2="66"/></g><circle cx="112" cy="16" r="7" style="fill:var(--accent)"/><circle cx="92" cy="40" r="7" style="fill:var(--accent);opacity:.5"/><circle cx="132" cy="40" r="7" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:3 3"/><circle cx="82" cy="66" r="6" style="fill:var(--muted);opacity:.5"/><circle cx="142" cy="66" r="6" style="fill:none;stroke:var(--accent-2);stroke-width:2.5"/><g style="fill:var(--muted);opacity:.6"><rect x="12" y="14" width="46" height="5" rx="2"/><rect x="12" y="26" width="40" height="5" rx="2"/></g><rect x="12" y="38" width="46" height="6" rx="3" style="fill:var(--accent)"/><g style="fill:none;stroke:var(--accent);stroke-width:2"><rect x="12" y="56" width="14" height="14" rx="3"/><rect x="30" y="56" width="14" height="14" rx="3"/></g>',
  rutnat: '<g style="fill:var(--muted);opacity:.35"><rect x="20" y="10" width="14" height="14" rx="2"/><rect x="52" y="10" width="14" height="14" rx="2"/><rect x="36" y="42" width="14" height="14" rx="2"/><rect x="84" y="26" width="14" height="14" rx="2"/><rect x="100" y="58" width="14" height="14" rx="2"/></g><g style="fill:var(--accent);opacity:.45"><rect x="20" y="58" width="14" height="14" rx="2"/><rect x="36" y="58" width="14" height="14" rx="2"/><rect x="52" y="58" width="14" height="14" rx="2"/><rect x="52" y="42" width="14" height="14" rx="2"/><rect x="20" y="42" width="14" height="14" rx="2"/></g><rect x="68" y="42" width="14" height="14" rx="2" style="fill:var(--accent)"/><rect x="116" y="10" width="14" height="14" rx="2" style="fill:var(--accent-2)"/>',
  ko: '<g style="fill:none;stroke:var(--muted);stroke-width:2;opacity:.6"><rect x="8" y="34" width="44" height="18" rx="5"/><rect x="72" y="14" width="18" height="52" rx="5"/><rect x="108" y="34" width="44" height="18" rx="5"/></g><g style="fill:var(--muted);opacity:.55"><rect x="12" y="38" width="10" height="10" rx="2"/><rect x="26" y="38" width="10" height="10" rx="2"/><rect x="76" y="52" width="10" height="10" rx="2"/><rect x="76" y="38" width="10" height="10" rx="2"/><rect x="126" y="38" width="10" height="10" rx="2"/></g><g style="fill:var(--accent)"><rect x="24" y="62" width="10" height="10" rx="2"/><rect x="76" y="0" width="10" height="10" rx="2"/><rect x="124" y="62" width="10" height="10" rx="2"/></g>',
  inzoomning: '<g style="fill:none;stroke:var(--muted);stroke-width:2;opacity:.5"><circle cx="46" cy="44" r="34"/><circle cx="62" cy="58" r="16"/></g><circle cx="58" cy="54" r="22" style="fill:none;stroke:var(--accent);stroke-width:3"/><g style="fill:var(--muted);opacity:.6"><rect x="104" y="18" width="40" height="5" rx="2"/><rect x="112" y="40" width="34" height="5" rx="2"/></g><rect x="108" y="29" width="38" height="6" rx="3" style="fill:var(--accent)"/>',
  fyrfalt: '<g style="stroke:var(--muted);stroke-width:2;opacity:.6"><line x1="12" y1="44" x2="148" y2="44"/><line x1="80" y1="8" x2="80" y2="80"/></g><rect x="80" y="8" width="68" height="36" style="fill:var(--accent);opacity:.15"/><g style="fill:var(--muted);opacity:.5"><circle cx="34" cy="22" r="5"/><circle cx="124" cy="64" r="5"/><circle cx="46" cy="66" r="5"/></g><path d="M112 24 V44 M112 24 H80" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:3 3"/><circle cx="112" cy="24" r="7" style="fill:var(--accent)"/>',
  vagskal: '<path d="M80 22 V70 M62 70 H98" style="fill:none;stroke:var(--muted);stroke-width:3;stroke-linecap:round"/><g transform="rotate(-8 80 22)"><line x1="24" y1="22" x2="136" y2="22" style="stroke:var(--ink);stroke-width:3;stroke-linecap:round"/></g><path d="M8 44 Q26 54 44 44 Z" style="fill:var(--muted);opacity:.6"/><path d="M116 36 Q134 46 152 36 Z" style="fill:var(--muted);opacity:.6"/><rect x="18" y="32" width="10" height="12" style="fill:var(--accent)"/><rect x="30" y="36" width="10" height="8" style="fill:var(--muted)"/><circle cx="80" cy="22" r="4" style="fill:var(--accent)"/>',
  forgrening: '<g style="fill:none;stroke:var(--muted);stroke-width:3;stroke-linecap:round;opacity:.45"><path d="M14 18 H148"/><path d="M40 18 C52 18 52 60 64 60 H148"/><path d="M90 60 C100 60 100 72 110 72 H148"/></g><g style="fill:none;stroke:var(--accent);stroke-width:4;stroke-linecap:round"><path d="M40 18 C50 18 50 36 60 36 H148"/></g><circle cx="40" cy="18" r="4" style="fill:var(--accent)"/>',
  urval: '<g style="fill:var(--muted);opacity:.35"><circle cx="20" cy="20" r="5"/><circle cx="36" cy="20" r="5"/><circle cx="52" cy="36" r="5"/><circle cx="20" cy="52" r="5"/><circle cx="52" cy="68" r="5"/><circle cx="36" cy="68" r="5"/></g><g style="fill:var(--accent)"><circle cx="52" cy="20" r="5"/><circle cx="20" cy="36" r="5"/><circle cx="36" cy="36" r="5"/><circle cx="36" cy="52" r="5"/><circle cx="52" cy="52" r="5"/><circle cx="20" cy="68" r="5"/></g><rect x="80" y="26" width="66" height="7" rx="3" style="fill:var(--line)"/><rect x="80" y="26" width="34" height="7" rx="3" style="fill:var(--accent)"/><rect x="80" y="50" width="66" height="7" rx="3" style="fill:var(--line)"/><rect x="80" y="50" width="58" height="7" rx="3" style="fill:var(--accent)"/>',
  trad: '<path d="M80 16C80 32 40 32 40 46M80 16C80 32 120 32 120 46M40 50C40 64 20 64 20 78M40 50C40 64 60 64 60 78M120 50C120 64 140 64 140 78" fill="none" style="stroke:var(--line)" stroke-width="1.5"/><path d="M80 16C80 32 40 32 40 46M40 50C40 64 60 64 60 78" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle class="a" cx="80" cy="14" r="6"/><circle class="a" cx="40" cy="48" r="5"/><circle class="a" cx="60" cy="80" r="5"/><circle cx="120" cy="48" r="5" style="fill:var(--muted)"/><circle cx="20" cy="80" r="4" style="fill:var(--muted)"/><circle cx="140" cy="80" r="4" style="fill:var(--muted)"/>',
  bro: '<rect x="0" y="68" width="160" height="22" style="fill:var(--line)" opacity=".45"/><line x1="0" y1="68" x2="160" y2="68" style="stroke:var(--line)" stroke-width="1.5"/><path d="M 27 68 A 53 43 0 0 1 133 68" fill="none" style="stroke:var(--muted)" stroke-width="2"/><circle class="a" cx="34" cy="47" r="4"/><circle class="a" cx="80" cy="25" r="5"/><circle cx="126" cy="47" r="4" style="fill:var(--muted)"/>',
  ringar: '<circle cx="62" cy="50" r="30" style="fill:var(--accent);fill-opacity:.15;stroke:var(--accent)" stroke-width="2"/><circle cx="98" cy="50" r="30" style="fill:var(--line-2);fill-opacity:.3;stroke:var(--muted)" stroke-width="2"/>',
  lins: '<rect x="10" y="10" width="140" height="70" rx="4" style="fill:var(--muted);opacity:.35"/><circle cx="96" cy="46" r="22" style="fill:var(--accent);opacity:.55"/><circle cx="96" cy="46" r="26" fill="none" style="stroke:var(--ink,#222)" stroke-width="2"/><rect class="m" x="18" y="18" width="50" height="7" rx="2" style="opacity:.9"/>',
  'mätare': '<path d="M 96 72 A 30 30 0 1 1 136 72" fill="none" style="stroke:var(--line-2)" stroke-width="6" stroke-linecap="round"/><path d="M 96 72 A 30 30 0 0 1 124 22" fill="none" style="stroke:var(--accent)" stroke-width="6" stroke-linecap="round"/><rect class="m" x="14" y="30" width="56" height="9" rx="2" style="opacity:.85"/><rect class="m" x="14" y="46" width="44" height="4" rx="2"/>',
  'ridå': '<rect x="0" y="0" width="160" height="90" style="fill:var(--muted);opacity:.3"/><rect x="0" y="0" width="34" height="90" style="fill:var(--bg,#111)"/><rect x="31" y="0" width="3" height="90" style="fill:var(--accent)"/><rect x="126" y="0" width="34" height="90" style="fill:var(--bg,#111)"/><rect x="126" y="0" width="3" height="90" style="fill:var(--accent)"/><rect class="m" x="40" y="56" width="70" height="12" rx="2"/>',
  'strålkastare': '<ellipse cx="46" cy="10" rx="44" ry="30" style="fill:var(--accent);opacity:.25"/><rect class="m" x="14" y="28" width="46" height="11" rx="2"/><rect x="64" y="28" width="60" height="11" rx="2" style="fill:var(--muted);opacity:.3"/><rect x="14" y="45" width="90" height="11" rx="2" style="fill:var(--muted);opacity:.3"/><rect x="14" y="36" width="46" height="4" style="fill:var(--accent)"/>',
  fokus: '<rect class="m" x="14" y="30" width="36" height="7" rx="2"/><rect x="66" y="16" width="70" height="10" rx="2" style="fill:var(--muted);opacity:.3"/><rect class="a" x="66" y="32" width="78" height="12" rx="2"/><rect class="m" x="66" y="48" width="60" height="4" rx="2"/><rect x="66" y="60" width="64" height="10" rx="2" style="fill:var(--muted);opacity:.3"/>',
  ordbild: '<ellipse cx="80" cy="46" rx="70" ry="36" style="fill:var(--accent);opacity:.18"/><text x="80" y="60" text-anchor="middle" style="font:800 40px system-ui;fill:var(--accent)">Ord</text>',
  'bildfält': '<rect x="56" y="0" width="104" height="90" style="fill:var(--muted);opacity:.35"/><rect x="56" y="0" width="30" height="90" style="fill:var(--bg,#111);opacity:.6"/><rect class="m" x="14" y="30" width="54" height="10" rx="2"/><rect class="a" x="14" y="50" width="6" height="3"/><rect class="m" x="24" y="49" width="36" height="4" rx="2"/><rect class="a" x="14" y="59" width="6" height="3"/><rect class="m" x="24" y="58" width="30" height="4" rx="2"/>',
  delning: '<rect class="m" x="14" y="10" width="60" height="8" rx="2"/><rect x="0" y="32" width="80" height="58" style="fill:var(--muted);opacity:.22"/><rect class="a" x="80" y="32" width="80" height="58"/><rect class="m" x="12" y="66" width="40" height="9" rx="2"/><rect x="92" y="66" width="40" height="9" rx="2" style="fill:#0B0C10"/>',
  ljustal: '<ellipse cx="50" cy="44" rx="50" ry="36" style="fill:var(--accent);opacity:.2"/><text x="14" y="62" style="font:800 42px system-ui;fill:var(--accent)">4/8</text><rect x="14" y="70" width="80" height="6" rx="3" style="fill:var(--muted);opacity:.3"/><rect class="a" x="14" y="70" width="40" height="6" rx="3"/><rect class="m" x="110" y="34" width="36" height="8" rx="2"/>',
  tom: '<rect class="o" x="20" y="16" width="60" height="18" rx="2" stroke-dasharray="3 3"/><circle cx="118" cy="40" r="18" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/><path d="M40 70h44" style="stroke:var(--accent)" stroke-width="3"/><path d="M78 64l8 6-8 6" fill="none" style="stroke:var(--accent)" stroke-width="3"/>',
  egen: '<rect class="o" x="14" y="12" width="132" height="66" rx="6" stroke-dasharray="4 4"/><path class="a" d="M70 36h20M80 26v20" style="stroke:var(--accent);stroke-width:3"/><rect class="m" x="50" y="56" width="60" height="5" rx="2"/>',
  quote: '<text x="14" y="38" style="font:700 34px Georgia,serif;fill:var(--accent)">”</text><rect class="m" x="14" y="44" width="120" height="9" rx="2" style="opacity:.8"/><rect class="m" x="14" y="58" width="84" height="9" rx="2" style="opacity:.8"/><rect class="m" x="14" y="74" width="40" height="4" rx="2"/>'
};
const wf = l => `<svg class="wf" viewBox="0 0 160 90" aria-hidden="true">${WF[l] || ''}</svg>`;

function showEditor() {
  view('ed');
  if (manusOn) toggleManus(false);
  deck.templates = deck.templates || {};
  $('#deckTitle').value = deck.title || '';
  renderTheme();
  cur = Math.max(0, Math.min(cur, deck.slides.length - 1));
  if (pv) pv.destroy();
  pv = Scen.player($('#preview'), deck, { mode: 'preview', images: IMG, start: cur });
  const ov = document.createElement('div'); ov.className = 'sel-ov';
  ov.innerHTML = '<div class="sel-box" hidden>' + ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => `<i data-h="${h}"></i>`).join('') + '</div>';
  $('#preview').appendChild(ov);
  selL = null; snapReset(); updateUndoBtn();
  renderRail(); renderInsp(); setSave('saved');
}
function renderTheme() {
  const T = Scen.THEMES[deck.theme.id] || Scen.THEMES.scen;
  $('#btnTheme').innerHTML = `<span class="tdot" style="background:${(T.v && T.v.accent) || (Scen.ACCENTS[deck.theme.accent] || Scen.ACCENTS.blue)[0]}"></span>Tema: ${esc(T.name)}`;
}
function select(i) {
  if (!deck) return;
  if (editing) finishEdit();
  cur = Math.max(0, Math.min(i, deck.slides.length - 1));
  selL = null; drawSel();
  pv && pv.go(cur, { anim: false, atEnd: true });
  $$('#rail .rail-item').forEach((li, j) => li.classList.toggle('on', j === cur));
  const on = $('#rail .rail-item.on'); on && on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  renderInsp();
}
let pvT = 0, railT = 0, saveT = 0, saving = false, again = false;
function changed(o) {
  o = o || {};
  deck.updatedAt = now();
  trackUndo();
  clearTimeout(pvT); pvT = setTimeout(() => { pv && pv.setDeck(deck, IMG, cur); drawSel(); }, o.now ? 0 : 90);
  clearTimeout(railT); railT = setTimeout(() => o.all ? renderRail() : refreshThumb(cur), o.now ? 0 : 250);
  scheduleSave();
}
function setSave(s, m) {
  const el = $('#saveState'); el.classList.toggle('error', s === 'error');
  el.textContent = { saved: Store.mode === 'memory' ? 'Inte sparad' : 'Sparat', dirty: 'Ändrad…', saving: 'Sparar…', error: m || 'Kunde inte spara' }[s];
  el.title = s === 'error' ? (m || '') : '';
}
function scheduleSave() { setSave('dirty'); clearTimeout(saveT); saveT = setTimeout(doSave, 900); }
async function doSave() {
  if (!deck) return;
  if (saving) { again = true; return; }
  saving = true; setSave('saving');
  const snap = clone(deck);
  snap.imgIds = usedImages(snap);
  try {
    await Store.save(snap);
    const k = decks.findIndex(x => x.id === snap.id); if (k >= 0) decks[k] = snap; else decks.unshift(snap);
    setSave('saved');
  } catch (e) { setSave('error', errMsg(e)); }
  saving = false;
  if (again) { again = false; doSave(); }
}
async function flush() { clearTimeout(saveT); if ($('#saveState').textContent !== 'Sparat') await doSave(); while (saving) await new Promise(r => setTimeout(r, 80)); }

function renderRail() {
  const ol = $('#rail'); ol.innerHTML = '';
  deck.slides.forEach((s, i) => ol.appendChild(railItem(s, i)));
}
function railItem(s, i) {
  const li = document.createElement('li'); li.className = 'rail-item' + (i === cur ? ' on' : ''); li.draggable = true; li.dataset.i = i;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'rail-btn';
  b.setAttribute('aria-label', `Bild ${i + 1}: ${Scen.plain(s.title) || Scen.LAYOUTS[s.layout]}`);
  b.innerHTML = `<span class="rail-n">${i + 1}</span>`; b.appendChild(Scen.thumb(s, deck, IMG, i));
  b.onclick = () => select(i);
  li.appendChild(b);
  li.addEventListener('dragstart', e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/x-scen-slide', String(i)); });
  li.addEventListener('dragover', e => { if (!e.dataTransfer.types.includes('text/x-scen-slide')) return; e.preventDefault(); $$('.drop-before').forEach(x => x.classList.remove('drop-before')); li.classList.add('drop-before'); });
  li.addEventListener('dragleave', () => li.classList.remove('drop-before'));
  li.addEventListener('drop', e => { const f = e.dataTransfer.getData('text/x-scen-slide'); li.classList.remove('drop-before'); if (f === '') return; e.preventDefault(); move(+f, i); });
  return li;
}
function refreshThumb(i) {
  const li = $$('#rail .rail-item')[i]; const s = deck.slides[i]; if (!li || !s) return;
  li.replaceWith(railItem(s, i));
}
function move(from, to) {
  if (from === to || from < 0) return;
  const [s] = deck.slides.splice(from, 1);
  const at = to > from ? to - 1 : to;
  deck.slides.splice(at, 0, s);
  cur = at; changed({ all: true, now: true }); renderInsp();
}
function addSlide(layout, tplId) {
  const s = Object.assign({ id: rid(), layout, steps: true, transition: 'auto' }, clone(DEFAULTS[layout] || {}));
  if (tplId) { s.tpl = tplId; useTemplate(tplId); }
  deck.slides.splice(cur + 1, 0, s);
  cur = cur + 1;
  changed({ all: true, now: true });
  setTimeout(() => select(cur), 10);
}
function layoutPicker(onPick, title, forNew) {
  const syfte = l => (Manus.CATALOG.find(c => c.l === l) || {}).syfte || '';
  const builtin = Object.entries(Scen.LAYOUTS).filter(([k]) => k !== 'egen').map(([k, v]) => `<button type="button" class="lay-btn" data-l="${k}" title="${esc(syfte(k))}">${wf(k)}<span>${esc(v)}</span></button>`).join('');
  const mine = myTpls.map(t => `<button type="button" class="lay-btn" data-tpl="${esc(t.id)}" title="${esc(t.desc || '')}">${wf('egen')}<span>${esc(t.name)}</span></button>`).join('');
  const box = modal(`<h2>${esc(title || 'Lägg till en bild')}</h2>
    ${forNew ? '<div class="tabs" role="tablist"><button type="button" role="tab" class="tab on" data-tab="t1">Mallar</button><button type="button" role="tab" class="tab" data-tab="t2">Från mina presentationer</button></div>' : ''}
    <div data-pane="t1"><div class="lay-grid">${builtin}</div>
    ${mine ? `<h3 class="sub-h">Mina mallar</h3><div class="lay-grid">${mine}</div>` : ''}</div>
    ${forNew ? '<div data-pane="t2" hidden><div class="fld"><label for="libDeck">Presentation</label><select id="libDeck"></select></div><p class="hint">Klicka på en bild för att lägga in en kopia efter bild ' + (cur + 1) + '.</p><div id="libSlides" class="pick-grid"></div></div>' : ''}
    <div class="acts"><button class="btn" data-close>Stäng</button></div>`);
  box.querySelectorAll('.lay-btn[data-l]').forEach(b => b.onclick = () => { closeModal(); onPick(b.dataset.l); });
  box.querySelectorAll('.lay-btn[data-tpl]').forEach(b => b.onclick = () => { closeModal(); onPick('egen', b.dataset.tpl); });
  if (forNew) {
    box.querySelectorAll('.tab').forEach(t => t.onclick = () => {
      box.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t));
      box.querySelectorAll('[data-pane]').forEach(p => p.hidden = p.dataset.pane !== t.dataset.tab);
      if (t.dataset.tab === 't2') fillLibPicker();
    });
  }
}
async function fillLibPicker() {
  const sel = $('#libDeck'); if (!sel || sel.options.length) return;
  const others = decks.filter(d => d.id !== deck.id);
  if (!others.length) { $('#libSlides').innerHTML = '<p class="muted">Du har inga andra presentationer än.</p>'; sel.hidden = true; return; }
  sel.innerHTML = others.map(d => `<option value="${esc(d.id)}">${esc(d.title)}</option>`).join('');
  const show = async () => {
    const src = decks.find(d => d.id === sel.value); if (!src) return;
    const box = $('#libSlides'); box.innerHTML = '<p class="muted">Hämtar…</p>';
    Object.assign(IMG, await safeImages(src.id));
    box.innerHTML = '';
    src.slides.forEach((sl, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pick';
      b.setAttribute('aria-label', 'Lägg in: ' + (Scen.plain(sl.title) || Scen.LAYOUTS[sl.layout]));
      b.appendChild(Scen.thumb(sl, src, IMG, i));
      b.onclick = async () => {
        const c = clone(sl); c.id = rid();
        if (c.layout === 'egen' && src.templates && src.templates[c.tpl]) { deck.templates = deck.templates || {}; deck.templates[c.tpl] = clone(src.templates[c.tpl]); }
        if (c.image && /^img:/.test(c.image)) { const id = c.image.slice(4); if (IMG[id]) { try { await Store.saveImage(deck.id, id, IMG[id]); } catch (e) { toast(errMsg(e)); } } }
        deck.slides.splice(cur + 1, 0, c); cur++;
        changed({ all: true, now: true }); setTimeout(() => select(cur), 10);
        b.classList.add('done'); toast('Bilden är inlagd efter bild ' + cur + '.');
      };
      box.appendChild(b);
    });
  };
  sel.onchange = show; show();
}
const opt = (map, val) => Object.entries(map).map(([k, v]) => `<option value="${k}"${k === val ? ' selected' : ''}>${esc(v)}</option>`).join('');
const valOf = v => Array.isArray(v) ? v.join('\n') : (v == null ? '' : String(v));

function renderInsp() {
  const s = deck.slides[cur]; const box = $('#insp');
  if (!s) { box.innerHTML = ''; return; }
  const L = s.layout;
  let h = `<div class="insp-head"><strong>Bild ${cur + 1} av ${deck.slides.length}</strong><div class="insp-acts">
    <button type="button" class="btn small" data-act="up" ${cur === 0 ? 'disabled' : ''} aria-label="Flytta upp">↑</button>
    <button type="button" class="btn small" data-act="down" ${cur === deck.slides.length - 1 ? 'disabled' : ''} aria-label="Flytta ner">↓</button>
    <button type="button" class="btn small" data-act="dup">Duplicera</button>
    <button type="button" class="btn small danger" data-act="del" ${deck.slides.length < 2 ? 'disabled' : ''}>Ta bort</button></div></div>
    ${SAMPLER ? `<form class="ask" id="askForm"><label for="askIn" class="lab">Be Claude ändra bilden</label><div class="ask-row"><input type="text" id="askIn" placeholder="t.ex. gör om till en omröstning" autocomplete="off"><button type="submit" class="btn small primary">Skicka</button></div><p class="ask-state hint" id="askState" role="status"></p></form>` : ''}
    ${selL && findL(selL) ? layerPanel(findL(selL)) : ''}
    <div class="fld"><label for="f-layout">Mall</label><div class="row2" style="grid-template-columns:1fr auto"><select id="f-layout" data-f="layout" data-t="layout">${opt(Scen.LAYOUTS, L)}</select><button type="button" class="btn small" data-act="layouts">Visa alla</button></div></div>
    <div class="grp"><h3>Innehåll</h3>` + (L === 'tom' ? '<p class="hint">Fri yta har bara fria lager. Lägg till text, bilder och former med knapparna under bilden.</p>' : '');
  (FIELDS[L] || []).forEach(([f, label, t]) => {
    const id = 'f-' + f;
    if (t === 'text') h += `<div class="fld"><label for="${id}">${esc(label)}</label><input type="text" id="${id}" data-f="${f}" data-t="text" value="${esc(valOf(s[f]))}"></div>`;
    else if (t === 'area') h += `<div class="fld"><label for="${id}">${esc(label)}</label><textarea id="${id}" data-f="${f}" data-t="text" rows="3">${esc(valOf(s[f]))}</textarea></div>`;
    else if (t === 'list') h += `<div class="fld"><label for="${id}">${esc(label)}</label><textarea class="list" id="${id}" data-f="${f}" data-t="list" rows="${L === 'trad' ? 10 : 5}">${esc(L === 'trad' ? Scen.lines(s[f]).map(x => { const d = (String(x).match(/^(- )+/) || [''])[0].length / 2; return '  '.repeat(d) + String(x).slice(d * 2); }).join('\n') : valOf(s[f]))}</textarea>${f === 'items' ? '' : '<span class="hint">En per rad. Börja en rad med - för en underpunkt.</span>'}</div>`;
    else if (t === 'check') h += `<label class="chk"><input type="checkbox" id="${id}" data-f="${f}" data-t="check"${s[f] ? ' checked' : ''}> ${esc(label)}</label>`;
    else if (t === 'image') {
      const src = Scen.resolve(s.image, IMG);
      h += `<div class="fld"><span class="lab">${esc(label)}</span><div class="imgf"><div class="ib">${src ? `<img src="${esc(src)}" alt="">` : 'Ingen bild'}</div><div class="b"><button type="button" class="btn small" data-act="img">${src ? 'Byt bild' : 'Välj bild'}</button>${src ? '<button type="button" class="btn small danger" data-act="noimg">Ta bort</button>' : ''}</div></div><span class="hint">Du kan också klistra in en bild med Ctrl+V eller ⌘V.</span></div>`;
      h += `<div class="fld"><label for="f-alt">Bildbeskrivning för skärmläsare</label><input type="text" id="f-alt" data-f="alt" data-t="text" value="${esc(valOf(s.alt))}"></div>`;
    }
    else if (t === 'table') h += tableEditor(s);
    else if (t === 'tplselect') {
      const all = {}; Object.values(deck.templates || {}).forEach(x => all[x.id] = x.name); myTpls.forEach(x => all[x.id] = x.name);
      h += `<div class="fld"><label for="${id}">${esc(label)}</label><select id="${id}" data-t="tpl">${Object.keys(all).length ? opt(all, s.tpl) : '<option value="">Inga egna mallar än</option>'}</select><span class="hint">Egna mallar skapar du under Mallar i biblioteket.</span></div>`;
    }
  });
  h += '</div>' + layerList(s) + `<div class="grp"><h3>Rörelse</h3>
    <div class="row2"><div class="fld"><label for="f-accent">Accentfärg för bilden</label><select id="f-accent" data-f="accent" data-t="text">${opt(Object.assign({'':'Följ presentationens tema'},Object.fromEntries(Object.entries(Scen.ACCENTS).map(([k,v])=>[k,v[2]]))),s.accent||'')}</select></div><div class="fld"><label for="f-transition">Övergång hit</label><select id="f-transition" data-f="transition" data-t="text">${opt(Scen.TRANSITIONS, s.transition || 'auto')}</select></div>
    <div class="fld"><label for="f-bg">Bakgrund</label><select id="f-bg" data-f="bg" data-t="text">${opt(Scen.BACKGROUNDS, s.bg || 'none')}</select></div></div>
    <div class="row2"><div class="fld"><label for="f-ta">Rubrikens rörelse</label><select id="f-ta" data-f="ta" data-t="text">${opt(Scen.TITLE_ANIMS, s.ta || 'auto')}</select></div>
    <div class="fld"><label for="f-ba">Innehållets rörelse</label><select id="f-ba" data-f="ba" data-t="text">${opt(Scen.BODY_ANIMS, s.ba || 'auto')}</select></div></div>`;
  if (STEPPED.includes(L)) h += `<label class="chk"><input type="checkbox" id="f-steps" data-f="steps" data-t="check"${s.steps !== false ? ' checked' : ''}> Visa rubriker och innehåll stegvis, på klick</label>
    <div class="fld"><label for="f-focus">Fokus på aktuellt steg</label><select id="f-focus" data-f="focus" data-t="text"${s.steps === false ? ' disabled' : ''}>${opt(Scen.FOCUS_STYLES,s.focus || (s.dim || (['bro','etapper','vagval','lager','resonemang','helhet','skiften','prisma','verkningar','belagg','sammanflode'].includes(L) && s.dim !== false) ? 'soft' : 'none'))}</select><span class="hint">Mjuk tonar ned tidigare steg. Spotlight ger starkare kontrast. Accentlinje och Inramning markerar det aktuella steget.</span></div>`;
  h += `<span class="hint">Automatisk övergång blir morph när två bilder i rad har samma rubrik eller bild.</span></div>
    <div class="grp"><h3>Anteckningar</h3><div class="fld"><label for="f-notes" class="muted" style="font-weight:400">Finns i lärarversionen (tangent N). Tas bort ur elevversionen.</label><textarea id="f-notes" data-f="notes" data-t="text" rows="4">${esc(valOf(s.notes))}</textarea></div></div>
    <p class="fmt-tip">Skriv <code>**ord**</code> för att markera, <code>x^2</code> eller <code>x^{2}</code> för upphöjt och <code>v_{0}</code> för nedsänkt.</p>`;
  box.innerHTML = h;
}
function tableEditor(s) {
  const t = s.table = s.table || { header: true, reveal: 'rows', rows: [['', ''], ['', '']] };
  const n = t.rows.reduce((m, r) => Math.max(m, r.length), 1);
  let g = '';
  t.rows.forEach((r, ri) => {
    g += `<tr${t.header && ri === 0 ? ' class="hd"' : ''}>`;
    for (let c = 0; c < n; c++) g += `<td><input type="text" aria-label="Rad ${ri + 1}, kolumn ${c + 1}" data-t="cell" data-r="${ri}" data-c="${c}" value="${esc(r[c] || '')}"></td>`;
    g += '</tr>';
  });
  return `<div class="fld"><span class="lab">Tabell</span><div class="tbl-ed"><table>${g}</table></div>
    <div class="tbl-btns"><button type="button" class="btn small" data-act="row+">+ Rad</button><button type="button" class="btn small" data-act="col+">+ Kolumn</button><button type="button" class="btn small" data-act="row-" ${t.rows.length < 2 ? 'disabled' : ''}>− Rad</button><button type="button" class="btn small" data-act="col-" ${n < 2 ? 'disabled' : ''}>− Kolumn</button></div>
    <span class="hint">Klistra in celler från Excel eller Sheets direkt i en ruta.</span></div>
    <label class="chk"><input type="checkbox" id="f-thead" data-t="thead"${t.header ? ' checked' : ''}> Första raden är rubriker</label>
    <div class="fld"><label for="f-reveal">Visa</label><select id="f-reveal" data-t="reveal">${opt({ none: 'Hela tabellen direkt', rows: 'En rad i taget', answers: 'Sista kolumnen en rad i taget (facit)', rest: 'Allt utom första kolumnen, en rad i taget (facit)' }, t.reveal || 'none')}</select></div>`;
}
function onInspInput(e) {
  const el = e.target; const t = el.dataset.t; if (!t || !deck) return;
  const s = deck.slides[cur];
  if (t === 'text') s[el.dataset.f] = el.value;
  else if (t === 'list') s[el.dataset.f] = s.layout === 'trad' ? el.value.split('\n').map(x => { const d = Math.floor(x.replace(/\t/g, '  ').match(/^\s*/)[0].length / 2); return '- '.repeat(d) + x.trim(); }) : el.value.split('\n');
  else if (t === 'check') { s[el.dataset.f] = el.checked; if (el.dataset.f === 'steps') { const d = $('#f-focus'); if (d) d.disabled = !el.checked; } }
  else if (t === 'layout') {
    s.layout = el.value;
    const def = DEFAULTS[el.value] || {};
    Object.keys(def).forEach(k => { if (s[k] == null || s[k] === '' || (Array.isArray(s[k]) && !s[k].join(''))) s[k] = clone(def[k]); });
    if (el.value === 'table' && !s.table) s.table = clone(DEFAULTS.table.table);
    changed({ now: true }); renderInsp(); return;
  }
  else if (t === 'cell') { const r = +el.dataset.r, c = +el.dataset.c; const row = s.table.rows[r]; while (row.length <= c) row.push(''); row[c] = el.value; }
  else if (t === 'thead') { s.table.header = el.checked; changed(); renderInsp(); return; }
  else if (t === 'reveal') s.table.reveal = el.value;
  else if (t === 'ly') {
    const l = findL(selL); if (!l) return;
    const k = el.dataset.k;
    if (el.type === 'checkbox') l[k] = el.checked;
    else if (el.type === 'number') { const v = parseFloat(el.value); if (isNaN(v)) return; l[k] = v; }
    else { if (el.value === '') delete l[k]; else l[k] = el.value; }
    changed(); return;
  }
  else if (t === 'tpl') { s.tpl = el.value; useTemplate(el.value); changed({ now: true }); return; }
  changed();
}
function onInspClick(e) {
  const b = e.target.closest('[data-act]'); if (!b || !deck) return;
  const s = deck.slides[cur]; const a = b.dataset.act;
  if (/^(ly|tofree)/.test(a) && layerAct(a, b.dataset.id)) return;
  if (a === 'up' && cur > 0) move(cur, cur - 1);
  else if (a === 'down' && cur < deck.slides.length - 1) move(cur, cur + 2);
  else if (a === 'dup') { const c = clone(s); c.id = rid(); deck.slides.splice(cur + 1, 0, c); cur++; changed({ all: true, now: true }); setTimeout(() => select(cur), 10); }
  else if (a === 'del') {
    if (b.dataset.sure) { deck.slides.splice(cur, 1); cur = Math.min(cur, deck.slides.length - 1); changed({ all: true, now: true }); setTimeout(() => select(cur), 10); }
    else { b.dataset.sure = '1'; b.textContent = 'Säker?'; b.classList.add('solid'); setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.textContent = 'Ta bort'; b.classList.remove('solid'); } }, 3000); }
  }
  else if (a === 'layouts') layoutPicker(l => { const sel = $('#f-layout'); sel.value = l; sel.dispatchEvent(new Event('input', { bubbles: true })); }, 'Byt layout för den här bilden');
  else if (a === 'img') { const f = $('#imgfile'); f.value = ''; f.click(); }
  else if (a === 'noimg') { s.image = ''; changed(); renderInsp(); }
  else if (a === 'row+') { const n = s.table.rows.reduce((m, r) => Math.max(m, r.length), 1); s.table.rows.push(Array(n).fill('')); changed(); renderInsp(); }
  else if (a === 'row-') { s.table.rows.pop(); changed(); renderInsp(); }
  else if (a === 'col+') { s.table.rows.forEach(r => r.push('')); changed(); renderInsp(); }
  else if (a === 'col-') { const n = s.table.rows.reduce((m, r) => Math.max(m, r.length), 1); s.table.rows.forEach(r => { r.length = Math.min(r.length, n - 1); }); changed(); renderInsp(); }
}
function onInspPaste(e) {
  const el = e.target; if (el.dataset.t !== 'cell') return;
  const txt = (e.clipboardData || window.clipboardData).getData('text');
  if (!/[\t\n]/.test(txt.trim())) return;
  e.preventDefault();
  const s = deck.slides[cur]; const r0 = +el.dataset.r, c0 = +el.dataset.c;
  txt.replace(/\r/g, '').replace(/\n$/, '').split('\n').forEach((line, i) => {
    const row = s.table.rows[r0 + i] || (s.table.rows[r0 + i] = []);
    line.split('\t').forEach((v, j) => { while (row.length < c0 + j) row.push(''); row[c0 + j] = v.trim(); });
  });
  const n = s.table.rows.reduce((m, r) => Math.max(m, r.length), 1);
  s.table.rows.forEach(r => { while (r.length < n) r.push(''); });
  changed(); renderInsp();
}
async function setImage(file, target) {
  if (!file || !deck) return;
  target = target || imgTarget || 'slide'; imgTarget = 'slide';
  const s = deck.slides[cur];
  toast('Förbereder bilden…');
  const ext = (file.name || '').split('.').pop() || (file.type || '').split('/').pop();
  let url;
  try { url = await PptxImport.compress(file, ext); } catch (e) { url = null; }
  if (!url) { toast('Bilden kunde inte läsas. Prova JPG eller PNG.'); return; }
  const id = rid(); IMG[id] = url;
  try { await Store.saveImage(deck.id, id, url); } catch (e) { toast('Bilden visas men kunde inte sparas: ' + errMsg(e)); }
  if (target === 'layer' || target === 'lyreplace') {
    const dims = await new Promise(res => { const im = new Image(); im.onload = () => res([im.naturalWidth, im.naturalHeight]); im.onerror = () => res([4, 3]); im.src = url; });
    if (target === 'lyreplace' && selL && findL(selL)) findL(selL).src = 'img:' + id;
    else {
      const w = 720, h = Math.round(Math.min(900, w * dims[1] / Math.max(1, dims[0])));
      const l = { id: rid(), type: 'bild', x: Math.round(960 - w / 2), y: Math.round(540 - h / 2), w, h, src: 'img:' + id };
      (s.layers = s.layers || []).push(l); selL = l.id;
    }
    changed({ now: true }); renderInsp(); toast('Bilden är tillagd. Dra den dit du vill ha den.');
    return;
  }
  if (['timeline', 'question'].includes(s.layout)) s.layout = (s.bullets && Scen.lines(s.bullets).length) || s.text ? 'split' : 'image';
  s.image = 'img:' + id;
  changed({ now: true }); renderInsp();
  toast('Bilden är tillagd.');
}
async function cleanupImages(d) {
  if (!d) return;
  try {
    const used = new Set(usedImages(d));
    const stored = await Store.loadImages(d.id);
    for (const id of Object.keys(stored)) if (!used.has(id)) await Store.deleteImage(d.id, id);
  } catch (e) { /* inte kritiskt */ }
}
function previewPlay() {
  if (!pv) return;
  if (cur > 0) { pv.go(cur - 1, { anim: false, atEnd: true }); setTimeout(() => { pv.go(cur, { anim: true, dir: 1 }); setTimeout(() => pv.autoplay && autoSteps(), 50); }, 350); }
  else { pv.replay(); autoSteps(); }
}
function autoSteps() {
  const n = pv.steps(); if (!n) return;
  let k = 0; clearInterval(autoSteps._t);
  autoSteps._t = setInterval(() => { if (!pv || k >= n) { clearInterval(autoSteps._t); return; } pv.next(); k++; }, 1150);
}

/* =================== egna mallar =================== */
function useTemplate(id) {
  if (!id || !deck) return;
  const t = myTpls.find(x => x.id === id);
  if (t) { deck.templates = deck.templates || {}; deck.templates[id] = { id: t.id, name: t.name, desc: t.desc || '', html: t.html, css: t.css }; }
}
async function loadTemplates() {
  let mine = [], repo = [];
  try { mine = await Store.listTemplates(); } catch (e) { mine = []; }
  if (Array.isArray(window.SCEN_MALLAR)) window.SCEN_MALLAR.forEach(t => { if (t && t.id && t.html) repo.push(Object.assign({ repo: true }, t)); });
  else try {
    const r = await fetch('mallar/index.json', { cache: 'no-cache' });
    if (r.ok) for (const f of await r.json()) {
      try { const t = await (await fetch('mallar/' + f, { cache: 'no-cache' })).json(); if (t && t.id && t.html) { t.repo = true; repo.push(t); } } catch (e) { /* hoppa över */ }
    }
  } catch (e) { /* inte ett repo */ }
  const ids = new Set(mine.map(t => t.id));
  myTpls = mine.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).concat(repo.filter(t => !ids.has(t.id)));
}
const STARTER = {
  name: 'Numrerade kort', desc: 'Tre till fyra steg eller principer med stora siffror.',
  html: '<p class="eyebrow">{{etikett}}</p>\n<h2>{{rubrik}}</h2>\n<p class="lead">{{text}}</p>\n<ol class="nums">{{punkter}}</ol>',
  css: '& { align-content: center; gap: 36px; }\n.eyebrow { color: var(--accent); font-size: 32px; font-weight: 600; margin: 0; }\n.nums { list-style: none; margin: 16px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); grid-auto-flow: column; gap: 48px; counter-reset: n; }\n.nums li { counter-increment: n; border-top: 3px solid var(--accent); padding-top: 24px; display: grid; gap: 12px; align-content: start; }\n.nums li::before { content: counter(n, decimal-leading-zero); font-family: var(--font-display); font-size: 100px; font-weight: 700; line-height: 1; color: var(--accent); }\n.nums b { font-size: 40px; }\n.nums span { font-size: 30px; line-height: 1.35; color: var(--muted); }'
};
const TPL_SAMPLE = { layout: 'egen', tpl: 'preview', caption: 'Etikett', title: 'Rubrik som visar mallen', text: 'En kort text som förklarar sammanhanget.', items: ['Första | En kort förklaring', 'Andra | En kort förklaring', 'Tredje | En kort förklaring'], answer: 'Ett svar', steps: true };
function tplThumb(t, theme) {
  const d = { theme: theme || { id: 'scen', accent: 'blue', look: 'auto' }, templates: { preview: { html: t.html, css: t.css } }, slides: [] };
  return Scen.thumb(TPL_SAMPLE, d, IMG, 0);
}
function templateEditor(t, onSaved) {
  const isNew = !t || !t.id;
  t = Object.assign({ id: 'tpl-' + rid(), name: '', desc: '', html: '', css: '' }, t || {});
  const box = modal(`<h2>${isNew ? 'Ny mall' : 'Redigera mall'}</h2>
    <div class="tpl-ed">
      <div class="tpl-form">
        <div class="fld"><label for="teName">Namn</label><input type="text" id="teName" value="${esc(t.name)}"></div>
        <div class="fld"><label for="teDesc">När passar mallen?</label><input type="text" id="teDesc" value="${esc(t.desc)}"><span class="hint">Claude läser det här när den väljer mallar.</span></div>
        <div class="fld"><label for="teHtml">HTML</label><textarea id="teHtml" class="code" rows="8" spellcheck="false">${esc(t.html)}</textarea>
          <span class="hint">Platshållare: <code>{{rubrik}}</code> <code>{{text}}</code> <code>{{etikett}}</code> <code>{{svar}}</code> <code>{{bild}}</code> och <code>{{punkter}}</code>, som blir &lt;li&gt; som visas en i taget.</span></div>
        <div class="fld"><label for="teCss">CSS</label><textarea id="teCss" class="code" rows="8" spellcheck="false">${esc(t.css)}</textarea>
          <span class="hint">Gäller bara den här mallen. Använd <code>var(--accent)</code>, <code>var(--ink)</code>, <code>var(--muted)</code>, <code>var(--surface)</code> och <code>var(--font-display)</code> så följer mallen temat. Bilden är 1920×1080.</span></div>
      </div>
      <div class="tpl-prev"><span class="lab">Förhandsvisning</span><div id="tePrev"></div>
        <label class="fld"><span class="lab">Visa i tema</span><select id="teTheme" class="sel">${opt(Object.fromEntries(Object.entries(Scen.THEMES).map(([k, v]) => [k, v.name])), (deck && deck.theme.id) || 'scen')}</select></label></div>
    </div>
    <div class="acts"><button class="btn" data-close>Avbryt</button><button class="btn primary" id="teSave">Spara mallen</button></div>`, { sticky: true });
  box.classList.add('wide');
  const read = () => ({ id: t.id, name: $('#teName').value.trim() || 'Namnlös mall', desc: $('#teDesc').value.trim(), html: $('#teHtml').value, css: $('#teCss').value });
  const prev = () => { const p = $('#tePrev'); p.innerHTML = ''; p.appendChild(tplThumb(read(), { id: $('#teTheme').value, accent: 'auto', look: 'auto' })); };
  let pt = 0; box.addEventListener('input', () => { clearTimeout(pt); pt = setTimeout(prev, 200); });
  $('#teTheme').onchange = prev; prev();
  $('#teSave').onclick = async () => {
    const v = read(); v.updatedAt = now();
    try {
      await Store.saveTemplate(v);
      const k = myTpls.findIndex(x => x.id === v.id); if (k >= 0) myTpls[k] = v; else myTpls.unshift(v);
      if (deck && deck.templates && deck.templates[v.id]) { useTemplate(v.id); changed({ all: true }); }
      closeModal(); toast('Mallen är sparad.'); onSaved && onSaved(v);
    } catch (e) { toast('Kunde inte spara mallen: ' + errMsg(e)); }
  };
}

/* =================== mallsidan =================== */
async function showTemplates() {
  view('tpl');
  const main = $('#tplMain');
  const cats = ['Fokusvandring', 'Jämförelse', 'Begrepp', 'Signatur', 'Ljus', 'Banor', 'System', 'Redaktionellt', 'Struktur', 'Listor och steg', 'Data', 'Bild', 'Interaktivt'];
  const theme = { id: 'scen', accent: 'blue', look: 'auto' };
  main.innerHTML = `<div class="lib-head"><div><h1>Mallar</h1><p class="muted">Mallarna är byggstenarna i Scen. Samma katalog läser Claude när den planerar en presentation åt dig. Skriv manus med mallens namn inom hakparentes.</p></div></div>
    <section class="tpl-sec"><div class="sec-head"><h2>Mina mallar</h2><div class="acts">${SAMPLER ? '<button type="button" class="btn" id="tplAi">Ny mall med Claude</button>' : ''}<button type="button" class="btn" id="tplNew">Ny mall för hand</button></div></div><div class="tgrid" id="myTplGrid"></div></section>
    ${cats.map(c => `<section class="tpl-sec"><h2>${esc(c)}</h2><div class="tgrid" data-cat="${esc(c)}"></div></section>`).join('')}`;
  Manus.CATALOG.forEach(c => {
    const g = main.querySelector(`[data-cat="${c.cat}"]`); if (!g) return;
    const sl = Manus.parseBlock(c.ex); if (['split', 'image', 'bildkant', 'omslag', 'lins', 'ridå', 'ordbild', 'bildfält'].includes(sl.layout)) sl.image = 'img:ex-parabel';
    const th0 = c.cat === 'Redaktionellt' ? { id: 'atlas', accent: 'auto' } : (c.cat === 'Banor' || c.cat === 'System') ? { id: 'bana', accent: 'auto' } : c.cat === 'Ljus' ? { id: 'djup', accent: 'auto' } : theme;
    const el = document.createElement('article'); el.className = 'tcard';
    const th = document.createElement('div'); th.className = 'tthumb'; th.appendChild(Scen.thumb(sl, { theme: th0, slides: [] }, IMG, 0));
    el.appendChild(th);
    el.insertAdjacentHTML('beforeend', `<h3>${esc(c.name)} <code>[${esc(c.tag)}]</code></h3><p>${esc(c.syfte)}</p><p class="muted small">Undvik: ${esc(c.undvik)}</p>${c.from ? `<p class="muted small">Efter Slidecraft-mallen ${esc(c.from)} (MIT-licens, Joel Rangsjö m.fl.)</p>` : ''}
      <details><summary>Manus</summary><pre>${esc(c.ex)}</pre></details>`);
    g.appendChild(el);
  });
  $('#tplNew').onclick = () => templateEditor(Object.assign({}, STARTER), renderMyTpls);
  if ($('#tplAi')) $('#tplAi').onclick = claudeTemplate;
  await loadTemplates();
  renderMyTpls();
}
function renderMyTpls() {
  const g = $('#myTplGrid'); if (!g) return;
  g.innerHTML = '';
  if (!myTpls.length) { g.innerHTML = '<p class="muted">Inga egna mallar än. En mall du gör snygg en gång kan du använda i alla presentationer.</p>'; return; }
  myTpls.forEach(t => {
    const el = document.createElement('article'); el.className = 'tcard';
    const th = document.createElement('div'); th.className = 'tthumb'; th.appendChild(tplThumb(t)); el.appendChild(th);
    el.insertAdjacentHTML('beforeend', `<h3>${esc(t.name)} <code>[egen: ${esc(t.id)}]</code></h3><p>${esc(t.desc || '')}</p>${t.repo ? '<p class="muted small">Från mappen mallar i repot. Ändringar sparas som din egen kopia.</p>' : ''}`);
    const acts = document.createElement('div'); acts.className = 'acts left';
    const e = document.createElement('button'); e.type = 'button'; e.className = 'btn small'; e.textContent = 'Redigera'; e.onclick = () => templateEditor(t, renderMyTpls);
    const d = document.createElement('button'); d.type = 'button'; d.className = 'btn small danger'; d.textContent = 'Ta bort';
    d.onclick = async () => {
      if (!d.dataset.sure) { d.dataset.sure = '1'; d.textContent = 'Säker?'; d.classList.add('solid'); return; }
      try { await Store.removeTemplate(t.id); myTpls = myTpls.filter(x => x.id !== t.id); renderMyTpls(); toast('Mallen är borttagen. Presentationer som använder den behåller sin kopia.'); } catch (err) { toast(errMsg(err)); }
    };
    const f = document.createElement('button'); f.type = 'button'; f.className = 'btn small'; f.textContent = 'Spara som fil';
    f.onclick = async () => { try { await saveFile(t.id + '.json', new Blob([JSON.stringify({ id: t.id, name: t.name, desc: t.desc || '', html: t.html, css: t.css }, null, 2)], { type: 'application/json' })); toast('Lägg filen i mappen mallar och lägg till namnet i mallar/index.json.'); } catch (err) { if (!err || err.code !== 'declined') toast(errMsg(err)); } };
    if (t.repo) acts.append(e, f); else acts.append(e, f, d);
    el.appendChild(acts); g.appendChild(el);
  });
}

/* =================== teman =================== */
function themePicker() {
  const cur0 = deck.slides[cur] || deck.slides[0];
  const box = modal(`<h2>Välj tema</h2><p class="muted">Ett tema är en hel visuell identitet: typsnitt, färger, former och rörelse. Innehållet står kvar.</p>
    <div class="theme-grid" id="themeGrid"></div>
    <div class="grp" id="scenOpts"><h3>Scen-temats färg och läge</h3><div class="swatches" id="accents"></div>
      <select id="look" class="sel" aria-label="Ljust eller mörkt"><option value="auto">Följ systemet</option><option value="light">Ljust</option><option value="dark">Mörkt</option></select></div>
    <div class="acts"><button class="btn primary" data-close>Klar</button></div>`);
  box.classList.add('wide');
  const draw = () => {
    const g = $('#themeGrid'); g.innerHTML = '';
    Object.entries(Scen.THEMES).forEach(([id, T]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'theme-card' + ((deck.theme.id || 'scen') === id ? ' on' : '');
      b.setAttribute('aria-pressed', String((deck.theme.id || 'scen') === id));
      const d = Object.assign({}, deck, { theme: Object.assign({}, deck.theme, { id, accent: id === 'scen' ? (deck.theme.accent && deck.theme.accent !== 'auto' ? deck.theme.accent : 'blue') : 'auto' }) });
      b.appendChild(Scen.thumb(cur0, d, IMG, cur));
      b.insertAdjacentHTML('beforeend', `<strong>${esc(T.name)}</strong><span>${esc(T.desc)}</span>`);
      b.onclick = () => {
        deck.theme.id = id;
        if (id !== 'scen') deck.theme.accent = 'auto'; else if (!deck.theme.accent || deck.theme.accent === 'auto') deck.theme.accent = 'blue';
        renderTheme(); changed({ all: true, now: true }); draw();
      };
      g.appendChild(b);
    });
    $('#scenOpts').hidden = (deck.theme.id || 'scen') !== 'scen';
    const a = $('#accents'); a.innerHTML = '';
    Object.entries(Scen.ACCENTS).forEach(([k, v]) => {
      const s = document.createElement('button'); s.type = 'button'; s.className = 'sw'; s.style.background = v[0];
      s.title = v[2]; s.setAttribute('aria-label', 'Färg ' + v[2]); s.setAttribute('aria-pressed', String(deck.theme.accent === k));
      s.onclick = () => { deck.theme.accent = k; renderTheme(); changed({ all: true, now: true }); draw(); };
      a.appendChild(s);
    });
    $('#look').value = deck.theme.look || 'auto';
  };
  box.addEventListener('change', e => { if (e.target.id === 'look') { deck.theme.look = e.target.value; changed({ all: true, now: true }); draw(); } });
  draw();
}

/* =================== manusläge =================== */
let manusOn = false, manusT = 0;
function toggleManus(on) {
  manusOn = on == null ? !manusOn : on;
  $('.ed-body').classList.toggle('manus', manusOn);
  $('#btnManus').setAttribute('aria-pressed', String(manusOn));
  $('#manusPane').hidden = !manusOn;
  if (manusOn) {
    const ta = $('#manusText'); ta.value = Manus.stringify(deck); $('#manusErr').textContent = '';
    ta.focus(); ta.setSelectionRange(0, 0);
    const pos = locateSlide(ta.value, cur); ta.setSelectionRange(pos, pos); ta.blur(); ta.focus();
  } else { renderRail(); renderInsp(); }
}
function locateSlide(text, i) {
  const fm = text.match(/^\s*---\n[\s\S]*?\n---\s*\n/); let p = fm ? fm[0].length : 0;
  const re = /\n\s*---\s*\n/g; re.lastIndex = p; let n = 0, m;
  while (n < i && (m = re.exec(text))) { p = m.index + m[0].length; n++; }
  return p;
}
function applyManus() {
  const text = $('#manusText').value;
  let parsed;
  try { parsed = Manus.parse(text); } catch (e) { $('#manusErr').textContent = 'Kunde inte läsa manuset: ' + errMsg(e); return; }
  if (!parsed.slides.length) { $('#manusErr').textContent = 'Manuset innehåller inga bilder än.'; return; }
  $('#manusErr').textContent = '';
  trackUndo();
  const old = deck.slides;
  deck.slides = parsed.slides.map((s, i) => {
    const o = old[i] || {};
    s.id = o.id || rid();
    if (s.image === 'img:(inbäddad bild)') s.image = o.image || '';
    if (s.layout === 'egen') useTemplate(s.tpl);
    return s;
  });
  Manus.applyMeta(deck, parsed.meta);
  $('#deckTitle').value = deck.title; renderTheme();
  cur = Math.min(cur, deck.slides.length - 1);
  deck.updatedAt = now();
  pv && pv.setDeck(deck, IMG, cur);
  scheduleSave();
}
function manusCursor() {
  const ta = $('#manusText'); const i = Manus.slideAt(ta.value, ta.selectionStart);
  if (i !== cur && i < deck.slides.length) { cur = i; pv && pv.go(cur, { anim: false, atEnd: true }); }
}

/* =================== Claude =================== */
const SAMPLE_ERR = {
  not_granted: 'Du har inte gett sidan lov att använda Claude.', sampling_disabled: 'Claude är inte tillgängligt för ditt konto här.',
  rate_limited: 'För många förfrågningar just nu. Vänta en stund och försök igen.', refused: 'Claude ville inte svara på den här förfrågan. Formulera om den.',
  prompt_too_large: 'Underlaget är för långt. Korta ner det och försök igen.', session_expired: 'Logga in i claude.ai igen.',
  invalid_json: 'Svaret gick inte att läsa. Försök igen.', empty_completion: 'Claude svarade inte. Försök med en enklare beskrivning.'
};
const sampleMsg = e => SAMPLE_ERR[e && e.code] || 'Något gick fel hos Claude. Försök igen.';
function compactCatalog() { return Manus.CATALOG.map(c => `[${c.tag}] ${c.syfte}`).concat(myTpls.map(t => `[egen: ${t.id}] ${t.name}. ${t.desc || ''}`)).join('\n'); }
function plannerPrompt(o) {
  const insert = o.mode === 'insert';
  return `Du är planeraren i presentationsverktyget Scen och skriver presentationer för lärare, på svenska.

${Manus.FORMAT}

MALLKATALOG. Välj den mall som bäst bär varje innehåll och variera mellan dem.
${Manus.catalogText(myTpls)}

REGLER
- Svara med manus och inget annat, ingen text före eller efter.
- ${insert ? 'Skriv bara de nya bilderna, utan huvud. Börja direkt med första bilden.' : 'Börja med huvudet (titel och tema) och sedan en [titel]-bild.'}
- En idé per bild. Rubriker under 70 tecken, punkter under 90 tecken, kort-texter under 110 tecken.
- Använd [avsnitt] för att dela in längre presentationer i delar.
- Ta med minst en interaktiv bild ([omröstning], [reflektion] eller [fråga]) per åtta bilder.
- Skriv inte "bild:". Föreslå bilder i talaranteckningar, t.ex. "> Bildförslag: ...".
- Skriv korta talaranteckningar (> ) med vad läraren kan säga eller fråga.
- Hitta inte på statistik, citat, årtal eller källor. Använd bara fakta du är säker på eller som står i underlaget. Saknas siffror: använd inte [tal] eller [två-tal].
${insert ? '' : `- Tema: ${o.theme}`}

UPPDRAG
Ämne: ${o.brief}
Målgrupp: ${o.audience || 'gymnasieelever'}
Antal bilder: ${o.count}
${insert ? `De nya bilderna läggs in efter bild ${cur + 1} i en befintlig presentation. Rubrikerna i den:\n${deck.slides.map((s, i) => `${i + 1}. ${Scen.plain(s.title) || Scen.LAYOUTS[s.layout]}`).join('\n').slice(0, 4000)}` : ''}
${o.material ? `\nUNDERLAG\n${o.material.slice(0, 40000)}` : ''}`;
}
function planner(mode) {
  if (!SAMPLER) { toast('Claude är inte tillgängligt i den här vyn.'); return; }
  const insert = mode === 'insert';
  const box = modal(`<h2>${insert ? 'Lägg till bilder med Claude' : 'Skapa en presentation med Claude'}</h2>
    <p class="muted">Claude väljer mallar ur katalogen och skriver ett manus som du sedan kan redigera fritt.</p>
    <form id="plForm" class="pl-form">
      <div class="fld"><label for="plBrief">${insert ? 'Vad ska de nya bilderna ta upp?' : 'Vad ska presentationen handla om?'}</label><textarea id="plBrief" rows="3" required placeholder="t.ex. Hur en språkmodell fungerar, för en lektion på 40 minuter"></textarea></div>
      <div class="row3">
        <div class="fld"><label for="plAud">Målgrupp</label><input type="text" id="plAud" value="Gymnasiet"></div>
        <div class="fld"><label for="plCount">Antal bilder</label><select id="plCount">${insert ? '<option>2–3</option><option selected>3–5</option><option>5–8</option>' : '<option>6–8</option><option selected>10–14</option><option>15–20</option>'}</select></div>
        ${insert ? '' : `<div class="fld"><label for="plTheme">Tema</label><select id="plTheme">${opt(Object.fromEntries(Object.entries(Scen.THEMES).map(([k, v]) => [k, v.name])), 'natt')}</select></div>`}
      </div>
      <div class="fld"><label for="plMat">Underlag (valfritt)</label><textarea id="plMat" rows="5" placeholder="Klistra in anteckningar, en text, en kursplan eller manus från en gammal presentation."></textarea>
        <div class="acts left">${decks.length ? `<select id="plFrom" class="sel"><option value="">Hämta manus från en presentation…</option>${decks.map(d => `<option value="${esc(d.id)}">${esc(d.title)}</option>`).join('')}</select>` : ''}<button type="button" class="btn small" id="plFile">Läs in fil (.txt, .md, .pptx)</button></div></div>
      <div class="acts"><button type="button" class="btn" data-close>Avbryt</button><button type="submit" class="btn primary" id="plGo">${insert ? 'Skapa bilderna' : 'Skapa presentationen'}</button></div>
    </form>
    <div id="plOut" hidden><p class="pl-state" id="plState" role="status">Claude tänker…</p><pre class="pl-stream" id="plStream"></pre><div class="acts"><button type="button" class="btn" id="plStop">Avbryt</button></div></div>`, { sticky: true });
  box.classList.add('wide');
  if ($('#plFrom')) $('#plFrom').onchange = e => { const d = decks.find(x => x.id === e.target.value); if (d) { $('#plMat').value = Manus.stringify(d); } };
  $('#plFile').onclick = () => {
    const f = document.createElement('input'); f.type = 'file'; f.accept = '.txt,.md,.markdown,.mdx,.pptx';
    f.onchange = async () => {
      const file = f.files[0]; if (!file) return;
      try {
        if (/\.pptx$/i.test(file.name)) { const r = await PptxImport.run(file, () => {}); $('#plMat').value = Manus.stringify(r.deck).replace(/^bild: .*$/gm, ''); }
        else $('#plMat').value = (await file.text()).slice(0, 40000);
        toast('Underlaget är inläst.');
      } catch (e) { toast('Filen kunde inte läsas: ' + errMsg(e)); }
    };
    f.click();
  };
  $('#plForm').onsubmit = async ev => {
    ev.preventDefault();
    const o = { mode, brief: $('#plBrief').value.trim(), audience: $('#plAud').value.trim(), count: $('#plCount').value, theme: $('#plTheme') ? $('#plTheme').value : 'natt', material: $('#plMat').value.trim() };
    if (!o.brief) return;
    $('#plForm').hidden = true; $('#plOut').hidden = false;
    const ctl = new AbortController();
    $('#plStop').onclick = () => ctl.abort();
    const stream = $('#plStream');
    try {
      const { text, truncated } = await SAMPLER(plannerPrompt(o), { signal: ctl.signal, cache: false, onText: ({ text }) => { $('#plState').textContent = 'Claude skriver manus…'; stream.textContent = text; stream.scrollTop = stream.scrollHeight; } });
      const clean = text.replace(/^```[a-z]*\n?|```\s*$/gm, '');
      const parsed = Manus.parse(clean);
      if (!parsed.slides.length) throw { code: 'empty_completion' };
      parsed.slides.forEach(s => { s.id = rid(); if (s.image) delete s.image; if (s.layout === 'egen') useTemplate(s.tpl); });
      if (insert) {
        deck.slides.splice(cur + 1, 0, ...parsed.slides);
        parsed.slides.forEach(s => { if (s.layout === 'egen') useTemplate(s.tpl); });
        closeModal(); cur = cur + 1; changed({ all: true, now: true }); setTimeout(() => select(cur), 10);
        toast(`${plural(parsed.slides.length, 'ny bild', 'nya bilder')} från Claude.${truncated ? ' Svaret blev avkortat.' : ''}`);
      } else {
        const d = normalize({ id: rid(), title: 'Ny presentation', theme: { id: o.theme, accent: 'auto', look: 'auto' }, slides: parsed.slides, createdAt: now(), updatedAt: now(), templates: {} });
        Manus.applyMeta(d, parsed.meta);
        const saveDeck = deck; deck = d; parsed.slides.forEach(s => { if (s.layout === 'egen') useTemplate(s.tpl); }); deck = saveDeck;
        await Store.save(d); decks.unshift(d);
        closeModal(); deck = clone(d); cur = 0; showEditor();
        toast(`Klart: ${plural(d.slides.length, 'bild', 'bilder')}. Byt tema eller öppna Manus för att redigera som text.${truncated ? ' Svaret blev avkortat.' : ''}`);
      }
    } catch (e) {
      if (e && e.code === 'cancelled') { closeModal(); return; }
      $('#plState').textContent = sampleMsg(e);
      $('#plStop').textContent = 'Stäng'; $('#plStop').onclick = closeModal;
    }
  };
}
let askUndo = null;
async function askSlide(instruction) {
  const st = $('#askState'); const s = deck.slides[cur]; const at = cur;
  const btn = $('#askForm button'); btn.disabled = true; st.textContent = 'Claude tänker…';
  const prompt = `Du redigerar en bild i presentationsverktyget Scen, på svenska.

${Manus.FORMAT}

MALLAR
${compactCatalog()}

NUVARANDE BILD
${Manus.stringifySlide(s, deck)}

ÖNSKEMÅL
${instruction}

Svara med en eller flera bilder i manusformat, utan huvud och utan annan text. Flera bilder skiljs åt med en rad med bara ---. Behåll raden "bild:" oförändrad om den finns. Hitta inte på fakta, siffror eller källor.`;
  try {
    const { text } = await SAMPLER(prompt, { cache: false, onText: () => { st.textContent = 'Claude skriver…'; } });
    const parsed = Manus.parse(text.replace(/^```[a-z]*\n?|```\s*$/gm, ''));
    if (!parsed.slides.length) throw { code: 'empty_completion' };
    askUndo = { at, old: clone(s), n: parsed.slides.length };
    parsed.slides.forEach((n, i) => { n.id = i === 0 ? s.id : rid(); if (!n.image && s.image && i === 0 && ['split', 'image', 'cards', 'title', 'statement', 'section', 'bullets', 'compare'].includes(n.layout)) n.image = s.image; if (n.layout === 'egen') useTemplate(n.tpl); });
    deck.slides.splice(at, 1, ...parsed.slides);
    cur = at; changed({ all: true, now: true }); renderInsp();
    const st2 = $('#askState'); if (st2) st2.innerHTML = `Klart${parsed.slides.length > 1 ? `, ${parsed.slides.length} bilder` : ''}. <button type="button" class="link" id="askUndo">Ångra</button>`;
  } catch (e) { const st2 = $('#askState'); if (st2) st2.textContent = sampleMsg(e); }
  finally { const b = $('#askForm button'); if (b) b.disabled = false; }
}
function undoAsk() {
  if (!askUndo) return;
  deck.slides.splice(askUndo.at, askUndo.n, askUndo.old);
  cur = askUndo.at; askUndo = null; changed({ all: true, now: true }); renderInsp();
  toast('Ändringen är ångrad.');
}
function claudeTemplate() {
  if (!SAMPLER) return;
  const box = modal(`<h2>Ny mall med Claude</h2><p class="muted">Beskriv hur bilden ska se ut och när den passar. Claude skriver HTML och CSS som du kan justera innan du sparar.</p>
    <form id="ctForm"><div class="fld"><label for="ctDesc">Beskrivning</label><textarea id="ctDesc" rows="4" required placeholder="t.ex. En begreppskarta: rubriken i mitten i en cirkel och punkterna runt om som bubblor, en i taget"></textarea></div>
    <p class="hint" id="ctState" role="status"></p>
    <div class="acts"><button type="button" class="btn" data-close>Avbryt</button><button type="submit" class="btn primary">Skapa mallen</button></div></form>`, { sticky: true });
  $('#ctForm').onsubmit = async ev => {
    ev.preventDefault();
    const desc = $('#ctDesc').value.trim(); if (!desc) return;
    const b = box.querySelector('button[type=submit]'); b.disabled = true; $('#ctState').textContent = 'Claude designar mallen. Det kan ta en halv minut.';
    const prompt = `Du designar en återanvändbar bildmall för presentationsverktyget Scen.
Bilden är 1920×1080 px. Mallens behållare är ett <section>-element med padding 112px 144px och display:grid, align-content:start, gap:56px.
Skriv HTML (utan html, body, script eller style) och CSS.
Platshållare i HTML: {{rubrik}}, {{text}}, {{etikett}}, {{svar}}, {{bild}} (en bild-URL, använd som <img src="{{bild}}">) och {{punkter}}.
{{punkter}} ersätts med <li>-element som visas ett i taget. Varje <li> innehåller <b>rubrik</b><span>text</span>. Lägg {{punkter}} direkt i en <ul> eller <ol>.
Rubriken ska ligga i en <h2>. Tomma platshållare ska inte förstöra layouten.
CSS skrivs utan yttre selektor. Den läggs automatiskt inuti mallen. Använd & { ... } för själva bildytan.
Använd bara dessa färger och typsnitt så att mallen följer temat: var(--bg), var(--surface), var(--ink), var(--muted), var(--line), var(--accent), var(--accent-2), var(--hl), var(--font-display), var(--radius).
Textstorlekar: rubrik 64–110px, brödtext 30–44px, etiketter 24–32px. Inga externa resurser, inga url().
Du kan ge element data-anim="fade|rise|zoom|words|blur|wipe|pop" och data-delay="300" för rörelse.
Svara med endast JSON: {"name": "kort namn på svenska", "desc": "en mening om när mallen passar", "html": "...", "css": "..."}

Önskemål: ${desc}`;
    try {
      const r = await SAMPLER.json(prompt, { cache: false });
      if (!r || !r.html) throw { code: 'invalid_json' };
      closeModal();
      templateEditor({ name: String(r.name || 'Ny mall'), desc: String(r.desc || desc), html: String(r.html), css: String(r.css || '') }, renderMyTpls);
      toast('Titta på förhandsvisningen och spara om du gillar den.');
    } catch (e) { $('#ctState').textContent = sampleMsg(e); b.disabled = false; }
  };
}

/* =================== fria lager och direktredigering =================== */
let selL = null, drag = null, editing = null, imgTarget = 'slide';
let undoStack = [], redoStack = [], lastSnap = null, lastPush = 0;
const LY_NAMES = { text: 'Text', bild: 'Bild', form: 'Rektangel', cirkel: 'Cirkel', pil: 'Pil', markering: 'Markering' };
const LY_COLORS = { text: 'Textfärg', dampad: 'Dämpad', accent: 'Accent', accent2: 'Accent 2', yta: 'Yta', vit: 'Vit', svart: 'Svart' };
const LY_FILLS = { '': 'Ingen', yta: 'Yta', accent: 'Accent', markering: 'Markering' };
function findL(id) { const s = deck && deck.slides[cur]; return s && (s.layers || []).find(l => l.id === id); }
function layerEl(id) { return $(`#preview .slide.active [data-lid="${CSS.escape(id)}"]`); }
function stageInfo() {
  const st = $('#preview .slide.active') || $('#preview .sc-stage'); const r = $('#preview .sc-stage').getBoundingClientRect(); const pr = $('#preview').getBoundingClientRect();
  return { s: r.width / 1920, ox: r.left - pr.left, oy: r.top - pr.top };
}
function drawSel() {
  const box = $('.sel-box'); if (!box) return;
  const l = selL && findL(selL);
  if (!l || manusOn) { box.hidden = true; return; }
  const { s, ox, oy } = stageInfo();
  box.hidden = false;
  Object.assign(box.style, { left: ox + l.x * s + 'px', top: oy + l.y * s + 'px', width: l.w * s + 'px', height: l.h * s + 'px', transform: +l.rot ? `rotate(${+l.rot}deg)` : '' });
  box.classList.toggle('editing', !!editing);
}
const snap = v => Math.round(v / 4) * 4;
function trackUndo() {
  if (!deck) return;
  const nowS = JSON.stringify({ slides: deck.slides, theme: deck.theme, templates: deck.templates, title: deck.title });
  if (lastSnap && nowS !== lastSnap) {
    if (Date.now() - lastPush > 700) { undoStack.push(lastSnap); if (undoStack.length > 100) undoStack.shift(); lastPush = Date.now(); }
    redoStack = [];
  }
  lastSnap = nowS; updateUndoBtn();
}
function snapReset() { undoStack = []; redoStack = []; lastSnap = deck ? JSON.stringify({ slides: deck.slides, theme: deck.theme, templates: deck.templates, title: deck.title }) : null; }
function updateUndoBtn() { const b = $('#btnUndo'); if (b) b.disabled = !undoStack.length; }
function restoreSnap(json) {
  const d = JSON.parse(json);
  Object.assign(deck, d); lastSnap = json; lastPush = 0;
  cur = Math.min(cur, deck.slides.length - 1); selL = null; if (editing) editing = null;
  $('#deckTitle').value = deck.title || ''; renderTheme();
  pv && pv.setDeck(deck, IMG, cur); renderRail(); renderInsp(); drawSel();
  if (manusOn) $('#manusText').value = Manus.stringify(deck);
  deck.updatedAt = now(); scheduleSave(); updateUndoBtn();
}
function undo() { if (!undoStack.length) { toast('Inget att ångra.'); return; } redoStack.push(lastSnap); restoreSnap(undoStack.pop()); toast('Ångrat.'); }
function redo() { if (!redoStack.length) return; undoStack.push(lastSnap); restoreSnap(redoStack.pop()); }

function addLayer(type) {
  if (!deck) return;
  if (type === 'bild') { imgTarget = 'layer'; const f = $('#imgfile'); f.value = ''; f.click(); return; }
  const s = deck.slides[cur];
  const D = {
    text: { x: 560, y: 450, w: 800, h: 110, size: 56, text: 'Ny text', color: 'text' },
    form: { x: 760, y: 340, w: 400, h: 400, color: 'accent', stroke: 6 },
    cirkel: { x: 760, y: 340, w: 400, h: 400, color: 'accent', stroke: 6 },
    pil: { x: 760, y: 480, w: 400, h: 120, color: 'accent', stroke: 8 },
    markering: { x: 560, y: 470, w: 800, h: 110, fill: 'markering' }
  }[type];
  const l = Object.assign({ id: rid(), type }, D);
  (s.layers = s.layers || []).push(l); selL = l.id;
  changed({ now: true }); renderInsp();
  if (type === 'text') setTimeout(() => { const el = layerEl(l.id); if (el) startEdit(el, true); }, 60);
}
function startEdit(el, selectAll) {
  const l = findL(el.dataset.lid); if (!l || l.type !== 'text') return;
  const t = el.querySelector('.lyr-t'); if (!t) return;
  t.textContent = l.text || ''; t.style.whiteSpace = 'pre-wrap'; t.contentEditable = 'true'; t.spellcheck = true; t.focus();
  const r = document.createRange(); r.selectNodeContents(t); if (!selectAll) r.collapse(false);
  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  editing = { l, t }; drawSel();
  t.addEventListener('blur', finishEdit, { once: true });
  t.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); t.blur(); } e.stopPropagation(); });
}
function finishEdit() {
  if (!editing) return;
  const { l, t } = editing; editing = null;
  l.text = t.innerText.replace(/\n+$/, ''); t.contentEditable = 'false';
  changed({ now: true }); renderInsp();
}
function layerPanel(l) {
  const n = (k, lab, min, max) => `<div class="fld"><label for="ly-${k}">${lab}</label><input type="number" id="ly-${k}" data-t="ly" data-k="${k}" value="${Math.round(+l[k] || 0)}"${min != null ? ` min="${min}"` : ''}${max != null ? ` max="${max}"` : ''}></div>`;
  const sel = (k, lab, map) => `<div class="fld"><label for="ly-${k}">${lab}</label><select id="ly-${k}" data-t="ly" data-k="${k}">${opt(map, l[k] || '')}</select></div>`;
  let h = `<div class="grp lyr-panel"><div class="sec-row"><h3>Valt lager: ${esc(LY_NAMES[l.type] || 'Lager')}</h3><button type="button" class="link" data-act="lyclose">Klar</button></div>`;
  if (l.type === 'text') h += `<div class="fld"><label for="ly-text">Text</label><textarea id="ly-text" data-t="ly" data-k="text" rows="3">${esc(l.text || '')}</textarea><span class="hint">Eller dubbelklicka på texten i bilden och skriv där.</span></div>
    <div class="row2">${n('size', 'Storlek', 12, 400)}${sel('color', 'Färg', LY_COLORS)}</div>
    <div class="row2">${sel('font', 'Typsnitt', { '': 'Brödtext', rubrik: 'Rubrik' })}${sel('align', 'Justering', { '': 'Vänster', center: 'Centrerad', höger: 'Höger' })}</div>
    <div class="row2">${sel('fill', 'Bakgrund', LY_FILLS)}<label class="chk" style="align-self:end"><input type="checkbox" data-t="ly" data-k="bold"${l.bold ? ' checked' : ''}> Fetstil</label></div>`;
  else if (l.type === 'bild') h += `<div class="acts left"><button type="button" class="btn small" data-act="lyimg">Byt bild</button></div>${sel('fit', 'Passning', { '': 'Fyll rutan', hela: 'Visa hela bilden' })}`;
  else if (l.type === 'markering') h += sel('fill', 'Färg', { '': 'Markering', markering: 'Markering', accent: 'Accent', yta: 'Yta' });
  else h += `<div class="row2">${sel('color', 'Färg', LY_COLORS)}${n('stroke', 'Linjebredd', 1, 60)}</div>` + (l.type === 'pil' ? '' : sel('fill', 'Fyllning', LY_FILLS));
  h += `<div class="row4">${n('x', 'X')}${n('y', 'Y')}${n('w', 'Bredd', 10)}${n('h', 'Höjd', 10)}</div>
    <div class="row2">${n('rot', 'Vinkel', -180, 180)}${sel('anim', 'Rörelse', Object.fromEntries(Object.entries(Scen.BODY_ANIMS).filter(([k]) => k !== 'auto').map(([k, v]) => [k === 'fade' ? '' : k, v])))}</div>
    <label class="chk"><input type="checkbox" data-t="ly" data-k="step"${l.step ? ' checked' : ''}> Visas först på klick</label>
    <div class="acts left"><button type="button" class="btn small" data-act="lyup">Längre fram</button><button type="button" class="btn small" data-act="lydown">Längre bak</button><button type="button" class="btn small" data-act="lydup">Duplicera</button><button type="button" class="btn small danger" data-act="lydel">Ta bort</button></div></div>`;
  return h;
}
function layerList(s) {
  const ls = s.layers || [];
  return `<div class="grp"><h3>Fria lager</h3>
    ${ls.length ? `<ul class="lyr-list">${ls.slice().reverse().map(l => `<li><button type="button" class="lyr-item${l.id === selL ? ' on' : ''}" data-act="lysel" data-id="${esc(l.id)}"><b>${esc(LY_NAMES[l.type] || 'Lager')}</b><span>${esc(l.type === 'text' ? String(l.text || '').slice(0, 40) : l.type === 'bild' ? 'bild' : '')}</span>${l.step ? '<em>klick</em>' : ''}</button></li>`).join('')}</ul>` : '<p class="hint">Inga fria lager på den här bilden. Lägg till text, bild, former och pilar med knapparna under bilden.</p>'}
    ${s.layout !== 'tom' && !['table'].includes(s.layout) ? '<button type="button" class="btn small" data-act="tofree">Gör om bilden till fri yta</button><span class="hint">Bildens text och bild blir lager som du kan flytta fritt. Du kan ångra.</span>' : ''}</div>`;
}
function toFree() {
  const s = deck.slides[cur]; const L = [];
  const add = o => L.push(Object.assign({ id: rid() }, o));
  const hasImg = !!s.image;
  const W = hasImg ? 980 : 1632;
  let y = 112;
  const hOf = (txt, size, lh, k) => String(txt).split('\n').reduce((n, row) => n + Math.max(1, Math.ceil((row.length * size * (k || 0.52)) / W)), 0) * size * lh + 12;
  if (s.caption) { add({ type: 'text', x: 144, y, w: W, h: 50, size: 28, color: 'accent', text: s.caption }); y += 70; }
  if (s.title) { const t = Scen.plain(s.title); const size = t.length > 60 ? 60 : 76; const h = Math.round(hOf(t, size, 1.1, 0.64)); add({ type: 'text', x: 144, y, w: W, h, size, font: 'rubrik', text: t }); y += h + 32; }
  const lines = [];
  if (s.text) lines.push(s.text);
  Scen.lines(s.bullets).forEach(t => lines.push('• ' + t.replace(/^- /, '').replace(/^\*\s*/, '')));
  Scen.lines(s.items).forEach(t => { const p = t.split('|'); lines.push('• ' + (p.length > 1 ? p[0].trim() + ': ' + p.slice(1).join('|').trim() : t)); });
  if (s.lt || Scen.lines(s.lb).length) { lines.push(s.lt || ''); Scen.lines(s.lb).forEach(t => lines.push('• ' + t)); }
  if (s.rt || Scen.lines(s.rb).length) { lines.push(s.rt || ''); Scen.lines(s.rb).forEach(t => lines.push('• ' + t)); }
  if (s.number) lines.unshift(s.number);
  if (s.answer) lines.push('Svar: ' + s.answer);
  if (s.example) lines.push('Exempel: ' + s.example);
  if (lines.length) { const txt = lines.filter(Boolean).join('\n'); let size = 40; while (size > 24 && y + hOf(txt, size, 1.3) > 1000) size -= 2; add({ type: 'text', x: 144, y, w: W, h: Math.round(Math.min(1000 - y, hOf(txt, size, 1.3))), size, color: 'text', text: txt }); }
  if (hasImg) add({ type: 'bild', x: 1180, y: 112, w: 600, h: 856, src: s.image });
  const nw = { id: s.id, layout: 'tom', layers: L.concat(s.layers || []), notes: s.notes, transition: s.transition, bg: s.bg };
  deck.slides[cur] = nw; selL = null;
  changed({ all: true, now: true }); renderInsp();
  toast('Bilden är nu en fri yta. Ångra med Ctrl+Z om du ångrar dig.');
}
const FIELD_OF = [
  ['h1,h2,.om-title,.term,.map h2,.bk-text h2', 'title'],
  ['.kicker,.part,.by,.cap p,.label', 'caption'],
  ['.lead,.om-body,.def,.unit,.landing,blockquote,.answer', 'text'],
  ['.big', 'number'], ['.ex', 'example']
];
function focusFieldFor(target) {
  const s = deck.slides[cur];
  let f = null, idx = -1;
  const li = target.closest('li');
  if (li && li.closest('.slide')) {
    const list = li.parentElement; idx = [...list.children].indexOf(li);
    if (target.closest('.cols')) { const col = target.closest('.cols > div'); f = col && col === col.parentElement.firstElementChild ? 'lb' : 'rb'; }
    else f = ['cards', 'timeline', 'chat', 'duo', 'karta', 'triad', 'motsats', 'egen'].includes(s.layout) ? 'items' : 'bullets';
  }
  if (!f) for (const [q, k] of FIELD_OF) if (target.closest(q)) { f = k; break; }
  if (!f && target.closest('.side,.note')) { f = 'items'; const all = [...target.closest('.slide').querySelectorAll('.duel .side,.note')]; idx = all.indexOf(target.closest('.side,.note')); }
  if (!f) return false;
  const el = $('#f-' + f); if (!el) return false;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.focus({ preventScroll: true });
  if (idx >= 0 && el.tagName === 'TEXTAREA') {
    const rows = el.value.split('\n'); let pos = 0, k = 0;
    for (let i = 0; i < rows.length; i++) { if (!rows[i].trim()) { pos += rows[i].length + 1; continue; } if (k === idx) { el.setSelectionRange(pos, pos + rows[i].length); break; } k++; pos += rows[i].length + 1; }
  }
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  return true;
}
function wireLayers() {
  const pvEl = $('#preview');
  pvEl.addEventListener('pointerdown', e => {
    if (manusOn || !deck || e.button > 0) return;
    if (editing) { if (e.target.closest('[contenteditable="true"]')) return; finishEdit(); }
    const h = e.target.closest('.sel-box i');
    const lyr = h ? null : e.target.closest('.lyr');
    if (!h && !lyr) {
      if (selL) { selL = null; drawSel(); renderInsp(); }
      return;
    }
    const id = h ? selL : lyr.dataset.lid; const l = findL(id); if (!l) return;
    if (selL !== id) { selL = id; renderInsp(); }
    drawSel();
    drag = { mode: h ? h.dataset.h : 'move', sx: e.clientX, sy: e.clientY, o: { x: +l.x || 0, y: +l.y || 0, w: +l.w || 100, h: +l.h || 100 }, l, moved: false };
    try { pvEl.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  pvEl.addEventListener('pointermove', e => {
    if (!drag) return;
    const { s } = stageInfo(); const dx = (e.clientX - drag.sx) / s, dy = (e.clientY - drag.sy) / s;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
    drag.moved = true;
    const o = drag.o, l = drag.l, m = drag.mode;
    if (m === 'move') {
      let nx = snap(o.x + dx), ny = snap(o.y + dy);
      if (Math.abs(nx + o.w / 2 - 960) < 14) nx = Math.round(960 - o.w / 2);
      if (Math.abs(ny + o.h / 2 - 540) < 14) ny = Math.round(540 - o.h / 2);
      l.x = nx; l.y = ny;
    } else {
      let x = o.x, y = o.y, w = o.w, hh = o.h;
      if (m.includes('e')) w = o.w + dx;
      if (m.includes('s')) hh = o.h + dy;
      if (m.includes('w')) { w = o.w - dx; x = o.x + dx; }
      if (m.includes('n')) { hh = o.h - dy; y = o.y + dy; }
      if ((e.shiftKey || l.type === 'bild' || l.type === 'cirkel') && m.length === 2) { const r = o.h / o.w; hh = w * r; if (m.includes('n')) y = o.y + o.h - hh; }
      l.x = snap(x); l.y = snap(y); l.w = Math.max(16, snap(w)); l.h = Math.max(16, snap(hh));
    }
    const el = layerEl(l.id); if (el) Object.assign(el.style, { left: l.x + 'px', top: l.y + 'px', width: l.w + 'px', height: l.h + 'px' });
    drawSel();
  });
  const end = () => { if (drag && drag.moved) { changed({ now: true }); ['x', 'y', 'w', 'h'].forEach(k => { const i = $('#ly-' + k); if (i) i.value = Math.round(drag.l[k]); }); } drag = null; };
  pvEl.addEventListener('pointerup', end); pvEl.addEventListener('pointercancel', end);
  pvEl.addEventListener('click', e => { if (manusOn || editing || e.target.closest('.lyr,.sel-box')) return; focusFieldFor(e.target); });
  pvEl.addEventListener('dblclick', e => { const lyr = e.target.closest('.lyr-text'); if (lyr) startEdit(lyr); });
  new ResizeObserver(() => drawSel()).observe(pvEl);
  document.addEventListener('keydown', e => {
    if (!deck || $('#ed').hidden || presenter || !$('#modal').hidden) return;
    const inField = e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]');
    const mod = e.ctrlKey || e.metaKey;
    if (mod && !inField && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && !inField && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); redo(); return; }
    if (inField || !selL) return;
    const l = findL(selL); if (!l) return;
    const step = e.shiftKey ? 20 : 4;
    const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (mv) { e.preventDefault(); l.x += mv[0]; l.y += mv[1]; const el = layerEl(l.id); if (el) Object.assign(el.style, { left: l.x + 'px', top: l.y + 'px' }); drawSel(); clearTimeout(wireLayers._t); wireLayers._t = setTimeout(() => changed(), 300); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); layerAct('lydel'); return; }
    if (e.key === 'Escape') { selL = null; drawSel(); renderInsp(); return; }
    if (e.key === 'Enter' && l.type === 'text') { e.preventDefault(); const el = layerEl(l.id); if (el) startEdit(el); }
  });
  $$('[data-add]').forEach(b => b.onclick = () => addLayer(b.dataset.add));
  $('#btnUndo').onclick = undo;
}
function layerAct(a, id) {
  const s = deck.slides[cur]; const ls = s.layers || [];
  if (a === 'lysel') { selL = id; drawSel(); renderInsp(); return true; }
  if (a === 'tofree') { toFree(); return true; }
  const i = ls.findIndex(l => l.id === selL); if (i < 0 && a !== 'lyclose') return false;
  if (a === 'lyclose') { selL = null; drawSel(); renderInsp(); return true; }
  if (a === 'lydel') { ls.splice(i, 1); selL = null; }
  else if (a === 'lyup' && i < ls.length - 1) ls.splice(i + 1, 0, ls.splice(i, 1)[0]);
  else if (a === 'lydown' && i > 0) ls.splice(i - 1, 0, ls.splice(i, 1)[0]);
  else if (a === 'lydup') { const c = clone(ls[i]); c.id = rid(); c.x += 40; c.y += 40; ls.push(c); selL = c.id; }
  else if (a === 'lyimg') { imgTarget = 'lyreplace'; const f = $('#imgfile'); f.value = ''; f.click(); return true; }
  changed({ now: true }); renderInsp(); return true;
}

/* =================== koppla ihop =================== */
function wire() {
  $('#btnNew').onclick = newDeck;
  $('#btnImport').onclick = pickFile;
  $('#file').onchange = e => handleFile(e.target.files[0]);
  $('#imgfile').onchange = e => setImage(e.target.files[0]);
  wireLayers();
  $('#back').onclick = async () => { if (manusOn) toggleManus(false); const d = deck; await flush(); cleanupImages(d); showLibrary(); };
  $('#btnTheme').onclick = themePicker;
  $('#btnManus').onclick = () => toggleManus();
  $('#manusText').addEventListener('input', () => { clearTimeout(manusT); manusT = setTimeout(applyManus, 450); });
  ['keyup', 'click', 'select'].forEach(ev => $('#manusText').addEventListener(ev, manusCursor));
  $('#manusText').addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const t = e.target, a = t.selectionStart; t.setRangeText('  ', a, t.selectionEnd, 'end'); t.dispatchEvent(new Event('input')); } });
  $('#btnTpl').onclick = showTemplates;
  $('#tplBack').onclick = showLibrary;
  $('#btnClaude').onclick = () => planner('new');
  $('#btnClaudeEd').onclick = () => planner('insert');
  $('#deckTitle').oninput = e => { deck.title = e.target.value; scheduleSave(); };
  $('#btnPlay').onclick = () => play(deck, cur);
  $('#btnPlayStart').onclick = () => play(deck, 0);
  $('#btnExport').onclick = async () => { await flush(); exportDeck(deck); };
  $('#addSlide').onclick = () => layoutPicker(addSlide, 'Lägg till en bild', true);
  $('#pvPlay').onclick = previewPlay;
  const insp = $('#insp');
  insp.addEventListener('input', onInspInput);
  insp.addEventListener('click', onInspClick);
  insp.addEventListener('paste', onInspPaste);
  insp.addEventListener('submit', e => { if (e.target.id !== 'askForm') return; e.preventDefault(); const v = $('#askIn').value.trim(); if (v) askSlide(v); });
  insp.addEventListener('click', e => { if (e.target.id === 'askUndo') undoAsk(); });
  document.addEventListener('paste', e => {
    if (!deck || $('#ed').hidden) return;
    const it = [...((e.clipboardData && e.clipboardData.items) || [])].find(i => i.type.startsWith('image/'));
    if (!it) return;
    e.preventDefault(); setImage(it.getAsFile());
  });
  let depth = 0;
  const dz = $('#dropzone');
  const isFile = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
  window.addEventListener('dragenter', e => { if (!isFile(e)) return; depth++; dz.textContent = deck ? 'Släpp en bild för att lägga den på bilden' : 'Släpp en .pptx eller en sparad Scen-fil för att importera'; dz.hidden = false; });
  window.addEventListener('dragleave', e => { if (!isFile(e)) return; depth = Math.max(0, depth - 1); if (!depth) dz.hidden = true; });
  window.addEventListener('dragover', e => { if (isFile(e)) e.preventDefault(); });
  window.addEventListener('drop', e => {
    if (!isFile(e)) return; e.preventDefault(); depth = 0; dz.hidden = true;
    const f = e.dataTransfer.files[0]; if (!f) return;
    if (deck && f.type.startsWith('image/')) setImage(f);
    else if (!deck) handleFile(f);
    else toast('Gå till biblioteket för att importera en presentation.');
  });
  window.addEventListener('beforeunload', () => { if (deck) doSave(); });
}

async function boot() {
  wire();
  $('#grid').innerHTML = '<p class="muted">Hämtar dina presentationer…</p>';
  $('#storeChip').textContent = 'Ansluter…';
  await Store.init();
  storeChip();
  $('#btnClaude').hidden = !SAMPLER; $('#btnClaudeEd').hidden = !SAMPLER;
  await loadTemplates();
  await showLibrary();
}
boot();
})();
