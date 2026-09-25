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
const LAYOUTS = {
  title: 'Titel', section: 'Avsnitt', statement: 'Påstående', bullets: 'Punktlista', split: 'Text och bild',
  image: 'Helbild', cards: 'Kort', compare: 'Jämförelse', table: 'Tabell', number: 'Stort tal', timeline: 'Tidslinje',
  question: 'Fråga och svar', poll: 'Omröstning', reflect: 'Reflektion', define: 'Definition', chat: 'AI-samtal', duo: 'Två tal',
  quote: 'Citat', omslag: 'Omslag', karta: 'Karta', triad: 'Triad', motsats: 'Motsats', bildkant: 'Bildkant', egen: 'Egen mall'
};
const THEMES = {
  scen: { name: 'Scen', desc: 'Systemets typsnitt. Följer ljust och mörkt läge, välj färg själv.' },
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
const TRANSITIONS = { auto: 'Automatisk', fade: 'Tona', slide: 'Glid', push: 'Skjut', rise: 'Stig', zoom: 'Zooma', wipe: 'Svep', morph: 'Morph', none: 'Ingen' };
const BACKGROUNDS = { none: 'Ingen', field: 'Vektorfält', nodes: 'Nätverk', waves: 'Vågor' };
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

/* ---------- rendering ---------- */
function anim(v, def) { return (!v || v === 'auto') ? def : v; }
function A(name, delay, extra) {
  if (!name || name === 'none') return '';
  return ` data-anim="${name}"` + (delay ? ` data-delay="${delay}"` : '') + (extra || '');
}
function renderSlide(sl, i, deck, img) {
  img = img || (() => '');
  const L = LAYOUTS[sl.layout] ? sl.layout : 'bullets';
  const ta = sl.ta || 'auto', ba = sl.ba || 'auto';
  const steps = sl.steps !== false;
  const dim = !!sl.dim;
  let k = 0;
  const st = (anm) => ` data-step="${++k}" data-step-anim="${anm}"`;
  const tid = (t) => ` data-id="t-${hash(plain(t))}"`;
  const title = sl.title || '';
  const TA = themeOf(deck).ta;
  const tA = (def) => { if (ta && ta !== 'auto') return ta; const t = TA || def; return (t === 'type' && plain(title).length > 48) ? 'rise' : t; };
  const H2 = (cls, def) => title ? `<h2${cls ? ` class="${cls}"` : ''}${tid(title)}${A(tA(def))}>${fmt(title)}</h2>` : '';
  let attrs = '';
  const bodyA = anim(ba, 'rise');
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
      const its = lines(sl.items).map(t => { const p = t.split('|'); return { when: (p[0] || '').trim(), what: p.slice(1).join('|').trim() }; });
      const n = Math.max(1, Math.min(its.length, 6));
      const li = its.map(o => `<li${steps ? st(bodyA === 'none' ? 'fade' : bodyA) : ''}><b>${fmt(o.when)}</b><span>${fmt(o.what)}</span></li>`).join('');
      body = H2('', 'words') + `<div class="track" style="--n:${n}"${A('fade', 200)}><div class="rail"></div><ol${!steps ? A(bodyA, 400, ' data-stagger="160"') : ''}>${li}</ol></div>`;
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
        `<p class="poll-hint">Tryck 1–${Math.max(1, Math.min(9, its.length))} för att räkna röster, 0 nollställer.</p>` +
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
  const tr = sl.transition || 'auto';
  const bg = sl.bg || (deck && deck.bg) || 'none';
  return `<section class="slide ${cls}" data-layout="${L}" data-transition="${tr}" data-bg="${bg}" data-i="${i}"${attrs}>${body}</section>`;
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
  const raw = m[0];
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
  if (name === 'words') {
    const ws = splitWords(el);
    const list = ws.map((w, j) => w.animate([{ opacity: 0, transform: 'translateY(.35em)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: dur || 750, delay: (delay || 0) + j * 70, easing: EASE, fill: 'backwards' }));
    return { cancel() { list.forEach(a => a.cancel()); }, finish() { list.forEach(a => a.finish()); } };
  }
  if (name === 'count') return countUp(el, delay, dur);
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
const BG = {
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
  const readColors = () => { const cs = getComputedStyle(root); colors = { accent: cs.getPropertyValue('--accent').trim() || '#2F5BF5', alpha: 1 }; };
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
    if (cur !== 'none' && BG[cur]) { ctx.save(); colors.alpha = prev === cur ? 1 : f; BG[cur](ctx, W, H, t, colors, d, state[cur] = state[cur] || {}); ctx.restore(); }
    ctx.globalAlpha = 1;
    return f < 1;
  }
  function loop(t) { const fading = draw(t); raf = (live() && !reduced() && (cur !== 'none' || fading)) ? requestAnimationFrame(loop) : 0; }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  return {
    set(kind) {
      kind = BG[kind] ? kind : 'none';
      if (kind === cur) { kick(); return; }
      prev = cur; cur = kind; f0 = performance.now();
      if (reduced() || !live()) { f0 = -1e9; prev = 'none'; }
      size(); kick();
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
  el.dataset.themeId = t.id && THEMES[t.id] ? t.id : 'scen';
}
function thumb(slide, deck, images, i) {
  const wrap = document.createElement('div');
  wrap.className = 'scen static sc-thumb';
  applyTheme(wrap, deck.theme);
  const im = images || {};
  wrap.innerHTML = `<div class="sc-stage">${renderSlide(slide, i || 0, deck, r => resolve(r, im))}</div>`;
  const sec = wrap.querySelector('.slide'); sec.classList.add('active');
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
    groups.forEach((els, idx) => els.forEach(el => el.classList.toggle('in', idx < n)));
    sec.querySelectorAll('[data-dim]').forEach(box => {
      const shown = [...box.children].filter(c => c.classList.contains('in'));
      shown.forEach((c, j) => c.classList.toggle('dimmed', j < shown.length - 1));
    });
    if (animate && n > 0 && groups[n - 1] && !reduced()) {
      groups[n - 1].forEach(el => running.push(playNamed(el, el.dataset.stepAnim || 'fade', 0)));
    }
    if (animate && n > 0 && groups[n - 1]) groups[n - 1].forEach(el => { if (el.dataset.timer) startTimer(el); });
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
  function notes(open) { const n = $('.sc-notes'); if (n) n.hidden = open == null ? !n.hidden : !open; }
  function help(open) { const n = $('.sc-help'); if (n) n.hidden = open == null ? !n.hidden : !open; }
  function full() {
    const d = document;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { const r = (sc.requestFullscreen || sc.webkitRequestFullscreen); const p = r && r.call(sc); if (p && p.catch) p.catch(() => toast('Helskärm går inte här.')); if (!r) toast('Helskärm går inte här.'); }
    } catch (e) { toast('Helskärm går inte här.'); }
  }
  function speaker() {
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
      else if (k === 't' || k === 'T') {
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

function standalone(deck) {
  document.documentElement.lang = 'sv';
  const root = document.getElementById('scen-root');
  const imgs = deck.images || {};
  const start = Math.max(0, (parseInt((location.hash || '').slice(1), 10) || 1) - 1);
  return player(root, deck, { mode: 'present', images: imgs, speaker: true, start, onChange(i) { try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {} } });
}

G.Scen = { player, thumb, renderSlide, standalone, applyTheme, fmt, plain, esc, hash, lines, resolve, cleanHtml, cleanCss, fontUrl, THEMES, ACCENTS, LAYOUTS, TRANSITIONS, BACKGROUNDS, TITLE_ANIMS, BODY_ANIMS, version: '3.0' };
})(window);
