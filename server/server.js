require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const taskRoutes = require("./routes/routes.js");
const app = express();


//MARK:- Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 

// MARK:- Routes
app.use("/api/v1", taskRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Task Manager API is running on port ${process.env.APP_PORT}`);
});

module.exports = app;
