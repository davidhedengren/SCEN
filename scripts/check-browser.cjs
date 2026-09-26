const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

function smokeHtml() {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const beforeScripts = `<script>
window.__scenSmokeErrors = [];
window.addEventListener('error', event => {
  if (event.error || event.message) window.__scenSmokeErrors.push(String(event.error && (event.error.stack || event.error.message) || event.message));
}, true);
window.addEventListener('unhandledrejection', event => {
  const reason = event.reason;
  window.__scenSmokeErrors.push(String(reason && (reason.stack || reason.message) || reason));
});
</script>\n`;
  const probe = `<script>
(async () => {
  const waitFor = async (test, timeout = 12000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (test()) return true;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return false;
  };
  const result = { errors: window.__scenSmokeErrors };
  try {
    const response = await fetch('presentationer/index.json', { cache: 'no-cache' });
    result.indexStatus = response.status;
    result.indexCount = response.ok ? (await response.json()).length : 0;
    result.libraryReady = await waitFor(() => document.querySelector('#storeChip')?.textContent !== 'Ansluter…');
    result.storeChip = document.querySelector('#storeChip')?.textContent || '';
    result.repoReady = await waitFor(() => [...document.querySelectorAll('#grid .tag')].filter(tag => tag.textContent.trim() === 'I repot').length === 8);
    result.repoCount = [...document.querySelectorAll('#grid .tag')].filter(tag => tag.textContent.trim() === 'I repot').length;
    result.undoExists = Boolean(document.querySelector('#btnUndo'));
    result.layerButtonCount = document.querySelectorAll('[data-add]').length;
    const copyButton = [...document.querySelectorAll('#grid button')].find(button => button.textContent.trim() === 'Gör en egen kopia');
    result.copyButtonExists = Boolean(copyButton);
    if (copyButton) copyButton.click();
    result.editorOpened = await waitFor(() => document.querySelector('#ed') && !document.querySelector('#ed').hidden);
    result.editorTitle = document.querySelector('#deckTitle')?.value || '';
    result.previewExists = Boolean(document.querySelector('#preview'));
  } catch (error) {
    result.probeError = String(error && (error.stack || error.message) || error);
  }
  await new Promise(resolve => setTimeout(resolve, 100));
  result.errors = window.__scenSmokeErrors;
  document.documentElement.dataset.smoke = btoa(unescape(encodeURIComponent(JSON.stringify(result))));
})();
</script>\n`;
  html = html.replace('<head>', '<head>\n' + beforeScripts);
  html = html.replace('</body>', probe + '</body>');
  return html;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/__smoke__.html') {
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(smokeHtml());
      return;
    }
    const relative = pathname.replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(ROOT, relative);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    try {
      const stat = fs.statSync(file);
      if (!stat.isFile()) throw new Error('Not a file');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    process.stdout.write(JSON.stringify({ port }) + '\n');
  });
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

function findBrowser() {
  const candidates = [
    process.env.SCEN_CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'google-chrome', 'chromium', 'chromium-browser', 'chrome', 'msedge'
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) return candidate;
    if (!path.isAbsolute(candidate)) {
      const check = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
      if (!check.error && check.status === 0) return candidate;
    }
  }
  throw new Error('Ingen Chrome/Chromium hittades. Sätt SCEN_CHROME till webbläsarens sökväg.');
}

function runBrowser(browser, url, profile) {
  return new Promise((resolve, reject) => {
    const child = spawn(browser, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--disable-component-update',
      `--user-data-dir=${profile}`, '--virtual-time-budget=15000', '--dump-dom', url
    ], { windowsHide: true });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`Webbläsaren avslutades med kod ${code}: ${stderr}`)));
  });
}

async function main() {
  const server = spawn(process.execPath, [__filename, '--server'], { windowsHide: true, stdio: ['ignore', 'pipe', 'inherit'] });
  try {
    const [chunk] = await once(server.stdout, 'data');
    const { port } = JSON.parse(String(chunk).trim().split(/\r?\n/)[0]);
    const profile = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'scen-smoke-'));
    try {
      const { stdout } = await runBrowser(findBrowser(), `http://127.0.0.1:${port}/__smoke__.html`, profile);
      const match = stdout.match(/data-smoke="([^"]+)"/);
      if (!match) throw new Error('Röktestet hann inte lämna något resultat. Appen startade sannolikt inte.');
      const result = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
      const checks = [
        [result.errors.length === 0, `JavaScript-fel: ${result.errors.join(' | ')}`],
        [!result.probeError, `Testproben misslyckades: ${result.probeError}`],
        [result.libraryReady && result.storeChip !== 'Ansluter…', `Biblioteket startade inte: ${result.storeChip}`],
        [result.indexStatus === 200 && result.indexCount === 8, `presentationer/index.json: status ${result.indexStatus}, antal ${result.indexCount}`],
        [result.repoCount === 8, `Förväntade 8 repopresentationer, hittade ${result.repoCount}`],
        [result.undoExists, '#btnUndo saknas'],
        [result.layerButtonCount === 6, `Förväntade 6 lagerknappar, hittade ${result.layerButtonCount}`],
        [result.copyButtonExists && result.editorOpened, 'Kunde inte öppna en repopresentation i editorn'],
        [result.previewExists && result.editorTitle, 'Editorvyn saknar preview eller titel']
      ];
      const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);
      if (failures.length) throw new Error(failures.join('\n'));
      console.log(`OK: browser start, ${result.repoCount} repopresentationer, editor, undo och ${result.layerButtonCount} lagerverktyg.`);
    } finally {
      fs.rmSync(profile, { recursive: true, force: true });
    }
  } finally {
    server.kill('SIGTERM');
  }
}

if (process.argv.includes('--server')) startServer();
else main().catch(error => { console.error(error.message || error); process.exitCode = 1; });
