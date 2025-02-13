const { Server } = require("socket.io");
const client = require("../db/db"); // PostgreSQL connection

const activeUsers = {}; // Track active users in documents

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",  // Allow any origin for testing
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true  // Allow credentials if needed
        },
        transports: ["websocket", "polling"],  // Use both WebSocket and Polling
        path: "/socket.io/"  // Ensure this path is correct
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // User joins a document
        socket.on("joinDocument", async ({ document_id, user_id }) => {
            // Validate document_id and user_id
            if (!document_id || isNaN(parseInt(document_id)) || !user_id || isNaN(parseInt(user_id))) {
                socket.emit("error", { message: "Invalid document or user ID." });
                return;
            }

            socket.join(document_id);

            // Check if document exists
            try {
                const docExists = await client.query("SELECT id, content FROM documents WHERE id = $1", [document_id]);
                if (docExists.rowCount === 0) {
                    socket.emit("error", { message: "Document does not exist." });
                    return;
                }

                // Fetch the existing content of the document and send it to the user
                const documentContent = docExists.rows[0].content;
                socket.emit("documentContent", { document_id, content: documentContent });

                // Manage active users
                if (!activeUsers[document_id]) activeUsers[document_id] = new Set();
                activeUsers[document_id].add(user_id);

                console.log(`User ${user_id} joined document ${document_id}`);
                io.to(document_id).emit("userJoined", Array.from(activeUsers[document_id]));
            } catch (error) {
                console.error("Error handling joinDocument:", error);
                socket.emit("error", { message: "Failed to join document." });
            }
        });

        // User edits a document (real-time updates)
        socket.on("editDocument", async ({ document_id, user_id, newText }) => {
            console.log("Received editDocument:", { document_id, user_id, newText });

            try {
                // Insert the edit into the 'edits' table
                const result = await client.query(
                    "INSERT INTO edits (document_id, user_id, change_text, change_type) VALUES ($1, $2, $3, $4) RETURNING *",
                    [document_id, user_id, newText, 'edit']  // Using 'edit' as change_type
                );
                console.log("Inserted edit into 'edits' table:", result.rows[0]);  // Debug log for successful insert

                // Update the document content in the 'documents' table
                await client.query("UPDATE documents SET content=$1 WHERE id=$2", [newText, document_id]);

                // Broadcast updated document content to all users in the document
                io.to(document_id).emit("documentUpdated", {
                    document_id,
                    newText,
                    user_id,
                });

            } catch (error) {
                console.error("Error handling editDocument:", error);
                socket.emit("error", { message: "Failed to update document." });
            }
        });

        // User leaves a document
        socket.on("leaveDocument", ({ document_id, user_id }) => {
            if (activeUsers[document_id]) {
                activeUsers[document_id].delete(user_id);
                io.to(document_id).emit("userLeft", Array.from(activeUsers[document_id]));
            }
            socket.leave(document_id);
        });

        // User disconnects
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = { setupWebSocket };
