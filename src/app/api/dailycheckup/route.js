import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User"; // Import the User model
import DailyCheckup from "../../../../models/DailyCheckup";

export async function POST(req) {
  try {
    const body = await req.json();
    const { patientId, bp, temperature, pulse } = body;

    if (!patientId || !bp || !temperature || !pulse) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Retrieve user details from the users collection based on patientId
    const user = await User.findOne({ patientId });

    if (!user) {
      return NextResponse.json({ message: "Patient not found." }, { status: 404 });
    }

    // Extract name and age from the user document
    const { name, age } = user;

    // Generate current date and day
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedDay = currentDate.toLocaleDateString("en-US", { weekday: "long" });

    // Create a new checkup entry
    const newCheckup = new DailyCheckup({
      patientId,
      name,
      age,
      bp,
      temperature,
      pulse,
      date: formattedDate,
      day: formattedDay,
    });

    // Save the checkup entry
    await newCheckup.save();

    return NextResponse.json(
      { message: "Checkup saved successfully", checkupId: newCheckup._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving checkup:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const checkupRecords = await DailyCheckup.find();
    console.log("checkupRecords", checkupRecords)

    return NextResponse.json({ checkupRecords }, { status: 200 });
  } catch (error) {
    console.error("Error fetching checkup records:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

