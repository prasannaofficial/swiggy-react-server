const express = require("express");
const cors = require("cors");
const { MONGOURI, PORT } = require("./config/keys");
const authRoute = require("./routes/authRoute");
const restRoute = require("./routes/restRoute");
const orderRoute = require("./routes/orderRoute");

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use(restRoute);
app.use(orderRoute);

app.listen(PORT, () => {
  console.log(`Process running on port ${port}`);
});
