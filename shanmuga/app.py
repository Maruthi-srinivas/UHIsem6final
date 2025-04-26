

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import event
# from dotenv import load_dotenv
# import os
# import json
# from urllib.parse import quote_plus
# load_dotenv()

# app=Flask(__name__)
# CORS(app)

# password = quote_plus(os.getenv('DB_PASSWORD'))  # Encode the password
# app.config['SQLALCHEMY_DATABASE_URI'] = (
#     f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{password}@"
#     f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/"
#     f"{os.getenv('DB_NAME')}"
# )
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db=SQLAlchemy(app)

# class User(db.Model):
#     id=db.Column(db.Integer,primary_key=True)
#     name=db.Column(db.String(80),nullable=False,unique=True)
#     age=db.Column(db.Integer,nullable=False)
#     phone=db.Column(db.String(10),nullable=False,unique=True)
#     bg=db.Column(db.String(3),nullable=False)


# class Doctor(db.Model):
#     id=db.Column(db.Integer,primary_key=True)
#     name=db.Column(db.String(80),nullable=False,unique=True)
#     age=db.Column(db.Integer,nullable=False)
#     gender=db.Column(db.String(6),nullable=False)
#     phone=db.Column(db.String(10),nullable=False,unique=True)
#     specialization=db.Column(db.String(50),nullable=False)
#     experience=db.Column(db.Integer,nullable=False)
#     license=db.Column(db.String(20),nullable=False,unique=True)
#     hospital=db.Column(db.String(100),nullable=False)

# class Medschedule(db.Model):
#     id=db.Column(db.Integer,primary_key=True)
#     medicine_id=db.Column(db.Integer,db.ForeignKey('medicine.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
#     day=db.Column(db.String(10),nullable=False)
#     time=db.Column(db.String(10),nullable=False)
#     beforeMeal=db.Column(db.Boolean,nullable=False)
#     afterMeal=db.Column(db.Boolean,nullable=False)
#     taken=db.Column(db.Boolean,nullable=False,default=False)

# class Medicine(db.Model):
#     id=db.Column(db.Integer,primary_key=True)
#     user_id=db.Column(db.Integer,db.ForeignKey('user.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
#     doctor_id=db.Column(db.Integer,db.ForeignKey('doctor.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
#     name=db.Column(db.String(80),nullable=False)
#     dosage=db.Column(db.String(100),nullable=False)
#     consultation_id=db.Column(db.Integer,db.ForeignKey('consultation.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)

# class Consultation(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
#     doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
#     date = db.Column(db.Date, nullable=False)
#     time = db.Column(db.String(10), nullable=False)  # Store time as string like '9:00 AM'
#     diagnosis = db.Column(db.String(200), nullable=True) 
    
# class MedicineLog(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     medicine_id = db.Column(db.Integer, nullable=False)
#     doctor_id = db.Column(db.Integer, nullable=False)  # ADD THIS
#     action = db.Column(db.String(20), nullable=False)  # "created", "updated", "deleted"
#     timestamp = db.Column(db.DateTime, nullable=False, default=db.func.now())
#     previous_data = db.Column(db.Text)  # JSON string of previous values
#     new_data = db.Column(db.Text)       # JSON string of new values

#     def __repr__(self):
#         return f'<MedicineLog {self.action} for Medicine {self.medicine_id} by Doctor {self.doctor_id} at {self.timestamp}>'

# with app.app_context():
#    db.create_all()

# # user routes
# @app.route('/user/add',methods=['POST'])
# def add_user():
#     data=request.get_json()
#     name=data['name']
#     age=data['age']
#     phone=data['ph']
#     bg=data['bg']
#     new_user=User(name=name,age=age,phone=phone,bg=bg)
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({'message':'User added successfully','id':new_user.id,'exists':True}),201

# @app.route('/user/find',methods=['POST'])
# def find_user():
#     data=request.get_json()
#     phone=data['ph']
#     user=User.query.filter_by(phone=phone).first()
#     if user:
#         return jsonify({'message':'User found successfully','exists':True,'id':user.id}),200
#     else:
#         return jsonify({'message':'User not found','exists':False}),404
    
# @app.route('/user/fetch',methods=['POST'])
# def fetch_user():
#     data=request.get_json()
#     phone=data['ph']
#     user=User.query.filter_by(phone=phone).first()
#     if user:
#         return jsonify({'id':user.id,'name':user.name,'phone':user.phone,'bg':user.bg,'age':user.age,'exists':True}),200
#     else:
#         return jsonify({'message':'User not found','exists':False}),404

