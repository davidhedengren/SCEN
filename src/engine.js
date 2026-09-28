/* ===== Scen-motorn =====
   Samma kod körs i appen och i exporterade presentationer.
   Scen.player(el, deck, {mode, images, start, onChange, onExit, speaker})
   Scen.thumb(slide, deck, images)   Scen.renderSlide(slide, i, deck, img)   Scen.standalone(deck) */
(function (G) {
'use strict';
const EASE = 'cubic-bezier(.16,1,.3,1)';
const reduced = () => !!(G.matchMedia && G.matchMedia('(prefers-reduced-motion: reduce)').matches);
const ACCENTS = {
  blue: ['#2F5BF5', '#809EFF', 'Blå'], green: ['#0A7F58', '#4CD4A0', 'Grön'], orange: ['#C2410C', '#FF9A5C', 'Orange'],
  teal: ['#0B7A83', '#46D6DE', 'Turkos'], purple: ['#6B3FDF', '#B59BFF', 'Lila'], red: ['#C1263D', '#FF7A8C', 'Röd'], graphite: ['#27344F', '#C8D2E6', 'Grafit']
};
const LAYOUTS = {etapper:"Etapper",vagval:"Vägval",lager:"Lager",resonemang:"Resonemang",helhet:"Helhet",
  skiften: 'Skiften', prisma: 'Prisma', verkningar: 'Verkningar', belagg: 'Belägg', sammanflode: 'Sammanflöde',
  lameller: 'Lameller', register: 'Register', samband: 'Samband', marginal: 'Marginal', sats: 'Sats',
  title: 'Titel', section: 'Avsnitt', statement: 'Påstående', bullets: 'Punktlista', split: 'Text och bild',
  image: 'Helbild', bildregi: 'Bildregi', terminal: 'Terminal', kodforklaring: 'Kodförklaring', typografisk: 'Typografiskt statement', texttempo: 'Typografiskt tempo', cards: 'Kort', compare: 'Jämförelse', table: 'Tabell', number: 'Stort tal', timeline: 'Tidslinje',
  question: 'Fråga och svar', poll: 'Omröstning', reflect: 'Reflektion', define: 'Definition', chat: 'AI-samtal', duo: 'Två tal',
  quote: 'Citat', omslag: 'Omslag', karta: 'Karta', triad: 'Triad', motsats: 'Motsats', bildkant: 'Bildkant', 'båge': 'Båge', omlopp: 'Omlopp', gradskiva: 'Gradskiva', bro: 'Bro', graf: 'Graf', trad: 'Träd', ringar: 'Ringar', lins: 'Lins', 'mätare': 'Mätare', 'ridå': 'Ridå', 'strålkastare': 'Strålkastare', fokus: 'Fokus', ordbild: 'Ordbild', 'bildfält': 'Bildfält', delning: 'Delning', ljustal: 'Ljustal', tom: 'Fri yta', egen: 'Egen mall'
};
const THEMES = {
  signal: { name: 'Signal', desc: 'Djup midnattsblå, elektrisk cyan och violett. Fylliga färgfält och tydlig typografi.', look: 'dark', v: { bg: '#080E25', surface: '#152444', ink: '#F0F6FF', muted: '#A5B6D4', line: '#2B4065', accent: '#5FE7ED', 'accent-2': '#9C87FF', hl: 'rgba(95,231,237,.22)' }, fd: '"Familjen Grotesk",system-ui,sans-serif', fb: '"Hanken Grotesk",system-ui,sans-serif', hw: 700, ht: '-.035em', r: '24px', ta: 'words', fonts: ['Familjen+Grotesk:wght@400;500;600;700', 'Hanken+Grotesk:wght@400;500;600'] },
  djup: { name: 'Djup', desc: 'Mörkt och djupt med mjukt ljus i ytan, korallglöd och kall turkos. Familjen Grotesk och Hanken Grotesk. Inga ramar, stora ytor och tung typografi.', look: 'dark', v: { bg: '#0B0C10', surface: '#16181F', ink: '#F5F3EF', muted: '#A3A5AE', line: '#23262E', accent: '#FF9466', 'accent-2': '#5FDCC4', hl: 'rgba(255,148,102,.30)' }, fd: '"Familjen Grotesk",system-ui,sans-serif', fb: '"Hanken Grotesk",system-ui,sans-serif', hw: 700, ht: '-.045em', r: '28px', ta: 'words', glow: true, fonts: ['Familjen+Grotesk:wght@400;500;600;700', 'Hanken+Grotesk:wght@400;500;600'] },
  scen: { name: 'Scen', desc: 'Systemets typsnitt. Följer ljust och mörkt läge, välj färg själv.' },
  bana: { name: 'Bana', desc: 'Ljust stengrått, grafit och signalorange. Syne och Figtree, med ett fint korn i ytan. Gjort för banmallarna.', look: 'light', v: { bg: '#ECEDEA', surface: '#F7F7F4', ink: '#15171C', muted: '#5C6169', line: '#C8CAC4', accent: '#F2521D', 'accent-2': '#1D3FD1', hl: 'rgba(242,82,29,.16)' }, fd: '"Syne",system-ui,sans-serif', fb: '"Figtree",system-ui,sans-serif', fm: '"JetBrains Mono",ui-monospace,Menlo,monospace', hw: 700, ht: '-.035em', r: '26px', ta: 'mask', grain: true, fonts: ['Syne:wght@600;700;800', 'Figtree:wght@400;500;600', 'JetBrains+Mono:wght@400;500'] },
  nattbana: { name: 'Nattbana', desc: 'Banmallarna i mörker: nästan svart grafit, glödande orange och kobolt, med korn.', look: 'dark', v: { bg: '#0F1013', surface: '#17191E', ink: '#EDEDE8', muted: '#8F949C', line: '#2A2D34', accent: '#FF6B35', 'accent-2': '#7D95FF', hl: 'rgba(255,107,53,.2)' }, fd: '"Syne",system-ui,sans-serif', fb: '"Figtree",system-ui,sans-serif', fm: '"JetBrains Mono",ui-monospace,Menlo,monospace', hw: 700, ht: '-.035em', r: '26px', ta: 'mask', grain: true, fonts: ['Syne:wght@600;700;800', 'Figtree:wght@400;500;600', 'JetBrains+Mono:wght@400;500'] },
  atlas: { name: 'Atlas', desc: 'Redaktionellt och mörkt. Kursiv serif, mono-etiketter och bärnsten. Rubriker glider fram ur en mask.', look: 'dark', v: { bg: '#0A0E13', surface: '#121922', ink: '#EEF0EA', muted: '#8D97A5', line: '#232D39', accent: '#F2A541', 'accent-2': '#5CC8D0', hl: 'rgba(242,165,65,.22)' }, fd: '"Instrument Serif",Georgia,serif', fb: '"IBM Plex Sans",system-ui,sans-serif', fm: '"IBM Plex Mono",ui-monospace,Menlo,monospace', hw: 400, ht: '-.012em', hs: 'italic', r: '14px', ta: 'mask', fonts: ['Instrument+Serif:ital@0;1', 'IBM+Plex+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500'] },
  natt: { name: 'Natt', desc: 'Mörk och futuristisk med turkos. Sora och IBM Plex Sans.', look: 'dark', v: { bg: '#070D17', surface: '#0F1A2B', ink: '#E6F1F5', muted: '#8BA3B4', line: '#1D3045', accent: '#3DD6D0', 'accent-2': '#FFB547', hl: 'rgba(61,214,208,.26)' }, fd: '"Sora",system-ui,sans-serif', fb: '"IBM Plex Sans",system-ui,sans-serif', hw: 600, ht: '-.035em', r: '24px', ta: 'blur', fonts: ['Sora:wght@400;600;700', 'IBM+Plex+Sans:wght@400;500;600'] },
  tidskrift: { name: 'Tidskrift', desc: 'Som ett fint magasin. Serif, varmt mörkt och guld.', look: 'dark', v: { bg: '#14120E', surface: '#1D1A14', ink: '#F2EDE0', muted: '#A39A84', line: '#2F2A20', accent: '#D4A24C', 'accent-2': '#E07A5F', hl: 'rgba(212,162,76,.28)' }, fd: '"Instrument Serif",Georgia,serif', fb: '"Source Sans 3",system-ui,sans-serif', hw: 400, ht: '-.015em', r: '6px', ta: 'fade', orn: 'line', fonts: ['Instrument+Serif:ital@0;1', 'Source+Sans+3:wght@400;600'] },
  kritvit: { name: 'Kritvit', desc: 'Vitt, svart och en röd accent. Tät, fet grotesk.', look: 'light', v: { bg: '#FFFFFF', surface: '#F2F2F0', ink: '#0A0A0A', muted: '#595959', line: '#D9D9D6', accent: '#D7001F', 'accent-2': '#0A0A0A', hl: 'rgba(215,0,31,.16)' }, fd: '"Archivo",system-ui,sans-serif', fb: '"Archivo",system-ui,sans-serif', hw: 800, ht: '-.045em', r: '0px', ta: 'rise', orn: 'square', fonts: ['Archivo:wght@400;600;800'] },
  klassrum: { name: 'Klassrum', desc: 'Ljust och lättläst med Lexend. Varm orange accent.', look: 'light', v: { bg: '#F3F6FA', surface: '#FFFFFF', ink: '#14213D', muted: '#56637F', line: '#D5DEEA', accent: '#D9481C', 'accent-2': '#2F5BF5', hl: 'rgba(217,72,28,.2)' }, fd: '"Lexend",system-ui,sans-serif', fb: '"Lexend",system-ui,sans-serif', hw: 600, ht: '-.03em', r: '22px', ta: 'rise', fonts: ['Lexend:wght@400;500;600'] },
  solnedgang: { name: 'Solnedgång', desc: 'Varmt och berättande. Playfair Display och Manrope.', look: 'dark', v: { bg: '#1A0A14', surface: '#271522', ink: '#F6E9DD', muted: '#B39C97', line: '#3B2432', accent: '#FF7A6B', 'accent-2': '#F9C74F', hl: 'rgba(255,122,107,.3)' }, fd: '"Playfair Display",Georgia,serif', fb: '"Manrope",system-ui,sans-serif', hw: 700, ht: '-.02em', r: '20px', ta: 'fade', fonts: ['Playfair+Display:wght@600;700', 'Manrope:wght@400;600'] },
  skog: { name: 'Skog', desc: 'Mörkgrönt och mossa. Fraunces och Nunito Sans.', look: 'dark', v: { bg: '#0E1A14', surface: '#16261E', ink: '#ECF2E8', muted: '#9DB0A2', line: '#243A2E', accent: '#9BD17A', 'accent-2': '#E9C46A', hl: 'rgba(155,209,122,.26)' }, fd: '"Fraunces",Georgia,serif', fb: '"Nunito Sans",system-ui,sans-serif', hw: 600, ht: '-.02em', r: '18px', ta: 'words', fonts: ['Fraunces:opsz,wght@9..144,500;9..144,650', 'Nunito+Sans:wght@400;600'] },
  retro: { name: 'Retro', desc: 'Retrofuturism. Neongult och magenta på djuplila.', look: 'dark', v: { bg: '#120B24', surface: '#1D1338', ink: '#F3EEFF', muted: '#A99CCD', line: '#33265A', accent: '#F7E018', 'accent-2': '#FF4FB8', hl: 'rgba(255,79,184,.32)' }, fd: '"Bricolage Grotesque",system-ui,sans-serif', fb: '"DM Sans",system-ui,sans-serif', hw: 800, ht: '-.03em', r: '4px', ta: 'type', orn: 'square', fonts: ['Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800', 'DM+Sans:wght@400;500;700'] }
};
function themeOf(deck) { return THEMES[deck && deck.theme && deck.theme.id] || THEMES.scen; }
function fontUrl(ids) {
  const fam = [];
  (ids || Object.keys(THEMES)).forEach(id => { const t = THEMES[id]; if (t && t.fonts) t.fonts.forEach(f => { if (!fam.includes(f)) fam.push(f); }); });
  return fam.length ? 'https://fonts.googleapis.com/css2?' + fam.map(f => 'family=' + f).join('&') + '&display=swap' : '';
}
const TRANSITIONS = { auto: 'Automatisk', djup: 'Djup', arc: 'Båge', fade: 'Tona', slide: 'Glid', push: 'Skjut', rise: 'Stig', zoom: 'Zooma', wipe: 'Svep', morph: 'Morph', none: 'Ingen' };
const FOCUS_STYLES = { none: 'Ingen', soft: 'Mjuk', spotlight: 'Spotlight', line: 'Accentlinje', frame: 'Inramning' };
const BACKGROUNDS = { none: 'Ingen', fokusljus: 'Fokusljus', ljus: 'Ljus', orbits: 'Banor', field: 'Vektorfält', nodes: 'Nätverk', waves: 'Vågor' };
const TITLE_ANIMS = { auto: 'Automatisk', mask: 'Mask', words: 'Ord för ord', blur: 'Skärpa', rise: 'Stig', fade: 'Tona', type: 'Skrivmaskin', wipe: 'Svep', drop: 'Fall', none: 'Ingen' };
const BODY_ANIMS = { auto: 'Automatisk', mask: 'Mask', rise: 'Stig', fade: 'Tona', left: 'Från vänster', right: 'Från höger', zoom: 'Zooma', pop: 'Studsa', blur: 'Skärpa', wipe: 'Svep', none: 'Ingen' };

/* ---------- text ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function fmt(s) {
  let h = esc(s).replace(/\/(?=\S)/g, '/\u200b');
  h = h.replace(/\*\*(.+?)\*\*/g, '<mark>$1</mark>');
  h = h.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
  h = h.replace(/\^(-?\d+)/g, '<sup>$1</sup>');
  return h.replace(/\n/g, '<br>');
}
function plain(s) { return String(s == null ? '' : s).replace(/\*\*/g, '').replace(/[\^_]\{([^}]*)\}/g, '$1').trim(); }
function hash(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) | 0; return (h >>> 0).toString(36); }
function lines(a) { return (Array.isArray(a) ? a : String(a || '').split('\n')).map(x => String(x)).filter(x => x.trim() !== ''); }
function numericTuple(value, fallback, length) {
  const src = Array.isArray(value) ? value : String(value || '').trim().split(/[\s,]+/);
  const out = src.map(Number).filter(Number.isFinite).slice(0, length);
  return out.length === length ? out : fallback.slice();
}
function normalizeImageDirection(sl) {
  sl = sl || {};
  const raw = sl.imageDirection || {};
  const modeMap = { cinematic: 'hero', hero: 'hero', detalj: 'detail', detail: 'detail', spotlight: 'spotlight', annotation: 'spotlight', reveal: 'reveal', mask: 'reveal' };
  const dirMap = { höger: 'right', hoger: 'right', right: 'right', vänster: 'left', vanster: 'left', left: 'left', upp: 'up', up: 'up', ned: 'down', down: 'down', stilla: 'none', none: 'none' };
  const speedMap = { långsam: 'slow', langsamt: 'slow', slow: 'slow', normal: 'medium', medium: 'medium', snabb: 'fast', fast: 'fast' };
  const mode = modeMap[String(raw.mode || 'hero').toLowerCase()] || 'hero';
  const focus = numericTuple(raw.focus, [50, 50], 2);
  const start = numericTuple(raw.start, [50, 50, 1], 3);
  const end = numericTuple(raw.end, [focus[0], focus[1], mode === 'hero' ? 1.08 : 1], 3);
  const safe = numericTuple(raw.safe, [6, 10, 40, 78], 4);
  const shade = numericTuple(raw.shade, safe.concat(.52), 5);
  const details = lines(raw.details || sl.items).map((line, index) => {
    const p = line.split('|').map(x => x.trim());
    const x = Number(p[2]), y = Number(p[3]), w = Number(p[4]), h = Number(p[5]);
    return { id: p[0] || `detail-${index + 1}`, label: p[1] || `Detalj ${index + 1}`, x: Number.isFinite(x) ? x : 50, y: Number.isFinite(y) ? y : 50, w: Number.isFinite(w) ? w : 16, h: Number.isFinite(h) ? h : 20, note: p.slice(6).join(' | ') };
  });
  return { mode, crop: raw.crop === 'contain' ? 'contain' : 'cover', focus, start, end, safe, shade, direction: dirMap[String(raw.direction || 'none').toLowerCase()] || 'none', speed: speedMap[String(raw.speed || 'slow').toLowerCase()] || 'slow', details };
}
function imageBrief(sl, defaults) {
  if (!sl || (!sl.image && !sl.imageDirection && !sl.imageBrief)) return null;
  const d = normalizeImageDirection(sl), b = sl.imageBrief || {}, base = defaults || {};
  return { imageId: b.id || base.imageId || '', filename: b.filename || (String(sl.image || '').startsWith('img:') ? String(sl.image).slice(4) : '') || base.filename || '', scene: b.scene || base.scene || '', purpose: b.purpose || base.purpose || '', subject: b.subject || base.subject || '', composition: b.composition || base.composition || '', subjectPlacement: b.placement || base.subjectPlacement || '', negativeSafeArea: d.safe.slice(), aspectRatio: b.aspectRatio || base.aspectRatio || '16:9', focusPoint: d.focus.slice(), plannedCrop: d.crop, plannedMotion: { start: d.start.slice(), end: d.end.slice(), direction: d.direction, speed: d.speed }, detailAreas: d.details.map(x => ({ ...x })), avoid: b.avoid || base.avoid || '', prompt: b.prompt || base.prompt || '' };
}
function normalizeTextDirection(sl) {
  sl = sl || {};
  const mode = sl.layout === 'kodforklaring' ? 'code' : sl.layout === 'typografisk' ? 'statement' : sl.layout === 'texttempo' ? 'pacing' : 'terminal';
  const roleMap = {
    prompt: 'prompt', kommando: 'command', command: 'command', output: 'output', utdata: 'output',
    fel: 'error', error: 'error', klar: 'success', success: 'success', fokus: 'focus', focus: 'focus', aktiv: 'focus', active: 'focus',
    annotation: 'annotation', annotering: 'annotation',
    statement: 'statement', 'påstående': 'statement', pastående: 'statement', 'fråga': 'question', fraga: 'question', question: 'question',
    svar: 'answer', answer: 'answer', kontrast: 'contrast', contrast: 'contrast', precision: 'precision', precisering: 'precision',
    replacement: 'replacement', replace: 'replacement', 'ersättning': 'replacement', ersattning: 'replacement',
    reveal: 'reveal', 'avslöjande': 'reveal', avslojande: 'reveal', buildup: 'buildup', 'uppbyggnad': 'buildup',
    conclusion: 'conclusion', slutsats: 'conclusion', paus: 'pause', pause: 'pause'
  };
  const items = lines(sl.items).map((line, index) => {
    const p = line.split('|').map(x => x.trim());
    if (mode === 'code') {
      const n = parseInt(p[0], 10);
      return { id: `code-${index + 1}`, line: Number.isFinite(n) && n > 0 ? n : index + 1, token: p[1] || '', annotation: p[2] || '', result: p.slice(3).join(' | ') };
    }
    const rawRole = String(p[0] || (mode === 'terminal' ? 'output' : 'statement')).toLowerCase();
    const role = roleMap[rawRole] || (mode === 'terminal' ? 'output' : 'statement');
    const animation = mode === 'terminal' && role === 'command' ? 'type' : mode === 'terminal' && role !== 'prompt' ? 'fade' : 'none';
    return { id: `${mode}-${index + 1}`, role, content: p[1] || '', annotation: p.slice(2).join(' | '), animation };
  });
  return { mode, items };
}

/* ---------- graf och träd ----------
   Två strukturmallar med samma dramaturgi: hela strukturen syns från början,
   varje fokusrad lyfter fram noder, kanter eller en väg, resten ligger kvar nedtonat.
   Rader i listan: "fokus: mål | rubrik | text". Geometrin ändras aldrig mellan klick. */
const GT_MAX_FOCUS = 12;
function gtFocusLines(items) {
  const out = [];
  lines(items).forEach(raw => {
    const m = String(raw).replace(/^(- )+/, '').match(/^fokus\s*:\s*(.*)$/i);
    if (!m || out.length >= GT_MAX_FOCUS) return;
    const p = m[1].split('|').map(x => x.trim());
    out.push({ target: p[0] || '', head: p[1] || '', text: p.slice(2).join(' | ') });
  });
  return out;
}
const gtKey = s => plain(s).toLowerCase().replace(/\s+/g, ' ').trim();
function gtIn(set) { return ` data-dramaturgy-in="${set ? [...set].join(' ') : ''}"`; }
function gtAdd(map, id, j) { (map[id] = map[id] || new Set()).add(j); }
function gtPanel(intro, focus, end, extra, x, y, w) {
  const notes = focus.map((f, j) => `<div class="gt-note" data-dramaturgy-in="${j}">` +
    (f.head ? `<p class="gt-head">${fmt(f.head)}</p>` : '') + (f.text ? `<p class="gt-text">${fmt(f.text)}</p>` : '') + (extra[j] || '') + `</div>`).join('');
  return `<div class="gt-pan" style="left:${x}px;top:${y}px;width:${w}px">` +
    (intro ? `<div class="gt-note gt-intro"><p class="gt-text">${fmt(intro)}</p></div>` : '') + notes +
    (end ? `<div class="gt-note gt-end"><p class="gt-text">${fmt(end)}</p></div>` : '') + `</div>`;
}
function parseGraf(items) {
  const nodes = [], edges = [], byKey = {};
  const node = (name, x, y) => {
    const k = gtKey(name); if (!k) return null;
    if (!byKey[k]) { byKey[k] = { i: nodes.length, name: name.trim(), x: NaN, y: NaN }; nodes.push(byKey[k]); }
    const n = byKey[k]; if (Number.isFinite(x) && Number.isFinite(y)) { n.x = x; n.y = y; }
    return n;
  };
  lines(items).forEach(raw => {
    const line = String(raw).replace(/^(- )+/, '');
    let m = line.match(/^nod\s*:\s*(.*)$/i);
    if (m) { const p = m[1].split('|').map(x => x.trim()); const c = (p[1] || '').split(/[\s,]+/).map(Number); node(p[0], c[0], c[1]); return; }
    m = line.match(/^kant\s*:\s*(.*)$/i);
    if (m) {
      const p = m[1].split('|').map(x => x.trim());
      const e = p[0].match(/^(.+?)\s+(->|>|→|-|–|—)\s+(.+)$/); if (!e) return;
      const a = node(e[1]), b = node(e[3]); if (!a || !b || a === b) return;
      edges.push({ i: edges.length, a, b, dir: /^(->|>|→)$/.test(e[2]), w: p[1] || '' });
    }
  });
  const loose = nodes.filter(n => !Number.isFinite(n.x));
  loose.forEach((n, j) => { const a = -Math.PI / 2 + j * 2 * Math.PI / loose.length; n.x = 50 + 40 * Math.cos(a); n.y = 50 + 40 * Math.sin(a); });
  nodes.forEach(n => { n.x = Math.max(0, Math.min(100, n.x)); n.y = Math.max(0, Math.min(100, n.y)); });
  return { nodes, edges, byKey };
}
function parseTrad(items) {
  const roots = [], stack = [], all = [];
  lines(items).forEach(raw => {
    const s = String(raw), depth = (s.match(/^(- )+/) || [''])[0].length / 2, txt = s.slice(depth * 2).trim();
    if (/^fokus\s*:/i.test(txt) || !txt) return;
    let edge = '', label = txt;
    const m = depth > 0 && txt.match(/^([^:|]{1,28}?)\s*:\s+(.+)$/);
    if (m) { edge = m[1].trim(); label = m[2].trim(); }
    const n = { i: all.length, label, edge, kids: [], parent: null, depth: 0 };
    while (stack.length > depth) stack.pop();
    const par = stack[stack.length - 1];
    if (par) { n.parent = par; n.depth = par.depth + 1; par.kids.push(n); } else roots.push(n);
    stack.push(n); all.push(n);
  });
  let slot = 0;
  const place = n => { if (!n.kids.length) { n.slot = slot++; return; } n.kids.forEach(place); n.slot = (n.kids[0].slot + n.kids[n.kids.length - 1].slot) / 2; };
  roots.forEach(place);
  return { roots, all, leaves: slot, levels: all.reduce((m, n) => Math.max(m, n.depth + 1), 0) };
}

