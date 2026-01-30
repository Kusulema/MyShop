const request = require('supertest');
const express = require('express');
const webRoutes = require('../../routes/web');
const session = require('express-session');

// Mock authentication middleware for testing routes
jest.mock('../../middleware/auth', () => ({
  requireAuth: jest.fn((req, res, next) => {
    req.session.user = { id: 1, rule: 'user' }; // Simulate authenticated user
    next();
  }),
  requireAdmin: jest.fn((req, res, next) => {
    req.session.user = { id: 1, rule: 'admin' }; // Simulate admin user
    next();
  }),
}));

// Mock controllers
jest.mock('../../controllers/authController', () => ({
  getLogin: jest.fn((req, res) => res.status(200).send('rendered_view:login')),
  postLogin: jest.fn((req, res) => res.redirect('/')),
  postLogout: jest.fn((req, res) => res.redirect('/login')),
}));

jest.mock('../../controllers/productController', () => ({
  listPage: jest.fn((req, res) => res.status(200).send('rendered_view:index')),
  newForm: jest.fn((req, res) => res.status(200).send('rendered_view:product_form')),
  create: jest.fn((req, res) => res.redirect('/')),
  editForm: jest.fn((req, res) => res.status(200).send('rendered_view:product_form')),
  update: jest.fn((req, res) => res.redirect('/')),
  remove: jest.fn((req, res) => res.redirect('/')),
}));

const app = express();
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(session({ secret: 'test_secret', resave: false, saveUninitialized: false }));
// app.set('view engine', 'ejs'); // No need to set view engine if we're mocking res.render with res.send
// app.set('views', 'views'); // No need to set views directory
app.use('/', webRoutes);

describe('Web Routes', () => {
  it('GET / should render the index page', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('rendered_view:index'); // Check if the index view was rendered
  });

  it('GET /login should render the login page', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('rendered_view:login'); // Check if the login view was rendered
  });

  it('POST /login should redirect to / on successful login', async () => {
    const response = await request(app).post('/login').send({ email: 'test@example.com', password: 'password' });
    expect(response.statusCode).toBe(302); // Redirect status
    expect(response.headers.location).toBe('/');
  });

  it('POST /logout should redirect to /login on logout', async () => {
    const response = await request(app).post('/logout');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  it('GET /products/new should render the product form for new product (admin)', async () => {
    const response = await request(app).get('/products/new');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('product_form');
  });

  it('POST /products should create a new product and redirect (admin)', async () => {
    const response = await request(app).post('/products').send({ name: 'New Web Product' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  it('GET /products/:id/edit should render the product form for editing (admin)', async () => {
    const response = await request(app).get('/products/1/edit');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('product_form');
  });

  it('POST /products/:id should update a product and redirect (admin)', async () => {
    const response = await request(app).post('/products/1').send({ name: 'Updated Web Product' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  it('POST /products/:id/delete should delete a product and redirect (admin)', async () => {
    const response = await request(app).post('/products/1/delete');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });
});
