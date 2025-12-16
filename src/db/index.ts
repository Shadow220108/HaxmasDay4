import "dotenv/config"
import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite"

export const db = drizzle(process.env.DB_FILE_NAME!)
export const sqlite = new Database("wishes.db");