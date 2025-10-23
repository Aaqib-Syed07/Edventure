# HackEthon - EdVenture Park Community Platform

A comprehensive community management platform for EdVenture Park, built with FastAPI, React, and Supabase.

The original Figma design is available at: https://www.figma.com/design/F19b7ehiwjbtPHlESjZCR4/HackEthon

## ✨ Features

### Dashboard & Analytics
- **Dynamic Statistics Dashboard** - Real-time stats tiles that update from database
- **Cohort Management** - Track pre-incubation cohorts with progress monitoring
- **Campus Lead Monitoring** - Manage and monitor campus ambassadors
- **Performance Metrics** - Visual progress tracking with charts

### Communication
- **Multi-Channel Chat** - Team, campus leads, and general channels
- **Real-time Messaging** - Instant communication with file sharing
- **Message Threading** - Reply and organize conversations

### Event Management
- **Calendar View** - Visual event scheduling
- **Event Creation** - Easy event planning for cohorts
- **Attendance Tracking** - Monitor event participation

### User Management
- **Role-Based Access** - Team members and campus leads
- **Profile Management** - Customizable user profiles
- **Authentication** - Secure JWT-based auth

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Supabase** - PostgreSQL database with real-time capabilities
- **JWT Authentication** - Secure token-based auth
- **Python 3.11+** - Latest Python features

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Yarn package manager
- Supabase account (free tier available)

### Backend Setup

1. Install Python dependencies:
```bash
cd /app/backend
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run the backend:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

1. Install Node dependencies:
```bash
cd /app/frontend
yarn install
```

2. Configure environment variables:
```bash
# Create .env file with:
VITE_API_URL=http://localhost:8001
```

3. Run the frontend:
```bash
yarn dev
```

## 🗄️ Database Setup

### Option 1: Quick Start (In-Memory Mode)
The application works out of the box with in-memory storage for development. No database setup required!

⚠️ **Note:** Data will be lost when the server restarts.

### Option 2: Supabase Connection (Recommended)

**See [SUPABASE_README.md](./SUPABASE_README.md) for detailed setup instructions.**

Quick steps:
1. Create a Supabase project at https://supabase.com
2. Copy your credentials to `/app/backend/.env`
3. Run the SQL script from `SUPABASE_SETUP.sql` in Supabase SQL Editor
4. Restart the backend server

## 🎯 Usage

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001
- **API Documentation:** http://localhost:8001/docs

### Default Test Credentials
For testing, you can register a new user:
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "team@edventure.com",
    "password": "password123",
    "name": "Team Admin",
    "role": "team"
  }'
```

### Dashboard Statistics
The dashboard displays dynamic statistics that can be managed:
1. Login as a team member
2. Navigate to the Cohorts tab
3. Click "Manage" next to Overview Statistics
4. Update values and save
5. Refresh to see changes persist (when Supabase is connected)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cohorts
- `GET /api/cohorts` - List all cohorts
- `POST /api/cohorts` - Create cohort (team only)
- `GET /api/cohorts/{id}` - Get cohort details
- `PUT /api/cohorts/{id}` - Update cohort (team only)
- `DELETE /api/cohorts/{id}` - Delete cohort (team only)

### Statistics
- `GET /api/stats/{category}` - Get statistics by category
- `PUT /api/stats/{category}` - Update statistics (team only)

### Campus Leads
- `GET /api/campus-leads` - List campus leads
- `POST /api/campus-leads` - Create campus lead
- `GET /api/campus-leads/{id}` - Get lead details

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Messages
- `GET /api/messages/channels` - List channels
- `GET /api/messages/{channel_id}` - Get channel messages
- `POST /api/messages/{channel_id}` - Send message

## 🔧 Development

### Project Structure
```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── routes/             # API endpoints
│   │   ├── auth.py
│   │   ├── cohorts.py
│   │   ├── stats.py
│   │   └── ...
│   ├── utils/
│   │   ├── database.py     # Supabase connection
│   │   ├── db_init.py      # Database initialization
│   │   ├── auth.py         # JWT utilities
│   │   └── config.py       # Configuration
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── SUPABASE_SETUP.sql      # Database schema
├── SUPABASE_README.md      # Supabase setup guide
└── GITHUB_PUSH_GUIDE.md    # Git instructions
```

### Adding New Features
1. **Backend:** Add routes in `/app/backend/routes/`
2. **Frontend:** Add components in `/app/frontend/src/components/`
3. **API Integration:** Update `/app/frontend/src/services/api.ts`

## 🚢 Deployment

### Backend Deployment
- Deploy to any Python hosting service (Heroku, Railway, Render)
- Set environment variables on the platform
- Ensure Supabase credentials are configured

### Frontend Deployment
- Build: `yarn build`
- Deploy `dist/` folder to any static hosting (Vercel, Netlify)
- Set `VITE_API_URL` to your backend URL

## 📝 Pushing to GitHub

**See [GITHUB_PUSH_GUIDE.md](./GITHUB_PUSH_GUIDE.md) for detailed instructions.**

### Quick Method
Use Emergent's **"Save to GitHub"** feature in the chat interface!

### Manual Method
```bash
git init
git add .
git commit -m "Initial commit: HackEthon platform"
git remote add origin https://github.com/yourusername/hackethon.git
git push -u origin main
```

## 🧪 Testing

### Backend Tests
```bash
curl http://localhost:8001/api/health
```

### Frontend Tests
Open http://localhost:3000 in your browser and:
1. Register a new user
2. Login
3. Navigate through all tabs
4. Test cohort creation
5. Test stats management

## 📚 Documentation

- **API Docs:** http://localhost:8001/docs (Interactive Swagger UI)
- **Supabase Setup:** [SUPABASE_README.md](./SUPABASE_README.md)
- **GitHub Guide:** [GITHUB_PUSH_GUIDE.md](./GITHUB_PUSH_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of EdVenture Park's HackEthon initiative.

## 🆘 Support

For issues or questions:
- Check the API documentation at `/docs`
- Review [SUPABASE_README.md](./SUPABASE_README.md) for database issues
- See [GITHUB_PUSH_GUIDE.md](./GITHUB_PUSH_GUIDE.md) for Git help

---

**Built with ❤️ for EdVenture Park Community**
  