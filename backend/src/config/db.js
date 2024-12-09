const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,       
  host: process.env.PG_HOST,       
  database: process.env.PG_DATABASE, 
  port: process.env.PG_PORT,       
 
});

module.exports = pool;
