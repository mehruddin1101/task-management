
const mysql = require("mysql2/promise");
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "taskdb",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};


const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL database connected!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
}


testConnection();

module.exports = pool;
