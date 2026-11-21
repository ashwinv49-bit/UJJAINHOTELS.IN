#!/usr/bin/env python3
"""Converts rendered PNGs: OG image → progressive JPEG, favicons → favicon.ico."""
import os
from PIL import Image
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
a = os.path.join(root, 'src', 'assets')
og = os.path.join(a, 'images', 'og', 'og-default.png')
Image.open(og).convert('RGB').save(og.replace('.png', '.jpg'), quality=86, optimize=True, progressive=True)
os.remove(og)
icons = os.path.join(a, 'icons')
Image.open(os.path.join(icons, 'favicon-32.png')).save(os.path.join(root, 'src', 'static', 'favicon.ico'), sizes=[(32, 32), (16, 16)])
for f in ('favicon-32.png', 'favicon-16.png'):
    os.remove(os.path.join(icons, f))
print('Brand assets finished')
