import { connectDB } from "./config/Dbconn.js";
import User from "./model/UserModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const setupInitialAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@gmail.com";
    const rawPassword = "admin123";

    const duplicateAccount = await User.findOne({ email });

    if (duplicateAccount) {
      console.log("Admin account is already set up. Skipping...");
      await mongoose.connection.close();
      process.exit(0);
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const adminAccount = new User({
      name: "Jayant Patil",
      email: email,
      password: encryptedPassword,
      role: "admin"
    });

    await adminAccount.save();

    console.log("-----------------------------------------");
    console.log(`Admin user '${adminAccount.name}' created successfully.`);
    console.log(`Access email: ${email}`);
    console.log("-----------------------------------------");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error setting up admin account:", err.message);
    process.exit(1);
  }
};

setupInitialAdmin();