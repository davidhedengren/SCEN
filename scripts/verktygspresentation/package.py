"""Make SCEN's generated presentation self-contained, including licensed fonts."""
from browser import ROOT, fetch, fonts_css
import json
import re

target=ROOT/'dist/kunskapsgymmet-och-uppgiftslabbet.html'
html=target.read_text()
html=re.sub(r'<link[^>]+href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>', '', html)
html=re.sub(r'<style id="presentation-fonts">.*?</style>', '', html, flags=re.S)
html=re.sub(r'<script type="application/json" id="presentation-font-licenses">.*?</script>', '', html, flags=re.S)
families=['familjen-grotesk','hanken-grotesk']
licenses={}
for family in families:
    license_text,_=fetch(f'https://cdn.jsdelivr.net/npm/@fontsource/{family}@5.3.0/LICENSE')
    licenses[family+' 5.3.0']=license_text.decode()
    (ROOT/'docs/verktygspresentation'/('LICENSE-'+family+'.txt')).write_text(license_text.decode())
bundle='<style id="presentation-fonts">'+fonts_css(families)+'</style>'
bundle+='<script type="application/json" id="presentation-font-licenses">'+json.dumps(licenses).replace('<','\\u003c')+'</script>'
html=html.replace('</head>',bundle+'</head>',1)
target.write_text(html)
assert 'href="https://fonts.' not in html
print(f'{target.name}: {target.stat().st_size/1024/1024:.1f} MiB; images, fonts and licenses embedded.')
