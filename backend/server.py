from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, cohorts, campus_leads, messages, events, profile, stats
from utils.database import db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="EdVenture Park Community API",
    description="API for HackEthon - EdVenture Park Community Management Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database connection
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up EdVenture Park Community API...")
    db.connect()
    logger.info("API is ready!")

# Include routers
app.include_router(auth.router)
app.include_router(cohorts.router)
app.include_router(campus_leads.router)
app.include_router(messages.router)
app.include_router(events.router)
app.include_router(profile.router)
app.include_router(stats.router)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "EdVenture Park Community API is running",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to EdVenture Park Community API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
