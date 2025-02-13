const express = require("express");
const {
    addCollaborator,
    removeCollaborator,
    getCollaborators,
    getUserRole
} = require("../db/collaboratorService");

const router = express.Router();

// ✅ Add a collaborator
router.post("/add", async (req, res) => {
    const { user_id, document_id, role } = req.body;
    try {
        const collaborator = await addCollaborator(user_id, document_id, role);
        res.status(201).json(collaborator);
    } catch (err) {
        res.status(500).json({ error: "Failed to add collaborator" });
    }
});

// ✅ Remove a collaborator
router.delete("/remove", async (req, res) => {
    const { user_id, document_id } = req.body;
    try {
        const removed = await removeCollaborator(user_id, document_id);
        if (!removed) return res.status(404).json({ error: "Collaborator not found" });
        res.json(removed);
    } catch (err) {
        res.status(500).json({ error: "Failed to remove collaborator" });
    }
});

// ✅ Get all collaborators for a document
router.get("/:document_id", async (req, res) => {
    const { document_id } = req.params;
    try {
        const collaborators = await getCollaborators(document_id);
        res.json(collaborators);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch collaborators" });
    }
});

// ✅ Get user's role in a document
router.get("/role/:user_id/:document_id", async (req, res) => {
    const { user_id, document_id } = req.params;
    try {
        const role = await getUserRole(user_id, document_id);
        if (!role) return res.status(404).json({ error: "User has no role in this document" });
        res.json({ role });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user role" });
    }
});

module.exports = router;
