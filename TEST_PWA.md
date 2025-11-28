# Testing PWA Install Prompt

## Prerequisites

The install prompt only appears when:
1. The app meets PWA criteria (manifest, service worker, HTTPS)
2. The user hasn't already installed the app
3. The browser supports the `beforeinstallprompt` event

## Testing Locally

### Option 1: Enable Service Worker in Development

1. **Temporarily enable service worker in dev mode:**
   - Edit `vite.config.ts`
   - Change `devOptions.enabled` from `false` to `true`

2. **Run the dev server:**
   ```bash
   npm run dev
   ```

3. **Open in Chrome/Edge:**
   - Go to `http://localhost:5173` (or your dev port)
   - Open DevTools (F12)
   - Go to **Application** tab → **Service Workers**
   - Verify service worker is registered

4. **Clear previous install state:**
   - In DevTools → **Application** tab → **Storage**
   - Click "Clear site data"
   - Or use: `sessionStorage.clear()` in console

5. **Trigger the prompt:**
   - The prompt should appear after 3 seconds
   - Or manually trigger in console:
     ```javascript
     window.dispatchEvent(new Event('beforeinstallprompt'))
     ```

### Option 2: Test in Production Build

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Open in browser:**
   - Go to the preview URL (usually `http://localhost:4173`)
   - The install prompt should appear after 3 seconds

### Option 3: Test on Deployed Site (Recommended)

1. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "feat: enhanced PWA install message"
   git push
   ```

2. **Wait for deployment** (check GitHub Actions)

3. **Open the deployed site:**
   - Go to your GitHub Pages URL
   - Open in Chrome/Edge (mobile or desktop)
   - The install prompt should appear after 3 seconds

## Testing Checklist

- [ ] Service worker is registered (check DevTools → Application → Service Workers)
- [ ] Manifest is valid (check DevTools → Application → Manifest)
- [ ] App is served over HTTPS (or localhost)
- [ ] Icons are loading correctly
- [ ] Install prompt appears after 3 seconds
- [ ] Install button triggers browser install dialog
- [ ] "Not now" button dismisses the prompt
- [ ] Prompt doesn't reappear after dismissal (in same session)
- [ ] Prompt doesn't show if app is already installed

## Manual Testing in Console

### Check if installable:
```javascript
// Check if app is installable
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('App is installable!', e);
});
```

### Force show prompt (for testing):
```javascript
// In console, after page loads:
const event = new Event('beforeinstallprompt');
event.prompt = () => Promise.resolve();
event.userChoice = Promise.resolve({ outcome: 'accepted' });
window.dispatchEvent(event);
```

### Check if already installed:
```javascript
// Check standalone mode
console.log('Is standalone:', window.matchMedia('(display-mode: standalone)').matches);
console.log('Is iOS standalone:', (window.navigator as any).standalone);
```

## Browser Support

- ✅ Chrome/Edge (Desktop & Android) - Full support
- ✅ Safari (iOS) - Manual install via "Add to Home Screen"
- ⚠️ Firefox - Limited support
- ⚠️ Safari (Desktop) - Limited support

## Troubleshooting

### Prompt doesn't appear:
1. Check if service worker is registered
2. Verify manifest is valid
3. Clear browser cache and site data
4. Check if app is already installed
5. Try in incognito/private mode
6. Verify you're on HTTPS or localhost

### Icons not loading:
1. Check icon files exist in `public/` folder
2. Verify paths in manifest
3. Check browser console for 404 errors
4. Rebuild the app: `npm run build`

### Service worker not registering:
1. Check `vite.config.ts` - ensure `devOptions.enabled` is set correctly
2. Clear browser cache
3. Check for console errors
4. Verify PWA plugin is installed: `npm list vite-plugin-pwa`

