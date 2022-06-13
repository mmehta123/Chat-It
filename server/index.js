const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const msgRoutes = require("./routes/messagesRoute");
const userRoutes = require("./routes/userRoute");
const socket = require("socket.io");
require("dotenv").config();
const app = express();




app.use(cors());
app.use(express.json());

const connect = () => {
    console.log("DB connection succesfull");
    return mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}

app.use("/api/auth", userRoutes);
app.use("/api/messages", msgRoutes);

const server = app.listen(process.env.PORT, async () => {
    try {
        await connect();
        console.log("listening on Port " + process.env.PORT);
    } catch {
        console.log("connection failed");
    }
});


const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.msg);
        }
    })
})