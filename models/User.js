import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true
    
   }
);

// Avoid re-registering the model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;


