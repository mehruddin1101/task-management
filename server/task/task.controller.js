const taskModal = require('./task.model.js')

const taskController = {
// MARK:-  Create Task
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      if(!title || !description){
        return res
        .status(200)
        .json({ success: false, messageg: "Please provide title and description"});
      }

     await taskModal.createOne({ title, description });

      res
        .status(201)
        .json({ success: true, messageg: "Task created successfully"});
    } catch (error) {
      res
        .status(200)
        .json({ success: false, messageg: "Failed to create task" });
    }
  },

  // MARK:-  Get All Tasks
  async getTasks(req, res) {
    try {
      const tasks = await taskModal.getAll();

      if (!tasks) {
        return res.status(200).json({success : false,  message: "No tasks found" });
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(200).json({ error: "Failed to fetch tasks" });
    }
  },

  //MARK:- DELETE TASK
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(200).json({success: false ,  message: "Task id is required" });
      }

      if(isNaN(id)){
        return res.status(200).json({ success: false, message: "Task id must be a number" });
      }

      const task = await taskModal.deleteOne(id);
     
      if (task.affectedRows === 0) {
        return res.status(200).json({ success : false, message: "Task not found" });
      }

      res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      res.status(200).json({  success: false,  message: "Failed to delete task" });
    }
  },
};

module.exports = taskController;