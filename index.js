const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userSchema = require("./model/user");

dotenv.config();

const app = express();

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

//test API
// app.get("/", async (req, res) => {
//   res.json({ message: "api is working correctly" });
// });


//API for register route

app.post('/register',async(req,res)=>{
    const {name,email,password}=req.body
    try{

      if(!name || !email || !password){
        return res.status(400).json({message:"Please enter all the fields"})
      }
      const user = await userSchema.findOne({email})
      
      if(user){
        return res.status(401).json({message:"User already exists"})
      }
      const newUser = new userSchema({name,email,password})
      await newUser.save()

      res.status(201).json({message:"User created successfully"})

    }catch(error){
      console.log(error)
      res.status(500).json({message:"Internal Server Error"})
    }
})