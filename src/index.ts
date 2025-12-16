import { Hono } from 'hono'
import {
  fulfillWishes,
  addWishes,
  deleteWishes,
  getAllWishes,
  getRandomWish,
} from "./db/queries";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get("/api/wishes", (c) => {
  const wishes = getAllWishes();
  return c.json(wishes);
});

app.post("/api/wishes", async (c) => {
  const body = await c.req.json().catch(() => null);
  const item = (body?.item ?? "").toString().trim();
  const recipient = (body?.recipient ?? "").toString().trim();
  const author = body?.author ? body.author.toString().trim() : undefined;

  if (!item) return c.json({ error: "item is required" }, 400);
  if (!recipient) return c.json({ error: "recipient is required" }, 400);

  const result = addWishes(item, recipient, author);
  return c.json(result, 201);
});

app.get("/api/wishes/random", (c) => {
  const wish = getRandomWish();
  if (!wish) return c.json({ error: "no pending wishes" }, 404);
  return c.json(wish);
});

app.patch("/api/wishes/:id/fulfill", (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400);

  const result = fulfillWishes(id);
  if (result.changes === 0) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true });
});

app.delete("/api/wishes/:id", (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400);

  const result = deleteWishes(id);
  if (result.changes === 0) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true });
});

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}