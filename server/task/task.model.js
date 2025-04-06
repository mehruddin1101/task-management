const sqlDb = require("../config/db.js")

const taskModel = {

    // MARK:-  Create Task
    async createOne(task) {
        const sql = `INSERT INTO task (title, description) VALUES (?, ?)`;
        const [result] = await sqlDb.query(sql, [task.title, task.description]);
        return result;
    },
    //  MARK:-  Get All Tasks
    async getAll() {
        const sql = `SELECT * FROM task order by created_at DESC`;
        const [result] = await sqlDb.query(sql);
        return result;
    },
    //MARK:- DELETE TASK
    async deleteOne(id) {
        const sql = `DELETE FROM task WHERE id = ?`;
        const [result] = await sqlDb.query(sql, [id]);
        return result;
    }

};

module.exports = taskModel;