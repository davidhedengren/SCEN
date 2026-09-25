/* ===== Manus: presentationen som text, och mallkatalogen =====
   Manus.parse(text) -> {meta, slides}   Manus.stringify(deck) -> text   Manus.CATALOG */
const Manus = (() => {
  const TAGS = {
    titel: 'title', avsnitt: 'section', 'påstående': 'statement', punkter: 'bullets', 'text-bild': 'split', helbild: 'image',
    kort: 'cards', 'jämförelse': 'compare', tabell: 'table', tal: 'number', 'två-tal': 'duo', tidslinje: 'timeline',
    'fråga': 'question', 'omröstning': 'poll', reflektion: 'reflect', definition: 'define', samtal: 'chat', citat: 'quote',
    omslag: 'omslag', karta: 'karta', triad: 'triad', motsats: 'motsats', bildkant: 'bildkant', egen: 'egen'
  };
  const TAG_OF = Object.fromEntries(Object.entries(TAGS).map(([k, v]) => [v, k]));
  const KEYS = {
    rubrik: 'title', 'fråga': 'title', term: 'title', text: 'text', ingress: 'text', underrubrik: 'text', citat: 'text', definition: 'text',
    etikett: 'caption', 'källa': 'caption', bildtext: 'caption', svar: 'answer', exempel: 'example', tal: 'number', tid: 'minutes',
    bild: 'image', alt: 'alt', 'vänster': 'lt', 'höger': 'rt', band: 'banner', 'bild-vänster': 'flip', steg: 'steps', tona: 'dim',
    'övergång': 'transition', bakgrund: 'bg', rubrikrörelse: 'ta', 'rörelse': 'ba', visa: 'reveal', rubrikrad: 'header', mall: 'tpl', aktiv: 'active', siffra: 'number', slutsats: 'text'
  };
  const OUT_KEY = { active: 'aktiv', title: 'rubrik', text: 'text', caption: 'etikett', answer: 'svar', example: 'exempel', number: 'tal', minutes: 'tid', image: 'bild', alt: 'alt', lt: 'vänster', rt: 'höger', transition: 'övergång', bg: 'bakgrund', ta: 'rubrikrörelse', ba: 'rörelse', tpl: 'mall' };
  const REVEAL = { allt: 'none', rader: 'rows', facit: 'answers', 'facit-rader': 'rest' };
  const REVEAL_OUT = { none: 'allt', rows: 'rader', answers: 'facit', rest: 'facit-rader' };
  const LIST_FIELD = { bullets: 'bullets', split: 'bullets', question: 'bullets', poll: 'bullets', reflect: 'bullets', cards: 'items', timeline: 'items', chat: 'items', duo: 'items', egen: 'items', compare: 'lb', karta: 'items', triad: 'items', motsats: 'items', bildkant: 'bullets' };
  const STEPPED = ['bullets', 'split', 'cards', 'compare', 'timeline', 'chat', 'duo', 'egen', 'karta', 'triad', 'motsats', 'bildkant'];
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
        if (key === 'lt') { s.lt = v; listField = 'lb'; continue; }
        if (key === 'rt') { s.rt = v; listField = 'rb'; continue; }
        if (['banner', 'flip', 'dim'].includes(key)) { s[key] = yes(v); continue; }
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

  const val = v => String(v == null ? '' : v).trim();
  const multi = v => val(v).replace(/\n/g, '\n');
  function stringifySlide(s, deck) {
    const L = s.layout || 'bullets';
    const out = [];
    const tag = TAG_OF[L] || 'punkter';
    out.push(L === 'egen' ? `[egen: ${s.tpl || ''}]` : `[${tag}]`);
    const put = (field, v) => { if (v == null || val(v) === '') return; out.push(`${OUT_KEY[field]}: ${multi(v)}`); };
    put('caption', ['title', 'section', 'statement', 'reflect', 'define', 'image', 'quote', 'egen', 'omslag', 'karta', 'triad', 'motsats', 'bildkant'].includes(L) ? s.caption : null);
    if (L !== 'quote') put('title', s.title);
    put('text', s.text);
    if (L === 'number' || L === 'omslag') put('number', s.number);
    if (L === 'karta') put('active', s.active);
    if (L === 'reflect') put('minutes', s.minutes);
    if (L === 'define') put('example', s.example);
    if (L === 'question' || L === 'poll' || L === 'egen') put('answer', s.answer);
    if (s.image) out.push(`bild: ${String(s.image).startsWith('img:') ? s.image.slice(4) : '(inbäddad bild)'}`);
    if (s.image && s.alt) put('alt', s.alt);
    if ((L === 'cards' || L === 'motsats') && s.banner) out.push('band: ja');
    if (['split', 'cards', 'motsats', 'bildkant'].includes(L) && s.flip) out.push('bild-vänster: ja');
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
    if (s.dim) out.push('tona: ja');
    const list = (arr) => Scen.lines(arr).forEach(t => out.push(/^- /.test(t) ? '  - ' + t.slice(2) : '- ' + t));
    if (L === 'compare') {
      out.push(`vänster: ${val(s.lt)}`); list(s.lb);
      out.push(`höger: ${val(s.rt)}`); list(s.rb);
    } else {
      const f = LIST_FIELD[L];
      if (f) list(L === 'egen' ? (Scen.lines(s.items).length ? s.items : s.bullets) : s[f]);
    }
    if (L === 'table' && s.table && s.table.rows) s.table.rows.forEach(r => out.push('| ' + r.map(c => String(c == null ? '' : c).replace(/\|/g, '/').replace(/\n/g, '\\n')).join(' | ') + ' |'));
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
  CATALOG.forEach(c => { c.tag = TAG_OF[c.l]; c.name = Scen.LAYOUTS[c.l]; });

  const FORMAT = `MANUSFORMAT
En presentation börjar med ett huvud:
---
titel: <presentationens namn>
tema: <scen | atlas | natt | tidskrift | kritvit | klassrum | solnedgang | skog | retro>
---
Sedan kommer bilder, åtskilda av en rad med bara ---.
Varje bild börjar med mallens namn inom hakparentes, t.ex. [kort].
Fält skrivs som "nyckel: värde". Listor skrivs med "- ". Underpunkt: två mellanslag före "-".
Kort, tidslinje, samtal och två-tal: "- rubrik | text".
Tabellrader: "| a | b | c |". Första raden är rubrikrad.
Talaranteckningar: rader som börjar med "> ".
Nycklar: rubrik, text, etikett, svar, exempel, tal, tid (minuter), aktiv (kartans markerade del), slutsats (triad), bild, band (ja/nej), bild-vänster (ja/nej), vänster, höger, visa (allt | rader | facit | facit-rader), övergång (automatisk | tona | glid | skjut | stig | zooma | svep | morph | ingen), bakgrund (ingen | vektorfält | nätverk | vågor), steg (ja/nej), tona (ja/nej).
Text: **ord** markeras. x^2 eller x^{2} blir upphöjt, v_{0} nedsänkt.`;

  function catalogText(custom) {
    const rows = CATALOG.map(c => `[${c.tag}] ${c.name}. ${c.syfte} Undvik: ${c.undvik}\nExempel:\n${c.ex}`);
    (custom || []).forEach(t => rows.push(`[egen: ${t.id}] ${t.name}. ${t.desc || ''} Fält: rubrik, text, etikett, lista med "- rubrik | text".`));
    return rows.join('\n\n');
  }
  return { parse, stringify, stringifySlide, parseBlock, applyMeta, slideAt, CATALOG, FORMAT, catalogText, TAGS, TAG_OF };
})();
