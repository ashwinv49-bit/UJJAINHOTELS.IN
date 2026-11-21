#!/usr/bin/env python3
"""
Responsive image pipeline (Pillow only).

  python3 scripts/images.py

Reads  assets-src/photos/manifest.json and the originals in assets-src/photos/
Writes src/assets/images/photos/<key>-<width>.{avif,webp,jpg}
       data/photos.json   (consumed by the site build: picture() and credits page)

- Widths: 480, 800, 1200, 1600, 2000 (never upscaled)
- Strips all metadata (EXIF/GPS) from outputs
- Skips photos whose original is missing, and warns about unverified alt text
"""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'assets-src', 'photos')
OUT = os.path.join(ROOT, 'src', 'assets', 'images', 'photos')
DATA = os.path.join(ROOT, 'data', 'photos.json')
WIDTHS = [480, 800, 1200, 1600, 2000]
QUALITY = {'avif': 50, 'webp': 74, 'jpg': 78}

def main():
    manifest = json.load(open(os.path.join(SRC, 'manifest.json')))
    os.makedirs(OUT, exist_ok=True)
    result, warnings = {}, []
    for key, meta in manifest['photos'].items():
        original = os.path.join(SRC, meta['file'])
        if not os.path.exists(original):
            warnings.append(f'{key}: original not found ({meta["file"]}) — skipped')
            continue
        if not meta.get('altVerified'):
            warnings.append(f'{key}: alt text not yet verified against the photo')
        im = ImageOps.exif_transpose(Image.open(original)).convert('RGB')
        widths = [w for w in WIDTHS if w <= im.width] or [im.width]
        for w in widths:
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            base = os.path.join(OUT, f'{key}-{w}')
            resized.save(base + '.jpg', 'JPEG', quality=QUALITY['jpg'], optimize=True, progressive=True)
            resized.save(base + '.webp', 'WEBP', quality=QUALITY['webp'], method=6)
            resized.save(base + '.avif', 'AVIF', quality=QUALITY['avif'])
        result[key] = {
            'src': f'/assets/images/photos/{key}',
            'widths': widths,
            'width': im.width,
            'height': im.height,
            'alt': meta['alt'],
            'focus': meta.get('focus', '50% 50%'),
            'credit': meta.get('credit'),
        }
        print(f'✓ {key}: {len(widths)} sizes × 3 formats')
    json.dump(result, open(DATA, 'w'), indent=2, ensure_ascii=False)
    print(f'Wrote data/photos.json ({len(result)} photos)')
    for w in warnings:
        print(f'  ! {w}', file=sys.stderr)

if __name__ == '__main__':
    main()
