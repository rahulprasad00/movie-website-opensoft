import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Razorpay from "razorpay";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/user.js";
import paymentRoutes from "./routes/payment.js";

const app = express();

/* -------------------- Razorpay -------------------- */
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

/* -------------------- MongoDB (Safe for Vercel) -------------------- */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "sample_mflix",
  });

  isConnected = true;
  console.log("MongoDB connected");
}

connectDB();

/* -------------------- CORS FIX -------------------- */
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight explicitly
app.options("*", cors());

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

/* -------------------- Export (NO listen) -------------------- */
export default app;
