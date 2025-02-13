const client = require("./db");

// ✅ Store an edit (track real-time changes)
async function addEdit(document_id, user_id, change_text, change_type) {
    const query = `
        INSERT INTO edits (document_id, user_id, change_text, change_type) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [document_id, user_id, change_text, change_type];

    try {
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("Error adding edit:", err);
        throw err;
    }
}

// ✅ Get all edits for a document
async function getEdits(document_id) {
    const query = `SELECT * FROM edits WHERE document_id = $1 ORDER BY timestamp DESC;`;
    const values = [document_id];

    try {
        const res = await client.query(query, values);
        return res.rows;
    } catch (err) {
        console.error("Error fetching edits:", err);
        throw err;
    }
}

// ✅ Rollback (Restore previous edit) - Optional
async function rollbackEdit(edit_id) {
    const query = `DELETE FROM edits WHERE id = $1 RETURNING *;`;
    const values = [edit_id];

    try {
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("Error rolling back edit:", err);
        throw err;
    }
}

module.exports = {
    addEdit,
    getEdits,
    rollbackEdit
};
