const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5500;

// ---------- Twilio OTP Configuration ----------
const otpStore = {}; // In-memory store for OTPs (for demonstration only)
const accountSid = 'AC5465af5646f8dd9185daeb68279ea44c';
const authToken = 'dd2149073404e8d277039caa359538cf';
const twilioPhoneNumber = '+        16073578529'; // Replace with your Twilio phone number
const client = twilio(accountSid, authToken);

// Endpoint to send OTP
app.post("/sendOTP", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the OTP temporarily (in production, add an expiry mechanism)
  otpStore[phoneNumber] = otp;

  try {
    // Use Twilio to send the OTP via SMS
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Endpoint to verify OTP
app.post("/verifyOTP", (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const storedOtp = otpStore[phoneNumber];
  if (storedOtp === otp) {
    // OTP is valid – remove it from the store
    delete otpStore[phoneNumber];
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

// ---------- MySQL Database Configuration ----------
const db = mysql.createConnection({
  host: "localhost",           // Replace with your MySQL host
  user: "root",                // Replace with your MySQL username
  password: "Maruthi@5148",   // Replace with your MySQL password
  database: "medicines_db",    // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// Create Tables
db.query(`
  CREATE TABLE IF NOT EXISTS Medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    dosage VARCHAR(255),
    patientId VARCHAR(255)
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS Schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT,
    day VARCHAR(255),
    time VARCHAR(255),
    beforeMeal TINYINT(1),
    taken TINYINT(1) DEFAULT 0,
    FOREIGN KEY (medicine_id) REFERENCES Medicines(id) ON DELETE CASCADE
  )
`);

// ---------- CRUD Operations for Medicines and Schedules ----------

// 1. Fetch all medicines for a specific patient
app.get("/medicines/:patientId", (req, res) => {
  const patientId = req.params.patientId;
  const sql = `
    SELECT m.id AS medicine_id, m.name, m.dosage, m.patientId,
           s.id AS schedule_id, s.day, s.time, s.beforeMeal, s.taken
    FROM Medicines m
    LEFT JOIN Schedules s ON m.id = s.medicine_id
    WHERE m.patientId = ?
  `;
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    // Group schedules under medicines
    const medicinesMap = {};
    results.forEach((row) => {
      if (!medicinesMap[row.medicine_id]) {
        medicinesMap[row.medicine_id] = {
          id: row.medicine_id,
          name: row.name,
          dosage: row.dosage,
          patientId: row.patientId,
          schedule: [],
        };
      }
      if (row.schedule_id) {
        medicinesMap[row.medicine_id].schedule.push({
          id: row.schedule_id,
          day: row.day,
          time: row.time,
          beforeMeal: !!row.beforeMeal,
          taken: !!row.taken,
        });
      }
    });

    res.json(Object.values(medicinesMap));
  });
});

// 2. Add a new medicine
app.post("/medicines", (req, res) => {
  const { name, dosage, schedule, patientId } = req.body;
  if (!(name && dosage && schedule && patientId)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const insertMedicine = "INSERT INTO Medicines (name, dosage, patientId) VALUES (?, ?, ?)";
  db.query(insertMedicine, [name, dosage, patientId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    const medicineId = result.insertId;
    const tasks = schedule.map((entry) => {
      return new Promise((resolve, reject) => {
        const insertSchedule = `
          INSERT INTO Schedules (medicine_id, day, time, beforeMeal, taken)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(
          insertSchedule,
          [medicineId, entry.day, entry.time, entry.beforeMeal ? 1 : 0, 0],
          (err) => (err ? reject(err) : resolve())
        );
      });
    });

    Promise.all(tasks)
      .then(() => res.json({ message: "Medicine added successfully!" }))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error adding schedule" });
      });
  });
});

// 3. Update a medicine's schedule
app.put("/medicines/:id", (req, res) => {
  const medicineId = req.params.id;
  const { schedule } = req.body;
  if (!schedule) {
    return res.status(400).json({ error: "Missing schedule" });
  }

  const deleteSchedules = "DELETE FROM Schedules WHERE medicine_id = ?";
  db.query(deleteSchedules, [medicineId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting schedules" });
    }

    const tasks = schedule.map((entry) => {
      return new Promise((resolve, reject) => {
        const insertSchedule = `
          INSERT INTO Schedules (medicine_id, day, time, beforeMeal, taken)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(
          insertSchedule,
          [medicineId, entry.day, entry.time, entry.beforeMeal ? 1 : 0, 0],
          (err) => (err ? reject(err) : resolve())
        );
      });
    });

    Promise.all(tasks)
      .then(() => res.json({ message: "Schedule updated successfully!" }))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error updating schedule" });
      });
  });
});

// 4. Delete a medicine
app.delete("/medicines/:id", (req, res) => {
  const medicineId = req.params.id;
  const deleteMedicine = "DELETE FROM Medicines WHERE id = ?";
  db.query(deleteMedicine, [medicineId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting medicine" });
    }
    res.json({ message: "Medicine deleted successfully!" });
  });
});

// 5. Mark a schedule as taken
app.put("/schedules/:id/taken", (req, res) => {
  const scheduleId = req.params.id;
  const { taken } = req.body;
  const updateSchedule = "UPDATE Schedules SET taken = ? WHERE id = ?";
  db.query(updateSchedule, [taken ? 1 : 0, scheduleId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error updating schedule" });
    }
    res.json({ message: "Schedule updated successfully!" });
  });
});

// Start the server
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});