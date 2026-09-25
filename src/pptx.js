/* ===== PPTX-import: läser en PowerPoint-fil i webbläsaren och gör om den till en Scen-presentation ===== */
const PptxImport = (() => {
  const NS = {
    p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
    a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
  };
  const parser = new DOMParser();
  const parse = s => parser.parseFromString(s, 'application/xml');
  const kids = (el, name) => el ? [...el.children].filter(c => c.localName === name) : [];
  const kid = (el, name) => kids(el, name)[0] || null;
  const path = (el, ...names) => names.reduce((e, n) => kid(e, n), el);
  const desc = (el, ns, name) => el ? [...el.getElementsByTagNameNS(NS[ns], name)] : [];
  const rid = () => Math.random().toString(36).slice(2, 10);

  function joinPath(base, target) {
    if (target.startsWith('/')) return target.slice(1);
    const parts = base.split('/'); parts.pop();
    for (const seg of target.split('/')) { if (seg === '..') parts.pop(); else if (seg !== '.' && seg) parts.push(seg); }
    return parts.join('/');
  }
  async function xml(zip, p) { const f = zip.file(p); return f ? parse(await f.async('string')) : null; }
  async function rels(zip, part) {
    const d = part.split('/'); const file = d.pop();
    const doc = await xml(zip, [...d, '_rels', file + '.rels'].join('/'));
    const map = {};
    if (!doc) return map;
    [...doc.getElementsByTagName('Relationship')].forEach(r => {
      map[r.getAttribute('Id')] = { target: r.getAttribute('TargetMode') === 'External' ? null : joinPath(part, r.getAttribute('Target')), type: r.getAttribute('Type') || '' };
    });
    return map;
  }
  function paraText(p) {
    let s = '';
    for (const c of p.children) {
      const n = c.localName;
      if (n === 'r') {
        const t = kid(c, 't'); let txt = t ? t.textContent : '';
        const rPr = kid(c, 'rPr'); const bl = rPr ? +(rPr.getAttribute('baseline') || 0) : 0;
        if (txt.trim() && bl > 0) txt = '^{' + txt + '}'; else if (txt.trim() && bl < 0) txt = '_{' + txt + '}';
        s += txt;
      } else if (n === 'br') s += '\n';
      else if (n === 'fld') { if (!/slidenum/i.test(c.getAttribute('type') || '')) { const t = kid(c, 't'); s += t ? t.textContent : ''; } }
      else if (n === 'm' || n === 'oMathPara' || n === 'oMath') { s += [...c.getElementsByTagName('*')].filter(x => x.localName === 't').map(x => x.textContent).join(''); }
    }
    return s.replace(/\u000b/g, '\n');
  }
  function paras(txBody) {
    return kids(txBody, 'p').map(p => {
      const pPr = kid(p, 'pPr');
      return { t: paraText(p).replace(/[ \t]+/g, ' ').trim(), lvl: pPr ? +(pPr.getAttribute('lvl') || 0) : 0 };
    }).filter(x => x.t);
  }
  function xfrmOf(el) {
    const x = desc(el, 'a', 'xfrm')[0] || [...el.getElementsByTagName('*')].find(e => e.localName === 'xfrm');
    if (!x) return null;
    const off = kid(x, 'off'), ext = kid(x, 'ext');
    if (!off || !ext) return null;
    return { x: +off.getAttribute('x'), y: +off.getAttribute('y'), w: +ext.getAttribute('cx'), h: +ext.getAttribute('cy') };
  }
  function phOf(sp) {
    const nv = kid(sp, 'nvSpPr') || kid(sp, 'nvPicPr') || kid(sp, 'nvGraphicFramePr');
    const ph = nv && path(nv, 'nvPr', 'ph');
    if (!ph) return null;
    return { type: ph.getAttribute('type') || 'body', idx: ph.getAttribute('idx') || '' };
  }
  function walk(node, out) {
    if (!node) return;
    for (const c of node.children) {
      const n = c.localName;
      if (n === 'sp' || n === 'pic' || n === 'graphicFrame') out.push(c);
      else if (n === 'grpSp') walk(c, out);
      else if (n === 'AlternateContent') { const fb = kid(c, 'Fallback'), ch = kid(c, 'Choice'); walk(fb || ch, out); }
    }
  }

  /* ----- bilder ----- */
  function loadImg(blob) {
    return new Promise((res, rej) => { const u = URL.createObjectURL(blob); const im = new Image(); im.onload = () => { res(im); setTimeout(() => URL.revokeObjectURL(u), 1000); }; im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('bild')); }; im.src = u; });
  }
  async function compress(blob, ext, maxLen) {
    maxLen = maxLen || 230000;
    ext = (ext || '').toLowerCase();
    if (ext === 'svg') {
      const txt = await blob.text();
      if (txt.length < 170000) return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(txt)));
    }
    if (/^(emf|wmf|tif|tiff|wdp)$/.test(ext)) return null;
    let bmp;
    try { bmp = await loadImg(blob); } catch (e) { try { bmp = await createImageBitmap(blob); } catch (e2) { return null; } }
    const W = bmp.naturalWidth || bmp.width, H = bmp.naturalHeight || bmp.height;
    if (!W || !H) return null;
    let alpha = false;
    if (/png|gif|webp|svg/.test(ext) || blob.type.includes('png')) {
      const c = document.createElement('canvas'); c.width = 48; c.height = 48;
      const x = c.getContext('2d'); x.drawImage(bmp, 0, 0, 48, 48);
      const d = x.getImageData(0, 0, 48, 48).data;
      for (let i = 3; i < d.length; i += 4) if (d[i] < 250) { alpha = true; break; }
    }
    let scale = Math.min(1, 1600 / Math.max(W, H));
    const cv = document.createElement('canvas');
    const qs = [.84, .76, .68, .62, .58, .55, .5, .5];
    let url = '';
    for (let k = 0; k < qs.length; k++) {
      cv.width = Math.max(1, Math.round(W * scale)); cv.height = Math.max(1, Math.round(H * scale));
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (!alpha) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); }
      ctx.drawImage(bmp, 0, 0, cv.width, cv.height);
      url = cv.toDataURL(alpha ? 'image/webp' : 'image/jpeg', qs[k]);
      if (alpha && url.startsWith('data:image/png') && url.length > maxLen) { scale *= .75; continue; }
      if (url.length < maxLen) return url;
      if (k >= 1) scale *= .8;
    }
    return url.length < maxLen * 1.1 ? url : null;
  }

  /* ----- tolka en bild ----- */
  async function readSlide(zip, part, ctx) {
    const doc = await xml(zip, part);
    const R = await rels(zip, part);
    const s = { title: '', ctr: false, subtitle: '', bodies: [], pics: [], tables: [], notes: '', layoutType: '', charts: 0 };
    let layoutPh = {};
    const layRel = Object.values(R).find(r => /\/slideLayout$/.test(r.type));
    if (layRel && layRel.target) {
      if (!ctx.layouts[layRel.target]) {
        const ld = await xml(zip, layRel.target);
        const info = { type: '', ph: {} };
        if (ld) {
          info.type = ld.documentElement.getAttribute('type') || '';
          const items = []; walk(desc(ld, 'p', 'spTree')[0], items);
          items.forEach(el => { const ph = phOf(el); const xf = xfrmOf(el); if (ph && xf) { info.ph[ph.type + ':' + ph.idx] = xf; if (!info.ph[ph.type]) info.ph[ph.type] = xf; if (ph.idx && !info.ph[':' + ph.idx]) info.ph[':' + ph.idx] = xf; } });
        }
        ctx.layouts[layRel.target] = info;
      }
      s.layoutType = ctx.layouts[layRel.target].type;
      layoutPh = ctx.layouts[layRel.target].ph;
    }
    const posOf = (el, ph) => xfrmOf(el) || (ph && (layoutPh[ph.type + ':' + ph.idx] || layoutPh[':' + ph.idx] || layoutPh[ph.type])) || null;
    const items = []; walk(doc && desc(doc, 'p', 'spTree')[0], items);
    const picRef = async (blip) => {
      const id = blip && (blip.getAttributeNS(NS.r, 'embed') || blip.getAttribute('r:embed'));
      const rel = id && R[id];
      if (!rel || !rel.target) return null;
      if (ctx.media[rel.target] !== undefined) return ctx.media[rel.target];
      const f = zip.file(rel.target);
      let ref = null;
      if (f) {
        const ext = rel.target.split('.').pop();
        const blob = await f.async('blob');
        const url = await compress(blob, ext);
        if (url) { const iid = rid(); ctx.images[iid] = url; ref = 'img:' + iid; ctx.report.images++; }
        else ctx.report.skippedImages.push(rel.target.split('/').pop());
      }
      ctx.media[rel.target] = ref;
      return ref;
    };
    for (const el of items) {
      const n = el.localName;
      const ph = phOf(el);
      if (ph && /^(dt|ftr|sldNum|hdr)$/.test(ph.type)) continue;
      const pos = posOf(el, ph) || { x: 0, y: 0, w: 0, h: 0 };
      if (n === 'pic' || (n === 'sp' && kid(kid(el, 'spPr'), 'blipFill'))) {
        const blip = desc(el, 'a', 'blip')[0];
        const ref = await picRef(blip);
        if (ref) s.pics.push({ ref, ...pos, area: pos.w * pos.h });
        continue;
      }
      if (n === 'graphicFrame') {
        const tbl = desc(el, 'a', 'tbl')[0];
        if (tbl) {
          const rows = kids(tbl, 'tr').map(tr => kids(tr, 'tc').map(tc => paras(kid(tc, 'txBody')).map(p => p.t).join('\n')));
          const tp = kid(tbl, 'tblPr');
          const header = tp ? tp.getAttribute('firstRow') === '1' : true;
          if (rows.length) s.tables.push({ rows, header, ...pos });
          continue;
        }
        const gd = desc(el, 'a', 'graphicData')[0]; const uri = gd ? gd.getAttribute('uri') || '' : '';
        if (/chart/.test(uri)) { s.charts++; continue; }
        if (/diagram/.test(uri)) {
          const relIds = [...el.getElementsByTagName('*')].find(e => e.localName === 'relIds');
          const dm = relIds && (relIds.getAttributeNS(NS.r, 'dm') || relIds.getAttribute('r:dm'));
          const rel = dm && R[dm];
          if (rel && rel.target) {
            const dd = await xml(zip, rel.target);
            if (dd) {
              const pts = [...dd.getElementsByTagName('*')].filter(e => e.localName === 'pt' && (!e.getAttribute('type') || e.getAttribute('type') === 'node'));
              const ps = pts.map(pt => ({ t: desc(pt, 'a', 't').map(t => t.textContent).join('').trim(), lvl: 0 })).filter(x => x.t);
              if (ps.length) s.bodies.push({ paras: ps, ...pos });
            }
          }
          continue;
        }
        continue;
      }
      if (n === 'sp') {
        const ps = paras(kid(el, 'txBody'));
        if (!ps.length) continue;
        const type = ph ? ph.type : 'text';
        if ((type === 'title' || type === 'ctrTitle') && !s.title) { s.title = ps.map(p => p.t).join(' ').replace(/\n/g, ' '); s.ctr = type === 'ctrTitle'; continue; }
        if (type === 'subTitle' && !s.subtitle) { s.subtitle = ps.map(p => p.t).join('\n'); continue; }
        s.bodies.push({ paras: ps, ph: type, ...pos });
      }
    }
    const nrel = Object.values(R).find(r => /\/notesSlide$/.test(r.type));
    if (nrel && nrel.target) {
      const nd = await xml(zip, nrel.target);
      if (nd) {
        const its = []; walk(desc(nd, 'p', 'spTree')[0], its);
        its.forEach(el => { const ph = phOf(el); if (ph && ph.type === 'body') { const ps = paras(kid(el, 'txBody')); if (ps.length) s.notes += (s.notes ? '\n' : '') + ps.map(p => p.t).join('\n'); } });
      }
    }
    s.bodies.sort((a, b) => (Math.abs(a.y - b.y) > 300000 ? a.y - b.y : a.x - b.x));
    s.pics.sort((a, b) => b.area - a.area);
    return s;
  }

  /* ----- välj layout ----- */
  const toBullets = ps => ps.map(p => (p.lvl > 0 ? '- ' : '') + p.t.replace(/\n/g, ' '));
  function classify(s, i, W) {
    const o = { id: rid(), layout: 'bullets', title: s.title, text: '', bullets: [], notes: s.notes, steps: true, dim: false, transition: 'auto', ta: 'auto', ba: 'auto', bg: 'none' };
    const bodies = s.bodies;
    const all = bodies.flatMap(b => b.paras);
    if (s.subtitle && s.layoutType !== 'title' && !s.ctr) all.unshift(...s.subtitle.split('\n').map(t => ({ t, lvl: 0 })));
    const LT = s.layoutType;
    if (s.tables.length) {
      const t = s.tables[0];
      o.layout = 'table'; o.table = { rows: t.rows, header: t.header, reveal: 'none' };
      if (all.length) o.text = all.map(p => p.t).join(' ');
      return o;
    }
    if (s.ctr || LT === 'title' || (i === 0 && s.title && !s.pics.length && all.length <= 3)) {
      o.layout = 'title'; o.bg = 'nodes';
      if (s.pics.length) o.image = s.pics[0].ref;
      const rest = s.subtitle ? all : all.slice(1);
      o.text = s.subtitle || (all[0] && all[0].t) || '';
      o.caption = rest.filter(p => p.t !== o.text).map(p => p.t).join(' · ');
      return o;
    }
    if (LT === 'secHead' && all.length <= 2) {
      o.layout = 'section'; o.bg = 'field'; o.text = all.map(p => p.t).join(' ');
      return o;
    }
    if (s.pics.length && !all.length) { o.layout = 'image'; o.image = s.pics[0].ref; return o; }
    if (s.pics.length) {
      o.layout = 'split'; o.image = s.pics[0].ref;
      o.flip = W ? (s.pics[0].x + s.pics[0].w / 2) < W * .45 : false;
      fill(o, all); return o;
    }
    const colsOK = bodies.length >= 2 && W && (() => { const xs = bodies.map(b => b.x + b.w / 2); return Math.max(...xs) - Math.min(...xs) > W * .3; })();
    if (colsOK && (/two|comparison/i.test(LT) || bodies.length <= 4)) {
      const mid = (W || 1) / 2;
      const left = bodies.filter(b => b.x + b.w / 2 < mid).sort((a, b) => a.y - b.y);
      const right = bodies.filter(b => b.x + b.w / 2 >= mid).sort((a, b) => a.y - b.y);
      if (left.length && right.length) {
        const col = (arr) => {
          if (arr.length >= 2 && arr[0].paras.length === 1) return [arr[0].paras[0].t, toBullets(arr.slice(1).flatMap(b => b.paras))];
          return ['', toBullets(arr.flatMap(b => b.paras))];
        };
        const [lt, lb] = col(left), [rt, rb] = col(right);
        Object.assign(o, { layout: 'compare', lt, lb: lb.join('\n'), rt, rb: rb.join('\n') });
        return o;
      }
    }
    if (!all.length) { o.layout = s.title ? 'section' : 'statement'; o.bg = s.title ? 'field' : 'none'; return o; }
    if (all.length === 1 && /^[-+−]?\s*[\d][\d\s.,]*\s*%?$/.test(all[0].t) ) { o.layout = 'number'; o.number = all[0].t; return o; }
    if (!s.title && all.length <= 2 && all.reduce((n, p) => n + p.t.length, 0) < 180) { o.layout = 'statement'; o.title = all[0].t; o.text = all[1] ? all[1].t : ''; return o; }
    fill(o, all);
    return o;
  }
  function fill(o, ps) {
    if (ps.length === 1 && ps[0].t.length > 90) { o.text = ps[0].t; o.bullets = []; }
    else o.bullets = toBullets(ps);
  }

  /* ----- slå ihop uppbyggnadsbilder ----- */
  const P = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  function merge(list, report) {
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1], b = list[i];
      if (!a.title || P(a.title) !== P(b.title)) continue;
      const joinNotes = () => { if (a.notes && a.notes !== b.notes) b.notes = a.notes + (b.notes ? '\n\n' + b.notes : ''); };
      const ab = a.bullets || [], bb = b.bullets || [];
      const prefix = ab.length && bb.length > ab.length && ab.every((t, j) => P(t) === P(bb[j]));
      const c = list[i + 1];
      const chainGoesOn = c && P(c.title) === P(b.title) && (c.bullets || []).length > bb.length;
      if (a.layout === 'bullets' && !a._built && !chainGoesOn && /\?/.test(a.title) && ab.length !== 1 && (b.layout === 'bullets' || b.layout === 'split') && (prefix || (!ab.length && bb.length) || (ab.length && !bb.length && b.text))) {
        const extra = prefix ? bb.slice(ab.length) : (ab.length ? [b.text] : bb);
        if (extra.length <= 3) {
          Object.assign(b, { layout: 'question', bullets: ab, answer: extra.map(t => t.replace(/^- /, '')).join(' '), text: '' });
          joinNotes(); list.splice(i - 1, 1); i--; report.merged++; continue;
        }
      }
      if (prefix && (a.layout === 'bullets' || a.layout === 'split') && a.layout === b.layout) {
        b.steps = true; b._built = true; joinNotes(); list.splice(i - 1, 1); i--; report.merged++; continue;
      }
      if (a.layout === 'table' && b.layout === 'table') {
        const ra = a.table.rows, rb = b.table.rows;
        if (ra.length === rb.length && ra.every((r, j) => r.length === rb[j].length)) {
          let ok = true, onlyLast = true, diff = false;
          ra.forEach((r, j) => r.forEach((v, c) => {
            const w = rb[j][c];
            if (P(v) === P(w)) return;
            if (P(v) === '') { diff = true; if (c !== r.length - 1) onlyLast = false; } else ok = false;
          }));
          if (ok && diff) {
            b.table.reveal = onlyLast ? 'answers' : 'rows';
            joinNotes(); list.splice(i - 1, 1); i--; report.merged++; continue;
          }
        }
      }
    }
    list.forEach(s => delete s._built);
    return list;
  }

  async function run(file, onProgress) {
    if (!G.JSZip) throw new Error('Importverktyget kunde inte laddas. Kontrollera nätverket och försök igen.');
    const zip = await G.JSZip.loadAsync(file);
    const pres = await xml(zip, 'ppt/presentation.xml');
    if (!pres) throw new Error('Filen ser inte ut som en PowerPoint-presentation (.pptx).');
    const PR = await rels(zip, 'ppt/presentation.xml');
    const sz = desc(pres, 'p', 'sldSz')[0];
    const W = sz ? +sz.getAttribute('cx') : 12192000;
    const ids = desc(pres, 'p', 'sldId').filter(s => s.getAttribute('show') !== '0').map(s => s.getAttributeNS(NS.r, 'id') || s.getAttribute('r:id'));
    const parts = ids.map(id => PR[id] && PR[id].target).filter(Boolean);
    const hidden = desc(pres, 'p', 'sldId').length - parts.length;
    const ctx = { media: {}, images: {}, layouts: {}, report: { images: 0, skippedImages: [], merged: 0, charts: 0, hidden: 0, source: parts.length } };
    const raw = [];
    for (let i = 0; i < parts.length; i++) {
      onProgress && onProgress(i + 1, parts.length);
      const sd = await xml(zip, parts[i]);
      if (sd && sd.documentElement.getAttribute('show') === '0') { ctx.report.hidden++; continue; }
      const s = await readSlide(zip, parts[i], ctx);
      ctx.report.charts += s.charts;
      raw.push(classify(s, raw.length, W));
    }
    ctx.report.hidden += hidden;
    const slides = merge(raw, ctx.report);
    const core = await xml(zip, 'docProps/core.xml');
    const coreTitle = core ? ([...core.getElementsByTagName('*')].find(e => e.localName === 'title') || {}).textContent : '';
    const base = (file.name || 'Presentation').replace(/\.pptx$/i, '');
    const title = (coreTitle && coreTitle.trim()) || (slides[0] && Scen.plain(slides[0].title)) || base;
    if (!slides.length) throw new Error('Hittade inga bilder i filen.');
    ctx.report.slides = slides.length;
    return { deck: { title, theme: { accent: 'blue', look: 'auto' }, slides, source: file.name || 'pptx' }, images: ctx.images, report: ctx.report };
  }
  const G = window;
  return { run, compress };
})();
