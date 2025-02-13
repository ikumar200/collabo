const { Client } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

// ✅ Get database URL from environment variables
const dburl = process.env.DATABASE_URL;

// ✅ Create a new PostgreSQL client
const client = new Client({
    connectionString: dburl,
    ssl: {
        rejectUnauthorized: false, // Allows connection to databases with self-signed certificates
    },
});

// ✅ Function to connect to the database
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to the database successfully!");
    } catch (err) {
        console.error("❌ Database connection error:", err.message);
        process.exit(1); // Exit the process on failure
    }
}

// ✅ Connect to the database
connectDB();

// ✅ Export client for use in other files
module.exports = client;
