const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/user"); //  Correct import
const bcrypt = require("bcrypt");
const userSchema = require("./models/user");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
app.use(express.json()); // Important to parse JSON body

// Server creation
const port = process.env.PORT || 3000;

// MongoDB connection
const mongodb = process.env.MONGODB;

if (!mongodb) {
  console.error("MONGODB URI is missing! Please check your .env file.");
  process.exit(1);
}

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(" MongoDB connection error:", error);
});

db.once("open", () => {
  console.log(" MongoDB connection success");
});

// Start server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});

// Test API
app.get("/", async (req, res) => {
  res.json({ message: "API is working correctly" });
});

// API for register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Correct bcrypt usage
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// login api
const secret = process.env.TOKEN_SECRET;

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await userSchema.findOne({ email });

    if (userDoc) {
      const passwordMatch = bcrypt.compareSync(
        password,
        userDoc.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
      const token = jwt.sign(
        { email: userDoc.email, name: userDoc.name },
        secret,
        {}
      );
      res.cookie("token", token).json( token);
    } else {
      res.status(401).json({
        error: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
