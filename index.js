const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error(" MongoDB connection error:", error);
});

db.once('open', () => {
  console.log(" MongoDB connection success");
});

// Start server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});


//test API
app.get('/',async(req,res)=>{
    res.json({message:"api is working correctly"})
} 
);