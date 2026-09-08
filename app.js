(() => {
  'use strict';
  const bank=BLOK_1, R=Repetition, key='even-oefenen-progress-v1';
  const screen=document.getElementById('screen'), notice=document.getElementById('notice');
  const byId=Object.fromEntries(bank.items.map(x=>[x.id,x]));
  let state={version:1,progress:{},session:null}, storageBlocked=false;
  try { const raw=localStorage.getItem(key); if(raw) state=R.validateState(JSON.parse(raw),bank.items); }
  catch(error){storageBlocked=true;notice.textContent='Je opgeslagen voortgang kon niet worden gelezen. De bestaande opslag wordt niet overschreven. Je kunt nu oefenen en een back-up downloaden, of een geldige back-up terugzetten.';}
  function save(){ if(storageBlocked) return; try{localStorage.setItem(key,JSON.stringify(state));}catch(error){notice.textContent='Opslaan in deze browser lukt niet. Download je voortgang voordat je de pagina sluit.';} }
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(text,fn,cls)=>{const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;};
  const formatDay=day=>new Date(day+'T12:00:00').toLocaleDateString('nl-NL',{weekday:'short',day:'numeric',month:'short'});
  function resetScreen(){screen.replaceChildren();const p=el('div',undefined,'panel');screen.append(p);return p;}
  function start(){ state.session=R.createSession(bank.items,state.progress,R.today());save();render(); }
  function home(){
    const panel=resetScreen(), day=R.today(), available=R.due(bank.items,state.progress,day);
    panel.append(el('div','Jouw dagelijkse oefenmoment','eyebrow'),el('h1','Zeven vragen. Steeds beter onthouden.'));
    const stats=el('div',undefined,'stats');
    for(const [n,label] of [[available.filter(x=>state.progress[x.id]).length,'te herhalen'],[available.filter(x=>!state.progress[x.id]).length,'nieuw'],[bank.items.length,'leeritems']]){const s=el('div',undefined,'stat');s.append(el('strong',String(n)),el('span',label));stats.append(s);}panel.append(stats);
    if(available.length){panel.append(el('p','Flashcards en quizvragen door elkaar, maximaal zeven per setje. Vragen die aan de beurt zijn gaan voor.','muted'),button('Start een setje van '+Math.min(7,available.length),start,'primary'));}
    else {const next=Object.values(state.progress).map(p=>p.due).sort()[0];panel.append(el('h2','Alles voor nu gedaan.'),el('p','Je volgende herhaling staat klaar op '+formatDay(next)+'.'));}
    panel.append(el('div',undefined,'divider'),el('p','42 flashcards · 28 oefenvragen','muted'));
  }
  function respond(correct){R.grade(state.progress,state.session,correct,R.today());save();render();}
  function render(){
    const s=state.session;
    if(!s){home();return;}
    // Een onafgemaakt setje blijft ook na middernacht hervatbaar; beantwoorden gebruikt de actuele dag.
    if(!s.queue.length && !s.feedback){
      const p=resetScreen();p.append(el('div','Setje afgerond','eyebrow'),el('div',s.ids.length+'/'+s.ids.length,'end-number'),el('h1','Deze zitten erin.'),el('p',s.mistakes? s.mistakes+' keer fout? Die heb je opnieuw geoefend. Alles uit dit setje is nu goed beantwoord.':'Alles in één keer goed beantwoord.'));
      p.append(el('p','Je volgende herhalingen zijn opgeslagen.','muted'),button('Verder',()=>{state.session=null;save();home();},'primary'));return;
    }
    const item=byId[s.feedback?s.feedback.id:s.queue[0]], p=resetScreen();
    const top=el('div',undefined,'row');top.append(el('span',item.type==='quiz'?'QUIZVRAAG':'FLASHCARD','eyebrow'),el('span',s.completed.length+' van '+s.ids.length+' afgerond','muted'));p.append(top);
    const track=el('div',undefined,'progress');track.setAttribute('role','progressbar');track.setAttribute('aria-label','Setje afgerond');track.setAttribute('aria-valuenow',s.completed.length);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',s.ids.length);const fill=el('span');fill.style.width=(s.completed.length/s.ids.length*100)+'%';track.append(fill);p.append(track);
    p.append(el('div',item.topic,'muted'),el('h2',item.question));
    if(s.feedback){
      const f=s.feedback, box=el('div',undefined,'feedback '+(f.correct?'correct':'wrong'));box.setAttribute('role','status');
      box.append(el('strong',f.correct?'Goed!':'Nog niet goed.'),el('p',item.type==='quiz'?item.options[item.correctIndex]:item.answer));
      if(item.explanation)box.append(el('p',item.explanation));
      box.append(el('p',f.correct?'Volgende herhaling: '+formatDay(f.due)+'.':'Deze vraag staat achteraan en komt na de andere openstaande vragen terug.'));
      p.append(box,el('p','Bron: '+item.source,'source'),button(s.queue.length?'Volgende vraag':'Rond het setje af',()=>{s.feedback=null;save();render();},'primary'));
    }else if(item.type==='quiz'){
      const options=el('div',undefined,'options');R.shuffle(item.options.map((text,index)=>({text,index}))).forEach((o,i)=>{const b=button('',()=>respond(o.index===item.correctIndex),'option');b.append(el('span',String.fromCharCode(65+i),'letter'),el('span',o.text));options.append(b);});p.append(options);
    }else{
      p.append(el('p','Bedenk je antwoord voordat je de kaart omdraait.','muted'));
      const reveal=button('Toon antwoord',()=>{reveal.remove();p.append(el('div',item.answer,'answer'),el('p','Bron: '+item.source,'source'));const row=el('div',undefined,'row');row.append(button('Nog niet goed',()=>respond(false)),button('Dat wist ik',()=>respond(true),'primary'));p.append(row);},'primary');p.append(reveal);
    }
  }
  document.getElementById('source-note').textContent=bank.sourceNote;
  document.getElementById('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}), url=URL.createObjectURL(blob), a=el('a');a.href=url;a.download='even-oefenen-voortgang-'+R.today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  document.getElementById('import').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>2000000)throw new Error('Bestand te groot');const parsed=R.validateState(JSON.parse(await file.text()),bank.items);
      if(!confirm('De voortgang uit dit bestand vervangt je huidige voortgang in deze browser. Doorgaan?'))return;
      state=parsed;storageBlocked=false;notice.textContent='';save();render();
    }catch(error){notice.textContent='Dit bestand is geen geldige voortgangsback-up. Je huidige voortgang is behouden.';}finally{event.target.value='';}
  });
  render();
})();

