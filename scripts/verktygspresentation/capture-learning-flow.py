"""Start with course → area → practice; capture optional support and coach afterwards.
The apps run locally with fictional accounts; no bank content is replaced.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import configure,fonts_css,launch
import importlib.util,time,sys

spec=importlib.util.spec_from_file_location('tour',Path(__file__).with_name('capture-tour.py'))
tour=importlib.util.module_from_spec(spec);spec.loader.exec_module(tour)
def shot(page,name,selectors):
    if 'button-only' not in sys.argv or name=='kg-st-ledtrad-knapp':
        tour.shot(page,name,selectors)

def center(page,selector):
    page.locator(selector).evaluate("el=>el.scrollIntoView({block:'center',behavior:'instant'})")

with sync_playwright() as p:
    b=launch(p);c=tour.context(b,fonts_css());page=c.new_page();epoch=time.monotonic();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('https://kunskapsgymmet.se/index.html',wait_until='domcontentloaded')
    page.wait_for_function('typeof selectCourse==="function" && typeof renderMathInElement==="function"')
    page.evaluate((tour.HERE/'kg-demo.js').read_text())
    page.evaluate('demo.assigned=false')
    page.evaluate("""()=>{session={access_token:'local-demo-only',user:{id:'demo-student',user_metadata:{full_name:'Alva Berg'}}};
      arGruppLarare=false;arLarare=false;arElevRoll=true;profile.xp=560;profile.attempts=28;profile.correct=21;profile.namn='Alva B';
      state.minKlass={id:41,namn:'NA26a'};markeraUppfylldaMedaljer();renderHome();}""")
    page.wait_for_selector('#egna-kurser');page.wait_for_function("!document.querySelector('.provkort')")
    shot(page,'kg-bas-start',{'kurser':'#egna-kurser','ingang':'.hero-inloggad'})
    center(page,'#course-fy1')
    shot(page,'kg-bas-kursval',{'fysik':'#course-fy1','kurser':'#egna-kurser'})
    page.locator('#course-fy1').click();page.wait_for_selector('.chapter-head')
    page.wait_for_function("!document.querySelector('.pt [aria-busy=true]')")
    chapter=page.locator('.chapter-head:has(.name:text-is("Rörelse"))')
    center(page,'.chapter-head:has(.name:text-is("Rörelse"))')
    shot(page,'kg-bas-kapitel',{'knapp':'.chapter-head:has(.name:text-is("Rörelse"))'})
    chapter.click()
    center(page,"[onclick=\"startCard('st_diagram')\"]")
    shot(page,'kg-bas-omrade',{'knapp':"[onclick=\"startCard('st_diagram')\"]",'omraden':'.chapter.open:has([data-kap="3"])'})
    # Select a real bank task within the tutorial's training family.
    page.evaluate("""()=>{const original=chooseTask;let first=true;chooseTask=()=>{
      if(first){first=false;const task=availableTasks().find(t=>t.id==='3.242');if(!task)throw Error('Missing s–t example');return task;}
      return original();};}""")
    page.locator("[onclick=\"startCard('st_diagram')\"]").click();page.wait_for_selector('#kollaknapp')
    page.wait_for_timeout(150)
    if page.locator('#cheer.show').count():
        page.locator('#cheer.show button').click();page.wait_for_function('document.getElementById("cheer").innerHTML===""')
    assert page.evaluate('state.currentTask.id')=='3.242'
    page.evaluate('scrollTo(0,0)')
    shot(page,'kg-st-uppgift',{'uppgift':'article.task','graf':'article.task .fig svg','svar':'#ans-0','xp':'.xpmeter'})
    center(page,'#ledtradknapp')
    shot(page,'kg-st-ledtrad-knapp',{'knapp':'#ledtradknapp','graf':'article.task .fig svg'})
    if 'button-only' in sys.argv:
        assert not errors,errors
        c.close();b.close();sys.exit(0)
    page.locator('#ledtradknapp').click();page.wait_for_timeout(1700)
    center(page,'#ledtrad-holder')
    shot(page,'kg-st-ledtrad',{'ledtrad':'#ledtrad-holder','graf':'article.task .fig svg','svar':'#ans-0','kontrollera':'#kollaknapp'})
    # Keep graph, input and check button visible together for the recording.
    page.evaluate('scrollTo(0,180)');page.locator('#ans-0').fill('3,5');tour.cursor(page)
    page.wait_for_timeout(650);start=time.monotonic()-epoch
    page.wait_for_timeout(850)
    box=page.locator('#kollaknapp').bounding_box()
    page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2,steps=20)
    before=page.evaluate('profile.xp');page.locator('#kollaknapp').click();page.wait_for_timeout(3000)
    clip_end=time.monotonic()-epoch
    assert 'Rätt!' in page.locator('#answer-result').inner_text()
    after=page.evaluate('profile.xp');assert after>before
    video=page.video.path()
    page.evaluate("document.getElementById('demo-pointer')?.remove()")
    center(page,'#answer-result')
    shot(page,'kg-st-ratt',{'aterkoppling':'#answer-result','xp':'.xpmeter','losning':'button:text-is("Visa lösning")','graf':'article.task .fig svg'})
    page.get_by_role('button',name='Visa lösning',exact=True).click()
    center(page,'#solution-holder')
    shot(page,'kg-st-losning',{'losning':'#solution-holder','graf':'article.task .fig svg'})
    page.evaluate('scrollTo(0,0)')
    shot(page,'kg-st-avsluta',{'knapp':'button:has-text("Avsluta")'})
    page.get_by_role('button',name='Avsluta',exact=False).click();page.wait_for_selector('.topppill')
    page.evaluate('scrollTo(0,0)')
    shot(page,'kg-st-till-topplista',{'knapp':'.topppill'})
    # Optional support follows the first completed example in the presentation.
    guide=page.locator('.kap-kunskap[data-kap="3"]')
    center(page,'.kap-kunskap[data-kap="3"]')
    shot(page,'kg-st-genomgang-knapp',{'knapp':'.kap-kunskap[data-kap="3"]'})
    guide.click();page.wait_for_selector('#kunskapInnehall .gg-steg')
    shot(page,'kg-st-bladdra',{'knapp':'button[aria-label="Nästa genomgång"]','rubrik':'.typ-familj','position':'.typ-topnav'})
    for _ in range(4):
        page.get_by_role('button',name='Nästa genomgång',exact=True).click();page.wait_for_timeout(150)
    assert page.locator('.typ-familj').inner_text()=='Läs ett läge–tid-diagram'
    shot(page,'kg-st-genomgang',{'rubrik':'.typ-familj','graf':'.typ-block.fraga','princip':'.gg-ram'})
    center(page,'#kunskapInnehall .typ-block.losning')
    shot(page,'kg-st-genomgang-losning',{'steg':'.gg-lista','svar':'.gg-svar','komihag':'.gg-ruta.bar','trana':'.typ-nav .primary'})
    page.locator('#kunskapsruta .modal-kort').evaluate('el=>el.scrollTop=0')
    shot(page,'kg-bas-stang-genomgang',{'knapp':'#kunskapsruta button[aria-label="Stäng"]'})
    page.locator('#kunskapsruta button[aria-label="Stäng"]').click();page.evaluate('scrollTo(0,0)')
    shot(page,'kg-bas-tranare-knapp',{'knapp':'button[onclick="oppnaPt()"]','trana':'.pt'})
    page.locator('button[onclick="oppnaPt()"]').click()
    shot(page,'kg-kurs',{'bok':'.ub-omslag','trana':'.pt','kurs':'.chead','byt':'button:has-text("Byt pass")','forslag':'.pt-msg','start':'.pt-act','fokus':'.pt-fokus'})
    page.get_by_role('button',name='Byt pass',exact=True).click()
    shot(page,'kg-tranare-val',{'val':'.pt-val','grund':'button:has-text("Grundpass")'})
    page.get_by_role('button',name='Grundpass',exact=False).click()
    shot(page,'kg-tranare-bok',{'bok':'.ub-omslag'})
    page.get_by_role('button',name='Öppna uppdragsboken',exact=False).click();page.wait_for_timeout(600)
    shot(page,'kg-uppdragsbok',{'bok':'.ub-volym','huvud':'.ub-vanster .ub-uppgift','uppdrag':'.ub-hoger','datum':'.ub-nav'})
    page.get_by_role('button',name='Stäng uppdragsboken',exact=True).click();page.evaluate('scrollTo(0,0)')
    shot(page,'kg-st-till-topplista',{'knapp':'.topppill'})
    page.evaluate("""()=>{hamtaTopplista=async()=>({plats:3,rader:[
      {namn:'Nora H',xp:860,totalxp:2960,uppgifter:28,medaljer:['xp1000']},
      {namn:'Amir D',xp:740,totalxp:2340,uppgifter:25,medaljer:['xp1000']},
      {namn:'Alva B',xp:profile.xp-300,totalxp:profile.xp,uppgifter:21,medaljer:[]},
      {namn:'Leo N',xp:240,totalxp:1540,uppgifter:19,medaljer:[]},
      {namn:'Mira E',xp:180,totalxp:1480,uppgifter:17,medaljer:[]}]});
      hamtaKlasstopplista=async()=>({summa:true,tak:1200,minKlass:41,rader:[{id:41,namn:'NA26a',elever:24,aktiva:21,poang:12640},{id:42,namn:'TE26a',elever:22,aktiva:19,poang:11320},{id:43,namn:'NA26b',elever:25,aktiva:20,poang:10780}]});}""")
    page.get_by_role('button',name='Topplistan',exact=True).click();page.wait_for_selector('.topprad');page.evaluate('scrollTo(0,0)')
    shot(page,'kg-topplista',{'period':'.flikar','lista':'.topplista','synlighet':'.toppnotis','vyer':'.toppvy','klasser':'[role="tab"]:has-text("Klasser")'})
    page.get_by_role('tab',name='Klasser',exact=True).click();page.wait_for_selector('.klasslista')
    shot(page,'kg-klasstopp',{'lista':'.klasslista','vyer':'.toppvy','period':'.flikar'})
    page.evaluate('demo.assigned=true;provLista=null;renderHome()');page.wait_for_selector('.provkort')
    shot(page,'kg-bas-tilldelat',{'pass':'.provkort','start':'.provkort .primary'})
    c.close()
    tour.encode(video,[('kg-st-svara-xp',start,clip_end)])
    print('XP',before,after,'ERRORS',errors,flush=True)
    assert not errors,errors
    b.close()
