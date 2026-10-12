require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const formRoutes = require("./routes/formRoutes");
const responseRoutes = require("./routes/responseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Forms API is running" });
});

app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate form id or slug",
    });
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      message: "Invalid data",
      error: error.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();