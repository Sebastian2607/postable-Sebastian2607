import { pool } from "../src/lib/db.js";

export async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(25) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email VARCHAR(50) UNIQUE,
        firstName VARCHAR(35),
        lastName VARCHAR(35),
        role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        userId INT NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
        username VARCHAR(25) NOT NULL,
	      likesCount INT NOT NULL DEFAULT 0
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        postId INT NOT NULL REFERENCES posts(id),
        userId INT NOT NULL REFERENCES users(id),
        createdAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    console.log("Tablas creadas exitosamente.");
  } catch (error) {
    console.log("Error creando tablas:", error);
  } finally {
    process.exit();
  }
}

createTables();