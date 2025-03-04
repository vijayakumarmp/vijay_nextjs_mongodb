import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    patientId: { type: Number, unique: true, required: true }, // ✅ Ensure patientId is first
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true } // ✅ This automatically adds createdAt and updatedAt
);

// ✅ Ensure model is not re-registered
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;