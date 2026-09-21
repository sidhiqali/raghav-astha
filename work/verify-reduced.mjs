const ws = new WebSocket(process.argv[2]);
await new Promise(r => ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}});
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))})}
const {targetInfos}=await call('Target.getTargets');const target=targetInfos.find(t=>t.type==='page'&&t.url.includes('qa=envelope'));
const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
const send=(m,p)=>call(m,p,sessionId);
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await send('Page.reload');
await new Promise(r=>setTimeout(r,1200));
const checked=await send('Runtime.evaluate',{expression:'document.querySelector("#reveal-dates").click(); JSON.stringify({reduced:matchMedia("(prefers-reduced-motion: reduce)").matches,revealed:document.querySelector("#scratch-card").classList.contains("is-revealed"),petals:document.querySelectorAll(".date-petal").length})'});
console.log(checked.result.value);ws.close();
