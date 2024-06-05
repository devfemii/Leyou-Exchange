const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");

const dotenv = require("dotenv");
require("./config/db.config");

dotenv.config();
const port = process.env.PORT || 3000;

// import application routes
const authRouter = require("./routes/auth.routes");
const notificationRouter = require("./routes/notification.routes");
const userRouter = require("./routes/user.routes");
const transactionRouter = require("./routes/transaction.routes");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// parsing incoming data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);

server.listen(port, () => {
  console.log("attempting to connect to our database server...");
});

module.exports = io;
