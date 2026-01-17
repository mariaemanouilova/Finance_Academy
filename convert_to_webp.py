#!/usr/bin/env python3
"""Convert all JPG images in img folder to WebP format"""

from PIL import Image
import os
import glob

img_folder = os.path.join(os.path.dirname(__file__), 'img')
os.chdir(img_folder)

# Convert all jpg files to webp
for jpg_file in glob.glob('*.jpg'):
    try:
        img = Image.open(jpg_file)
        webp_file = os.path.splitext(jpg_file)[0] + '.webp'
        img.save(webp_file, 'WEBP', quality=80)
        print(f'✓ Converted: {jpg_file} -> {webp_file}')
    except Exception as e:
        print(f'✗ Error converting {jpg_file}: {e}')

print("\nConversion complete!")
