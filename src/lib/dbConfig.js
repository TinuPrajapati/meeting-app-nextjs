import mongoose from "mongoose";

// Retrieve MongoDB URL from environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// Throw an error if the MongoDB URL is not provided
if (!MONGODB_URL) {
  throw new Error("Please provide the MongoDB URL in your environment variables.");
}

// Use a global variable to cache the MongoDB connection in a serverless environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to establish a MongoDB connection
const dbConnection = async () => {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable buffering commands
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is not available
    };

    // Create a connection promise
    cached.promise = mongoose.connect(MONGODB_URL, options).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and store the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the cached promise if the connection fails
    cached.promise = null;
    throw new Error(`MongoDB connection error: ${error.message}`);
  }

  return cached.conn;
};

export default dbConnection;