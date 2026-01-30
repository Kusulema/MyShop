const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../routes/api');

// Mock authentication middleware for testing routes
jest.mock('../../middleware/auth', () => ({
  requireAdmin: jest.fn((req, res, next) => {
    // Simulate admin user for protected routes
    req.session = { user: { id: 1, rule: 'admin' } };
    next();
  }),
}));

// Mock productApiController
jest.mock('../../controllers/productApiController', () => ({
  list: jest.fn((req, res) => res.json([])),
  getOne: jest.fn((req, res) => res.json({ id: req.params.id })),
  create: jest.fn((req, res) => res.status(201).json(req.body)),
  update: jest.fn((req, res) => res.json({ id: req.params.id, ...req.body })),
  remove: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api', apiRoutes);

describe('API Routes', () => {
  it('GET /api/products should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('GET /api/products/:id should return a single product', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '1' });
  });

  it('POST /api/products should create a new product', async () => {
    const newProduct = { name: 'New Product', price: 99.99 };
    const response = await request(app).post('/api/products').send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(newProduct);
  });

  it('PUT /api/products/:id should update a product', async () => {
    const updatedProduct = { name: 'Updated Product', price: 199.99 };
    const response = await request(app).put('/api/products/1').send(updatedProduct);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: '1', ...updatedProduct });
  });

  it('DELETE /api/products/:id should delete a product', async () => {
    const response = await request(app).delete('/api/products/1');
    expect(response.statusCode).toBe(204);
  });
});
