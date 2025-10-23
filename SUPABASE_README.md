# Supabase Setup Instructions

## Current Status
✅ **Backend is configured to work with or without Supabase**
- If Supabase credentials are not configured, the app uses in-memory storage (development mode)
- Once Supabase is connected, all data will persist in the database

## How to Connect Supabase

### Step 1: Get Your Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon/public key** (labeled as `anon public`)
   - **service_role key** (labeled as `service_role`)

### Step 2: Update Backend Environment Variables

Edit `/app/backend/.env` and replace the placeholder values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
JWT_SECRET_KEY=your_jwt_secret_key_change_this_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### Step 3: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Open the file `/app/SUPABASE_SETUP.sql`
4. Copy the entire SQL script
5. Paste it into the Supabase SQL Editor
6. Click **Run** to create all tables and insert default data

### Step 4: Restart Backend Server

After updating the `.env` file and creating the database tables:

```bash
sudo supervisorctl restart backend
```

### Step 5: Verify Connection

Check the backend logs to confirm successful connection:

```bash
tail -f /var/log/supervisor/backend.err.log
```

You should see:
```
INFO:utils.database:Successfully connected to Supabase
```

If you see "Using mock database for development", check your credentials.

## Database Schema

The application uses the following tables:

- **users** - User accounts (team members and campus leads)
- **cohorts** - Pre-incubation cohort information
- **campus_leads** - Campus lead profiles and performance data
- **stats** - Dashboard statistics (dynamic tiles)
- **channels** - Chat channels
- **messages** - Chat messages
- **events** - Calendar events

## Testing Dynamic Stats

Once Supabase is connected:

1. Login to the dashboard at the frontend URL
2. Use the "Manage Stats" button to update statistics
3. The changes will persist in Supabase and reflect across all sessions
4. Refresh the page to see the stats load from the database

## Fallback Mode (Current State)

**The app is currently running in fallback mode:**
- ✅ All APIs are functional
- ✅ Frontend can fetch and display data
- ✅ Stats are displayed dynamically from the backend
- ⚠️ Data is stored in-memory (resets on server restart)

**Once Supabase is connected:**
- ✅ All data persists in the database
- ✅ No code changes required
- ✅ Automatic database initialization on startup
- ✅ All features work exactly the same, but with persistent storage

## Troubleshooting

### "Invalid URL" Error
- Verify your SUPABASE_URL starts with `https://` and ends with `.supabase.co`
- Make sure there are no extra spaces or quotes in the .env file

### "Authentication Failed" Error
- Double-check your SUPABASE_KEY and SUPABASE_SERVICE_KEY
- Ensure you're using the correct keys (anon key for SUPABASE_KEY)

### Tables Don't Exist
- Run the SUPABASE_SETUP.sql script in Supabase SQL Editor
- Check for any SQL errors in the Supabase dashboard

### Data Not Persisting
- Confirm backend logs show "Successfully connected to Supabase"
- Check backend logs for any database operation errors

## Support

For Supabase-specific issues, visit:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com/)
