# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from .models import BloodType, DonorStatus

class DonorBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    blood_type: BloodType
    location: str

class DonorCreate(DonorBase):
    hospital_id: int

class Donor(DonorBase):
    id: int
    hospital_id: int
    status: DonorStatus
    reliability_score: float
    last_donation_date: Optional[datetime] = None
    fatigue_level: float
    class Config:
        from_attributes = True

class HospitalBase(BaseModel):
    name: str
    email: EmailStr
    location: str

class Hospital(HospitalBase):
    id: int
    class Config:
        from_attributes = True

class MatchRequest(BaseModel):
    blood_type_needed: BloodType

class MatchExplanation(BaseModel):
    feature: str
    value: float
    impact: float

class RankedDonor(BaseModel):
    donor: Donor
    probability_score: float
    rank: int
    explanation_human: str
    explanation_shap: Optional[List[MatchExplanation]] = None

class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    email: Optional[str] = None