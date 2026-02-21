/**
 * Users Router
 * Modules: users, profiles, roles
 *
 * users    → /api/users/users
 * profiles → /api/users/profiles
 * roles    → /api/users/roles
 */

const { Router } = require("express");
const { db, genId } = require("../db");

const router = Router();

// ─────────────────────────────────────────────
// MODULE: users
// ─────────────────────────────────────────────

// GET /api/users/users – list all users
router.get("/users", (_req, res) => {
  res.json(db.users);
});

// GET /api/users/users/:id – get a single user
router.get("/users/:id", (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /api/users/users – create a user
router.post("/users", (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });
  const user = { id: genId(), name, email, role: role ?? "user", createdAt: new Date().toISOString().split("T")[0] };
  db.users.push(user);
  res.status(201).json(user);
});

// PUT /api/users/users/:id – update a user
router.put("/users/:id", (req, res) => {
  const idx = db.users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  db.users[idx] = { ...db.users[idx], ...req.body, id: db.users[idx].id };
  res.json(db.users[idx]);
});

// DELETE /api/users/users/:id – delete a user
router.delete("/users/:id", (req, res) => {
  const idx = db.users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const [deleted] = db.users.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: profiles
// ─────────────────────────────────────────────

// GET /api/users/profiles – list all profiles
router.get("/profiles", (_req, res) => {
  res.json(db.profiles);
});

// GET /api/users/profiles/:id – get a single profile
router.get("/profiles/:id", (req, res) => {
  const profile = db.profiles.find((p) => p.id === Number(req.params.id));
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json(profile);
});

// POST /api/users/profiles – create a profile
router.post("/profiles", (req, res) => {
  const { userId, bio, avatar, location } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const profile = { id: genId(), userId: Number(userId), bio: bio ?? "", avatar: avatar ?? "", location: location ?? "" };
  db.profiles.push(profile);
  res.status(201).json(profile);
});

// PUT /api/users/profiles/:id – update a profile
router.put("/profiles/:id", (req, res) => {
  const idx = db.profiles.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Profile not found" });
  db.profiles[idx] = { ...db.profiles[idx], ...req.body, id: db.profiles[idx].id };
  res.json(db.profiles[idx]);
});

// DELETE /api/users/profiles/:id – delete a profile
router.delete("/profiles/:id", (req, res) => {
  const idx = db.profiles.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Profile not found" });
  const [deleted] = db.profiles.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: roles
// ─────────────────────────────────────────────

// GET /api/users/roles – list all roles
router.get("/roles", (_req, res) => {
  res.json(db.roles);
});

// GET /api/users/roles/:id – get a single role
router.get("/roles/:id", (req, res) => {
  const role = db.roles.find((r) => r.id === Number(req.params.id));
  if (!role) return res.status(404).json({ error: "Role not found" });
  res.json(role);
});

// POST /api/users/roles – create a role
router.post("/roles", (req, res) => {
  const { name, permissions } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const role = { id: genId(), name, permissions: permissions ?? [] };
  db.roles.push(role);
  res.status(201).json(role);
});

// PUT /api/users/roles/:id – update a role
router.put("/roles/:id", (req, res) => {
  const idx = db.roles.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Role not found" });
  db.roles[idx] = { ...db.roles[idx], ...req.body, id: db.roles[idx].id };
  res.json(db.roles[idx]);
});

// DELETE /api/users/roles/:id – delete a role
router.delete("/roles/:id", (req, res) => {
  const idx = db.roles.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Role not found" });
  const [deleted] = db.roles.splice(idx, 1);
  res.json({ deleted });
});

module.exports = router;
