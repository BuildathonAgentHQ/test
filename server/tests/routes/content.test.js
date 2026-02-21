'use strict';

const request = require('supertest');
const express = require('express');
const contentRouter = require('../../routes/content');
const { db } = require('../../db');

const app = express();
app.use(express.json());
app.use('/api/content', contentRouter);

const initialState = {
  articles: JSON.parse(JSON.stringify(db.articles)),
  comments: JSON.parse(JSON.stringify(db.comments)),
  tags: JSON.parse(JSON.stringify(db.tags)),
};

beforeEach(() => {
  db.articles = JSON.parse(JSON.stringify(initialState.articles));
  db.comments = JSON.parse(JSON.stringify(initialState.comments));
  db.tags = JSON.parse(JSON.stringify(initialState.tags));
});

// ─────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────

describe('GET /api/content/articles', () => {
  it('returns 200 with an array of all articles', async () => {
    const res = await request(app).get('/api/content/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.articles.length);
  });
});

describe('GET /api/content/articles/:id', () => {
  it('returns 200 with the article when found', async () => {
    const res = await request(app).get('/api/content/articles/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: 'Getting Started with Node.js' });
  });

  it('returns 404 when article does not exist', async () => {
    const res = await request(app).get('/api/content/articles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Article not found' });
  });
});

describe('POST /api/content/articles', () => {
  it('creates a new article and returns 201', async () => {
    const payload = { title: 'New Article', body: 'Body text', authorId: 1, tagIds: [1] };
    const res = await request(app).post('/api/content/articles').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'New Article', body: 'Body text', authorId: 1 });
    expect(typeof res.body.id).toBe('number');
    expect(res.body.publishedAt).toBeDefined();
    expect(db.articles.length).toBe(initialState.articles.length + 1);
  });

  it('defaults tagIds to empty array when omitted', async () => {
    const payload = { title: 'No Tags', body: 'Some body', authorId: 2 };
    const res = await request(app).post('/api/content/articles').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.tagIds).toEqual([]);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/content/articles').send({ body: 'B', authorId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title, body, and authorId are required' });
  });

  it('returns 400 when body is missing', async () => {
    const res = await request(app).post('/api/content/articles').send({ title: 'T', authorId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title, body, and authorId are required' });
  });

  it('returns 400 when authorId is missing', async () => {
    const res = await request(app).post('/api/content/articles').send({ title: 'T', body: 'B' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title, body, and authorId are required' });
  });
});

describe('PUT /api/content/articles/:id', () => {
  it('updates an existing article and returns 200', async () => {
    const res = await request(app).put('/api/content/articles/1').send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: 'Updated Title' });
  });

  it('preserves the id and unchanged fields', async () => {
    const res = await request(app).put('/api/content/articles/1').send({ body: 'New body' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Getting Started with Node.js');
    expect(res.body.body).toBe('New body');
  });

  it('returns 404 when article does not exist', async () => {
    const res = await request(app).put('/api/content/articles/9999').send({ title: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Article not found' });
  });
});

describe('DELETE /api/content/articles/:id', () => {
  it('deletes an article and returns the deleted record', async () => {
    const res = await request(app).delete('/api/content/articles/1');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 1 });
    expect(db.articles.find((a) => a.id === 1)).toBeUndefined();
  });

  it('returns 404 when article does not exist', async () => {
    const res = await request(app).delete('/api/content/articles/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Article not found' });
  });
});

// ─────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────

describe('GET /api/content/comments', () => {
  it('returns 200 with all comments', async () => {
    const res = await request(app).get('/api/content/comments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.comments.length);
  });
});

describe('GET /api/content/comments/:id', () => {
  it('returns 200 with the comment when found', async () => {
    const res = await request(app).get('/api/content/comments/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, body: 'Great article!' });
  });

  it('returns 404 when comment does not exist', async () => {
    const res = await request(app).get('/api/content/comments/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Comment not found' });
  });
});

describe('POST /api/content/comments', () => {
  it('creates a new comment and returns 201', async () => {
    const payload = { articleId: 1, authorId: 2, body: 'Nice post!' };
    const res = await request(app).post('/api/content/comments').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ articleId: 1, authorId: 2, body: 'Nice post!' });
    expect(typeof res.body.id).toBe('number');
    expect(db.comments.length).toBe(initialState.comments.length + 1);
  });

  it('returns 400 when articleId is missing', async () => {
    const res = await request(app).post('/api/content/comments').send({ authorId: 1, body: 'text' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'articleId, authorId, and body are required' });
  });

  it('returns 400 when authorId is missing', async () => {
    const res = await request(app).post('/api/content/comments').send({ articleId: 1, body: 'text' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'articleId, authorId, and body are required' });
  });

  it('returns 400 when body is missing', async () => {
    const res = await request(app).post('/api/content/comments').send({ articleId: 1, authorId: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'articleId, authorId, and body are required' });
  });
});

