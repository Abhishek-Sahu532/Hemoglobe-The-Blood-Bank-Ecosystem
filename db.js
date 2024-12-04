const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  user: "be679a24",
  password: "Cab#22se",
  database: "be679a24",
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  } 
  console.log("Connected to MySQL");
  connection.release();
});

module.exports = pool;
