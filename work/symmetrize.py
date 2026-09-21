"""Mirror the right side of the envelope artwork onto the left, outside the seal, so the flap shadow matches on both sides.
Usage: python3 symmetrize.py in.png out.png  (expects the 442x440 paper crop)"""
import subprocess, sys
src, dst = sys.argv[1:3]; w, h = 442, 440
raw = bytearray(subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], capture_output=True, check=True).stdout)
for y in range(h):
    for x in range(170):
        i = (y * w + x) * 4; j = (y * w + (w - 1 - x)) * 4
        t = 1.0 if x < 150 else (170 - x) / 20
        for k in range(4): raw[i + k] = int(raw[i + k] * (1 - t) + raw[j + k] * t)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{w}x{h}', '-i', '-', '-frames:v', '1', dst], input=bytes(raw), check=True)
print('wrote', dst)
