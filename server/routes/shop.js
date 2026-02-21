/**
 * Shop Router
 * Modules: products, categories, orders
 *
 * products   → /api/shop/products
 * categories → /api/shop/categories
 * orders     → /api/shop/orders
 */

const { Router } = require("express");
const { db, genId } = require("../db");

const router = Router();

// ─────────────────────────────────────────────
// MODULE: products
// ─────────────────────────────────────────────

// GET /api/shop/products – list all products
router.get("/products", (_req, res) => {
  res.json(db.products);
});

// GET /api/shop/products/:id – get a single product
router.get("/products/:id", (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/shop/products – create a product
router.post("/products", (req, res) => {
  const { name, price, categoryId, stock } = req.body;
  if (!name || price == null || !categoryId) return res.status(400).json({ error: "name, price, and categoryId are required" });
  const product = {
    id: genId(),
    name,
    price: Number(price),
    categoryId: Number(categoryId),
    stock: stock != null ? Number(stock) : 0,
  };
  db.products.push(product);
  res.status(201).json(product);
});

// PUT /api/shop/products/:id – update a product
router.put("/products/:id", (req, res) => {
  const idx = db.products.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const body = { ...req.body };
  if (body.price != null) body.price = Number(body.price);
  if (body.stock != null) body.stock = Number(body.stock);
  if (body.categoryId != null) body.categoryId = Number(body.categoryId);
  db.products[idx] = { ...db.products[idx], ...body, id: db.products[idx].id };
  res.json(db.products[idx]);
});

// DELETE /api/shop/products/:id – delete a product
router.delete("/products/:id", (req, res) => {
  const idx = db.products.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const [deleted] = db.products.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: categories
// ─────────────────────────────────────────────

// GET /api/shop/categories – list all categories
router.get("/categories", (_req, res) => {
  res.json(db.categories);
});

// GET /api/shop/categories/:id – get a single category
router.get("/categories/:id", (req, res) => {
  const category = db.categories.find((c) => c.id === Number(req.params.id));
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json(category);
});

// POST /api/shop/categories – create a category
router.post("/categories", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const category = { id: genId(), name, description: description ?? "" };
  db.categories.push(category);
  res.status(201).json(category);
});

// PUT /api/shop/categories/:id – update a category
router.put("/categories/:id", (req, res) => {
  const idx = db.categories.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  db.categories[idx] = { ...db.categories[idx], ...req.body, id: db.categories[idx].id };
  res.json(db.categories[idx]);
});

// DELETE /api/shop/categories/:id – delete a category
router.delete("/categories/:id", (req, res) => {
  const idx = db.categories.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  const [deleted] = db.categories.splice(idx, 1);
  res.json({ deleted });
});

// ─────────────────────────────────────────────
// MODULE: orders
// ─────────────────────────────────────────────

// GET /api/shop/orders – list all orders
router.get("/orders", (_req, res) => {
  res.json(db.orders);
});

// GET /api/shop/orders/:id – get a single order
router.get("/orders/:id", (req, res) => {
  const order = db.orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// POST /api/shop/orders – create an order
router.post("/orders", (req, res) => {
  const { userId, productIds, total, status } = req.body;
  if (!userId || !productIds || total == null) return res.status(400).json({ error: "userId, productIds, and total are required" });
  const order = {
    id: genId(),
    userId: Number(userId),
    productIds: productIds.map(Number),
    total: Number(total),
    status: status ?? "pending",
    createdAt: new Date().toISOString().split("T")[0],
  };
  db.orders.push(order);
  res.status(201).json(order);
});

// PUT /api/shop/orders/:id – update an order
router.put("/orders/:id", (req, res) => {
  const idx = db.orders.findIndex((o) => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  const body = { ...req.body };
  if (body.total != null) body.total = Number(body.total);
  if (body.productIds) body.productIds = body.productIds.map(Number);
  db.orders[idx] = { ...db.orders[idx], ...body, id: db.orders[idx].id };
  res.json(db.orders[idx]);
});

// DELETE /api/shop/orders/:id – delete an order
router.delete("/orders/:id", (req, res) => {
  const idx = db.orders.findIndex((o) => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  const [deleted] = db.orders.splice(idx, 1);
  res.json({ deleted });
});

module.exports = router;
