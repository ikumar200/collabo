const express = require("express");
const {
    insertUser,
    getUsers,
    updateUser,
    deleteUser
} = require("../db/userService");

const router = express.Router();

// ✅ Create a new user
router.post("/add", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await insertUser(username, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// ✅ Get all users
router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// ✅ Update user details
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const updatedUser = await updateUser(id, username, password);
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// ✅ Delete a user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUser(id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

module.exports = router;
