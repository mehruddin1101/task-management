

const express = require("express");
const router = express.Router();
const taskRoutes = require("../task/task.routes.js")

// MARK: - Task Routes


router.use("/task", taskRoutes);


module.exports = router