describe('PUT /api/content/comments/:id', () => {
  it('updates a comment and returns 200', async () => {
    const res = await request(app).put('/api/content/comments/1').send({ body: 'Updated comment' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, body: 'Updated comment' });
  });

  it('returns 404 when comment does not exist', async () => {
    const res = await request(app).put('/api/content/comments/9999').send({ body: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Comment not found' });
  });
});

describe('DELETE /api/content/comments/:id', () => {
  it('deletes a comment and returns the deleted record', async () => {
    const res = await request(app).delete('/api/content/comments/2');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 2 });
    expect(db.comments.find((c) => c.id === 2)).toBeUndefined();
  });

  it('returns 404 when comment does not exist', async () => {
    const res = await request(app).delete('/api/content/comments/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Comment not found' });
  });
});

// ─────────────────────────────────────────────
// TAGS
// ─────────────────────────────────────────────

describe('GET /api/content/tags', () => {
  it('returns 200 with all tags', async () => {
    const res = await request(app).get('/api/content/tags');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(initialState.tags.length);
  });
});

describe('GET /api/content/tags/:id', () => {
  it('returns 200 with the tag when found', async () => {
    const res = await request(app).get('/api/content/tags/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'nodejs', slug: 'nodejs' });
  });

  it('returns 404 when tag does not exist', async () => {
    const res = await request(app).get('/api/content/tags/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Tag not found' });
  });
});

describe('POST /api/content/tags', () => {
  it('creates a new tag and returns 201', async () => {
    const payload = { name: 'typescript', slug: 'typescript' };
    const res = await request(app).post('/api/content/tags').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'typescript', slug: 'typescript' });
    expect(typeof res.body.id).toBe('number');
    expect(db.tags.length).toBe(initialState.tags.length + 1);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/content/tags').send({ slug: 'only-slug' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name and slug are required' });
  });

  it('returns 400 when slug is missing', async () => {
    const res = await request(app).post('/api/content/tags').send({ name: 'only-name' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name and slug are required' });
  });

  it('returns 409 when slug already exists', async () => {
    const res = await request(app).post('/api/content/tags').send({ name: 'Node JS', slug: 'nodejs' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Tag slug already exists' });
  });
});

describe('PUT /api/content/tags/:id', () => {
  it('updates a tag and returns 200', async () => {
    const res = await request(app).put('/api/content/tags/1').send({ name: 'Node.js' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Node.js' });
  });

  it('returns 404 when tag does not exist', async () => {
    const res = await request(app).put('/api/content/tags/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Tag not found' });
  });
});

describe('DELETE /api/content/tags/:id', () => {
  it('deletes a tag and returns the deleted record', async () => {
    const res = await request(app).delete('/api/content/tags/3');
    expect(res.status).toBe(200);
    expect(res.body.deleted).toMatchObject({ id: 3, slug: 'javascript' });
    expect(db.tags.find((t) => t.id === 3)).toBeUndefined();
  });

  it('returns 404 when tag does not exist', async () => {
    const res = await request(app).delete('/api/content/tags/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Tag not found' });
  });
});
