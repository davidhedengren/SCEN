"""Capture complete coach speech, study aids, tutorials and individual teacher statistics."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import configure,fonts_css,launch
import importlib.util,sys
spec=importlib.util.spec_from_file_location('tour',Path(__file__).with_name('capture-tour.py'))
tour=importlib.util.module_from_spec(spec);spec.loader.exec_module(tour)
shot=tour.shot

def dismiss(page):
    page.wait_for_timeout(150)
    if page.locator('#cheer.show').count():
        page.locator('#cheer.show button').click()
        page.wait_for_function('document.getElementById("cheer").innerHTML === ""')

with sync_playwright() as p:
    browser=launch(p)
    c=browser.new_context(viewport={'width':1600,'height':900},device_scale_factor=2,locale='sv-SE',timezone_id='Europe/Stockholm')
    configure(c,fonts_css());page=c.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('https://kunskapsgymmet.se/index.html',wait_until='domcontentloaded')
    page.wait_for_function('typeof larStartKlasser === "function" && typeof renderMathInElement === "function"')
    page.evaluate((tour.HERE/'kg-demo.js').read_text())
    if 'teacher' not in sys.argv:
        page.evaluate("""()=>{session={access_token:'local-demo-only',user:{id:'demo-student',user_metadata:{full_name:'Alva Berg'}}};
          arGruppLarare=false;arLarare=false;arElevRoll=true;profile.xp=560;profile.attempts=28;profile.correct=21;profile.namn='Alva B';
          state.minKlass={id:41,namn:'NA26a'};markeraUppfylldaMedaljer();renderHome();}""")
        page.evaluate("selectCourse('fy1')");page.wait_for_selector('.ub-omslag')
        shot(page,'kg-kurs',{'bok':'.ub-omslag','trana':'.pt','kurs':'.chead','byt':'button:has-text("Byt pass")','forslag':'.pt-msg','start':'.pt-act','fokus':'.pt-fokus'})
        page.get_by_role('button',name='Byt pass',exact=True).click()
        shot(page,'kg-tranare-val',{'val':'.pt-val','grund':'button:has-text("Grundpass")'})
        page.get_by_role('button',name='Grundpass',exact=False).click()
        shot(page,'kg-tranare-bok',{'bok':'.ub-omslag'})
        # First chapter is already open; the button is below the coach on the same page.
        guide=page.locator('.kap-kunskap:visible').first
        guide.scroll_into_view_if_needed()
        shot(page,'kg-genomgang-knapp',{'knapp':'.kap-kunskap:visible'})
        guide.click();page.wait_for_selector('#kunskapInnehall .gg-steg')
        shot(page,'kg-genomgang',{'innehall':'#kunskapInnehall','steg':'.gg-steg','stang':'#kunskapsruta button[aria-label="Stäng"]'})
        page.locator('#kunskapsruta button[aria-label="Stäng"]').click()
        # Separate mathematics example: formula sheets exist for mathematics courses.
        page.locator('.brand').click();page.wait_for_selector('#egna-kurser')
        page.locator('[onclick*=ma2]').first.scroll_into_view_if_needed()
        shot(page,'kg-matte-val',{'knapp':'[onclick*=ma2]'})
        page.locator('[onclick*=ma2]').first.click();page.wait_for_selector('.pt')
        shot(page,'kg-matte-kurs',{'start':'.pt-act .primary','kurs':'.chead'})
        page.evaluate("""()=>{const original=chooseTask;chooseTask=()=>{const t=availableTasks().find(t=>t['miniräknare']===true && expectedAnswersForTask(t).auto);return t||original();};}""")
        page.locator('.pt-act .primary').click();page.wait_for_selector('[data-hjalp=formel]');dismiss(page)
        page.locator('[data-hjalp=raknare]').scroll_into_view_if_needed()
        shot(page,'kg-hjalpmedel',{'raknare':'[data-hjalp=raknare]','formel':'[data-hjalp=formel]','uppgift':'article.task'})
        page.locator('[data-hjalp=raknare]').click();page.wait_for_selector('#hm-raknare')
        shot(page,'kg-miniraknare',{'raknare':'#hm-raknare','stang':'button[aria-label="Stäng miniräknaren"]','formel':'[data-hjalp=formel]'})
        page.get_by_role('button',name='Stäng miniräknaren',exact=True).click()
        shot(page,'kg-formel-knapp',{'knapp':'[data-hjalp=formel]'})
        page.locator('[data-hjalp=formel]').click()
        page.wait_for_selector('#hp-sidor canvas',timeout=60000)
        page.wait_for_timeout(1500)
        shot(page,'kg-formelblad',{'blad':'#hm-formel','verktyg':'#hm-formel .hmf-topp'})
    # Individual student view, reached through the group's actual Elever tab.
    page.evaluate((tour.HERE/'kg-demo.js').read_text());page.evaluate('larTranaSjalv();larStartKlasser()');page.wait_for_selector('.larkort')
    page.locator('.larkort').filter(has_text='NA26a').click();page.wait_for_selector('.larstat')
    page.get_by_role('button',name='Elever',exact=True).scroll_into_view_if_needed()
    shot(page,'kg-elever-flik',{'knapp':'button:text-is("Elever")'})
    page.get_by_role('button',name='Elever',exact=True).click();page.wait_for_selector('.lartabell')
    page.locator('[onclick="larValjElev(\'demo-0\')"]').scroll_into_view_if_needed()
    shot(page,'kg-valj-elev',{'elev':'[onclick="larValjElev(\'demo-0\')"]','lista':'.lartabell'})
    page.locator('[onclick="larValjElev(\'demo-0\')"]').click();page.wait_for_selector('.larkolumner')
    page.locator('#larkurs-0').scroll_into_view_if_needed()
    shot(page,'kg-individ',{'aktivitet':'.laraktivitet','svagt':'.larkolumner>div:first-child','starkt':'.larkolumner>div:last-child','alla':'.laralla summary','statistik':'.larstat'})
    page.locator('.laralla summary').click();page.evaluate("document.querySelector('.laralla').scrollIntoView({block:'center',behavior:'instant'})")
    shot(page,'kg-individ-alla',{'omraden':'.laralla','forklaring':'#larkurs-0 > div > p','tillbaka':'.larbak','riktat':'.lar-elevpass'})
    page.locator('.larbak').scroll_into_view_if_needed()
    shot(page,'kg-individ-tillbaka',{'knapp':'.larbak'})
    page.locator('.larbak').click();page.wait_for_selector('.lartabell')
    shot(page,'kg-omraden-fran-elev',{'knapp':'button:text-is("Gruppens statistik per område")'})
    assert not errors,errors
    print('ERRORS',errors,flush=True)
    browser.close()
