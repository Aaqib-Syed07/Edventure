from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Message, MessageCreate, Channel, ChannelCreate
from utils.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/messages", tags=["Messages"])

# In-memory storage for development
channels_db = {
    "1": {
        "id": "1",
        "name": "Team Announcements",
        "type": "team",
        "unread": 3,
        "last_message": "New cohort starting next month",
        "last_message_time": "10:30 AM",
        "online": True,
        "typing": False,
        "created_at": datetime.now().isoformat()
    },
    "2": {
        "id": "2",
        "name": "Campus Leads - Telangana",
        "type": "campus_leads",
        "unread": 5,
        "last_message": "Info session scheduled",
        "last_message_time": "11:45 AM",
        "online": True,
        "typing": False,
        "created_at": datetime.now().isoformat()
    },
    "3": {
        "id": "3",
        "name": "Campus Leads - Maharashtra",
        "type": "campus_leads",
        "unread": 0,
        "last_message": "Great turnout today!",
        "last_message_time": "Yesterday",
        "online": False,
        "typing": False,
        "created_at": datetime.now().isoformat()
    },
    "4": {
        "id": "4",
        "name": "EVP A25 Coordinators",
        "type": "general",
        "unread": 2,
        "last_message": "Interview dates confirmed",
        "last_message_time": "9:15 AM",
        "online": True,
        "typing": False,
        "created_at": datetime.now().isoformat()
    },
    "5": {
        "id": "5",
        "name": "EdAstra Team",
        "type": "team",
        "unread": 1,
        "last_message": "Workshop materials ready",
        "last_message_time": "2 days ago",
        "online": False,
        "typing": False,
        "created_at": datetime.now().isoformat()
    }
}

messages_db = {
    "2": [  # Channel 2 messages
        {
            "id": "1",
            "channel_id": "2",
            "sender": "Sarah",
            "role": "team",
            "content": "Hi everyone! We have confirmed the dates for the EVP A25 preliminary interviews.",
            "timestamp": "10:30 AM",
            "time": "10:30",
            "date": "2025-10-22",
            "read": True,
            "starred": False,
            "file_name": None,
            "file_type": None,
            "file_url": None,
            "reply_to": None
        },
        {
            "id": "2",
            "channel_id": "2",
            "sender": "Priya",
            "role": "campus_lead",
            "content": "That's great! We have around 30 students interested from our campus.",
            "timestamp": "10:35 AM",
            "time": "10:35",
            "date": "2025-10-22",
            "read": True,
            "starred": False,
            "file_name": None,
            "file_type": None,
            "file_url": None,
            "reply_to": None
        },
        {
            "id": "3",
            "channel_id": "2",
            "sender": "Rahul",
            "role": "campus_lead",
            "content": "We organized an info session yesterday. Got excellent response with 45+ registrations!",
            "timestamp": "10:42 AM",
            "time": "10:42",
            "date": "2025-10-22",
            "read": True,
            "starred": True,
            "file_name": None,
            "file_type": None,
            "file_url": None,
            "reply_to": None
        }
    ]
}

@router.get("/channels", response_model=List[Channel])
async def get_channels(current_user: dict = Depends(get_current_user)):
    # Filter channels based on user role
    user_role = current_user.get("role")
    if user_role == "campus_lead":
        # Campus leads don't see team-only channels
        return [ch for ch in channels_db.values() if ch["type"] != "team"]
    return list(channels_db.values())

@router.post("/channels", response_model=Channel, status_code=status.HTTP_201_CREATED)
async def create_channel(channel: ChannelCreate, current_user: dict = Depends(get_current_user)):
    # Only team members can create channels
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can create channels"
        )
    
    channel_id = str(uuid.uuid4())
    channel_data = {
        "id": channel_id,
        **channel.model_dump(),
        "unread": 0,
        "last_message": "",
        "last_message_time": "",
        "online": False,
        "typing": False,
        "created_at": datetime.now().isoformat()
    }
    
    channels_db[channel_id] = channel_data
    return channel_data

@router.get("/{channel_id}", response_model=List[Message])
async def get_messages(channel_id: str, current_user: dict = Depends(get_current_user)):
    if channel_id not in channels_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    # Return messages for this channel
    return messages_db.get(channel_id, [])

@router.post("/{channel_id}", response_model=Message, status_code=status.HTTP_201_CREATED)
async def send_message(channel_id: str, message: MessageCreate, current_user: dict = Depends(get_current_user)):
    if channel_id not in channels_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    message_id = str(uuid.uuid4())
    now = datetime.now()
    
    message_data = {
        "id": message_id,
        **message.model_dump(),
        "timestamp": now.strftime("%I:%M %p"),
        "time": now.strftime("%H:%M"),
        "date": now.strftime("%Y-%m-%d"),
        "read": False,
        "starred": False
    }
    
    # Add message to channel
    if channel_id not in messages_db:
        messages_db[channel_id] = []
    messages_db[channel_id].append(message_data)
    
    # Update channel's last message
    channels_db[channel_id]["last_message"] = message.content
    channels_db[channel_id]["last_message_time"] = now.strftime("%I:%M %p")
    
    return message_data

@router.put("/{channel_id}/{message_id}/star", response_model=Message)
async def toggle_star(channel_id: str, message_id: str, current_user: dict = Depends(get_current_user)):
    if channel_id not in messages_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    for message in messages_db[channel_id]:
        if message["id"] == message_id:
            message["starred"] = not message["starred"]
            return message
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Message not found"
    )

@router.delete("/{channel_id}/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(channel_id: str, message_id: str, current_user: dict = Depends(get_current_user)):
    if channel_id not in messages_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    messages_db[channel_id] = [m for m in messages_db[channel_id] if m["id"] != message_id]