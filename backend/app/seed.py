# backend/app/seed.py
import random
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
from models import SessionLocal, Hospital, Donor, BloodType, DonorStatus, Base, engine, create_db_tables
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from routers.auth import get_password_hash

NUM_OTHER_HOSPITALS = 4
DONORS_PER_HOSPITAL = 200
TOTAL_DONORS = (1 + NUM_OTHER_HOSPITALS) * DONORS_PER_HOSPITAL

BLOOD_TYPE_DISTRIBUTION = [ (BloodType.OP, 0.345), (BloodType.BP, 0.32), (BloodType.AP, 0.22), (BloodType.ABP, 0.07), (BloodType.ON, 0.02), (BloodType.AN, 0.01), (BloodType.BN, 0.01), (BloodType.ABN, 0.005), ]
BLOOD_TYPES = [val[0].value for val in BLOOD_TYPE_DISTRIBUTION]
BLOOD_PROBS = [val[1] for val in BLOOD_TYPE_DISTRIBUTION]

STATUS_DISTRIBUTION = [ (DonorStatus.ACTIVE, 0.80), (DonorStatus.PENDING_APPROVAL, 0.15), (DonorStatus.INACTIVE, 0.05), ]
STATUS_TYPES = [val[0].value for val in STATUS_DISTRIBUTION]
STATUS_PROBS = [val[1] for val in STATUS_DISTRIBUTION]

LOCATIONS = [ "Mangalore, Karnataka", "Udupi, Karnataka", "Bangalore, Karnataka", "Mysore, Karnataka", "Mumbai, Maharashtra", "Pune, Maharashtra", "Delhi, Delhi", "Chennai, Tamil Nadu", "Hyderabad, Telangana", "Kolkata, West Bengal", "Ahmedabad, Gujarat", "Jaipur, Rajasthan", "Kochi, Kerala", "Thiruvananthapuram, Kerala", "Goa", "Surat, Gujarat", ]

def seed_database():
    print(f"Starting database seed...")
    fake = Faker('en_IN')
    create_db_tables()
    db = SessionLocal()
    hospitals = []; created_count = 0
    yenepoya_email = "admin_yenepoya@hospital.com"
    yenepoya = db.query(Hospital).filter(Hospital.email == yenepoya_email).first()
    if not yenepoya:
        yenepoya = Hospital( name="Yenepoya Hospital", email=yenepoya_email, hashed_password=get_password_hash("yenepoya123"), location="Mangalore, Karnataka" )
        db.add(yenepoya); created_count += 1; print(f"Created hospital: {yenepoya.name}")
    hospitals.append(yenepoya)
    for i in range(NUM_OTHER_HOSPITALS):
        email = f"admin{i+1}@hospital.com"
        hospital = db.query(Hospital).filter(Hospital.email == email).first()
        if not hospital:
            city_state = random.choice(LOCATIONS); hospital_name = f"{city_state.split(',')[0]} City Hospital {i+1}"
            hospital = Hospital( name=hospital_name, email=email, hashed_password=get_password_hash("admin123"), location=city_state )
            db.add(hospital); created_count += 1; print(f"Created hospital: {hospital.name}")
        hospitals.append(hospital)
    if created_count > 0: db.commit()
    for h in hospitals: db.refresh(h)
    print(f"Total hospitals in DB: {len(hospitals)}. Login for Yenepoya: {yenepoya_email} / yenepoya123")
    print(f"Generating {TOTAL_DONORS} donors...")
    existing_emails = {d[0] for d in db.query(Donor.email).all()}
    existing_phones = {d[0] for d in db.query(Donor.phone).all()}
    donors_to_add = []; added_count = 0
    while added_count < TOTAL_DONORS:
        first_name = fake.first_name(); last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(100,999)}@test.com"
        phone = fake.phone_number()
        if email in existing_emails or phone in existing_phones: continue
        hospital = random.choice(hospitals)
        blood_type_str = np.random.choice(BLOOD_TYPES, p=BLOOD_PROBS)
        status_str = np.random.choice(STATUS_TYPES, p=STATUS_PROBS)
        location = random.choice(LOCATIONS); last_donation = None
        if random.random() < 0.75: days_ago = random.randint(30, 700); last_donation = datetime.now() - timedelta(days=days_ago)
        reliability = random.uniform(0.5, 1.0); fatigue = random.uniform(0.0, 0.8)
        donors_to_add.append( Donor( full_name=f"{first_name} {last_name}", email=email, phone=phone, blood_type=blood_type_str, location=location, last_donation_date=last_donation, reliability_score=reliability, fatigue_level=fatigue, status=status_str, hospital_id=hospital.id ) )
        existing_emails.add(email); existing_phones.add(phone); added_count += 1
        if added_count % 100 == 0: print(f"Generated {added_count}/{TOTAL_DONORS} donors...")
    if donors_to_add:
        db.bulk_save_objects(donors_to_add); db.commit()
        print(f"Successfully added {len(donors_to_add)} new donors.")
    else: print("No new donors to add.")
    print("Database seeding complete. ✅")
    db.close()

if __name__ == "__main__":
    seed_database()