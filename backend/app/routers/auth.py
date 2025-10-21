# backend/app/routers/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .. import models, schemas

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
if not SECRET_KEY: raise ValueError("SECRET_KEY environment variable is not set")

router = APIRouter(tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = models.SessionLocal(); try: yield db; finally: db.close()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
def create_access_token(data: dict) -> str:
    to_encode = data.copy(); expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire}); return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_hospital(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.Hospital:
    credentials_exception = HTTPException( status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"}, )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]); email: Optional[str] = payload.get("sub")
        if email is None: raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError: raise credentials_exception
    hospital = db.query(models.Hospital).filter(models.Hospital.email == token_data.email).first()
    if hospital is None: raise credentials_exception
    return hospital

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    hospital = db.query(models.Hospital).filter(models.Hospital.email == form_data.username).first()
    if not hospital or not verify_password(form_data.password, hospital.hashed_password):
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"}, )
    access_token = create_access_token(data={"sub": hospital.email})
    return {"access_token": access_token, "token_type": "bearer"}