"""Browser regression checks for the reusable guided mode and focus-triggered video."""
from playwright.sync_api import sync_playwright
from browser import launch

with sync_playwright() as p:
    browser=launch(p)
    for theme,motion in [('djup','no-preference'),('klassrum','no-preference'),('djup','reduce')]:
        c=browser.new_context(viewport={'width':1280,'height':720},reduced_motion=motion)
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://127.0.0.1:5173/') else r.abort())
        page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://127.0.0.1:5173/dist/kunskapsgymmet-och-uppgiftslabbet.html')
        page.evaluate("""theme=>{window.d=JSON.parse(document.getElementById('scen-data').textContent);
          d.theme.id=theme;window.tour=d.slides.find(s=>s.imageDirection?.mode==='guided'&&!s.video);
          tour={...tour,title:'En lång rubrik om att orientera sig i en komplex helbild',items:[
            'a | Övre vänstra hörnet | 10 | 10 | 12 | 12 | Ett litet område.',
            'b | Nedre högra hörnet | 90 | 90 | 12 | 12 | Ett annat område.',
            'c | En lång etikett som ska få plats | 50 | 45 | 60 | 50 | En längre förklaring som beskriver en central del av samma bild utan att lämna kontexten.']};
          const film=d.slides.find(s=>s.video);d.slides=[tour,film,{...tour,steps:false}];
          window.pv=Scen.player(document.getElementById('scen-root'),d,{mode:'present',images:d.images,hint:false});}""",theme)
        for step in range(1,5):
            page.evaluate('pv.next()');page.wait_for_timeout(1300 if motion=='no-preference' else 100)
            slide=page.locator('.sc-deck > .slide').nth(0)
            if step<4:
                box=slide.locator('.ir-guided-frame').bounding_box()
                assert box['x']>=-2 and box['y']>=-2 and box['x']+box['width']<=1282 and box['y']+box['height']<=722,box
                assert slide.locator('.ir-detail.dramaturgy-current').count()==1
                if motion=='reduce':assert slide.locator('.ir-camera').evaluate('(x)=>getComputedStyle(x).transitionDuration')=='0s'
            else:
                assert slide.get_attribute('data-dramaturgy-state')=='restored'
                assert float(slide.locator('.ir-guided-frame').evaluate('(x)=>getComputedStyle(x).opacity'))==0
        page.evaluate('pv.prev()');assert page.locator('.sc-deck > .slide').nth(0).get_attribute('data-dramaturgy-state')=='focus'
        page.evaluate('pv.go(2)');assert page.evaluate('pv.steps()')==0
        assert page.locator('.sc-deck > .slide').nth(2).get_attribute('data-dramaturgy-state')=='restored'
        page.evaluate('pv.go(1)');v=page.locator('.sc-deck > .slide').nth(1).locator('video')
        assert v.evaluate('(v)=>v.paused&&!v.getAttribute("src")')
        page.evaluate('pv.next()');page.wait_for_timeout(1500)
        assert v.evaluate('(v)=>!v.paused&&v.currentTime>0&&v.videoWidth>0')
        page.evaluate('pv.prev()');page.wait_for_timeout(100)
        assert v.evaluate('(v)=>v.paused&&v.currentTime===0')
        page.evaluate('pv.next()');page.wait_for_timeout(500);page.evaluate('pv.go(0)')
        assert v.evaluate('(v)=>v.paused')
        assert not errors,errors
        print('PASS',theme,motion,'corners, frame, restore, backwards, static, film start/reset/exit',flush=True)
        c.close()
    browser.close()
