const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running on ${port}`)
});
