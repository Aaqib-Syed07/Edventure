from fastapi import APIRouter, HTTPException, status, Depends
from models.schemas import UserProfile
from utils.auth import get_current_user
from routes.auth import users_db

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=UserProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_data = users_db[user_id]
    return UserProfile(**{k: v for k, v in user_data.items() if k != "password_hash"})

@router.put("", response_model=UserProfile)
async def update_profile(profile: UserProfile, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_data = users_db[user_id]
    # Update user data with new profile info (excluding password_hash)
    profile_dict = profile.model_dump()
    for key, value in profile_dict.items():
        if key in user_data and key != "password_hash":
            user_data[key] = value
    
    return UserProfile(**{k: v for k, v in user_data.items() if k != "password_hash"})