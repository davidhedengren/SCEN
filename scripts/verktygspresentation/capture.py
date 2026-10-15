"""Run with the three local servers from the environment startup instructions."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import ROOT, configure, fonts_css, launch, shot
import json
import sys

HERE = Path(__file__).resolve().parent
css = fonts_css()
print('Fonts available', flush=True)
with sync_playwright() as p:
    browser = launch(p)
    context = browser.new_context(viewport={'width':1440,'height':900}, device_scale_factor=2, locale='sv-SE')
    configure(context, css)
    page = context.new_page()
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    try:
        page.goto('https://kunskapsgymmet.se/index.html', wait_until='domcontentloaded')
        page.wait_for_function('typeof larStartKlasser === "function" && typeof renderMathInElement === "function"')
        page.evaluate((HERE/'kg-demo.js').read_text())
        page.wait_for_selector('.larkort')
        shot(page,'kg-01-min-undervisning')
        page.locator('.larkort').filter(has_text='NA26a').click()
        page.wait_for_selector('.larstat')
        shot(page,'kg-02-gruppoversikt')
        page.get_by_role('button',name='Skapa träningspass',exact=True).click()
        page.wait_for_selector('#prov-titel')
        page.locator('#prov-titel').fill('Energi i vardagen')
        page.evaluate("provSkapa.omraden=['arbete','rorelseenergi','effekt'];provSkapa.antal=15;provSkapa.datum='2026-10-23';provRitaSkapa()")
        shot(page,'kg-03-skapa-pass')
        box=page.locator('.provform').bounding_box()
        page.screenshot(path=str(ROOT/'bilder/verktygspresentation/kg-formular-detalj.png'),clip={**box,'height':min(box['height'],510)},animations='disabled')
        page.locator('.provkap').filter(has_text='Arbete och lägesenergi').scroll_into_view_if_needed()
        shot(page,'kg-04-valj-innehall')
        shot(page,'kg-innehall-detalj', '.provkap:has([onclick="provVaxlaOmrade(\'arbete\')"])')
        page.evaluate('provSkapaSkicka()')
        page.wait_for_selector('.provklar')
        shot(page,'kg-05-pass-delat')
        shot(page,'kg-delat-detalj','.provklar')
        page.get_by_role('button',name='Klar',exact=True).click()
        page.locator('[data-pass-id="91"] summary').first.click()
        page.wait_for_selector('.provres-topp')
        page.locator('.provrad').scroll_into_view_if_needed()
        shot(page,'kg-06-passresultat')
        shot(page,'kg-resultat-detalj','.provrad')
        page.locator('.laralla summary').click()
        page.locator('.laralla').scroll_into_view_if_needed()
        page.screenshot(path=str(ROOT/'bilder/verktygspresentation/kg-pass-elever-detalj.png'),clip={**page.locator('.laralla').bounding_box(),'height':480},animations='disabled')
        page.evaluate("larStartKlasser();")
        page.wait_for_selector('.larkort')
        page.locator('.larkort').filter(has_text='NA26a').click()
        page.get_by_role('button',name='Gruppens statistik per område',exact=True).click()
        page.wait_for_selector('#laromr .provres')
        shot(page,'kg-07-omradesstatistik')
        shot(page,'kg-omraden-detalj','#largruppkropp')
        page.get_by_role('button',name='Elever',exact=True).click()
        page.wait_for_selector('.lartabell')
        shot(page,'kg-08-elever')
        shot(page,'kg-elever-detalj','#largruppkropp')
        page.evaluate("""()=>{session={access_token:'local-demo-only',user:{id:'demo-student',user_metadata:{full_name:'Alva Berg'}}};
          arGruppLarare=false;arLarare=false;arElevRoll=true;state.course=null;provLista=null;renderHome();}""")
        page.wait_for_selector('.provkort')
        shot(page,'kg-09-elevens-pass')
        shot(page,'kg-elevpass-detalj','.provkort')
        page.evaluate("""()=>{const original=chooseTask;let first=true;chooseTask=()=>{
          if(first){first=false;const task=availableTasks().find(t=>t.id==='5.523a');if(task)return task;}
          return original();};}""")
        page.evaluate('provStarta(91)')
        page.wait_for_selector('#kollaknapp')
        print('TASK',page.evaluate('({id:state.currentTask.id,text:state.currentTask.t,answers:expectedAnswersForTask(state.currentTask)})'),flush=True)
        shot(page,'kg-10-traning')
        shot(page,'kg-uppgift-detalj','article.task')
        page.evaluate('visaLedtrad()')
        shot(page,'kg-11-ledtrad')
        shot(page,'kg-ledtrad-detalj','article.task')
        # A real answer through the app's answer checker.
        page.evaluate("""()=>{const info=expectedAnswersForTask(state.currentTask);
          info.answers.forEach((answer,i)=>{const input=document.getElementById('ans-'+i);if(input) input.value=String(Number(Number(answer).toPrecision(3))).replace('.',',');});
          checkAnswer();}""")
        assert 'Rätt!' in page.locator('#answer-result').inner_text()
        shot(page,'kg-12-aterkoppling')
        shot(page,'kg-svar-detalj','article.task')
        page.evaluate('showSolution()')
        page.locator('#solution-holder').scroll_into_view_if_needed()
        shot(page,'kg-13-losning')
        shot(page,'kg-losning-detalj','#solution-holder')
        print('ERRORS',json.dumps(errors),flush=True)
        assert not errors, errors
    except Exception:
        page.screenshot(path='/tmp/capture-failure.png',full_page=True)
        Path('/tmp/capture-failure.txt').write_text(page.locator('body').inner_text())
        raise
    finally:
        browser.close()
