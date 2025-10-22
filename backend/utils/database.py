from supabase import create_client, Client
from .config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.client: Client = None
        
    def connect(self):
        try:
            self.client = create_client(settings.supabase_url, settings.supabase_key)
            logger.info("Successfully connected to Supabase")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {e}")
            # Create a mock client for development
            logger.warning("Using mock database for development")
            self.client = None
    
    def get_client(self) -> Client:
        if self.client is None:
            self.connect()
        return self.client

db = Database()

def get_db():
    return db.get_client()