# Fix GitHub Pages Environment

The terminal is timing out. Run this PowerShell script:

```powershell
.\fix-env.ps1
```

**Or manually via GitHub UI:**
1. Go to: https://github.com/ozlphrt/shopping-list/settings/environments
2. Click "github-pages"
3. Change "Protected branches only" → "No restriction"
4. Save

**After fixing, trigger deployment:**
```powershell
git commit --allow-empty -m "Trigger deployment after env fix"
git push
```


