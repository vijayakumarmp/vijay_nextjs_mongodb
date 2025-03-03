// // import { NextResponse } from "next/server";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // //import { connectToDatabase } from "@/lib/mongodb";
// // import {connectToDatabase}  from "../../../../lib/mongodb"; 

// // export async function POST(req) {
// //   try {
// //     const { email, password } = await req.json();

// //     if (!email || !password) {
// //       return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
// //     }

// //     const db = await connectToDatabase();
// //     const usersCollection = db.collection("users");

// //     // Find user by email
// //     const user = await usersCollection.findOne({ email });

// //     if (!user) {
// //       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
// //     }

// //     // Compare passwords
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       { userId: user._id, email: user.email },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "1h" }
// //     );

// //     return NextResponse.json({
// //       message: "Login successful",
// //       token,
// //       user: { name: user.name, email: user.email },
// //     }, { status: 200 });

// //   } catch (error) {
// //     console.error("Login error:", error);
// //     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
// //   }
// // }











// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { connectToDatabase } from "../../../../lib/mongodb"; 

// export async function POST(req) {
//   try {
//     console.log("🟢 Login API hit");  // Step 1: Check if API is called

//     const { email, password } = await req.json();
//     console.log("📩 Received data:", { email, password: password ? password : null }); // Step 2: Check request data

//     if (!email || !password) {
//       console.warn("⚠️ Missing email or password");
//       return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
//     }

//     // Connect to database
//     const db = await connectToDatabase();
//     console.log(db+"✅ Connected to MongoDB"); // Step 3: Check if DB connection is successful

//     const usersCollection = db.collection("users");

//     // Find user by email
//     const user = await usersCollection.findOne({ email });
//     console.log("🔎 User found:", user ? "Yes" : "No"); // Step 4: Check if user exists

//     if (!user) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("🔑 Password match:", isMatch ? "Yes" : "No"); // Step 5: Check password match

//     if (!isMatch) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     console.log("🛡️ Token generated:", token ? "Yes" : "No"); // Step 6: Check if token is created

//     return NextResponse.json({
//       message: "Login successful",
//       token,
//       user: { name: user.name, email: user.email },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }












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

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
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
