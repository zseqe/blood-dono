# backend/app/routers/hospitals.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from .. import models, schemas
from .auth import get_db, get_current_hospital

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

@router.get("/", response_model=List[schemas.Hospital])
def get_all_hospitals(db: Session = Depends(get_db)):
    """Public endpoint to get a list of hospitals for the registration form."""
    return db.query(models.Hospital).order_by(models.Hospital.name).all()

@router.get("/dashboard/stats", response_model=Dict[str, Any])
def get_hospital_stats( current_hospital: models.Hospital = Depends(get_current_hospital), db: Session = Depends(get_db) ):
    """Returns key statistics for the logged-in hospital's dashboard."""
    total_donors = db.query(func.count(models.Donor.id)).filter(models.Donor.hospital_id == current_hospital.id).scalar()
    active_donors = db.query(func.count(models.Donor.id)).filter( models.Donor.hospital_id == current_hospital.id, models.Donor.status == models.DonorStatus.ACTIVE ).scalar()
    pending_donors = db.query(func.count(models.Donor.id)).filter( models.Donor.hospital_id == current_hospital.id, models.Donor.status == models.DonorStatus.PENDING_APPROVAL ).scalar()
    return { "total_donors": total_donors or 0, "active_donors": active_donors or 0, "pending_donors": pending_donors or 0, }