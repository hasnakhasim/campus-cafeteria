const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// =====================================================
// ROUTES
// =====================================================

const authRoutes =
  require("./routes/authRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const menuRoutes =
  require("./routes/menuRoutes");
const feedbackRoutes =
  require("./routes/feedbackRoutes");

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Menu
app.use(
  "/api/menu",
  menuRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);
// Feedback
app.use(
  "/api/feedback",
  feedbackRoutes
);
// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Campus Cafeteria Backend is running",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      message:
        err.message ||
        "Internal server error",
    });
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});