const express = require("express");
const http = require("http");  
const { setupWebSocket } = require("./websockets/websocket"); // Import WebSocket setup

const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const collaboratorRoutes = require("./routes/collaboratorRoutes");
const editRoutes = require("./routes/editRoutes");

const app = express();
const server = http.createServer(app); // Attach Express to HTTP server
// const io = setupWebSocket(server); // Setup WebSockets properly
setupWebSocket(server);

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/collaborators", collaboratorRoutes);
app.use("/edits", editRoutes);

// Start server
PORT=process.env.PORT||5000
server.listen(5000, () => console.log("Server running on port-",PORT));

