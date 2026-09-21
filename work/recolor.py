import subprocess, sys
src, dst, w, h = sys.argv[1], sys.argv[2], 500, 500
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], capture_output=True, check=True).stdout
px = bytearray(raw)
IVORY = (247, 240, 226); GOLD = (173, 134, 58); GOLD_HI = (214, 182, 112)
PAPER_LUM = 62.0
def clamp(v, lo, hi): return lo if v < lo else hi if v > hi else v
for i in range(0, len(px), 4):
    r, g, b, a = px[i], px[i+1], px[i+2], px[i+3]
    if a < 200: continue
    mx, mn = max(r, g, b), min(r, g, b)
    sat = (mx - mn) / mx if mx else 0
    lum = 0.299*r + 0.587*g + 0.114*b
    shade = clamp(0.55 + 0.45 * lum / PAPER_LUM, 0.5, 1.06)
    paper = [c * shade for c in IVORY]
    t = clamp((0.5 - sat) / 0.28, 0, 1)
    if t > 0:
        k = clamp(lum / 210, 0, 1)
        gold = [GOLD[j] + (GOLD_HI[j] - GOLD[j]) * k for j in range(3)]
        paper = [paper[j] * (1 - t) + gold[j] * t for j in range(3)]
    px[i], px[i+1], px[i+2] = (int(clamp(c, 0, 255)) for c in paper)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{w}x{h}', '-i', '-', '-frames:v', '1', dst], input=bytes(px), check=True)
print('wrote', dst)
