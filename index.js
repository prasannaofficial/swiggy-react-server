const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MONGOURI, PORT } = require("./config/keys");
const { JWT_SECRET } = require("./config/keys");
const authRoute = require("./routes/authRoute");
const restRoute = require("./routes/restRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const adminRoute = require("./routes/adminRoute");
const fcmRoute = require("./routes/fcmRoute");

const User = require("./models/userSchema");
const Chat = require("./models/chatSchema");
const { sendNotificationToClient } = require("./notify");

const mongoose = require("mongoose");
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: false,
});
mongoose.connection.on("connected", () => {
  console.log("Connected");
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use(restRoute);
app.use(orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminRoute);
app.use("/fcm", fcmRoute);

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, JWT_SECRET, function (
      err,
      decoded
    ) {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  let roomId;
  // console.log(socket.handshake.query.to);
  if (socket.handshake.query.to) {
    roomId = socket.handshake.query.to;
  } else {
    roomId = socket.decoded.email;
  }
  if (socket.decoded.role === "admin") {
    User.findOne({ email: roomId }, (err, doc) => {
      socket.decoded.fcmtoken = doc.fcmtoken;
    });
  }
  socket.on("receive messages", () => {
    Chat.find({ email: roomId }).then((data) => {
      socket.emit("initial messages", data);
    });
  });

  socket.join(roomId);
  socket.on("send message", (message) => {
    // console.log(message, socket.decoded.email);
    let newChat = new Chat({
      userid: socket.decoded.id,
      message: message,
      role: socket.decoded.role,
      email: roomId,
    });
    newChat.save();
    if (socket.decoded.role === "admin") {
      const notificationData = {
        title: "Swiggy",
        body: message,
      };
      const tokens = [socket.decoded.fcmtoken];
      sendNotificationToClient(tokens, notificationData);
    }
    io.in(roomId).emit("message", {
      message,
      role: socket.decoded.role,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Process running on port ${PORT}`);
});
