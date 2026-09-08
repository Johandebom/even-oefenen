(function(root) {
  const intervals = [1,3,5,8,11,14];
  function today(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
  }
  function addDays(day, count) {
    const [y,m,d] = day.split('-').map(Number);
    return today(new Date(y,m-1,d+count,12));
  }
  function shuffle(items, random = Math.random) {
    const out = [...items];
    for(let i=out.length-1;i>0;i--) {const j=Math.floor(random()*(i+1)); [out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function due(items, progress, day) {
    return items.filter(item => !progress[item.id] || progress[item.id].due <= day);
  }
  function createSession(items, progress, day, random = Math.random) {
    const available = due(items, progress, day);
    const reviewed = shuffle(available.filter(x => progress[x.id]), random).sort((a,b) => progress[a.id].due.localeCompare(progress[b.id].due));
    const fresh = shuffle(available.filter(x => !progress[x.id]), random);
    const ordered = [...reviewed, ...fresh];
    const selected = ordered.slice(0,7);
    // Mix beide soorten wanneer dat binnen dezelfde prioriteitsgroep kan.
    if(selected.length > 1 && selected.every(x => x.type === selected[0].type)) {
      const other = ordered.find(x => x.type !== selected[0].type && Boolean(progress[x.id]) === Boolean(progress[selected[selected.length-1].id]));
      if(other) selected[selected.length-1] = other;
    }
    const ids = shuffle(selected, random).map(x=>x.id);
    return ids.length ? {day, ids, queue:[...ids], completed:[], attempts:0, mistakes:0, feedback:null} : null;
  }
  function grade(progress, session, correct, day) {
    if(session.feedback || !session.queue.length) throw new Error('Geen onbeantwoorde vraag');
    const id = session.queue.shift();
    const previous = progress[id] || {stage:-1, due:day, lastPass:null, lapses:0};
    const next = {...previous};
    session.attempts++;
    if(correct) {
      if(previous.lastPass !== day) next.stage = Math.min(previous.stage+1, intervals.length-1);
      next.stage = Math.max(0,next.stage);
      next.due = addDays(day, intervals[next.stage]);
      next.lastPass = day;
      session.completed.push(id);
    } else {
      next.stage = -1;
      next.due = day;
      next.lastPass = null;
      next.lapses = previous.lapses+1;
      session.queue.push(id);
      session.mistakes++;
    }
    progress[id] = next;
    session.feedback = {id, correct, due:next.due};
    return session.feedback;
  }
  function validateState(value, items) {
    if(!value || value.version !== 1 || !value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress)) throw new Error('Onbekend voortgangsbestand');
    const ids = new Set(items.map(x=>x.id));
    const validDay = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && today(new Date(d+'T12:00:00')) === d;
    for(const p of Object.values(value.progress)) {
      if(!p || !Number.isInteger(p.stage) || p.stage < -1 || p.stage > 5 || !validDay(p.due) || (p.lastPass !== null && !validDay(p.lastPass)) || !Number.isInteger(p.lapses) || p.lapses < 0) throw new Error('Ongeldige voortgang');
    }
    const s = value.session;
    if(s && (!validDay(s.day) || !Array.isArray(s.ids) || s.ids.length>7 || new Set(s.ids).size!==s.ids.length || s.ids.some(id=>!ids.has(id)) || !Array.isArray(s.queue) || !Array.isArray(s.completed) || [...s.queue,...s.completed].some(id=>!s.ids.includes(id)) || new Set([...s.queue,...s.completed]).size !== s.ids.length || s.queue.length+s.completed.length!==s.ids.length || !Number.isInteger(s.attempts) || !Number.isInteger(s.mistakes) || (s.feedback && (!s.ids.includes(s.feedback.id) || typeof s.feedback.correct !== 'boolean' || !validDay(s.feedback.due))))) throw new Error('Ongeldig oefensetje');
    return value;
  }
  const api = {intervals,today,addDays,shuffle,due,createSession,grade,validateState};
  if(typeof module !== 'undefined' && module.exports) module.exports=api; else root.Repetition=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

