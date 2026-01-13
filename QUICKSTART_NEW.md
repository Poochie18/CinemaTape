# CinemaTape - Quick Start Guide

## Welcome to CinemaTape! 🎬

A simple, mobile-first cinema diary for tracking your movie watching habits.

## Getting Started

### 1. Local Development

```bash
# Navigate to the project folder
cd CinemaTape

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

### 2. Add Your First Movie

1. Click the **+** button in the top right
2. Enter movie title (required)
3. Enter year (optional)
4. Select watch date (defaults to today)
5. Rate the movie (0-10 stars)
6. Add notes about your thoughts
7. Click **Save**

### 3. Explore the Calendar

- Click on any day to see movies watched that day
- Gray indicators show days with movies
- Navigate months with arrow buttons
- Selected day is highlighted in darker gray

### 4. View Statistics

- Switch to **Statistics** tab
- See total movies watched
- View this year's count
- Check your average rating
- See monthly breakdown chart
- Browse top 5 rated movies

## Features

### Manual Movie Entry
- Add movies without internet connection
- Simple form: title, year, date, rating, notes
- No external API required

### Calendar View
- Monthly grid layout
- Visual indicators for watched movies
- Quick day selection
- Mobile-optimized touch targets

### Statistics Dashboard
- Total movies count
- Current year statistics
- Average rating calculation
- Monthly viewing chart
- Top-rated movies
- Most active day tracking

### Mobile-First Design
- Responsive on all screen sizes
- Touch-friendly buttons
- Optimized for smartphone use
- Clean dark theme for comfortable viewing

## Tips

### Adding Movies
- Press the **+** button or click on a calendar day
- Title is the only required field
- Past dates are allowed - add your movie history!

### Editing Movies
- Click a day in the calendar
- Click **Edit** on any movie card
- Update any details
- Changes save immediately

### Deleting Movies
- Click a day in the calendar
- Click **Delete** on any movie card
- Confirm the deletion
- Movie is removed permanently

### Rating System
- Click stars to rate 0-10
- 10 stars = 10/10 rating
- Half-stars not supported (full stars only)
- Rating is optional

## Data Storage

- All data stored locally in browser's IndexedDB
- No cloud sync or external storage
- Data persists across sessions
- Specific to the browser you're using
- Not shared between devices

## Deployment

See [DEPLOY.md](DEPLOY.md) for GitHub Pages deployment instructions.

## Offline Use

Once loaded, the app works completely offline:
- Add movies without internet
- Browse your library anytime
- View statistics offline
- All features available

## Keyboard Shortcuts

- **Esc** - Close modal dialogs
- **Enter** - Submit forms (when focused)
- **Tab** - Navigate between inputs

## Mobile Usage

Optimized for mobile devices:
- Swipe-friendly navigation
- Large touch targets
- Responsive text sizes
- Full-width buttons on small screens
- Compact calendar layout

## Troubleshooting

### Movies not appearing
- Check that title is filled in
- Verify date is selected
- Try refreshing the page

### Data disappeared
- Check if you're using the same browser
- Clear browser cache may delete data
- Data is not backed up automatically

### Page looks broken
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check browser console for errors

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

Requires IndexedDB support (all modern browsers have this).

## Development

Built with:
- React 18
- Vite 5
- Tailwind CSS
- Dexie.js (IndexedDB)
- Framer Motion (animations)
- date-fns (date handling)

## Need Help?

Check out:
- [DEPLOY.md](DEPLOY.md) - Deployment guide
- [CHANGES.md](CHANGES.md) - What changed from original
- Browser console for error messages

---

**Enjoy tracking your movie journey! 🍿**
