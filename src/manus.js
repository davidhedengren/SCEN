/* ===== Manus: presentationen som text, och mallkatalogen =====
   Manus.parse(text) -> {meta, slides}   Manus.stringify(deck) -> text   Manus.CATALOG */
const Manus = (() => {
  const TAGS = {"etapper":"etapper","v\u00e4gval":"vagval","lager":"lager","resonemang":"resonemang","helhet":"helhet",lameller: "lameller",register: "register",samband: "samband",marginal: "marginal",sats: "sats",
    titel: 'title', avsnitt: 'section', 'påstående': 'statement', punkter: 'bullets', 'text-bild': 'split', helbild: 'image',
    kort: 'cards', 'jämförelse': 'compare', tabell: 'table', tal: 'number', 'två-tal': 'duo', tidslinje: 'timeline',
    'fråga': 'question', 'omröstning': 'poll', reflektion: 'reflect', definition: 'define', samtal: 'chat', citat: 'quote',
    omslag: 'omslag', karta: 'karta', triad: 'triad', motsats: 'motsats', bildkant: 'bildkant', fri: 'tom', 'båge': 'båge', omlopp: 'omlopp', gradskiva: 'gradskiva', bro: 'bro', ringar: 'ringar', lins: 'lins', 'mätare': 'mätare', 'ridå': 'ridå', 'strålkastare': 'strålkastare', fokus: 'fokus', ordbild: 'ordbild', 'bildfält': 'bildfält', delning: 'delning', ljustal: 'ljustal', egen: 'egen'
  };
  const TAG_OF = Object.fromEntries(Object.entries(TAGS).map(([k, v]) => [v, k]));
  const KEYS = { accent: 'accent',
    rubrik: 'title', 'fråga': 'title', term: 'title', text: 'text', ingress: 'text', underrubrik: 'text', citat: 'text', definition: 'text',
    etikett: 'caption', 'källa': 'caption', bildtext: 'caption', svar: 'answer', exempel: 'example', tal: 'number', tid: 'minutes',
    bild: 'image', alt: 'alt', 'vänster': 'lt', 'höger': 'rt', band: 'banner', 'bild-vänster': 'flip', steg: 'steps', tona: 'dim', fokus: 'focus',
    'övergång': 'transition', bakgrund: 'bg', rubrikrörelse: 'ta', 'rörelse': 'ba', visa: 'reveal', rubrikrad: 'header', mall: 'tpl', aktiv: 'active', siffra: 'number', slutsats: 'text', max: 'max', mitten: 'text'
  };
  const OUT_KEY = { max: 'max', active: 'aktiv', title: 'rubrik', text: 'text', caption: 'etikett', answer: 'svar', example: 'exempel', number: 'tal', minutes: 'tid', image: 'bild', alt: 'alt', lt: 'vänster', rt: 'höger', transition: 'övergång', bg: 'bakgrund', ta: 'rubrikrörelse', ba: 'rörelse', tpl: 'mall' };
  const REVEAL = { allt: 'none', rader: 'rows', facit: 'answers', 'facit-rader': 'rest' };
  const REVEAL_OUT = { none: 'allt', rows: 'rader', answers: 'facit', rest: 'facit-rader' };
  const LIST_FIELD = {etapper:'items',vagval:'items',lager:'items',resonemang:'items',helhet:'items',register:'items',samband:'items',marginal:'items',sats:'items', bullets: 'bullets', split: 'bullets', question: 'bullets', poll: 'bullets', reflect: 'bullets', cards: 'items', timeline: 'items', chat: 'items', duo: 'items', egen: 'items', compare: 'lb', karta: 'items', triad: 'items', motsats: 'items', bildkant: 'bullets', omlopp: 'items', gradskiva: 'items', bro: 'items', ringar: 'items', lins: 'items', 'strålkastare': 'items', fokus: 'items', 'bildfält': 'bullets', delning: 'items' };
  const STEPPED = ["etapper","vagval","lager","resonemang","helhet",'register','samband','marginal','sats','bullets', 'split', 'cards', 'compare', 'timeline', 'chat', 'duo', 'egen', 'karta', 'triad', 'motsats', 'bildkant', 'omlopp', 'gradskiva', 'bro', 'ringar', 'lins', 'strålkastare', 'fokus', 'bildfält', 'delning'];
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
    const notes = [];
    const rows = [];
    for (; i < ls.length; i++) {
      const raw = ls[i];
      const line = raw.trim();
      if (!line) { if (last && typeof s[last] === 'string') last = null; continue; }
      if (line.startsWith('>')) { notes.push(line.replace(/^>\s?/, '')); last = null; continue; }
      if (line.startsWith('@')) { const ly = parseLayer(line); if (ly) (s.layers = s.layers || []).push(ly); last = null; continue; }
      if (line.startsWith('|')) {
        if (/^\|[\s:|-]+\|?$/.test(line)) continue;
        const cells = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim().replace(/\\n/g, '\n'));
        rows.push(cells); last = null; continue;
      }
      const li = raw.match(/^(\s*)[-*•]\s+(.*)$/);
      if (li) {
        const sub = li[1].length >= 2;
        const arr = s[listField] = Array.isArray(s[listField]) ? s[listField] : [];
        arr.push((sub ? '- ' : '') + li[2]);
        last = null; continue;
      }
      const kv = line.match(/^([a-zåäöA-ZÅÄÖ-]+)\s*:\s*(.*)$/);
      const key = kv && KEYS[kv[1].toLowerCase()];
      if (key) {
        const v = kv[2];
        last = null;
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
      if (last && typeof s[last] === 'string') { s[last] += '\n' + line; continue; }
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
    put('text', s.text);
    if (['number', 'omslag', 'båge', 'lins', 'mätare', 'ljustal'].includes(L)) put('number', s.number);
    if (L === 'mätare' || L === 'ljustal') put('max', s.max);
    if (L === 'bro' || L === 'vagval') { put('lt', s.lt); put('rt', s.rt); }
    if (L === 'karta') put('active', s.active);
    if (L === 'reflect') put('minutes', s.minutes);
    if (L === 'define') put('example', s.example);
    if (L === 'question' || L === 'poll' || L === 'egen') put('answer', s.answer);
    if (s.image) out.push(`bild: ${String(s.image).startsWith('img:') ? s.image.slice(4) : '(inbäddad bild)'}`);
    if (s.image && s.alt) put('alt', s.alt);
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
    else if (s.dim === false && ['bro','etapper','vagval','lager','resonemang','helhet'].includes(L)) out.push('tona: nej');
    const list = (arr) => Scen.lines(arr).forEach(t => out.push(/^- /.test(t) ? '  - ' + t.slice(2) : '- ' + t));
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
    const head = ['---', `titel: ${deck.title || ''}`, `tema: ${t.id || 'scen'}`];
    if (t.accent && t.accent !== 'auto' && (t.id || 'scen') === 'scen') head.push(`färg: ${t.accent}`);
    if ((t.id || 'scen') === 'scen' && t.look && t.look !== 'auto') head.push(`läge: ${t.look === 'dark' ? 'mörkt' : 'ljust'}`);
    head.push('---');
    return head.join('\n') + '\n\n' + deck.slides.map(s => stringifySlide(s, deck)).join('\n\n---\n\n') + '\n';
  }
  function applyMeta(deck, meta) {
    if (meta['titel']) deck.title = meta['titel'];
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
    { l: 'omlopp', cat: 'Banor', syfte: 'Ett begrepp i mitten och tre till sex delar som kretsar runt det. Varje del åker in längs banan på klick.', undvik: 'Delar som har en ordning. Använd bro eller tidslinje.',
      ex: '[omlopp]\netikett: Tre egenskaper\nrubrik: AI-agent\n- Autonomi | Fattar egna beslut\n- Perception | Tar in data om omgivningen\n- Målorientering | Väljer det som bäst når målet' },
    { l: 'gradskiva', cat: 'Banor', syfte: 'En skala från ett ytterläge till ett annat. Nålen svänger till varje läge på klick och bågen fylls, medan förklaringen byts i mitten.', undvik: 'Saker utan ordning längs en skala.',
      ex: '[gradskiva]\nrubrik: Hur mycket ser agenten?\n- Inget | Agenten gissar helt i blindo.\n- Delar | Sensorer ger en del av bilden.\n- Allt | Hela miljön är synlig, som i schack.' },
    { l: 'bro', cat: 'Banor', syfte: 'En ren processbana med tydlig typografi, numrerade hållplatser och en accentfärg. En markör följer varje klick. Aktuell rubrik framhävs och tidigare steg tonas ned. Stäng av fokus med tona: nej.', undvik: 'Fler än fem hållplatser.',
      ex: '[bro]\nrubrik: Från omgivning till handling\nvänster: Omgivningen\nhöger: Åtgärd\n- Uppfattar | med sensorer eller data\n- Beslutar | utifrån sitt mål\n- Agerar | med aktuatorer' },
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
Nycklar: rubrik, text, etikett, svar, exempel, tal, tid (minuter), aktiv (kartans markerade del), slutsats (triad), bild, band (ja/nej), bild-vänster (ja/nej), vänster, höger, visa (allt | rader | facit | facit-rader), övergång (automatisk | djup | båge | tona | glid | skjut | stig | zooma | svep | morph | ingen), bakgrund (ingen | ljus | banor | vektorfält | nätverk | vågor), steg (ja/nej), tona (ja/nej).
Text: **ord** markeras. x^2 eller x^{2} blir upphöjt, v_{0} nedsänkt.`;

  function catalogText(custom) {
    const rows = CATALOG.map(c => `[${c.tag}] ${c.name}. ${c.syfte} Undvik: ${c.undvik}\nExempel:\n${c.ex}`);
    (custom || []).forEach(t => rows.push(`[egen: ${t.id}] ${t.name}. ${t.desc || ''} Fält: rubrik, text, etikett, lista med "- rubrik | text".`));
    return rows.join('\n\n');
  }
  return { parse, stringify, stringifySlide, parseBlock, applyMeta, slideAt, CATALOG, FORMAT, catalogText, TAGS, TAG_OF };
})();
