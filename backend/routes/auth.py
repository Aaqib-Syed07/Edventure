from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from models.schemas import UserCreate, UserLogin, Token, User
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from utils.database import get_db
from utils.config import settings
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory storage for development (replace with Supabase)
users_db = {}

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    # Check if user already exists
    if any(u["email"] == user.email for u in users_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    user_data = {
        "id": user_id,
        "email": user.email,
        "password_hash": hashed_password,
        "name": user.name,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "college": user.college,
        "department": user.department,
        "bio": "",
        "skills": [],
        "achievements": [],
        "joined_date": datetime.now().isoformat()
    }
    
    users_db[user_id] = user_data
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user_id, "role": user.role}
    )
    
    user_response = User(**{k: v for k, v in user_data.items() if k != "password_hash"})
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    # Find user by email
    user_data = None
    for user in users_db.values():
        if user["email"] == user_login.email:
            user_data = user
            break
    
    if not user_data or not verify_password(user_login.password, user_data["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data["email"], "user_id": user_data["id"], "role": user_data["role"]}
    )
    
    user_response = User(**{k: v for k, v in user_data.items() if k != "password_hash"})
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_data = users_db[user_id]
    return User(**{k: v for k, v in user_data.items() if k != "password_hash"})