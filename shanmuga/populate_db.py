from app import db, User, Doctor, Medicine, Medschedule, Consultation

# Clear existing data
db.session.query(Medschedule).delete()
db.session.query(Medicine).delete()
db.session.query(Consultation).delete()
db.session.query(Doctor).delete()
db.session.query(User).delete()
db.session.commit()

# Add sample users
user1 = User(name="John Doe", age=30, phone="1234567890", bg="A+")
user2 = User(name="Jane Smith", age=25, phone="9876543210", bg="B+")
db.session.add_all([user1, user2])
db.session.commit()

# Add sample doctors
doctor1 = Doctor(
    name="Dr. Alice Johnson",
    age=45,
    gender="Female",
    phone="1112223333",
    specialization="Cardiologist",
    experience=20,
    license="LIC12345",
    hospital="City Hospital"
)
doctor2 = Doctor(
    name="Dr. Bob Williams",
    age=50,
    gender="Male",
    phone="4445556666",
    specialization="Dermatologist",
    experience=25,
    license="LIC67890",
    hospital="General Hospital"
)
db.session.add_all([doctor1, doctor2])
db.session.commit()

# Add sample consultations
consultation1 = Consultation(
    user_id=user1.id,
    doctor_id=doctor1.id,
    date="2023-10-01",
    time="10:00 AM",
    diagnosis="Hypertension"
)
consultation2 = Consultation(
    user_id=user2.id,
    doctor_id=doctor2.id,
    date="2023-10-02",
    time="11:00 AM",
    diagnosis="Skin Allergy"
)
db.session.add_all([consultation1, consultation2])
db.session.commit()

# Add sample medicines
medicine1 = Medicine(
    user_id=user1.id,
    doctor_id=doctor1.id,
    name="Aspirin",
    dosage="100mg",
    consultation_id=consultation1.id
)
medicine2 = Medicine(
    user_id=user2.id,
    doctor_id=doctor2.id,
    name="Cetirizine",
    dosage="10mg",
    consultation_id=consultation2.id
)
db.session.add_all([medicine1, medicine2])
db.session.commit()

# Add sample medicine schedules
schedule1 = Medschedule(
    medicine_id=medicine1.id,
    day="Mon",
    time="Morning",
    beforeMeal=True,
    afterMeal=False,
    taken=False
)
schedule2 = Medschedule(
    medicine_id=medicine2.id,
    day="Tue",
    time="Evening",
    beforeMeal=False,
    afterMeal=True,
    taken=False
)
db.session.add_all([schedule1, schedule2])
db.session.commit()

print("Database populated successfully!")