# 🚀 Deploy to GitHub Pages

## Quick Deploy Guide

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source", select **GitHub Actions**
4. The workflow will automatically deploy on next push

### 3. Your Site is Live! 🎉
- URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
- Auto-deploys on every push to `main` branch

## Configuration Done ✅

- ✅ Static export configured (`next.config.ts`)
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ 404.html for SPA routing support
- ✅ Build scripts updated

## Important Notes

1. **Base URL**: The site uses relative paths (`.`) for assets
2. **Client Routing**: 404.html handles SPA routing
3. **Images**: Unoptimized for static export
4. **API Calls**: Supabase works with public anon key

## Environment Variables

Add these to your GitHub repository (Settings → Secrets):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Manual Build Test

```bash
npm run build
# Output goes to /dist folder
```

## Troubleshooting

- **Blank page**: Check browser console for 404 errors
- **Routing issues**: Ensure 404.html is in dist folder
- **API errors**: Verify Supabase env vars are set
