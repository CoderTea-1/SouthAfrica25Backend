require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://darmint:0rvFuyaDyCBS3NoZ@southafrica25.fbbni.mongodb.net/surveysDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Keep the connection alive for 45 seconds
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema & Model
const SurveySchema = new mongoose.Schema({
  testId: String,
  testName: String,
  testType: String,
  timestamp: { type: Date, default: Date.now },
  results: Array,
  demographicInfo: {
    gender: String,
    otherGender: String,
    age: String,
    education: String,
    city: String,
    ethnicity: String,
    otherEthnicity: String,
    politicalAffiliation: String,
    otherPoliticalAffiliation: String,
    income: String,
    consentProject: Boolean,
    consentResearch: Boolean,
  },
});

const Survey = mongoose.model("Survey", SurveySchema);

// Define Routes
app.get("/", (req, res) => {
  res.send("Hello, this is the backend for the demographic survey!!");
});

app.post("/api/save-survey", async (req, res) => {
  try {
    const { testId, testName, testType, results, demographicInfo } = req.body;

    console.log("📩 Received survey data:", req.body);

    const newSurvey = new Survey({
      testId,
      testName,
      testType,
      results,
      demographicInfo,
    });

    await newSurvey.save();
    res.status(201).json({ message: "Survey saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving survey:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export Serverless Function for Vercel
module.exports = app;
