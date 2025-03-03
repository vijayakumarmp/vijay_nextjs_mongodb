import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User"; // Ensure you have a User model

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, age, email, password, phone, address } = body;

    // ✅ Check for missing fields
    if (!name || !age || !email || !password || !phone || !address) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    await connectToDatabase();

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use." }, { status: 400 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      age,
      email,
      password: hashedPassword,
      phone,
      address,
      createdAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
