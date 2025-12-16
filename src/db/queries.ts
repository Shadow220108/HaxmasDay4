import { wishes } from "./schema";
import { eq } from "drizzle-orm";
import { db, sqlite } from "./index";

export function addWishes(
  text: string,
  recipient: string,
  author?: string,
) {
  const timestamp = Math.floor(Date.now() / 1000);

  db
    .insert(wishes)
    .values({
      text,
      author,
      recipient,
      createdAt: timestamp,
    })
    .run();

  // Get the last inserted row id from the sqlite instance
  return { id: Number(sqlite.query("SELECT last_insert_rowid()").get()) };
}

export function fulfillWishes(id: number) {
  db
    .update(wishes)
    .set({ fulfilled: 1 })
    .where(eq(wishes.id, id))
    .run();

  // Get changes from sqlite instance
  const changes = sqlite.query("SELECT changes()").get() as { "changes()": number };
  return { changes: changes["changes()"] };
}

export function deleteWishes(id: number) {
  db
    .delete(wishes)
    .where(eq(wishes.id, id))
    .run();

  // Get changes from sqlite instance
  const changes = sqlite.query("SELECT changes()").get() as { "changes()": number };
  return { changes: changes["changes()"] };
}

export function updateWishes(id: number, newMessage: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  db
    .update(wishes)
    .set({ text: newMessage, updatedAt: timestamp })
    .where(eq(wishes.id, id))
    .run();

  // Get changes from sqlite instance
  const changes = sqlite.query("SELECT changes()").get() as { "changes()": number };
  return { changes: changes["changes()"] };
}

export function getWish(id: number) {
  const res = db
    .select({
      id: wishes.id,
      text: wishes.text,
      author: wishes.author,
      recipient: wishes.recipient,
      fulfilled: wishes.fulfilled,
    })
    .from(wishes)
    .where(eq(wishes.id, id))
    .all();

  if (res[0] === undefined) {
    return undefined;
  }
  return res[0];
}

export function getAllWishes() {
  const res = db
    .select({
      id: wishes.id,
      text: wishes.text,
      author: wishes.author,
      recipient: wishes.recipient,
      fulfilled: wishes.fulfilled,
      createdAt: wishes.createdAt,
    })
    .from(wishes)
    .all();

  return res;
}

export function getRandomWish() {
  const res = db
    .select({
      id: wishes.id,
      text: wishes.text,
      author: wishes.author,
      recipient: wishes.recipient,
      fulfilled: wishes.fulfilled,
    })
    .from(wishes)
    .where(eq(wishes.fulfilled, 0))
    .all();

  if (res.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * res.length);
  return res[randomIndex];
}