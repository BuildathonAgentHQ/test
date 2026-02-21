'use strict';

const request = require('supertest');

// We require the app after setting a test port to avoid conflict with any
// running process. supertest will manage its own server binding.
const app = require('../index');


describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('includes a timestamp string', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.timestamp).toBe('string');
    expect(() => new Date(res.body.timestamp)).not.toThrow();
  });
});

describe('404 handler', () => {
  it('returns 404 with error message for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  it('returns 404 for unknown POST routes', async () => {
    const res = await request(app).post('/api/nonexistent').send({});
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });
});

describe('Router mounting', () => {
  it('mounts /api/users/users correctly', async () => {
    const res = await request(app).get('/api/users/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('mounts /api/content/articles correctly', async () => {
    const res = await request(app).get('/api/content/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('mounts /api/shop/products correctly', async () => {
    const res = await request(app).get('/api/shop/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
