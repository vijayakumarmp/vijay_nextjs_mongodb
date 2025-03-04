import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("Authorization");
    console.log("authHeader",authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Fetch user by decoded userId and exclude password
    const user = await User.findById(decoded.userId).select("-password");
    console.log("user",user)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Fetched User:", user);
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
