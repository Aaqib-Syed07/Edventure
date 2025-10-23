-- HackEthon - EdVenture Park Community Platform
-- Supabase Database Schema
-- 
-- Instructions:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to create all tables
-- 5. Update /app/backend/.env with your Supabase credentials

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('team', 'campus_lead')),
    phone TEXT,
    location TEXT,
    college TEXT,
    department TEXT,
    bio TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    joined_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cohorts table
CREATE TABLE IF NOT EXISTS cohorts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    program TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    milestones TEXT[] DEFAULT '{}',
    completed_milestones INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Campus Leads table
CREATE TABLE IF NOT EXISTS campus_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    events_organized INTEGER DEFAULT 0,
    students_reached INTEGER DEFAULT 0,
    performance TEXT,
    last_activity TEXT,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('team', 'campus_leads', 'general')),
    unread INTEGER DEFAULT 0,
    last_message TEXT DEFAULT '',
    last_message_time TEXT DEFAULT '',
    online BOOLEAN DEFAULT FALSE,
    typing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    time TEXT NOT NULL,
    date TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    starred BOOLEAN DEFAULT FALSE,
    file_name TEXT,
    file_type TEXT,
    file_url TEXT,
    reply_to_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    cohort_id TEXT,
    created_by TEXT NOT NULL,
    attendees TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default stats data
INSERT INTO stats (id, category, label, value, icon, color) VALUES
    ('c1', 'cohort', 'Total Participants', '105', 'Users', 'text-cyan-600'),
    ('c2', 'cohort', 'Active Cohorts', '3', 'TrendingUp', 'text-lime-600'),
    ('c3', 'cohort', 'Completion Rate', '78%', 'Target', 'text-purple-600'),
    ('c4', 'cohort', 'Success Stories', '24', 'Award', 'text-orange-600'),
    ('l1', 'campus_lead', 'Telangana', '15 leads', 'MapPin', 'text-cyan-600'),
    ('l2', 'campus_lead', 'Maharashtra', '12 leads', 'MapPin', 'text-lime-600'),
    ('l3', 'campus_lead', 'Tamil Nadu', '10 leads', 'MapPin', 'text-purple-600'),
    ('l4', 'campus_lead', 'Karnataka', '8 leads', 'MapPin', 'text-orange-600')
ON CONFLICT (id) DO NOTHING;

-- Insert default cohorts data
INSERT INTO cohorts (id, name, program, status, start_date, end_date, participants, progress, milestones, completed_milestones) VALUES
    ('1', 'EVP A25', 'Pre-Incubation', 'Active', '2025-01-15', '2025-04-30', 45, 65, 
     ARRAY['Ideation', 'Prototyping', 'Market Research', 'Pitch Preparation'], 2),
    ('2', 'EdAstra Batch 6', 'Innovation Challenge', 'Active', '2025-02-01', '2025-05-15', 32, 40,
     ARRAY['Team Formation', 'Problem Identification', 'Solution Design', 'Demo Day'], 1),
    ('3', 'Tentative Sprint', 'Advanced Incubation', 'Planning', '2025-03-01', '2025-06-30', 28, 15,
     ARRAY['Onboarding', 'Mentor Matching', 'Development', 'Launch'], 0)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);
CREATE INDEX IF NOT EXISTS idx_stats_category ON stats(category);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust as needed)
CREATE POLICY "Enable read access for authenticated users" ON cohorts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON cohorts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON cohorts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON cohorts FOR DELETE USING (true);

CREATE POLICY "Enable read access for authenticated users" ON stats FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON stats FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON stats FOR DELETE USING (true);

-- Note: Add similar policies for other tables as needed
