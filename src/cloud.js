/* Personligt Supabase-bibliotek. En ny version blir synlig först när alla filer finns. */
window.ScenCloud = (() => {
  const sessionKey = 'scen:auth:';
  const selected = 'select=owner,deck_id,revision,change_id,document,media,removed';
  const fail = message => { throw new Error(message); };
  const base64url = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/, '');
  const digest = async data => new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  const dataUrl = blob => new Promise((ok, no) => {
    const reader = new FileReader(); reader.onload = () => ok(reader.result); reader.onerror = () => no(reader.error); reader.readAsDataURL(blob);
  });
  async function init() {
    if (!/^https?:$/.test(location.protocol)) return null;
    let cfg;
    try {
      const res = await fetch('scen-cloud.json', {cache:'no-cache'});
      if (res.ok) { cfg = await res.json(); sessionStorage.setItem('scen:public-config', JSON.stringify(cfg)); }
    } catch { cfg = JSON.parse(sessionStorage.getItem('scen:public-config') || 'null'); }
    if (!cfg?.url || !cfg.publishableKey) return null;
    const url = new URL(cfg.url).origin;
    if (!url.startsWith('https://')) fail('Molnbiblioteket behöver HTTPS.');
    const key = sessionKey + url, proofKey = key + ':pkce';
    let session = JSON.parse(sessionStorage.getItem(key) || 'null'), renewing;
    async function request(path, options = {}, token) {
      const res = await fetch(url + path, { signal:AbortSignal.timeout(60000), ...options, headers: { apikey:cfg.publishableKey,
        ...(token ? {Authorization:'Bearer ' + token} : {}), ...options.headers } });
      if (!res.ok) {
        const info = await res.json().catch(() => ({}));
        const error = new Error(info.message || info.error_description || 'Molntjänsten svarade med ' + res.status);
        error.status = res.status; error.code = info.code || info.error; throw error;
      }
      return res;
    }
    const post = data => ({method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    function remember(s) {
      session = { access_token:s.access_token, refresh_token:s.refresh_token, until:Date.now() + s.expires_in*1000, user:s.user };
      sessionStorage.setItem(key, JSON.stringify(session));
    }
    async function api(path, options) {
      if (!session) fail('Logga in i SCEN igen.');
      if (session.until < Date.now() + 60000) {
        renewing ||= request('/auth/v1/token?grant_type=refresh_token', post({refresh_token:session.refresh_token}))
          .then(r => r.json()).then(remember).finally(() => { renewing = null; });
        await renewing;
      }
      return request(path, options, session.access_token);
    }
    const params = new URLSearchParams(location.search);
    if (params.has('code') && localStorage.getItem(proofKey)) {
      const code = params.get('code'), verifier = localStorage.getItem(proofKey);
      const clean = new URL(location.href); clean.searchParams.delete('code'); history.replaceState(null,'',clean);
      remember(await (await request('/auth/v1/token?grant_type=pkce', post({auth_code:code, code_verifier:verifier}))).json());
      localStorage.removeItem(proofKey);
    }
    return {
      get user() { return session?.user; },
      api,
      async login(email) {
        const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
        localStorage.setItem(proofKey, verifier);
        const challenge = base64url(await digest(new TextEncoder().encode(verifier)));
        const redirect = location.origin + location.pathname;
        await request('/auth/v1/otp?redirect_to=' + encodeURIComponent(redirect), post({
          email, create_user:false, code_challenge:challenge, code_challenge_method:'s256'
        }));
      },
      async logout() {
        try { if (session) await api('/auth/v1/logout?scope=local',{method:'POST'}); }
        finally { sessionStorage.removeItem(key); session = null; }
      },
      async workspace() {
        if (!session) return null;
        const owner = session.user.id;
        const cache = await openCache(url + '/' + owner);
        try {
          const allowed = await (await api('/rest/v1/scen_accounts?select=owner&owner=eq.' + owner)).json();
          if (!allowed.length) fail('Ditt konto har inte aktiverats för SCEN.');
        } catch (e) {
          if ((!(e instanceof TypeError) && e.name !== 'TimeoutError') || !(await cache.get('access','ok'))) throw e;
        }
        await cache.put('access','ok',true);
        return workspace(api, cache, owner);
      }
    };
  }
  async function openCache(name) {
    const db = await new Promise((ok,no) => {
      const req = indexedDB.open('scen:private:' + name,1);
      req.onupgradeneeded = () => { for (const s of ['access','documents','media','templates']) req.result.createObjectStore(s); };
      req.onsuccess = () => ok(req.result); req.onerror = () => no(req.error);
    });
    function run(store, method, ...args) {
      return new Promise((ok,no) => {
        const tx = db.transaction(store,['put','delete'].includes(method) ? 'readwrite' : 'readonly');
        const req = tx.objectStore(store)[method](...args);
        tx.oncomplete = () => ok(req.result); tx.onabort = () => no(tx.error || req.error);
      });
    }
    return {get:(s,k)=>run(s,'get',k), all:s=>run(s,'getAll'), put:(s,k,v)=>run(s,'put',v,k), del:(s,k)=>run(s,'delete',k)};
  }
  function workspace(api, cache, owner) {
    const locks = (id, fn) => navigator.locks.request('scen:' + owner + ':' + id,fn);
    const doc = id => cache.get('documents',id);
    const put = r => cache.put('documents',r.deck_id,r);
    const storage = '/storage/v1/object/';
    const mediaPath = hash => 'scen-private/' + owner + '/' + hash;
    const listRows = async path => (await api('/rest/v1/' + path)).json();
    const remote = id => listRows('scen_library?' + selected + '&deck_id=eq.' + encodeURIComponent(id));
    const seen = new Map();
    let onStatus = () => {};
    async function download(hash) {
      const response = await api(storage + 'authenticated/' + mediaPath(hash));
      return dataUrl(await response.blob());
    }
    async function upload(id, ref) {
      let source = await cache.get('media',[id,ref]);
      if (!source) {
        if (/^[a-z][\w+.-]*:/i.test(ref) || !/\.(png|svg|jpg|jpeg|gif|webp|avif|mp4|webm)$/i.test(ref)) fail('Mediefilen saknas: ' + ref);
        const address = new URL(ref,location.href);
        if (address.origin !== location.origin) fail('Mediefilen behöver importeras i SCEN.');
        source = address.href;
      }
      const res = await fetch(source);
      if (!res.ok) fail('Kunde inte läsa ' + ref);
      const blob = await res.blob();
      const hash = Array.from(await digest(await blob.arrayBuffer()),b=>b.toString(16).padStart(2,'0')).join('');
      try {
        await api(storage + mediaPath(hash),{method:'POST',headers:{'Content-Type':blob.type || 'application/octet-stream'},body:blob});
      } catch (e) { if (!['Duplicate','KeyAlreadyExists','ResourceAlreadyExists'].includes(e.code)) throw e; }
      return hash;
    }
    function state(row, msg) { onStatus(row.deck_id, msg); }
    async function syncLocked(id) {
      let row = await doc(id);
      if (!row?.pending) return;
      try {
        const media = {};
        for (const ref of new Set(row.document.slides.flatMap(Scen.imagesOf))) {
          if (/^(https?:|data:)/.test(ref)) continue;
          media[ref] = row.media[ref] || await upload(id,ref);
        }
        const body = {owner, deck_id:id, revision:row.revision+1, change_id:row.change_id, document:row.document, media, removed:!!row.removed};
        try { await api('/rest/v1/scen_versions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); }
        catch (e) {
          if (e.status !== 409) throw e;
          const [latest] = await remote(id);
          if (!latest) throw e;
          if (latest.change_id !== body.change_id) {
            // Ett annat fönster eller en annan dator hann före. Spara vår variant
            // som en separat presentation innan det delade originalet uppdateras.
            let fork;
            if (!body.removed) {
              const copyId = crypto.randomUUID(), copy = {...body,deck_id:copyId,revision:1,change_id:row.change_id,
                document:{...body.document,id:copyId,title:body.document.title + ' (parallell ändring)'}};
              const prior = await listRows('scen_versions?select=deck_id&change_id=eq.' + row.change_id);
              if (!prior.length) {
                await api('/rest/v1/scen_versions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(copy)});
                fork = copy;
              } else if (prior[0].deck_id !== id) {
                [fork] = await remote(prior[0].deck_id);
              }
            }
            await locks(id,async()=>{
              const current=await doc(id);
              if (current?.change_id !== row.change_id) return;
              if (fork) {
                await put(fork); seen.set(fork.deck_id,fork.change_id);
                for (const ref of Object.keys(media)) {
                  const local = await cache.get('media',[id,ref]);
                  if (local) await cache.put('media',[fork.deck_id,ref],local);
                }
              }
              await put(latest);
              onStatus(id,'Parallella versioner finns i biblioteket',fork?.document);
            });
            return;
          }
        }
        // Utkast kan sparas medan media laddas upp. Flytta då bara fram
        // basversionen och låt nästa synkning skicka det senare utkastet.
        const complete = await locks(id,async()=>{
          const current=await doc(id);
          if (current?.change_id === row.change_id) { await put(body); return true; }
          if (current?.pending && current.revision === row.revision) {
            await put({...current,revision:body.revision,media:{...media,...current.media}});
          }
          return false;
        });
        if (complete) state(row,'Sparad i molnet');
      } catch (e) { state(row,navigator.onLine ? 'Sparad lokalt · synkning misslyckades' : 'Sparad lokalt · väntar på nät'); throw e; }
    }
    async function sync(id) { return locks('upload:'+id,()=>syncLocked(id)); }
    async function adopt(row) {
      return locks(row.deck_id,async()=>{
        const old = await doc(row.deck_id);
        if (!old?.pending && (!old || old.revision < row.revision)) await put(row);
      });
    }
    return {
      onStatus(fn) { onStatus = fn; },
      async retry() { const pending = (await cache.all('documents')).filter(r=>r.pending);
        const results = await Promise.allSettled(pending.map(r=>sync(r.deck_id)));
        const failure = results.find(r=>r.status === 'rejected');
        if (failure) throw failure.reason; },
      async list() {
        try { for (const r of await listRows('scen_library?' + selected)) await adopt(r); }
        catch (e) { if (!(e instanceof TypeError) && e.name !== 'TimeoutError') throw e; }
        const rows = await cache.all('documents');
        rows.forEach(r=>seen.set(r.deck_id,r.change_id));
        return rows.filter(r=>!r.removed).map(r=>r.document);
      },
      async save(d, removed = false) {
        await locks(d.id,async()=>{
          const old = await doc(d.id);
          if (old && seen.get(d.id) !== old.change_id) fail('En annan flik har ändrat presentationen. Spara en kopia på datorn och öppna biblioteket igen.');
          if (old && !removed && !old.removed && JSON.stringify(old.document) === JSON.stringify(d)) return;
          const row = {deck_id:d.id, document:d, revision:old?.revision || 0, media:old?.media || {},
            change_id:crypto.randomUUID(), pending:true, removed};
          await put(row); seen.set(d.id,row.change_id);
        });
        sync(d.id).catch(()=>{}); // Utkastet ligger kvar och försöks igen vid nästa anslutning.
      },
      async status(id) { return (await doc(id))?.pending ? 'Sparad lokalt · väntar på synkning' : 'Sparad i molnet'; },
      async remove(id) { const r = await doc(id); if (r) await this.save(r.document,true); },
      saveImage(id,k,v) { return cache.put('media',[id,k],v); },
      async loadImages(id) {
        const row = await doc(id), out = Object.create(null);
        for (const k of new Set((row?.document.slides || []).flatMap(Scen.imagesOf))) {
          if (/^(https?:|data:)/.test(k)) continue;
          let value = await cache.get('media',[id,k]);
          if (!value && row?.media[k]) {
            value = await download(row.media[k]); await cache.put('media',[id,k],value);
          }
          if (value) out[k] = value;
        }
        return out;
      },
      deleteImage(id,k) { return cache.del('media',[id,k]); },
      listTemplates:()=>cache.all('templates'), saveTemplate:t=>cache.put('templates',t.id,t), removeTemplate:id=>cache.del('templates',id),
      history:id=>listRows('scen_versions?select=revision,saved_at&removed=eq.false&deck_id=eq.' + encodeURIComponent(id) + '&order=revision.desc'),
      async restore(id, revision) {
        const [r] = await listRows('scen_versions?' + selected + '&deck_id=eq.' + encodeURIComponent(id) + '&revision=eq.' + Number(revision));
        if (!r) fail('Versionen saknas.');
        const copy = {...r.document,id:crypto.randomUUID(),title:r.document.title + ' (version ' + revision + ')',updatedAt:Date.now()};
        const row = {...r,document:copy,deck_id:copy.id,revision:0,change_id:crypto.randomUUID(),pending:true};
        await put(row); seen.set(copy.id,row.change_id); await sync(copy.id);
      }
    };
  }
  return {init};
})();
