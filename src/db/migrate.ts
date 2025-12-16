import { sqlite } from "./index";
import { wishes } from "./schema";
import { sql } from "drizzle-orm";

// Drop table if exists (be careful with this in production!)
sqlite.exec(`DROP TABLE IF EXISTS wishes`);

// Create the wishes table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT,
    recipient TEXT NOT NULL,
    fulfilled INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER
  )
`);

console.log("Database migrated successfully!");