const client = require("./db");

// 📌 Insert a new user
async function insertUser(username, password) {
    try {
        const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`;
        const values = [username, password];
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        throw new Error("Error inserting user: " + err.message);
    }
}

// 📌 Get all users
async function getUsers() {
    try {
        const res = await client.query("SELECT * FROM users;");
        return res.rows;
    } catch (err) {
        throw new Error("Error fetching users: " + err.message);
    }
}

// 📌 Get a single user by ID
async function getUserById(id) {
    try {
        const res = await client.query("SELECT * FROM users WHERE id = $1;", [id]);
        return res.rows[0] || null;
    } catch (err) {
        throw new Error("Error fetching user: " + err.message);
    }
}

// 📌 Update a user
async function updateUser(id, username, password) {
    try {
        const query = `UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *;`;
        const values = [username, password, id];
        const res = await client.query(query, values);
        return res.rows[0] || null;
    } catch (err) {
        throw new Error("Error updating user: " + err.message);
    }
}

// 📌 Delete a user
async function deleteUser(id) {
    try {
        const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
        const res = await client.query(query, [id]);
        return res.rows[0] || null;
    } catch (err) {
        throw new Error("Error deleting user: " + err.message);
    }
}

// 📌 Exporting functions for routes
module.exports = {
    insertUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
