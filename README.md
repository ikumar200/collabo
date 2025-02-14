# COLLABO
# Real-Time Collaborative Document Editing Platform

## Overview
This project is a real-time collaborative document editing platform that allows multiple users to edit a document simultaneously. The platform leverages WebSockets for real-time synchronization and a PostgreSQL database for storing documents.

## Tech Stack
- **Backend:** Node.js, Express.js, Socket.io
- **Frontend:** Quill.js (for rich text editing)
- **Database:** PostgreSQL
- **Library for PostgreSQL Integration:** `pg` (node-postgres)

## Features
- Real-time collaborative editing using WebSockets.
- Simple frontend for testing using Quill.js.
- Persistent document storage in PostgreSQL.
- Efficient synchronization of changes among multiple users.

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js (latest LTS version recommended)
- PostgreSQL

### Steps to Run the Project

1. **Clone the Repository**
   ```sh
   git clone git@github.com:ikumar200/collabo.git
   cd collabo
   ```

2. **Install Dependencies**
   ```sh
   cd backend
   npm install
   ```

3. **Configure PostgreSQL Database**
   - Create a PostgreSQL database.
   - Update the database connection details in the backend.

4. **Run the Backend Server**
   ```sh
   npm run dev
   ```

5. **Open the Frontend**
   - Open `index.html` in a browser to test real-time editing.

## How It Works
1. Users connect to the document through a WebSocket connection.
2. Edits are transmitted to all connected users in real-time.
3. Changes are stored in PostgreSQL for persistence.

## Future Enhancements
- User authentication and access control.
- Version history and rollback functionality.
- Richer document formatting options.
- Improved UI/UX for better usability.

## License
This project is open-source and available under the [ISC](LICENSE).