/* ---------- rendering ---------- */
function anim(v, def) { return (!v || v === 'auto') ? def : v; }
function A(name, delay, extra) {
  if (!name || name === 'none') return '';
  return ` data-anim="${name}"` + (delay ? ` data-delay="${delay}"` : '') + (extra || '');
}
function dramaturgyPhase(focusSteps, restoreStep, step, final) {
  if (final) return { state: 'restored', focus: -1 };
  const focus = (focusSteps || []).indexOf(step);
  if (focus >= 0) return { state: 'focus', focus };
  if (Number.isFinite(restoreStep) && step >= restoreStep) return { state: 'restored', focus: -1 };
  return { state: 'overview', focus: -1 };
}
function dramaturgyTarget(focusSteps, focusTargets, restoreStep, restoredTarget, step, final) {
  const phase = dramaturgyPhase(focusSteps, restoreStep, step, final);
  let target = -1;
  if (phase.state === 'focus') {
    const explicit = (focusTargets || [])[phase.focus];
    target = Number.isFinite(explicit) ? explicit : phase.focus;
  } else if (phase.state === 'restored' && Number.isFinite(restoredTarget)) target = restoredTarget;
  return { state: phase.state, focus: phase.focus, target };
}
function applyDramaturgy(sec, step, final) {
  if (!sec || !sec.dataset || !sec.dataset.dramaturgy) return null;
  const items = [...sec.querySelectorAll('[data-dramaturgy-item]')];
  const cues = [...sec.querySelectorAll('[data-dramaturgy-cue]')];
  const targets = [...sec.querySelectorAll('[data-dramaturgy-target]')];
  const focusNodes = cues.length ? cues : items;
  const focusSteps = focusNodes.map(el => +el.dataset.dramaturgyFocus).filter(Number.isFinite);
  const focusTargets = focusNodes.map((el, index) => {
    const n = +el.dataset.dramaturgyTarget;
    return Number.isFinite(n) ? n : index;
  });
  const restore = sec.querySelector('[data-dramaturgy-restore]');
  const restoreStep = restore ? +restore.dataset.step : NaN;
  const restoredTarget = +sec.dataset.dramaturgyRestoredTarget;
  const staticState = final || sec.dataset.dramaturgyStatic === 'true' || !!sec.closest('.static');
  const phase = dramaturgyTarget(focusSteps, focusTargets, restoreStep, restoredTarget, step, staticState);
  sec.dataset.dramaturgyState = phase.state;
  if (phase.state === 'focus') sec.dataset.dramaturgyFocus = String(phase.target);
  else delete sec.dataset.dramaturgyFocus;
  sec.querySelectorAll('[data-dramaturgy-in]').forEach(el => {
    const on = phase.state === 'focus' && el.dataset.dramaturgyIn.split(' ').includes(String(phase.target));
    el.classList.toggle('dramaturgy-current', on);
  });
  const actors = targets.length ? targets : items;
  actors.forEach((el, index) => {
    const explicit = +el.dataset.dramaturgyIndex;
    const actorIndex = Number.isFinite(explicit) ? explicit : index;
    el.classList.toggle('dramaturgy-current', phase.target >= 0 && actorIndex === phase.target);
    el.classList.toggle('dramaturgy-past', phase.target >= 0 && actorIndex < phase.target);
    el.classList.toggle('dramaturgy-future', phase.target >= 0 && actorIndex > phase.target);
  });
  let progress = 0;
  if (phase.state === 'restored') progress = 1;
  else if (phase.state === 'focus' && focusNodes[phase.focus]) {
    const explicit = parseFloat(focusNodes[phase.focus].dataset.dramaturgyProgress);
    progress = Number.isFinite(explicit) ? explicit : (focusNodes.length > 1 ? phase.focus / (focusNodes.length - 1) : 1);
  }
  sec.style.setProperty('--dramaturgy-progress', String(Math.max(0, Math.min(1, progress))));
  const current = phase.state === 'focus' ? actors.find((el, index) => {
    const explicit = +el.dataset.dramaturgyIndex;
    return (Number.isFinite(explicit) ? explicit : index) === phase.target;
  }) : null;
  if (current && current.dataset.imageX) {
    sec.style.setProperty('--image-active-x', `${current.dataset.imageX}%`);
    sec.style.setProperty('--image-active-y', `${current.dataset.imageY}%`);
    sec.style.setProperty('--image-active-scale', current.dataset.imageScale || '1.35');
  }
  return phase;
}
function renderSlide(sl, i, deck, img) {
  img = img || (() => '');
  const L = LAYOUTS[sl.layout] ? sl.layout : 'bullets';
  const ta = sl.ta || 'auto', ba = sl.ba || 'auto';
  const steps = sl.steps !== false;
  const focus = FOCUS_STYLES[sl.focus] ? sl.focus : (sl.dim || (['bro','etapper','vagval','lager','resonemang','helhet','skiften','prisma','verkningar','belagg','sammanflode'].includes(L) && sl.dim !== false) ? 'soft' : 'none');
  const dim = steps && focus !== 'none';
  let k = 0;
  const st = (anm) => ` data-step="${++k}" data-step-anim="${anm}"`;
  const tid = (t) => ` data-id="t-${hash(plain(t))}"`;
  const title = sl.title || '';
  const TA = themeOf(deck).ta;
  const tA = (def) => { if (ta && ta !== 'auto') return ta; const t = TA || def; return (t === 'type' && plain(title).length > 48) ? 'rise' : t; };
  const H2 = (cls, def) => title ? `<h2${cls ? ` class="${cls}"` : ''}${tid(title)}${A(tA(def))}>${fmt(title)}</h2>` : '';
  let attrs = '';
  const bodyA = anim(ba, 'rise');
  const stepA = (def) => anim(ba, def);
  const list = (items, cls, animName, delay) => {
    const its = lines(items);
    if (!its.length) return '';
    const dense = (its.length > 6 || (L === 'split' && its.length > 4)) ? ' dense' : '';
    const li = its.map(t => {
      const sub = /^(\s{2,}|\t|- )/.test(t);
      const txt = t.replace(/^(\s+|- )/, '');
      return `<li${sub ? ' class="sub"' : ''}${steps && animName !== 'none' ? st(animName) : ''}>${fmt(txt)}</li>`;
    }).join('');
    const group = (!steps && animName !== 'none') ? A(animName, delay, ' data-stagger="110"') : '';
    return `<ul class="${cls}${dense}"${dim && steps ? ' data-dim' : ''}${group}>${li}</ul>`;
  };
  const figure = (ref, animName, delay) => {
    const src = ref ? img(ref) : '';
    const inner = src ? `<img src="${esc(src)}" alt="${esc(sl.alt || plain(title) || 'Bild')}"${ref ? ` data-id="i-${hash(ref)}"` : ''}>` : `<div class="ph">Ingen bild vald</div>`;
    return `<figure class="fig"${A(animName, delay)}>${inner}</figure>`;
  };
  let body = '', cls = '';
  switch (L) {
    case 'title': {
      const long = plain(title).length > 16 ? ' class="long"' : '';
      body = `<h1${long}${title ? tid(title) : ''}${A(tA('blur'))}>${fmt(title || 'Titel')}</h1>` +
        (sl.text ? `<p class="lead"${A(anim(ba, 'rise'), 350)}>${fmt(sl.text)}</p>` : '') +
        (sl.caption ? `<p class="by"${A(anim(ba, 'fade'), 800)}>${fmt(sl.caption)}</p>` : '');
      break;
    }
    case 'cards': {
      const its = lines(sl.items).map(t => { const p = t.split('|'); return { h: (p.length > 1 ? p[0] : '').trim(), t: (p.length > 1 ? p.slice(1).join('|') : p[0]).trim() }; });
      const side = !!sl.image && !sl.banner;
      if (side) cls = 'side' + (sl.flip ? ' flip' : '');
      const n = side ? 1 : (its.length === 4 ? 2 : Math.max(1, Math.min(3, its.length)));
      const li = its.map(o => `<li${steps && bodyA !== 'none' ? st(bodyA) : ''}>${o.h ? `<h3>${fmt(o.h)}</h3>` : ''}${o.t ? `<p>${fmt(o.t)}</p>` : ''}</li>`).join('');
      const grp = (!steps && bodyA !== 'none') ? A(bodyA, 350, ' data-stagger="140"') : '';
      body = H2('', 'words') + (sl.text ? `<p class="lead"${A(anim(ba, 'fade'), 300)}>${fmt(sl.text)}</p>` : '') +
        `<ul class="cards${its.length > 3 && side ? ' dense' : ''}" style="--cols:${n}"${dim && steps ? ' data-dim' : ''}${grp}>${li}</ul>` +
        (side ? figure(sl.image, anim(ba, 'zoom') === 'rise' ? 'zoom' : anim(ba, 'zoom'), 200) : '');
      break;
    }
    case 'section':
      body = (sl.caption ? `<p class="part"${A(anim(ba, 'fade'))}>${fmt(sl.caption)}</p>` : '') +
        `<h2${tid(title)}${A(tA('words'), 150)}>${fmt(title)}</h2>` +
        (sl.text ? `<p class="lead"${A(anim(ba, 'rise'), 600)}>${fmt(sl.text)}</p>` : '');
      break;
    case 'statement':
      body = (sl.caption ? `<p class="part"${A(anim(ba, 'fade'))}>${fmt(sl.caption)}</p>` : '') +
        `<h2${plain(title).length > 70 ? ' class="long"' : ''}${tid(title)}${A(tA('words'), 100)}>${fmt(title)}</h2>` +
        (sl.text ? `<p class="lead"${A(anim(ba, 'rise'), 700)}>${fmt(sl.text)}</p>` : '');
      break;
    case 'bullets':
      body = H2('', 'words') + (sl.text ? `<p class="lead"${A(anim(ba, 'fade'), 300)}>${fmt(sl.text)}</p>` : '<div></div>') +
        list(sl.bullets, 'points', bodyA, 350);
      break;
    case 'split': {
      cls = sl.flip ? 'flip' : '';
      const text = `<div class="text">${H2('', 'words')}${sl.text ? `<p class="lead"${A(anim(ba, 'fade'), 300)}>${fmt(sl.text)}</p>` : ''}${list(sl.bullets, 'points', bodyA, 400)}</div>`;
      body = text + figure(sl.image, anim(ba, 'zoom') === 'rise' ? 'zoom' : anim(ba, 'zoom'), 250);
      break;
    }
    case 'image':
      body = figure(sl.image, anim(ba, 'zoom'), 0) +
        ((title || sl.caption) ? `<div class="cap"${A(anim(ta, 'rise'), 400)}>${title ? `<h2${tid(title)}>${fmt(title)}</h2>` : '<span></span>'}${sl.caption ? `<p>${fmt(sl.caption)}</p>` : ''}</div>` : '');
      break;
    case 'bildregi': {
      const d = normalizeImageDirection(sl), src = sl.image ? img(sl.image) : '';
      const duration = d.speed === 'fast' ? '8s' : d.speed === 'medium' ? '14s' : '22s';
      const vars = [`--image-start-x:${d.start[0]}%`,`--image-start-y:${d.start[1]}%`,`--image-start-scale:${Math.max(1,d.start[2])}`,`--image-end-x:${d.end[0]}%`,`--image-end-y:${d.end[1]}%`,`--image-end-scale:${Math.max(1,d.end[2])}`,`--image-safe-x:${d.safe[0]}%`,`--image-safe-y:${d.safe[1]}%`,`--image-safe-w:${d.safe[2]}%`,`--image-safe-h:${d.safe[3]}%`,`--image-shade-x:${d.shade[0]}%`,`--image-shade-y:${d.shade[1]}%`,`--image-shade-w:${d.shade[2]}%`,`--image-shade-h:${d.shade[3]}%`,`--image-shade-opacity:${Math.max(0,Math.min(1,d.shade[4]))}`,`--image-duration:${duration}`].join(';');
      const image = src ? `<img src="${esc(src)}" alt="${esc(sl.alt || plain(title) || 'Bild')}" data-id="i-${hash(sl.image)}">` : `<div class="ph">Ingen bild vald</div>`;
      const copy = (title || sl.text || sl.caption) ? `<div class="ir-copy">${sl.caption ? `<p class="ir-kicker">${fmt(sl.caption)}</p>` : ''}${title ? `<h2${tid(title)}>${fmt(title)}</h2>` : ''}${sl.text ? `<p>${fmt(sl.text)}</p>` : ''}</div>` : '';
      const detailNodes = d.details.map((o, index) => {
        const scale = Math.max(1.16, Math.min(2.1, 72 / Math.max(o.w, o.h, 12)));
        return `<div class="ir-detail${o.x > 58 ? ' ir-detail-left' : ''}${o.y > 64 ? ' ir-detail-up' : ''}${o.y < 42 ? ' ir-detail-down' : ''}" data-dramaturgy-item data-dramaturgy-focus="${index + 1}" data-image-x="${o.x}" data-image-y="${o.y}" data-image-scale="${scale.toFixed(3)}" style="--detail-x:${o.x}%;--detail-y:${o.y}%;--detail-w:${o.w}%;--detail-h:${o.h}%"${steps ? st('none') : ''}><i aria-hidden="true"></i><div><b>${fmt(o.label)}</b>${o.note ? `<p>${fmt(o.note)}</p>` : ''}</div></div>`;
      }).join('');
      let semantic = '', restore = '';
      if (d.mode === 'detail' || d.mode === 'spotlight') {
        semantic = detailNodes;
        restore = steps ? `<span data-dramaturgy-restore${st('none')} aria-hidden="true"></span>` : '';
      } else if (d.mode === 'reveal') semantic = detailNodes;
      body = `<div class="ir-stage" data-image-stage data-image-mode="${d.mode}" data-image-crop="${d.crop}" data-image-direction="${d.direction}" style="${vars}"><div class="ir-camera">${image}</div><div class="ir-shade" aria-hidden="true"></div><div class="ir-spotlight" aria-hidden="true"></div><div class="ir-safe" data-safe-area aria-hidden="true"></div>${semantic}${copy}${restore}</div>`;
      attrs += ` data-dramaturgy="image-direction" data-dramaturgy-state="${steps && d.mode !== 'hero' ? 'overview' : 'restored'}"${steps && d.mode !== 'hero' ? '' : ' data-dramaturgy-static="true"'} data-image-mode="${d.mode}"`;
      break;
    }
    case 'terminal': {
      const d = normalizeTextDirection(sl), total = Math.max(1, d.items.length);
      const rows = d.items.map((o, index) => {
        const n = steps ? ++k : 0;
        const stepAttr = steps ? ` data-step="${n}" data-step-anim="${ba === 'none' || o.role === 'command' ? 'none' : o.animation}"` : '';
        const commandStep = steps && o.role === 'command' ? ` data-step="${n}" data-step-anim="${ba === 'none' ? 'none' : 'type'}"` : '';
        const prefix = o.role === 'command' ? '<span class="term-prompt" aria-hidden="true">›</span>' : o.role === 'prompt' ? '<span class="term-prompt" aria-hidden="true">$</span>' : '<span class="term-gutter" aria-hidden="true"></span>';
        return `<div class="term-row" data-semantic-role="${o.role}" data-dramaturgy-item data-dramaturgy-focus="${n}" data-dramaturgy-progress="${((index + 1) / total).toFixed(3)}"${stepAttr}>${prefix}<code${commandStep}>${fmt(o.content)}</code>${o.annotation ? `<aside>${fmt(o.annotation)}</aside>` : ''}</div>`;
      }).join('');
      body = `<header class="term-heading">${sl.caption ? `<p>${fmt(sl.caption)}</p>` : ''}${title ? `<h2${tid(title)}>${fmt(title)}</h2>` : ''}</header><div class="term-window"><div class="term-chrome" aria-hidden="true"><i></i><i></i><i></i><span>scen / narrative</span></div><div class="term-log">${rows}</div></div>`;
      attrs += ` data-dramaturgy="semantic-text" data-dramaturgy-state="${steps ? 'overview' : 'restored'}" data-dramaturgy-reveal="progressive" data-text-mode="terminal"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'kodforklaring': {
      const d = normalizeTextDirection(sl), codeLines = String(sl.text || '').split(String.fromCharCode(13)).join('').split('\n');
      const focusByLine = new Map(); d.items.forEach((o, index) => { if (!focusByLine.has(o.line)) focusByLine.set(o.line, { ...o, index }); });
      const codeHtml = (raw, item) => {
        if (!item || !item.token) return esc(raw);
        const at = raw.indexOf(item.token);
        if (at < 0) return esc(raw);
        return esc(raw.slice(0, at)) + `<mark data-code-token>${esc(item.token)}</mark>` + esc(raw.slice(at + item.token.length));
      };
      const renderedLines = codeLines.map((raw, index) => {
        const item = focusByLine.get(index + 1), target = item ? ` data-dramaturgy-target data-dramaturgy-index="${item.index}"` : '';
        return `<div class="code-line" data-code-line="${index + 1}"${target}><span>${String(index + 1).padStart(2, '0')}</span><code>${codeHtml(raw, item)}</code></div>`;
      }).join('');
      const annotations = d.items.map((o, index) => `<aside class="code-note" data-dramaturgy-target data-dramaturgy-index="${index}"><b>${fmt(o.annotation || `Rad ${o.line}`)}</b>${o.result ? `<p>${fmt(o.result)}</p>` : ''}</aside>`).join('');
      const cues = d.items.map((o, index) => { const n = steps ? ++k : 0; return steps ? `<span data-dramaturgy-cue data-dramaturgy-focus="${n}" data-dramaturgy-target="${index}" data-step="${n}" data-step-anim="none" aria-hidden="true"></span>` : ''; }).join('');
      const restore = steps ? `<span data-dramaturgy-restore data-step="${++k}" data-step-anim="none" aria-hidden="true"></span>` : '';
      body = `<header class="code-heading">${sl.caption ? `<p>${fmt(sl.caption)}</p>` : ''}${title ? `<h2${tid(title)}>${fmt(title)}</h2>` : ''}</header><div class="code-stage"><div class="code-editor"><div class="code-tab"><i></i><span>exempel.js</span></div><div class="code-lines">${renderedLines}</div></div><div class="code-notes">${annotations}</div>${cues}${restore}</div>`;
      attrs += ` data-dramaturgy="semantic-text" data-dramaturgy-state="${steps ? 'overview' : 'restored'}" data-text-mode="code"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'typografisk':
    case 'texttempo': {
      const d = normalizeTextDirection(sl);
      const sequence = d.items.length ? d.items : [{ id: `${d.mode}-1`, role: 'statement', content: title || sl.text || 'En mening.', annotation: '' }];
      const frames = sequence.map((o, index) => { const length = plain(o.content).length, size = length > 78 ? ' type-long' : length > 52 ? ' type-medium' : length < 10 ? ' type-short' : ''; return `<div class="type-frame${size}" data-semantic-role="${o.role}" data-dramaturgy-target data-dramaturgy-index="${index}"><p>${fmt(o.content)}</p>${o.annotation ? `<small>${fmt(o.annotation)}</small>` : ''}</div>`; }).join('');
      const cues = sequence.slice(1).map((o, offset) => { const n = steps ? ++k : 0, target = offset + 1; return steps ? `<span data-dramaturgy-cue data-dramaturgy-focus="${n}" data-dramaturgy-target="${target}" data-step="${n}" data-step-anim="none" aria-hidden="true"></span>` : ''; }).join('');
      body = `${sl.caption ? `<p class="type-kicker">${fmt(sl.caption)}</p>` : ''}<div class="type-sequence" data-text-sequence>${frames}${cues}</div>`;
      attrs += ` data-dramaturgy="semantic-text" data-dramaturgy-state="${steps ? 'overview' : 'restored'}" data-dramaturgy-overview-target="0" data-dramaturgy-restored-target="${sequence.length - 1}" data-text-mode="${d.mode}"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'compare': {
      const col = (h, items, dir) => `<div>${h ? `<h3${A(steps ? 'fade' : anim(ba, dir), 200)}>${fmt(h)}</h3>` : ''}${list(items, 'cl', anim(ba, dir), 300)}</div>`;
      body = H2('', 'words') + (sl.text ? `<p class="lead"${A(anim(ba, 'fade'), 300)}>${fmt(sl.text)}</p>` : '') + `<div class="cols">${col(sl.lt, sl.lb, 'left')}${col(sl.rt, sl.rb, 'right')}</div>`;
      break;
    }
    case 'table': {
      const rows = (sl.table && sl.table.rows) || [];
      const header = !!(sl.table && sl.table.header) && rows.length > 1;
      const reveal = (sl.table && sl.table.reveal) || 'none';
      const ncols = rows.reduce((m, r) => Math.max(m, r.length), 0);
      const dense = ncols >= 7 ? ' class="dense xdense"' : (rows.length > 7 || ncols > 5 ? ' class="dense"' : '');
      const stepA = anim(ba, 'fade') === 'none' ? 'fade' : anim(ba, 'fade');
      let h = '';
      rows.forEach((r, ri) => {
        const isHead = header && ri === 0;
        const cells = [];
        const restStep = (!isHead && reveal === 'rest') ? ` data-step="${++k}" data-step-anim="${stepA}"` : '';
        for (let c = 0; c < ncols; c++) {
          const v = r[c] == null ? '' : r[c];
          if (isHead) cells.push(`<th>${fmt(v)}</th>`);
          else if (reveal === 'answers' && c === ncols - 1) cells.push(`<td class="ans"${st(stepA)}>${fmt(v)}</td>`);
          else if (restStep && c > 0) cells.push(`<td class="ans"${restStep}>${fmt(v)}</td>`);
          else cells.push(`<td>${fmt(v)}</td>`);
        }
        const rowStep = (!isHead && reveal === 'rows') ? st(stepA) : '';
        h += `<tr${rowStep}>${cells.join('')}</tr>`;
      });
      const tA = reveal === 'none' ? A(anim(ba, 'rise'), 300) : A(anim(ba, 'fade'), 250);
      body = H2('', 'words') + `<div class="tbl-wrap"${tA}><table${dense}>${h}</table></div>`;
      break;
    }
    case 'number':
      body = (title ? `<p class="label"${tid(title)}${A(anim(ta, 'fade'))}>${fmt(title)}</p>` : '') +
        `<p class="big"${A(anim(ba, 'count') === 'rise' ? 'count' : anim(ba, 'count'), 150)}>${fmt(sl.number || '0')}</p>` +
        (sl.text ? `<p class="unit"${A('rise', 700)}>${fmt(sl.text)}</p>` : '');
      break;
    case 'timeline': {
      const its = lines(sl.items).slice(0, 6).map(t => {
        const p = t.split('|');
        return { when: (p[0] || '').trim(), title: (p[1] || '').trim(), detail: p.slice(2).join('|').trim() };
      });
      const n = Math.max(1, its.length);
      const dense = n >= 5 || Math.max(0, ...its.map(o => plain(o.title + ' ' + o.detail).length)) > 80;
      const li = its.map((o, j) => {
        const progress = n > 1 ? j / (n - 1) : 1;
        const step = steps ? st('none') : '';
        return `<li class="tl-item" data-dramaturgy-item data-dramaturgy-focus="${j + 1}" data-dramaturgy-progress="${progress.toFixed(4)}"${step}><i class="tl-marker" aria-hidden="true"><span>${String(j + 1).padStart(2, '0')}</span></i><div class="tl-copy"><b class="tl-when">${fmt(o.when || String(j + 1))}</b><h3>${fmt(o.title || 'Händelse')}</h3>${o.detail ? `<p>${fmt(o.detail)}</p>` : ''}</div></li>`;
      }).join('');
      const restore = steps ? `<span class="dramaturgy-restore" data-dramaturgy-restore${st('none')} aria-hidden="true"></span>` : '';
      body = H2('', 'words') + (sl.text ? `<p class="lead tl-lead"${A(anim(ba, 'fade'), 250)}>${fmt(sl.text)}</p>` : '') +
        `<div class="tl-stage tl-count-${n}${dense ? ' tl-dense' : ''}" style="--n:${n}"${A(anim(ba, 'fade'), 200)}><div class="tl-rail" aria-hidden="true"><i class="tl-progress"></i></div><ol>${li}</ol>${restore}</div>`;
      attrs += ` data-dramaturgy="focus-restore" data-dramaturgy-state="${steps ? 'overview' : 'restored'}"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'question': {
      const its = lines(sl.bullets);
      const opts = its.length ? `<ol class="opts"${A(anim(ba, 'pop'), 500, ' data-stagger="120"')}>${its.map((t, j) => `<li><b>${String.fromCharCode(65 + j)}</b><span>${fmt(t)}</span></li>`).join('')}</ol>` : '';
      body = `<h2${tid(title)}${A(tA('words'))}>${fmt(title || 'Fråga?')}</h2>` + opts +
        (sl.answer ? `<p class="answer"${st('rise')}><b>Svar</b>${fmt(sl.answer)}</p>` : '');
      break;
    }
    case 'poll': {
      const its = lines(sl.bullets);
      let right = -1;
      const li = its.map((t, j) => {
        const ok = /^\*\s*/.test(t); if (ok && right < 0) right = j;
        return `<li${ok ? ' class="correct"' : ''} style="--p:0"><b>${String.fromCharCode(65 + j)}</b><span class="t">${fmt(t.replace(/^\*\s*/, ''))}</span><span class="pbar"></span><span class="n">0</span></li>`;
      }).join('');
      body = `<h2${tid(title)}${A(tA('words'))}>${fmt(title || 'Vad tror du?')}</h2>` +
        (sl.text ? `<p class="lead"${A('fade', 300)}>${fmt(sl.text)}</p>` : '') +
        `<ol class="poll"${A(anim(ba, 'rise'), 450, ' data-stagger="110"')}>${li}</ol>` +
        (right >= 0 ? `<p class="poll-reveal"${st('fade')}>Rätt svar: <b>${String.fromCharCode(65 + right)}</b>${sl.answer ? ' · ' + fmt(sl.answer) : ''}</p>` : '');
      break;
    }
    case 'reflect': {
      const min = Math.max(0.25, parseFloat(String(sl.minutes || '2').replace(',', '.')) || 2);
      const secs = Math.round(min * 60);
      const its = lines(sl.bullets);
      body = (sl.caption ? `<p class="part"${A('fade')}>${fmt(sl.caption)}</p>` : `<p class="part"${A('fade')}>Reflektion</p>`) +
        `<h2${tid(title)}${A(tA('words'), 100)}>${fmt(title || 'Vad tänker du?')}</h2>` +
        (sl.text ? `<p class="lead"${A('fade', 600)}>${fmt(sl.text)}</p>` : '') +
        (its.length ? `<ol class="tps"${A('rise', 800, ' data-stagger="140"')}>${its.map((t, j) => `<li><b>${j + 1}</b>${fmt(t)}</li>`).join('')}</ol>` : '') +
        `<div class="timer" data-timer="${secs}"${st('pop')}><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="trk" cx="60" cy="60" r="52"/><circle class="arc" cx="60" cy="60" r="52" pathLength="100"/></svg><span class="tt">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</span></div>`;
      cls = 'hastimer';
      break;
    }
    case 'define':
      body = (sl.caption ? `<p class="part"${A('fade')}>${fmt(sl.caption)}</p>` : '') +
        `<h1 class="term"${title ? tid(title) : ''}${A(tA('blur'))}>${fmt(title || 'Begrepp')}</h1>` +
        (sl.text ? `<p class="def"${A(anim(ba, 'rise'), 450)}>${fmt(sl.text)}</p>` : '') +
        (sl.example ? `<p class="ex"${st('rise')}><b>Exempel</b>${fmt(sl.example)}</p>` : '');
      break;
    case 'chat': {
      const its = lines(sl.items).map(t => { const p = t.split('|'); return p.length > 1 ? { who: p[0].trim(), t: p.slice(1).join('|').trim() } : { who: 'AI', t: t.trim() }; });
      const li = its.map(o => { const ai = /^(ai|claude|chatgpt|gpt|bot|assistent|copilot|gemini)/i.test(o.who); return `<li class="msg ${ai ? 'ai' : 'me'}"${steps ? st(ai ? 'rise' : 'left') : ''}><span class="who">${fmt(o.who)}</span><p>${fmt(o.t)}</p></li>`; }).join('');
      body = H2('', 'words') + `<ol class="chat"${!steps ? A('rise', 300, ' data-stagger="220"') : ''}>${li}</ol>`;
      break;
    }
    case 'duo': {
      const its = lines(sl.items).slice(0, 3).map(t => { const p = t.split('|'); return { n: (p[0] || '').trim(), t: p.slice(1).join('|').trim() }; });
      body = H2('', 'words') + `<div class="duo" style="--n:${Math.max(1, its.length)}">${its.map((o, j) => `<div${steps && j > 0 ? st('rise') : A('rise', 250)}><p class="big"${A('count', 300 + j * 200)}>${fmt(o.n)}</p><p class="unit">${fmt(o.t)}</p></div>`).join('')}</div>` +
        (sl.text ? `<p class="lead"${steps ? st('fade') : A('fade', 900)}>${fmt(sl.text)}</p>` : '');
      break;
    }
    case 'omslag': {
      const n = plain(title).length;
      const size = n <= 14 ? 't-s' : n <= 34 ? 't-m' : 't-l';
      const src = sl.image ? img(sl.image) : '';
      cls = 'omslag' + (src ? ' hasimg' : '');
      body = (sl.number ? `<div class="om-num" aria-hidden="true"${A('fade', 0, ' data-duration="2400"')}>${esc(sl.number)}</div>` : '') +
        `<div class="om-text"><div class="om-rule"${A('grow', 100)}></div>` +
        (sl.caption ? `<p class="kicker"${A('fade', 300)}>${fmt(sl.caption)}</p>` : '') +
        `<h1 class="om-title ${size}"${title ? tid(title) : ''}${A(tA('mask'), 420)}>${fmt(title || 'Rubrik')}</h1>` +
        (sl.text ? `<p class="om-body"${A(anim(ba, 'rise'), 900)}>${fmt(sl.text)}</p>` : '') + `</div>` +
        (src ? `<figure class="om-img"${A('reveal', 150)}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` : '');
      break;
    }
    case 'karta': {
      const dims = lines(sl.items).map(t => { const p = t.split('|'); return { n: p[0].trim(), d: p.slice(1).join('|').trim() }; });
      const act = parseInt(sl.active, 10) || 0;
      const n = Math.max(1, dims.length);
      const cols = n > 4 ? Math.ceil(n / 2) : n;
      const li = dims.map((o, j) => {
        const on = act === j + 1, off = act && !on;
        return `<li class="${on ? 'on' : ''}${off ? 'off' : ''}" data-id="map-${j}"${steps && !act ? st('rise') : ''}><span class="no">${String(j + 1).padStart(2, '0')}</span><b>${fmt(o.n)}</b>${o.d ? `<span class="d">${fmt(o.d)}</span>` : ''}${on ? '<em class="here">Här är vi</em>' : ''}</li>`;
      }).join('');
      cls = n > 4 ? 'rows2' : '';
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'words') +
        (sl.text ? `<p class="lead"${A('fade', 300)}>${fmt(sl.text)}</p>` : '') +
        `<div class="map" style="--cols:${cols}"><div class="map-line"${A('grow', 250)}></div><ol${(!steps || act) ? A(act ? 'fade' : bodyA, 350, ' data-stagger="90"') : ''}>${li}</ol></div>`;
      break;
    }
    case 'triad': {
      const its = lines(sl.items && lines(sl.items).length ? sl.items : sl.bullets);
      const pA = anim(ba, 'mask');
      const li = its.map(t => { const p = t.split('|'); return `<li${steps ? st(pA) : ''}>${p.length > 1 ? `<b>${fmt(p[0].trim())}</b><span>${fmt(p.slice(1).join('|').trim())}</span>` : `<span>${fmt(t)}</span>`}</li>`; }).join('');
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('small', 'words') +
        `<ol class="triad"${!steps ? A(pA, 300, ' data-stagger="220"') : ''}>${li}</ol>` +
        (sl.text ? `<p class="landing"${steps ? st('mask') : A('mask', 1200)}>${fmt(sl.text)}</p>` : '');
      break;
    }
    case 'motsats': {
      const its = lines(sl.items).map(t => { const p = t.split('|'); return p.length > 1 ? { h: p[0].trim(), t: p.slice(1).join('|').trim() } : { h: '', t: t.trim() }; });
      const [a, b, note] = its;
      const src = sl.image && !sl.banner ? img(sl.image) : '';
      if (src) cls = 'imgside' + (sl.flip ? ' flip' : '');
      const side = (o, k, dir) => o ? `<div class="side ${k}"${steps ? st(dir) : A(dir, k === 'a' ? 300 : 500)}>${o.h ? `<span class="tag">${fmt(o.h)}</span>` : ''}<p>${fmt(o.t)}</p></div>` : '';
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') +
        `<div class="duel">${side(a, 'a', 'left')}<div class="vs" aria-hidden="true"${A('fade', 200)}>/</div>${side(b, 'b', 'right')}</div>` +
        (note ? `<p class="note"${steps ? st('fade') : A('fade', 800)}>${note.h ? `<b>${fmt(note.h)}</b>` : ''}<span>${fmt(note.t)}</span></p>` : '') +
        (src ? `<figure class="side-img"${A('reveal', 0)}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` : '');
      break;
    }
    case 'bildkant': {
      const src = sl.image ? img(sl.image) : '';
      cls = sl.flip ? 'flip' : '';
      body = (src ? `<figure class="bk-img"${A(sl.flip ? 'cornerb' : 'corner', 0)}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` : '') +
        `<div class="bk-text">${sl.caption ? `<p class="kicker"${A('fade', 300)}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}` +
        (sl.text ? `<p class="lead"${A('fade', 600)}>${fmt(sl.text)}</p>` : '') + list(sl.bullets, 'points', anim(ba, 'rise'), 800) + `</div>`;
      break;
    }
    case 'tom':
      body = '';
      break;
    case 'båge': {
      const uid = 'u' + hash((sl.id || '') + i + L);
      cls = 'bana-bage ' + uid;
      const n = plain(title).length;
      const size = n <= 18 ? 't-s' : n <= 40 ? 't-m' : 't-l';
      const arc = R => `M 0 ${1080 - R} A ${R} ${R} 0 0 1 ${R} 1080`;
      const kick = sl.caption ? esc(plain(sl.caption)) : '';
      const band = kick ? Array(5).fill(kick).join(' · ') : '';
      body = `<svg class="bg-arcs" viewBox="0 0 1920 1080" aria-hidden="true"><defs><path id="${uid}-k" d="${arc(1420)}"/></defs>
        <path class="a1" d="${arc(1180)}" pathLength="1"${A('draw', 100, ' data-duration="1800"')}/>
        <path class="a2" d="${arc(1270)}" pathLength="1"${A('draw', 350, ' data-duration="2000"')}/>
        <path class="a4" d="${arc(1600)}"/>
        ${band ? `<text class="kt"><textPath href="#${uid}-k" startOffset="3%"${A('glide', 500, ' data-from="40"')}>${band}</textPath></text>` : ''}
      </svg>
      <div class="planet" style="offset-path:path('${arc(1270)}');offset-distance:64%"${A('travel', 700, ' data-from="12%" data-duration="2200"')}></div>` +
        (sl.number ? `<div class="bg-num" aria-hidden="true"${A('fade', 900, ' data-duration="1600"')}>${esc(sl.number)}</div>` : '') +
        `<div class="bg-text"><h1 class="bg-title ${size}"${title ? tid(title) : ''}${A(tA('mask'), 500)}>${fmt(title || 'Rubrik')}</h1>` +
        (sl.text ? `<p class="bg-lead"${A(anim(ba, 'rise'), 1000)}>${fmt(sl.text)}</p>` : '') + `</div>`;
      break;
    }
    case 'omlopp': {
      const uid = 'u' + hash((sl.id || '') + i + L);
      cls = 'bana-omlopp ' + uid;
      const its = lines(sl.items).slice(0, 6).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      const n = Math.max(1, its.length), cx = 960, cy = 600, rx = 560, ry = 270;
      const P = t => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
      const ell = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
      const nodes = its.map((o, j) => {
        const t = -Math.PI / 2 + j * 2 * Math.PI / n;
        const [x, y] = P(t);
        const c = Math.cos(t), sn = Math.sin(t);
        const side = c > .35 ? 'r' : c < -.35 ? 'l' : sn < 0 ? 't' : 'b';
        const frames = []; for (let q = 0; q <= 18; q++) { const tt = t - 1.4 * (1 - q / 18); const [px, py] = P(tt); frames.push([Math.round(px - x), Math.round(py - y)]); }
        return `<div class="om-node s-${side}" style="left:${Math.round(x)}px;top:${Math.round(y)}px"${steps ? st('orbit') : A('orbit', 500 + j * 180)} data-path="${frames.map(f => f.join(',')).join(' ')}"><i></i><div class="om-lab">${o.h ? `<b>${fmt(o.h)}</b>` : ''}${o.t ? `<span>${fmt(o.t)}</span>` : ''}</div></div>`;
      }).join('');
      body = (sl.caption ? `<p class="kicker om-k"${A('fade')}>${fmt(sl.caption)}</p>` : '') +
        (sl.text ? `<p class="om-lead"${A('fade', 400)}>${fmt(sl.text)}</p>` : '') +
        `<svg class="om-svg" viewBox="0 0 1920 1080" aria-hidden="true"><ellipse class="o2" cx="${cx}" cy="${cy}" rx="${rx + 150}" ry="${ry + 110}"/><path class="o1" d="${ell}" pathLength="1"${A('draw', 150, ' data-duration="1800"')}/></svg>` +
        `<div class="om-core"${A('zoom', 200)}><span class="om-ring" aria-hidden="true"></span><h2${title ? tid(title) : ''}>${fmt(title || 'Begrepp')}</h2></div>` + nodes;
      break;
    }
    case 'gradskiva': {
      const uid = 'u' + hash((sl.id || '') + i + L);
      cls = 'bana-gs ' + uid;
      const its = lines(sl.items).slice(0, 8).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      const n = Math.max(1, its.length), cx = 960, cy = 930, r = 560;
      const ang = j => n === 1 ? 90 : 180 - j * 180 / (n - 1);
      let ticks = '';
      for (let d = 0; d <= 180; d += 3) { const a = d * Math.PI / 180, l = d % 15 === 0 ? 34 : 16; ticks += `M${(cx + (r + 8) * Math.cos(a)).toFixed(1)} ${(cy - (r + 8) * Math.sin(a)).toFixed(1)}L${(cx + (r + 8 + l) * Math.cos(a)).toFixed(1)} ${(cy - (r + 8 + l) * Math.sin(a)).toFixed(1)}`; }
      const arcD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
      let css = '';
      const labs = its.map((o, j) => {
        const d = ang(j), a = d * Math.PI / 180, x = cx + (r + 96) * Math.cos(a), y = cy - (r + 96) * Math.sin(a);
        const al = Math.cos(a) < -.25 ? 'r' : Math.cos(a) > .25 ? 'l' : 'c';
        const off = (100 - (180 - d) / 180 * 100).toFixed(2);
        const sel = `.${uid}:has(.gs-l.k${j}.in)`;
        css += `${sel} .gs-needle{transform:rotate(${-d}deg)}${sel} .gs-prog{stroke-dashoffset:${off}}${sel} .gs-d:not(.k${j}){opacity:0;transform:translateY(16px)}${sel} .gs-d.k${j}{opacity:1;transform:none}${sel} .gs-l.k${j} b{color:var(--accent)}`;
        return `<div class="gs-l k${j} a-${al}" style="left:${Math.round(x)}px;top:${Math.round(y)}px"${steps ? st('fade') : ''}><b>${fmt(o.h)}</b></div>`;
      }).join('');
      const last = n - 1, dl = ang(last);
      css += `.scen.static .${uid} .gs-needle{transform:rotate(${-dl}deg)}.scen.static .${uid} .gs-prog{stroke-dashoffset:${(100 - (180 - dl) / 180 * 100).toFixed(2)}}.scen.static .${uid} .gs-d.k${last}{opacity:1;transform:none}`;
      if (!steps) css += `.${uid} .gs-needle{transform:rotate(${-dl}deg)}.${uid} .gs-prog{stroke-dashoffset:${(100 - (180 - dl) / 180 * 100).toFixed(2)}}.${uid} .gs-d.k${last}{opacity:1;transform:none}`;
      body = `<style>${css}</style>` + (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') +
        `<svg class="gs-svg" viewBox="0 0 1920 1080" aria-hidden="true"><path class="gs-ticks" d="${ticks}"${A('fade', 300, ' data-duration="1400"')}/><path class="gs-base" d="${arcD}" pathLength="1"${A('draw', 150, ' data-duration="1600"')}/><path class="gs-prog" d="${arcD}" pathLength="100"/></svg>` +
        `<div class="gs-needle" style="left:${cx}px;top:${cy}px;width:${r - 40}px"${A('fade', 600)}></div><div class="gs-hub" style="left:${cx}px;top:${cy}px"></div>` + labs +
        `<div class="gs-ds" style="left:${cx}px;top:${cy - 250}px">${its.map((o, j) => `<p class="gs-d k${j}">${fmt(o.t)}</p>`).join('')}</div>`;
      break;
    }
    case 'graf': {
      /* Noder och kanter i fast geometri. Fokus: noder, kanter, vikter, en nod, en kant (A - B)
         eller en väg (A > B > C) som ritas i färdriktningen. */
      const G2 = parseGraf(sl.items), focus = gtFocusLines(sl.items);
      const hasPan = !!(focus.some(f => f.head || f.text) || plain(sl.text || '') || plain(sl.conclusion || ''));
      const AX = hasPan ? 760 : 200, AY = 300, AW = hasPan ? 1000 : 1520, AH = 640;
      const px = n => [AX + n.x / 100 * AW, AY + n.y / 100 * AH];
      const cx = G2.nodes.reduce((s, n) => s + n.x, 0) / (G2.nodes.length || 1), cy = G2.nodes.reduce((s, n) => s + n.y, 0) / (G2.nodes.length || 1);
      const inN = {}, inE = {}, inW = {}, extra = {};
      const find = name => G2.byKey[gtKey(name)];
      const edgeOf = (a, b) => G2.edges.find(e => (e.a === a && e.b === b) || (!e.dir && e.a === b && e.b === a) || (e.dir && e.a === b && e.b === a));
      const routes = [];
      focus.forEach((f, j) => {
        const t = gtKey(f.target);
        if (t === 'noder' || t === 'alla noder') G2.nodes.forEach(n => gtAdd(inN, n.i, j));
        else if (t === 'kanter' || t === 'alla kanter') G2.edges.forEach(e => gtAdd(inE, e.i, j));
        else if (t === 'vikter') G2.edges.forEach(e => { gtAdd(inE, e.i, j); gtAdd(inW, e.i, j); });
        else if (/\s(>|->|→)\s/.test(f.target)) {
          const ns = f.target.split(/\s+(?:->|>|→)\s+/).map(find).filter(Boolean);
          if (ns.length < 2) return;
          ns.forEach(n => gtAdd(inN, n.i, j));
          let sum = 0, numeric = true;
          for (let q = 1; q < ns.length; q++) {
            const e = edgeOf(ns[q - 1], ns[q]);
            if (e) { gtAdd(inW, e.i, j); const v = parseFloat(String(e.w).replace(',', '.')); if (Number.isFinite(v)) sum += v; else numeric = false; } else numeric = false;
          }
          if (numeric && ns.length > 2) extra[j] = `<p class="gt-sum"><span>Summa längs vägen</span><b>${+sum.toFixed(2)}</b></p>`;
          routes.push({ j, ns });
        } else if (/\s(-|–|—)\s/.test(f.target)) {
          const p = f.target.split(/\s+[-–—]\s+/).map(find);
          const e = p[0] && p[1] && edgeOf(p[0], p[1]);
          if (e) { gtAdd(inE, e.i, j); gtAdd(inW, e.i, j); gtAdd(inN, e.a.i, j); gtAdd(inN, e.b.i, j); }
        } else {
          const n = find(f.target);
          if (n) { gtAdd(inN, n.i, j); G2.edges.forEach(e => { if (e.a === n || e.b === n) gtAdd(inE, e.i, j); }); }
        }
      });
      const R = 15, trim = (a, b, d) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [a[0] + (b[0] - a[0]) * d / L, a[1] + (b[1] - a[1]) * d / L]; };
      let edges = '', weights = '', chev = '';
      G2.edges.forEach(e => {
        const A0 = px(e.a), B0 = px(e.b), a = trim(A0, B0, R + 6), b = trim(B0, A0, R + 6);
        edges += `<line class="gr-edge"${gtIn(inE[e.i])} x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
        const ang = Math.atan2(B0[1] - A0[1], B0[0] - A0[0]) * 180 / Math.PI;
        if (e.dir) { const m = [A0[0] + (B0[0] - A0[0]) * .56, A0[1] + (B0[1] - A0[1]) * .56]; chev += `<path class="gr-chev"${gtIn(inE[e.i])} d="M-9 -11 L5 0 L-9 11" transform="translate(${m[0].toFixed(1)} ${m[1].toFixed(1)}) rotate(${ang.toFixed(1)})"/>`; }
        if (e.w) { const m = [(A0[0] + B0[0]) / 2, (A0[1] + B0[1]) / 2]; weights += `<span class="gr-w"${gtIn(inW[e.i] || inE[e.i])} style="left:${Math.round(m[0])}px;top:${Math.round(m[1])}px">${fmt(e.w)}</span>`; }
      });
      const route = routes.map(r => {
        const pts = r.ns.map(px), d = pts.map((p, q) => {
          const pp = q === 0 ? trim(p, pts[1], R + 6) : q === pts.length - 1 ? trim(p, pts[q - 1], R + 6) : p;
          return (q ? 'L' : 'M') + pp[0].toFixed(1) + ' ' + pp[1].toFixed(1);
        }).join(' ');
        let len = 0; for (let q = 1; q < pts.length; q++) len += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
        return `<path class="gt-route" data-dramaturgy-in="${r.j}" d="${d}" pathLength="1" style="--dur:${Math.round(Math.max(900, Math.min(2600, 500 + len * 1.4)))}ms"/>`;
      }).join('');
      const svgNodes = G2.nodes.map(n => { const [x, y] = px(n); return `<g class="gr-node"${gtIn(inN[n.i])} transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="halo" r="34"/><circle class="mk" r="${R}"/></g>`; }).join('');
      const size = G2.nodes.length <= 6 ? 34 : G2.nodes.length <= 9 ? 28 : 23;
      const labs = G2.nodes.map(n => {
        const [x, y] = px(n), dx = n.x - cx, dy = n.y - cy;
        const side = Math.abs(dx) * .8 > Math.abs(dy) ? (dx < 0 ? 'l' : 'r') : (dy < 0 ? 't' : 'b');
        return `<span class="gr-lab side-${side}"${gtIn(inN[n.i])} style="left:${Math.round(x)}px;top:${Math.round(y)}px;--gs:${size}px">${fmt(n.name)}</span>`;
      }).join('');
      let cues = '';
      if (steps) {
        focus.forEach((f, j) => { const s = st('none'); cues += `<span data-dramaturgy-cue data-dramaturgy-focus="${k}" data-dramaturgy-target="${j}"${s} aria-hidden="true"></span>`; });
        cues += `<span data-dramaturgy-restore${st('none')} aria-hidden="true"></span>`;
      }
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') +
        `<div class="gt-stage"${A(anim(ba, 'fade'), 150)}><svg class="gt-svg" viewBox="0 0 1920 1080" aria-hidden="true">${edges}${chev}${route}${svgNodes}</svg>${weights}${labs}</div>` +
        (hasPan ? gtPanel(sl.text, focus, sl.conclusion, extra, 144, 330, 520) : '') + cues;
      if (plain(title).length > 44) cls = 'gt-long';
      attrs += ` data-dramaturgy="focus-restore" data-dramaturgy-state="${steps ? 'overview' : 'restored'}"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'trad': {
      /* Ett träd ur indragen lista. "svar: nod" ger grenen en etikett.
         Fokus: rot, löv, föräldrar, grenar, nivå N, barn X, en nod, eller väg a > b (svar eller nod i tur och ordning). */
      const T2 = parseTrad(sl.items), focus = gtFocusLines(sl.items);
      const hasPan = !!(focus.some(f => f.head || f.text) || plain(sl.text || '') || plain(sl.conclusion || ''));
      const AX = hasPan ? 740 : 180, AW = hasPan ? 1060 : 1560, AY = 300, AH = 620;
      const N = Math.max(1, T2.leaves), Lv = Math.max(1, T2.levels);
      const slotW = AW / N;
      const round = T2.all.length && T2.all.every(n => plain(n.label).length <= 3);
      const fs = round ? 40 : N <= 3 ? 36 : N <= 5 ? 30 : N <= 7 ? 25 : 21;
      const P = n => [AX + (n.slot + .5) * slotW, Lv === 1 ? AY + AH / 2 : AY + n.depth * AH / (Lv - 1)];
      const hb = round ? 44 : fs * .72 + 12;
      const inN = {}, inE = {}, extra = {}, routes = [];
      const leaves = T2.all.filter(n => !n.kids.length);
      const byLabel = t => T2.all.filter(n => gtKey(n.label) === t);
      const pathTo = n => { const p = []; while (n) { p.unshift(n); n = n.parent; } return p; };
      focus.forEach((f, j) => {
        const t = gtKey(f.target);
        let m;
        if (t === 'rot') T2.roots.forEach(n => gtAdd(inN, n.i, j));
        else if (t === 'löv' || t === 'lövnoder') leaves.forEach(n => gtAdd(inN, n.i, j));
        else if (/^(föräldrar|föräldranoder|frågor|inre noder)$/.test(t)) T2.all.filter(n => n.kids.length).forEach(n => gtAdd(inN, n.i, j));
        else if (/^(grenar|kanter|svar)$/.test(t)) T2.all.filter(n => n.parent).forEach(n => gtAdd(inE, n.i, j));
        else if ((m = t.match(/^nivå\s+(\d+)$/))) T2.all.filter(n => n.depth === +m[1] - 1).forEach(n => gtAdd(inN, n.i, j));
        else if ((m = t.match(/^barn\s+(.+)$/))) byLabel(m[1]).forEach(p => p.kids.forEach(c => { gtAdd(inN, c.i, j); gtAdd(inE, c.i, j); }));
        else if ((m = f.target.match(/^\s*väg\s+(.+)$/i))) {
          let cur = T2.roots[0]; if (!cur) return;
          const way = [cur];
          m[1].split(/\s+(?:->|>|→)\s+/).map(gtKey).forEach(tok => {
            if (!cur) return;
            const nx = cur.kids.find(c => gtKey(c.edge) === tok) || cur.kids.find(c => gtKey(c.label) === tok);
            if (nx) { way.push(nx); cur = nx; } else cur = null;
          });
          way.forEach(n => gtAdd(inN, n.i, j));
          way.slice(1).forEach(n => gtAdd(inE, n.i, j));
          if (way.length > 1) routes.push({ j, way });
        } else byLabel(t).forEach(n => { gtAdd(inN, n.i, j); if (n.parent) gtAdd(inE, n.i, j); });
      });
      const seg = n => { const [x1, y1] = P(n.parent), [x2, y2] = P(n), a = y1 + hb, b = y2 - hb, mid = (a + b) / 2; return { d: `M${x1.toFixed(1)} ${a.toFixed(1)} C${x1.toFixed(1)} ${mid.toFixed(1)} ${x2.toFixed(1)} ${mid.toFixed(1)} ${x2.toFixed(1)} ${b.toFixed(1)}`, m: [(x1 + x2) / 2, mid], len: Math.hypot(x2 - x1, b - a) }; };
      let edges = '', elabs = '';
      T2.all.filter(n => n.parent).forEach(n => {
        const s = seg(n), onRoute = routes.some(r => r.way.includes(n));
        edges += `<path class="tr-edge"${gtIn(inE[n.i])} d="${s.d}"/>`;
        if (n.edge) elabs += `<span class="tr-elab${onRoute ? '' : ''}"${gtIn(inE[n.i])} style="left:${Math.round(s.m[0])}px;top:${Math.round(s.m[1])}px">${fmt(n.edge)}</span>`;
      });
      const route = routes.map(r => {
        let d = '', len = 0;
        r.way.slice(1).forEach((n, q) => { const s = seg(n); d += (q ? ' ' : '') + s.d; len += s.len; });
        return `<path class="gt-route" data-dramaturgy-in="${r.j}" d="${d}" pathLength="1" style="--dur:${Math.round(Math.max(900, Math.min(2800, 500 + len * 1.5)))}ms"/>`;
      }).join('');
      const nodes = T2.all.map(n => {
        const [x, y] = P(n), kind = n.kids.length ? (n.parent ? 'tr-inner' : 'tr-root') : 'tr-leaf';
        return `<span class="tr-node ${kind}${round ? ' tr-round' : ''}"${gtIn(inN[n.i])} style="left:${Math.round(x)}px;top:${Math.round(y)}px;--ts:${fs}px;max-width:${Math.round(Math.max(120, slotW - 18))}px">${fmt(n.label)}</span>`;
      }).join('');
      let cues = '';
      if (steps) {
        focus.forEach((f, j) => { const s = st('none'); cues += `<span data-dramaturgy-cue data-dramaturgy-focus="${k}" data-dramaturgy-target="${j}"${s} aria-hidden="true"></span>`; });
        cues += `<span data-dramaturgy-restore${st('none')} aria-hidden="true"></span>`;
      }
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') +
        `<div class="gt-stage"${A(anim(ba, 'fade'), 150)}><svg class="gt-svg" viewBox="0 0 1920 1080" aria-hidden="true">${edges}${route}</svg>${elabs}${nodes}</div>` +
        (hasPan ? gtPanel(sl.text, focus, sl.conclusion, extra, 144, 330, 500) : '') + cues;
      if (plain(title).length > 44) cls = 'gt-long';
      attrs += ` data-dramaturgy="focus-restore" data-dramaturgy-state="${steps ? 'overview' : 'restored'}"${steps ? '' : ' data-dramaturgy-static="true"'}`;
      break;
    }
    case 'bro': {
      /* Bågen bär stegen, golvet är sammanhanget de börjar och slutar i.
         Med retur blir bron en loop: sista fokus följer resultatet längs golvet tillbaka.
         Geometrin är fast mellan klick. Bara ljus, tjocklek och opacitet ändras. */
      const its = lines(sl.items).slice(0, 5).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      const n = its.length, loop = !!plain(sl.ret || '');
      const CX = 960, CY = 820, RX = 640, RY = 520, rad = d => d * Math.PI / 180;
      const pt = d => [+(CX + RX * Math.cos(rad(d))).toFixed(2), +(CY - RY * Math.sin(rad(d))).toFixed(2)];
      const angs = n === 1 ? [90] : its.map((_, j) => 150 - j * 120 / (n - 1));
      const P = angs.map(pt), FL = [CX - RX, CY], FR = [CX + RX, CY];
      const Mv = p => `M${p[0]} ${p[1]}`, Ac = p => `A${RX} ${RY} 0 0 1 ${p[0]} ${p[1]}`, Ln = p => `L${p[0]} ${p[1]}`;
      const from = j => j === 0 ? 180 : angs[j - 1], to = j => j === n ? 0 : angs[j];
      const halfArc = Math.PI * (3 * (RX + RY) - Math.sqrt((3 * RX + RY) * (RX + 3 * RY))) / 2, floor = 2 * RX;
      const arcLen = j => halfArc * (from(j) - to(j)) / 180;
      const segD = j => `${Mv(j === 0 ? FL : P[j - 1])} ${Ac(j === n ? FR : P[j])}`;
      const T = (j, extra) => ` data-dramaturgy-target data-dramaturgy-index="${j}"${extra ? ` class="${extra}"` : ''}`;
      const tag = j => (j === 0 ? ' br-first' : '') + (j === n ? ' br-last' : '');
      const dur = len => Math.round(Math.max(1700, Math.min(3600, 900 + len * 1.9)));
      const chev = (x, y, a, j) => `<path${T(j, 'br-chev' + tag(j))} d="M-6 -8 L4 0 L-6 8" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"/>`;
      let segs = '', hls = '', sigs = '', chevs = '';
      for (let j = 0; j <= n; j++) {
        const d = segD(j), mid = (from(j) + to(j)) / 2, m = pt(mid);
        const ang = Math.atan2(RY * Math.cos(rad(mid)), RX * Math.sin(rad(mid))) * 180 / Math.PI;
        const lastLoop = j === n && loop, len = arcLen(j) + (lastLoop ? floor : 0);
        segs += `<path${T(j, 'br-seg' + tag(j))} d="${d}"/>`;
        hls += `<path${T(j, 'br-hl' + tag(j))} d="${d}" pathLength="1" style="--d:${(j * .15).toFixed(2)}s"/>`;
        sigs += `<path${T(j, 'br-sig' + tag(j))} d="${d}${lastLoop ? ' ' + Ln(FL) : ''}" pathLength="1" style="--dur:${dur(len)}ms"/>`;
        chevs += chev(m[0], m[1], ang, j);
      }
      let ret = '';
      if (loop) {
        const rd = `${Mv(FR)} ${Ln(FL)}`, lastLen = arcLen(n) + floor, D = dur(lastLen);
        const land = .8 * (arcLen(n) / lastLen) / (1 + .07);
        segs += `<path${T(n, 'br-seg br-ret br-last')} d="${rd}"/>`;
        hls += `<path${T(n, 'br-hl br-ret br-last')} d="${rd}" pathLength="1" style="--d:${((n + .8) * .15).toFixed(2)}s"/>`;
        chevs += chev(CX, CY, 180, n);
        ret = `<ellipse${T(n, 'br-ripple br-last')} cx="${FR[0]}" cy="${FR[1]}" rx="200" ry="30" style="--dur:${D}ms;--rd:${Math.round(700 + land * D)}ms"/>`;
      }
      const orbit = `${Mv(FL)} ${Ac([CX, CY - RY])} ${Ac(FR)}${loop ? ' ' + Ln(FL) : ''}`;
      const size = n <= 3 ? { h: 76, s: 28, w: 440 } : n === 4 ? { h: 60, s: 26, w: 360 } : { h: 44, s: 24, w: 300 };
      const stops = its.map((o, j) => {
        const [x, y] = P[j], a = angs[j];
        const side = a > 125 ? 'l' : a < 55 ? 'r' : 'c';
        const left = side === 'l' ? x + 70 : side === 'r' ? x - 70 - size.w : x - size.w / 2;
        const top = side === 'c' ? y + (n === 5 ? 44 : 50) : y - (n === 5 ? 12 : size.h * .58);
        return `<div${T(j, `br-lab br-stop side-${side}` + tag(j))} style="left:${Math.round(left)}px;top:${Math.round(top)}px;width:${size.w}px;--brh:${size.h}px;--brs:${size.s}px"><b>${fmt(o.h)}</b>${o.t ? `<span>${fmt(o.t)}</span>` : ''}</div>`;
      }).join('');
      const nodes = P.map((p, j) => `<g${T(j, 'br-node' + tag(j))} transform="translate(${p[0]} ${p[1]})"><circle class="halo" r="32"/><circle class="mk" r="11"/></g>`).join('');
      let cues = '';
      if (steps) {
        for (let j = 0; j <= n; j++) { const s = st('none'); cues += `<span data-dramaturgy-cue data-dramaturgy-focus="${k}" data-dramaturgy-target="${j}"${s} aria-hidden="true"></span>`; }
        cues += `<span data-dramaturgy-restore${st('none')} aria-hidden="true"></span>`;
      }
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') +
        `<svg class="br-svg" viewBox="0 0 1920 1080" aria-hidden="true"${A(anim(ba, 'fade'), 150)}>` +
        `<rect class="br-floor" x="0" y="${CY}" width="1920" height="${1080 - CY}"/><line class="br-ground" x1="0" y1="${CY}" x2="1920" y2="${CY}"/>` +
        segs + hls + chevs + ret + sigs + `<path class="br-orbit" d="${orbit}" pathLength="1" style="--dur:${loop ? 9000 : 6000}ms"/>` +
        `<line${T(0, 'br-foot br-first')} x1="${FL[0]}" y1="${CY - 12}" x2="${FL[0]}" y2="${CY + 12}"/><line${T(n, 'br-foot br-last')} x1="${FR[0]}" y1="${CY - 12}" x2="${FR[0]}" y2="${CY + 12}"/>` +
        nodes + `</svg>` + stops +
        `<p${T(0, 'br-lab br-floorlab br-start br-first')} style="left:${FL[0] - 260}px">${fmt(sl.lt || 'Start')}</p>` +
        `<p${T(n, 'br-lab br-floorlab br-end br-last')} style="left:${FR[0] - 260}px">${fmt(sl.rt || 'Mål')}</p>` +
        (loop ? `<p${T(n, 'br-lab br-retlab br-last')}>${fmt(sl.ret)}</p>` : '') +
        (sl.text ? `<p class="br-cap" style="--capw:${n === 5 ? 760 : 1040}px"${A(anim(ba, 'fade'), 400)}>${fmt(sl.text)}</p>` : '') + cues;
      if (plain(title).length > 44) cls = 'br-long';
      attrs += ` data-dramaturgy="focus-restore" data-dramaturgy-state="${steps ? 'overview' : 'restored'}"${steps ? '' : ' data-dramaturgy-static="true"'}${loop ? ' data-bro-loop="true"' : ''}`;
      break;
    }
    case 'ringar': {
      const its = lines(sl.items).slice(0, 3).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      const n = Math.max(2, its.length);
      const C = n === 2 ? [[770, 610], [1150, 610]] : [[820, 530], [1100, 530], [960, 770]];
      const r = n === 2 ? 330 : 280;
      const gx = C.reduce((a, p) => a + p[0], 0) / n, gy = C.reduce((a, p) => a + p[1], 0) / n;
      const rings = its.map((o, j) => {
        const [x, y] = C[j]; const vx = x - gx, vy = y - gy, L2 = Math.hypot(vx, vy) || 1;
        const lx = x + vx / L2 * r * .42, ly = y + vy / L2 * r * .42;
        return `<div class="rg c${j}" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px"${steps ? st('pop') : A('pop', 300 + j * 250)}></div><div class="rg-lab" style="left:${Math.round(lx)}px;top:${Math.round(ly)}px"${steps ? ` data-step="${k}" data-step-anim="fade"` : A('fade', 500 + j * 250)}><b>${fmt(o.h)}</b>${o.t ? `<span>${fmt(o.t)}</span>` : ''}</div>`;
      }).join('');
      body = (sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : '') + H2('', 'mask') + rings +
        (sl.text ? `<div class="rg-mid" style="left:${Math.round(gx)}px;top:${Math.round(gy)}px"${steps ? st('zoom') : A('zoom', 1300)}>${fmt(sl.text)}</div>` : '');
      cls = 'bana-ringar';
      break;
    }
    case 'lins': {
      const uid = 'u' + hash((sl.id || '') + i + L);
      const src = sl.image ? img(sl.image) : '';
      cls = 'bana-lins ' + uid;
      const its = lines(sl.items).slice(0, 6).map((t, j) => {
        const p = t.split('|').map(x => x.trim());
        const m = (p[0] || '').match(/^(\d+(?:[.,]\d+)?)\s*%?\s+(\d+(?:[.,]\d+)?)\s*%?$/);
        const x = m ? parseFloat(m[1].replace(',', '.')) : 25 + (j % 3) * 25, y = m ? parseFloat(m[2].replace(',', '.')) : 35 + Math.floor(j / 3) * 30;
        const rest = m ? p.slice(1) : p;
        return { x, y, h: rest[0] || '', t: rest.slice(1).join(' | ') };
      });
      const lr = Math.max(120, Math.min(360, parseInt(sl.number, 10) || 230));
      let css = `.${uid}{--lx:50%;--ly:50%;--lr:0px}`;
      const caps = its.map((o, j) => {
        const sel = `.${uid}:has(.ln-s.k${j}.in)`;
        css += `${sel}{--lx:${o.x}%;--ly:${o.y}%;--lr:${lr}px}${sel} .ln-c:not(.k${j}){opacity:0;transform:translateY(-50%) translateX(var(--cdx,0)) scale(.96)}${sel} .ln-c.k${j}{opacity:1}`;
        const right = o.x < 55;
        const cx = right ? `calc(${o.x}% + ${lr + 40}px)` : `calc(${o.x}% - ${lr + 40}px - 520px)`;
        return `<span class="ln-s k${j}"${steps ? st('fade') : ''}></span><div class="ln-c k${j}" style="left:${cx};top:${o.y}%">${o.h ? `<b>${fmt(o.h)}</b>` : ''}${o.t ? `<span>${fmt(o.t)}</span>` : ''}</div>`;
      }).join('');
      const lastI = its[its.length - 1];
      if (lastI) css += `.scen.static .${uid}{--lx:${lastI.x}%;--ly:${lastI.y}%;--lr:${lr}px}.scen.static .${uid} .ln-c.k${its.length - 1}{opacity:1}`;
      body = `<style>${css}</style>` + (src ? `<img class="ln-base" src="${esc(src)}" alt="${esc(sl.alt || '')}"${A('fade', 0, ' data-duration="1400"')}><img class="ln-lens" src="${esc(src)}" alt="" aria-hidden="true">` : '<div class="ph">Välj en bild</div>') +
        `<div class="ln-ring" aria-hidden="true"></div><div class="ln-shade" aria-hidden="true"></div>` +
        `<div class="ln-head">${sl.caption ? `<p class="kicker"${A('fade', 200)}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}${sl.text ? `<p class="lead"${A('fade', 600)}>${fmt(sl.text)}</p>` : ''}</div>` + caps;
      break;
    }
    case 'mätare': {
      const uid = 'u' + hash((sl.id || '') + i + L);
      cls = 'bana-mt ' + uid;
      const raw = plain(sl.number || '0');
      let frac = 0;
      const pm = raw.match(/(-?\d+(?:[.,]\d+)?)\s*%/), av = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:av|\/|of)\s*(\d+(?:[.,]\d+)?)/i), nm = raw.match(/-?\d+(?:[.,]\d+)?/);
      if (av) frac = parseFloat(av[1].replace(',', '.')) / parseFloat(av[2].replace(',', '.'));
      else if (pm) frac = parseFloat(pm[1].replace(',', '.')) / 100;
      else if (nm) frac = parseFloat(nm[0].replace(',', '.')) / (parseFloat(String(sl.max || '100').replace(',', '.')) || 100);
      frac = Math.max(0, Math.min(1, frac || 0));
      const cx = 1330, cy = 560, r = 330;
      const pt = deg => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
      const [sx, sy] = pt(135), [ex, ey] = pt(45);
      const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 1 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      let ticks = '';
      for (let q = 0; q <= 27; q++) { const deg = 135 + q * 10, a = deg * Math.PI / 180, l = q % 3 === 0 ? 30 : 14; ticks += `M${(cx + (r + 34) * Math.cos(a)).toFixed(1)} ${(cy + (r + 34) * Math.sin(a)).toFixed(1)}L${(cx + (r + 34 + l) * Math.cos(a)).toFixed(1)} ${(cy + (r + 34 + l) * Math.sin(a)).toFixed(1)}`; }
      const off = (100 - frac * 100).toFixed(2);
      body = `<div class="mt-text">${sl.caption ? `<p class="kicker"${A('fade')}>${fmt(sl.caption)}</p>` : ''}${title ? `<h2${tid(title)}${A(tA('mask'), 100)}>${fmt(title)}</h2>` : ''}${sl.text ? `<p class="lead"${A('fade', 900)}>${fmt(sl.text)}</p>` : ''}</div>` +
        `<svg class="mt-svg" viewBox="0 0 1920 1080" aria-hidden="true"><path class="mt-ticks" d="${ticks}"${A('fade', 200)}/><path class="mt-track" d="${d}" pathLength="100"/><path class="mt-fill" d="${d}" pathLength="100" style="stroke-dashoffset:${off}"${A('gauge', 400, ` data-duration="1800"`)}/></svg>` +
        `<div class="mt-dot" style="offset-path:path('${d}');offset-distance:${(frac * 100).toFixed(2)}%"${A('travel', 400, ' data-from="0%" data-duration="1800"')}></div>` +
        `<p class="big mt-num" style="left:${cx}px;top:${cy}px"${A('count', 400, ' data-duration="1800"')}>${fmt(sl.number || '0')}</p>`;
      break;
    }

    case 'ridå': {
      const src = sl.image ? img(sl.image) : '';
      const n = plain(title).length;
      cls = 'lj-rida ' + (n <= 22 ? 'r-s' : n <= 58 ? 'r-m' : 'r-l');
      body = (src ? `<figure class="rd-img"${A('fade', 0, ' data-duration="900"')}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` : '') +
        `<div class="rd-veil" aria-hidden="true"></div>` +
        `<div class="rd-cur l" aria-hidden="true"${A('curtainL', 150, ' data-duration="1500"')}></div><div class="rd-cur r" aria-hidden="true"${A('curtainR', 150, ' data-duration="1500"')}></div>` +
        `<div class="rd-text">${sl.caption ? `<p class="lj-kick"${A('fade', 900)}>${fmt(sl.caption)}</p>` : ''}` +
        `<h1${title ? tid(title) : ''}${A(tA('words'), 1000)}>${fmt(title || 'Rubrik')}</h1>` +
        (sl.text ? `<p class="lead"${A(anim(ba, 'rise'), 1600)}>${fmt(sl.text)}</p>` : '') + `</div>`;
      break;
    }
    case 'strålkastare': {
      const ph = lines(sl.items).length ? lines(sl.items) : [title || 'Skriv meningen', 'i delar,', 'en per rad.'];
      const n = ph.join(' ').length;
      cls = 'lj-sp ' + (n <= 56 ? 'p-s' : n <= 110 ? 'p-m' : 'p-l') + (steps ? '' : ' nosteps');
      body = `<div class="sp-beam" aria-hidden="true"${A('beam', 0, ' data-duration="2200"')}></div>` +
        (sl.caption ? `<p class="lj-kick"${A('fade', 200)}>${fmt(sl.caption)}</p>` : '') +
        `<p class="sp-text"${steps ? '' : A('words', 300)}>${ph.map(t => `<span class="sp-p"${steps ? st('hold') : ''}>${fmt(t.trim())}</span>`).join(' ')}</p>` +
        (sl.text ? `<p class="sp-foot"${steps ? st('rise') : A('fade', 1200)}>${fmt(sl.text)}</p>` : '');
      break;
    }
    case 'fokus': {
      const its = lines(sl.items).slice(0, 7).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      cls = 'lj-fk' + (its.length > 4 || Math.max(0, ...its.map(o => plain(o.h).length)) > 16 ? ' many' : '') + (steps ? '' : ' nosteps');
      body = `<div class="fk-side">${sl.caption ? `<p class="lj-kick"${A('fade')}>${fmt(sl.caption)}</p>` : ''}${H2('', 'words')}${sl.text ? `<p class="lead"${A('fade', 500)}>${fmt(sl.text)}</p>` : ''}</div>` +
        `<ol class="fk-list"${steps ? '' : A('rise', 400, ' data-stagger="120"')}>${its.map(o => `<li class="fk-i"${steps ? st('hold') : ''}><b>${fmt(o.h)}</b>${o.t ? `<div class="fk-d"><p>${fmt(o.t)}</p></div>` : ''}</li>`).join('')}</ol>`;
      break;
    }
    case 'ordbild': {
      const src = sl.image ? img(sl.image) : '';
      const w = plain(title || 'Ord'), n = w.length;
      cls = 'lj-ob ' + (n <= 6 ? 'o-s' : n <= 10 ? 'o-m' : n <= 16 ? 'o-l' : 'o-xl');
      const bgi = src ? ` style="background-image:url('${esc(src).replace(/'/g, '%27')}')"` : '';
      body = (src ? `<div class="ob-amb"${bgi} aria-hidden="true"${A('fade', 0, ' data-duration="2000"')}></div>` : '') +
        (sl.caption ? `<p class="lj-kick"${A('fade', 200)}>${fmt(sl.caption)}</p>` : '') +
        `<h2 class="ob-word${src ? ' filled' : ''}"${bgi}${title ? tid(title) : ''}${A(tA('blur') === 'words' ? 'blur' : tA('blur'), 300, ' data-duration="1600"')}>${fmt(title || 'Ord')}</h2>` +
        (sl.text ? `<p class="lead"${A(anim(ba, 'rise'), 1100)}>${fmt(sl.text)}</p>` : '');
      break;
    }
    case 'bildfält': {
      const src = sl.image ? img(sl.image) : '';
      cls = 'lj-bf' + (sl.flip ? ' flip' : '') + (src ? '' : ' noimg');
      body = (src ? `<figure class="bf-img"${A('fade', 0, ' data-duration="1600"')}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` : '') +
        `<div class="bf-text">${sl.caption ? `<p class="lj-kick"${A('fade', 200)}>${fmt(sl.caption)}</p>` : ''}${H2('', 'words')}` +
        (sl.text ? `<p class="lead"${A('fade', 600)}>${fmt(sl.text)}</p>` : '') + list(sl.bullets, 'bf-list', anim(ba, 'rise'), 900) + `</div>`;
      break;
    }
    case 'delning': {
      const its = lines(sl.items).slice(0, 3).map(t => { const p = t.split('|'); return { h: p[0].trim(), t: p.slice(1).join('|').trim() }; });
      while (its.length < 2) its.push({ h: its.length ? 'Höger' : 'Vänster', t: '' });
      cls = 'lj-dl';
      const half = (o, s) => `<div class="dl-f ${s}"${steps ? st(s === 'b' ? 'reveal' : 'rise') : A(s === 'b' ? 'reveal' : 'rise', s === 'b' ? 900 : 500)}><h3>${fmt(o.h)}</h3>${o.t ? `<p>${fmt(o.t)}</p>` : ''}</div>`;
      const fields = `<div class="dl-fields">${half(its[0], 'a')}${half(its[1], 'b')}</div>`;
      body = `<div class="dl-head"><div>${sl.caption ? `<p class="lj-kick"${A('fade')}>${fmt(sl.caption)}</p>` : ''}${H2('', 'words')}</div>` +
        (its[2] ? `<p class="dl-ex"${steps ? st('rise') : A('fade', 1400)}>${its[2].h ? `<b>${fmt(its[2].h)}</b> ` : ''}${fmt(its[2].t)}</p>` : '') + `</div>` + fields;
      break;
    }
    case 'ljustal': {
      const raw = plain(sl.number || '0');
      let frac = -1;
      const pm = raw.match(/(-?\d+(?:[.,]\d+)?)\s*%/), av = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:av|\/|of)\s*(\d+(?:[.,]\d+)?)/i), nm = raw.match(/-?\d+(?:[.,]\d+)?/);
      if (av) frac = parseFloat(av[1].replace(',', '.')) / parseFloat(av[2].replace(',', '.'));
      else if (pm) frac = parseFloat(pm[1].replace(',', '.')) / 100;
      else if (nm && sl.max) frac = parseFloat(nm[0].replace(',', '.')) / (parseFloat(String(sl.max).replace(',', '.')) || 100);
      const nlen = raw.length;
      cls = 'lj-lt ' + (nlen <= 4 ? 'n-s' : nlen <= 7 ? 'n-m' : 'n-l');
      body = `<div class="lt-glow" aria-hidden="true"${A('beam', 200, ' data-duration="2400"')}></div>` +
        `<div class="lt-num"><p class="lt-big"${A('count', 300, ' data-duration="1800"')}>${fmt(sl.number || '0')}</p>` +
        (frac >= 0 ? `<div class="lt-bar" aria-hidden="true"><i style="width:${(Math.max(0, Math.min(1, frac)) * 100).toFixed(1)}%"${A('grow', 400, ' data-duration="1800"')}></i></div>` : '') + `</div>` +
        `<div class="lt-text">${sl.caption ? `<p class="lj-kick"${A('fade', 100)}>${fmt(sl.caption)}</p>` : ''}${title ? `<h2${tid(title)}${A(tA('words'), 200)}>${fmt(title)}</h2>` : ''}${sl.text ? `<p class="lead"${A('fade', 1100)}>${fmt(sl.text)}</p>` : ''}</div>`;
      break;
    }


    case 'lameller': {
      const src = sl.image && img(sl.image);
      body = `<div class="sig-picture">${src ? `<img src="${esc(src)}" alt="${esc(sl.alt || '')}"${A('zoom',0,' data-duration="2400"')}>` : ''}</div><div class="sig-slats"${A('slats')}>${Array.from({length:7},(_,j)=>`<i style="--j:${j}"></i>`).join('')}</div><div class="sig-cover">${sl.caption ? `<p class="sig-kicker"${A('fade',700)}>${fmt(sl.caption)}</p>` : ''}<h2${tid(title)}${A(tA('mask'),500)}>${fmt(title)}</h2>${sl.text ? `<p class="lead"${A('rise',1000)}>${fmt(sl.text)}</p>` : ''}</div>`;
      break;
    }
    case 'register': {
      body = H2('', 'mask') + `<div class="sig-register">` + lines(sl.items).slice(0,5).map((v,j)=>{const [h,...b]=v.split('|');return `<article class="sig-panel"${steps ? st('hold') : ' data-open="true"'}><span class="sig-index">0${j+1}</span><h3>${fmt(h)}</h3><p>${fmt(b.join('|'))}</p><span class="sig-tick" aria-hidden="true">↗</span></article>`;}).join('') + `</div>`;
      break;
    }
    case 'samband': {
      body = H2('', 'mask') + `<div class="sig-network"><div class="sig-premises">` + lines(sl.items).slice(0,4).map((v,j)=>{const [h,...b]=v.split('|');return `<article${steps ? st('trace') : A('trace',j*180)}><span class="sig-index">0${j+1}</span><h3>${fmt(h)}</h3><p>${fmt(b.join('|'))}</p><svg viewBox="0 0 500 160" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 80 C250 80 250 ${80+(1-j)*30} 500 ${80+(1-j)*30}"/></svg></article>`;}).join('') + `</div><div class="sig-result"${steps ? st('mask') : A('mask',900)}><span class="sig-kicker">${fmt(sl.caption || 'Sambandet')}</span><p>${fmt(sl.text || '')}</p></div></div>`;
      break;
    }
    case 'marginal': {
      const src=sl.image && img(sl.image), items=lines(sl.items).slice(0,3);
      body=H2('', 'mask')+`<div class="sig-editorial"><figure>${src ? `<img src="${esc(src)}" alt="${esc(sl.alt || '')}">` : '<div class="sig-placeholder">Lägg till en bild</div>'}</figure><div class="sig-notes">`+items.map((v,j)=>{const [h,...b]=v.split('|');return `<article${steps ? st('trace') : A('trace',j*250)}><svg viewBox="0 0 200 20" aria-hidden="true"><path pathLength="1" d="M0 10 H200"/><circle cx="5" cy="10" r="5"/></svg><span class="sig-index">0${j+1}</span><h3>${fmt(h)}</h3><p>${fmt(b.join('|'))}</p></article>`;}).join('')+'</div></div>';
      break;
    }
    case 'sats': {
      body=H2('', 'mask')+`<div class="sig-equation">`+lines(sl.items).slice(0,3).map((v,j)=>{const [h,...b]=v.split('|');return `<article${steps ? st('focusline') : A('focusline',j*220)}><span class="sig-index">${String(j+1).padStart(2,'0')}</span><div class="sig-term">${fmt(h)}</div><p>${fmt(b.join('|'))}</p></article>`;}).join('')+`</div><div class="sig-conclusion"${steps ? st('mask') : A('mask',1000)}>${fmt(sl.text || '')}</div>`;
      break;
    }


    case 'etapper': case 'vagval': case 'lager': case 'resonemang': case 'helhet': {
      cls = 'ed-layout';
      const max = L === 'lager' || L === 'resonemang' ? 3 : 4;
      const items=lines(sl.items).slice(0,max).map(v=>v.split('|').map(x=>x.trim()));
      const reveal=()=>steps ? st('rise') : A('rise',200+k++*150);
      const num=j=>`<small class="ed-num">${String(j+1).padStart(2,'0')}</small>`;
      const content=(p,j)=>num(j)+`<h3>${fmt(p[0]||'')}</h3><p>${fmt(p.slice(1).join(' | '))}</p>`;
      body=`<header class="ed-header">${sl.caption ? `<p class="ed-caption"${A('fade')}>${fmt(sl.caption)}</p>` : ''}${H2('','mask')}</header>`;
      if(L==='vagval') body+=`<div class="ed-comparison"><div class="ed-colheads"><span></span><h3>${fmt(sl.lt||'Alternativ A')}</h3><h3>${fmt(sl.rt||'Alternativ B')}</h3></div>`+items.map((p,j)=>`<article class="ed-row"${reveal()}><h3>${fmt(p[0])}</h3><p>${fmt(p[1]||'')}</p><p>${fmt(p.slice(2).join(' | '))}</p></article>`).join('')+'</div>';
      else if(L==='resonemang') body+=`<div class="ed-reason"><div class="ed-premises">`+items.map((p,j)=>`<article${reveal()}>${content(p,j)}</article>`).join('')+`</div><aside class="ed-landing"${steps ? st('mask') : A('mask',900)}><small class="ed-num">Slutsats</small><h3>${fmt(sl.text||'')}</h3></aside></div>`;
      else body+=`<div class="ed-${L}" style="--ed-count:${items.length}">`+items.map((p,j)=>`<article style="--ed-i:${j}"${reveal()}>${content(p,j)}</article>`).join('')+'</div>';
      break;
    }

    case 'skiften': {
      const its = lines(sl.items).slice(0, 6).map(t => {
        const p = t.split('|');
        return { when: (p[0] || '').trim(), event: (p[1] || '').trim(), change: p.slice(2).join('|').trim() };
      });
      const n = Math.max(1, its.length), uid = 'u' + hash((sl.id || '') + i + L);
      let css = '';
      const points = its.map((o, j) => {
        const x = n === 1 ? 50 : 16 + j * 68 / (n - 1);
        const progress = n === 1 ? 100 : j * 100 / (n - 1);
        css += `.${uid}:has(.sk-point.k${j}.in) .sk-fill{width:${progress.toFixed(2)}%}.${uid}:has(.sk-point.k${j}.step-current) .sk-dot.k${j}{transform:translate(-50%,-50%) scale(1.45);background:var(--accent);box-shadow:0 0 0 10px var(--hl)}`;
        return `<article class="sk-point k${j}" data-pos="${j % 2 ? 'lower' : 'upper'}" style="left:${x}%"${steps ? st(stepA('fade')) : A(stepA('fade'), 350 + j * 140)}><i class="sk-dot k${j}" aria-hidden="true"></i><p class="sk-when">${fmt(o.when || String(j + 1))}</p><h3>${fmt(o.event || 'Brytpunkt')}</h3><p class="sk-change">${fmt(o.change || 'Beskriv vad som förändras efter brytpunkten.')}</p></article>`;
      }).join('');
      if (!steps) css += `.${uid} .sk-fill{width:100%}`;
      body = `<style>${css}</style><header class="fn-head">${sl.caption ? `<p class="kicker"${A(stepA('fade'))}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}</header>` +
        `<div class="sk-stage ${uid}"><div class="sk-axis" aria-hidden="true"><i class="sk-fill"></i></div><p class="sk-end sk-start">${fmt(sl.start || 'Start')}</p><p class="sk-end sk-finish">${fmt(sl.end || 'Slut')}</p>${points}</div>` +
        (sl.conclusion || sl.text ? `<p class="timeline-summary"${steps ? st(stepA('mask')) : A(stepA('mask'), 1300)}>${fmt(sl.conclusion || sl.text)}</p>` : '');
      cls = 'fn-layout ' + uid;
      break;
    }

    case 'prisma': {
      const its = lines(sl.items).slice(0, 5).map(t => { const p = t.split('|'); return { name: (p[0] || '').trim(), emphasis: (p[1] || '').trim(), basis: p.slice(2).join('|').trim() }; });
      const pos = [[50,10],[87,28],[79,69],[21,69],[13,28]];
      const uid = 'u' + hash((sl.id || '') + i + L);
      let css = '';
      /* Strålen går från kärnans kant till etikettens kant, inte genom texten.
         Etiketternas höjd uppskattas från textlängden; scenen är cirka 1452 × 570 px. */
      const W = 1452, H = 570, gap = 18;
      const lineCount = (text, px, width) => Math.max(1, Math.ceil(plain(text).length * px * .55 / width));
      const qLines = lineCount(sl.question || 'Vad betraktar perspektiven?', 34, 378);
      const coreX = 235 + gap, coreY = Math.max(95, (68 + qLines * 41) / 2) + gap;
      const rays = its.map((o, j) => {
        const [x, y] = pos[j];
        css += `.${uid}:has(.pr-node.k${j}.step-current) .pr-ray.k${j}{opacity:1;stroke:var(--accent);stroke-width:4}.${uid}:has(.pr-node.k${j}.step-current) .pr-core{box-shadow:0 0 0 14px var(--hl)}`;
        const boxW = its.length === 5 && j === 0 ? 440 : 330;
        const nodeH = 30 + lineCount(o.emphasis, 29, boxW) * 34 + (o.basis ? 8 + lineCount(o.basis, 21, boxW) * 29 : 0);
        const dx = (x - 50) * W / 100, dy = (y - 50) * H / 100;
        const toEdge = Math.min(dx ? (boxW / 2 + gap) / Math.abs(dx) : Infinity, dy ? (nodeH / 2 + gap) / Math.abs(dy) : Infinity);
        const fromCore = 1 / Math.hypot(dx / coreX, dy / coreY), toNode = 1 - toEdge;
        if (!(toNode > fromCore)) return '';
        const P = f => `x${f[0]}="${(50 + dx * f[1] / W * 100).toFixed(2)}" y${f[0]}="${(50 + dy * f[1] / H * 100).toFixed(2)}"`;
        return `<line class="pr-ray k${j}" ${P([1, fromCore])} ${P([2, toNode])}/>`;
      }).join('');
      const nodes = its.map((o, j) => { const [x, y] = pos[j]; return `<article class="pr-node k${j}" style="left:${x}%;top:${y}%"${steps ? st(stepA('fade')) : A(stepA('fade'), 350 + j * 160)}><p class="pr-name">${fmt(o.name || `Perspektiv ${j + 1}`)}</p><h3>${fmt(o.emphasis)}</h3>${o.basis ? `<p>${fmt(o.basis)}</p>` : ''}</article>`; }).join('');
      body = `<style>${css}</style><header class="fn-head">${sl.caption ? `<p class="kicker"${A(stepA('fade'))}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}</header>` +
        `<div class="pr-stage pr-count-${its.length} ${uid}"><svg class="pr-rays" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${rays}</svg><div class="pr-core"><small>Gemensam fråga</small><p>${fmt(sl.question || 'Vad betraktar perspektiven?')}</p></div>${nodes}</div>` +
        `<div class="pr-outcomes">${sl.common ? `<p class="pr-common"${steps ? st(stepA('fade')) : A(stepA('fade'), 1250)}><b>Gemensamt</b>${fmt(sl.common)}</p>` : ''}${sl.tension ? `<p class="pr-tension"${steps ? st(stepA('fade')) : A(stepA('fade'), 1450)}><b>Spänning</b>${fmt(sl.tension)}</p>` : ''}</div>`;
      cls = 'fn-layout ' + uid;
      break;
    }

    case 'verkningar': {
      const its = lines(sl.items).slice(0, 3).map(t => { const p = t.split('|'); return { mechanism: (p[0] || '').trim(), change: p.slice(1).join('|').trim() }; });
      const n = Math.max(1, its.length), uid = 'u' + hash((sl.id || '') + i + L);
      let css = '';
      const mechanisms = its.map((o, j) => {
        const x = 29 + j * 42 / Math.max(1, n - 1), progress = (j + 1) / (n + 1) * 100;
        css += `.${uid}:has(.vk-mech.k${j}.in) .vk-flow{width:${progress.toFixed(2)}%}.${uid}:has(.vk-mech.k${j}.step-current) .vk-node.k${j}{background:var(--accent);transform:translate(-50%,-50%) scale(1.35);box-shadow:0 0 0 9px var(--hl)}`;
        return `<article class="vk-mech k${j}" style="left:${x}%"${steps ? st(stepA('fade')) : A(stepA('fade'), 450 + j * 180)}><i class="vk-node k${j}" aria-hidden="true"></i><h3>${fmt(o.mechanism || `Mekanism ${j + 1}`)}</h3><p>${fmt(o.change)}</p></article>`;
      }).join('');
      css += `.${uid}:has(.vk-effect.in) .vk-flow{width:100%}`;
      if (!steps) css += `.${uid} .vk-flow{width:100%}`;
      body = `<style>${css}</style><header class="fn-head">${sl.caption ? `<p class="kicker"${A(stepA('fade'))}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}</header>` +
        `<div class="vk-stage ${uid}"><div class="vk-line" aria-hidden="true"><i class="vk-flow"></i></div><article class="vk-cause"><small>Orsak</small><h3>${fmt(sl.cause || 'Utgångspunkt')}</h3></article>${mechanisms}<article class="vk-effect"${steps ? st(stepA('mask')) : A(stepA('mask'), 1200)}><small>Konsekvens</small><h3>${fmt(sl.effect || 'Resultat')}</h3></article></div>` +
        `<div class="vk-guards">${sl.condition ? `<p class="vk-condition"${steps ? st(stepA('fade')) : A(stepA('fade'), 1450)}><b>Villkor</b>${fmt(sl.condition)}</p>` : ''}${sl.alternative ? `<p class="vk-alternative"${steps ? st(stepA('fade')) : A(stepA('fade'), 1650)}><b>Alternativ förklaring</b>${fmt(sl.alternative)}</p>` : ''}</div>`;
      cls = 'fn-layout ' + uid;
      break;
    }

    case 'belagg': {
      const its = lines(sl.items).slice(0, 3).map(t => { const p = t.split('|'); return { excerpt: (p[0] || '').trim(), observation: (p[1] || '').trim(), interpretation: p.slice(2).join('|').trim() }; });
      const source = String(sl.text || '');
      const ranges = [];
      its.forEach((o, j) => {
        if (!o.excerpt) return;
        let at = source.indexOf(o.excerpt);
        while (at >= 0 && ranges.some(r => at < r.end && at + o.excerpt.length > r.start)) at = source.indexOf(o.excerpt, at + 1);
        if (at >= 0) ranges.push({ start: at, end: at + o.excerpt.length, j });
      });
      ranges.sort((a, b) => a.start - b.start);
      let cursor = 0, marked = '';
      ranges.forEach(r => { marked += fmt(source.slice(cursor, r.start)) + `<mark class="bl-mark k${r.j}">${fmt(source.slice(r.start, r.end))}</mark>`; cursor = r.end; });
      marked += fmt(source.slice(cursor));
      const uid = 'u' + hash((sl.id || '') + i + L);
      let css = '';
      its.forEach((o, j) => { css += `.${uid}:has(.bl-ob.k${j}.in) .bl-mark.k${j},.${uid}:has(.bl-int.k${j}.in) .bl-mark.k${j}{background-size:100% 42%;color:var(--ink)}.${uid}:has(.bl-int.k${j}.step-current) .bl-link.k${j}{opacity:1;transform:scaleX(1)}`; });
      const analyses = its.map((o, j) => `<section class="bl-analysis k${j}"><p class="bl-ob k${j}"${steps ? st(stepA('fade')) : A(stepA('fade'), 550 + j * 260)}><b>Iakttagelse</b>${fmt(o.observation)}</p><i class="bl-link k${j}" aria-hidden="true"></i><p class="bl-int k${j}"${steps ? st(stepA('fade')) : A(stepA('fade'), 720 + j * 260)}><b>Tolkning</b>${fmt(o.interpretation)}</p></section>`).join('');
      body = `<style>${css}</style><header class="fn-head">${sl.title ? H2('', 'mask') : ''}${sl.source ? `<p class="bl-source"${A(stepA('fade'), 200)}>${fmt(sl.source)}</p>` : ''}</header>` +
        `<div class="bl-stage ${uid}"><blockquote class="bl-text">${marked || 'Lägg till ett källutdrag.'}</blockquote><aside class="bl-notes">${analyses}</aside></div>` +
        `<div class="bl-outcomes">${sl.whole ? `<p class="bl-whole"${steps ? st(stepA('mask')) : A(stepA('mask'), 1450)}><b>Helhet</b>${fmt(sl.whole)}</p>` : ''}${sl.reservation ? `<p class="bl-reservation"${steps ? st(stepA('fade')) : A(stepA('fade'), 1650)}><b>Reservation</b>${fmt(sl.reservation)}</p>` : ''}</div>`;
      cls = 'fn-layout ' + uid;
      break;
    }

    case 'sammanflode': {
      const its = lines(sl.items).slice(0, 5).map(t => { const p = t.split('|'); return { contribution: (p[0] || '').trim(), adds: p.slice(1).join('|').trim() }; });
      const starts = [[5,14],[5,50],[5,86],[95,24],[95,70]], uid = 'u' + hash((sl.id || '') + i + L);
      let css = '';
      const streams = its.map((o, j) => { const [x, y] = starts[j]; const side = x < 50 ? 'left' : 'right'; css += `.${uid}:has(.sf-input.k${j}.step-current) .sf-stream.k${j}{opacity:1;stroke:var(--accent);stroke-width:5}`; return `<path class="sf-stream k${j}" d="M${x} ${y} C${side === 'left' ? 28 : 72} ${y},${side === 'left' ? 36 : 64} 48,50 52"/>`; }).join('');
      const inputs = its.map((o, j) => { const [x, y] = starts[j]; return `<article class="sf-input k${j} ${x < 50 ? 'left' : 'right'}" style="left:${x}%;top:${y}%"${steps ? st(stepA('fade')) : A(stepA('fade'), 350 + j * 170)}><h3>${fmt(o.contribution || `Bidrag ${j + 1}`)}</h3><p>${fmt(o.adds)}</p></article>`; }).join('');
      body = `<style>${css}</style><header class="fn-head">${sl.caption ? `<p class="kicker"${A(stepA('fade'))}>${fmt(sl.caption)}</p>` : ''}${H2('', 'mask')}</header>` +
        `<div class="sf-stage ${uid}"><svg class="sf-streams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${streams}<path class="sf-out" d="M50 52 C50 70,60 80,72 96"/></svg>${inputs}<p class="sf-common"${steps ? st(stepA('fade')) : A(stepA('fade'), 1250)}><b>Gemensamt</b>${fmt(sl.common || 'Formulera den gemensamma grunden.')}</p></div>` +
        `<p class="sf-tension"${steps ? st(stepA('fade')) : A(stepA('fade'), 1450)}><b>Spänning</b>${fmt(sl.tension || 'Formulera det som fortfarande drar åt olika håll.')}</p>` +
        `<p class="sf-synthesis"${steps ? st(stepA('mask')) : A(stepA('mask'), 1700)}><b>Syntes</b>${fmt(sl.synthesis || 'Formulera den nya slutsats som bidragen tillsammans möjliggör.')}</p>`;
      cls = 'fn-layout ' + uid;
      break;
    }

    case 'egen': {
      const T = (deck && deck.templates || {})[sl.tpl];
      const tplId = String(sl.tpl || '').replace(/[^a-z0-9_-]/gi, '');
      if (!T) { body = `<h2>${fmt(title || 'Egen mall')}</h2><p class="lead">Mallen finns inte i den här presentationen.</p>`; break; }
      const its = lines(sl.items && lines(sl.items).length ? sl.items : sl.bullets);
      const item = t => { const p = t.split('|'); return p.length > 1 ? `<b>${fmt(p[0].trim())}</b><span>${fmt(p.slice(1).join('|').trim())}</span>` : `<span>${fmt(t)}</span>`; };
      const slot = {
        rubrik: fmt(title), text: fmt(sl.text || ''), etikett: fmt(sl.caption || ''), svar: fmt(sl.answer || ''),
        bild: esc(sl.image ? img(sl.image) : ''),
        punkter: its.map(t => `<li${steps ? st(bodyA === 'none' ? 'fade' : bodyA) : ''}>${item(t)}</li>`).join('')
      };
      const html = cleanHtml(T.html || '').replace(/\{\{\s*([a-zåäö]+)\s*\}\}/gi, (m, key) => slot[key.toLowerCase()] != null ? slot[key.toLowerCase()] : '');
      body = `<style>[data-tpl="${tplId}"]{${cleanCss(T.css || '')}}</style>` + html;
      cls = 'tpl'; attrs = ` data-tpl="${tplId}"`;
      break;
    }
    case 'quote':
      body = `<blockquote${A(anim(ta, 'blur'))}>${fmt(sl.text || title)}</blockquote>` +
        (sl.caption ? `<p class="by"${A('fade', 900)}>${fmt(sl.caption)}</p>` : '');
      break;
  }
  if (sl.image && ['title', 'section', 'statement', 'quote', 'number'].includes(L)) {
    const src = img(sl.image);
    if (src) { cls += ' withimg'; body += `<figure class="bleed"${A('fade', 0, ' data-duration="1400"')}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>`; }
  } else if (sl.image && (['bullets', 'compare', 'table', 'triad'].includes(L) || ((L === 'cards' || L === 'motsats') && sl.banner))) {
    const src = img(sl.image);
    if (src) { cls += ' hasbanner'; body = `<figure class="banner"${A('fade', 0, ' data-duration="1200"')}><img src="${esc(src)}" alt="${esc(sl.alt || '')}" data-id="i-${hash(sl.image)}"></figure>` + body; }
  }
  if (Array.isArray(sl.layers) && sl.layers.length) {
    const col = c => ({ text: 'var(--ink)', dampad: 'var(--muted)', accent: 'var(--accent)', accent2: 'var(--accent-2)', bakgrund: 'var(--bg)', yta: 'var(--surface)', vit: '#fff', svart: '#000' }[c] || 'var(--ink)');
    const fill = f => ({ yta: 'var(--surface)', accent: 'var(--accent)', markering: 'var(--hl)', bakgrund: 'var(--bg)' }[f] || '');
    body += '<div class="lyrs">' + sl.layers.map(l => {
      const x = Math.round(+l.x || 0), y = Math.round(+l.y || 0), w = Math.max(10, Math.round(+l.w || 400)), h = Math.max(10, Math.round(+l.h || 100));
      const an = l.anim && BODY_ANIMS[l.anim] && l.anim !== 'auto' ? l.anim : 'fade';
      const at = l.step ? st(an === 'none' ? 'fade' : an) : (an === 'none' ? '' : A(an, 250));
      let inner = '';
      const t = l.type || 'text';
      if (t === 'text') {
        const f = fill(l.fill);
        const st2 = `font-size:${+l.size || 40}px;color:${col(l.color)};text-align:${{ center: 'center', höger: 'right', right: 'right' }[l.align] || 'left'};` +
          (l.bold ? 'font-weight:700;' : '') + (l.font === 'rubrik' ? 'font-family:var(--font-display,var(--font));font-style:var(--h-style,normal);letter-spacing:var(--h-track,-.02em);font-weight:' + (l.bold ? 800 : 'var(--h-weight,650)') + ';line-height:1.05;' : '') +
          (f ? `background:${f};padding:.35em .55em;border-radius:var(--radius,14px);` : '');
        inner = `<div class="lyr-t" style="${st2}">${fmt(l.text || '')}</div>`;
      } else if (t === 'bild') {
        const src = l.src ? img(l.src) : '';
        inner = src ? `<img src="${esc(src)}" alt="${esc(l.alt || '')}" style="object-fit:${l.fit === 'hela' ? 'contain' : 'cover'}">` : '<div class="ph">Ingen bild</div>';
      } else if (t === 'pil') {
        const sw = +l.stroke || 8;
        inner = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><line x1="${sw}" y1="${h / 2}" x2="${Math.max(sw, w - sw * 3.2)}" y2="${h / 2}" stroke="${col(l.color || 'accent')}" stroke-width="${sw}" stroke-linecap="round"/><path d="M${w - sw * 4.2} ${h / 2 - sw * 2.4} L${w - sw * 0.6} ${h / 2} L${w - sw * 4.2} ${h / 2 + sw * 2.4}" fill="none" stroke="${col(l.color || 'accent')}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      } else if (t === 'markering') {
        inner = `<div class="sh" style="background:${fill(l.fill) || 'var(--hl)'}"></div>`;
      } else {
        const f = fill(l.fill);
        inner = `<div class="sh${t === 'cirkel' ? ' round' : ''}" style="border-color:${col(l.color || 'accent')};border-width:${+l.stroke || 6}px;${f ? 'background:' + f + ';' : ''}"></div>`;
      }
      return `<div class="lyr lyr-${esc(t)}" data-lid="${esc(l.id || '')}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"${at}><div class="lyr-in"${+l.rot ? ` style="transform:rotate(${+l.rot}deg)"` : ''}>${inner}</div></div>`;
    }).join('') + '</div>';
  }
  const tr = sl.transition || 'auto';
  const bg = sl.bg || (deck && deck.bg) || 'none';
  const palette=ACCENTS[sl.accent];
  const paint=palette ? ` style="--slide-accent-light:${palette[0]};--slide-accent-dark:${palette[1]}" data-slide-accent="true"` : '';
  if (cls.includes('fn-layout') && plain(title).length > 64) cls += ' fn-long';
  return `<section class="slide ${cls}" data-layout="${L}" data-transition="${tr}" data-bg="${bg}" data-i="${i}"${dim ? ` data-focus="${focus}"` : ''}${ba === 'none' ? ' data-body-motion="none"' : ''}${paint}${attrs}>${body}</section>`;
}

