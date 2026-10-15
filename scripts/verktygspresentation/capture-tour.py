"""Whole 16:9 browser views and recordings of actual UI actions, with local demo data."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import ROOT, configure, fonts_css, launch
import json, time, subprocess, sys

HERE=Path(__file__).resolve().parent
OUT=ROOT/'bilder/verktygspresentation/vandring'
OUT.mkdir(parents=True,exist_ok=True)
TMP=Path('/workspace/.onboarding/tour-video');TMP.mkdir(exist_ok=True)
W,H=1600,900
metadata=json.loads((OUT/'regions.json').read_text()) if (OUT/'regions.json').exists() else {}

def shot(page,name,selectors):
    page.evaluate('document.fonts.ready');page.wait_for_timeout(500)
    page.screenshot(path=str(OUT/(name+'.png')),animations='disabled')
    regions={}
    for key,sel in selectors.items():
        loc=page.locator(sel).first
        if not loc.count() or not loc.is_visible():continue
        b=loc.bounding_box()
        x=max(0,b['x']-8);y=max(0,b['y']-8)
        right=min(W,b['x']+b['width']+8);bottom=min(H,b['y']+b['height']+8)
        if right>x and bottom>y:
            regions[key]=[round((x+right)/2/W*100,2),round((y+bottom)/2/H*100,2),round((right-x)/W*100,2),round((bottom-y)/H*100,2)]
    metadata[name]=regions
    (OUT/'regions.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
    print('SHOT',name,regions,flush=True)

def cursor(page):
    # A pointer marker for the recording only; app state and controls are untouched.
    page.evaluate("""()=>{const c=document.createElement('div');c.id='demo-pointer';
      c.style.cssText='position:fixed;z-index:2147483647;width:22px;height:22px;border:3px solid #ed813f;border-radius:50%;background:#ffca8040;pointer-events:none;transform:translate(-50%,-50%);left:-50px;top:-50px';document.body.append(c);
      const move=e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'};
      document.addEventListener('mousemove',move,true);document.addEventListener('dragover',move,true);} """)

def encode(video,clips):
    for name,start,end in clips:
        dest=OUT/(name+'.mp4')
        subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(max(0,start)), '-i',str(video),'-t',str(end-start),'-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)],check=True)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(dest),'-frames:v','1',str(OUT/(name+'.png'))],check=True)
        print('FILM',name,round(end-start,1),flush=True)

def context(browser,css):
    c=browser.new_context(viewport={'width':W,'height':H},device_scale_factor=2,locale='sv-SE',timezone_id='Europe/Stockholm',record_video_dir=str(TMP),record_video_size={'width':W,'height':H})
    configure(c,css)
    return c

def kg(browser,css):
    c=context(browser,css);page=c.new_page();epoch=time.monotonic();clips=[];errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('https://kunskapsgymmet.se/index.html',wait_until='domcontentloaded')
    page.wait_for_function('typeof larStartKlasser === "function" && typeof renderMathInElement === "function"')
    page.evaluate((HERE/'kg-demo.js').read_text())
    page.evaluate("""()=>{session={access_token:'local-demo-only',user:{id:'demo-student',user_metadata:{full_name:'Alva Berg'}}};
      arGruppLarare=false;arLarare=false;arElevRoll=true;profile.xp=560;profile.attempts=28;profile.correct=21;profile.namn='Alva B';profile.visaTopplista=true;
      state.minKlass={id:41,namn:'NA26a'};markeraUppfylldaMedaljer();renderHome();}""")
    page.wait_for_selector('.provkort')
    shot(page,'kg-start',{'pass':'.provkort','kurser':'#egna-kurser','meny':'.topbar','xp':'.xppill'})
    page.evaluate("window.scrollTo(0,document.querySelector('#egna-kurser').getBoundingClientRect().top+scrollY-85)");page.wait_for_timeout(400)
    shot(page,'kg-kurser',{'matematik':'.kursgrupp:nth-of-type(1)','fysik':'.kursgrupp:nth-of-type(2)'})
    page.locator('#egna-kurser').scroll_into_view_if_needed();page.wait_for_timeout(400)
    shot(page,'kg-kurser-fysik',{'val':'[onclick*="fy1"]','fysik':'.kursgrupp:nth-of-type(2)','historia':'.kursgrupp:nth-of-type(3)'})
    page.locator('[onclick*="fy1"]').first.click()
    page.wait_for_selector('.ub-omslag');page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-kurs',{'bok':'.ub-omslag','trana':'.pt','omraden':'.chapters','kurs':'.chead','byt':'button:has-text("Byt pass")','forslag':'.pt-msg','start':'.pt-act','fokus':'.pt-fokus'})
    page.get_by_role('button',name='Byt pass',exact=True).click()
    shot(page,'kg-tranare-val',{'val':'.pt-val','grund':'button:has-text("Grundpass")'})
    page.get_by_role('button',name='Grundpass',exact=False).click()
    shot(page,'kg-tranare-bok',{'bok':'.ub-omslag'})
    page.get_by_role('button',name='Öppna uppdragsboken',exact=False).click()
    page.wait_for_timeout(750)
    shot(page,'kg-uppdragsbok',{'bok':'.ub-volym','huvud':'.ub-vanster .ub-uppgift','uppdrag':'.ub-hoger','datum':'.ub-nav','stang':'button[aria-label="Stäng uppdragsboken"]'})
    page.get_by_role('button',name='Stäng uppdragsboken',exact=True).click()
    page.evaluate("""()=>{const original=chooseTask;let first=true;chooseTask=()=>{
      if(first){first=false;const task=availableTasks().find(t=>t.id==='5.488b');if(task)return task;}return original();};}""")
    shot(page,'kg-till-start',{'hem':'.brand'})
    page.locator('.brand').click();page.wait_for_selector('.provkort')
    shot(page,'kg-starta-pass',{'start':'.provkort .primary'})
    page.locator('.provkort .primary').first.click();page.wait_for_selector('#kollaknapp');page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-uppgift',{'uppgift':'article.task','svar':'#ans-0','verktyg':'#ledtradknapp','ledtrad':'#ledtradknapp','xp':'.xpmeter'})
    page.locator('#ledtradknapp').click();page.wait_for_timeout(1800)
    shot(page,'kg-ledtrad',{'ledtrad':'#ledtrad-holder','svar':'#ans-0','kontrollera':'#kollaknapp'})
    cursor(page);page.locator('#ans-0').fill('32200')
    page.wait_for_timeout(700);start=time.monotonic()-epoch
    page.wait_for_timeout(900)
    b=page.locator('#kollaknapp').bounding_box();page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=20)
    before=page.evaluate('profile.xp');page.locator('#kollaknapp').click();page.wait_for_timeout(3000)
    after=page.evaluate('profile.xp');assert after>before,(before,after)
    assert 'Rätt!' in page.locator('#answer-result').inner_text()
    clips.append(('kg-svara-xp',start,time.monotonic()-epoch))
    page.evaluate("document.getElementById('demo-pointer')?.remove()")
    shot(page,'kg-ratt',{'aterkoppling':'#answer-result','xp':'.xpmeter','uppgift':'article.task','losning':'button:has-text("Visa lösning")'})
    print('XP',before,after,flush=True)
    page.get_by_role('button',name='Visa lösning',exact=True).click();page.locator('#solution-holder').scroll_into_view_if_needed()
    shot(page,'kg-losning',{'losning':'#solution-holder'})
    page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-avsluta',{'knapp':'button:has-text("Avsluta")'})
    page.get_by_role('button',name='Avsluta',exact=False).click()
    shot(page,'kg-till-topplista',{'knapp':'.topppill'})
    page.evaluate("""()=>{hamtaTopplista=async()=>({plats:3,rader:[
      {namn:'Nora H',xp:860,totalxp:2960,uppgifter:28,medaljer:['xp1000']},
      {namn:'Amir D',xp:740,totalxp:2340,uppgifter:25,medaljer:['xp1000']},
      {namn:'Alva B',xp:profile.xp-300,totalxp:profile.xp,uppgifter:21,medaljer:[]},
      {namn:'Leo N',xp:240,totalxp:1540,uppgifter:19,medaljer:[]},
      {namn:'Mira E',xp:180,totalxp:1480,uppgifter:17,medaljer:[]}]});
      hamtaKlasstopplista=async()=>({summa:true,tak:1200,minKlass:41,rader:[{id:41,namn:'NA26a',elever:24,aktiva:21,poang:12640},{id:42,namn:'TE26a',elever:22,aktiva:19,poang:11320},{id:43,namn:'NA26b',elever:25,aktiva:20,poang:10780}]});}""")
    page.get_by_role('button',name='Topplistan',exact=True).click()
    page.wait_for_selector('.topprad');page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-topplista',{'period':'.flikar','lista':'.topplista','synlighet':'.toppnotis','vyer':'.toppvy','klasser':'[role="tab"]:has-text("Klasser")'})
    page.get_by_role('tab',name='Klasser',exact=True).click();page.wait_for_selector('.klasslista')
    shot(page,'kg-klasstopp',{'lista':'.klasslista','vyer':'.toppvy','period':'.flikar'})
    # Teacher workflow, using the same fixture endpoints as the student views.
    page.evaluate((HERE/'kg-demo.js').read_text());page.evaluate('larTranaSjalv()');page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-min-undervisning',{'knapp':'button:has-text("Min undervisning")'})
    page.get_by_role('button',name='Min undervisning',exact=True).click();page.wait_for_selector('.larkort')
    shot(page,'kg-larare',{'grupper':'.largrid','grupp':'.larkort:has-text("NA26a")','meny':'.larnav'})
    page.locator('.larkort').filter(has_text='NA26a').click();page.wait_for_selector('.larstat')
    shot(page,'kg-grupp',{'sammanfattning':'.larstat','skapa':'button:has-text("Skapa träningspass")','pass':'.provrad'})
    page.get_by_role('button',name='Skapa träningspass',exact=True).click();page.wait_for_selector('#prov-titel')
    page.locator('#prov-titel').fill('Inför Prov v.48')
    page.evaluate("provSkapa.omraden=['arbete','rorelseenergi','effekt'];provSkapa.antal=15;provSkapa.datum='2026-11-27';provRitaSkapa()")
    shot(page,'kg-skapa',{'titel':'#prov-titel','formular':'.provform','antal':'#prov-antal'})
    page.locator('.provkap').filter(has_text='Arbete och lägesenergi').scroll_into_view_if_needed()
    shot(page,'kg-innehall',{'omraden':'.provkap:has([onclick="provVaxlaOmrade(\'arbete\')"])','skapa':'button:has-text("Skapa träningspass")'})
    page.get_by_role('button',name='Skapa träningspass',exact=True).scroll_into_view_if_needed()
    shot(page,'kg-skapa-knapp',{'knapp':'button:has-text("Skapa träningspass")'})
    page.get_by_role('button',name='Skapa träningspass',exact=True).click();page.wait_for_selector('.provklar');page.evaluate('window.scrollTo(0,0)')
    shot(page,'kg-dela-pass',{'dela':'.provklar','klar':'button:has-text("Klar")'})
    page.get_by_role('button',name='Klar',exact=True).click()
    page.locator('[data-pass-id="91"] summary').first.scroll_into_view_if_needed()
    shot(page,'kg-resultat-knapp',{'knapp':'[data-pass-id="91"] summary'})
    page.locator('[data-pass-id="91"] summary').first.click();page.wait_for_selector('.provres-topp')
    page.locator('.provrad').scroll_into_view_if_needed()
    shot(page,'kg-passstatistik',{'resultat':'.provrad','omraden':'.provres','oversikt':'.provres-topp'})
    page.locator('.laralla summary').scroll_into_view_if_needed()
    shot(page,'kg-elever-knapp',{'knapp':'.laralla summary'})
    page.locator('.laralla summary').click();page.locator('.laralla').scroll_into_view_if_needed()
    shot(page,'kg-elevstatistik',{'elever':'.laralla'})
    page.get_by_role('button',name='Min undervisning',exact=True).scroll_into_view_if_needed()
    shot(page,'kg-till-grupper',{'knapp':'button:has-text("Min undervisning")'})
    page.get_by_role('button',name='Min undervisning',exact=True).click();page.wait_for_selector('.larkort')
    page.locator('.larkort').filter(has_text='NA26a').click();page.wait_for_selector('.larstat')
    page.get_by_role('button',name='Gruppens statistik per område',exact=True).scroll_into_view_if_needed()
    shot(page,'kg-omraden-knapp',{'knapp':'button:has-text("Gruppens statistik per område")'})
    page.get_by_role('button',name='Gruppens statistik per område',exact=True).click();page.wait_for_selector('#laromr .provres')
    shot(page,'kg-omradesstatistik',{'statistik':'#largruppkropp'})
    print('ERRORS',errors,flush=True);assert not errors,errors
    video=page.video.path();c.close();encode(video,clips)

def ul(browser,css):
    c=context(browser,css);page=c.new_page();epoch=time.monotonic();clips=[];errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('https://uppgiftslabbet.se/index.html',wait_until='domcontentloaded')
    page.wait_for_function('typeof grindÖppna === "function" && typeof renderMathInElement === "function"')
    page.evaluate((HERE/'ul-demo.js').read_text())
    shot(page,'ul-kurser',{'kurser':'.kurskort[data-kurs="fy1"]','sida':'main'})
    page.locator('.kurskort[data-kurs="fy1"]').click()
    page.wait_for_function("typeof DB!=='undefined' && DB?.bank?.length>0")
    page.wait_for_selector('.kaprad')
    if not page.locator('[data-omr="5:arbete"]').is_visible():
        page.locator('.kapgrupp').filter(has=page.locator('[data-omr="5:arbete"]')).locator('.kaprad').click()
    page.locator('[data-omr="5:arbete"]').scroll_into_view_if_needed()
    shot(page,'ul-valj-omrade',{'knapp':'[data-omr="5:arbete"]'})
    page.locator('[data-omr="5:arbete"]').click()
    page.wait_for_timeout(500)
    shot(page,'ul-bank',{'bank':'#lista','blad':'#blad','omrade':'.kapgrupp:has([data-omr="5:arbete"])','redigera':'#oppnaLayout','sok':'#sökfält'})
    ids=page.locator('#lista .kort').evaluate_all('(els)=>els.slice(0,4).map(e=>e.dataset.id)')
    assert len(ids)==4
    cursor(page);page.wait_for_timeout(600);start=time.monotonic()-epoch
    page.wait_for_timeout(900)
    for index,task_id in enumerate(ids):
        source=page.locator(f'#lista .kort[data-id="{task_id}"]')
        source.scroll_into_view_if_needed();page.wait_for_timeout(350)
        b=source.bounding_box();target=page.locator('#blad').bounding_box()
        sx=b['x']+min(70,b['width']/3);sy=max(80,min(H-90,b['y']+55))
        tx=target['x']+target['width']/2;ty=max(130,min(H-120,target['y']+target['height']-12))
        page.mouse.move(sx,sy,steps=20);page.wait_for_timeout(200);page.mouse.down()
        page.mouse.move(sx+15,sy+5,steps=5);page.wait_for_timeout(200)
        page.mouse.move(tx,ty,steps=45);page.wait_for_timeout(400);page.mouse.up()
        page.wait_for_function('(n)=>state.blad.length===n',arg=index+1)
        page.wait_for_timeout(650)
        print('DRAG',task_id,index+1,flush=True)
    page.locator('#oppnaLayout').scroll_into_view_if_needed();page.wait_for_timeout(600)
    clips.append(('ul-dra-fyra',start,time.monotonic()-epoch))
    page.evaluate("document.getElementById('demo-pointer')?.remove()")
    shot(page,'ul-fyra',{'blad':'#blad','redigera':'#oppnaLayout','dokument':'.bladtopp'})
    cursor(page);page.wait_for_timeout(500);start=time.monotonic()-epoch;page.wait_for_timeout(800)
    page.locator('#oppnaLayout').click();page.wait_for_selector('#layoutred:not([hidden])');page.wait_for_timeout(2300)
    clips.append(('ul-forhandsvisa',start,time.monotonic()-epoch))
    page.evaluate("document.getElementById('demo-pointer')?.remove()")
    shot(page,'ul-redigera',{'meny':'.lr-bar','papper':'.lr-papper','dialog':'.lr-dialog','facit':'#lrFacit','klar':'#lrKlar'})
    # Set the document heading using the actual editable preview.
    editables=page.locator('.lr-papper [contenteditable="true"]').evaluate_all('(els)=>els.map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,80)}))')
    print('EDITABLES',json.dumps(editables,ensure_ascii=False),flush=True)
    heading=page.locator('.lr-papper [contenteditable="true"]').filter(has_text='Övningsblad').first
    if heading.count():
        heading.fill('Energi i vardagen');page.keyboard.press('Tab');page.wait_for_timeout(350)
    page.locator('#lrFacit').check();shot(page,'ul-facit',{'meny':'.lr-bar','facit':'#lrFacit','papper':'.lr-papper'})
    page.locator('#lrFacit').uncheck();page.locator('#lrKlar').click()
    page.locator('[data-redigera-blad="0"]').hover()
    shot(page,'ul-penna',{'knapp':'[data-redigera-blad="0"]'})
    page.locator('[data-redigera-blad="0"]').click()
    shot(page,'ul-uppgiftsredigering',{'dialog':'.ru-dialog','avbryt':'#ruAvbryt'})
    page.locator('#ruAvbryt').click()
    page.evaluate("""()=>{Object.assign(DELNING,{id:'demo-energi',namn:'Energi i vardagen',roll:'agare',kurs:'fy1',medlemmar:2,
      aktiva:['Sara Ek'],fel:null,skickar:false,revision:2});delningRitaStatus();}""")
    shot(page,'ul-dela-knapp',{'knapp':'#delaDokument'})
    page.locator('#delaDokument').click();page.wait_for_selector('.ul-kollega')
    shot(page,'ul-dela',{'dialog':'#delamodal .sparmodal-kort','kollegor':'.ul-kollega','stang':'#delamodalStang'})
    page.locator('#delamodalStang').click()
    shot(page,'ul-mina-knapp',{'knapp':'button:has-text("Mina prov och övningsblad")'})
    page.get_by_role('button',name='Mina prov och övningsblad',exact=True).click()
    page.wait_for_selector('[data-mina-oppna="demo-geometri"]')
    shot(page,'ul-bibliotek',{'dialog':'#minamodal .sparmodal-kort'})
    print('ERRORS',errors,flush=True);assert not errors,errors
    video=page.video.path();c.close();encode(video,clips)

with sync_playwright() as p:
    browser=launch(p);css=fonts_css()
    if len(sys.argv)==1 or 'kg' in sys.argv:kg(browser,css)
    if len(sys.argv)==1 or 'ul' in sys.argv:ul(browser,css)
    browser.close()
