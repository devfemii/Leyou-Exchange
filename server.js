const http = require("http");
const { join } = require("node:path");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const initializeSocket = require("./socket/index");
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
const io = initializeSocket(server);

// parsing incoming data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log("attempting to connect to our database server...");
});

module.exports = io;
