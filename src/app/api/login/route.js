import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User"; // Import Mongoose model

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Ensure database connection
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    // Use Mongoose model instead of db.collection
    const user = await User.findOne({ email });
    console.log("user",user)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    console.log("Entered Password:", password);  // Logs the raw password entered by the user
    console.log("Stored Hashed Password:", user.password); 
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("ismatch",isMatch)
    console.log()
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
