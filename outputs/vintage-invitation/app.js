// Personal details are transcribed from the original invitation. Add only confirmed values.
const CONFIG = { start: '2026-12-25', endExclusive: '2026-12-28', song: 'assets/song.m4a', rsvpUrl: '' };
const $ = id => document.getElementById(id);
const cover = $('cover'), invitation = $('invitation'), song = $('song');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Timeline lives in the .cover.opening CSS. The cover goes position-fixed while opening so the
// invitation can render underneath it and the two crossfade with no blank frame.
const OPENING = { revealAt: 2000, doneAt: 2750 };
function showInvitation(updateHash = true) {
  cover.classList.remove('opening'); cover.hidden = true; invitation.hidden = false;
  if (updateHash) history.replaceState(null, '', '#invitation');
  window.scrollTo(0, 0); $('back').focus({ preventScroll: true });
}
$('open').addEventListener('click', () => {
  $('open').disabled = true;
  // The seal tap is the user gesture browsers require before audio can start.
  if (CONFIG.song) song.play().then(updateMusic).catch(() => {});
  if (reducedMotion) return showInvitation();
  cover.classList.add('opening');
  setTimeout(() => { invitation.hidden = false; window.scrollTo(0, 0); }, OPENING.revealAt);
  setTimeout(() => showInvitation(), OPENING.doneAt);
});
$('back').addEventListener('click', () => {
  invitation.hidden = true; cover.hidden = false; $('open').disabled = false;
  history.replaceState(null, '', location.pathname); song.pause(); updateMusic();
  window.scrollTo(0, 0); $('open').focus({ preventScroll: true });
});
function notice(title, message) { $('notice-title').textContent = title; $('notice-copy').textContent = message; $('notice').showModal(); }
$('close').onclick = $('notice-done').onclick = () => $('notice').close();
for (const dialog of [$('notice'), $('lightbox')]) dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
$('photo-open').onclick = () => $('lightbox').showModal();
$('lightbox-close').onclick = () => $('lightbox').close();
$('rsvp').onclick = () => CONFIG.rsvpUrl ? window.location.assign(CONFIG.rsvpUrl) : notice('A little closer to the day', 'RSVP details will be shared with the formal invitation. For now, save 25–27 December 2026.');
function updateMusic() { $('music').dataset.state = CONFIG.song ? (song.paused ? 'paused' : 'playing') : 'none'; $('music').setAttribute('aria-label', CONFIG.song ? (song.paused ? 'Play our song' : 'Pause our song') : 'Music information'); $('play-icon').textContent = CONFIG.song ? '' : '♪'; $('music-caption').textContent = CONFIG.song ? (song.paused ? 'Tap to play' : 'Tap to pause') : 'Our soundtrack'; }
if (CONFIG.song) song.src = CONFIG.song;
$('music').onclick = async () => { if (!CONFIG.song) return notice('Our soundtrack', 'Our song will be added soon.'); if (song.paused) { try { await song.play(); } catch { notice('One more moment', 'The song could not be played. Please try again shortly.'); } } else song.pause(); updateMusic(); };
song.addEventListener('error', () => { song.pause(); updateMusic(); });
// Original invitation specifies all-day dates without a venue or timezone; use visitor-local midnight.
function tick(now = Date.now()) {
  const start = new Date(CONFIG.start + 'T00:00:00').getTime();
  const end = new Date(CONFIG.endExclusive + 'T00:00:00').getTime();
  const remaining = Math.max(0, start - now);
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ['days','hours','minutes','seconds'].forEach((id,i) => $(id).textContent = String(values[i]).padStart(i ? 2 : 1, '0'));
  $('countdown-title').textContent = now >= end ? 'A date to remember, always' : now >= start ? 'The celebration is here!' : 'Counting the moments until we celebrate';
}
tick(); setInterval(tick, 1000);
new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.1}).observe($('details'));
if (['#invitation','#details'].includes(location.hash)) { showInvitation(false); if(location.hash === '#details') requestAnimationFrame(() => $('details').scrollIntoView()); }

