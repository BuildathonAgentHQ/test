'use strict';

const request = require('supertest');
const express = require('express');
const usersRouter = require('../../routes/users');
const { db } = require('../../db');

// Build a minimal express app that mounts only the users router
const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

// Snapshot the initial db state so we can restore it between tests
const initialState = {
  users: JSON.parse(JSON.stringify(db.users)),
  profiles: JSON.parse(JSON.stringify(db.profiles)),
  roles: JSON.parse(JSON.stringify(db.roles)),
};

beforeEach(() => {
  db.users = JSON.parse(JSON.stringify(initialState.users));
  db.profiles = JSON.parse(JSON.stringify(initialState.profiles));
  db.roles = JSON.parse(JSON.stringify(initialState.roles));
});

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

describe('GET /api/users/users', () => {
  it('returns 200 with an array of all users', async () => {
    const res = await request(app).get('/api/users/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.users.length);
  });
});

describe('GET /api/users/users/:id', () => {
  it('returns 200 with the user when found', async () => {
    const res = await request(app).get('/api/users/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Alice Johnson', email: 'alice@example.com' });
  });

  it('returns 404 when user does not exist', async () => {
    const res = await request(app).get('/api/users/users/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});

describe('POST /api/users/users', () => {
  it('creates a new user and returns 201', async () => {
    const payload = { name: 'Carol White', email: 'carol@example.com', role: 'editor' };
    const res = await request(app).post('/api/users/users').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Carol White', email: 'carol@example.com', role: 'editor' });
    expect(typeof res.body.id).toBe('number');
    expect(db.users.length).toBe(initialState.users.length + 1);
  });

  it('defaults role to "user" when not provided', async () => {
    const res = await request(app).post('/api/users/users').send({ name: 'Dan', email: 'dan@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('user');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/users/users').send({ email: 'x@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name and email are required' });
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/users/users').send({ name: 'NoEmail' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name and email are required' });
  });
});

describe('PUT /api/users/users/:id', () => {
  it('updates an existing user and returns 200', async () => {
    const res = await request(app).put('/api/users/users/1').send({ name: 'Alice Updated' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Alice Updated' });
  });

  it('preserves the id and other unchanged fields', async () => {
    const res = await request(app).put('/api/users/users/1').send({ role: 'editor' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.email).toBe('alice@example.com');
    expect(res.body.role).toBe('editor');
  });

  it('returns 404 when user does not exist', async () => {
    const res = await request(app).put('/api/users/users/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});

describe('DELETE /api/users/users/:id', () => {
  it('deletes a user and returns the deleted record', async () => {
    const res = await request(app).delete('/api/users/users/1');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 1 });
    expect(db.users.find((u) => u.id === 1)).toBeUndefined();
  });

  it('returns 404 when user does not exist', async () => {
    const res = await request(app).delete('/api/users/users/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});

// ─────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────

describe('GET /api/users/profiles', () => {
  it('returns 200 with all profiles', async () => {
    const res = await request(app).get('/api/users/profiles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.profiles.length);
  });
});

describe('GET /api/users/profiles/:id', () => {
  it('returns 200 with the profile when found', async () => {
    const res = await request(app).get('/api/users/profiles/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, userId: 1 });
  });

  it('returns 404 when profile does not exist', async () => {
    const res = await request(app).get('/api/users/profiles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Profile not found' });
  });
});

describe('POST /api/users/profiles', () => {
  it('creates a new profile and returns 201', async () => {
    const payload = { userId: 1, bio: 'Hello', avatar: 'http://img', location: 'NYC' };
    const res = await request(app).post('/api/users/profiles').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ userId: 1, bio: 'Hello', location: 'NYC' });
    expect(typeof res.body.id).toBe('number');
  });

  it('defaults bio, avatar, location to empty strings when omitted', async () => {
    const res = await request(app).post('/api/users/profiles').send({ userId: 2 });
    expect(res.status).toBe(201);
    expect(res.body.bio).toBe('');
    expect(res.body.avatar).toBe('');
    expect(res.body.location).toBe('');
  });

  it('returns 400 when userId is missing', async () => {
    const res = await request(app).post('/api/users/profiles').send({ bio: 'No user' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'userId is required' });
  });
});

describe('PUT /api/users/profiles/:id', () => {
  it('updates a profile and returns 200', async () => {
    const res = await request(app).put('/api/users/profiles/1').send({ bio: 'Updated bio' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, bio: 'Updated bio' });
  });

  it('returns 404 when profile does not exist', async () => {
    const res = await request(app).put('/api/users/profiles/9999').send({ bio: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Profile not found' });
  });
});

describe('DELETE /api/users/profiles/:id', () => {
  it('deletes a profile and returns the deleted record', async () => {
    const res = await request(app).delete('/api/users/profiles/1');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 1 });
    expect(db.profiles.find((p) => p.id === 1)).toBeUndefined();
  });

  it('returns 404 when profile does not exist', async () => {
    const res = await request(app).delete('/api/users/profiles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Profile not found' });
  });
});

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────

describe('GET /api/users/roles', () => {
  it('returns 200 with all roles', async () => {
    const res = await request(app).get('/api/users/roles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.roles.length);
  });
});

describe('GET /api/users/roles/:id', () => {
  it('returns 200 with the role when found', async () => {
    const res = await request(app).get('/api/users/roles/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'admin' });
  });

  it('returns 404 when role does not exist', async () => {
    const res = await request(app).get('/api/users/roles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Role not found' });
  });
});

describe('POST /api/users/roles', () => {
  it('creates a new role and returns 201', async () => {
    const payload = { name: 'viewer', permissions: ['read'] };
    const res = await request(app).post('/api/users/roles').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'viewer', permissions: ['read'] });
    expect(typeof res.body.id).toBe('number');
  });

  it('defaults permissions to empty array when omitted', async () => {
    const res = await request(app).post('/api/users/roles').send({ name: 'guest' });
    expect(res.status).toBe(201);
    expect(res.body.permissions).toEqual([]);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/users/roles').send({ permissions: ['read'] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });
});

describe('PUT /api/users/roles/:id', () => {
  it('updates a role and returns 200', async () => {
    const res = await request(app).put('/api/users/roles/2').send({ permissions: ['read', 'write', 'delete'] });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 2, permissions: ['read', 'write', 'delete'] });
  });

  it('returns 404 when role does not exist', async () => {
    const res = await request(app).put('/api/users/roles/9999').send({ name: 'ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Role not found' });
  });
});

describe('DELETE /api/users/roles/:id', () => {
  it('deletes a role and returns the deleted record', async () => {
    const res = await request(app).delete('/api/users/roles/3');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 3, name: 'editor' });
    expect(db.roles.find((r) => r.id === 3)).toBeUndefined();
  });

  it('returns 404 when role does not exist', async () => {
    const res = await request(app).delete('/api/users/roles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Role not found' });
  });
});
