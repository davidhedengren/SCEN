/* ===== Manus: presentationen som text, och mallkatalogen =====
   Manus.parse(text) -> {meta, slides}   Manus.stringify(deck) -> text   Manus.CATALOG */
const Manus = (() => {
  const TAGS = {"etapper":"etapper","v\u00e4gval":"vagval","lager":"lager","resonemang":"resonemang","helhet":"helhet",lameller: "lameller",register: "register",samband: "samband",marginal: "marginal",sats: "sats",
    titel: 'title', avsnitt: 'section', 'påstående': 'statement', punkter: 'bullets', 'text-bild': 'split', helbild: 'image', bildregi: 'bildregi', terminal: 'terminal', 'kodförklaring': 'kodforklaring', kodskrivning: 'kodskrivning', formel: 'formel', typografi: 'typografisk', texttempo: 'texttempo',
    kort: 'cards', 'jämförelse': 'compare', tabell: 'table', tal: 'number', 'två-tal': 'duo', tidslinje: 'timeline',
    'fråga': 'question', 'omröstning': 'poll', reflektion: 'reflect', definition: 'define', samtal: 'chat', citat: 'quote',
    omslag: 'omslag', karta: 'karta', triad: 'triad', motsats: 'motsats', bildkant: 'bildkant', skiften: 'skiften', prisma: 'prisma', verkningar: 'verkningar', 'belägg': 'belagg', 'sammanflöde': 'sammanflode', fri: 'tom', 'båge': 'båge', omlopp: 'omlopp', gradskiva: 'gradskiva', bro: 'bro', spegel: 'spegel', ordpar: 'ordpar', spektrum: 'spektrum', livslopp: 'livslopp', lexikon: 'lexikon', rad: 'rad', rutor: 'rutor', remsor: 'remsor', mosaik: 'mosaik', 'kärna': 'karna', graf: 'graf', 'träd': 'trad', 'flöde': 'flode', urval: 'urval', 'förgrening': 'forgrening', inzoomning: 'inzoomning', 'fyrfält': 'fyrfalt', 'vågskål': 'vagskal', 'sökning': 'sokning', 'rutnät': 'rutnat', 'kö': 'ko', ringar: 'ringar', lins: 'lins', 'mätare': 'mätare', 'ridå': 'ridå', 'strålkastare': 'strålkastare', fokus: 'fokus', ordbild: 'ordbild', 'bildfält': 'bildfält', delning: 'delning', ljustal: 'ljustal', egen: 'egen'
  };
  const TAG_OF = Object.fromEntries(Object.entries(TAGS).map(([k, v]) => [v, k]));
  const KEYS = { accent: 'accent',
    rubrik: 'title', 'fråga': 'title', term: 'title', text: 'text', ingress: 'text', underrubrik: 'text', citat: 'text', definition: 'text',
    etikett: 'caption', 'källa': 'caption', bildtext: 'caption', svar: 'answer', exempel: 'example', tal: 'number', tid: 'minutes',
    bild: 'image', alt: 'alt', 'vänster': 'lt', 'höger': 'rt', start: 'start', slut: 'end', orsak: 'cause', konsekvens: 'effect', villkor: 'condition', alternativ: 'alternative', helhet: 'whole', reservation: 'reservation', gemensamt: 'common', 'spänning': 'tension', syntes: 'synthesis', band: 'banner', 'bild-vänster': 'flip', steg: 'steps', tona: 'dim', fokus: 'focus', retur: 'ret',
    'övergång': 'transition', bakgrund: 'bg', rubrikrörelse: 'ta', 'rörelse': 'ba', visa: 'reveal', rubrikrad: 'header', mall: 'tpl', aktiv: 'active', siffra: 'number', slutsats: 'text', max: 'max', mitten: 'text'
  };
  const OUT_KEY = { scale: 'skala', conclusion: 'slutsats', max: 'max', active: 'aktiv', title: 'rubrik', text: 'text', caption: 'etikett', answer: 'svar', example: 'exempel', number: 'tal', minutes: 'tid', image: 'bild', alt: 'alt', lt: 'vänster', rt: 'höger', ret: 'retur', start: 'start', end: 'slut', question: 'fråga', cause: 'orsak', effect: 'konsekvens', condition: 'villkor', alternative: 'alternativ', source: 'källa', whole: 'helhet', reservation: 'reservation', common: 'gemensamt', tension: 'spänning', synthesis: 'syntes', transition: 'övergång', bg: 'bakgrund', ta: 'rubrikrörelse', ba: 'rörelse', tpl: 'mall' };
  const IMAGE_DIRECTION_KEYS = { 'bildläge':'mode', fokuspunkt:'focus', 'beskärning':'crop', startutsnitt:'start', slututsnitt:'end', 'säker-yta':'safe', 'mörkning':'shade', riktning:'direction', hastighet:'speed' };
  const IMAGE_BRIEF_KEYS = { 'bild-id':'id', filnamn:'filename', scen:'scene', syfte:'purpose', motiv:'subject', komposition:'composition', motivplacering:'placement', format:'aspectRatio', undvik:'avoid', prompt:'prompt' };
  const IMAGE_DIRECTION_OUT = { mode:'bildläge', focus:'fokuspunkt', crop:'beskärning', start:'startutsnitt', end:'slututsnitt', safe:'säker-yta', shade:'mörkning', direction:'riktning', speed:'hastighet' };
  const IMAGE_BRIEF_OUT = { id:'bild-id', filename:'filnamn', scene:'scen', purpose:'syfte', subject:'motiv', composition:'komposition', placement:'motivplacering', aspectRatio:'format', avoid:'undvik', prompt:'prompt' };
  const REVEAL = { allt: 'none', rader: 'rows', facit: 'answers', 'facit-rader': 'rest' };
  const REVEAL_OUT = { none: 'allt', rows: 'rader', answers: 'facit', rest: 'facit-rader' };
  const LIST_FIELD = {spegel:'items',ordpar:'items',spektrum:'items',livslopp:'items',lexikon:'items',rad:'items',rutor:'items',remsor:'items',mosaik:'items',karna:'items',graf:'items',trad:'items',flode:'items',urval:'items',forgrening:'items',inzoomning:'items',fyrfalt:'items',vagskal:'items',sokning:'items',rutnat:'items',ko:'items',kodskrivning:'items',formel:'items',etapper:'items',vagval:'items',lager:'items',resonemang:'items',helhet:'items',skiften:'items',prisma:'items',verkningar:'items',belagg:'items',sammanflode:'items',register:'items',samband:'items',marginal:'items',sats:'items', bullets: 'bullets', split: 'bullets', question: 'bullets', poll: 'bullets', reflect: 'bullets', cards: 'items', timeline: 'items', bildregi:'items', terminal:'items', kodforklaring:'items', typografisk:'items', texttempo:'items', chat: 'items', duo: 'items', egen: 'items', compare: 'lb', karta: 'items', triad: 'items', motsats: 'items', bildkant: 'bullets', omlopp: 'items', gradskiva: 'items', bro: 'items', ringar: 'items', lins: 'items', 'strålkastare': 'items', fokus: 'items', 'bildfält': 'bullets', delning: 'items' };
  const STEPPED = ["spegel","ordpar","spektrum","livslopp","lexikon","rad","rutor","remsor","mosaik","karna","graf","trad","flode","urval","forgrening","inzoomning","fyrfalt","vagskal","sokning","rutnat","ko","kodskrivning","formel","etapper","vagval","lager","resonemang","helhet","skiften","prisma","verkningar","belagg","sammanflode",'register','samband','marginal','sats','bullets', 'split', 'cards', 'compare', 'timeline', 'bildregi', 'terminal', 'kodforklaring', 'typografisk', 'texttempo', 'chat', 'duo', 'egen', 'karta', 'triad', 'motsats', 'bildkant', 'omlopp', 'gradskiva', 'bro', 'ringar', 'lins', 'strålkastare', 'fokus', 'bildfält', 'delning'];
  const yes = v => /^(ja|j|yes|true|1|på)$/i.test(String(v).trim());
  function enumVal(map, v) {
    const x = String(v).trim().toLowerCase();
    if (map[x]) return x;
    const hit = Object.entries(map).find(([, label]) => label.toLowerCase() === x);
    return hit ? hit[0] : null;
  }
  const themeId = v => { const x = String(v).trim().toLowerCase(); if (Scen.THEMES[x]) return x; const h = Object.entries(Scen.THEMES).find(([, t]) => t.name.toLowerCase() === x || t.name.toLowerCase().replace('å', 'a') === x); return h ? h[0] : 'scen'; };
  const accentId = v => { const x = String(v).trim().toLowerCase(); if (Scen.ACCENTS[x]) return x; const h = Object.entries(Scen.ACCENTS).find(([, a]) => a[2].toLowerCase() === x); return h ? h[0] : 'auto'; };

  function parse(text) {
    const src = String(text || '').replace(/\r/g, '');
    const meta = {};
    let body = src;
    const fm = src.match(/^\s*---\n([\s\S]*?)\n---\s*\n/);
    if (fm) {
      fm[1].split('\n').forEach(l => { const m = l.match(/^\s*([^:]+):\s*(.*)$/); if (m) meta[m[1].trim().toLowerCase()] = m[2].trim(); });
      body = src.slice(fm[0].length);
    }
    const blocks = body.split(/\n\s*---\s*\n/).map(b => b.trim()).filter(Boolean);
    const slides = blocks.map(parseBlock).filter(Boolean);
    return { meta, slides };
  }
  function parseBlock(block) {
    const ls = block.split('\n');
    let s = { layout: 'bullets' };
    let i = 0;
    while (i < ls.length && !ls[i].trim()) i++;
    const head = (ls[i] || '').trim().match(/^\[\s*([^\]:]+?)\s*(?::\s*([^\]]+))?\]$/);
    if (head) {
      const tag = head[1].toLowerCase();
      s.layout = TAGS[tag] || (Scen.LAYOUTS[tag] ? tag : 'bullets');
      if (head[2]) { if (s.layout === 'egen') s.tpl = head[2].trim(); }
      i++;
    }
    let listField = LIST_FIELD[s.layout] || 'bullets';
    let last = null;
    let lastImageBrief = null;
    const notes = [];
    const rows = [];
    for (; i < ls.length; i++) {
      const raw = ls[i];
      const line = raw.trim();
      if (!line) { if (last && typeof s[last] === 'string') last = null; lastImageBrief = null; continue; }
      if (line.startsWith('>')) { notes.push(line.replace(/^>\s?/, '')); last = null; lastImageBrief = null; continue; }
      if (line.startsWith('@')) { const ly = parseLayer(line); if (ly) (s.layers = s.layers || []).push(ly); last = null; lastImageBrief = null; continue; }
      if (line.startsWith('|')) {
        if (/^\|[\s:|-]+\|?$/.test(line)) continue;
        const cells = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim().replace(/\\n/g, '\n'));
        rows.push(cells); last = null; lastImageBrief = null; continue;
      }
      const li = raw.match(/^(\s*)[-*•]\s+(.*)$/);
      if (li) {
        const depth = s.layout === 'trad' || s.layout === 'sokning' ? Math.min(8,Math.floor(li[1].replace(/\t/g, '  ').length / 2)) : (li[1].length >= 2 ? 1 : 0);
        const arr = s[listField] = Array.isArray(s[listField]) ? s[listField] : [];
        arr.push('- '.repeat(depth) + li[2].replace(/\\\\n/g, String.fromCharCode(10)));
        last = null; lastImageBrief = null; continue;
      }
      const kv = line.match(/^([a-zåäöA-ZÅÄÖ-]+)\s*:\s*(.*)$/);
      const label = kv && kv[1].toLowerCase();
      let key = kv && KEYS[label];
      if (kv && IMAGE_DIRECTION_KEYS[label]) {
        const field = IMAGE_DIRECTION_KEYS[label], v = kv[2].trim();
        const target = s.imageDirection = s.imageDirection || {};
        if (['focus','start','end','safe','shade'].includes(field)) target[field] = v.split(/[\s,]+/).map(Number).filter(Number.isFinite);
        else if (field === 'mode') target.mode = ({ hero:'hero',cinematic:'hero',detalj:'detail',detail:'detail',spotlight:'spotlight',annotation:'spotlight',reveal:'reveal',mask:'reveal' })[v.toLowerCase()] || 'hero';
        else if (field === 'direction') target.direction = ({ höger:'right',hoger:'right',right:'right',vänster:'left',vanster:'left',left:'left',upp:'up',up:'up',ned:'down',down:'down',stilla:'none',none:'none' })[v.toLowerCase()] || 'none';
        else if (field === 'speed') target.speed = ({ långsam:'slow',langsamt:'slow',slow:'slow',normal:'medium',medium:'medium',snabb:'fast',fast:'fast' })[v.toLowerCase()] || 'slow';
        else target[field] = v === 'contain' ? 'contain' : 'cover';
        last = null; lastImageBrief = null; continue;
      }
      if (kv && IMAGE_BRIEF_KEYS[label]) {
        const field = IMAGE_BRIEF_KEYS[label];
        (s.imageBrief = s.imageBrief || {})[field] = kv[2].trim();
        last = null; lastImageBrief = field; continue;
      }
      if (s.layout === 'prisma' && label === 'fråga') key = 'question';
      if (s.layout === 'belagg' && label === 'källa') key = 'source';
      if (['spegel', 'ordpar', 'spektrum', 'livslopp', 'lexikon', 'graf', 'trad', 'flode', 'urval', 'rad', 'rutor', 'remsor', 'mosaik', 'karna', 'forgrening', 'inzoomning', 'fyrfalt', 'vagskal', 'sokning', 'rutnat', 'ko', 'formel'].includes(s.layout) && label === 'slutsats') key = 'conclusion';
      if (s.layout === 'formel' && label === 'formel') key = 'text';
      if (s.layout === 'livslopp' && label === 'skala') key = 'scale';
      if (s.layout === 'rad' && label === 'flöde') { s.flow = yes(kv[2]); last = null; lastImageBrief = null; continue; }
      if (key) {
        const v = kv[2];
        last = null; lastImageBrief = null;
        if (key === 'lt') { s.lt = v; if (s.layout === 'compare') listField = 'lb'; continue; }
        if (key === 'rt') { s.rt = v; if (s.layout === 'compare') listField = 'rb'; continue; }
        if (['banner', 'flip', 'dim'].includes(key)) { s[key] = yes(v); continue; }
        if (key === 'accent') { const a=Object.entries(Scen.ACCENTS).find(([k,p])=>k===v.trim().toLowerCase()||p[2].toLowerCase()===v.trim().toLowerCase()); s.accent=a?a[0]:''; continue; }
        if (key === 'focus') { s.focus = enumVal(Scen.FOCUS_STYLES, v) || 'none'; continue; }
        if (key === 'steps') { s.steps = yes(v); continue; }
        if (key === 'transition') { s.transition = enumVal(Scen.TRANSITIONS, v) || 'auto'; continue; }
        if (key === 'bg') { s.bg = enumVal(Scen.BACKGROUNDS, v) || 'none'; continue; }
        if (key === 'ta') { s.ta = enumVal(Scen.TITLE_ANIMS, v) || 'auto'; continue; }
        if (key === 'ba') { s.ba = enumVal(Scen.BODY_ANIMS, v) || 'auto'; continue; }
        if (key === 'reveal') { (s.table = s.table || {}).reveal = REVEAL[v.trim().toLowerCase()] || 'none'; continue; }
        if (key === 'header') { (s.table = s.table || {}).header = yes(v); continue; }
        if (key === 'image') { const x = v.trim(); s.image = !x ? '' : (/^(img:|data:)/.test(x) ? x : 'img:' + x); continue; }
        if (key === 'tpl') { s.tpl = v.trim(); continue; }
        s[key] = v; last = key; continue;
      }
      if (lastImageBrief && s.imageBrief && typeof s.imageBrief[lastImageBrief] === 'string') { s.imageBrief[lastImageBrief] += '\n' + line; continue; }
      if (last && typeof s[last] === 'string') { s[last] += '\n' + ((s.layout === 'kodforklaring' || s.layout === 'kodskrivning') && last === 'text' ? raw : line); continue; }
      if (!s.title && s.layout !== 'quote') { s.title = line; last = 'title'; continue; }
      if (!s.text) { s.text = line; last = 'text'; continue; }
      s.text += '\n' + line;
    }
    if (rows.length) {
      s.table = Object.assign({ header: true, reveal: 'none' }, s.table || {}, { rows });
      if (s.layout !== 'table' && s.layout !== 'egen') s.layout = 'table';
    } else if (s.layout === 'table') s.table = Object.assign({ header: true, reveal: 'none', rows: [['', ''], ['', '']] }, s.table || {});
    if (notes.length) s.notes = notes.join('\n').replace(/^\n+|\n+$/g, '');
    if (STEPPED.includes(s.layout) && s.steps == null) s.steps = true;
    return s;
  }

  /* ---------- fria lager: @typ x y bredd höjd nyckel=värde … | text ---------- */
  const LTYPES = ['text', 'bild', 'form', 'cirkel', 'pil', 'markering'];
  const LKEYS = { storlek: 'size', färg: 'color', typsnitt: 'font', vinkel: 'rot', justering: 'align', bakgrund: 'fill', rörelse: 'anim', passning: 'fit', linje: 'stroke', alt: 'alt' };
  const LKEYS_OUT = Object.fromEntries(Object.entries(LKEYS).map(([k, v]) => [v, k]));
  function parseLayer(line) {
    const m = line.match(/^@(\S+)\s+(-?\d+)\s+(-?\d+)\s+(\d+)\s+(\d+)([^|]*)(?:\|\s?(.*))?$/);
    if (!m) return null;
    const type = LTYPES.includes(m[1].toLowerCase()) ? m[1].toLowerCase() : 'text';
    const l = { id: Math.random().toString(36).slice(2, 9), type, x: +m[2], y: +m[3], w: +m[4], h: +m[5] };
    (m[6] || '').trim().split(/\s+/).filter(Boolean).forEach(tok => {
      const kv = tok.split('=');
      if (kv.length === 1) { if (/^steg$/i.test(tok)) l.step = true; else if (/^fet$/i.test(tok)) l.bold = true; return; }
      const k = LKEYS[kv[0].toLowerCase()]; if (!k) return;
      let v = kv.slice(1).join('=');
      if (k === 'size' || k === 'rot' || k === 'stroke') v = +v;
      if (k === 'anim') v = enumVal(Scen.BODY_ANIMS, v.replace(/-/g, ' ')) || 'fade';
      l[k] = v;
    });
    const rest = (m[7] || '').replace(/\\n/g, '\n');
    if (type === 'bild') { const x = rest.trim(); l.src = !x ? '' : (/^(img:|data:)/.test(x) ? x : 'img:' + x); }
    else if (type === 'text') l.text = rest;
    return l;
  }
  function layerLine(l) {
    const parts = ['@' + (l.type || 'text'), Math.round(+l.x || 0), Math.round(+l.y || 0), Math.round(+l.w || 0), Math.round(+l.h || 0)];
    ['size', 'color', 'font', 'rot', 'align', 'fill', 'anim', 'fit', 'stroke'].forEach(k => {
      if (l[k] == null || l[k] === '' || l[k] === 0 || (k === 'anim' && l[k] === 'fade')) return;
      let v = l[k]; if (k === 'anim') v = String(Scen.BODY_ANIMS[v] || v).toLowerCase().replace(/\s+/g, '-');
      parts.push(LKEYS_OUT[k] + '=' + v);
    });
    if (l.bold) parts.push('fet');
    if (l.step) parts.push('steg');
    let out = parts.join(' ');
    if (l.type === 'bild') out += ' | ' + (String(l.src || '').startsWith('img:') ? l.src.slice(4) : '');
    else if ((l.type || 'text') === 'text') out += ' | ' + String(l.text || '').replace(/\n/g, '\\n');
    return out;
  }
  const val = v => String(v == null ? '' : v).trim();
  const multi = v => val(v).replace(/\n/g, '\n');
  function stringifySlide(s, deck) {
    const L = s.layout || 'bullets';
    const out = [];
    const tag = TAG_OF[L] || 'punkter';
    out.push(L === 'egen' ? `[egen: ${s.tpl || ''}]` : `[${tag}]`);
    const put = (field, v) => { if (v == null || val(v) === '') return; out.push(`${OUT_KEY[field]}: ${multi(v)}`); };
    put('caption', s.caption);
    if (L !== 'quote') put('title', s.title);
    if (L === 'skiften') { put('start', s.start); put('end', s.end); }
    if (L === 'prisma') put('question', s.question);
    if (L === 'verkningar') { put('cause', s.cause); put('effect', s.effect); }
    if (L === 'belagg') put('source', s.source);
    if (L === 'formel') { if (s.text != null && val(s.text) !== '') out.push(`formel: ${multi(s.text)}`); } else put('text', s.text);
    if (L === 'prisma' || L === 'sammanflode') { put('common', s.common); put('tension', s.tension); }
    if (L === 'verkningar') { put('condition', s.condition); put('alternative', s.alternative); }
    if (L === 'belagg') { put('whole', s.whole); put('reservation', s.reservation); }
    if (L === 'sammanflode') put('synthesis', s.synthesis);
    if (['spegel', 'ordpar', 'spektrum', 'livslopp', 'lexikon', 'graf', 'trad', 'flode', 'urval', 'rad', 'rutor', 'remsor', 'mosaik', 'karna', 'forgrening', 'inzoomning', 'fyrfalt', 'vagskal', 'sokning', 'rutnat', 'ko', 'formel'].includes(L)) put('conclusion', s.conclusion);
    if (L === 'livslopp') put('scale', s.scale);
    if (L === 'ordpar' || L === 'spektrum') { put('lt', s.lt); put('rt', s.rt); }
    if (L === 'rad' && s.flow) out.push('flöde: ja');
    if (L === 'urval') put('reservation', s.reservation);
    if (['number', 'omslag', 'båge', 'lins', 'mätare', 'ljustal'].includes(L)) put('number', s.number);
    if (L === 'mätare' || L === 'ljustal') put('max', s.max);
    if (L === 'bro' || L === 'vagval' || L === 'urval' || L === 'vagskal') { put('lt', s.lt); put('rt', s.rt); }
    if (L === 'bro') put('ret', s.ret);
    if (L === 'karta') put('active', s.active);
    if (L === 'reflect') put('minutes', s.minutes);
    if (L === 'define') put('example', s.example);
    if (L === 'question' || L === 'poll' || L === 'egen') put('answer', s.answer);
    if (s.image) out.push(`bild: ${String(s.image).startsWith('img:') ? s.image.slice(4) : '(inbäddad bild)'}`);
    if (s.image && s.alt) put('alt', s.alt);
    if (L === 'bildregi' && s.imageDirection) Object.entries(IMAGE_DIRECTION_OUT).forEach(([field,label]) => {
      const v=s.imageDirection[field]; if(v==null||v==='') return; out.push(`${label}: ${Array.isArray(v)?v.join(' '):v}`);
    });
    if ((L === 'ordbild' || L === 'bildfält') && s.imageDirection && Array.isArray(s.imageDirection.focus) && s.imageDirection.focus.length) out.push(`fokuspunkt: ${s.imageDirection.focus.join(' ')}`);
    if (L === 'bildregi' && s.imageBrief) Object.entries(IMAGE_BRIEF_OUT).forEach(([field,label]) => {
      const v=s.imageBrief[field]; if(v==null||val(v)==='') return; out.push(`${label}: ${multi(v)}`);
    });
    if ((L === 'cards' || L === 'motsats') && s.banner) out.push('band: ja');
    if (['split', 'cards', 'motsats', 'bildkant', 'bildfält'].includes(L) && s.flip) out.push('bild-vänster: ja');
    if (L === 'table' && s.table) {
      if (s.table.header === false) out.push('rubrikrad: nej');
      if (s.table.reveal && s.table.reveal !== 'none') out.push(`visa: ${REVEAL_OUT[s.table.reveal]}`);
    }
    const lab = (map, v) => (map[v] || v).toLowerCase();
    if (s.transition && s.transition !== 'auto') out.push(`övergång: ${lab(Scen.TRANSITIONS, s.transition)}`);
    if (s.bg && s.bg !== 'none') out.push(`bakgrund: ${lab(Scen.BACKGROUNDS, s.bg)}`);
    if (s.ta && s.ta !== 'auto') out.push(`rubrikrörelse: ${lab(Scen.TITLE_ANIMS, s.ta)}`);
    if (s.ba && s.ba !== 'auto') out.push(`rörelse: ${lab(Scen.BODY_ANIMS, s.ba)}`);
    if (STEPPED.includes(L) && s.steps === false) out.push('steg: nej');
    if (s.accent && Scen.ACCENTS[s.accent]) out.push('accent: '+Scen.ACCENTS[s.accent][2].toLowerCase());
    if (s.focus && Scen.FOCUS_STYLES[s.focus]) out.push(`fokus: ${lab(Scen.FOCUS_STYLES,s.focus)}`);
    if (s.dim) out.push('tona: ja');
    else if (s.dim === false && ['bro','etapper','vagval','lager','resonemang','helhet','skiften','prisma','verkningar','belagg','sammanflode'].includes(L)) out.push('tona: nej');
    const list = (arr) => Scen.lines(arr).forEach(t => { t = String(t).split(String.fromCharCode(10)).join('\\\\n'); const d = (t.match(/^(- )+/) || [''])[0].length / 2; out.push('  '.repeat(d) + '- ' + t.slice(d * 2)); });
    if (L === 'compare') {
      out.push(`vänster: ${val(s.lt)}`); list(s.lb);
      out.push(`höger: ${val(s.rt)}`); list(s.rb);
    } else {
      const f = LIST_FIELD[L];
      if (f) list(L === 'egen' ? (Scen.lines(s.items).length ? s.items : s.bullets) : s[f]);
    }
    if (L === 'table' && s.table && s.table.rows) s.table.rows.forEach(r => out.push('| ' + r.map(c => String(c == null ? '' : c).replace(/\|/g, '/').replace(/\n/g, '\\n')).join(' | ') + ' |'));
    (s.layers || []).forEach(l => out.push(layerLine(l)));
    if (s.notes) String(s.notes).split('\n').forEach(n => out.push(n ? '> ' + n : '>'));
    return out.join('\n');
  }
  function stringify(deck) {
    const t = deck.theme || {};
    const head = ['---', `titel: ${deck.title || ''}`];
    if (deck.course) head.push(`kurs: ${deck.course}`);
    head.push(`tema: ${t.id || 'scen'}`);
    if (t.accent && t.accent !== 'auto' && (t.id || 'scen') === 'scen') head.push(`färg: ${t.accent}`);
    if ((t.id || 'scen') === 'scen' && t.look && t.look !== 'auto') head.push(`läge: ${t.look === 'dark' ? 'mörkt' : 'ljust'}`);
    head.push('---');
    return head.join('\n') + '\n\n' + deck.slides.map(s => stringifySlide(s, deck)).join('\n\n---\n\n') + '\n';
  }
  function applyMeta(deck, meta) {
    if (meta['titel']) deck.title = meta['titel'];
    if (meta['kurs']) deck.course = meta['kurs']; else delete deck.course;
    deck.theme = Object.assign({}, deck.theme || {});
    if (meta['tema']) deck.theme.id = themeId(meta['tema']);
    if (meta['färg']) deck.theme.accent = accentId(meta['färg']);
    if (meta['läge']) deck.theme.look = /mörk|dark/i.test(meta['läge']) ? 'dark' : /ljus|light/i.test(meta['läge']) ? 'light' : 'auto';
    return deck;
  }
  /* Vilken bild markören står i */
  function slideAt(text, pos) {
    const src = String(text);
    const fm = src.match(/^\s*---\n[\s\S]*?\n---\s*\n/);
    const start = fm ? fm[0].length : 0;
    if (pos <= start) return 0;
    return (src.slice(start, pos).match(/\n\s*---\s*\n/g) || []).length;
  }

  /* ---------- mallkatalogen: läses av dig och av Claude ---------- */
  const CATALOG = [
{"l": "etapper", "cat": "Redaktionellt", "syfte": "En process i tre eller fyra etapper. Rubrikerna följer en stigande ordning, utan att höjden representerar mätdata.", "undvik": "Högst fyra steg. Använd inte för jämförelser mellan likvärdiga alternativ.", "ex": "[etapper]\nrubrik: Från fråga till insikt\netikett: Process\nfokus: mjuk\n- Fråga | Formulera vad vi vill förstå.\n- Undersöka | Samla det som kan ge svar.\n- Förstå | Dra en välgrundad slutsats."},
{"l": "vagval", "cat": "Redaktionellt", "syfte": "Två alternativ jämförs kriterium för kriterium. Varje klick visar båda sidor av samma rad.", "undvik": "Högst fyra kriterier. Varje rad skrivs kriterium | vänster | höger.", "ex": "[vägval]\nrubrik: Två vägar framåt\nvänster: Självständigt\nhöger: Tillsammans\nfokus: mjuk\n- Tempo | Egen rytm | Gemensam takt\n- Perspektiv | Egen fördjupning | Flera synsätt\n- Återkoppling | Egen kontroll | Löpande samtal"},
{"l": "lager", "cat": "Redaktionellt", "syfte": "Går från övergripande sammanhang till en konkret kärna. Tre indragna nivåer blir synliga i ordning.", "undvik": "Högst tre nivåer. Använd bara när det finns en faktisk hierarki eller fördjupning.", "ex": "[lager]\nrubrik: Från helhet till detalj\nfokus: mjuk\n- Sammanhang | Varför spelar frågan roll?\n- Princip | Vad är det som styr?\n- Tillämpning | Hur använder vi principen?"},
{"l": "resonemang", "cat": "Redaktionellt", "syfte": "Ett resonemang byggs i vänsterkolumnen och landar i en tydlig slutsats till höger.", "undvik": "Högst tre led. Slutsatsen ska stödjas av innehållet.", "ex": "[resonemang]\nrubrik: Gör tankegången synlig\nfokus: mjuk\n- Iakttagelse | Vad kan vi faktiskt se?\n- Tolkning | Hur kan det förklaras?\n- Prövning | Håller förklaringen?\ntext: En slutsats som går att följa."},
{"l": "helhet", "cat": "Redaktionellt", "syfte": "Fyra delar i en asymmetrisk helhetsbild. Den första får mer plats, därefter tre kompletterande perspektiv.", "undvik": "Fyra delar rekommenderas. Första delen får större visuell vikt; ytorna representerar inga mängder.", "ex": "[helhet]\nrubrik: Det som håller ihop arbetet\nfokus: mjuk\n- Riktning | Vad vill vi uppnå?\n- Människor | Vilka behöver vara med?\n- Arbetssätt | Hur tar vi oss framåt?\n- Uppföljning | Hur vet vi att det fungerar?"},
{"l": "skiften", "cat": "Analys", "syfte": "En kronologi där varje brytpunkt kopplas till en uttrycklig förändring. Tidigare skiften ligger kvar som nedtonad kontext medan fokus flyttas framåt.", "undvik": "Vanliga händelselistor utan tydliga förändringar; använd tidslinje i stället. Högst sex brytpunkter.", "ex": "[skiften]\netikett: Utveckling\nrubrik: När spelreglerna förändras\nstart: Ett stabilt utgångsläge\nslut: Ett nytt sätt att arbeta\n- Fas 1 | Ett behov blir synligt | Frågan får högre prioritet\n- Fas 2 | Ett beslut fattas | Resurser och ansvar flyttas\n- Fas 3 | Ett nytt arbetssätt införs | Resultaten kan följas på ett annat sätt\nslutsats: Varje skifte ändrar villkoren för det som följer."},
{"l": "prisma", "cat": "Analys", "syfte": "Tre till fem perspektiv betraktar samma fråga från olika riktningar. Det gemensamma analysobjektet ligger stabilt i centrum.", "undvik": "Binära jämförelser; använd vägval eller motsats. Undvik också perspektiv som saknar parallell struktur eller tydlig grund.", "ex": "[prisma]\netikett: Perspektiv\nrubrik: Samma fråga, olika blickar\nfråga: Hur bör förändringen bedömas?\n- Användare | Begriplighet | Utgår från vardaglig användning\n- Verksamhet | Genomförbarhet | Utgår från tid och resurser\n- Teknik | Hållbarhet | Utgår från drift och vidareutveckling\ngemensamt: Alla försöker lösa samma grundproblem.\nspänning: De värderar kortsiktig enkelhet och långsiktig robusthet olika."},
{"l": "verkningar", "cat": "Analys", "syfte": "En explicit kausal bana från orsak genom mekanismer till konsekvens. Villkor och alternativa förklaringar kan kvalificera sambandet.", "undvik": "Tidsföljd eller korrelation utan belagd mekanism. Högst tre mekanismer på samma bild.", "ex": "[verkningar]\netikett: Orsak och konsekvens\nrubrik: Hur en förändring fortplantas\norsak: En central förutsättning ändras\n- Första mekanismen | Systemets balans rubbas\n- Andra mekanismen | Aktörerna anpassar sitt beteende\nkonsekvens: Ett nytt stabilt läge uppstår\nvillkor: Sambandet gäller när övriga faktorer är ungefär oförändrade.\nalternativ: En parallell faktor kan också bidra."},
{"l": "belagg", "cat": "Analys", "syfte": "Ett källutdrag ligger kvar som scenens ankare medan exakta textställen kopplas till iakttagelser och avgränsade tolkningar.", "undvik": "Långa dokument, obelagda citat eller analyser där utdraget inte återfinns ordagrant i källtexten. Högst tre utdrag.", "ex": "[belägg]\nrubrik: Från formulering till tolkning\nkälla: Exempelkälla\ntext: Vi behöver ändra riktning nu, innan möjligheten går förlorad.\n- ändra riktning | Ett handlingskrav uttrycks | Nuläget framställs som otillräckligt\n- innan möjligheten går förlorad | Tidspress byggs upp | Brådska används för att stärka argumentet\nhelhet: Formuleringen kombinerar krav och tidspress.\nreservation: Texten visar retoriken, inte om hotet är verkligt."},
{"l": "sammanflode", "cat": "Analys", "syfte": "Tre till fem bidrag förenas till en ny syntes. Gemensam grund, kvarvarande spänning och slutlig syntes är separata delar av resonemanget.", "undvik": "En vanlig premisslista med given slutsats; använd triad eller samband. Syntesen måste omformulera bidragen och får inte dölja verklig oenighet.", "ex": "[sammanflöde]\netikett: Syntes\nrubrik: Ett beslut med flera krav\n- Användare | Behöver enkelhet och tydlighet\n- Verksamhet | Behöver hållbar ekonomi\n- Teknik | Behöver robust drift\ngemensamt: Lösningen måste fungera över tid.\nspänning: Snabb leverans står mot långsiktig kvalitet.\nsyntes: Välj den minsta lösning som kan växa utan att byggas om."},
{"l": "lameller", "cat": "Struktur", "syfte": "En bildöppning där sju lameller lämnar scenen i olika riktningar.", "undvik": "Långa rubriker; håll dig till ungefär sex ord.", "ex": "[lameller]\netikett: Scen / Signatur 01\nrubrik: Ge idén\n  hela scenen.\ntext: En öppning med riktning, rytm och luft.\nbild: bilder/ai-agenter/ai01.jpg"},
{"l": "register", "cat": "Signatur", "syfte": "Ett horisontellt register där aktuell panel vidgas vid varje klick.", "undvik": "Fler än fem paneler eller långa panelrubriker.", "ex": "[register]\nrubrik: Tre perspektiv. En fråga.\n- Upptäck | Vad ser vi? Börja med det som går att observera.\n- Tolka | Vilka förklaringar passar våra observationer?\n- Pröva | Vad skulle kunna visa att vår tolkning är fel?"},
{"l": "samband", "cat": "Signatur", "syfte": "Premisser binds till en gemensam slutsats med ritade förbindelser.", "undvik": "Fler än fyra premisser; ett samband är inte automatiskt ett bevis.", "ex": "[samband]\nrubrik: Vad behöver en agent?\netikett: Tillsammans\n- Observation | Information om omgivningen.\n- Mål | Något att försöka uppnå.\n- Handling | Ett sätt att påverka omgivningen.\ntext: En återkopplande process."},
{"l": "marginal", "cat": "Signatur", "syfte": "Stor bild och marginalanteckningar som vecklas fram med tunna linjer.", "undvik": "Fler än tre anteckningar. Linjerna är redaktionella, inte exakta mätmarkörer.", "ex": "[marginal]\nrubrik: Läs rörelsen.\nbild: bilder/kastrorelse/parabel.svg\n- Horisontellt | Konstant hastighet när luftmotståndet försummas.\n- Vertikalt | Tyngdkraften ändrar hastigheten.\n- Tillsammans | Rörelserna ger en parabel."},
{"l": "sats", "cat": "Signatur", "syfte": "Två eller tre termer med förklaringar och en avslutande slutsats.", "undvik": "Långa formler. Exemplet antar start i origo och försummar luftmotstånd.", "ex": "[sats]\nrubrik: Två rörelser. En bana.\n- x(t) = v_{0x}t | Jämn rörelse horisontellt.\n- y(t) = v_{0y}t − gt^2/2 | Konstant acceleration vertikalt.\ntext: Samma tid t binder ihop rörelserna."},
    { l: 'title', cat: 'Struktur', syfte: 'Öppning eller avslutning. Stor rubrik, underrubrik och en rad med namn eller datum. Bild i högerkanten om du vill.', undvik: 'Mitt i presentationen. Använd avsnitt i stället.',
      ex: '[titel]\nrubrik: Källkritik i AI-åldern\ntext: Hur vet vi vad som är sant när texter och bilder kan skapas på sekunder?\netikett: Samhällskunskap 1b · vecka 38\nbakgrund: nätverk' },
    { l: 'section', cat: 'Struktur', syfte: 'Avsnittsbyte. Kort etikett och stor rubrik som visar var i lektionen ni är.', undvik: 'När rubriken är en hel mening. Använd påstående.',
      ex: '[avsnitt]\netikett: Del 2\nrubrik: Så fungerar en språkmodell\nbakgrund: vektorfält' },
    { l: 'statement', cat: 'Struktur', syfte: 'En mening som ska fastna. Markera nyckelord med **fetstil**.', undvik: 'Mer än en idé. Dela upp på flera bilder.',
      ex: '[påstående]\netikett: Viktigt\nrubrik: En språkmodell förutsäger nästa ord. Den **vet** ingenting.' },
    { l: 'bullets', cat: 'Listor och steg', syfte: 'Tre till sex punkter som visas en i taget. Underpunkter med indrag.', undvik: 'När punkterna har rubrik och förklaring. Använd kort.',
      ex: '[punkter]\nrubrik: Innan du litar på en källa\n- Vem står bakom?\n- När publicerades den?\n- Finns det andra som säger samma sak?\n  - Hitta minst två oberoende källor\ntona: ja' },
    { l: 'cards', cat: 'Listor och steg', syfte: 'Två till sex begrepp med kort förklaring, som kort. Bild bredvid eller som band överst.', undvik: 'Långa texter. Korten ska läsas på ett ögonblick.',
      ex: '[kort]\nrubrik: Tre egenskaper hos en AI-agent\n- Autonomi | Fattar egna beslut\n- Perception | Tar in data om omgivningen\n- Målorientering | Väljer det som bäst når målet' },
    { l: 'timeline', cat: 'Listor och steg', syfte: 'Händelser i tidsordning, eller numrerade steg i en aktivitet.', undvik: 'Mer än sex händelser.',
      ex: '[tidslinje]\nrubrik: AI:s historia i fyra steg\n- 1950 | Turing föreslår sitt test\n- 1997 | Deep Blue slår Kasparov\n- 2012 | Djupinlärning slår igenom\n- 2022 | ChatGPT lanseras' },
    { l: 'split', cat: 'Bild', syfte: 'Text och punkter bredvid en bild. Byt sida med bild-vänster.', undvik: 'När bilden är huvudsaken. Använd helbild.',
      ex: '[text-bild]\nrubrik: Kaströrelse\n- I x-led är farten konstant\n- I y-led verkar g nedåt\n- Banan blir en **parabel**' },
    { l: 'image', cat: 'Bild', syfte: 'En bild som tar hela ytan, med kort rubrik och bildtext.', undvik: 'Bilder med liten upplösning.',
      ex: '[helbild]\nrubrik: Solvarv i Mojaveöknen\netikett: Foto: exempel' },
    { l: 'bildregi', cat: 'Bild', syfte: 'Regisserar en bild som cinematic hero, detaljresa, spotlight/annotation eller kontrollerad mask reveal. Samma bild och komposition bär hela klicksekvensen.', undvik: 'Dekorativa zoomar utan kommunikativ funktion. Använd inte bild när typografi, diagram eller whitespace är tydligare.',
      ex: '[bildregi]\nrubrik: Från helhet till avgörande detalj\nbild: bilder/ai-agenter/ai10.jpg\nbildläge: detalj\nstartutsnitt: 50 50 1\nslututsnitt: 58 46 1.08\nsäker-yta: 5 12 38 72\n- robot | Rörelsen | 67 | 34 | 16 | 34 | Figuren bär scenens handling.' },
    { l: 'terminal', cat: 'Textregi', syfte: 'Regisserar en trovärdig terminalberättelse där kommando, output, fel, resultat och annotation har separata semantiska roller. Kommandon kan skrivas fram när skrivandet bär betydelse.', undvik: 'Hackerestetik, dekorativ skrivmaskinseffekt eller fler än sex terminalhändelser på samma scen.',
      ex: '[terminal]\netikett: RELEASE / 02\nrubrik: Från kommando till bevis\n- kommando | npm run bygg | Någon skriver faktiskt kommandot.\n- output | dist/scen.html 426 kB | Artefakten har skapats.\n- success | ✓ Bygg klar | Resultatet får fokus.\n- kommando | git status --short | Nästa fråga är om arbetsytan är ren.\n- output | (ingen output) | Tystnaden är själva resultatet.' },
    { l: 'kodforklaring', cat: 'Textregi', syfte: 'Etablerar ett stabilt kodblock och flyttar sedan fokus mellan relevanta rader eller uttryck med annotation och resultat.', undvik: 'Mer än cirka tolv kodrader, flera fokusområden på samma rad eller kod som kräver horisontell scrollning.',
      ex: '[kodförklaring]\netikett: REDUCER\nrubrik: En rad förändrar tillståndet\ntext: function add(total, value) {\n  return total + value;\n}\n- 2 | total + value | Uttrycket skapar nästa ackumulerade värde. | 12 + 5 = 17\n- 1 | add | Funktionen namnger operationen. | Ett nytt totalvärde returneras.' },
    { l: 'kodskrivning', cat: 'Textregi', syfte: 'Koden skrivs fram i ett terminalfönster, tecken för tecken och rad för rad, med en blinkande markör och färgade nyckelord. Ett klick under skrivningen visar hela koden direkt. Med takt: rad skriver varje klick en rad i stället. Därefter lyfter klicken fram rader och uttryck, övriga rader tonas ned och en förklaring kopplas till raden. Varje markering skrivs radnummer, uttryck, förklaring och ett valfritt resultat. Skriv gammalt -> nytt som uttryck för att byta ut det i det klicket, till exempel för att visa hur en variant skiljer sig. Det nya står kvar efteråt.', undvik: 'Mer än cirka 20 rader eller tomma rader i koden. När koden redan är känd och bara ska förklaras (använd kodförklaring).',
      ex: '[kodskrivning]\netikett: Programmering\nrubrik: En loop som summerar\ntext: def summa(tal):\n    total = 0\n    for x in tal:\n        total = total + x\n    return total\n- 3 | for x in tal | Loopen går igenom varje tal i listan.\n- 4 | total + x | Varje varv lägger till nästa tal. | 0 + 3 + 5 = 8\n- 5 | total -> total / len(tal) | Delar vi med antalet tal blir det medelvärdet i stället.' },
    { l: 'formel', cat: 'Textregi', syfte: 'En formel eller ett uttryck i stor text, som delas upp term för term. Varje klick tänder en term i sin egen färg och visar förklaringen under formeln, medan resten tonas ned. Tända termer behåller färgen, så sambandet byggs upp. Termerna får färg i tur och ordning: den första orange (accent 2), den andra i accentfärgen, den tredje i textfärgen. Sista klicket visar hela formeln i färg med slutsatsen.', undvik: 'Mer än fem termer eller formler som inte ryms på en rad. Termer som bara är ett tecken som också finns tidigare i formeln.',
      ex: '[formel]\netikett: Fysik\nrubrik: Newtons andra lag\nformel: F = m · a\nslutsats: Samma kraft ger mindre acceleration när massan är större.\n- F | Den totala kraften på föremålet, i newton.\n- m | Föremålets massa, i kilogram.\n- a | Accelerationen, i meter per sekund i kvadrat.' },
    { l: 'typografisk', cat: 'Textregi', syfte: 'Låter en stor mening bära hela scenen och förändras genom fokus, ersättning eller precisering med mycket whitespace.', undvik: 'Vanliga rubriker, långa stycken eller transformationer där formuleringens betydelse inte förändras.',
      ex: '[typografi]\netikett: STATEMENT\n- statement | Verktyget är inte poängen. | Etablering\n- focus | **Omdömet** är poängen. | Fokus\n- precisering | Verktyget förstärker **omdömet**. | Precisering' },
    { l: 'texttempo', cat: 'Textregi', syfte: 'Bygger ett resonemang genom kontrollerad typografisk pacing: påstående, kontrast, avslöjande och slutsats får egna kommunikativa klick.', undvik: 'Att dela upp text enbart för att skapa fler klick. Varje steg måste ändra betydelse, tempo eller slutsats.',
      ex: '[texttempo]\netikett: PACING\n- statement | AI kan lösa uppgiften. | Påstående\n- contrast | AI kan lösa uppgiften. **Men inte på det sätt vi tänkte.** | Kontrast\n- conclusion | Förmågan förändras. **Ansvaret består.** | Slutsats' },
    { l: 'compare', cat: 'Data', syfte: 'Två sidor mot varandra: för och emot, före och efter.', undvik: 'Mer än två alternativ. Använd kort.',
      ex: '[jämförelse]\nrubrik: Sökmotor eller språkmodell?\nvänster: Sökmotor\n- Hittar befintliga sidor\n- Visar källan\nhöger: Språkmodell\n- Skriver ny text\n- Kan hitta på' },
    { l: 'table', cat: 'Data', syfte: 'Tabell, gärna som övning där facit klickas fram rad för rad.', undvik: 'Tabeller med fler än åtta rader.',
      ex: '[tabell]\nrubrik: Klassificera miljön\nvisa: facit-rader\n| Uppgift | Observerbar | Agenter |\n| Schack | Fullt | Multi |\n| Poker | Partiellt | Multi |' },
    { l: 'number', cat: 'Data', syfte: 'Ett tal som räknas upp, med förklaring.', undvik: 'När talet behöver jämföras. Använd två tal.',
      ex: '[tal]\nrubrik: Så många elever har testat AI i skolarbetet\ntal: 7 av 10\ntext: Exempelsiffra. Byt mot er egen enkät.' },
    { l: 'duo', cat: 'Data', syfte: 'Två eller tre tal bredvid varandra som ska jämföras.', undvik: 'Fler än tre tal.',
      ex: '[två-tal]\nrubrik: Före och efter\n- 12 min | läste eleverna i snitt\n- 31 min | efter läsprojektet\ntext: Exempeldata.' },
    { l: 'quote', cat: 'Struktur', syfte: 'Ett citat med källa.', undvik: 'Citat utan tydlig källa.',
      ex: '[citat]\ntext: Den som inte kan tänka själv får andra att tänka åt sig.\netikett: Okänd källa. Byt mot ett citat du kan belägga.' },
    { l: 'question', cat: 'Interaktivt', syfte: 'Fråga med alternativ. Svaret visas på klick.', undvik: 'När klassen ska rösta. Använd omröstning.',
      ex: '[fråga]\nrubrik: Vilken landar först?\n- Kulan som släpps\n- Kulan som kastas\n- Samtidigt\nsvar: Samtidigt. Farten framåt påverkar inte fallet.' },
    { l: 'poll', cat: 'Interaktivt', syfte: 'Omröstning på storskärmen. Räkna händer med tangenterna 1–9 eller klicka på ett alternativ. Markera rätt svar med *.', undvik: 'Öppna frågor. Använd reflektion.',
      ex: '[omröstning]\nrubrik: Kan en språkmodell ljuga?\n- Ja\n- Nej\n- * Den kan ha fel utan att veta om det\nsvar: Den har ingen avsikt, men kan låta säker när den har fel.' },
    { l: 'reflect', cat: 'Interaktivt', syfte: 'Reflektionsfråga med timer. Klicka för att starta tiden. Valfria steg som tänk, par, dela.', undvik: 'Frågor med ett rätt svar.',
      ex: '[reflektion]\nrubrik: När hjälper AI ditt lärande, och när tar den över?\ntid: 3\n- Tänk själv\n- Prata i par\n- Dela med klassen' },
    { l: 'define', cat: 'Struktur', syfte: 'Ett begrepp med definition och ett exempel som visas på klick.', undvik: 'Flera begrepp. Använd kort.',
      ex: '[definition]\netikett: Begrepp\nrubrik: Hallucination\ntext: När en AI-modell påstår något som låter rimligt men är fel.\nexempel: Modellen hittar på en källa som inte finns.' },
    { l: 'chat', cat: 'Interaktivt', syfte: 'Ett AI-samtal som visas replik för replik. Skriv vem | repliken.', undvik: 'Långa svar. Korta ner repliker.',
      ex: '[samtal]\nrubrik: Vad hände här?\n- Elev | Vem vann Nobelpriset i litteratur 2031?\n- AI | Det var den svenska författaren Maja Lind.\n- Elev | Hur vet du det?\n- AI | Jag har inte tillgång till uppgifter om 2031. Svaret var gissat.' }
  ];
  CATALOG.push(
    { l: 'omslag', cat: 'Redaktionellt', from: 'EditorialHero', syfte: 'Tidskriftsomslag för start eller nytt kapitel. Enorm rubrik, liten etikett, kort text, ett stort dekorativt tal i bakgrunden och bild i högerkanten.', undvik: 'Mer än två meningar text.',
      ex: '[omslag]\netikett: Kapitel 2\nrubrik: Miljön styr agenten\ntext: Samma algoritm beter sig olika i olika världar.\ntal: 02' },
    { l: 'karta', cat: 'Redaktionellt', from: 'DimensionMap', syfte: 'Visar ett ramverk som numrerade kort. Sätt aktiv för att markera var i ramverket ni är, och återanvänd kartan som avsnittsbyte.', undvik: 'Mer än åtta delar.',
      ex: '[karta]\nrubrik: Fyra frågor om en källa\n- Vem | Vem står bakom?\n- När | Hur aktuell är den?\n- Varför | Vad vill avsändaren?\n- Hur | Går det att kontrollera?\naktiv: 2' },
    { l: 'triad', cat: 'Redaktionellt', from: 'TriadStatement', syfte: 'Två till fyra premisser som leder fram till en slutsats. Premisserna kommer en i taget och slutsatsen landar stort sist.', undvik: 'När det inte finns någon tydlig slutsats.',
      ex: '[triad]\nrubrik: Varför kunskap spelar roll\n- Frågor | För att ställa bra frågor krävs kunskap.\n- Svar | För att värdera svar krävs kunskap.\nslutsats: AI **förstärker** det du redan kan.' },
    { l: 'motsats', cat: 'Redaktionellt', from: 'SpotlightContrast', syfte: 'Två begrepp mot varandra. Första klicket visar det ena, andra klicket låter det andra ta scenen, tredje visar ett exempel som binder ihop.', undvik: 'Mer än två sidor. Använd kort.',
      ex: '[motsats]\netikett: Dimension 3\nrubrik: Statisk eller dynamisk?\n- Statisk | Förändras bara när agenten agerar.\n- Dynamisk | Förändras hela tiden, oavsett agenten.\n- Exempel | Schack är statiskt, trafiken är dynamisk.' },
    { l: 'bildkant', cat: 'Redaktionellt', from: 'ImageBleed', syfte: 'En bild som spiller ut över kanten i ett hörn, med rubrik och punkter i motsatt hörn. Ger fart åt en bild som annars bara hade stått i en ruta.', undvik: 'Bilder där det viktiga ligger i kanten.',
      ex: '[bildkant]\netikett: Exempel\nrubrik: Kaströrelse\ntext: Två rörelser på en gång.\n- Konstant fart framåt\n- Fritt fall nedåt' }
  );
  CATALOG.push(
    { l: 'båge', cat: 'Banor', syfte: 'Öppning eller kapitelstart. Stora bågar ritas upp över bilden, etiketten glider längs en av dem och en planet rullar in på sin bana. Ett stort konturtal kan ligga i hörnet.', undvik: 'Långa rubriker, över sex ord.',
      ex: '[båge]\netikett: Fysik 1 · Kapitel 3\nrubrik: Kaströrelse\ntext: Två rörelser på en gång: jämn fart framåt och fritt fall nedåt.\ntal: 03' },
    { l: 'omlopp', cat: 'Banor', syfte: 'Ett begrepp i mitten och tre till sex delar som kretsar runt det. Hela banan syns nedtonad från start. Varje klick drar en eker från kärnan till nästa del, tänder den och visar dess förklaring medan de andra ligger kvar dämpade. En del kan ha en egen bild som tredje fält, och med bild: får kärnan en grundbild; då visas delens bild i kärnan när den har fokus. Sista klicket tänder alla delar.', undvik: 'Delar som har en ordning. Använd bro eller tidslinje.',
      ex: '[omlopp]\netikett: Tre egenskaper\nrubrik: AI-agent\n- Autonomi | Fattar egna beslut\n- Perception | Tar in data om omgivningen\n- Målorientering | Väljer det som bäst når målet' },
    { l: 'gradskiva', cat: 'Banor', syfte: 'En skala från ett ytterläge till ett annat. Nålen svänger till varje läge på klick och bågen fylls, medan förklaringen byts i mitten.', undvik: 'Saker utan ordning längs en skala.',
      ex: '[gradskiva]\nrubrik: Hur mycket ser agenten?\n- Inget | Agenten gissar helt i blindo.\n- Delar | Sensorer ger en del av bilden.\n- Allt | Hela miljön är synlig, som i schack.' },
    { l: 'bro', cat: 'Banor', syfte: 'En process som en båge över ett golv. Bågen bär stegen, golvet är sammanhanget de börjar och slutar i. Hela modellen syns från början. Varje klick flyttar fokus ett steg, tidigare steg ligger kvar nedtonade och sista klicket visar helheten igen. Med retur blir bron en loop: resultatet leder längs golvet tillbaka till början, som i återkopplingar, kretslopp och cykler.', undvik: 'Fler än fem hållplatser. Delar utan inbördes ordning, använd kort eller omlopp.',
      ex: '[bro]\nrubrik: En agent arbetar i en loop\nvänster: Miljö\nhöger: Förändrad miljö\nretur: Handlingen förändrar miljön\n- Uppfatta | Sensorer eller annan indata\n- Besluta | Välj en handling\n- Agera | Utför en åtgärd\ntext: Miljön påverkar agenten, och agenten påverkar miljön.' },
    { l: 'rad', cat: 'Fokusvandring', syfte: 'Två till fem kolumner på en scen med stora siffror. Alla syns från början. En ljuskägla glider i sidled till kolumnen du pratar om medan de andra tonas ned, och sista klicket tänder alla. Med flöde: ja fylls en linje under kolumnerna i takt med stegen.', undvik: 'Mer än fem delar eller långa texter i rutorna. Använd rutor när delarna inte har en ordning.',
      ex: '[rad]\netikett: Vetenskaplig metod\nrubrik: Från fråga till slutsats\ntext: Fyra steg som bygger på varandra.\nflöde: ja\n- Fråga | Vad vill vi ta reda på?\n- Hypotes | Vad tror vi, och varför?\n- Undersökning | Hur prövar vi det?\n- Slutsats | Vad visar resultatet?\nslutsats: Slutsatsen leder ofta till en ny fråga.' },
    { l: 'rutor', cat: 'Fokusvandring', syfte: 'Två till sex rutor av matt glas över ett mjukt färgsken, till exempel fyra delar i två rader. Hela rutnätet syns från början. Ett ljus glider bakom glaset till rutan du pratar om, de andra blir suddiga, och sista klicket tänder alla.', undvik: 'Delar som bygger på varandra i en tydlig ordning (använd rad). Mer än sex rutor.',
      ex: '[rutor]\netikett: Källkritik\nrubrik: Fyra frågor till varje källa\ntext: Samma fyra frågor fungerar på en artikel, en bild och ett AI-svar.\n- Äkthet | Är källan det den utger sig för att vara?\n- Tid | När skapades den, och spelar det roll?\n- Beroende | Bygger den på andra källor?\n- Tendens | Vill någon påverka oss?\nslutsats: Ingen fråga räcker ensam. Tillsammans ger de en bedömning.' },
    { l: 'remsor', cat: 'Fokusvandring', syfte: 'Tre till fem rader med nummer, rubrik och förklaring. Ett ljusdrag sveper ned till raden du pratar om, och sista klicket tänder alla. Bra för begrepp med lite längre förklaringar.', undvik: 'Mer än fem band eller förklaringar längre än två rader.',
      ex: '[remsor]\netikett: Demokrati\nrubrik: Tre sätt att fördela makt\n- Lagstiftande | Riksdagen stiftar lagar och beslutar om skatter och statens budget.\n- Verkställande | Regeringen styr landet och genomför riksdagens beslut.\n- Dömande | Domstolarna dömer utifrån lagarna, oberoende av regeringen.\nslutsats: Maktdelningen gör att ingen del ensam kan bestämma allt.' },
    { l: 'mosaik', cat: 'Fokusvandring', syfte: 'En bentogrid: en stor ruta med helheten och två till fyra mindre. Allt börjar i gråskala och färgen tänds i rutan du pratar om, en i taget. Sista klicket ger färg åt alla.', undvik: 'Delar som är lika viktiga (använd rutor). Mer än fem rutor.',
      ex: '[mosaik]\netikett: Ekosystem\nrubrik: Vad ett ekosystem består av\n- Ekosystemet | Alla organismer i ett område och den miljö de lever i, sedda som en helhet.\n- Producenter | Växter som bygger upp energi med hjälp av solljus.\n- Konsumenter | Djur som äter växter eller andra djur.\n- Nedbrytare | Svampar och bakterier som bryter ned döda rester.\nslutsats: Energin flödar genom systemet, medan ämnena går runt i ett kretslopp.' },
    { l: 'karna', cat: 'Fokusvandring', syfte: 'En lysande kärna i mitten och två till fyra delar runt den. Kärnan lyser hela tiden, och en ljusstråle ritas ut till delen du pratar om. Sista klicket tänder alla strålar och visar en slutsats i kärnan.', undvik: 'Delar som inte hänger ihop med ett gemensamt begrepp. Mer än fyra rutor.',
      ex: '[kärna]\netikett: Hållbar utveckling\nrubrik: Tre dimensioner av samma mål\ntext: Hållbar utveckling\n- Ekologisk | Naturens resurser ska räcka även för kommande generationer.\n- Social | Alla människor ska ha goda livsvillkor och inflytande.\n- Ekonomisk | Ekonomin ska kunna växa utan att skada människor eller miljö.\nslutsats: Dimensionerna påverkar varandra.' },
    { l: 'spegel', cat: 'Jämförelse', syfte: 'Två bilder sida vid sida, till exempel två platser, två epoker eller före och efter. Varje klick tänder en sida med en iakttagelse, och en ring kan peka ut en detalj i bilden. Den andra sidan ligger kvar nedtonad. Sista klicket visar båda.', undvik: 'Bilder med olika format eller motiv som inte går att jämföra. Mer än tre iakttagelser per sida.',
      ex: '[spegel]\netikett: Jämförelse\nrubrik: Samma plats, två tider\n- Förr | Torget 1920 | bilder/exempel/torg-1920.jpg\n- Idag | Torget idag | bilder/exempel/torg-idag.jpg\n- vänster: 50 60 | Hästar och kärror | Gatan delas av alla\n- höger: 50 60 | Bilar och cyklar | Gatan är uppdelad\nslutsats: Samma plats, men rörelsen har förändrat den.' },
    { l: 'ordpar', cat: 'Jämförelse', syfte: 'Ord som hör ihop i par: två traditioner, två språk eller före och efter. Alla par syns från början. Varje klick tänder ett par, drar en linje mellan orden och visar en förklaring under.', undvik: 'Långa fraser. Fler än sex par.',
      ex: '[ordpar]\netikett: Språk\nrubrik: Svenska och engelska ord för samma sak\nvänster: Svenska\nhöger: Engelska\n- Dator | Computer | Från latinets computare, att räkna.\n- Tangentbord | Keyboard | Ordet kommer från pianots tangenter.\n- Skärm | Screen | Ursprungligen en skyddande vägg.\nslutsats: Många ord för teknik kommer från äldre saker.' },
    { l: 'spektrum', cat: 'Jämförelse', syfte: 'En skala mellan två ytterlägen där exempel placeras ut. Hela skalan syns från början. En markör glider till exemplet du pratar om. Visar att det finns ett spann, inte bara två motsatser.', undvik: 'Exempel som inte går att placera på samma skala. Fler än sex exempel.',
      ex: '[spektrum]\netikett: Kemi\nrubrik: Från surt till basiskt\nvänster: Surt\nhöger: Basiskt\n- 15 | Citronsaft | pH omkring 2\n- 50 | Rent vatten | pH 7, neutralt\n- 85 | Tvål | pH omkring 10\nslutsats: pH-skalan visar hur surt eller basiskt något är.' },
    { l: 'livslopp', cat: 'Jämförelse', syfte: 'Två eller tre banor på samma tidsaxel, till exempel två liv, två länder eller två processer. En streckad gräns kan markera en brytpunkt. Varje klick tänder en händelse eller gränsen, och läget på axeln visar när något sker.', undvik: 'Händelser utan tidsordning. Fler än fyra händelser per bana.',
      ex: '[livslopp]\netikett: Skolan\nrubrik: Två skolsystem\nskala: 6 år | 10 år | 15 år | 19 år\n- bana: Land A\n- 0 | Skolstart | Vid sex års ålder\n- 70 | Gymnasiet | Ett val efter grundskolan\n- bana: Land B\n- 0 | Skolstart | Vid sex års ålder\n- 30 | Första valet | Eleverna delas upp tidigt\n- gräns: 50 | Tonåren\nslutsats: Var valet ligger i tiden säger något om synen på eleverna.' },
    { l: 'lexikon', cat: 'Begrepp', syfte: 'Ett register med begrepp till vänster och ett stort uppslag till höger. Registret syns hela tiden, en markering glider till begreppet du pratar om och uppslaget visar definition och exempel. Skriv begrepp | definition | exempel, eller begrepp | kategori | definition | exempel.', undvik: 'Fler än åtta begrepp. Långa definitioner.',
      ex: '[lexikon]\netikett: Begrepp\nrubrik: Ord att känna till\n- Fotosyntes | Biologi | Växter bygger socker av koldioxid och vatten med hjälp av ljus. | Bladen är växtens solpaneler.\n- Cellandning | Biologi | Cellerna frigör energi ur socker med hjälp av syre. | Sker i alla levande celler.' },
    { l: 'graf', cat: 'System', syfte: 'Noder och kanter i en fast karta. Hela grafen syns från början. Varje klick lyfter fram noder, kanter, vikter, en enskild nod eller en väg som ritas i färdriktningen. Resten ligger kvar nedtonat, och sista klicket visar helheten med en slutsats.', undvik: 'Fler än tolv noder, eller när ordningen i en process är poängen (använd bro eller etapper). Vikterna är text du skriver själv.',
      ex: '[graf]\netikett: Datastruktur\nrubrik: En graf är noder och kanter\ntext: En graf beskriver saker och hur de hänger ihop.\n- nod: A | 10 20\n- nod: B | 45 5\n- nod: C | 85 30\n- nod: D | 60 90\n- nod: E | 15 80\n- kant: A - B | 4\n- kant: B - C | 3\n- kant: A - E | 2\n- kant: E - D | 6\n- kant: C - D | 2\n- kant: B - D | 7\n- fokus: noder | Noder | Punkterna. De kan vara platser, personer eller tillstånd.\n- fokus: kanter | Kanter | Linjerna visar vilka noder som hör ihop.\n- fokus: vikter | Vikter | Ett värde på varje kant, till exempel avstånd, kostnad eller tid.\n- fokus: A > B > C > D | En väg | Vägen följer kanterna från A till D.\n- fokus: A > E > D | En kortare väg | Samma start och mål, lägre summa.\nslutsats: Med vikter kan vi jämföra vägar och välja den bästa.' },
    { l: 'trad', cat: 'System', syfte: 'Ett träd eller beslutsträd ur en indragen lista. Hela trädet syns från början. Varje klick lyfter fram roten, en nivå, grenarna, löven eller en väg från roten till ett löv, som ritas nedåt gren för gren.', undvik: 'Fler än åtta löv eller fem nivåer. Långa texter i noderna.',
      ex: '[träd]\netikett: Beslutsträd\nrubrik: Ska vi ha lektionen ute?\ntext: Varje fråga delar upp fallen. Varje löv är ett beslut.\n- Regnar det?\n  - Ja: Inne\n  - Nej: Är det kallare än 5 grader?\n    - Ja: Inne\n    - Nej: Ute\n- fokus: rot | Roten | Den första frågan ställs alltid.\n- fokus: grenar | Grenar | Varje gren är ett möjligt svar.\n- fokus: löv | Löv | Löven är de slutliga besluten.\n- fokus: väg Nej > Nej | Ett fall | Uppehåll och 12 grader ger lektion ute.\nslutsats: Samma frågor i samma ordning ger samma beslut varje gång.' },
    { l: 'flode', cat: 'System', syfte: 'Något flödar genom ett system: indata, bearbetning, utdata. En eller två banor genom samma steg. Hela flödet syns nedtonat från början. Varje klick tänder samma steg i alla banor och en markör följer flödet, så att två processer jämförs steg för steg. Ett steg som heter ? blir en stängd låda. Sista klicket visar hela kedjan och slutsatsen.', undvik: 'Fler än två banor eller fem steg per bana. Steg utan inbördes ordning (använd fokus eller kort), eller orsak och verkan med villkor (använd verkningar).',
      ex: '[flöde]\netikett: Två sätt att lösa ett problem\nrubrik: Regler eller exempel?\n- bana: Traditionell programmering\n- Regler | Människan skriver dem\n- Datorn | Följer reglerna\n- Svar | Bara för det reglerna täcker\n- bana: Maskininlärning\n- Data och svar | Många exempel\n- AI:n | Hittar mönstret själv\n- Modell | Kan förutsäga nya fall\nslutsats: Samma mål, omvänd ordning: maskininlärning börjar med exemplen.' },
    { l: 'urval', cat: 'System', syfte: 'En helhet av punkter i två till fyra grupper och ett urval ur den. Först syns helheten, sedan lyfts urvalet fram medan resten ligger kvar nedtonat, sedan den grupp som är mest underrepresenterad. Staplar visar andelarna i helheten och i urvalet. Sista klicket visar helheten igen med slutsatsen.', undvik: 'Andelar som ser ut som verklig statistik utan källa. Skriv källan i reservation, annars står det Illustration. Fler än fyra grupper.',
      ex: '[urval]\netikett: Representativ data\nrubrik: Speglar datan verkligheten?\nvänster: Verkligheten\nhöger: Träningsdatan\n- Grupp A | 50 | 85\n- Grupp B | 50 | 15\nslutsats: En modell blir bäst på det den har sett mest av.' },
    { l: 'inzoomning', cat: 'System', syfte: 'Nivåer inuti varandra, som cirklar. Varje klick zoomar in en nivå: kameran går in i nästa cirkel, den yttre nivån glider ut ur bild men står kvar i stigen till höger, och nivåns förklaring visas. Sista klicket zoomar ut och visar hela vägen med slutsatsen.', undvik: 'Fler än fem nivåer. Saker som ligger bredvid varandra i stället för inuti varandra (använd kort eller omlopp).',
      ex: '[inzoomning]\netikett: Hierarki\nrubrik: Var finns språkmodellerna?\nslutsats: En språkmodell är ett litet, specialiserat hörn av AI.\n- Artificiell intelligens | Datorer som löser uppgifter som kräver intelligens.\n- Maskininlärning | AI som lär sig av data i stället för regler.\n- Djupinlärning | Maskininlärning med neurala nätverk i många lager.\n- Språkmodeller | Djupinlärning tränad på enorma mängder text.' },
    { l: 'fyrfalt', cat: 'System', syfte: 'Två axlar med var sina motpoler och två till åtta saker placerade i fältet. Raderna x: och y: anger axlarnas poler, och varje sak får ett läge med x och y från 0 till 100. Varje klick lyfter en sak: stödlinjer visar var den ligger på båda axlarna, dess fyrdel tonas fram och förklaringen visas till höger. Sista klicket visar hela mönstret.', undvik: 'Placeringar som ser exakta ut utan underlag; säg att det är en uppskattning. Fler än åtta saker eller långa namn.',
      ex: '[fyrfält]\netikett: Prioritera\nrubrik: Vad ska göras först?\nslutsats: Det viktiga som inte är bråttom är lättast att glömma.\n- x: Inte bråttom | Bråttom\n- y: Oviktigt | Viktigt\n- Provet på fredag | 85 90 | Viktigt och bråttom: gör nu.\n- Träna inför loppet | 25 80 | Viktigt men inte bråttom: planera in.\n- Svara på chatten | 80 25 | Bråttom men oviktigt: gör snabbt.\n- Scrolla | 15 10 | Varken eller: skippa.' },
    { l: 'vagskal', cat: 'System', syfte: 'Argument för och emot i en fråga, som vikter i var sin skål. Varje argument har en sida (samma ord som i vänster eller höger) och en vikt från 1 till 3. Varje klick lägger nästa argument i sin skål och balken tippar efter den sammanlagda vikten. Sista klicket visar balansen och slutsatsen.', undvik: 'Fler än tre argument per sida. Vikter som ser ut som fakta: säg att det är en bedömning, gärna klassens egen.',
      ex: '[vågskål]\netikett: Debatt\nrubrik: Ska mobiler vara förbjudna i skolan?\nslutsats: Vikterna är en bedömning. Skulle du väga argumenten annorlunda?\nvänster: För\nhöger: Emot\n- För | Bättre koncentration på lektionerna | 3\n- Emot | Mobilen är ett verktyg i undervisningen | 2\n- För | Mindre nätmobbning under skoldagen | 2\n- Emot | Eleverna behöver lära sig att hantera den | 2' },
    { l: 'sokning', cat: 'System', syfte: 'En sökalgoritm arbetar i ett träd eller en graf, ett steg per klick. Algoritmen räknas fram automatiskt, så ordningen blir alltid rätt. I läget frontier syns algoritmstegen, frontiern (en liggande kö för BFS, en stående stack för DFS), noden som utforskas och de utforskade noderna, och varje steg förklaras i en rad under grafen. Läget vandring följer DFS eller BFS nod för nod med nummer. Läget övning visar upp till tre träd med markerade mål, och ett klick visar utforskningsordningen och nästa vägen. Egna kommentarer kan läggas vid valfritt klick.', undvik: 'Mer än femton noder. Grafer där ordningen inte spelar någon roll (använd graf eller träd).',
      ex: '[sökning]\netikett: Exempel\nrubrik: Hitta en väg från A till E\ntext: Frontiern innehåller de noder som upptäckts men ännu inte utforskats.\nslutsats: Målet är hittat först när noden tas ut ur frontiern.\n- algoritm: bfs\n- mål: E\n- A\n  - B\n    - C\n      - E\n    - D\n      - F\n- not: 6 | C lades i frontiern före D och utforskas därför först.' },
    { l: 'rutnat', cat: 'System', syfte: 'En sökalgoritm i ett rutnät, till exempel en labyrint, en karta eller en spelplan. Rutnätet skrivs som text med # för vägg, punkt för fri ruta, A för start och B för mål. BFS går en nivå per klick som en våg, DFS, girig bäst först och A* en ruta per klick; takt: 3 ger tre rutor per klick. Utforskade rutor färgas, frontiern ringas in och sista klicket ritar vägen. Rutorna kan visa h (Manhattan-avståndet till målet) eller g + h, i samma färger som i formelmallen. Två algoritmer med komma, till exempel algoritm: bfs, dfs, söker bredvid varandra i samma labyrint med var sin räknare, så att de kan jämföras.', undvik: 'Rutnät större än ungefär 14 × 14. Labyrinter utan väg mellan A och B om poängen är vägen.',
      ex: '[rutnät]\netikett: Exempel\nrubrik: BFS i en labyrint\ntext: Vi följer en nivå i taget.\nslutsats: BFS hittar alltid den kortaste vägen.\n- algoritm: bfs\n- .#####\n- ......\n- .##.##\n- .##B##\n- .#..##\n- .#.###\n- A..###' },
    { l: 'ko', cat: 'System', syfte: 'Två eller tre köer sida vid sida, till exempel en FIFO-kö, en stack och en prioritetskö, som får samma element. En kö i taget: först läggs elementen in i ett klick, sedan är varje ut ett klick, medan de andra köerna tonas ned. Det som tas ut hamnar på en rad under kön och står kvar, så att ordningen kan jämföras mellan köerna på slutet. Med takt: samtidigt gör alla köer samma steg på en gång. Varje kö kan visa en kodrad.', undvik: 'Mer än fem element i en kö samtidigt. Mer än tre köer.',
      ex: '[kö]\netikett: Datastrukturer\nrubrik: Tre sätt att köa\ntext: Samma element läggs in i alla tre köerna.\nslutsats: Vilket element som kommer ut beror på kön.\n- kö: fifo | Kön i kassan | Först in, först ut\n- kö: stack | Tallrikstraven | Sist in, först ut\n- kö: prio | Akutmottagningen | Mest akut först\n- in: A 3\n- in: B 1\n- in: C 2\n- ut\n- ut' },
    { l: 'forgrening', cat: 'System', syfte: 'Ett släktträd över tid: en stam och grenar som skjuter ut ur varandra, till exempel kyrkor, språk, arter eller programspråk. Varje gren har ett namn, en tid, grenen den växer ur och en kort text. Tidsaxeln är schematisk, varje förgreningstid får en kolumn. Hela trädet syns nedtonat från början. Varje klick ritar nästa gren i tidsordning och visar dess text längst ner, medan tidigare grenar står kvar. En gren som delas i två vid samma tid slutar där. Sista klicket visar hela trädet med slutsatsen.', undvik: 'Fler än åtta grenar. Långa namn. När exakta avstånd i tid är poängen (använd tidslinje).',
      ex: '[förgrening]\netikett: Språkträd\nrubrik: Hur de nordiska språken skildes åt\nslutsats: Språk som delar förfader liknar varandra än idag.\n- Urnordiska | | | Ett gemensamt språk i hela Norden.\n- Östnordiska | 800-talet | Urnordiska | Språket i Sverige och Danmark.\n- Västnordiska | 800-talet | Urnordiska | Språket i Norge och på Island.\n- Svenska | 1200-talet | Östnordiska | Skiljer sig från danskan.\n- Danska | 1200-talet | Östnordiska | Egen skrift och eget uttal.\n- Isländska | 1400-talet | Västnordiska | Har förändrats minst.' },
    { l: 'ringar', cat: 'Banor', syfte: 'Två eller tre begrepp som delvis överlappar, som ett Venndiagram. Det gemensamma skrivs i mitten och visas sist.', undvik: 'Begrepp som inte har något gemensamt.',
      ex: '[ringar]\nrubrik: Singel eller multi?\n- Singelagent | En agent, ingen koordinering\n- Multiagent | Flera agenter som påverkar varandra\nmitten: Schack mot dator kan ses på båda sätten' },
    { l: 'lins', cat: 'Banor', syfte: 'En bild där en rund lins lyser upp en detalj i taget. Resten är nedtonad. Varje rad: x y i procent | rubrik | text.', undvik: 'Bilder utan tydliga detaljer att peka på.',
      ex: '[lins]\nrubrik: Titta närmare\n- 30 55 | Banan | Bågen är en parabel.\n- 70 50 | Toppen | Här är farten i y-led noll.' },
    { l: 'mätare', cat: 'Banor', syfte: 'Ett tal som andel av något, som en mätare som fylls medan talet räknas upp. Skriv 73 %, 4 av 8 eller ett tal med max.', undvik: 'Tal som inte är en andel.',
      ex: '[mätare]\netikett: Övningen\nrubrik: Partiellt observerbara uppgifter\ntal: 4 av 8\ntext: Poker, trafik, robotdammsugare och diagnos.' }
  );
  CATALOG.push(
    { l: 'ridå', cat: 'Ljus', syfte: 'Öppning eller avslutning. En ridå i bakgrundens färg glider isär med en glödande kant och visar en bild i helformat som sakta zoomar. Rubriken är stor och sitter nere till vänster.', undvik: 'Bilder utan motiv, eller mer än en mening i rubriken.',
      ex: '[ridå]\netikett: Fysik 1\nrubrik: Kaströrelse\ntext: Två rörelser på en gång.' },
    { l: 'strålkastare', cat: 'Ljus', syfte: 'En mening i riktigt stor text där strålkastaren tänder en fras i taget. Hela meningen syns svagt från början, så publiken ser vart du är på väg. Skriv en fras per rad.', undvik: 'Mer än två meningar. Då blir texten för liten.',
      ex: '[strålkastare]\netikett: Vad är en AI-agent?\n- Ett system som\n- uppfattar sin omgivning,\n- fattar beslut\n- och vidtar åtgärder.' },
    { l: 'fokus', cat: 'Ljus', syfte: 'En lista i stor text där bara den aktiva raden är skarp och förklaringen fälls ut under den. De andra ligger kvar suddiga i bakgrunden.', undvik: 'Fler än sju rader, eller långa namn.',
      ex: '[fokus]\netikett: Tre egenskaper\nrubrik: Vad gör en agent till en agent?\n- Autonomi | Kan fatta egna beslut utan direkt mänsklig styrning.\n- Perception | Samlar in data om sin omgivning.\n- Målorientering | Väljer det som bäst når målet.' },
    { l: 'ordbild', cat: 'Ljus', syfte: 'Ett enda ord i jättestor text som är fyllt med en bild som sakta panorerar. Bilden lyser också svagt i bakgrunden. Bra som avsnittsstart.', undvik: 'Långa rubriker och bilder utan kontrast.',
      ex: '[ordbild]\netikett: Del 2\nrubrik: Miljön\ntext: Sex sätt att beskriva världen som agenten lever i.' },
    { l: 'bildfält', cat: 'Ljus', syfte: 'En bild som fyller två tredjedelar av ytan och tonar mjukt in i mörkret, utan kant eller ram. Text och punkter på den mörka sidan.', undvik: 'Mer än fyra punkter.',
      ex: '[bildfält]\netikett: Miljöer\nrubrik: Olika typer av AI-miljöer\ntext: Miljöer kan beskrivas längs flera dimensioner.\n- Vad agenten ser\n- Hur världen förändras' },
    { l: 'delning', cat: 'Ljus', syfte: 'Två motsatser som två stora färgfält, ett mörkt och ett i accentfärg som sveper in. En tredje rad blir ett exempel uppe till höger.', undvik: 'Mer än två sidor. Långa texter i fälten.',
      ex: '[delning]\netikett: Dimension 1\nrubrik: Hur mycket ser agenten?\n- Fullständigt | Agenten ser allt som händer i miljön.\n- Partiellt | Agenten ser bara en del och måste gissa resten.\n- Exempel | Schack är fullständigt, poker är partiellt.' },
    { l: 'ljustal', cat: 'Ljus', syfte: 'Ett stort tal som räknas upp i glödande text. Är talet en andel, som 73 % eller 4 av 8, fylls en tjock stapel under det.', undvik: 'Flera tal på samma bild.',
      ex: '[ljustal]\netikett: Övningen\nrubrik: Partiellt observerbara uppgifter\ntal: 4 av 8\ntext: Poker, trafik, robotdammsugare och diagnos.' }
  );
  CATALOG.push({ l: 'tom', cat: 'Struktur', syfte: 'En tom bild där du placerar text, bilder, former och pilar fritt med fria lager.', undvik: 'När en mall redan passar. Mallar håller ihop utseendet.',
    ex: '[fri]\n@text 144 140 1200 160 storlek=96 typsnitt=rubrik | Fri yta\n@text 144 330 900 200 storlek=40 färg=dampad | Dra, skala och skriv direkt på bilden.\n@cirkel 1260 180 420 420 färg=accent linje=8\n@pil 900 640 380 120 vinkel=-20 steg' });
  CATALOG.forEach(c => { c.tag = TAG_OF[c.l]; c.name = Scen.LAYOUTS[c.l]; });

  const FORMAT = `MANUSFORMAT
En presentation börjar med ett huvud:
---
titel: <presentationens namn>
tema: <scen | djup | bana | nattbana | atlas | natt | tidskrift | kritvit | klassrum | solnedgang | skog | retro>
---
Sedan kommer bilder, åtskilda av en rad med bara ---.
Varje bild börjar med mallens namn inom hakparentes, t.ex. [kort].
Fält skrivs som "nyckel: värde". Listor skrivs med "- ". Underpunkt: två mellanslag före "-".
Kort, tidslinje, samtal och två-tal: "- rubrik | text".
Tabellrader: "| a | b | c |". Första raden är rubrikrad.
Talaranteckningar: rader som börjar med "> ".
Fria lager (valfritt, på vilken bild som helst): "@typ x y bredd höjd nyckel=värde … | text". Typer: text, bild, form, cirkel, pil, markering. Koordinater i pixlar på en yta som är 1920×1080. Nycklar: storlek, färg (text, dampad, accent, accent2, yta), typsnitt=rubrik, bakgrund (yta, accent, markering), vinkel, justering (center, höger), fet, steg (visas på klick). Använd lager sparsamt.
Nycklar: rubrik, text, etikett, svar, exempel, tal, tid (minuter), aktiv (kartans markerade del), slutsats, start, slut, fråga, orsak, konsekvens, villkor, alternativ, källa, helhet, reservation, gemensamt, spänning, syntes, bild, band (ja/nej), bild-vänster (ja/nej), vänster, höger, visa (allt | rader | facit | facit-rader), övergång (automatisk | djup | båge | tona | glid | skjut | stig | zooma | svep | morph | ingen), bakgrund (ingen | fokusljus | ljus | banor | vektorfält | nätverk | vågor; fokusljus följer fokus i scener med klicksteg, de andra rör sig hela tiden och passar på titel- och avsnittsbilder), steg (ja/nej), tona (ja/nej).
Text: **ord** markeras. x^2 eller x^{2} blir upphöjt, v_{0} nedsänkt.`;

  function catalogText(custom) {
    const rows = CATALOG.map(c => `[${c.tag}] ${c.name}. ${c.syfte} Undvik: ${c.undvik}\nExempel:\n${c.ex}`);
    (custom || []).forEach(t => rows.push(`[egen: ${t.id}] ${t.name}. ${t.desc || ''} Fält: rubrik, text, etikett, lista med "- rubrik | text".`));
    return rows.join('\n\n');
  }
  return { parse, stringify, stringifySlide, parseBlock, applyMeta, slideAt, CATALOG, FORMAT, catalogText, TAGS, TAG_OF };
})();
