# 🚀 Make Your Site Live on GitHub Pages

## Quick Setup (3 Steps)

### Step 1: Create gh-pages Branch
```bash
# Create and switch to new branch
git checkout --orphan gh-pages

# Remove all files except landing folder
git rm -rf .

# Move landing page files to root
cp landing/index.html .

# Commit
git add index.html
git commit -m "Add landing page for GitHub Pages"

# Push branch
git push origin gh-pages
```

### Step 2: Enable GitHub Pages
1. Go to: https://github.com/Shadow143-art/tracker/settings/pages
2. Under **"Source"** section:
   - Select: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/(root)**
3. Click **Save**
4. Wait 1-2 minutes
5. Your site will be live at: `https://shadow143-art.github.io/tracker`

### Step 3: Update Landing Page Link
1. Edit `landing/index.html`
2. Find this line:
   ```html
   <a href="https://your-vercel-or-render-url.vercel.app" class="btn btn-primary">Launch App</a>
   ```
3. Replace with your actual app URL (Vercel, Render, or localhost for demo)

## 📝 What You Get

- **Beautiful landing page** hosted on GitHub Pages (FREE)
- **Custom domain support** (optional)
- **SSL certificate** included
- **99.9% uptime** guaranteed by GitHub

## 🔗 Your URLs

| URL | Purpose |
|-----|---------|
| `https://shadow143-art.github.io/tracker` | Landing Page (GitHub Pages) |
| `https://your-app.vercel.app` | Actual App (Vercel/Render) |

## ✨ Features of Landing Page

- ✅ Responsive design (mobile-friendly)
- ✅ Beautiful gradient background
- ✅ Fast loading (static HTML)
- ✅ SEO optimized
- ✅ Social media ready

## 🎯 Next Steps

1. Run the git commands above
2. Enable Pages in GitHub Settings
3. Share your live URL!

---

**Note:** The main Next.js app runs separately. This landing page just provides a public-facing introduction.
