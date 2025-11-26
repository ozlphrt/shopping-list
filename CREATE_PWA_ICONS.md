# Create PWA Icons

The PWA needs two icon files:
- `/public/icon-192.png` (192x192 pixels)
- `/public/icon-512.png` (512x512 pixels)

## Quick Option: Use Online Generator
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a logo or generate one
3. Download the icons
4. Save as `icon-192.png` and `icon-512.png` in the `public/` folder

## Or Create Simple Icons
You can create simple colored squares with text "SL" or a shopping cart icon.

The vite-plugin-pwa will automatically:
- Generate service worker
- Register service worker
- Enable offline support
- Add install prompt

Once icons are added, the PWA will be fully functional!


