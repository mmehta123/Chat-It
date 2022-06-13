const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const userRoutes = require("./routes/userRoute");




app.use(cors());
app.use(express.json());

const connect = () => {
    console.log("DB connection succesfull");
    return mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}

app.use("/api/auth", userRoutes);

app.listen(process.env.PORT, async () => {
    try {
        await connect();
        console.log("listening on Port " + process.env.PORT);
    } catch {
        console.log("connection failed");
    }
});
