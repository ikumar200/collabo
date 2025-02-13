const client = require("./db");

// ✅ Add a collaborator to a document
async function addCollaborator(user_id, document_id, role) {
    const query = `
        INSERT INTO collaborators (user_id, document_id, role) 
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [user_id, document_id, role];

    try {
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("Error adding collaborator:", err);
        throw err;
    }
}

// ✅ Remove a collaborator
async function removeCollaborator(user_id, document_id) {
    const query = `DELETE FROM collaborators WHERE user_id = $1 AND document_id = $2 RETURNING *;`;
    const values = [user_id, document_id];

    try {
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("Error removing collaborator:", err);
        throw err;
    }
}

// ✅ Get all collaborators for a document
async function getCollaborators(document_id) {
    const query = `SELECT * FROM collaborators WHERE document_id = $1;`;
    const values = [document_id];

    try {
        const res = await client.query(query, values);
        return res.rows;
    } catch (err) {
        console.error("Error fetching collaborators:", err);
        throw err;
    }
}

// ✅ Check a user's role in a document
async function getUserRole(user_id, document_id) {
    const query = `SELECT role FROM collaborators WHERE user_id = $1 AND document_id = $2;`;
    const values = [user_id, document_id];

    try {
        const res = await client.query(query, values);
        return res.rows[0]?.role || null;
    } catch (err) {
        console.error("Error fetching user role:", err);
        throw err;
    }
}

module.exports = {
    addCollaborator,
    removeCollaborator,
    getCollaborators,
    getUserRole
};