# @app.route('/user/getById',methods=['POST'])
# def get_user_id():
#     data=request.get_json()
#     id=data['id']
#     user=User.query.filter_by(id=id).first()
#     if user:
#         return jsonify({'id':user.id,'name':user.name,'phone':user.phone,'bg':user.bg,'age':user.age,'exists':True}),200
#     else:
#         return jsonify({'message':'User not found','exists':False}),404


# #doctor routes
# @app.route('/doctor/add',methods=['POST'])
# def add_doctor():
#     data=request.get_json()
#     name=data['name']
#     phone=data['phone']
#     age=data['age']
#     gender=data['gender']
#     specialization=data['specialization']
#     experience=data['experience']
#     license=data['license']
#     hospital=data['hospital']
#     new_doc=Doctor(name=name,phone=phone,age=age,gender=gender,specialization=specialization,experience=experience,license=license,hospital=hospital)
#     db.session.add(new_doc)
#     db.session.commit()
#     return jsonify({'message':'Doctor added successfully','id':new_doc.id,'exists':True}),201

# @app.route('/doctor/getById',methods=['POST'])
# def get_doctor_id():
#     data=request.get_json()
#     id=data['id']
#     doctor=Doctor.query.filter_by(id=id).first()
#     if doctor:
#         return jsonify({'id':doctor.id,'name':doctor.name,'phone':doctor.phone,'age':doctor.age ,'specialization':doctor.specialization,'experience':doctor.experience,'license':doctor.license,'hospital':doctor.hospital,'exists':True}),200 
#     else:
#         return jsonify({'message':"doctor not found",'exists':False}),404
# # New endpoint to fetch doctor details by phone number
# @app.route('/doctor/find', methods=['POST'])
# def find_doctor():
#     data = request.get_json()
#     phone = data.get('ph')
#     if not phone:
#         return jsonify({'message': 'Phone number is required', 'exists': False}), 400
#     doctor = Doctor.query.filter_by(phone=phone).first()
#     if doctor:
#         return jsonify({
#             'message': 'Doctor found successfully',
#             'exists': True,
#             'id': doctor.id
#         }), 200
#     else:
#         return jsonify({'message': 'Doctor not found', 'exists': False}), 404
# @app.route('/doctor/fetch', methods=['POST'])
# def fetch_doctor():
#     data = request.get_json()
#     phone = data.get('phone')
#     if not phone:
#         return jsonify({'message': 'Phone number is required', 'exists': False}), 400

#     doctor = Doctor.query.filter_by(phone=phone).first()
#     if doctor:
#         return jsonify({
#             'id': doctor.id,
#             'name': doctor.name,
#             'age': doctor.age,
#             'phone': doctor.phone,
#             'gender': doctor.gender,
#             'specialization': doctor.specialization,
#             'experience': doctor.experience,
#             'license': doctor.license,
#             'hospital': doctor.hospital,
#             'exists': True
#         }), 200
#     else:
#         return jsonify({'message': 'Doctor not found', 'exists': False}), 404 
# @app.route('/doctor/specialization',methods=['POST'])
# def get_doctor_specialization():
#     data=request.get_json()
#     specialization=data['specialization']
#     doctors=Doctor.query.filter_by(specialization=specialization).all()
#     if doctors:
#         doctor_list=[]
#         for doctor in doctors:
#             doctor_list.append({'id':doctor.id,'name':doctor.name,'phone':doctor.phone ,'specialization':doctor.specialization,'experience':doctor.experience,'hospital':doctor.hospital})
#         return jsonify({'doctor_list':doctor_list,'exists':True}),200 
#     else:
#         return jsonify({'message':'No doctors available','exists':False}),404

# @app.route('/consultation/get_slots', methods=['POST'])
# def get_slots():
#     print("get_slots")
#     data = request.get_json()
#     doctorId = data['doctorId']
#     date = data['date']

#     # Query all consultations for that doctor on that date
#     slots = Consultation.query.filter_by(doctor_id=doctorId, date=date).all()

#     if slots:
#         slot_list = [{"time": slot.time} for slot in slots]
#         print("success")
#         return jsonify({'slots': slot_list, 'exists': True}), 200
#     else:
#         print("no slots found")
#         return jsonify({'slots': [], 'exists': False}), 200


# _old_medicine_values = {}

# @event.listens_for(Medicine, 'before_update')
# def before_update(mapper, connection, target):
#     _old_medicine_values[target.id] = {
#         "name": target.name,
#         "dosage": target.dosage
#     }

