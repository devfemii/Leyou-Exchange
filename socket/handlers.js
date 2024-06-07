const User = require("../models/user.model");

const onConnection = async (socket, io) => {
  console.log("A user connected:", socket.id);

  //   const username = socket.user.username;

  // EMIT THE DATA WITH THE USERID

  // await User.findOneAndUpdate(
  //   { username },
  //   { socketId: socket.id },
  //   { upsert: true, new: true }
  // );

  socket.on("chat message", (msg) => {
    io.emit("chat message", `Admin message - ${msg}`);
  });
  //   socket.on("message", async (msg) => {
  //     io.emit("Message from", socket.id, ":", msg);

  //     // const user = await User.findOne({ username });
  //     // if (user) {
  //     //   socket.to(user.socketId).emit("message", "Message received");
  //     // }
  //   });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  //   socket.on("disconnect", async () => {
  //     // const user = await User.findOneAndUpdate(
  //     //   { socketId: socket.id },
  //     //   { socketId: null }
  //     // );
  //   });
};

module.exports = {
  onConnection,
};
