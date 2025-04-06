const express = require('express');
const router= express.Router();
const taskController = require("./task.controller.js")

//MARK:- Routes
router.post("/create", taskController.createTask)
router.get("/list", taskController.getTasks)
router.delete("/:id", taskController.deleteTask)



module.exports = router

