from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import ROOT, configure, fonts_css, launch, shot
import json

HERE=Path(__file__).resolve().parent
css=fonts_css()
with sync_playwright() as p:
    browser=launch(p)
    context=browser.new_context(viewport={'width':1440,'height':900},device_scale_factor=2,locale='sv-SE')
    configure(context,css)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        page.goto('https://uppgiftslabbet.se/index.html',wait_until='domcontentloaded')
        page.wait_for_function('typeof grindÖppna === "function" && typeof renderMathInElement === "function"')
        page.evaluate((HERE/'ul-demo.js').read_text())
        shot(page,'ul-01-kurser')
        page.locator('.kurskort[data-kurs="fy1"]').click()
        page.wait_for_function("typeof DB!=='undefined' && DB?.bank?.length>0")
        page.locator('.kapgrupp').filter(has=page.locator('[data-omr="5:arbete"]')).locator('.kaprad').click()
        for area in ['arbete','rorelseenergi','effekt']:
            page.locator('[data-omr="5:'+area+'"]').click()
        assert page.locator('#lista .kort').count()>0
        shot(page,'ul-02-uppgiftsbank')
        print('BANK',page.evaluate("DB.bank.filter(q=>['arbete','rorelseenergi','effekt'].includes(q.omr)&&q.niva==='E'&&q.t.includes('<svg')).slice(0,5).map(q=>({id:q.id,text:q.t.slice(0,300)}))"),flush=True)
        page.evaluate("""()=>{const chosen=['5.53','5.36','5.42'].map(id=>DB.bank.find(q=>q.id===id));
          state.blad=chosen.map(djupKopia);document.getElementById('bTitel').value='Energi i vardagen';
          document.getElementById('bKlass').value='NA26a';ritaBlad();rita();}""")
        shot(page,'ul-03-ovningsblad')
        page.locator('#taMedFacit').uncheck()
        page.locator('#oppnaLayout').click()
        page.wait_for_selector('#layoutred:not([hidden])')
        shot(page,'ul-04-redigera-dokument')
        shot(page,'ul-layout-detalj','.lr-dialog')
        page.locator('#lrFacit').check()
        shot(page,'ul-05-med-facit')
        page.locator('#lrFacit').uncheck()
        page.locator('#lrKlar').click()
        page.locator('[data-redigera-blad="0"]').click()
        shot(page,'ul-06-redigera-uppgift')
        shot(page,'ul-uppgift-detalj','.ru-dialog')
        page.locator('#ruAvbryt').click()
        page.evaluate("""()=>{Object.assign(DELNING,{id:'demo-energi',namn:'Energi i vardagen',roll:'agare',kurs:'fy1',medlemmar:2,
          aktiva:['Sara Ek'],fel:null,skickar:false,revision:2});delningRitaStatus();}""")
        page.locator('#delaDokument').click()
        page.wait_for_selector('.ul-kollega')
        shot(page,'ul-07-dela-kollegor')
        shot(page,'ul-dela-detalj','#delamodal .sparmodal-kort')
        page.locator('#delamodalStang').click()
        page.evaluate('minaÖppna()')
        page.wait_for_selector('[data-mina-oppna="demo-geometri"]')
        shot(page,'ul-08-mina-dokument')
        shot(page,'ul-bibliotek-detalj','#minamodal .sparmodal-kort')
        print('ERRORS',json.dumps(errors),flush=True)
        assert not errors,errors
    except Exception:
        page.screenshot(path='/tmp/capture-ul-failure.png',full_page=True)
        Path('/tmp/capture-ul-failure.txt').write_text(page.locator('body').inner_text())
        raise
    finally:
        browser.close()