# @event.listens_for(Medicine, 'after_update')
# def after_update(mapper, connection, target):
#     old_data = _old_medicine_values.pop(target.id, None)
#     new_data = {
#         "name": target.name,
#         "dosage": target.dosage
#     }
#     log = MedicineLog(
#         medicine_id=target.id,
#         doctor_id=target.doctor_id,
#         action="updated",
#         previous_data=json.dumps(old_data) if old_data else None,
#         new_data=json.dumps(new_data)
#     )
#     db.session.add(log)
#     db.session.commit()

# @event.listens_for(Medicine, 'after_insert')
# def after_insert(mapper, connection, target):
#     new_data = {
#         "name": target.name,
#         "dosage": target.dosage
#     }
#     log = MedicineLog(
#         medicine_id=target.id,
#         doctor_id=target.doctor_id,
#         action="created",
#         previous_data=None,
#         new_data=json.dumps(new_data)
#     )
#     db.session.add(log)
#     db.session.commit()

# @app.route('/medicines/<int:user_id>', methods=['GET'])
# def get_medicines(user_id):
#     medicines = Medicine.query.filter_by(user_id=user_id).all()
#     if medicines:
#         return jsonify([{
#             'id': med.id,
#             'name': med.name,
#             'dosage': med.dosage,
#             'schedule': [{
#                 'day': sched.day,
#                 'time': sched.time,
#                 'beforeMeal': sched.beforeMeal,
#                 'afterMeal': sched.afterMeal,
#                 'taken': sched.taken
#             } for sched in Medschedule.query.filter_by(medicine_id=med.id).all()]
#         } for med in medicines]), 200
#     else:
#         return jsonify({'message': 'No medicines found'}), 404

# if __name__ == "__main__":
#     app.run(debug=True,host="0.0.0.0",port=5501)





from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from dotenv import load_dotenv
import os
import json
from urllib.parse import quote_plus
load_dotenv()

app=Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
password = quote_plus(os.getenv('DB_PASSWORD'))  # Encode the password
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{password}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db=SQLAlchemy(app)

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80),nullable=False,unique=True)
    age=db.Column(db.Integer,nullable=False)
    phone=db.Column(db.String(10),nullable=False,unique=True)
    bg=db.Column(db.String(3),nullable=False)


class Doctor(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80),nullable=False,unique=True)
    age=db.Column(db.Integer,nullable=False)
    gender=db.Column(db.String(6),nullable=False)
    phone=db.Column(db.String(10),nullable=False,unique=True)
    specialization=db.Column(db.String(50),nullable=False)
    experience=db.Column(db.Integer,nullable=False)
    license=db.Column(db.String(20),nullable=False,unique=True)
    hospital=db.Column(db.String(100),nullable=False)