// Strokes are stored in normalised coordinates so partial scratching survives rotation and resizing.
(() => {
  const canvas = $('date-foil'), card = $('scratch-card'), result = $('scratch-message');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let revealed = false, activePointer = null, currentStroke = null, strokes = [];
  let width = 0, height = 0, scale = 1, lastCheck = 0;
  function reveal() {
    if (revealed) return;
    revealed = true; activePointer = null;
    card.classList.add('is-revealed');
    result.removeAttribute('aria-hidden');
    const moveFocus = document.activeElement === $('reveal-dates');
    $('reveal-dates').hidden = true;
    $('scratch-note').textContent = 'Three days of celebration';
    $('scratch-status').textContent = 'Wedding dates revealed: 25, 26 and 27 December 2026.';
    if (moveFocus) result.focus({ preventScroll: true });
    if (!reducedMotion) celebrate();
  }
  // Gold fireworks over the card and a confetti shower across the screen, as the reference site does on reveal.
  function celebrate() {
    const layer = $('celebration'), gold = ['#d4a848', '#e8c97a', '#fff3c4', '#b8923f', '#f6e7c1'];
    const rect = card.getBoundingClientRect();
    layer.replaceChildren();
    for (let i = 0; i < 8; i++) {
      const burst = document.createElement('span'); burst.className = 'firework';
      burst.style.cssText = `left:${rect.left + rect.width * (.12 + Math.random() * .76)}px;top:${rect.top + rect.height * (.1 + Math.random() * .8)}px`;
      for (let k = 0; k < 22; k++) {
        const angle = k / 22 * Math.PI * 2, distance = 60 + Math.random() * 70, dot = document.createElement('i');
        dot.style.cssText = `--c:${gold[i % gold.length]};--x:${Math.cos(angle) * distance}px;--y:${Math.sin(angle) * distance}px;--delay:${i * .18}s`;
        burst.append(dot);
      }
      layer.append(burst);
    }
    for (let i = 0; i < 48; i++) {
      const piece = document.createElement('i'), size = 5 + Math.random() * 6; piece.className = 'confetti';
      piece.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * .4}px;background:${gold[i % gold.length]};--dur:${3 + Math.random() * 2.5}s;--delay:${Math.random() * 1.2}s;--drift:${Math.random() * 120 - 60}px;transform:rotate(${Math.random() * 360}deg)`;
      layer.append(piece);
    }
    setTimeout(() => layer.replaceChildren(), 7000);
  }
  $('reveal-dates').addEventListener('click', reveal);
  if (!context) { canvas.hidden = true; reveal(); return; }
  function erase(from, to) {
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = Math.max(30, width * .085); context.lineCap = 'round'; context.lineJoin = 'round';
    context.beginPath(); context.moveTo(from.x * width, from.y * height);
    context.lineTo(to.x * width, to.y * height); context.stroke();
    context.beginPath(); context.arc(to.x * width, to.y * height, context.lineWidth / 2, 0, Math.PI * 2); context.fill();
  }
  function paint() {
    if (revealed) return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = card.clientWidth; height = card.clientHeight; scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0); context.globalCompositeOperation = 'source-over';
    const foil = context.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, '#efe0bc'); foil.addColorStop(.45, '#d6ba86'); foil.addColorStop(.55, '#e7d09f'); foil.addColorStop(1, '#c8aa6e');
    context.fillStyle = foil; context.fillRect(0, 0, width, height);
    const sheen = context.createLinearGradient(0, 0, width, 0);
    sheen.addColorStop(.3, '#fff0'); sheen.addColorStop(.5, '#fff7'); sheen.addColorStop(.7, '#fff0');
    context.fillStyle = sheen; context.fillRect(0, 0, width, height);
    context.fillStyle = '#ffffff55';
    for (let i = 0; i < 45; i++) { context.beginPath(); context.arc(((i*73+19)%449)/449*width, ((i*37+13)%173)/173*height, 1.5+i%2, 0, Math.PI*2); context.fill(); }
    context.fillStyle = '#5e4b2e'; context.textAlign = 'center'; context.textBaseline = 'middle';
    if ('letterSpacing' in context) context.letterSpacing = '2px';
    context.font = `500 ${width < 300 ? 13 : 15}px "Cormorant Garamond", Georgia, serif`;
    context.fillText('Scratch to reveal our dates', width/2, height/2, width - 24);
    for (const stroke of strokes) stroke.forEach((point, i) => erase(stroke[Math.max(0,i-1)], point));
  }
  function checkCoverage() {
    if (revealed || !canvas.width) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, total = 0;
    for (let y = 3; y < canvas.height; y += 6) for (let x = 3; x < canvas.width; x += 6) {
      total++; if (pixels[(y * canvas.width + x) * 4 + 3] < 32) clear++;
    }
    if (total && clear / total >= .45) reveal();
  }
  function point(event) { const r = canvas.getBoundingClientRect(); return { x: (event.clientX-r.left)/r.width, y: (event.clientY-r.top)/r.height }; }
  canvas.addEventListener('pointerdown', event => {
    if (revealed || activePointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault(); activePointer = event.pointerId; canvas.setPointerCapture(event.pointerId);
    currentStroke = [point(event)]; strokes.push(currentStroke); erase(currentStroke[0], currentStroke[0]);
  });
  canvas.addEventListener('pointermove', event => {
    if (revealed || event.pointerId !== activePointer) return;
    event.preventDefault(); const next = point(event); erase(currentStroke[currentStroke.length-1], next); currentStroke.push(next);
    if (performance.now() - lastCheck > 100) { lastCheck = performance.now(); checkCoverage(); }
  });
  function finish(event) { if (event.pointerId !== activePointer) return; activePointer = null; currentStroke = null; checkCoverage(); }
  canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish); canvas.addEventListener('lostpointercapture', finish);
  new ResizeObserver(paint).observe(card);
  document.fonts.ready.then(paint);
  paint();
})();
