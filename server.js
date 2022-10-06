const express = require("express");
const morgan = require("morgan");

const app = express();

//Connect DB
const connectDB = require("./config/db");
connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With , Content-Type , Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET , POST , PUT, PATCH , DELETE , OPTIONS"
  );
  next();
});

app.use(morgan("tiny"));
app.use(express.json({ extended: false }));

app.use("/api/test", require("./routes/test"));
app.use("/api/surface-rate", require("./routes/surfaceRate"));

app.listen(5001, () => {
  console.log("Server is running on Port 5001");
});