class Medschedule(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    medicine_id=db.Column(db.Integer,db.ForeignKey('medicine.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
    day=db.Column(db.String(10),nullable=False)
    time=db.Column(db.String(10),nullable=False)
    beforeMeal=db.Column(db.Boolean,nullable=False)
    afterMeal=db.Column(db.Boolean,nullable=False)
    taken=db.Column(db.Boolean,nullable=False,default=False)

class Medicine(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
    doctor_id=db.Column(db.Integer,db.ForeignKey('doctor.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=False)
    name=db.Column(db.String(80),nullable=False)
    dosage=db.Column(db.String(100),nullable=False)
    consultation_id=db.Column(db.Integer,db.ForeignKey('consultation.id',ondelete='CASCADE',onupdate='CASCADE'),nullable=True)
class Consultation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(10), nullable=False)  # Store time as string like '9:00 AM'
    diagnosis = db.Column(db.String(200), nullable=True) 
    
class MedicineLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, nullable=False)
    doctor_id = db.Column(db.Integer, nullable=False)  # ADD THIS
    action = db.Column(db.String(20), nullable=False)  # "created", "updated", "deleted"
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.now())
    previous_data = db.Column(db.Text)  # JSON string of previous values
    new_data = db.Column(db.Text)       # JSON string of new values

    def __repr__(self):
        return f'<MedicineLog {self.action} for Medicine {self.medicine_id} by Doctor {self.doctor_id} at {self.timestamp}>'

with app.app_context():
   db.create_all()

# user routes
@app.route('/user/add',methods=['POST'])
def add_user():
    data=request.get_json()
    name=data['name']
    age=data['age']
    phone=data['ph']
    bg=data['bg']
    new_user=User(name=name,age=age,phone=phone,bg=bg)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':'User added successfully','id':new_user.id,'exists':True}),201

@app.route('/user/find',methods=['POST'])
def find_user():
    data=request.get_json()
    phone=data['ph']
    user=User.query.filter_by(phone=phone).first()
    if user:
        return jsonify({'message':'User found successfully','exists':True,'id':user.id}),200
    else:
        return jsonify({'message':'User not found','exists':False}),404
    
@app.route('/user/fetch',methods=['POST'])
def fetch_user():
    data=request.get_json()
    phone=data['ph']
    user=User.query.filter_by(phone=phone).first()
    if user:
        return jsonify({'id':user.id,'name':user.name,'phone':user.phone,'bg':user.bg,'age':user.age,'exists':True}),200
    else:
        return jsonify({'message':'User not found','exists':False}),404

@app.route('/user/getById',methods=['POST'])
def get_user_id():
    data=request.get_json()
    id=data['id']
    user=User.query.filter_by(id=id).first()
    if user:
        return jsonify({'id':user.id,'name':user.name,'phone':user.phone,'bg':user.bg,'age':user.age,'exists':True}),200
    else:
        return jsonify({'message':'User not found','exists':False}),404


#doctor routes
@app.route('/doctor/add',methods=['POST'])
def add_doctor():
    data=request.get_json()
    name=data['name']
    phone=data['phone']
    age=data['age']
    gender=data['gender']
    specialization=data['specialization']
    experience=data['experience']
    license=data['license']
    hospital=data['hospital']
    new_doc=Doctor(name=name,phone=phone,age=age,gender=gender,specialization=specialization,experience=experience,license=license,hospital=hospital)
    db.session.add(new_doc)
    db.session.commit()
    return jsonify({'message':'Doctor added successfully','id':new_doc.id,'exists':True}),201

@app.route('/doctor/getById', methods=['POST'])
def get_doctor_id():
    data = request.get_json()
    print("Incoming data:", data)  # Debugging line
    id = data.get('doctorId')  # Use .get() to avoid KeyError
    if not id:
        return jsonify({'message': 'doctorId is required', 'exists': False}), 400

    doctor = Doctor.query.filter_by(id=id).first()
    if doctor:
        return jsonify({
            'id': doctor.id,
            'name': doctor.name,
            'phone': doctor.phone,
            'age': doctor.age,
            'specialization': doctor.specialization,
            'experience': doctor.experience,
            'license': doctor.license,
            'hospital': doctor.hospital,
            'exists': True
        }), 200
    else:
        return jsonify({'message': "doctor not found", 'exists': False}), 404

@app.route('/doctor/fetch',methods=['POST'])
def fetch_doctor():
    data=request.get_json()
    phone=data['ph']
    doctor=Doctor.query.filter_by(phone=phone).first()
    if doctor:
        return jsonify({'id':doctor.id,'name':doctor.name,'phone':doctor.phone,'age':doctor.age,'exists':True}),200
    else:
        return jsonify({'message':'User not found','exists':False}),404

@app.route('/doctor/find', methods=['POST'])
def find_doctor():
    data = request.get_json()
    print("Incoming data:", data)  # Debugging line

    phone = data.get('ph')
    if not phone:
        return jsonify({'message': 'Phone number is required', 'exists': False}), 400

    try:
        doctor = Doctor.query.filter_by(phone=phone).first()
        if doctor:
            return jsonify({
                'exists': True,
                'id': doctor.id,
                'name': doctor.name,
                'phone': doctor.phone,
                'age': doctor.age,
                'specialization': doctor.specialization,
                'experience': doctor.experience,
                'license': doctor.license,
                'hospital': doctor.hospital
            }), 200
        else:
            return jsonify({'message': 'Doctor not found', 'exists': False}), 404
    except Exception as e:
        print("Error finding doctor:", e)
        return jsonify({'message': 'An error occurred while finding the doctor'}), 500
    

@app.route('/doctor/specialization',methods=['POST'])
def get_doctor_specialization():
    data=request.get_json()
    specialization=data['specialization']
    doctors=Doctor.query.filter_by(specialization=specialization).all()
    if doctors:
        doctor_list=[]
        for doctor in doctors:
            doctor_list.append({'id':doctor.id,'name':doctor.name,'phone':doctor.phone ,'specialization':doctor.specialization,'experience':doctor.experience,'hospital':doctor.hospital})
        return jsonify({'doctor_list':doctor_list,'exists':True}),200 
    else:
        return jsonify({'message':'No doctors available','exists':False}),404

@app.route('/consultation/get_slots', methods=['POST'])
def get_slots():
    data = request.get_json()
    doctorId = data['doctorId']
    date = data['date']

    # Query all consultations for that doctor on that date
    slots = Consultation.query.filter_by(doctor_id=doctorId, date=date).all()

    if slots:
        slot_list = [{"time": slot.time} for slot in slots]
        print("success")
        return jsonify({'slots': slot_list, 'exists': True}), 200
    else:
        print("no slots found")
        return jsonify({'slots': [], 'exists': False}), 200

@app.route('/consultation/book_slot',methods=['POST'])
def book_slot():
    data=request.get_json()
    patient_id=data['patient_id']
    doctor_id=data['doctor_id']
    date=data['date']
    slot=data['slot']
    new_consult=Consultation(user_id=patient_id,doctor_id=doctor_id,date=date,time=slot)
    db.session.add(new_consult)
    db.session.commit()
    return jsonify({'message':'Slot booked','exists':True}),201
@app.route('/medicines/<int:user_id>', methods=['GET'])
def get_medicines(user_id):
    medicines = Medicine.query.filter_by(user_id=user_id).all()
    result = []
    for medicine in medicines:
        schedules = Medschedule.query.filter_by(medicine_id=medicine.id).all()
        result.append({
            'name': medicine.name,
            'dosage': medicine.dosage,
            'schedule': [{'day': s.day, 'time': s.time, 'beforeMeal': s.beforeMeal, 'afterMeal': s.afterMeal} for s in schedules]
        })
    return jsonify(result)

@app.route('/medicine/add', methods=['POST'])
def add_medicine():
    try:
        data = request.get_json()
        print("Received medicine data:", data)
        
        # Extract and validate data
        name = data.get('name')
        dosage = data.get('dosage')
        schedule = data.get('schedule')
        user_id = data.get('user_id')
        doctor_id = data.get('doctor_id')
        
        if not all([name, dosage, schedule, user_id, doctor_id]):
            missing = [f for f in ['name', 'dosage', 'schedule', 'user_id', 'doctor_id'] 
                      if not data.get(f)]
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing)}',
                'exists': False
            }), 400
        
        # Find or create consultation
        consultation = Consultation.query.filter_by(
            user_id=user_id, 
            doctor_id=doctor_id
        ).order_by(Consultation.id.desc()).first()
        
        if not consultation:
            from datetime import date
            consultation = Consultation(
                user_id=user_id,
                doctor_id=doctor_id,
                date=date.today(),
                time="N/A",
                diagnosis=None
            )
            db.session.add(consultation)
            db.session.flush()
        
        # Create medicine
        new_medicine = Medicine(
            name=name, 
            dosage=dosage, 
            user_id=user_id, 
            doctor_id=doctor_id,
            consultation_id=consultation.id
        )
        db.session.add(new_medicine)
        db.session.flush()
        
        # Add schedules
        for entry in schedule:
            new_schedule = Medschedule(
                medicine_id=new_medicine.id,
                day=entry['day'],
                time=entry['time'],
                beforeMeal=entry.get('beforeMeal', False),
                afterMeal=entry.get('afterMeal', False),
                taken=False
            )
            db.session.add(new_schedule)
        
        # Single commit at the end
        db.session.commit()
        
        return jsonify({
            'message': 'Medicine added successfully!',
            'medicine_id': new_medicine.id,
            'exists': True
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error adding medicine: {e}")
        return jsonify({'message': f'Failed to add medicine: {str(e)}'}), 500
    
_old_medicine_values = {}

@event.listens_for(Medicine, 'before_update')
def before_update(mapper, connection, target):
    _old_medicine_values[target.id] = {
        "name": target.name,
        "dosage": target.dosage
    }

@event.listens_for(Medicine, 'after_update')
def after_update(mapper, connection, target):
    from datetime import datetime
    
    old_data = _old_medicine_values.pop(target.id, None)
    new_data = {
        "name": target.name,
        "dosage": target.dosage
    }
    
    # Create a log entry directly through the connection
    connection.execute(
        MedicineLog.__table__.insert(),
        {
            'medicine_id': target.id,
            'doctor_id': target.doctor_id,
            'action': "updated",
            'previous_data': json.dumps(old_data) if old_data else None,
            'new_data': json.dumps(new_data),
            'timestamp': datetime.now()  # Use Python's datetime instead of SQLAlchemy's func.now()
        }
    )

@event.listens_for(Medicine, 'after_insert')
def after_insert(mapper, connection, target):
    # Create a log entry directly through the connection
    from datetime import datetime
    
    new_data = {
        "name": target.name,
        "dosage": target.dosage
    }
    
    # Use raw SQL with NOW() function instead of trying to pass func.now()
    connection.execute(
        MedicineLog.__table__.insert(),
        {
            'medicine_id': target.id,
            'doctor_id': target.doctor_id,
            'action': "created",
            'previous_data': None,
            'new_data': json.dumps(new_data),
            'timestamp': datetime.now()  # Use Python's datetime instead of SQLAlchemy's func.now()
        }
    )

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=5501)


