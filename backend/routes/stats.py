from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Stat, StatsUpdate, StatBase
from utils.auth import get_current_user
from utils.database import get_db
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

# Fallback in-memory storage for development when Supabase is not available
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
    try:
        db = get_db()
        if db is not None:
            # Fetch from Supabase
            response = db.table('stats').select('*').eq('category', category).execute()
            if response.data:
                return response.data
            else:
                logger.info(f"No stats found for category: {category} in database")
                return []
        else:
            # Fallback to in-memory
            logger.warning("Using in-memory storage for stats")
            if category not in stats_db:
                return []
            return stats_db[category]
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        # Fallback to in-memory on error
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
    
    try:
        db = get_db()
        
        # Convert StatBase items to full Stat items with IDs
        new_stats = []
        for idx, stat_base in enumerate(stats_update.stats):
            stat_dict = stat_base.model_dump()
            # Generate unique ID if not present
            stat_dict["id"] = str(uuid.uuid4())
            stat_dict["category"] = category
            new_stats.append(stat_dict)
        
        if db is not None:
            # Delete old stats for this category
            db.table('stats').delete().eq('category', category).execute()
            
            # Insert new stats
            if new_stats:
                response = db.table('stats').insert(new_stats).execute()
                return response.data
            return []
        else:
            # Fallback to in-memory
            logger.warning("Using in-memory storage for stats update")
            stats_db[category] = new_stats
            return new_stats
            
    except Exception as e:
        logger.error(f"Error updating stats: {e}")
        # Fallback to in-memory on error
        stats_db[category] = new_stats
        return new_stats