# backend/app/models.py
import os
import enum
from sqlalchemy import (create_engine, Column, Integer, String, Float,
                      DateTime, Boolean, ForeignKey, Enum as SQLAlchemyEnum)
from sqlalchemy.orm import relationship, sessionmaker, DeclarativeBase
from sqlalchemy.sql import func
from sqlalchemy.engine import create_engine

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL: raise ValueError("DATABASE_URL environment variable is not set")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class BloodType(str, enum.Enum):
    AP = "A+"; AN = "A-"; BP = "B+"; BN = "B-"; ABP = "AB+"; ABN = "AB-"; OP = "O+"; ON = "O-"

class DonorStatus(str, enum.Enum):
    PENDING_APPROVAL = "pending_approval"
    ACTIVE = "active"
    INACTIVE = "inactive"

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    location = Column(String)
    donors = relationship("Donor", back_populates="hospital")

class Donor(Base):
    __tablename__ = "donors"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    blood_type = Column(SQLAlchemyEnum(BloodType))
    location = Column(String)
    last_donation_date = Column(DateTime, nullable=True)
    reliability_score = Column(Float, default=0.75)
    fatigue_level = Column(Float, default=0.0)
    status = Column(SQLAlchemyEnum(DonorStatus), default=DonorStatus.PENDING_APPROVAL, nullable=False)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    hospital = relationship("Hospital", back_populates="donors")

def create_db_tables():
     print("Ensuring database tables exist...")
     Base.metadata.create_all(bind=engine)
     print("Table check complete.")