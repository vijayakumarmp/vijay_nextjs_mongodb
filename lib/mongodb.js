// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please add MONGODB_URI to .env file");
// }

// if (!client) {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const dbClient = await clientPromise;
//   return dbClient.db("myTestDB"); // Change "yourDatabaseName"
// }








// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   throw new Error("⚠️ Please add MONGODB_URI to your .env file");
// }

// // Global variable to store the MongoDB client
// let cachedClient = null;
// let cachedDb = null;

// export async function connectToDatabase() {
//   if (cachedDb) {
//     console.log("✅ Using existing database connection");
//     return cachedDb;
//   }

//   if (!cachedClient) {
//     console.log("📡 Connecting to MongoDB...");
//     cachedClient = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     try {
//       await cachedClient.connect();
//       console.log("✅ MongoDB Connected Successfully!");
//     } catch (error) {
//       console.error("❌ MongoDB Connection Failed:", error);
//       throw error;
//     }
//   }

//   cachedDb = cachedClient.db("myTestDB"); // Change to your actual DB name
//   return cachedDb;
// }




import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI is not defined in environment variables");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🟡 Connecting to new MongoDB instance...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("✅ Connected to MongoDB");
  return cached.conn;
}
global.mongoose = cached;
