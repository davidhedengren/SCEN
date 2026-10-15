async () => {
  window.demoCalls=[];
  ulRpc=async(name,args={})=>{
    demoCalls.push({name,args});
    if(name==='ul_min_behorighet')return{larare:true,admin:false};
    if(name==='ul_hamta_utkast')return null;
    if(name==='ul_skola_larare')return{skola:'Exempelgymnasiet',larare:[
      {user_id:'demo-sara',namn:'Sara Ek',epost:'sara@example.test',status:'medlem'},
      {user_id:'demo-johan',namn:'Johan Berg',epost:'johan@example.test',status:'ledig'}]};
    if(name==='ul_medlemmar')return[
      {user_id:'demo-alex',namn:'Alex Lind',epost:'alex@example.test',roll:'agare',jag:true,aktiv:true},
      {user_id:'demo-sara',namn:'Sara Ek',epost:'sara@example.test',roll:'medlem',aktiv:true}];
    if(name==='ul_mina')return[
      {id:'demo-energi',namn:'Energi i vardagen',kurs:'fy1',typ:'ovning',roll:'agare',medlemmar:2,antal_uppgifter:3,uppdaterad:'2026-10-15T09:30:00Z',omraden:['Arbete och lägesenergi','Rörelseenergi']},
      {id:'demo-geometri',namn:'Geometri – resonera och förklara',kurs:'ma2',spar:'2c',typ:'prov',roll:'medlem',agare:'Sara Ek',medlemmar:2,antal_uppgifter:8,uppdaterad:'2026-10-14T09:30:00Z',omraden:['Likformighet']}];
    if(name==='ul_mina_delninginbjudningar')return[];
    if(name==='ul_skolbank')return{skola:'Exempelgymnasiet',dokument:[]};
    if(name==='ul_versioner')return[{revision:2,av:'Sara Ek',antal_uppgifter:3,sparad:'2026-10-15T09:30:00Z'},
      {revision:1,av:'Alex Lind',antal_uppgifter:3,sparad:'2026-10-14T08:00:00Z'}];
    return{ok:true};
  };
  ulSession={access_token:'local-demo-only',user:{id:'demo-alex',email:'alex@example.test',user_metadata:{full_name:'Alex Lind'}}};
  ulBehörighet={larare:true,admin:false};ulBehörighetTid=Date.now();grindÖppna('konto');
}
