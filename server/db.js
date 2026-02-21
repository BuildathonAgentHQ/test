// In-memory data store for all modules
let nextId = 1;
const genId = () => nextId++;

const db = {
  // --- users module ---
  users: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", createdAt: "2024-01-01" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", createdAt: "2024-01-02" },
  ],

  // --- profiles module ---
  profiles: [
    { id: 1, userId: 1, bio: "Full-stack developer", avatar: "https://i.pravatar.cc/150?img=1", location: "NYC" },
    { id: 2, userId: 2, bio: "Frontend enthusiast", avatar: "https://i.pravatar.cc/150?img=2", location: "LA" },
  ],

  // --- roles module ---
  roles: [
    { id: 1, name: "admin", permissions: ["read", "write", "delete"] },
    { id: 2, name: "user", permissions: ["read"] },
    { id: 3, name: "editor", permissions: ["read", "write"] },
  ],

  // --- articles module ---
  articles: [
    { id: 1, title: "Getting Started with Node.js", body: "Node.js is a runtime...", authorId: 1, tagIds: [1, 2], publishedAt: "2024-02-01" },
    { id: 2, title: "REST API Best Practices", body: "When designing REST APIs...", authorId: 2, tagIds: [2], publishedAt: "2024-02-10" },
  ],

  // --- comments module ---
  comments: [
    { id: 1, articleId: 1, authorId: 2, body: "Great article!", createdAt: "2024-02-02" },
    { id: 2, articleId: 2, authorId: 1, body: "Very helpful, thanks.", createdAt: "2024-02-11" },
  ],

  // --- tags module ---
  tags: [
    { id: 1, name: "nodejs", slug: "nodejs" },
    { id: 2, name: "api", slug: "api" },
    { id: 3, name: "javascript", slug: "javascript" },
  ],

  // --- products module ---
  products: [
    { id: 1, name: "Wireless Mouse", price: 29.99, categoryId: 1, stock: 150 },
    { id: 2, name: "Mechanical Keyboard", price: 89.99, categoryId: 1, stock: 75 },
  ],

  // --- categories module ---
  categories: [
    { id: 1, name: "Electronics", description: "Electronic devices and accessories" },
    { id: 2, name: "Books", description: "Physical and digital books" },
    { id: 3, name: "Clothing", description: "Apparel and accessories" },
  ],

  // --- orders module ---
  orders: [
    { id: 1, userId: 1, productIds: [1], total: 29.99, status: "delivered", createdAt: "2024-03-01" },
    { id: 2, userId: 2, productIds: [1, 2], total: 119.98, status: "pending", createdAt: "2024-03-05" },
  ],
};

// Initialize nextId above the max existing id across all collections
nextId = Math.max(...Object.values(db).flat().map((r) => r.id ?? 0)) + 1;

module.exports = { db, genId };
