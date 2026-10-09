const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
global.window = global;
vm.runInThisContext(read('src/engine.js'));
vm.runInThisContext(read('src/manus.js') + ';global.Manus=Manus;');
const templates = Object.fromEntries(['byt-antagande', 'omformning', 'aterkomst'].map(id => [id, JSON.parse(read(`mallar/${id}.json`))]));
const deck = { title: 'Kontroll', theme: { id: 'natt' }, templates };
const render = slide => Scen.renderSlide(slide, 0, { ...deck, slides: [slide] }, x => x);
const steps = html => [...html.matchAll(/data-step="(\d+)"/g)].map(m => +m[1]);

// Each case has its own answer click; switching cases never reveals their answers.
const table = Manus.parseBlock('[tabell]\nvisa: fall\n| Fall | Egenskap |\n| A | Ett |\n| B | Två |');
assert.equal(table.table.reveal, 'cases');
const html = render(table);
assert.deepEqual(steps(html), [1, 2, 3, 4]);
assert.match(html, /class="tbl-case-answer" data-step="1"/);
assert.match(html, /class="tbl-case" data-step="2"/);
assert.match(html, /class="tbl-case-answer" data-step="3"/);
assert.match(html, /class="tbl-overview" data-step="4"/);
for (const enabled of [true, false]) {
  const original = { ...table, steps: enabled };
  const parsed = Manus.parse(Manus.stringify({ ...deck, slides: [original] })).slides[0];
  assert.equal(parsed.table.reveal, 'cases');
  assert.deepEqual(parsed.table.rows, table.table.rows);
  assert.equal(parsed.steps, enabled);
  if (!enabled) assert.deepEqual(steps(render(parsed)), []);
}

// Custom HTML requires a real DOM and is exercised in the browser review.
const assumption = { layout: 'egen', tpl: 'byt-antagande', items: ['Villkor A | Svar A | Belägg A', 'Villkor B | Svar B | Belägg B'] };
const unsafe = render({ ...table, table: { ...table.table, rows: [['Fall', 'Svar'], ['<img onerror=alert(1)>', '<script>']] } });
assert(!unsafe.includes('<script>'));
assert(unsafe.includes('&lt;img'));
const parsed = Manus.parse(Manus.stringify({ ...deck, slides: [assumption] })).slides[0];
assert.deepEqual(parsed.items, assumption.items);
assert.equal(parsed.tpl, assumption.tpl);
console.log('OK: fallvisning, separata svarsklick, oförändrade tabellvärden, manusrundtur och escaping.');
