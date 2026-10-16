"""Capture the actual pass recipient controls, with browser-local demo accounts."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser import configure,fonts_css,launch
import importlib.util
spec=importlib.util.spec_from_file_location('tour',Path(__file__).with_name('capture-tour.py'))
tour=importlib.util.module_from_spec(spec);spec.loader.exec_module(tour)
shot=tour.shot
with sync_playwright() as p:
    b=launch(p);c=b.new_context(viewport={'width':1600,'height':900},device_scale_factor=2,locale='sv-SE')
    configure(c,fonts_css());page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('https://kunskapsgymmet.se/index.html',wait_until='domcontentloaded')
    page.wait_for_function('typeof provSkapaStart==="function"')
    page.evaluate((tour.HERE/'kg-demo.js').read_text());page.wait_for_selector('.larkort')
    page.locator('.larkort').filter(has_text='NA26a').click();page.wait_for_selector('.larstat')
    page.get_by_role('button',name='Skapa träningspass',exact=True).click();page.wait_for_selector('#prov-titel')
    page.locator('#prov-titel').fill('Inför Prov v.48')
    page.evaluate("provSkapa.omraden=['arbete','rorelseenergi','effekt'];provSkapa.antal=15;provSkapa.datum='2026-11-27';provRitaSkapa()")
    page.evaluate('scrollTo(0,0)')
    shot(page,'kg-skapa',{'titel':'#prov-titel','mottagare':'#prov-mottagare','valj':'.prov-mottagarrad .btn','kurs':'.provform-rad'})
    # Whole group is preselected when creating from its overview. Deselect before choosing individuals.
    page.locator('[data-prov-grupp="11"]').uncheck()
    page.get_by_role('button',name='Välj elever',exact=True).first.scroll_into_view_if_needed()
    shot(page,'kg-elevval-knapp',{'knapp':'.prov-mottagarrad .btn','hela':'.prov-mottagarrad label'})
    page.get_by_role('button',name='Välj elever',exact=True).first.click()
    page.locator('[data-prov-elev="demo-0"]').check()
    page.evaluate("document.querySelector('#prov-mottagare').scrollIntoView({block:'center',behavior:'instant'})")
    shot(page,'kg-elevval-en',{'elev':'#prov-elever-11 label:first-child','lista':'#prov-elever-11','nasta':'#prov-elever-11 label:nth-child(2)','valda':'.prov-valda'})
    page.locator('[data-prov-elev="demo-1"]').check()
    shot(page,'kg-elevval-flera',{'lista':'#prov-elever-11','valda':'.prov-valda','hela':'.prov-mottagarrad label'})
    page.locator('[data-prov-grupp="11"]').check()
    page.get_by_role('button',name='Dölj elever',exact=True).click()
    page.locator('#prov-mottagare').scroll_into_view_if_needed()
    shot(page,'kg-elevval-hela',{'mottagare':'#prov-mottagare','hela':'.prov-mottagarrad label'})
    page.locator('.provfalt:has(>span:text-is("Omfattning"))').evaluate("el=>el.scrollIntoView({block:'center',behavior:'instant'})")
    shot(page,'kg-omfattning',{'omfattning':'.provfalt:has(>span:text-is("Omfattning"))','nivaer':'.provfalt:has(>span:text-is("Nivåer som ska tränas"))'})
    page.locator('.provkap').filter(has_text='Arbete och lägesenergi').scroll_into_view_if_needed()
    shot(page,'kg-innehall',{'omraden':'.provkap:has([onclick="provVaxlaOmrade(\'arbete\')"])'})
    page.get_by_role('button',name='Skapa träningspass',exact=True).scroll_into_view_if_needed()
    shot(page,'kg-skapa-knapp',{'knapp':'button:text-is("Skapa träningspass")'})
    page.get_by_role('button',name='Skapa träningspass',exact=True).click();page.wait_for_selector('.provklar');page.evaluate('scrollTo(0,0)')
    shot(page,'kg-dela-pass',{'dela':'.provklar','klar':'button:text-is("Klar")'})
    assert not errors,errors
    print('ERRORS',errors);b.close()
