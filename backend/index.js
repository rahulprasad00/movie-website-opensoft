import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/user.js";
import cors from "cors";

const connurl = process.env.MONGO_URI;
console.log(connurl);

let conn = await mongoose.connect(connurl);

const app = express();
const port = process.env.PORT || 5000; // Use available port in deployment

// Add this to handle OPTIONS requests for CORS preflight
app.use(cors());
app.use(express.json()); // Middleware used to use req.body so that we can send request in json

// //Available Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`MovieWebsite backend listening on port ${port}`);
});
