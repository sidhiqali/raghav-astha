# Raghav & Aastha — ivory wedding invitation

Dependency-free static site. Preview with `python3 -m http.server 4173 --directory outputs/vintage-invitation` and open http://localhost:4173. Nothing is published externally; `/Users/sidhiqali/save-the-date` is untouched.

## Files

`index.html`, `style.css`, `app.js`, `event.ics`, and `assets/` (terrace, envelope, lining, stationery, couple photo, petal, song; about 3.2 MB, of which the song is 2.2 MB and loads only on tap). Original sources live in `../../work/assets-src/`.

## Experience

**Cover.** The terrace backdrop with the studio's own square envelope artwork on the pedestal (`assets/envelope-ivory.webp`: the burgundy envelope from the Tanvi & Nishant project, recoloured to ivory paper with gold floral by `work/recolor.py`, which keeps the paper shading and turns the seal gold; its monogram already reads R A). It is sliced exactly as that site slices it: the pocket is the bottom half, the flap is the band from 6.4% to 49.2% with rounded lower corners, and the seal painted across that edge cracks naturally when the flap lifts. Behind the flap is a lined champagne back; inside is a dark pocket with the card. Every keyframe matches the reference (flap over .9s from .3s, card rise 1s from 1.1s, envelope travel 2.75s, fade at 2.1s). The cover goes position-fixed while opening so the invitation renders underneath and the two crossfade at 2.75 seconds. Reduced motion skips straight to the invitation; "The beginning" in the header returns to the sealed envelope.

Earlier envelope versions, the supplied still and clip, and the video prompt are kept in `../../work/assets-src/` and `../../work/video-prompt/`.

**Invitation.** Gold-frame stationery flatlay with the lace doily copy, one polaroid of the couple (`assets/couple.webp`, a resized copy of the supplied photo with monochrome grading, no retouching) and a vinyl record that plays or pauses the song.

**Song.** `assets/song.m4a` is the supplied "Jahaan" by Lost Stories, trimmed to start at 0:29 with a two second fade-in, AAC 96 kbps, about 2.2 MB. It starts on the seal tap (the gesture browsers require for audio), loops, and the record toggles it. It is not preloaded, so it costs nothing until the envelope is opened.

**Dates.** A champagne foil scratch card. Mouse, touch and pen strokes erase it; at 45 percent cleared it fades away with a soft gold glow and a light shimmer sweeps across the dates, while eight gold fireworks burst over the card in sequence and a shower of gold and champagne confetti falls across the screen for about six seconds, the way the reference site celebrates its reveal. "Three days of celebration" appears beneath. Partial strokes are kept in normalised coordinates so they survive resizing. "Reveal without scratching" is a text link under the card for keyboard users; the dates are announced through a live region and focus moves to the revealed content.

## Content

Raghav & Aastha, 25, 26 and 27 December 2026. Countdown uses visitor-local midnight; no venue timezone was supplied. Venue and RSVP destination are pending: set `rsvpUrl` in `CONFIG` at the top of app.js and replace the venue line in index.html. Until then RSVP opens a "details to follow" message.

## Checks

`work/check.mjs` drives a headless Chrome over the DevTools protocol at 390px and 1440px: captures timed frames of the opening and the reveal into `work/frames/`, and asserts the flap has turned over and the card has risen, the invitation is visible under the cover mid-crossfade, the cover is gone afterwards, the fireworks and confetti spawn, the reveal completes, and there is no horizontal overflow. Usage is in the file header.
