'use strict';

const request = require('supertest');
const express = require('express');
const shopRouter = require('../../routes/shop');
const { db } = require('../../db');

const app = express();
app.use(express.json());
app.use('/api/shop', shopRouter);

const initialState = {
  products: JSON.parse(JSON.stringify(db.products)),
  categories: JSON.parse(JSON.stringify(db.categories)),
  orders: JSON.parse(JSON.stringify(db.orders)),
};

beforeEach(() => {
  db.products = JSON.parse(JSON.stringify(initialState.products));
  db.categories = JSON.parse(JSON.stringify(initialState.categories));
  db.orders = JSON.parse(JSON.stringify(initialState.orders));
});

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

describe('GET /api/shop/products', () => {
  it('returns 200 with an array of all products', async () => {
    const res = await request(app).get('/api/shop/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.products.length);
  });
});

describe('GET /api/shop/products/:id', () => {
  it('returns 200 with the product when found', async () => {
    const res = await request(app).get('/api/shop/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Wireless Mouse', price: 29.99 });
  });

  it('returns 404 when product does not exist', async () => {
    const res = await request(app).get('/api/shop/products/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });
});

describe('POST /api/shop/products', () => {
  it('creates a new product and returns 201', async () => {
    const payload = { name: 'USB Hub', price: 19.99, categoryId: 1, stock: 50 };
    const res = await request(app).post('/api/shop/products').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'USB Hub', price: 19.99, categoryId: 1, stock: 50 });
    expect(typeof res.body.id).toBe('number');
    expect(db.products.length).toBe(initialState.products.length + 1);
  });

  it('defaults stock to 0 when not provided', async () => {
    const payload = { name: 'Monitor', price: 299.99, categoryId: 1 };
    const res = await request(app).post('/api/shop/products').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.stock).toBe(0);
  });

  it('coerces price and categoryId to numbers', async () => {
    const payload = { name: 'Adapter', price: '9.99', categoryId: '1', stock: '10' };
    const res = await request(app).post('/api/shop/products').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.price).toBe(9.99);
    expect(res.body.categoryId).toBe(1);
    expect(res.body.stock).toBe(10);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/shop/products').send({ price: 10, categoryId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name, price, and categoryId are required' });
  });

  it('returns 400 when price is missing', async () => {
    const res = await request(app).post('/api/shop/products').send({ name: 'X', categoryId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name, price, and categoryId are required' });
  });

  it('returns 400 when categoryId is missing', async () => {
    const res = await request(app).post('/api/shop/products').send({ name: 'X', price: 10 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name, price, and categoryId are required' });
  });
});

describe('PUT /api/shop/products/:id', () => {
  it('updates a product and returns 200', async () => {
    const res = await request(app).put('/api/shop/products/1').send({ price: 24.99 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, price: 24.99 });
  });

  it('coerces numeric fields on update', async () => {
    const res = await request(app).put('/api/shop/products/1').send({ stock: '200', price: '19.99', categoryId: '2' });
    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(200);
    expect(res.body.price).toBe(19.99);
    expect(res.body.categoryId).toBe(2);
  });

  it('preserves the id on update', async () => {
    const res = await request(app).put('/api/shop/products/1').send({ name: 'Updated Mouse' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('returns 404 when product does not exist', async () => {
    const res = await request(app).put('/api/shop/products/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });
});

describe('DELETE /api/shop/products/:id', () => {
  it('deletes a product and returns the deleted record', async () => {
    const res = await request(app).delete('/api/shop/products/2');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 2 });
    expect(db.products.find((p) => p.id === 2)).toBeUndefined();
  });

  it('returns 404 when product does not exist', async () => {
    const res = await request(app).delete('/api/shop/products/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });
});

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

describe('GET /api/shop/categories', () => {
  it('returns 200 with all categories', async () => {
    const res = await request(app).get('/api/shop/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.categories.length);
  });
});

describe('GET /api/shop/categories/:id', () => {
  it('returns 200 with the category when found', async () => {
    const res = await request(app).get('/api/shop/categories/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Electronics' });
  });

  it('returns 404 when category does not exist', async () => {
    const res = await request(app).get('/api/shop/categories/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });
});

describe('POST /api/shop/categories', () => {
  it('creates a new category and returns 201', async () => {
    const payload = { name: 'Sports', description: 'Sporting goods' };
    const res = await request(app).post('/api/shop/categories').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Sports', description: 'Sporting goods' });
    expect(typeof res.body.id).toBe('number');
    expect(db.categories.length).toBe(initialState.categories.length + 1);
  });

  it('defaults description to empty string when omitted', async () => {
    const res = await request(app).post('/api/shop/categories').send({ name: 'Misc' });
    expect(res.status).toBe(201);
    expect(res.body.description).toBe('');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/shop/categories').send({ description: 'No name' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });
});

describe('PUT /api/shop/categories/:id', () => {
  it('updates a category and returns 200', async () => {
    const res = await request(app).put('/api/shop/categories/1').send({ description: 'Updated description' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, description: 'Updated description' });
  });

  it('returns 404 when category does not exist', async () => {
    const res = await request(app).put('/api/shop/categories/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });
});

describe('DELETE /api/shop/categories/:id', () => {
  it('deletes a category and returns the deleted record', async () => {
    const res = await request(app).delete('/api/shop/categories/3');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 3, name: 'Clothing' });
    expect(db.categories.find((c) => c.id === 3)).toBeUndefined();
  });

  it('returns 404 when category does not exist', async () => {
    const res = await request(app).delete('/api/shop/categories/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Category not found' });
  });
});

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

describe('GET /api/shop/orders', () => {
  it('returns 200 with all orders', async () => {
    const res = await request(app).get('/api/shop/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.orders.length);
  });
});

describe('GET /api/shop/orders/:id', () => {
  it('returns 200 with the order when found', async () => {
    const res = await request(app).get('/api/shop/orders/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, userId: 1, total: 29.99, status: 'delivered' });
  });

  it('returns 404 when order does not exist', async () => {
    const res = await request(app).get('/api/shop/orders/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });
});

describe('POST /api/shop/orders', () => {
  it('creates a new order and returns 201', async () => {
    const payload = { userId: 1, productIds: [1, 2], total: 119.98, status: 'pending' };
    const res = await request(app).post('/api/shop/orders').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ userId: 1, productIds: [1, 2], total: 119.98, status: 'pending' });
    expect(typeof res.body.id).toBe('number');
    expect(db.orders.length).toBe(initialState.orders.length + 1);
  });

  it('defaults status to "pending" when not provided', async () => {
    const payload = { userId: 2, productIds: [1], total: 29.99 };
    const res = await request(app).post('/api/shop/orders').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  it('coerces userId, total and productIds to numbers', async () => {
    const payload = { userId: '1', productIds: ['1', '2'], total: '50.00' };
    const res = await request(app).post('/api/shop/orders').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(1);
    expect(res.body.total).toBe(50);
    expect(res.body.productIds).toEqual([1, 2]);
  });

  it('returns 400 when userId is missing', async () => {
    const res = await request(app).post('/api/shop/orders').send({ productIds: [1], total: 10 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'userId, productIds, and total are required' });
  });

  it('returns 400 when productIds is missing', async () => {
    const res = await request(app).post('/api/shop/orders').send({ userId: 1, total: 10 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'userId, productIds, and total are required' });
  });

  it('returns 400 when total is missing', async () => {
    const res = await request(app).post('/api/shop/orders').send({ userId: 1, productIds: [1] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'userId, productIds, and total are required' });
  });
});

describe('PUT /api/shop/orders/:id', () => {
  it('updates an order status and returns 200', async () => {
    const res = await request(app).put('/api/shop/orders/2').send({ status: 'shipped' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 2, status: 'shipped' });
  });

  it('coerces numeric fields and productIds on update', async () => {
    const res = await request(app).put('/api/shop/orders/1').send({ total: '39.99', productIds: ['1', '2'] });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(39.99);
    expect(res.body.productIds).toEqual([1, 2]);
  });

  it('preserves the id on update', async () => {
    const res = await request(app).put('/api/shop/orders/1').send({ status: 'returned' });
    expect(res.body.id).toBe(1);
  });

  it('returns 404 when order does not exist', async () => {
    const res = await request(app).put('/api/shop/orders/9999').send({ status: 'delivered' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });
});

describe('DELETE /api/shop/orders/:id', () => {
  it('deletes an order and returns the deleted record', async () => {
    const res = await request(app).delete('/api/shop/orders/1');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 1 });
    expect(db.orders.find((o) => o.id === 1)).toBeUndefined();
  });

  it('returns 404 when order does not exist', async () => {
    const res = await request(app).delete('/api/shop/orders/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });
});
