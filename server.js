require("express-async-errors");
require("dotenv").config();

const http = require("http");
const { join } = require("node:path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");

const initializeSocket = require("./socket/index");

const PORT = process.env.PORT || 5000;

//<---------- import application routes---------->
const authRouter = require("./routes/auth.routes");
const notificationRouter = require("./routes/notification.routes");
const userRouter = require("./routes/user.routes");
const transactionRouter = require("./routes/transaction.routes");
const walletRouter = require("./routes/wallet.routes");
const adminRouter = require("./routes/admin.routes");
const ErrorHandlerMiddleWare = require("./middleware/error-handler");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// parsing incoming data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

//<---------- routes ---------->
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/admin", adminRouter);


app.use(ErrorHandlerMiddleWare);

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

const start = async () => {
  try {
    await connectDB();
    console.log("connected to database");
    server.listen(PORT, () => {
      console.log(`Server is listening at PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = io;
