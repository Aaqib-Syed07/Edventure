# 🚀 Quick Setup Instructions

## ⚠️ IMPORTANT: Create Database Tables First

The Supabase connection is configured, but tables need to be created. Follow these steps:

### Step 1: Create Tables in Supabase

1. **Go to your Supabase Dashboard:**
   - Open: https://supabase.com/dashboard/project/dbzovtxdbljxruypjgmd

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Or go to: https://supabase.com/dashboard/project/dbzovtxdbljxruypjgmd/sql

3. **Run the SQL Script:**
   - Click "New Query"
   - Copy ALL the contents from `/app/SUPABASE_SETUP.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Tables Created:**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     ✅ users
     ✅ cohorts
     ✅ stats
     ✅ campus_leads
     ✅ channels
     ✅ messages
     ✅ events

### Step 2: Restart Backend

After creating the tables, restart the backend:

```bash
sudo supervisorctl restart backend
```

### Step 3: Verify Connection

Check the logs to confirm successful connection:

```bash
tail -f /var/log/supervisor/backend.err.log
```

You should see:
```
INFO:utils.database:Successfully connected to Supabase
INFO:utils.db_init:Default stats inserted
INFO:utils.db_init:Default cohorts inserted
```

### Step 4: Test the Application

1. Open: http://localhost:3000
2. Register/Login
3. Check if stats load from Supabase
4. Try updating stats - changes should persist!

---

## ✅ Current Status

**Supabase Connection:** ✅ Configured
- URL: https://dbzovtxdbljxruypjgmd.supabase.co
- Keys: ✅ Added to .env file
- Backend: ✅ Connected successfully

**Database Tables:** ⚠️ **Need to be created manually**
- Please follow Step 1 above

**GitHub:** Ready to push
- Repo: https://github.com/Aaqib-Syed07/Edventure
- Use "Save to GitHub" button in chat, or see `/app/GITHUB_PUSH_GUIDE.md`

---

## 🆘 Troubleshooting

### If tables don't create:
- Make sure you're logged into Supabase
- Verify you're in the correct project
- Try creating one table at a time if the full script fails

### If backend still uses in-memory storage:
- Check that tables exist in Supabase Table Editor
- Restart backend: `sudo supervisorctl restart backend`
- Check logs for any connection errors

---

**Once tables are created, your application will be fully connected to Supabase and ready to use!**
