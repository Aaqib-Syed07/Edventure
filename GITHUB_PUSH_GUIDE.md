# How to Push to GitHub

## Option 1: Use Emergent's "Save to GitHub" Feature (Recommended)

Emergent platform has a built-in feature to save your code directly to GitHub:

1. Look for the **"Save to GitHub"** button in the chat interface (near the input area)
2. Click on it and follow the prompts
3. Authenticate with your GitHub account if needed
4. Select or create a repository
5. Your code will be pushed automatically

This is the easiest method and handles all Git operations for you!

## Option 2: Manual Git Push (Advanced)

If you prefer to push manually or need more control:

### Step 1: Initialize Git (if not already done)
```bash
cd /app
git init
```

### Step 2: Add all files
```bash
git add .
```

### Step 3: Commit changes
```bash
git commit -m "Complete HackEthon EdVenture Park platform with Supabase integration"
```

### Step 4: Add your GitHub remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Step 5: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## What's Included

Your repository will contain:

### Backend
- ✅ FastAPI server with Supabase integration
- ✅ RESTful APIs for cohorts, stats, campus leads, events, messages
- ✅ JWT authentication
- ✅ Fallback in-memory storage for development
- ✅ Database initialization scripts

### Frontend
- ✅ React with Vite and TypeScript
- ✅ Tailwind CSS styling
- ✅ Radix UI components
- ✅ Dynamic dashboard with real-time stats
- ✅ Cohort management interface
- ✅ Campus leads monitoring
- ✅ Calendar and chat features

### Documentation
- ✅ SUPABASE_README.md - Detailed Supabase setup instructions
- ✅ SUPABASE_SETUP.sql - Database schema script
- ✅ README.md - Original project documentation

### Configuration Files
- ✅ requirements.txt - Python dependencies
- ✅ package.json - Node.js dependencies
- ✅ .env files - Environment configuration templates

## Important Notes

### .env Files
The `.env` files contain placeholder credentials. **After pushing to GitHub**:
1. Make sure to update `.env` files with your actual Supabase credentials
2. Never commit real credentials to a public repository
3. Consider using `.env.example` files instead and add `.env` to `.gitignore`

### Deployment
This application is designed to run on:
- **Backend:** FastAPI on port 8001
- **Frontend:** Vite dev server on port 3000
- **Database:** Supabase (PostgreSQL)

For production deployment, you'll need to:
1. Set up environment variables on your hosting platform
2. Configure CORS settings for your domain
3. Use production-ready database credentials
4. Set up proper SSL/TLS certificates

## Next Steps After Push

1. **Clone your repository** elsewhere to verify all files are there
2. **Test the setup** by following the README instructions
3. **Share your repository** with collaborators
4. **Set up CI/CD** if needed (GitHub Actions, etc.)

## Troubleshooting

### Large files warning
If you see warnings about large files:
- Check if `node_modules` is being tracked (it shouldn't be)
- Ensure `.gitignore` includes `node_modules` and other build artifacts

### Authentication failed
- Verify your GitHub credentials
- Check if you have write access to the repository
- Use a personal access token if using 2FA

### Branch protection
If your main branch is protected:
- Create a new branch: `git checkout -b development`
- Push to that branch: `git push -u origin development`
- Create a pull request on GitHub

---

**Remember:** The easiest way is to use the **"Save to GitHub"** feature in the Emergent chat interface!
