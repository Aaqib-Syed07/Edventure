from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import CampusLead, CampusLeadCreate
from utils.auth import get_current_user
import uuid

router = APIRouter(prefix="/api/campus-leads", tags=["Campus Leads"])

# In-memory storage for development
campus_leads_db = {
    "1": {
        "id": "1",
        "user_id": None,
        "name": "Priya Sharma",
        "college": "MS Degree College",
        "location": "Hyderabad, Telangana",
        "status": "Active",
        "events_organized": 12,
        "students_reached": 245,
        "last_activity": "2 hours ago",
        "performance": "Excellent"
    },
    "2": {
        "id": "2",
        "user_id": None,
        "name": "Rahul Verma",
        "college": "IIT Bombay",
        "location": "Mumbai, Maharashtra",
        "status": "Active",
        "events_organized": 18,
        "students_reached": 320,
        "last_activity": "5 hours ago",
        "performance": "Excellent"
    },
    "3": {
        "id": "3",
        "user_id": None,
        "name": "Ananya Reddy",
        "college": "NIT Warangal",
        "location": "Warangal, Telangana",
        "status": "Active",
        "events_organized": 9,
        "students_reached": 180,
        "last_activity": "1 day ago",
        "performance": "Good"
    },
    "4": {
        "id": "4",
        "user_id": None,
        "name": "Karthik Menon",
        "college": "VIT Chennai",
        "location": "Chennai, Tamil Nadu",
        "status": "Active",
        "events_organized": 15,
        "students_reached": 290,
        "last_activity": "3 hours ago",
        "performance": "Excellent"
    },
    "5": {
        "id": "5",
        "user_id": None,
        "name": "Sneha Patel",
        "college": "BITS Pilani",
        "location": "Pilani, Rajasthan",
        "status": "Inactive",
        "events_organized": 6,
        "students_reached": 125,
        "last_activity": "1 week ago",
        "performance": "Average"
    }
}

@router.get("", response_model=List[CampusLead])
async def get_campus_leads(current_user: dict = Depends(get_current_user)):
    return list(campus_leads_db.values())

@router.get("/{lead_id}", response_model=CampusLead)
async def get_campus_lead(lead_id: str, current_user: dict = Depends(get_current_user)):
    if lead_id not in campus_leads_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus lead not found"
        )
    return campus_leads_db[lead_id]

@router.post("", response_model=CampusLead, status_code=status.HTTP_201_CREATED)
async def create_campus_lead(lead: CampusLeadCreate, current_user: dict = Depends(get_current_user)):
    # Only team members can create campus leads
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can create campus leads"
        )
    
    lead_id = str(uuid.uuid4())
    lead_data = {
        "id": lead_id,
        **lead.model_dump()
    }
    
    campus_leads_db[lead_id] = lead_data
    return lead_data

@router.put("/{lead_id}", response_model=CampusLead)
async def update_campus_lead(lead_id: str, lead: CampusLeadCreate, current_user: dict = Depends(get_current_user)):
    if lead_id not in campus_leads_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus lead not found"
        )
    
    lead_data = campus_leads_db[lead_id]
    lead_data.update(lead.model_dump())
    return lead_data

@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campus_lead(lead_id: str, current_user: dict = Depends(get_current_user)):
    if lead_id not in campus_leads_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus lead not found"
        )
    
    # Only team members can delete campus leads
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can delete campus leads"
        )
    
    del campus_leads_db[lead_id]