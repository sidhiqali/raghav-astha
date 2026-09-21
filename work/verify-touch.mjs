const ws = new WebSocket(process.argv[2]);
await new Promise(r => ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}});
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))})}
const {targetInfos}=await call('Target.getTargets');const target=targetInfos.find(t=>t.type==='page'&&t.url.includes('qa=envelope'));
const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
const send=(m,p)=>call(m,p,sessionId);
await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
await send('Runtime.evaluate',{expression:'document.querySelector("#date-reveal-card").scrollIntoView({behavior:"instant",block:"center"})'});
const {result}=await send('Runtime.evaluate',{expression:'JSON.stringify(document.querySelector("#date-foil").getBoundingClientRect().toJSON())'});
const r=JSON.parse(result.value);
await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+20,y:r.y+20,id:1,radiusX:5,radiusY:5}]});
for(let y=20,row=0;y<r.height-20;y+=24,row++){
 const left=row%2?r.width-20:20,right=row%2?20:r.width-20;
 for(let step=0;step<=12;step++) await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+left+(right-left)*step/12,y:r.y+y,id:1,radiusX:5,radiusY:5}]});
}
await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
const checked=await send('Runtime.evaluate',{expression:'JSON.stringify({revealed:document.querySelector("#scratch-card").classList.contains("is-revealed"),status:document.querySelector("#scratch-status").textContent,overflow:document.documentElement.scrollWidth>innerWidth,petals:document.querySelectorAll(".date-petal").length})'});
console.log(checked.result.value);ws.close();
