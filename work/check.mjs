// Usage: chrome --headless=new --remote-debugging-port=9333 about:blank &
//        node work/check.mjs "$(curl -s localhost:9333/json/version | jq -r .webSocketDebuggerUrl)" work/frames mobile|desktop
// Needs the site served at http://localhost:4173. Writes timed frames and exits non-zero if any check fails.
import { writeFileSync } from 'node:fs';
const [,, wsUrl, outDir, mode] = process.argv;
const ws = new WebSocket(wsUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } });
const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); });
const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
const send = (m, p) => call(m, p, sessionId);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const mobile = mode === 'mobile';
const W = mobile ? 390 : 1440, H = mobile ? 844 : 900;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: mobile ? 2 : 1, mobile });
await send('Page.enable');
const shot = async name => { const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); writeFileSync(`${outDir}/${mode}-${name}.jpg`, Buffer.from(data, 'base64')); };
const evalJs = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
await send('Page.navigate', { url: 'http://localhost:4173/' });
await sleep(2500);
await shot('00-cover');
await evalJs(`document.getElementById('open').click(); 'clicked'`);
const t0 = Date.now();
const checks = {};
for (const ms of [300, 700, 1200, 1700, 2200, 2600, 3000, 3600]) { const wait = t0 + ms - Date.now(); if (wait > 0) await sleep(wait); await shot(`open-${String(ms).padStart(4,'0')}`);
  if (ms === 1700) checks.flapOpen = await evalJs(`new DOMMatrix(getComputedStyle(document.querySelector('.env-flap')).transform).m33 < 0`);
  if (ms === 2200) checks.cardRisen = await evalJs(`new DOMMatrix(getComputedStyle(document.querySelector('.env-card')).transform).m42 < -30`);
  if (ms === 2600) checks.crossfade = await evalJs(`!document.getElementById('invitation').hidden && !document.getElementById('cover').hidden`);
  if (ms === 3600) checks.coverGone = await evalJs(`document.getElementById('cover').hidden && !document.getElementById('cover').classList.contains('opening')`); }
await sleep(300);
await shot('10-invitation');
await evalJs(`document.getElementById('details').scrollIntoView({block:'start'}); 'ok'`);
await sleep(1300);
await shot('20-details');
const r = await evalJs(`JSON.stringify(document.getElementById('date-foil').getBoundingClientRect().toJSON())`).then(JSON.parse);
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: 1, clickCount: 1 });
await mouse('mousePressed', r.x + 30, r.y + 30);
for (let i = 0; i <= 20; i++) await mouse('mouseMoved', r.x + 30 + (r.width - 60) * i / 20, r.y + 30 + Math.sin(i) * 12);
await mouse('mouseReleased', r.x + r.width - 30, r.y + 42);
await sleep(200);
await shot('21-scratch-partial');
await mouse('mousePressed', r.x + 20, r.y + 20);
for (let y = 20, row = 0; y < r.height - 15; y += 14, row++) { const l = row % 2 ? r.width - 20 : 20, rt = row % 2 ? 20 : r.width - 20; for (let s = 0; s <= 10; s++) await mouse('mouseMoved', r.x + l + (rt - l) * s / 10, r.y + y); }
await mouse('mouseReleased', r.x + 20, r.y + r.height - 20);
const t1 = Date.now();
await evalJs(`document.getElementById('photo-open').click(); 'ok'`);
await sleep(400);
await shot('30-lightbox');
checks.lightbox = await evalJs(`(() => { const d = document.getElementById('lightbox'); const open = d.open; d.close(); return open && !d.open; })()`);
checks.fireworks = await evalJs(`document.querySelectorAll('.firework').length`);
checks.confetti = await evalJs(`document.querySelectorAll('.confetti').length`);
for (const ms of [150, 600, 1200, 1900, 2800]) { const wait = t1 + ms - Date.now(); if (wait > 0) await sleep(wait); await shot(`reveal-${String(ms).padStart(4,'0')}`); }
Object.assign(checks, await evalJs(`({revealed:document.querySelector('#scratch-card').classList.contains('is-revealed'),note:document.getElementById('scratch-note').textContent,overflow:document.documentElement.scrollWidth>innerWidth})`));
console.log(mode, JSON.stringify(checks)); const { overflow, ...expected } = checks; if (overflow || Object.values(expected).some(v => !v)) process.exitCode = 1;
await call('Target.closeTarget', { targetId });
ws.close();
