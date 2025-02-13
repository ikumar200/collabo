const express = require("express");
const {
    createDocument,
    getUserDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} = require("../db/documentService");

const router = express.Router();

// ✅ Create a new document
router.post("/add", async (req, res) => {
    const { title, content, created_by } = req.body;
    try {
        const document = await createDocument(title, content, created_by);
        res.status(200).json(document);
    } catch (err) {
        res.status(500).json({ error: "Failed to create document" ,err}); 
        console.log(err)
    }
});

// ✅ Get all documents
router.get("/", async (req, res) => {
    try {
        const {userid}=req.body;
        const documents = await getUserDocuments(userid);
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch documents",err });
        console.log(err)
    }
});

// ✅ Get a document by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const document = await getDocumentById(id);
        if (!document) return res.status(404).json({ error: "Document not found" });
        res.json(document);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch document" });
    }
});

// ✅ Update a document
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedDocument = await updateDocument(id, title, content);
        res.json(updatedDocument);
    } catch (err) {
        res.status(500).json({ error: "Failed to update document" });
    }
});

// ✅ Delete a document
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDocument = await deleteDocument(id);
        res.json(deletedDocument);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});

module.exports = router;
