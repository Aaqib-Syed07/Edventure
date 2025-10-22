from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Stat, StatsUpdate, StatBase
from utils.auth import get_current_user
import uuid

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

# In-memory storage for development
stats_db = {
    "cohort": [
        {"id": "c1", "category": "cohort", "label": "Total Participants", "value": "105", "icon": "Users", "color": "text-cyan-600"},
        {"id": "c2", "category": "cohort", "label": "Active Cohorts", "value": "3", "icon": "TrendingUp", "color": "text-lime-600"},
        {"id": "c3", "category": "cohort", "label": "Completion Rate", "value": "78%", "icon": "Target", "color": "text-purple-600"},
        {"id": "c4", "category": "cohort", "label": "Success Stories", "value": "24", "icon": "Award", "color": "text-orange-600"},
    ],
    "campus_lead": [
        {"id": "l1", "category": "campus_lead", "label": "Telangana", "value": "15 leads", "icon": "MapPin", "color": "text-cyan-600"},
        {"id": "l2", "category": "campus_lead", "label": "Maharashtra", "value": "12 leads", "icon": "MapPin", "color": "text-lime-600"},
        {"id": "l3", "category": "campus_lead", "label": "Tamil Nadu", "value": "10 leads", "icon": "MapPin", "color": "text-purple-600"},
        {"id": "l4", "category": "campus_lead", "label": "Karnataka", "value": "8 leads", "icon": "MapPin", "color": "text-orange-600"},
    ]
}

@router.get("/{category}", response_model=List[Stat])
async def get_stats(category: str, current_user: dict = Depends(get_current_user)):
    if category not in stats_db:
        return []
    return stats_db[category]

@router.put("/{category}", response_model=List[Stat])
async def update_stats(category: str, stats_update: StatsUpdate, current_user: dict = Depends(get_current_user)):
    # Only team members can update stats
    if current_user.get("role") != "team":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team members can update statistics"
        )
    
    # Convert StatBase items to full Stat items with IDs
    new_stats = []
    for idx, stat_base in enumerate(stats_update.stats):
        stat_dict = stat_base.model_dump()
        stat_dict["id"] = f"{category[0]}{idx+1}"
        stat_dict["category"] = category
        new_stats.append(stat_dict)
    
    stats_db[category] = new_stats
    return new_stats