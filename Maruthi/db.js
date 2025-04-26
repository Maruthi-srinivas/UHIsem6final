const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/medicinesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Medicine Schema
const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  schedule: [
    {
      day: String, // e.g., "Mon", "Tue", "Wed"
      time: String, // e.g., "Morning", "Afternoon", "Evening", "Night"
      beforeMeal: Boolean, // true if before meal, false if after meal
      taken: { type: Boolean, default: false }, // Track if the medicine was taken
    },
  ],
  patientId: String, // Unique ID for the patient
});

// Middleware to expand "Weekdays," "Weekends," or "Everyday" into individual days
medicineSchema.pre("save", function (next) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weekends = ["Sat", "Sun"];
  const allDays = [...weekdays, ...weekends];

  this.schedule = this.schedule.flatMap((entry) => {
    if (entry.day === "Weekdays") {
      return weekdays.map((day) => ({ ...entry, day }));
    } else if (entry.day === "Weekends") {
      return weekends.map((day) => ({ ...entry, day }));
    } else if (entry.day === "Everyday") {
      return allDays.map((day) => ({ ...entry, day }));
    } else {
      return entry; // Keep the day as is if it's already a specific day
    }
  });

  next();
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;