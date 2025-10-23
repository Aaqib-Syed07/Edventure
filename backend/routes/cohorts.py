from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Cohort, CohortCreate
from utils.auth import get_current_user
from utils.database import get_db
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/cohorts", tags=["Cohorts"])

# Fallback in-memory storage for development when Supabase is not available
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
    try:
        db = get_db()
        if db is not None:
            # Fetch from Supabase
            response = db.table('cohorts').select('*').execute()
            if response.data:
                return response.data
            else:
                logger.info("No cohorts found in database")
                return []
        else:
            # Fallback to in-memory
            logger.warning("Using in-memory storage for cohorts")
            return list(cohorts_db.values())
    except Exception as e:
        logger.error(f"Error fetching cohorts: {e}")
        # Fallback to in-memory on error
        return list(cohorts_db.values())

@router.get("/{cohort_id}", response_model=Cohort)
async def get_cohort(cohort_id: str, current_user: dict = Depends(get_current_user)):
    try:
        db = get_db()
        if db is not None:
            # Fetch from Supabase
            response = db.table('cohorts').select('*').eq('id', cohort_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
        else:
            # Fallback to in-memory
            if cohort_id not in cohorts_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
            return cohorts_db[cohort_id]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching cohort: {e}")
        # Fallback to in-memory on error
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
    
    try:
        db = get_db()
        if db is not None:
            # Insert into Supabase
            response = db.table('cohorts').insert(cohort_data).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return cohort_data
        else:
            # Fallback to in-memory
            logger.warning("Using in-memory storage for cohort creation")
            cohorts_db[cohort_id] = cohort_data
            return cohort_data
    except Exception as e:
        logger.error(f"Error creating cohort: {e}")
        # Fallback to in-memory on error
        cohorts_db[cohort_id] = cohort_data
        return cohort_data

@router.put("/{cohort_id}", response_model=Cohort)
async def update_cohort(cohort_id: str, cohort: CohortCreate, current_user: dict = Depends(get_current_user)):
    # Only team members can update cohorts
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can update cohorts"
        )
    
    try:
        db = get_db()
        if db is not None:
            # Check if exists in Supabase
            check_response = db.table('cohorts').select('*').eq('id', cohort_id).execute()
            if not check_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
            
            # Update in Supabase
            update_data = cohort.model_dump()
            response = db.table('cohorts').update(update_data).eq('id', cohort_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return {**update_data, "id": cohort_id}
        else:
            # Fallback to in-memory
            if cohort_id not in cohorts_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
            cohort_data = cohorts_db[cohort_id]
            cohort_data.update(cohort.model_dump())
            return cohort_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cohort: {e}")
        # Fallback to in-memory on error
        if cohort_id not in cohorts_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cohort not found"
            )
        cohort_data = cohorts_db[cohort_id]
        cohort_data.update(cohort.model_dump())
        return cohort_data

@router.delete("/{cohort_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cohort(cohort_id: str, current_user: dict = Depends(get_current_user)):
    # Only team members can delete cohorts
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can delete cohorts"
        )
    
    try:
        db = get_db()
        if db is not None:
            # Check if exists in Supabase
            check_response = db.table('cohorts').select('*').eq('id', cohort_id).execute()
            if not check_response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
            
            # Delete from Supabase
            db.table('cohorts').delete().eq('id', cohort_id).execute()
        else:
            # Fallback to in-memory
            if cohort_id not in cohorts_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found"
                )
            del cohorts_db[cohort_id]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting cohort: {e}")
        # Fallback to in-memory on error
        if cohort_id not in cohorts_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cohort not found"
            )
        del cohorts_db[cohort_id]