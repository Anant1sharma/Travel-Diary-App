import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"

dotenv.config()

mongoose.connect(process.env.MONGO_URI) .then(() => console.log("✅ MongoDB connected"))
  
  .catch((err) => {
    console.log(err)
  })

const app = express()

// Enable CORS for frontend (Replace with your frontend URL)
app.use(
  cors({
    origin: "https://travel-diary-app-qlyc.onrender.com", //frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow CRUD operations
    credentials: true, // Allow cookies & authorization headers
  })
)

app.use(cookieParser())

// for allowing json object in req body
app.use(express.json())

app.listen(3000, () => {
  console.log("Server is running on port 3000!")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// server static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use( express.static(path.join(__dirname, "/frontend/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
}
)
// app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Check if response has already been sent
  if (res.headersSent) {
    return next(err); // delegate to default Express error handler
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

