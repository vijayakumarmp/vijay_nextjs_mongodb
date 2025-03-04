import mongoose from "mongoose";

const dailyCheckupSchema = new mongoose.Schema(
  {
    patientId: { type: Number, required: true },
    name: { type: String, required: true },
    age: { type: String, required: true },
    bp: { type: String, required: true },
    temperature: { type: String, required: true },
    pulse: { type: String, required: true },
    date: { type: String, required: true },
    day: { type: String, required: true },
  },
  { timestamps: true }
);

const DailyCheckup = mongoose.models.DailyCheckup || mongoose.model("DailyCheckup", dailyCheckupSchema);
export default DailyCheckup;
