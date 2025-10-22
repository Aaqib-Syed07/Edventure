from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Cohort, CohortCreate
from utils.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/cohorts", tags=["Cohorts"])

# In-memory storage for development
cohorts_db = {
    "1": {
        "id": "1",
        "name": "EVP A25",
        "program": "Pre-Incubation",
        "status": "Active",
        "start_date": "2025-01-15",
        "end_date": "2025-04-30",
        "participants": 45,
        "progress": 65,
        "milestones": ["Ideation", "Prototyping", "Market Research", "Pitch Preparation"],
        "completed_milestones": 2,
        "created_at": datetime.now().isoformat()
    },
    "2": {
        "id": "2",
        "name": "EdAstra Batch 6",
        "program": "Innovation Challenge",
        "status": "Active",
        "start_date": "2025-02-01",
        "end_date": "2025-05-15",
        "participants": 32,
        "progress": 40,
        "milestones": ["Team Formation", "Problem Identification", "Solution Design", "Demo Day"],
        "completed_milestones": 1,
        "created_at": datetime.now().isoformat()
    },
    "3": {
        "id": "3",
        "name": "Tentative Sprint",
        "program": "Advanced Incubation",
        "status": "Planning",
        "start_date": "2025-03-01",
        "end_date": "2025-06-30",
        "participants": 28,
        "progress": 15,
        "milestones": ["Onboarding", "Mentor Matching", "Development", "Launch"],
        "completed_milestones": 0,
        "created_at": datetime.now().isoformat()
    }
}

@router.get("", response_model=List[Cohort])
async def get_cohorts(current_user: dict = Depends(get_current_user)):
    return list(cohorts_db.values())

@router.get("/{cohort_id}", response_model=Cohort)
async def get_cohort(cohort_id: str, current_user: dict = Depends(get_current_user)):
    if cohort_id not in cohorts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort not found"
        )
    return cohorts_db[cohort_id]

@router.post("", response_model=Cohort, status_code=status.HTTP_201_CREATED)
async def create_cohort(cohort: CohortCreate, current_user: dict = Depends(get_current_user)):
    # Only team members can create cohorts
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can create cohorts"
        )
    
    cohort_id = str(uuid.uuid4())
    cohort_data = {
        "id": cohort_id,
        **cohort.model_dump(),
        "created_at": datetime.now().isoformat()
    }
    
    cohorts_db[cohort_id] = cohort_data
    return cohort_data

@router.put("/{cohort_id}", response_model=Cohort)
async def update_cohort(cohort_id: str, cohort: CohortCreate, current_user: dict = Depends(get_current_user)):
    if cohort_id not in cohorts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort not found"
        )
    
    # Only team members can update cohorts
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can update cohorts"
        )
    
    cohort_data = cohorts_db[cohort_id]
    cohort_data.update(cohort.model_dump())
    return cohort_data

@router.delete("/{cohort_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cohort(cohort_id: str, current_user: dict = Depends(get_current_user)):
    if cohort_id not in cohorts_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort not found"
        )
    
    # Only team members can delete cohorts
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can delete cohorts"
        )
    
    del cohorts_db[cohort_id]