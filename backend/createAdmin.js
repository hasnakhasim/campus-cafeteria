const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingAdmin = await User.findOne({
      email: "admin@cafeteria.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = new User({
      name: "Cafeteria Admin",
      email: "admin@cafeteria.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("Admin created successfully");

    console.log("Email: admin@cafeteria.com");
    console.log("Password: admin123");

    process.exit();

  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
};

createAdmin();