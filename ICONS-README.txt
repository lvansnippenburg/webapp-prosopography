
=============================================================================
CREATING APP ICONS
=============================================================================

You need to create icons in the following sizes and place them in an 'icons/' folder:

Required sizes:
- icon-16x16.png   (favicon)
- icon-32x32.png   (favicon)
- icon-72x72.png   (small devices)
- icon-96x96.png   (small devices)
- icon-128x128.png (medium devices)
- icon-144x144.png (medium devices)
- icon-152x152.png (iOS)
- icon-192x192.png (Android)
- icon-384x384.png (large screens)
- icon-512x512.png (splash screens)

OPTION 1: Use the Livorno Coat of Arms
--------------------------------------
1. Save 'Livorno-coat-of-arms.png' at high resolution
2. Use an online tool like https://realfavicongenerator.net/
3. Upload your image
4. Download all generated icons
5. Place in 'icons/' folder

OPTION 2: Create Custom Icons
------------------------------
Design recommendations:
- Use Livorno colors: Red (#C41E3A), Gold (#D4AF37), White
- Keep design simple and recognizable at small sizes
- Use solid backgrounds (not transparent for splash screens)
- Include key element: "L" monogram, coat of arms, or ship symbol

Quick bash script to resize (requires ImageMagick):
---------------------------------------------------
#!/bin/bash
mkdir -p icons
convert Livorno-coat-of-arms.png -resize 16x16 icons/icon-16x16.png
convert Livorno-coat-of-arms.png -resize 32x32 icons/icon-32x32.png
convert Livorno-coat-of-arms.png -resize 72x72 icons/icon-72x72.png
convert Livorno-coat-of-arms.png -resize 96x96 icons/icon-96x96.png
convert Livorno-coat-of-arms.png -resize 128x128 icons/icon-128x128.png
convert Livorno-coat-of-arms.png -resize 144x144 icons/icon-144x144.png
convert Livorno-coat-of-arms.png -resize 152x152 icons/icon-152x152.png
convert Livorno-coat-of-arms.png -resize 192x192 icons/icon-192x192.png
convert Livorno-coat-of-arms.png -resize 384x384 icons/icon-384x384.png
convert Livorno-coat-of-arms.png -resize 512x512 icons/icon-512x512.png

Or use online tools:
- https://realfavicongenerator.net/
- https://favicon.io/
- https://www.websiteplanet.com/webtools/favicon-generator/
