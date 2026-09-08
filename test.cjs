const assert=require('node:assert/strict');
const R=require('./repetition.js'), bank=require('./blok-1.js');
assert.equal(bank.items.length,70);assert.equal(bank.items.filter(x=>x.type==='flashcard').length,42);assert.equal(new Set(bank.items.map(x=>x.id)).size,70);
for(const i of bank.items){assert(i.question && i.source);if(i.type==='quiz'){assert.equal(i.options.length,4);assert.equal(new Set(i.options).size,4);assert(i.options[i.correctIndex]);assert(i.explanation);}else assert(i.answer);}
let progress={},day='2026-09-08';
let session=R.createSession(bank.items,progress,day);
assert.equal(session.ids.length,7);assert.equal(new Set(session.ids).size,7);assert.equal(new Set(session.ids.map(id=>bank.items.find(x=>x.id===id).type)).size,2);
const failed=session.queue[0], rest=session.queue.slice(1);R.grade(progress,session,false,day);assert.deepEqual(session.queue,[...rest,failed]);assert.equal(progress[failed].due,day);assert.throws(()=>R.grade(progress,session,true,day));session.feedback=null;
while(session.queue.length){R.grade(progress,session,true,day);session.feedback=null;}
assert.equal(session.completed.length,7);assert.equal(progress[failed].due,'2026-09-09');assert.equal(progress[failed].stage,0);assert.equal(R.due(bank.items,progress,day).some(x=>x.id===failed),false);
for(const interval of [3,5,8,11,14,14]){day=progress[failed].due;const s={queue:[failed],feedback:null,completed:[],attempts:0,mistakes:0};R.grade(progress,s,true,day);assert.equal(progress[failed].due,R.addDays(day,interval));}
const retry={queue:[failed],feedback:null,completed:[],attempts:0,mistakes:0};day=progress[failed].due;R.grade(progress,retry,false,day);retry.feedback=null;R.grade(progress,retry,true,day);assert.equal(progress[failed].due,R.addDays(day,1));assert.equal(progress[failed].stage,0);
const sameDay={queue:[failed],feedback:null,completed:[],attempts:0,mistakes:0};R.grade(progress,sameDay,true,day);assert.equal(progress[failed].stage,0);
assert.equal(R.addDays('2026-12-31',1),'2027-01-01');assert.equal(R.addDays('2028-02-28',1),'2028-02-29');assert.equal(R.addDays('2026-03-28',3),'2026-03-31');
assert.deepEqual(R.validateState(JSON.parse(JSON.stringify({version:1,progress,session:null})),bank.items).progress,progress);
assert.throws(()=>R.validateState({version:1,progress:{x:{stage:90}}},bank.items));
const pending=R.createSession(bank.items,{},'2026-09-08');const p={};R.grade(p,pending,false,'2026-09-08');R.validateState({version:1,progress:p,session:pending},bank.items);
const only=bank.items.slice(0,3);assert.equal(R.createSession(only,{},'2026-09-08').ids.length,3);
assert.equal(R.createSession([bank.items[0]],{[bank.items[0].id]:{due:'2030-01-01'}},'2026-09-08'),null);
console.log('Geslaagd: inhoud, setjes, fout achteraan, hervatten, herhaalschema, daggrenzen en back-upvalidatie.');

