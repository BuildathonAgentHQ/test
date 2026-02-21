/**
 * Content Router
 * Modules: articles, comments, tags
 *
 * articles → /api/content/articles
 * comments → /api/content/comments
 * tags     → /api/content/tags
 */

const { Router } = require("express");
const { db, genId } = require("../db");

const router = Router();

// ─────────────────────────────────────────────
// MODULE: articles
// ─────────────────────────────────────────────

// GET /api/content/articles – list all articles
router.get("/articles", (_req, res) => {
  res.json(db.articles);
});

// GET /api/content/articles/:id – get a single article
router.get("/articles/:id", (req, res) => {
  const article = db.articles.find((a) => a.id === Number(req.params.id));
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json(article);
});

// POST /api/content/articles – create an article
router.post("/articles", (req, res) => {
  const { title, body, authorId, tagIds } = req.body;
  if (!title || !body || !authorId) return res.status(400).json({ error: "title, body, and authorId are required" });
  const article = {
    id: genId(),
    title,
    body,
    authorId: Number(authorId),
    tagIds: tagIds ?? [],
    publishedAt: new Date().toISOString().split("T")[0],
  };
  db.articles.push(article);
  res.status(201).json(article);
});

// PUT /api/content/articles/:id – update an article
router.put("/articles/:id", (req, res) => {
  const idx = db.articles.findIndex((a) => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Article not found" });
  db.articles[idx] = { ...db.articles[idx], ...req.body, id: db.articles[idx].id };
  res.json(db.articles[idx]);
});

// DELETE /api/content/articles/:id – delete an article
router.delete("/articles/:id", (req, res) => {
  const idx = db.articles.findIndex((a) => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Article not found" });
  const [deleted] = db.articles.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: comments
// ─────────────────────────────────────────────

// GET /api/content/comments – list all comments
router.get("/comments", (_req, res) => {
  res.json(db.comments);
});

// GET /api/content/comments/:id – get a single comment
router.get("/comments/:id", (req, res) => {
  const comment = db.comments.find((c) => c.id === Number(req.params.id));
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  res.json(comment);
});

// POST /api/content/comments – create a comment
router.post("/comments", (req, res) => {
  const { articleId, authorId, body } = req.body;
  if (!articleId || !authorId || !body) return res.status(400).json({ error: "articleId, authorId, and body are required" });
  const comment = {
    id: genId(),
    articleId: Number(articleId),
    authorId: Number(authorId),
    body,
    createdAt: new Date().toISOString().split("T")[0],
  };
  db.comments.push(comment);
  res.status(201).json(comment);
});

// PUT /api/content/comments/:id – update a comment
router.put("/comments/:id", (req, res) => {
  const idx = db.comments.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Comment not found" });
  db.comments[idx] = { ...db.comments[idx], ...req.body, id: db.comments[idx].id };
  res.json(db.comments[idx]);
});

// DELETE /api/content/comments/:id – delete a comment
router.delete("/comments/:id", (req, res) => {
  const idx = db.comments.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Comment not found" });
  const [deleted] = db.comments.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: tags
// ─────────────────────────────────────────────

// GET /api/content/tags – list all tags
router.get("/tags", (_req, res) => {
  res.json(db.tags);
});

// GET /api/content/tags/:id – get a single tag
router.get("/tags/:id", (req, res) => {
  const tag = db.tags.find((t) => t.id === Number(req.params.id));
  if (!tag) return res.status(404).json({ error: "Tag not found" });
  res.json(tag);
});

// POST /api/content/tags – create a tag
router.post("/tags", (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
  if (db.tags.find((t) => t.slug === slug)) return res.status(409).json({ error: "Tag slug already exists" });
  const tag = { id: genId(), name, slug };
  db.tags.push(tag);
  res.status(201).json(tag);
});

// PUT /api/content/tags/:id – update a tag
router.put("/tags/:id", (req, res) => {
  const idx = db.tags.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Tag not found" });
  db.tags[idx] = { ...db.tags[idx], ...req.body, id: db.tags[idx].id };
  res.json(db.tags[idx]);
});

// DELETE /api/content/tags/:id – delete a tag
router.delete("/tags/:id", (req, res) => {
  const idx = db.tags.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Tag not found" });
  const [deleted] = db.tags.splice(idx, 1);
  res.json({ deleted });
});

module.exports = router;
