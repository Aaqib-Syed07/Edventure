from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Event, EventCreate
from utils.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["Events"])

# In-memory storage for development
events_db = {}

@router.get("", response_model=List[Event])
async def get_events(current_user: dict = Depends(get_current_user)):
    return list(events_db.values())

@router.get("/{event_id}", response_model=Event)
async def get_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if event_id not in events_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return events_db[event_id]

@router.post("", response_model=Event, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    event_id = str(uuid.uuid4())
    event_data = {
        "id": event_id,
        **event.model_dump(),
        "attendees": [],
        "created_at": datetime.now().isoformat()
    }
    
    events_db[event_id] = event_data
    return event_data

@router.put("/{event_id}", response_model=Event)
async def update_event(event_id: str, event: EventCreate, current_user: dict = Depends(get_current_user)):
    if event_id not in events_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    event_data = events_db[event_id]
    event_data.update(event.model_dump())
    return event_data

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if event_id not in events_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    del events_db[event_id]

@router.post("/{event_id}/attend", response_model=Event)
async def attend_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if event_id not in events_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    event = events_db[event_id]
    user_id = current_user.get("user_id")
    
    if user_id not in event["attendees"]:
        event["attendees"].append(user_id)
    
    return event