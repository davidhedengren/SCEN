const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const ctx = { window: {}, console };
vm.runInNewContext(read('src/engine.js'), ctx);
ctx.Scen = ctx.window.Scen;
vm.runInNewContext(read('src/manus.js') + ';window.Manus=Manus;', ctx);
const { Scen, Manus } = ctx.window;
const source = `[bildregi]
bild: still.jpg
film: recording.mp4
alt: En stilla detalj i en föränderlig miljö.
bildläge: levande
startutsnitt: 50 50 1
slututsnitt: 65 72 1.9`;
const slide = Manus.parse(source).slides[0];
assert.equal(slide.imageDirection.mode, 'live');
assert.equal(slide.video, 'recording.mp4');
const round = Manus.parse(Manus.stringify({ title: 'Film', slides: [slide] })).slides[0];
for (const key of ['video', 'image', 'alt', 'imageDirection']) assert.deepEqual(round[key], slide[key]);
assert.deepEqual(Array.from(Scen.imagesOf(slide)), ['still.jpg', 'recording.mp4']);
const deck = { theme: { id: 'natt' }, slides: [slide] };
const html = Scen.renderSlide(slide, 0, deck, ref => ref);
assert.equal((html.match(/data-step="/g) || []).length, 2, 'Zoom och uppspelning har varsitt klick.');
assert(html.includes('data-film-src="recording.mp4"'));
assert(html.includes('preload="none"'));
assert(!/<video[^>]*\ssrc=/.test(html), 'Filmen laddas först vid uppspelning, även i miniatyrer.');
assert(!/<video[^>]*\s(?:autoplay|loop)(?:\s|>)/.test(html), 'Ingen automatisk start eller omstart.');
assert(!html.includes('<h2'), 'Rubriken är valfri.');
const still = Scen.renderSlide({ ...slide, steps: false }, 0, deck, ref => ref);
assert(!still.includes('data-step='));
assert(still.includes('data-live-state="overview"'));
const safe = Scen.renderSlide({ ...slide, video: 'clip.mp4" onerror="bad' }, 0, deck, ref => ref);
assert(!safe.includes(' onerror="bad'));
const clamped = Scen.renderSlide({ ...slide, imageDirection: { mode: 'live', end: [200, -200, 9] } }, 0, deck, ref => ref);
assert(clamped.includes('scale(3)'), 'Zoomen begränsas så att utsnitt inte ger orimlig skala.');
const actual = Manus.parse(read('presentationer/ai-agenter-och-miljoer.md')).slides;
assert.equal(actual[5].imageDirection.mode, 'live');
assert.equal(actual[6].title, 'Från agent till miljö');
assert(Scen.imagesOf(actual[5]).every(file => fs.existsSync(path.join(root, file))));
console.log('OK: filmens manus, exportresurser, två klicksteg, rubriklös visning och säker HTML.');
