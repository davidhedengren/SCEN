"""Exercise every scene and click state in the actual SCEN player."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import configure, fonts_css, launch
import json

OUT=Path('/workspace/.onboarding/presentation-review')
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=launch(p)
    context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1)
    # The packaged export must load without contacting external services.
    external=[]
    def offline_route(route):
        if route.request.url.startswith('http://127.0.0.1:5173/'):
            route.continue_()
        else:
            external.append(route.request.url)
            route.abort()
    context.route('**/*',offline_route)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:5173/dist/kunskapsgymmet-och-uppgiftslabbet.html',wait_until='domcontentloaded')
    page.evaluate("""()=>{window.qaDeck=JSON.parse(document.getElementById('scen-data').textContent);
      window.qaPlayer=Scen.player(document.getElementById('scen-root'),qaDeck,{mode:'present',images:qaDeck.images,speaker:true});}""")
    page.evaluate('document.fonts.ready')
    page.mouse.move(0,0)
    report=[]
    for index in range(page.evaluate('qaDeck.slides.length')):
        page.evaluate('(i)=>qaPlayer.go(i)',index)
        page.wait_for_timeout(950)
        slide=page.locator('.sc-deck > .slide').nth(index)
        count=page.evaluate('qaPlayer.steps()')
        for step in range(count+1):
            if step:
                page.evaluate('qaPlayer.next()')
                page.wait_for_timeout(700)
            missing=slide.locator('img').evaluate_all('(imgs)=>imgs.filter(x=>!x.complete||!x.naturalWidth).map(x=>x.alt)')
            assert not missing,(index,step,missing)
            overflow=slide.locator('.lyr-t').evaluate_all('(nodes)=>nodes.filter(x=>x.scrollHeight>x.closest(".lyr").clientHeight+3||x.scrollWidth>x.closest(".lyr").clientWidth+3).map(x=>x.textContent)')
            assert not overflow,(index,step,overflow)
            page.screenshot(path=str(OUT/f'{index+1:02d}-{step:02d}.png'))
            report.append({'scene':index+1,'step':step,'images':slide.locator('img').count()})
        print('SCENE',index+1,'STEPS',count,flush=True)
    assert not errors,errors
    assert not external,external
    (OUT/'results.json').write_text(json.dumps({'states':report,'errors':errors,'externalRequests':external},indent=2))
    browser.close()
