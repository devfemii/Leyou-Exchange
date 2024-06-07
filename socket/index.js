const socketIo = require("socket.io");
const { onConnection } = require("./handlers");

const initializeSocket = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    onConnection(socket, io);
  });

  return io;
};

module.exports = initializeSocket;
