import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const wishes = sqliteTable("wishes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  author: text("author"),
  recipient: text("recipient").notNull(),
  fulfilled: integer("fufilled").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
});