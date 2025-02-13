const client = require("./db");

// 📌 Create a new document
async function createDocument(title, content, userId) {
    try {
        const result = await client.query(
            "INSERT INTO documents (title, content, created_by) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userId]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error("Error creating document");
    }
}

// 📌 Get all documents of a user
async function getUserDocuments(userId) {
    try {
        const result = await client.query(
            "SELECT * FROM documents WHERE created_by = $1",
            [userId]
        );
        return result.rows;
    } catch (error) {
        throw new Error("Error fetching user documents");
    }
}

// 📌 Get a specific document
async function getDocumentById(documentId) {
    try {
        const result = await client.query(
            `SELECT d.* FROM documents d
             LEFT JOIN collaborators c ON d.id = c.document_id
             WHERE d.id = $1`,
            [documentId]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error("Error fetching document");
    }
}

// 📌 Update a document
async function updateDocument(documentId, title, content) {
    try {
        const result = await client.query(
            "UPDATE documents SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
            [title, content, documentId]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error("Error updating document");
    }
}

// 📌 Delete a document
async function deleteDocument(documentId) {
    try {
        const result = await client.query(
            "DELETE FROM documents WHERE id = $1 RETURNING *",
            [documentId]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error("Error deleting document");
    }
}

// 📌 Add a collaborator
async function addCollaborator(userId, documentId, role) {
    try {
        const result = await client.query(
            "INSERT INTO collaborators (user_id, document_id, role) VALUES ($1, $2, $3) RETURNING *",
            [userId, documentId, role]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error("Error adding collaborator");
    }
}

// 📌 Get all collaborators of a document
async function getCollaborators(documentId) {
    try {
        const result = await client.query(
            "SELECT * FROM collaborators WHERE document_id = $1",
            [documentId]
        );
        return result.rows;
    } catch (error) {
        throw new Error("Error fetching collaborators");
    }
}

// 📌 Exporting functions to be used in routes
module.exports = {
    createDocument,
    getUserDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    addCollaborator,
    getCollaborators
};
