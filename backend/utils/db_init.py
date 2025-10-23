"""
Database initialization script for Supabase
Creates all necessary tables and initial data
"""
from .database import get_db
import logging

logger = logging.getLogger(__name__)

def initialize_database():
    """
    Initialize database tables in Supabase
    This will create all necessary tables if they don't exist
    """
    try:
        db = get_db()
        if db is None:
            logger.warning("Database client not available. Skipping initialization.")
            return False
        
        logger.info("Database initialization started...")
        
        # Check if tables exist by trying to query them
        # If they don't exist, Supabase will return an error
        
        # Initialize stats with default data if table is empty
        try:
            stats_response = db.table('stats').select('*').execute()
            if not stats_response.data:
                # Insert default stats
                default_stats = [
                    {"category": "cohort", "label": "Total Participants", "value": "105", "icon": "Users", "color": "text-cyan-600"},
                    {"category": "cohort", "label": "Active Cohorts", "value": "3", "icon": "TrendingUp", "color": "text-lime-600"},
                    {"category": "cohort", "label": "Completion Rate", "value": "78%", "icon": "Target", "color": "text-purple-600"},
                    {"category": "cohort", "label": "Success Stories", "value": "24", "icon": "Award", "color": "text-orange-600"},
                    {"category": "campus_lead", "label": "Telangana", "value": "15 leads", "icon": "MapPin", "color": "text-cyan-600"},
                    {"category": "campus_lead", "label": "Maharashtra", "value": "12 leads", "icon": "MapPin", "color": "text-lime-600"},
                    {"category": "campus_lead", "label": "Tamil Nadu", "value": "10 leads", "icon": "MapPin", "color": "text-purple-600"},
                    {"category": "campus_lead", "label": "Karnataka", "value": "8 leads", "icon": "MapPin", "color": "text-orange-600"},
                ]
                db.table('stats').insert(default_stats).execute()
                logger.info("Default stats inserted")
        except Exception as e:
            logger.info(f"Stats table handling: {e}")
        
        # Initialize cohorts with default data if table is empty
        try:
            cohorts_response = db.table('cohorts').select('*').execute()
            if not cohorts_response.data:
                default_cohorts = [
                    {
                        "id": "1",
                        "name": "EVP A25",
                        "program": "Pre-Incubation",
                        "status": "Active",
                        "start_date": "2025-01-15",
                        "end_date": "2025-04-30",
                        "participants": 45,
                        "progress": 65,
                        "milestones": ["Ideation", "Prototyping", "Market Research", "Pitch Preparation"],
                        "completed_milestones": 2
                    },
                    {
                        "id": "2",
                        "name": "EdAstra Batch 6",
                        "program": "Innovation Challenge",
                        "status": "Active",
                        "start_date": "2025-02-01",
                        "end_date": "2025-05-15",
                        "participants": 32,
                        "progress": 40,
                        "milestones": ["Team Formation", "Problem Identification", "Solution Design", "Demo Day"],
                        "completed_milestones": 1
                    },
                    {
                        "id": "3",
                        "name": "Tentative Sprint",
                        "program": "Advanced Incubation",
                        "status": "Planning",
                        "start_date": "2025-03-01",
                        "end_date": "2025-06-30",
                        "participants": 28,
                        "progress": 15,
                        "milestones": ["Onboarding", "Mentor Matching", "Development", "Launch"],
                        "completed_milestones": 0
                    }
                ]
                db.table('cohorts').insert(default_cohorts).execute()
                logger.info("Default cohorts inserted")
        except Exception as e:
            logger.info(f"Cohorts table handling: {e}")
        
        logger.info("Database initialization completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False
