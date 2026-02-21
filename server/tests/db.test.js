'use strict';

const { db, genId } = require('../db');

describe('db module', () => {
  describe('genId', () => {
    it('returns a number', () => {
      const id = genId();
      expect(typeof id).toBe('number');
    });

    it('generates unique ids on each call', () => {
      const id1 = genId();
      const id2 = genId();
      expect(id1).not.toBe(id2);
    });

    it('generates incrementing ids', () => {
      const id1 = genId();
      const id2 = genId();
      expect(id2).toBeGreaterThan(id1);
    });
  });

  describe('initial collections', () => {
    it('has a users array with initial records', () => {
      expect(Array.isArray(db.users)).toBe(true);
      expect(db.users.length).toBeGreaterThan(0);
      const [u] = db.users;
      expect(u).toHaveProperty('id');
      expect(u).toHaveProperty('name');
      expect(u).toHaveProperty('email');
      expect(u).toHaveProperty('role');
    });

    it('has a profiles array with initial records', () => {
      expect(Array.isArray(db.profiles)).toBe(true);
      expect(db.profiles.length).toBeGreaterThan(0);
      const [p] = db.profiles;
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('userId');
    });

    it('has a roles array with initial records', () => {
      expect(Array.isArray(db.roles)).toBe(true);
      expect(db.roles.length).toBeGreaterThan(0);
      const [r] = db.roles;
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('name');
      expect(Array.isArray(r.permissions)).toBe(true);
    });

    it('has an articles array with initial records', () => {
      expect(Array.isArray(db.articles)).toBe(true);
      expect(db.articles.length).toBeGreaterThan(0);
      const [a] = db.articles;
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('authorId');
    });

    it('has a comments array with initial records', () => {
      expect(Array.isArray(db.comments)).toBe(true);
      expect(db.comments.length).toBeGreaterThan(0);
      const [c] = db.comments;
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('articleId');
      expect(c).toHaveProperty('body');
    });

    it('has a tags array with initial records', () => {
      expect(Array.isArray(db.tags)).toBe(true);
      expect(db.tags.length).toBeGreaterThan(0);
      const [t] = db.tags;
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('slug');
    });

    it('has a products array with initial records', () => {
      expect(Array.isArray(db.products)).toBe(true);
      expect(db.products.length).toBeGreaterThan(0);
      const [p] = db.products;
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('price');
    });

    it('has a categories array with initial records', () => {
      expect(Array.isArray(db.categories)).toBe(true);
      expect(db.categories.length).toBeGreaterThan(0);
      const [c] = db.categories;
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
    });

    it('has an orders array with initial records', () => {
      expect(Array.isArray(db.orders)).toBe(true);
      expect(db.orders.length).toBeGreaterThan(0);
      const [o] = db.orders;
      expect(o).toHaveProperty('id');
      expect(o).toHaveProperty('userId');
      expect(Array.isArray(o.productIds)).toBe(true);
      expect(o).toHaveProperty('total');
      expect(o).toHaveProperty('status');
    });
  });
});
