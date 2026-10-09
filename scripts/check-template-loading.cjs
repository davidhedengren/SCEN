const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

// A release must request a fresh URL for every changed local script or stylesheet.
const refs = [...read('index.html').matchAll(/(?:src|href)="(src\/[^"?]+\.(?:js|css))(?:\?v=([^"]+))?"/g)];
assert.equal(refs.length, 6);
for (const [, file, version] of refs) assert.equal(version, createHash('sha256').update(read(file)).digest('hex').slice(0, 12), file);
for (const file of ['scen.html', 'dist/scen.html']) assert(!/(?:src|href)="src\//.test(read(file)), `${file} must embed local code`);

// Run the actual loader independently of the editor, including retry and saved snapshots.
const app = read('src/app.js');
const loader = app.slice(app.indexOf('async function ensureDeckTemplates('), app.indexOf('\nfunction useTemplate('));
const requests = [];
let fail = false;
const template = { id: 'sample', html: '<p>Från repot</p>', css: '' };
const context = vm.createContext({ myTpls: [], window: {}, fetch: async (url, options) => {
  requests.push({ url, options });
  if (fail) throw new Error('Tillfälligt avbrott');
  return { ok: true, json: async () => template };
} });
vm.runInContext(loader, context);
const deck = () => ({ slides: [{ layout: 'egen', tpl: 'sample' }], templates: {} });
(async () => {
  const d = deck();
  await context.ensureDeckTemplates(d);
  assert.equal(d.templates.sample.html, template.html);
  assert.equal(requests[0].url, 'mallar/sample.json');
  assert.equal(requests[0].options.cache, 'reload');
  d.templates.sample.html = '<p>Egen sparad version</p>';
  await context.ensureDeckTemplates(d);
  assert.equal(d.templates.sample.html, '<p>Egen sparad version</p>');
  assert.equal(requests.length, 1);
  fail = true;
  const retry = deck();
  await context.ensureDeckTemplates(retry);
  assert(!retry.templates.sample);
  fail = false;
  await context.ensureDeckTemplates(retry);
  assert(retry.templates.sample);
  context.window.SCEN_MALLAR = [template];
  const calls = requests.length;
  await context.ensureDeckTemplates(deck());
  assert.equal(requests.length, calls, 'Baked templates must work without network');
  console.log('OK: innehållsbaserade filversioner, inbäddade exporter, återhämtning av saknade mallar, återförsök och bevarade egna mallkopior.');
})().catch(error => { console.error(error); process.exitCode = 1; });
