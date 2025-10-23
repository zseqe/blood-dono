import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];
const DONATION_FREQUENCIES = ['First-time', 'Occasional', 'Regular'];
const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Rohan', 'Ananya', 'Diya', 'Isha', 'Kavya',
  'Meera', 'Pooja', 'Priya', 'Rahul', 'Amit', 'Neha', 'Ravi', 'Sunita', 'Vikram', 'Zara',
  'Karan', 'Nisha', 'Raj', 'Simran', 'Akash', 'Shreya', 'Dev', 'Maya', 'Aryan', 'Tara'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Iyer', 'Gupta', 'Verma', 'Nair', 'Mehta',
  'Rao', 'Desai', 'Joshi', 'Shah', 'Agarwal', 'Chopra', 'Malhotra', 'Kapoor', 'Bose', 'Das'
];

const MEDICAL_CONDITIONS = [
  'None',
  'Hypertension (Controlled)',
  'Diabetes (Type 2)',
  'Asthma',
  'Thyroid Disorder',
  'Anemia (Mild)',
];

const MEDICATIONS = [
  'None',
  'Multivitamin',
  'Blood Pressure Medication',
  'Insulin',
  'Inhaler',
  'Thyroid Medication',
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateEmail(firstName: string, lastName: string, index: number): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@gmail.com`;
}

function generatePhone(index: number): string {
  const prefix = [91, 98, 97, 96, 95, 94, 93, 92, 91, 90];
  return `+91${randomElement(prefix)}${String(index).padStart(7, '0')}`;
}

async function seedDatabase() {
  console.log('🌱 Starting LIFELINK database seeding...\n');

  const hospitals = [
    {
      name: 'Apollo Hospitals',
      email: 'admin@apollo.in',
      password: 'apollo123',
      phone: '+912240404040',
      address: '154, Bannerghatta Road, Opposite IIM',
      city: 'Bangalore',
      state: 'Karnataka',
      latitude: 12.9352,
      longitude: 77.6245,
    },
    {
      name: 'Fortis Healthcare',
      email: 'admin@fortis.in',
      password: 'fortis123',
      phone: '+911166214444',
      address: 'Sector 62, Phase VIII',
      city: 'Delhi',
      state: 'Delhi',
      latitude: 28.6271,
      longitude: 77.3716,
    },
    {
      name: 'Lilavati Hospital',
      email: 'admin@lilavati.in',
      password: 'lilavati123',
      phone: '+912226567000',
      address: 'A-791, Bandra Reclamation',
      city: 'Mumbai',
      state: 'Maharashtra',
      latitude: 19.0596,
      longitude: 72.8295,
    },
    {
      name: 'KIMS Hospitals',
      email: 'admin@kims.in',
      password: 'kims123',
      phone: '+914044885000',
      address: '1-8-31/1, Minister Road',
      city: 'Hyderabad',
      state: 'Telangana',
      latitude: 17.4326,
      longitude: 78.4071,
    },
  ];

  console.log('🏥 Seeding hospitals...');
  const insertedHospitals = [];

  for (const hospital of hospitals) {
    const passwordHash = await bcrypt.hash(hospital.password, 10);

    const { data, error } = await supabase
      .from('hospitals')
      .insert([{
        name: hospital.name,
        email: hospital.email,
        password_hash: passwordHash,
        phone: hospital.phone,
        address: hospital.address,
        city: hospital.city,
        state: hospital.state,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
      }])
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ${hospital.name}:`, error);
    } else {
      insertedHospitals.push(data);
      console.log(`✅ ${hospital.name} (${hospital.email})`);
    }
  }

  console.log(`\n✅ Seeded ${insertedHospitals.length} hospitals\n`);

  console.log('👥 Seeding 200+ donors...');
  const donors = [];

  for (let i = 0; i < 220; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const location = randomElement(INDIAN_CITIES);
    const bloodType = randomElement(BLOOD_TYPES);
    const gender = randomElement(GENDERS);
    const affiliatedHospital = insertedHospitals.find(h => h.city === location.city) || randomElement(insertedHospitals);

    const lastDonationDate = Math.random() > 0.3
      ? randomDate(new Date('2022-01-01'), new Date('2025-03-01'))
      : null;

    const donationCount = lastDonationDate ? randomInt(1, 15) : 0;
    const donationFrequency = donationCount === 0 ? 'First-time' :
                              donationCount < 5 ? 'Occasional' : 'Regular';

    const medicalCondition = randomElement(MEDICAL_CONDITIONS);
    const medicalConditions = medicalCondition === 'None' ? [] : [medicalCondition];

    const responseRate = parseFloat((0.5 + Math.random() * 0.5).toFixed(2));
    const reliabilityScore = parseFloat((0.6 + Math.random() * 0.4).toFixed(2));

    const status = i < 30 ? 'pending_approval' :
                   Math.random() > 0.1 ? 'active' : 'inactive';

    donors.push({
      full_name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName, i + 1),
      phone: generatePhone(10000 + i),
      blood_type: bloodType,
      date_of_birth: randomDate(new Date('1970-01-01'), new Date('2003-12-31')),
      gender: gender,
      weight: parseFloat((50 + Math.random() * 50).toFixed(1)),
      city: location.city,
      state: location.state,
      location_address: `${randomInt(1, 999)}, ${randomElement(['MG Road', 'Park Street', 'Brigade Road', 'Main Street', 'Mall Road'])}`,
      latitude: location.lat + (Math.random() - 0.5) * 0.1,
      longitude: location.lng + (Math.random() - 0.5) * 0.1,
      last_donation_date: lastDonationDate,
      donation_count: donationCount,
      donation_frequency: donationFrequency,
      medical_conditions: medicalConditions,
      medications: randomElement(MEDICATIONS),
      response_rate: responseRate,
      reliability_score: reliabilityScore,
      is_available: status === 'active' && Math.random() > 0.2,
      status: status,
      hospital_id: affiliatedHospital.id,
      consent_data_sharing: true,
    });
  }

  const BATCH_SIZE = 50;
  for (let i = 0; i < donors.length; i += BATCH_SIZE) {
    const batch = donors.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('donors').insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
    } else {
      console.log(`✅ Inserted donors ${i + 1}-${Math.min(i + BATCH_SIZE, donors.length)}`);
    }
  }

  console.log(`\n✅ Seeded ${donors.length} donors\n`);

  console.log('📊 Database Summary:');
  console.log('==================');
  console.log(`Hospitals: ${insertedHospitals.length}`);
  console.log(`Donors: ${donors.length}`);
  console.log('\n🔐 Hospital Login Credentials:');
  hospitals.forEach(h => {
    console.log(`  ${h.name}: ${h.email} / ${h.password}`);
  });
  console.log('\n✨ LIFELINK database seeding complete!\n');
}

seedDatabase().catch(console.error);
