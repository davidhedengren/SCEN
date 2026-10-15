"""Shared browser setup. Screenshots use real apps and isolated demonstration data."""
from pathlib import Path
import hashlib
import json
import urllib.request
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path('/workspace/.onboarding/cache')
CACHE.mkdir(parents=True, exist_ok=True)

def fetch(url):
    key = CACHE / hashlib.sha256(url.encode()).hexdigest()
    if not key.exists():
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
            key.write_bytes(data)
            key.with_suffix('.type').write_text(response.headers.get('Content-Type', 'application/octet-stream'))
    return key.read_bytes(), key.with_suffix('.type').read_text()

def fonts_css(only=None):
    families = {'Instrument Sans':'instrument-sans', 'Atkinson Hyperlegible':'atkinson-hyperlegible',
                'IBM Plex Mono':'ibm-plex-mono', 'Familjen Grotesk':'familjen-grotesk', 'Hanken Grotesk':'hanken-grotesk'}
    css = []
    for name, package in families.items():
        if only and package not in only:
            continue
        version = '5.3.0'
        for weight in ([400,700] if package == 'atkinson-hyperlegible' else [400,500,600,700]):
            url = f'https://cdn.jsdelivr.net/npm/@fontsource/{package}@{version}/files/{package}-latin-{weight}-normal.woff2'
            data, _ = fetch(url)
            import base64
            css.append(f'@font-face{{font-family:"{name}";font-style:normal;font-weight:{weight};font-display:block;src:url(data:font/woff2;base64,{base64.b64encode(data).decode()}) format("woff2");}}')
    return '\n'.join(css)

def configure(context, css):
    def route(r):
        u = r.request.url
        if 'supabase.co' in u:
            r.abort()
        elif urlsplit(u).hostname in ('kunskapsgymmet.se','uppgiftslabbet.se'):
            # Present the canonical origin, serving the checked-out files locally.
            # No requests, including writes, are sent to the public websites.
            parts=urlsplit(u)
            port=8083 if parts.hostname=='kunskapsgymmet.se' else 8082
            if r.request.method!='GET':
                r.abort()
                return
            with urllib.request.urlopen(f'http://127.0.0.1:{port}{parts.path or "/"}'+('?' + parts.query if parts.query else ''),timeout=30) as response:
                r.fulfill(status=response.status,content_type=response.headers.get('Content-Type','application/octet-stream'),body=response.read())
        elif 'fonts.googleapis.com' in u:
            r.fulfill(status=200, content_type='text/css', body=css)
        elif u.startswith(('http://127.0.0.1:', 'data:', 'blob:', 'file:')):
            r.continue_()
        elif u.startswith('https://cdn.jsdelivr.net/'):
            body, kind = fetch(u)
            r.fulfill(status=200, content_type=kind, body=body)
        else:
            r.abort()
    context.route('**/*', route)
    context.add_init_script("localStorage.setItem('kunskapsgymmet-beta-info','2'); localStorage.setItem('kunskapsgymmet-theme','light');")

def launch(p):
    return p.chromium.launch(executable_path='/workspace/.onboarding/bin/chromium-cloud')

def shot(page, name, selector=None):
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(400)
    dest = ROOT / 'bilder/verktygspresentation' / (name+'.png')
    (page.locator(selector) if selector else page).screenshot(path=str(dest), animations='disabled')
    print('CAPTURE', name, flush=True)
