# CinemaTape Deployment Guide

## GitHub Pages Deployment

This application is configured to automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Setup Steps

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CinemaTape app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/CinemaTape.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings on GitHub
   - Navigate to **Pages** section
   - Under "Build and deployment", select **GitHub Actions** as the source
   - The workflow will automatically trigger on the next push

3. **Access Your App**
   - Once deployed, your app will be available at:
   - `https://YOUR_USERNAME.github.io/CinemaTape/`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The built files will be in the `dist/` folder
# You can upload these to any static hosting service
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Configuration

The app is configured in `vite.config.js` with:
- Base path: `/CinemaTape/` (for GitHub Pages)
- If deploying to a different domain or path, update the `base` field

### Data Storage

- All movie data is stored locally in your browser's IndexedDB
- Data persists across sessions but is specific to the browser
- No backend or cloud storage required
- Data is not synchronized between devices

### Troubleshooting

**Issue**: App shows blank page after deployment
- **Solution**: Check that the `base` path in `vite.config.js` matches your repository name

**Issue**: Changes not reflecting after push
- **Solution**: Check the Actions tab in GitHub to see if the workflow completed successfully
- May take 2-3 minutes for changes to appear

**Issue**: Movies not saving
- **Solution**: Check browser console for errors
- Ensure IndexedDB is not disabled in browser settings
- Try clearing browser cache and refreshing

### Features

- ✅ Manual movie entry (title, year, date, rating, notes)
- ✅ Calendar view with movie indicators
- ✅ Statistics and analytics
- ✅ Mobile-first responsive design
- ✅ Dark theme optimized for readability
- ✅ Offline-capable (works without internet after first load)

### Technology Stack

- React 18 + Vite
- Tailwind CSS for styling
- Dexie.js for IndexedDB storage
- Framer Motion for animations
- date-fns for date handling
- Lucide React for icons
