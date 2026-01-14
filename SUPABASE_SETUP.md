# Supabase Setup Guide for CinemaTape

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create a new project:
   - **Name**: CinemaTape
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine

## Step 2: Create Database Tables

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `watched_films` table
- `watch_later` table
- Row Level Security policies
- Indexes for performance

## Step 3: Get API Keys

1. Go to **Project Settings** → **API**
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Configure Your App

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 5: Switch to Supabase Version

Replace the content of `src/main.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppSupabase from './AppSupabase.jsx'; // Changed from App to AppSupabase
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppSupabase />
  </React.StrictMode>,
);
```

## Step 6: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

## Step 7: Test Locally

```bash
npm run dev
```

1. Open http://localhost:5173/CinemaTape/
2. Sign up with your email
3. Check your email for confirmation link
4. Sign in and test the app

## Step 8: Deploy to GitHub Pages

1. Make sure `.env` is in `.gitignore` (it is by default)
2. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

3. **Important**: Add environment variables to GitHub:
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Add secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. Update `.github/workflows/deploy.yml` to use environment variables:
   ```yaml
   - name: Build
     env:
       VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
       VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
     run: npm run build
   ```

## Features

✅ **User Authentication**
- Sign up with email
- Sign in with password
- Email confirmation
- Secure session management

✅ **Cloud Storage**
- All data synced to Supabase
- Access from any device
- Real-time updates
- Automatic backups

✅ **Security**
- Row Level Security (RLS)
- Users can only see their own data
- Secure API with JWT tokens
- Password encryption

## Database Schema

### watched_films
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `title` (TEXT) - Movie title
- `year` (INTEGER) - Release year
- `watch_date` (TIMESTAMP) - When watched
- `rating` (INTEGER) - 0-10 rating
- `note` (TEXT) - User notes
- `poster` (TEXT) - Poster URL
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### watch_later
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `title` (TEXT) - Movie title
- `year` (INTEGER) - Release year
- `rating` (INTEGER) - 0-10 rating
- `added_date` (TIMESTAMP) - When added
- `created_at` (TIMESTAMP)

## Troubleshooting

### Email confirmation not working
- Check Supabase **Authentication** → **Email Templates**
- Make sure SMTP is configured (or use Supabase's default)

### Data not syncing
- Check browser console for errors
- Verify API keys are correct
- Check Supabase logs in dashboard

### Row Level Security errors
- Make sure you're signed in
- Check RLS policies are created correctly
- Verify `user_id` is being set correctly

## Migration from IndexedDB

If you want to migrate existing local data to Supabase:

1. Export data from IndexedDB (browser DevTools)
2. Sign in to your Supabase account
3. Use SQL Editor to insert data manually, or
4. Create a migration script to bulk insert

## Cost

**Free tier includes:**
- 500MB database space
- 1GB file storage
- 2GB bandwidth
- 50,000 monthly active users
- 500,000 Edge Function invocations

Perfect for personal use! 🎉
