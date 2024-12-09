# Polling System

This project implements a polling system where users can create polls, submit votes, and track poll results. It includes a Node.js backend, PostgreSQL database, and optional Kafka integration for handling votes.

## Prerequisites
Before starting the project, ensure you have the following installed on your machine:
- **Docker** for PostgreSQL and Kafka
- **Node.js** and **npm** for the backend
- **Postman** or **cURL** for API testing

## Step 1: Set Up PostgreSQL
### 1.1 Stop and Remove Existing PostgreSQL Container
If you have any existing PostgreSQL container running, stop and remove it to start fresh.
```bash
docker stop postgres
docker rm postgres
1.2 Recreate the PostgreSQL Container
Run the following command to create a new PostgreSQL container with the environment variables for user, password, and database.

docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Ravijha \
  -e POSTGRES_DB=polling_system \
  -p 5432:5432 -d postgres:latest
1.3 Verify the PostgreSQL Container is Running
Check the logs to confirm the PostgreSQL container started successfully.
docker logs postgres
1.4 Access PostgreSQL
You can access the PostgreSQL CLI using the following command:

1.5 Create Tables in PostgreSQL
Once inside the psql prompt, create the necessary tables (polls and votes) for the system:
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    options JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES polls(id),
    option TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Step 2: Configure PostgreSQL Authentication
2.1 Update pg_hba.conf for Passwordless Authentication
Ensure PostgreSQL is set up to allow passwordless connections for the polling_user role.

Access the PostgreSQL container:

docker exec -it postgres /bin/bash


Edit the pg_hba.conf file to allow passwordless connections:

echo "local   all             polling_user                              trust" >> /var/lib/postgresql/data/pg_hba.conf
echo "host    all             polling_user   127.0.0.1/32              trust" >> /var/lib/postgresql/data/pg_hba.conf
echo "host    all             polling_user   ::1/128                   trust" >> /var/lib/postgresql/data/pg_hba.conf

Restart PostgreSQL:
docker restart postgres


Step 3: Update Node.js Backend
3.1 Install Dependencies
Inside your project directory, install the required dependencies:

npm install express pg body-parser

3.2 Update .env File
In your .env file, make sure to remove the password field since we’re using passwordless authentication:

PG_USER=polling_user
PG_HOST=localhost
PG_DATABASE=polling_system
PG_PORT=5432


3.3 Update Database Connection (db.js)
Ensure your db.js file does not include the password, as we're using passwordless authentication.

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,        // polling_user
  host: process.env.PG_HOST,        // localhost
  database: process.env.PG_DATABASE, // polling_system
  port: process.env.PG_PORT,        // 5432
  
});

module.exports = pool;

3.4 Set Up Express Routes
Set up routes in your Node.js backend for poll creation and voting.

const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create poll route
app.post("/polls", async (req, res) => {
  const { title, options } = req.body;
  try {
    const query = "INSERT INTO polls (title, options) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [title, JSON.stringify(options)]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).send("Error creating poll");
  }
});

// Vote route (POST /polls/:id/vote)
app.post("/polls/:id/vote", async (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;
  try {
    const query = "INSERT INTO votes (poll_id, option) VALUES ($1, $2)";
    await pool.query(query, [pollId, option]);
    res.status(200).send("Vote submitted!");
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).send("Error voting");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


3.5 Start the Node.js Application
Run your Node.js app:
node src/index.js

