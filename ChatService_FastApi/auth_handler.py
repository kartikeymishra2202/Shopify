import os
from jose import jwt, JWTError
from fastapi import HTTPException
from pathlib import Path
from dotenv import load_dotenv
# This finds the .env file even if you run the script from a different folder
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

async def verify_django_token(token: str):
    """
    Decodes the JWT token issued by Django SimpleJWT.
    Returns the user data if valid, or None if invalid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        if user_id is None:
            return None
            
        return {"user_id": user_id}
        
    except JWTError as e:
        print(f"JWT Verification Error: {e}")
        return None