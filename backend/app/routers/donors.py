# backend/app/routers/donors.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from .. import models, schemas, ranking
from .auth import get_db, get_current_hospital

router = APIRouter(tags=["Donors & Matching"])

@router.post("/donors/register", response_model=schemas.Donor, status_code=status.HTTP_201_CREATED)
def donor_self_registration(donor: schemas.DonorCreate, db: Session = Depends(get_db)):
    existing_donor = db.query(models.Donor).filter( or_(models.Donor.email == donor.email, models.Donor.phone == donor.phone) ).first()
    if existing_donor: raise HTTPException( status_code=status.HTTP_409_CONFLICT, detail="Email or phone already exists." )
    hospital = db.query(models.Hospital).filter(models.Hospital.id == donor.hospital_id).first()
    if not hospital: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected hospital does not exist.")
    db_donor = models.Donor(**donor.model_dump())
    db.add(db_donor); db.commit(); db.refresh(db_donor)
    return db_donor

@router.get("/dashboard/donors", response_model=List[schemas.Donor])
def get_hospital_donors( current_hospital: models.Hospital = Depends(get_current_hospital), db: Session = Depends(get_db) ):
    return db.query(models.Donor).filter(models.Donor.hospital_id == current_hospital.id).order_by(models.Donor.full_name).all()

@router.patch("/dashboard/donors/{donor_id}/approve", response_model=schemas.Donor)
def approve_donor( donor_id: int, current_hospital: models.Hospital = Depends(get_current_hospital), db: Session = Depends(get_db) ):
    db_donor = db.query(models.Donor).filter(models.Donor.id == donor_id).first()
    if not db_donor: raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")
    if db_donor.hospital_id != current_hospital.id: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    if db_donor.status == models.DonorStatus.PENDING_APPROVAL:
        db_donor.status = models.DonorStatus.ACTIVE; db.commit(); db.refresh(db_donor)
    return db_donor

@router.patch("/dashboard/donors/{donor_id}/decline", response_model=schemas.Donor)
def decline_donor( donor_id: int, current_hospital: models.Hospital = Depends(get_current_hospital), db: Session = Depends(get_db) ):
    db_donor = db.query(models.Donor).filter(models.Donor.id == donor_id).first()
    if not db_donor: raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")
    if db_donor.hospital_id != current_hospital.id: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    if db_donor.status != models.DonorStatus.INACTIVE:
        db_donor.status = models.DonorStatus.INACTIVE; db.commit(); db.refresh(db_donor)
    return db_donor

@router.post("/dashboard/find-matches", response_model=List[schemas.RankedDonor])
def find_and_rank_donors( request: schemas.MatchRequest, current_hospital: models.Hospital = Depends(get_current_hospital), db: Session = Depends(get_db) ):
    compatible_types = ranking.get_compatible_types(request.blood_type_needed.value)
    potential_donors = db.query(models.Donor).filter( models.Donor.hospital_id == current_hospital.id, models.Donor.blood_type.in_(compatible_types), models.Donor.status == models.DonorStatus.ACTIVE ).all()
    if not potential_donors: return []
    features_df = ranking.calculate_features(potential_donors, current_hospital.location)
    if features_df.empty: return []
    return ranking.rank_donors(features_df)