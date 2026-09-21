# Envelope opening clip — prompt for Gemini (Veo) or Google Flow

Goal: an 8 second, vertical 9:16 clip that starts on `start-frame.png` (our sealed envelope on the terrace) and ends on a full warm-white frame, so the site can cut from the video straight to the invitation page.

## Step 0 (recommended): let the AI draw the envelope first

Upload `start-frame.png` to Gemini (image editing) or Flow and ask for a new still. Use that still as the cover image on the site and as the first frame of the video, so the envelope is photoreal instead of CSS.

```
Edit this image. Replace the flat envelope with a photorealistic square ivory cotton-paper envelope standing upright on the marble pedestal, the same size and position, its bottom edge resting on the pedestal with a soft contact shadow. Textured handmade paper lit by the warm golden-hour light from the left. An ornate antique-gold foil filigree border runs along the edges of the flap, with small gold foil botanical flourishes in the corners, and a round champagne-gold wax seal with an embossed botanical sprig sits at the tip of the flap. Keep everything else exactly the same: pedestal, terrace, lake, mountains, sky, roses and gold leaves. No text, no letters, no monogram, no people. Vertical 9:16, 1080×1920.
```

## Files to upload

- `start-frame.png` — first frame (1080×1920). The cover with no text on it.
- `end-frame.png` — last frame (solid warm white #fff8ea). Use it if the tool accepts a last frame (Flow "Frames to video" does). In the Gemini app, upload only the start frame.

## Settings

- Aspect ratio: 9:16 (vertical)
- Duration: 8 seconds
- Resolution: 1080p if offered, otherwise 720p
- Audio: off (the site plays its own song)
- Mode: image to video / "Frames to video" with the start frame (and end frame if available)

## Prompt

```
Locked-off static camera, no camera movement, vertical 9:16, 8 seconds.
A sealed ivory paper envelope with thin gold trim, a small gold "R & A" monogram and a round gold wax seal stands upright on a carved cream marble pedestal on a hazy lakeside terrace at golden hour, white roses and gold leaves at the edges. Keep the envelope, seal, monogram, pedestal and background exactly as in the first frame throughout.

0–2 s: everything is still except a few tiny ivory petals drifting down. The gold wax seal begins to glow from within with warm golden light, slowly intensifying. A thin horizontal ring of golden light expands outward from the seal across the envelope and past the edges of the frame, with a soft anamorphic lens-flare streak.
2–4 s: the top flap of the envelope lifts and opens fully upward, revealing a champagne damask-patterned lining. Fine golden sparkles and glitter dust rise out of the open envelope and swirl gently upward.
4–6.5 s: a brilliant white-gold light blooms from inside the envelope and grows into a radiant starburst with soft rays, washing over the envelope and the pedestal.
6.5–8 s: the light keeps growing until it fills the entire frame with a pure warm white-gold glow; hold on the fully white frame to the end.

Photorealistic, cinematic, elegant wedding invitation film. Soft volumetric light, warm ivory and champagne gold palette, shallow depth of field, gentle graceful motion, 24 fps.
No text, no captions, no watermark, no people, no hands, no new objects, no zoom, no pan, no camera shake.
```

## Negative prompt (if the tool has a field for it)

```
text, letters, captions, watermark, logo, people, hands, faces, camera movement, zoom, pan, shaking, pink, red, magenta, extra envelopes, envelope changing shape or colour, flicker, cut, scene change
```

## If the result is close but not right

- Flap opens the wrong way or the seal vanishes early: add "the wax seal stays attached to the tip of the flap as it lifts".
- Light too weak: add "the final two seconds are completely white, no scenery visible".
- Colours drift pink: repeat "ivory, cream and champagne gold only" and keep the negative prompt.
- Camera drifts: add "tripod shot, the pedestal and horizon do not move".

## Handing it over

Send the mp4 as generated. It will be re-encoded to 720×1280 H.264 at about 2 MB, wired as: cover still → tap plays the clip → it ends on white → the invitation fades in. The current CSS light sequence stays as the fallback if the video fails to load.
