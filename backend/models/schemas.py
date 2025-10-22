from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str  # 'team' or 'campus_lead'

class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    phone: Optional[str] = None
    location: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = []
    achievements: Optional[List[str]] = []
    joined_date: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    location: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = []
    achievements: Optional[List[str]] = []
    joined_date: Optional[str] = None

# Cohort Schemas
class CohortBase(BaseModel):
    name: str
    program: str
    status: str
    start_date: str
    end_date: str
    participants: int
    progress: int
    milestones: List[str]
    completed_milestones: int

class CohortCreate(CohortBase):
    pass

class Cohort(CohortBase):
    id: str
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

# Campus Lead Schemas
class CampusLeadBase(BaseModel):
    name: str
    college: str
    location: str
    status: str
    events_organized: int
    students_reached: int
    performance: str
    last_activity: str

class CampusLeadCreate(CampusLeadBase):
    user_id: Optional[str] = None

class CampusLead(CampusLeadBase):
    id: str
    user_id: Optional[str] = None
    
    class Config:
        from_attributes = True

# Channel Schemas
class ChannelBase(BaseModel):
    name: str
    type: str  # 'team', 'campus_leads', 'general'

class ChannelCreate(ChannelBase):
    pass

class Channel(ChannelBase):
    id: str
    unread: int = 0
    last_message: str = ""
    last_message_time: str = ""
    online: bool = False
    typing: bool = False
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

# Message Schemas
class MessageBase(BaseModel):
    channel_id: str
    sender: str
    role: str
    content: str

class MessageCreate(MessageBase):
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_url: Optional[str] = None
    reply_to_id: Optional[str] = None

class Message(MessageBase):
    id: str
    timestamp: str
    time: str
    date: str
    read: bool = False
    starred: bool = False
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_url: Optional[str] = None
    reply_to: Optional[dict] = None
    
    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: str
    time: Optional[str] = None
    cohort_id: Optional[str] = None

class EventCreate(EventBase):
    created_by: str

class Event(EventBase):
    id: str
    created_by: str
    attendees: List[str] = []
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

# Stats Schemas
class StatBase(BaseModel):
    label: str
    value: str
    icon: str
    color: str

class Stat(StatBase):
    id: str
    category: str  # 'cohort', 'campus_lead', etc.
    
    class Config:
        from_attributes = True

class StatsUpdate(BaseModel):
    stats: List[StatBase]

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User