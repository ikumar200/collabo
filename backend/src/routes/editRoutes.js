const express = require("express");
const {
    addEdit,
    getEdits,
    rollbackEdit
} = require("../db/editService");

const router = express.Router();
  
// ✅ Add an edit
router.post("/add", async (req, res) => {
    const { document_id, user_id, change_text, change_type } = req.body;
    try {
        const edit = await addEdit(document_id, user_id, change_text, change_type);
        res.status(201).json(edit);
    } catch (err) {
        res.status(500).json({ error: "Failed to add edit" });
    }
});

// ✅ Get all edits for a document
router.get("/:document_id", async (req, res) => {
    const { document_id } = req.params;
    try {
        const edits = await getEdits(document_id);
        res.json(edits);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch edits" });
    }
});

// ✅ Rollback an edit (Optional)
router.delete("/rollback/:edit_id", async (req, res) => {
    const { edit_id } = req.params;
    try {
        const deletedEdit = await rollbackEdit(edit_id);
        if (!deletedEdit) return res.status(404).json({ error: "Edit not found" });
        res.json(deletedEdit);
    } catch (err) {
        res.status(500).json({ error: "Failed to rollback edit" });
    }
});

module.exports = router;
