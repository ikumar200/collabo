const client=require("./db")
async function createTables() {
    try {
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
  
      // Documents table
      await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT DEFAULT '',
          created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
  
      // Collaborators table (User access control for documents)
      await client.query(`
        CREATE TABLE IF NOT EXISTS collaborators (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
          role TEXT CHECK (role IN ('owner', 'editor', 'viewer')),
          added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, document_id)
        );
      `);
  
      // Edits table (Storing real-time edits)
      await client.query(`
        CREATE TABLE IF NOT EXISTS edits (
          id SERIAL PRIMARY KEY,
          document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          change_text TEXT NOT NULL,
          change_type TEXT CHECK (change_type IN ('insert', 'delete', 'update')),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
  
      console.log("Tables created successfully!");
    } catch (err) {
      console.error("Error creating tables:", err);
    }
  }
  
  createTables();