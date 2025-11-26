# Deployment Guide

## Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `shopping-list` (or your preferred name)
   - Make it public (required for free GitHub Pages)
   - Don't initialize with README, .gitignore, or license

2. **Push your code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/shopping-list.git
   git branch -M main
   git push -u origin main
   ```

3. **Set up GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: GitHub Actions
   - Save

4. **Add Secrets (for Firebase config)**
   - Go to Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_OPENAI_API_KEY` (optional, for OCR)

5. **Deploy**
   - The GitHub Actions workflow will automatically deploy on push
   - Or manually trigger: Actions → Deploy to GitHub Pages → Run workflow

## Your app will be available at:
`https://YOUR_USERNAME.github.io/shopping-list/`

## Note:
- Update `vite.config.ts` base path if your repo name is different
- Firebase config must be set as GitHub Secrets
- OpenAI API key is optional (only needed for OCR scanning)


