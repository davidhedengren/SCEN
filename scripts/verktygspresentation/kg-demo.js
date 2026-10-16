async () => {
  // Local fixture only. The browser blocks every Supabase request.
  const groups=[{id:11,namn:'Fysik · NA26a',kurs:'fy1',kod:'DEMO26',elever:24,aktiva:21,larare:['Alex Lind'],synlig:true},
    {id:12,namn:'Fysik · TE26a',kurs:'fy1',kod:'DEMO27',elever:22,aktiva:19,larare:['Alex Lind'],synlig:true}];
  const areas=['arbete','rorelseenergi','effekt'];
  const pass={id:91,titel:'Inför Prov v.48',kurs:'fy1',aktiv:true,grupper:[groups[0]],antal:15,kod:'PROV48',
    omraden:areas,nivaer:['E','C','A'],spar:null,datum:'2026-11-27',tranat:21,alla:false,klara:0};
  const names=['Alva Berg','Amir Dahlin','Elin Ek','Elliot Falk','Freja Holm','Hugo Järv','Ida Lind','Isak Lund','Julia Moss','Leo Nord','Livia Sand','Malte Vik',
    'Maja Alm','Milo Bo','Mira Ed','Noah Flor','Nora Hall','Olivia Hav','Omar Lid','Sara Löv','Thea Nor','Vera Ryd','Viggo Sjö','Zoe Ås'];
  const students=names.map((namn,i)=>({id:'demo-'+i,namn,epost:'',vecka:i<21?12+i:0,vecka_ratt:i<21?9+Math.floor(i*.7):0,
    senaste:40,senaste_ratt:24+i%14,uppgifter:80+i*11,senast:i<21?new Date().toISOString():null,klass:{id:41,namn:'NA26a'}}));
  window.demo={groups,pass,students,calls:[]};
  klassRpc=async(name,args={})=>{
    demo.calls.push({name,args});
    if(name==='kg_lar_grupper')return{ok:true,kursstod:true,grupper:groups};
    if(name==='kg_lar_elever')return{ok:true,elever:students};
    if(name==='kg_prov_elevval')return{ok:true,elevval:true,elever:students.map(e=>({id:e.id,namn:e.namn,grupper:[11]}))};
    if(name==='kg_lar_elev')return{ok:true,namn:'Alva Berg',epost:'',uppgifter:80,streak:2,
      dagar:Object.fromEntries([[0,4],[1,3],[3,5],[8,6],[10,8]].map(([offset,n])=>{
        const d=new Date(Date.now()-offset*864e5);return[d.toLocaleDateString('sv-SE'),n];})),
      kurser:[{kurs:'fy1',forsok:40,ratt:24,vecka:12,senast:new Date().toISOString(),omraden:[
        {omr:'effekt',m:.39,f:10,r:4},{omr:'rorelseenergi',m:.47,f:8,r:4},
        {omr:'arbete',m:.79,f:10,r:8},{omr:'enheter',m:.82,f:6,r:5},{omr:'densitet',m:.58,f:6,r:3}]}],
      pass:[{titel:pass.titel,antal:15,klara:15,ratt:15,aktiv:true}]};
    if(name==='kg_prov_mina')return{ok:true,prov:[pass]};
    if(name==='kg_prov_for_mig')return[pass];
    if(name==='kg_lar_grupp_omraden')return{ok:true,omraden:{arbete:{m:.78,elever:21,forsok:105,ratt:87},rorelseenergi:{m:.63,elever:19,forsok:95,ratt:67},effekt:{m:.42,elever:18,forsok:90,ratt:43}}};
    if(name==='kg_prov_sammanstallning')return{ok:true,prov:pass,elever:24,tranat:21,uppgifter:258,
      elevlista:students.map((e,i)=>({namn:e.namn,klara:[15,15,15,15,15,15,15,15,15,15,15,15,12,11,10,10,9,8,7,6,5,0,0,0][i],
        ratt:[15,14,13,13,12,12,11,11,10,10,9,8,7,6,5,5,4,3,3,2,2,0,0,0][i]})),
      omraden:{arbete:{forsok:90,ratt:75,elever:21},rorelseenergi:{forsok:90,ratt:63,elever:21},effekt:{forsok:78,ratt:37,elever:18}}};
    if(name==='kg_prov_skapa'||name==='kg_prov_skapa_med_elever'){
      Object.assign(pass,{titel:args.p_titel,omraden:args.p_omraden,nivaer:args.p_nivaer,antal:args.p_antal});
      return{ok:true,id:91,kod:pass.kod};
    }
    if(name==='kg_lar_elevlista')return{ok:true,klassimport:true,elever:students.map(e=>({...e,medlem:true,grupper:[groups[0]]}))};
    return{ok:true};
  };
  // Authentication is a synthetic browser-local account, never a usable credential.
  session={access_token:'local-demo-only',user:{id:'demo-teacher',email:'alex@example.test',user_metadata:{full_name:'Alex Lind'}}};
  larProfil={namn:'Alex Lind',skola:{id:10,namn:'Exempelgymnasiet'}};
  arLarare=false;arGruppLarare=true;arAdmin=false;
  document.documentElement.dataset.theme='light';
  kgRegistreraForsok=()=>{};kgLoggaHandelse=()=>{};
  renderHome();
}