/* ---------- egna mallar: rensa HTML och CSS ---------- */
function cleanHtml(html) {
  if (typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString('<div id="r">' + String(html) + '</div>', 'text/html');
  const root = doc.getElementById('r');
  if (!root) return '';
  root.querySelectorAll('script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,select,frame,frameset,audio,video,source').forEach(n => n.remove());
  root.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(a => {
      const n = a.name.toLowerCase(), v = a.value.trim().toLowerCase();
      if (n.startsWith('on') || n === 'srcset' || n === 'formaction') el.removeAttribute(a.name);
      else if ((n === 'href' || n === 'src' || n === 'xlink:href') && !(v.startsWith('{{') || v.startsWith('data:image/') || v.startsWith('#') || v === '')) el.removeAttribute(a.name);
    });
  });
  return root.innerHTML;
}
function cleanCss(css) {
  return String(css).replace(/<\/?style[^>]*>/gi, '').replace(/@import[^;]*;?/gi, '').replace(/url\(\s*(['"]?)(?!data:)[^)]*\)/gi, 'none').replace(/expression\s*\(/gi, '(').replace(/<\//g, '');
}

/* ---------- animationer ---------- */
const ANIMS = {
  fade: { k: [{ opacity: 0 }, { opacity: 1 }], d: 700 },
  rise: { k: [{ opacity: 0, transform: 'translateY(44px)' }, { opacity: 1, transform: 'none' }], d: 850 },
  drop: { k: [{ opacity: 0, transform: 'translateY(-44px)' }, { opacity: 1, transform: 'none' }], d: 850 },
  left: { k: [{ opacity: 0, transform: 'translateX(-70px)' }, { opacity: 1, transform: 'none' }], d: 850 },
  right: { k: [{ opacity: 0, transform: 'translateX(70px)' }, { opacity: 1, transform: 'none' }], d: 850 },
  zoom: { k: [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], d: 900 },
  pop: { k: [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.05)', offset: .7 }, { opacity: 1, transform: 'none' }], d: 650 },
  blur: { k: [{ opacity: 0, filter: 'blur(26px)' }, { opacity: 1, filter: 'blur(0px)' }], d: 1100 },
  wipe: { k: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], d: 950 },
  mask: { k: [{ clipPath: 'inset(0 0 100% 0)', transform: 'translateY(.5em)', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', transform: 'none', opacity: 1, offset: .999 }, { clipPath: 'none', transform: 'none', opacity: 1 }], d: 1100 },
  reveal: { k: [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }], d: 1400 },
  grow: { k: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], d: 1000 },
  corner: { k: [{ opacity: 0, transform: 'translate(90px,-90px) scale(1.04)' }, { opacity: 1, transform: 'none' }], d: 1200 },
  hold: { k: [{ opacity: 1 }, { opacity: 1 }], d: 20 },
  curtainL: { k: [{ transform: 'translateX(0)', opacity: 1 }, { opacity: 1, offset: .8 }, { transform: 'translateX(-101%)', opacity: 0 }], d: 1500 },
  curtainR: { k: [{ transform: 'translateX(0)', opacity: 1 }, { opacity: 1, offset: .8 }, { transform: 'translateX(101%)', opacity: 0 }], d: 1500 },
  beam: { k: [{ opacity: 0, transform: 'scale(.82)' }, { opacity: 1, transform: 'none' }], d: 2200 },
  cornerb: { k: [{ opacity: 0, transform: 'translate(-90px,90px) scale(1.04)' }, { opacity: 1, transform: 'none' }], d: 1200 }
};
function splitWords(el) {
  if (el._split) return el._split;
  const out = [];
  const walk = (n) => {
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const parts = c.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); out.push(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') {
        if (c.tagName === 'MARK' || c.tagName === 'SUP' || c.tagName === 'SUB') { c.classList.add('w'); out.push(c); }
        else walk(c);
      }
    });
  };
  walk(el);
  el._split = out;
  return out;
}
function countUp(el, delay, dur) {
  if (el._orig == null) el._orig = el.innerHTML;
  const txt = el.textContent;
  const m = txt.match(/-?\d[\d\s ]*(?:[.,]\d+)?/);
  if (!m) return playNamed(el, 'rise', delay, dur);
  const raw = m[0].replace(/[\s\u00a0]+$/, '');
  const sep = raw.includes(',') ? ',' : '.';
  const dec = (raw.split(/[.,]/)[1] || '').length;
  const target = parseFloat(raw.replace(/[\s ]/g, '').replace(',', '.'));
  const group = /\d[\s ]\d/.test(raw);
  const pre = txt.slice(0, m.index), post = txt.slice(m.index + raw.length);
  const f = (v) => {
    let s = v.toFixed(dec);
    let [a, b] = s.split('.');
    if (group) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return pre + a + (b ? sep + b : '') + post;
  };
  const D = dur || 1600, t0 = performance.now() + (delay || 0);
  el.textContent = f(0);
  const a = el.animate(ANIMS.fade.k, { duration: 300, delay: delay || 0, fill: 'backwards' });
  let raf;
  const tick = (now) => {
    const p = Math.min(1, Math.max(0, (now - t0) / D));
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = f(target * e);
    if (p < 1) raf = requestAnimationFrame(tick); else el.innerHTML = el._orig;
  };
  raf = requestAnimationFrame(tick);
  return { cancel() { cancelAnimationFrame(raf); a.cancel(); el.innerHTML = el._orig; }, finish() { cancelAnimationFrame(raf); a.finish(); el.innerHTML = el._orig; } };
}
function typeOut(el, delay) {
  if (el._orig == null) el._orig = el.innerHTML;
  const txt = el.textContent;
  el.textContent = ''; el.classList.add('typing');
  let i = 0, to, iv;
  const done = () => { clearInterval(iv); clearTimeout(to); el.innerHTML = el._orig; el.classList.remove('typing'); };
  to = setTimeout(() => {
    iv = setInterval(() => { i++; el.textContent = txt.slice(0, i); if (i >= txt.length) { clearInterval(iv); setTimeout(done, 500); } }, Math.max(18, Math.min(55, 1400 / txt.length)));
  }, delay || 0);
  return { cancel: done, finish: done };
}
function playNamed(el, name, delay, dur) {
  if (name === 'none') return { cancel() {}, finish() {} };
  if (name === 'slats' || name === 'trace' || name === 'focusline') {
    const animations=[];
    if(name === 'slats') el.querySelectorAll('i').forEach((p,j)=>animations.push(p.animate([{transform:'translateY(0)'},{transform:`translateY(${j%2 ? '-' : ''}102%)`}],{duration:1400,delay:(delay||0)+j*65,easing:EASE,fill:'backwards'})));
    else {
      animations.push(el.animate([{opacity:0,transform:'translateY(18px)',filter:'blur(5px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:850,delay:delay||0,easing:EASE,fill:'backwards'}));
      el.querySelectorAll('path').forEach(p=>animations.push(p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1200,delay:(delay||0)+160,easing:EASE,fill:'backwards'})));
    }
    return {cancel(){animations.forEach(a=>a.cancel());},finish(){animations.forEach(a=>a.finish());}};
  }
  if (name === 'words') {
    const ws = splitWords(el);
    const list = ws.map((w, j) => w.animate([{ opacity: 0, transform: 'translateY(.35em)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: dur || 750, delay: (delay || 0) + j * 70, easing: EASE, fill: 'backwards' }));
    return { cancel() { list.forEach(a => a.cancel()); }, finish() { list.forEach(a => a.finish()); } };
  }
  if (name === 'count') return countUp(el, delay, dur);
  if (name === 'draw') return el.animate([{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: dur || 1600, delay: delay || 0, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
  if (name === 'gauge') { const to = getComputedStyle(el).strokeDashoffset || '0'; return el.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: parseFloat(to) }], { duration: dur || 1800, delay: delay || 0, easing: 'cubic-bezier(.3,.9,.3,1)', fill: 'backwards' }); }
  if (name === 'travel') { const to = el.style.offsetDistance || getComputedStyle(el).offsetDistance || '100%'; return el.animate([{ offsetDistance: el.dataset.from || '0%', opacity: 0 }, { opacity: 1, offset: .12 }, { offsetDistance: to, opacity: 1 }], { duration: dur || 2000, delay: delay || 0, easing: 'cubic-bezier(.3,.9,.3,1)', fill: 'backwards' }); }
  if (name === 'orbit') {
    const pts = String(el.dataset.path || '').split(' ').filter(Boolean).map(p => p.split(',').map(Number));
    if (!pts.length) return playNamed(el, 'fade', delay, dur);
    const fr = pts.map(([x, y], q) => ({ transform: `translate(${x}px,${y}px)`, opacity: q === 0 ? 0 : 1 }));
    return el.animate(fr, { duration: dur || 1300, delay: delay || 0, easing: 'cubic-bezier(.25,.8,.3,1)', fill: 'backwards' });
  }
  if (name === 'glide') {
    const from = parseFloat(el.dataset.from || 40), to = parseFloat(el.getAttribute('startOffset')) || 0, D = dur || 2400, t0 = performance.now() + (delay || 0);
    let raf; el.setAttribute('startOffset', from + '%');
    const tick = now => { const p = Math.min(1, Math.max(0, (now - t0) / D)), e = 1 - Math.pow(1 - p, 3); el.setAttribute('startOffset', (from + (to - from) * e) + '%'); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const end = () => { cancelAnimationFrame(raf); el.setAttribute('startOffset', to + '%'); };
    return { cancel: end, finish: end };
  }
  if (name === 'type') return typeOut(el, delay);
  const p = ANIMS[name] || ANIMS.fade;
  return el.animate(p.k, { duration: dur || p.d, delay: delay || 0, easing: EASE, fill: 'backwards' });
}
function playEl(el, base) {
  const name = el.dataset.anim;
  const delay = (+el.dataset.delay || 0) + (base || 0);
  const dur = +el.dataset.duration || 0;
  if (el.dataset.stagger) {
    const gap = +el.dataset.stagger;
    return [...el.children].map((c, j) => playNamed(c, name, delay + j * gap, dur));
  }
  return [playNamed(el, name, delay, dur)];
}

/* ---------- bakgrunder ---------- */
function rgbaOf(c, a) {
  c = String(c || '').trim();
  let m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
  m = c.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean); return `rgba(${p[0]},${p[1]},${p[2]},${a})`; }
  return `rgba(255,255,255,${a * .5})`;
}
function mixOf(a, b, t) {
  const n = c => (rgbaOf(c, 1).match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
  const A = n(a), B = n(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}
let grainCanvas = null;
function grainTile() {
  if (grainCanvas) return grainCanvas;
  const s = 128, cv = document.createElement('canvas'); cv.width = cv.height = s;
  const x = cv.getContext('2d'), img = x.createImageData(s, s);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255 | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0);
  return (grainCanvas = cv);
}
const BG = {
  /* Fokusljus: ett mjukt ljus som följer scenens fokus. Stilla när fokus står still.
     st.goal sätts av player via Backdrop.focus(). Returnerar true medan ljuset rör sig. */
  fokusljus(ctx, w, h, t, c, d, st) {
    const goal = st.goal || { x: .5, y: .42, f: 0 };
    if (!st.p || st.snap) st.p = { x: goal.x, y: goal.y, f: goal.f };
    st.snap = false;
    const dt = Math.min(64, Math.max(0, t - (st.last || t))); st.last = t;
    const k = 1 - Math.exp(-dt / 380), p = st.p;
    p.x += (goal.x - p.x) * k; p.y += (goal.y - p.y) * k; p.f += (goal.f - p.f) * k;
    const M = Math.max(w, h), light = c.lum > .5, A = c.alpha * (light ? .6 : 1);
    const X = p.x * w, Y = p.y * h, f = p.f;
    // ljuset är accenten blandad mot textfärgen: ett kyligt scenljus snarare än en färgad fläck
    const key = mixOf(c.accent, c.ink, light ? .2 : .42);
    // huvudljuset: brett och tillplattat vid helheten, samlat och något starkare vid fokus
    const R = M * (.78 - .34 * f), a = (light ? .1 + .1 * f : .085 + .085 * f) * A, flat = .62;
    ctx.save(); ctx.translate(X, Y); ctx.scale(1, flat);
    let g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    g.addColorStop(0, rgbaOf(key, a)); g.addColorStop(.42, rgbaOf(key, a * .4)); g.addColorStop(1, rgbaOf(key, 0));
    ctx.fillStyle = g; ctx.fillRect(-X, -Y / flat, w, h / flat);
    ctx.restore();
    // vinjett hela tiden, lite djupare vid fokus så att omgivningen sjunker undan men syns
    g = ctx.createRadialGradient(w / 2, h * .46, M * .3, w / 2, h * .46, M * .8);
    g.addColorStop(0, light ? rgbaOf(c.ink, 0) : 'rgba(0,0,0,0)');
    g.addColorStop(1, light ? rgbaOf(c.ink, (.04 + .03 * f) * c.alpha) : `rgba(0,0,0,${(.3 + .12 * f) * c.alpha})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // fint korn mot trappsteg i mörka gradienter på projektorer; slumpas en gång och står still
    ctx.globalAlpha = (light ? .025 : .045) * c.alpha;
    ctx.fillStyle = ctx.createPattern(grainTile(), 'repeat');
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    return Math.abs(goal.x - p.x) + Math.abs(goal.y - p.y) + Math.abs(goal.f - p.f) > .0008;
  },
  ljus(ctx, w, h, t, c, d) {
    const M = Math.max(w, h);
    [[.16, .2, .62, c.accent, .22, 0], [.88, .86, .66, c.accent2, .17, 2.1], [.62, .06, .38, c.accent, .1, 4.2], [.3, .95, .45, c.accent2, .08, 5.3]].forEach(([x, y, r, col, a, ph]) => {
      const X = (x + Math.sin(t * .00006 + ph) * .07) * w, Y = (y + Math.cos(t * .00005 + ph * 1.3) * .08) * h, R = r * M * (1 + Math.sin(t * .00009 + ph) * .06);
      const g = ctx.createRadialGradient(X, Y, 0, X, Y, R);
      g.addColorStop(0, rgbaOf(col, a * c.alpha)); g.addColorStop(.45, rgbaOf(col, a * c.alpha * .42)); g.addColorStop(1, rgbaOf(col, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });
  },
  field(ctx, w, h, t, c, d) {
    const gap = 64 * d, len = 20 * d;
    ctx.strokeStyle = c.accent; ctx.lineWidth = 2 * d; ctx.lineCap = 'round';
    for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) {
      const a = Math.sin(x * .0019 / d + t * .00012) * 1.5 + Math.cos(y * .0024 / d - t * .0001) * 1.3;
      const m = (Math.sin(x * .004 / d - y * .003 / d + t * .0004) + 1) / 2;
      ctx.globalAlpha = c.alpha * (.08 + m * .28);
      const dx = Math.cos(a) * len * (.5 + m * .5), dy = Math.sin(a) * len * (.5 + m * .5);
      ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke();
    }
  },
  nodes(ctx, w, h, t, c, d, st) {
    if (!st.p) { st.p = []; for (let i = 0; i < 46; i++) st.p.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00004, vy: (Math.random() - .5) * .00004 }); st.last = t; }
    const dt = Math.min(64, t - (st.last || t)); st.last = t;
    const P = st.p, R = Math.max(w, h) * .17;
    P.forEach(p => { p.x = (p.x + p.vx * dt + 1) % 1; p.y = (p.y + p.vy * dt + 1) % 1; });
    ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent; ctx.lineWidth = 1.5 * d;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const dx = (P[i].x - P[j].x) * w, dy = (P[i].y - P[j].y) * h, dist = Math.hypot(dx, dy);
      if (dist < R) { ctx.globalAlpha = c.alpha * .32 * (1 - dist / R); ctx.beginPath(); ctx.moveTo(P[i].x * w, P[i].y * h); ctx.lineTo(P[j].x * w, P[j].y * h); ctx.stroke(); }
    }
    ctx.globalAlpha = c.alpha * .5;
    P.forEach(p => { ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 3.5 * d, 0, 7); ctx.fill(); });
  },
  orbits(ctx, w, h, t, c, d) {
    const cx = w * .82, cy = h * .62;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.32);
    ctx.lineWidth = 1.4 * d; ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent;
    for (let k = 0; k < 5; k++) {
      const rx = (220 + k * 170) * d, ry = rx * .42;
      ctx.globalAlpha = c.alpha * (.16 - k * .018);
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      const sp = .00011 / (1 + k * .6), a = t * sp * (k % 2 ? -1 : 1) + k * 1.7;
      for (let q = 0; q < 14; q++) { const aa = a - q * .018; ctx.globalAlpha = c.alpha * .5 * (1 - q / 14); ctx.beginPath(); ctx.arc(Math.cos(aa) * rx, Math.sin(aa) * ry, (4.2 - q * .22) * d, 0, 7); ctx.fill(); }
    }
    ctx.restore();
  },
  waves(ctx, w, h, t, c, d) {
    ctx.strokeStyle = c.accent; ctx.lineWidth = 2 * d;
    for (let i = 0; i < 10; i++) {
      const y0 = h * (.52 + i * .05);
      ctx.globalAlpha = c.alpha * (.1 + i * .03);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8 * d) {
        const y = y0 + Math.sin(x * .004 / d + t * .0006 + i * .5) * 26 * d + Math.sin(x * .0017 / d - t * .0004 + i) * 34 * d;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }
};
function Backdrop(canvas, root, live) {
  const ctx = canvas.getContext('2d');
  let cur = 'none', prev = 'none', f0 = 0, raf = 0, W = 0, H = 0, d = 1, colors = null, frame = 0;
  const state = {};
  const lumOf = v => { const m = rgbaOf(v, 1).match(/rgba\(([\d.]+),([\d.]+),([\d.]+)/); return m ? (.2126 * m[1] + .7152 * m[2] + .0722 * m[3]) / 255 : 0; };
  const readColors = () => { const cs = getComputedStyle(root); const bgc = cs.getPropertyValue('--bg').trim(); colors = { accent: cs.getPropertyValue('--accent').trim() || '#2F5BF5', accent2: cs.getPropertyValue('--accent-2').trim() || '#FFB547', ink: cs.getPropertyValue('--ink').trim() || '#111', lum: bgc ? lumOf(bgc) : 0, alpha: 1 }; };
  function size() {
    const r = canvas.getBoundingClientRect(); d = Math.min(2, G.devicePixelRatio || 1);
    W = Math.max(1, Math.round(r.width * d)); H = Math.max(1, Math.round(r.height * d));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  }
  function draw(t) {
    if (!colors || frame++ % 90 === 0) readColors();
    ctx.clearRect(0, 0, W, H);
    const f = Math.min(1, (t - f0) / 900);
    if (prev !== 'none' && f < 1 && BG[prev]) { ctx.save(); colors.alpha = 1 - f; BG[prev](ctx, W, H, t, colors, d, state[prev] = state[prev] || {}); ctx.restore(); }
    let moving = false;
    if (cur !== 'none' && BG[cur]) { ctx.save(); colors.alpha = prev === cur ? 1 : f; moving = BG[cur](ctx, W, H, t, colors, d, state[cur] = state[cur] || {}) !== false; ctx.restore(); }
    ctx.globalAlpha = 1;
    return f < 1 || moving;
  }
  function loop(t) { const more = draw(t); raf = (live() && !reduced() && more) ? requestAnimationFrame(loop) : 0; }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  return {
    set(kind) {
      kind = BG[kind] ? kind : 'none';
      if (kind === cur) { kick(); return; }
      prev = cur; cur = kind; f0 = performance.now();
      if (reduced() || !live()) { f0 = -1e9; prev = 'none'; }
      size(); kick();
    },
    focus(goal) {
      const st = state.fokusljus = state.fokusljus || {};
      st.goal = goal || { x: .5, y: .42, f: 0 };
      if (reduced() || !live()) st.snap = true;
      if (cur === 'fokusljus') kick();
    },
    resize() { size(); colors = null; kick(); },
    refresh() { colors = null; kick(); },
    stop() { cancelAnimationFrame(raf); raf = 0; }
  };
}

/* ---------- miniatyrer ---------- */
let thumbRO = null;
function fitThumb(el) {
  if (!thumbRO && G.ResizeObserver) thumbRO = new ResizeObserver(es => es.forEach(e => { const w = e.contentRect.width; if (w) e.target.style.setProperty('--s', w / 1920); }));
  if (thumbRO) thumbRO.observe(el);
}
const TVARS = ['bg', 'surface', 'ink', 'muted', 'line', 'accent', 'accent-2', 'hl', 'font', 'font-display', 'font-mono', 'h-weight', 'h-track', 'h-case', 'h-style', 'radius', 'acc-l', 'acc-d'];
function applyTheme(el, theme) {
  const t = theme || {};
  const T = THEMES[t.id] || THEMES.scen;
  TVARS.forEach(k => el.style.removeProperty('--' + k));
  const acc = t.accent && t.accent !== 'auto' ? ACCENTS[t.accent] : null;
  if (T.v) {
    Object.entries(T.v).forEach(([k, v]) => el.style.setProperty('--' + k, v));
    if (acc) el.style.setProperty('--accent', T.look === 'dark' ? acc[1] : acc[0]);
    el.dataset.look = T.look;
    el.style.setProperty('--font', T.fb); el.style.setProperty('--font-display', T.fd);
    el.style.setProperty('--h-weight', String(T.hw)); el.style.setProperty('--h-track', T.ht);
    el.style.setProperty('--h-case', T.hc || 'none'); el.style.setProperty('--radius', T.r);
    if (T.fm) el.style.setProperty('--font-mono', T.fm);
    el.style.setProperty('--h-style', T.hs || 'normal');
  } else {
    const a = acc || ACCENTS.blue;
    el.style.setProperty('--acc-l', a[0]); el.style.setProperty('--acc-d', a[1]);
    el.dataset.look = t.look || 'auto';
  }
  el.dataset.orn = T.orn || 'none';
  el.dataset.grain = T.grain ? '1' : '';
  el.dataset.glow = T.glow ? '1' : '';
  el.dataset.themeId = t.id && THEMES[t.id] ? t.id : 'scen';
}
function thumb(slide, deck, images, i) {
  const wrap = document.createElement('div');
  wrap.className = 'scen static sc-thumb';
  applyTheme(wrap, deck.theme);
  const im = images || {};
  wrap.innerHTML = `<div class="sc-stage">${renderSlide(slide, i || 0, deck, r => resolve(r, im))}</div>`;
  const sec = wrap.querySelector('.slide'); sec.classList.add('active');
  sec.querySelectorAll('[data-step]').forEach(el => {
    el.classList.add('in');
    el.classList.remove('step-current', 'step-past');
  });
  applyDramaturgy(sec, Number.POSITIVE_INFINITY, true);
  fitThumb(wrap);
  return wrap;
}
function resolve(ref, images) {
  if (!ref) return '';
  if (/^(data:|blob:|https?:)/.test(ref)) return ref;
  const k = ref.replace(/^img:/, '');
  if (images && images[k]) return images[k];
  if (/\.(jpe?g|png|webp|gif|svg|avif)$/i.test(k)) return k;
  return '';
}

/* ---------- spelaren ---------- */
const PRESENT_UI = `
<div class="sc-bar"><button type="button" data-a="overview">Översikt</button><button type="button" data-a="notes">Anteckningar</button><button type="button" data-a="full">Helskärm</button><button type="button" data-a="help">?</button><button type="button" data-a="exit" class="sc-exit">Avsluta</button></div>
<div class="sc-overview" hidden><div class="sc-ov-grid"></div></div>
<div class="sc-notes" hidden><div class="n-body"></div><div class="n-meta"><span class="n-timer">0:00</span><span class="n-pos"></span><span class="n-next"></span></div></div>
<div class="sc-help" hidden><div class="panel"><h2>Tangenter</h2><dl class="sc-keys">
<dt><kbd>→</kbd> <kbd>Mellanslag</kbd></dt><dd>Nästa steg eller bild</dd><dt><kbd>←</kbd></dt><dd>Föregående</dd>
<dt><kbd>Home</kbd> <kbd>End</kbd></dt><dd>Första och sista bilden</dd><dt><kbd>O</kbd></dt><dd>Översikt</dd><dt><kbd>N</kbd></dt><dd>Anteckningar på skärmen</dd>
<dt><kbd>P</kbd></dt><dd>Talarvy i eget fönster (i sparad fil)</dd><dt><kbd>F</kbd></dt><dd>Helskärm</dd><dt><kbd>B</kbd></dt><dd>Svart skärm</dd><dt><kbd>R</kbd></dt><dd>Spela bilden igen</dd><dt><kbd>T</kbd></dt><dd>Prova nästa tema</dd><dt><kbd>1</kbd>–<kbd>9</kbd></dt><dd>Räkna röster i en omröstning</dd><dt><kbd>Esc</kbd></dt><dd>Stäng eller avsluta</dd></dl>
<button type="button" data-a="help">Stäng</button></div></div>
<div class="sc-black"></div><div class="sc-toast" role="status"></div>`;

function player(root, deck, opt) {
  opt = opt || {};
  const mode = opt.mode || 'present';
  let images = opt.images || {};
  const sc = document.createElement('div');
  sc.className = 'scen ' + mode;
  applyTheme(sc, deck.theme);
  sc.innerHTML = `<div class="sc-viewport"><canvas class="sc-bg" aria-hidden="true"></canvas><div class="sc-stage"><div class="sc-deck"></div><div class="sc-counter"></div><div class="sc-progress"></div></div></div>` + (mode === 'present' ? PRESENT_UI : '');
  if (opt.student) {
    sc.querySelector('[data-a="notes"]')?.remove();
    sc.querySelectorAll('.sc-keys dt').forEach(dt => {
      if (['N','P','T'].includes(dt.textContent.trim())) { dt.nextElementSibling?.remove(); dt.remove(); }
    });
  }
  root.innerHTML = ''; root.appendChild(sc);
  const $ = s => sc.querySelector(s);
  const vp = $('.sc-viewport'), stage = $('.sc-stage'), deckEl = $('.sc-deck');
  let slides = [], cur = -1, step = 0, scale = 1, running = [], trans = null, alive = true, autoTimer = 0, t0 = Date.now(), timers = [], themeOverride = null;
  const bg = Backdrop($('.sc-bg'), sc, () => alive && mode === 'present');
  const img = r => resolve(r, images);

  function build() {
    deckEl.innerHTML = deck.slides.map((s, i) => renderSlide(s, i, deck, img)).join('');
    slides = [...deckEl.children];
    slides.forEach(sec => {
      const g = new Map();
      sec.querySelectorAll('[data-step]').forEach(el => { const n = +el.dataset.step; if (!g.has(n)) g.set(n, []); g.get(n).push(el); });
      sec._groups = [...g.keys()].sort((a, b) => a - b).map(k => g.get(k));
    });
  }
  function fit() {
    const r = vp.getBoundingClientRect();
    scale = Math.max(.01, Math.min(r.width / 1920, r.height / 1080));
    stage.style.setProperty('--s', scale);
    bg.resize();
  }
  const ro = G.ResizeObserver ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(vp); else G.addEventListener('resize', fit);

  function stopAll() {
    running.forEach(a => { try { a.finish(); } catch (e) {} });
    running = [];
    if (trans) { trans.forEach(a => { try { a.finish(); } catch (e) {} }); trans = null; }
    clearTimeout(autoTimer);
  }
  function setSteps(sec, n, animate) {
    const groups = sec._groups || [];
    groups.forEach((els, idx) => els.forEach(el => {
      el.classList.toggle('in', idx < n);
      el.classList.toggle('step-current', idx === n - 1);
      el.classList.toggle('step-past', idx < n - 1);
    }));
    sec.querySelectorAll('[data-dim]').forEach(box => {
      const shown = [...box.children].filter(c => c.classList.contains('in'));
      shown.forEach((c, j) => c.classList.toggle('dimmed', !sec.dataset.focus && j < shown.length - 1));
    });
    applyDramaturgy(sec, n, false);
    if (sec === slides[cur] || sec.classList.contains('active')) trackFocus(sec, n);
    if (animate && n > 0 && groups[n - 1] && !reduced()) {
      groups[n - 1].forEach(el => running.push(playNamed(el, el.dataset.stepAnim || 'fade', 0)));
    }
    if (animate && n > 0 && groups[n - 1]) groups[n - 1].forEach(el => { if (el.dataset.timer) startTimer(el); });
  }
  /* Var i scenen ligger fokus just nu? Används av bakgrunden Fokusljus.
     Dramaturgimallar anger målet själva; övriga mallar följer senaste klicksteget. */
  let focusT = 0;
  function focusGoal(sec, n) {
    if (!sec || sec.dataset.bg !== 'fokusljus') return null;
    const ds = sec.dataset.dramaturgyState;
    let els = [];
    if (ds) { if (ds !== 'focus') return null; els = [...sec.querySelectorAll('.dramaturgy-current')]; }
    else if (n > 0) els = (sec._groups || [])[n - 1] || [];
    const box = $('.sc-bg').getBoundingClientRect();
    if (!box.width || !els.length) return null;
    let l = Infinity, tp = Infinity, r = -Infinity, b = -Infinity;
    els.forEach(el => { const q = el.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return; l = Math.min(l, q.left); tp = Math.min(tp, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); });
    if (!(r > l)) return null;
    const area = ((r - l) * (b - tp)) / (box.width * box.height);
    const f = Math.max(0, Math.min(1, 1.15 - area * 1.6));
    if (f < .08) return null;
    return { x: Math.max(.05, Math.min(.95, ((l + r) / 2 - box.left) / box.width)), y: Math.max(.05, Math.min(.95, ((tp + b) / 2 - box.top) / box.height)), f };
  }
  function trackFocus(sec, n) {
    if (sec.dataset.bg !== 'fokusljus') return;
    bg.focus(focusGoal(sec, n));
    clearTimeout(focusT);
    // mät igen när stegets inträdesrörelse har landat
    focusT = setTimeout(() => { if (alive && slides[cur] === sec && step === n) bg.focus(focusGoal(sec, n)); }, 520);
  }
  function stopTimers() { timers.forEach(t => { clearInterval(t.iv); try { t.a.cancel(); } catch (e) {} t.el.classList.remove('done'); const tt = t.el.querySelector('.tt'); if (tt) tt.textContent = fmtT(+t.el.dataset.timer); }); timers = []; }
  function fmtT(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function startTimer(el) {
    const secs = +el.dataset.timer || 60, arc = el.querySelector('.arc'), tt = el.querySelector('.tt');
    const a = arc ? arc.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 100 }], { duration: secs * 1000, easing: 'linear', fill: 'forwards' }) : { cancel() {} };
    const t1 = Date.now() + secs * 1000;
    const iv = setInterval(() => { const left = (t1 - Date.now()) / 1000; if (tt) tt.textContent = fmtT(left); if (left <= 0) { clearInterval(iv); el.classList.add('done'); } }, 250);
    timers.push({ el, a, iv });
  }
  function vote(B, key, li) {
    const lis = [...B.querySelectorAll('.poll li')]; if (!lis.length) return;
    if (key === '0') lis.forEach(x => x._v = 0);
    else { const t = li || lis[+key - 1]; if (!t) return; t._v = (t._v || 0) + 1; }
    const total = lis.reduce((n, x) => n + (x._v || 0), 0);
    lis.forEach(x => { x.style.setProperty('--p', total ? (x._v || 0) / total : 0); const n = x.querySelector('.n'); if (n) n.textContent = x._v || 0; });
  }
  function entrance(sec, base, skip) {
    if (reduced()) return;
    sec.querySelectorAll('[data-anim]').forEach(el => {
      if (el.closest('[data-step]')) return;
      if (skip && skip.has(el)) return;
      running.push(...playEl(el, base));
    });
  }
  function transName(A, B, dir) {
    const src = dir < 0 ? A : B;
    let n = src.dataset.transition || 'auto';
    if (n === 'auto' || n === 'morph') n = shared(A, B).length ? 'morph' : (n === 'morph' ? 'fade' : 'fade');
    return reduced() ? (n === 'none' ? 'none' : 'fade') : n;
  }
  function shared(A, B) {
    const out = [];
    B.querySelectorAll('[data-id]').forEach(b => {
      const a = A.querySelector(`[data-id="${b.dataset.id}"]`);
      if (a && b.getBoundingClientRect().width) out.push([a, b]);
    });
    return out;
  }
  function transition(A, B, dir) {
    const name = transName(A, B, dir);
    const D = reduced() ? 250 : 850;
    const o = { duration: D, easing: EASE };
    let list = [], skip = new Set(), base = 150;
    const X = dir >= 0 ? 1 : -1;
    B.style.zIndex = 2; A.style.zIndex = 1;
    switch (name) {
      case 'none': break;
      case 'arc': {
        const o2 = { ...o, duration: D * 1.3, easing: 'cubic-bezier(.3,1,.35,1)' };
        list = [B.animate([{ transformOrigin: '50% 320%', transform: `rotate(${X * 11}deg)`, opacity: 0 }, { transformOrigin: '50% 320%', transform: 'none', opacity: 1, offset: 1 }], o2),
          A.animate([{ transformOrigin: '50% 320%', transform: 'none', opacity: 1 }, { transformOrigin: '50% 320%', transform: `rotate(${-X * 11}deg)`, opacity: 0 }], { ...o2, fill: 'forwards' })];
        base = 350; break;
      }
      case 'djup': {
        const o2 = { ...o, duration: D * 1.15, easing: 'cubic-bezier(.2,.8,.2,1)' };
        list = [B.animate([{ opacity: 0, transform: `scale(${X > 0 ? 1.07 : .93})`, filter: 'blur(18px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], o2),
          A.animate([{ opacity: 1, transform: 'none', filter: 'blur(0px)' }, { opacity: 0, transform: `scale(${X > 0 ? .93 : 1.07})`, filter: 'blur(14px)' }], { ...o2, duration: D * .8, fill: 'forwards' })];
        base = 300; break;
      }
      case 'fade': list = [B.animate([{ opacity: 0 }, { opacity: 1 }], { ...o, duration: D * .7 }), A.animate([{ opacity: 1 }, { opacity: 0 }], { ...o, duration: D * .5, fill: 'forwards' })]; break;
      case 'slide': list = [B.animate([{ transform: `translateX(${X * 100}%)` }, { transform: 'none' }], o), A.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-X * 25}%)`, opacity: 0 }], { ...o, fill: 'forwards' })]; break;
      case 'push': list = [B.animate([{ transform: `translateX(${X * 100}%)` }, { transform: 'none' }], o), A.animate([{ transform: 'none' }, { transform: `translateX(${-X * 100}%)` }], { ...o, fill: 'forwards' })]; break;
      case 'rise': list = [B.animate([{ transform: 'translateY(90px)', opacity: 0 }, { transform: 'none', opacity: 1 }], o), A.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-50px)', opacity: 0 }], { ...o, duration: D * .6, fill: 'forwards' })]; break;
      case 'zoom': list = [B.animate([{ transform: 'scale(1.08)', opacity: 0 }, { transform: 'none', opacity: 1 }], o), A.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.94)', opacity: 0 }], { ...o, duration: D * .6, fill: 'forwards' })]; break;
      case 'wipe': {
        const bIn = X > 0 ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] : ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'];
        const aOut = X > 0 ? ['inset(0 0 0 0%)', 'inset(0 0 0 100%)'] : ['inset(0 0% 0 0)', 'inset(0 100% 0 0)'];
        list = [B.animate([{ clipPath: bIn[0] }, { clipPath: bIn[1] }], { ...o, duration: D * 1.1, easing: 'cubic-bezier(.65,0,.35,1)' }), A.animate([{ clipPath: aOut[0] }, { clipPath: aOut[1] }], { ...o, duration: D * 1.1, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })];
        base = 400; break;
      }
      case 'morph': {
        const M = 950;
        const pairs = shared(A, B);
        const inB = new Set();
        pairs.forEach(([a, b]) => {
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          const dx = (ra.left - rb.left) / scale, dy = (ra.top - rb.top) / scale;
          let sx, sy;
          if (b.tagName === 'IMG') { sx = ra.width / rb.width; sy = ra.height / rb.height; }
          else { sx = sy = (parseFloat(getComputedStyle(a).fontSize) || 1) / (parseFloat(getComputedStyle(b).fontSize) || 1); }
          list.push(b.animate([{ transformOrigin: '0 0', transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` }, { transformOrigin: '0 0', transform: 'none' }], { duration: M, easing: EASE }));
          list.push(a.animate([{ opacity: 0 }, { opacity: 0 }], { duration: M, fill: 'forwards' }));
          skip.add(b); let p = b; while (p && p !== B) { inB.add(p); p = p.parentElement; }
        });
        list.push(A.animate([{ opacity: 1 }, { opacity: 0 }], { duration: M * .45, fill: 'forwards' }));
        [...B.children].forEach(ch => { if (!inB.has(ch)) list.push(ch.animate([{ opacity: 0 }, { opacity: 1 }], { duration: M * .6, delay: M * .3, fill: 'backwards' })); });
        base = 350; break;
      }
    }
    trans = list;
    if (!list.length) { A.classList.remove('active'); trans = null; }
    else Promise.all(list.map(a => a.finished.catch(() => {}))).then(() => { if (slides[cur] !== A) A.classList.remove('active'); A.style.zIndex = ''; B.style.zIndex = ''; if (trans === list) trans = null; list.forEach(a => { try { a.cancel(); } catch (e) {} }); });
    return { skip, base };
  }
  function show(i, o) {
    o = o || {};
    if (!slides.length) return;
    i = Math.max(0, Math.min(slides.length - 1, i));
    stopAll(); stopTimers();
    const A = cur >= 0 ? slides[cur] : null, B = slides[i];
    slides.forEach(s => { if (s !== A && s !== B) { s.classList.remove('active'); s.style.zIndex = ''; } });
    B.getAnimations({ subtree: true }).forEach(a => a.cancel());
    B.classList.add('active');
    step = o.atEnd ? (B._groups || []).length : 0;
    setSteps(B, step, false);
    let base = 0, skip = null;
    if (A && A !== B && o.anim !== false) { const t = transition(A, B, o.dir || 1); base = t.base; skip = t.skip; }
    else if (A && A !== B) A.classList.remove('active');
    cur = i;
    if (o.anim !== false && !o.atEnd) entrance(B, base, skip);
    bg.set(B.dataset.bg);
    trackFocus(B, step);
    update();
  }
  function update() {
    const n = slides.length;
    $('.sc-counter').textContent = n ? `${cur + 1} / ${n}` : '';
    $('.sc-progress').style.transform = `scaleX(${n > 1 ? cur / (n - 1) : 1})`;
    if (mode === 'present') {
      const s = deck.slides[cur] || {};
      $('.n-body').textContent = s.notes || 'Inga anteckningar för den här bilden.';
      $('.n-pos').textContent = `Bild ${cur + 1} av ${n}`;
      const nx = deck.slides[cur + 1];
      $('.n-next').textContent = nx ? 'Nästa: ' + (plain(nx.title) || LAYOUTS[nx.layout] || '') : 'Sista bilden';
      speakerSync();
    }
    opt.onChange && opt.onChange(cur, step);
  }
  function next() {
    const B = slides[cur]; if (!B) return;
    if (trans) { trans.forEach(a => { try { a.finish(); } catch (e) {} }); }
    if (step < (B._groups || []).length) { step++; setSteps(B, step, true); update(); }
    else if (cur < slides.length - 1) show(cur + 1, { dir: 1 });
    else if (mode === 'present') toast(opt.onExit ? 'Slut på presentationen. Esc avslutar.' : 'Slut på presentationen.');
  }
  function prev() {
    const B = slides[cur]; if (!B) return;
    if (step > 0) { running.forEach(a => { try { a.finish(); } catch (e) {} }); running = []; step--; setSteps(B, step, false); update(); }
    else if (cur > 0) show(cur - 1, { dir: -1, atEnd: true });
  }
  function replay() { const i = cur; const B = slides[i]; stopAll(); stopTimers(); B.getAnimations({ subtree: true }).forEach(a => a.cancel()); step = 0; setSteps(B, 0, false); entrance(B, 0); update(); }
  function autoplay() {
    replay();
    const B = slides[cur]; const n = (B._groups || []).length;
    const tick = () => { if (!alive || step >= n) return; next(); autoTimer = setTimeout(tick, 1100); };
    autoTimer = setTimeout(tick, 1500);
  }
  function toast(msg) {
    const t = $('.sc-toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400);
  }

  /* ----- visningsläge ----- */
  let keyH, idleT, spk = null, timerIv = 0;
  function overview(open) {
    const ov = $('.sc-overview'); if (!ov) return;
    const on = open == null ? ov.hidden : open;
    if (on) {
      const grid = ov.querySelector('.sc-ov-grid'); grid.innerHTML = '';
      deck.slides.forEach((s, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'sc-ov-item' + (i === cur ? ' current' : '');
        b.appendChild(thumb(s, deck, images, i));
        const l = document.createElement('span'); l.textContent = `${i + 1}  ${plain(s.title) || LAYOUTS[s.layout]}`; b.appendChild(l);
        b.onclick = () => { overview(false); show(i, { dir: i >= cur ? 1 : -1 }); };
        grid.appendChild(b);
      });
      ov.hidden = false; const c = grid.querySelector('.current'); c && c.focus(); c && c.scrollIntoView({ block: 'center' });
    } else ov.hidden = true;
  }
  function notes(open) { if (opt.student) return; const n = $('.sc-notes'); if (n) n.hidden = open == null ? !n.hidden : !open; }
  function help(open) { const n = $('.sc-help'); if (n) n.hidden = open == null ? !n.hidden : !open; }
  function full() {
    const d = document;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { const r = (sc.requestFullscreen || sc.webkitRequestFullscreen); const p = r && r.call(sc); if (p && p.catch) p.catch(() => toast('Helskärm går inte här.')); if (!r) toast('Helskärm går inte här.'); }
    } catch (e) { toast('Helskärm går inte här.'); }
  }
  function speaker() {
    if (opt.student) return;
    if (!opt.speaker) { toast('Talarvyn finns i den sparade filen. Här: tryck N för anteckningar.'); return; }
    if (spk && !spk.closed) { spk.focus(); return; }
    spk = G.open('', 'scen-talarvy', 'width=1100,height=720');
    if (!spk) { toast('Fönstret blockerades. Tillåt popup-fönster och tryck P igen.'); return; }
    const css = (document.getElementById('scen-engine-css') || {}).textContent || '';
    spk.document.open();
    spk.document.write(`<!doctype html><html lang="sv"><head><meta charset="utf-8"><title>Talarvy</title><style>${css}
body{margin:0;background:#0B1322;color:#E7EDF7;font:16px/1.5 system-ui,sans-serif;height:100vh;display:grid;grid-template:auto 1fr/3fr 2fr;gap:20px;padding:20px;box-sizing:border-box}
header{grid-column:1/-1;display:flex;gap:24px;align-items:baseline}#t{font-size:34px;font-weight:650;font-variant-numeric:tabular-nums}#pos{color:#8E9AB3}
.cur,.nx{min-height:0}.lab{color:#8E9AB3;font-size:13px;margin:0 0 6px}#notes{font-size:22px;white-space:pre-wrap;overflow:auto}
button{font:inherit;padding:8px 14px;border-radius:8px;border:1px solid #26345A;background:#131E35;color:inherit;cursor:pointer}</style></head>
<body><header><span id="t">0:00</span><span id="pos"></span><button id="pv">←</button><button id="nx">→</button><button id="rs">Nollställ tid</button></header>
<div class="cur"><p class="lab">Nu</p><div id="c"></div><p class="lab" style="margin-top:14px">Anteckningar</p><div id="notes"></div></div><div class="nx"><p class="lab">Nästa</p><div id="n"></div></div></body></html>`);
    spk.document.close();
    spk.document.getElementById('pv').onclick = () => prev();
    spk.document.getElementById('nx').onclick = () => next();
    spk.document.getElementById('rs').onclick = () => { t0 = Date.now(); };
    spk.document.addEventListener('keydown', e => keyH && keyH(e));
    speakerSync();
  }
  function speakerSync() {
    if (!spk || spk.closed) return;
    const d = spk.document; const c = d.getElementById('c'), n = d.getElementById('n'); if (!c) return;
    c.innerHTML = ''; n.innerHTML = '';
    const imp = (el) => d.importNode(el, true);
    const s = deck.slides[cur]; if (s) { const th = thumb(s, deck, images, cur); c.appendChild(imp(th)); }
    const nx = deck.slides[cur + 1]; if (nx) n.appendChild(imp(thumb(nx, deck, images, cur + 1))); else n.textContent = 'Sista bilden';
    [c, n].forEach(box => box.querySelectorAll('.sc-thumb').forEach(tb => { const w = box.getBoundingClientRect().width; tb.style.setProperty('--s', w / 1920); }));
    d.getElementById('notes').textContent = (s && s.notes) || '';
    d.getElementById('pos').textContent = `Bild ${cur + 1} av ${slides.length} · steg ${step} av ${(slides[cur]._groups || []).length}`;
  }
  function tickTimer() {
    const s = Math.floor((Date.now() - t0) / 1000), txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const el = $('.n-timer'); if (el) el.textContent = txt;
    if (spk && !spk.closed) { const t = spk.document.getElementById('t'); if (t) t.textContent = txt; }
  }
  if (mode === 'present') {
    if (!opt.onExit) { const x = $('.sc-exit'); x && x.remove(); }
    keyH = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key;
      const ovOpen = !$('.sc-overview').hidden;
      if (k === 'Escape') {
        if (!$('.sc-help').hidden) help(false); else if (ovOpen) overview(false); else if ($('.sc-black').classList.contains('on')) $('.sc-black').classList.remove('on'); else if (opt.onExit) opt.onExit(cur);
        e.preventDefault(); return;
      }
      if (ovOpen) return;
      const black = $('.sc-black');
      if (black.classList.contains('on') && k !== 'b' && k !== 'B') { black.classList.remove('on'); e.preventDefault(); return; }
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { next(); e.preventDefault(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { prev(); e.preventDefault(); }
      else if (k === 'Home') show(0, { dir: -1 });
      else if (k === 'End') show(slides.length - 1, { dir: 1 });
      else if (k === 'o' || k === 'O') overview();
      else if (k === 'n' || k === 'N') notes();
      else if (k === 'p' || k === 'P') speaker();
      else if (k === 'f' || k === 'F') full();
      else if (k === 'b' || k === 'B') black.classList.toggle('on');
      else if (k === 'r' || k === 'R') replay();
      else if (/^[0-9]$/.test(k) && slides[cur] && slides[cur].dataset.layout === 'poll') vote(slides[cur], k);
      else if (!opt.student && (k === 't' || k === 'T')) {
        const ids = Object.keys(THEMES); const now = themeOverride || (deck.theme && deck.theme.id) || 'scen';
        themeOverride = ids[(ids.indexOf(now) + 1) % ids.length];
        applyTheme(sc, Object.assign({}, deck.theme, { id: themeOverride, accent: 'auto' })); bg.refresh();
        toast('Tema: ' + THEMES[themeOverride].name + ' (bara nu, sparas inte)');
      }
      else if (k === '?') help();
    };
    G.addEventListener('keydown', keyH);
    sc.addEventListener('click', e => {
      const a = e.target.closest('[data-a]');
      if (a) { const f = { overview: () => overview(), notes: () => notes(), full, help: () => help(), exit: () => opt.onExit && opt.onExit(cur) }[a.dataset.a]; f && f(); e.stopPropagation(); return; }
      if (e.target.closest('.sc-overview,.sc-notes,.sc-help')) return;
      if (e.target.closest('.sc-black')) { $('.sc-black').classList.remove('on'); return; }
      if (e.target.closest('a,button,input,select,textarea')) return;
      const pl = e.target.closest('.poll li');
      if (pl) { vote(slides[cur], '', pl); return; }
      const r = vp.getBoundingClientRect();
      if (e.clientX < r.left + r.width * .22) prev(); else next();
    });
    let sx = null, sy = null;
    vp.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; sc.classList.add('touch'); } });
    vp.addEventListener('pointerup', e => {
      if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); dx < 0 ? next() : prev(); sc._swiped = Date.now(); }
    });
    sc.addEventListener('click', e => { if (sc._swiped && Date.now() - sc._swiped < 400) e.stopImmediatePropagation(); }, true);
    const wake = () => { sc.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => sc.classList.add('idle'), 2600); };
    sc.addEventListener('pointermove', wake); wake();
    timerIv = setInterval(tickTimer, 1000);
  }

  build(); fit();
  show(opt.start || 0, { anim: mode === 'present', atEnd: mode === 'preview' });
  if (mode === 'present' && opt.hint !== false) setTimeout(() => toast('→ eller klick går vidare · ? visar tangenter'), 600);

  return {
    el: sc,
    go(i, o) { show(i, Object.assign({ dir: i >= cur ? 1 : -1 }, o || {})); },
    next, prev, replay, autoplay,
    index: () => cur, step: () => step,
    steps: () => (slides[cur] && slides[cur]._groups || []).length,
    setDeck(d, imgs, keep) {
      deck = d; if (imgs) images = imgs; applyTheme(sc, deck.theme); bg.refresh();
      const at = Math.min(keep == null ? cur : keep, deck.slides.length - 1);
      stopAll(); cur = -1; build(); if (at >= 0) show(at, { anim: false, atEnd: mode === 'preview' });
    },
    setImages(imgs) { images = imgs; },
    toast,
    destroy() {
      alive = false; stopAll(); stopTimers(); bg.stop(); ro && ro.disconnect(); clearInterval(timerIv); clearTimeout(idleT);
      if (keyH) G.removeEventListener('keydown', keyH);
      if (spk && !spk.closed) spk.close();
      root.innerHTML = '';
    }
  };
}

function exportData(deck, images, student) {
  // Copy content so student export never removes notes from the working original.
  const slides = JSON.parse(JSON.stringify(deck.slides || []));
  if (student) slides.forEach(sl => { delete sl.notes; });
  return { v: 3, title: deck.title, theme: deck.theme, slides, templates: deck.templates || {}, images: images || {}, audience: student ? 'student' : 'teacher', exportedAt: new Date().toISOString() };
}
function standalone(deck) {
  document.documentElement.lang = 'sv';
  const root = document.getElementById('scen-root');
  const imgs = deck.images || {};
  const start = Math.max(0, (parseInt((location.hash || '').slice(1), 10) || 1) - 1);
  return player(root, deck, { mode: 'present', images: imgs, speaker: deck.audience !== 'student', student: deck.audience === 'student', start, onChange(i) { try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {} } });
}

G.Scen = { exportData, player, thumb, renderSlide, standalone, applyTheme, applyDramaturgy, dramaturgyPhase, dramaturgyTarget, normalizeImageDirection, imageBrief, normalizeTextDirection, fmt, plain, esc, hash, lines, resolve, cleanHtml, cleanCss, fontUrl, THEMES, ACCENTS, LAYOUTS, TRANSITIONS, BACKGROUNDS, TITLE_ANIMS, BODY_ANIMS, FOCUS_STYLES, version: '3.0' };
})(window);
