const express = require("express");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3000;

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

app.use("/api/core", require("./routes/core"));
app.use("/api/surface-rate", require("./routes/surfaceRate"));
app.use("/api/real-rate", require("./routes/realRate"));
app.use("/api/trade", require("./routes/trade"));

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
