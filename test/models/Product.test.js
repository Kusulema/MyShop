const { Sequelize, DataTypes } = require('sequelize');
const ProductModel = require('../../models/Product');

describe('Product Model', () => {
  let sequelize;
  let Product;

  beforeEach(async () => {
    // Use an in-memory SQLite database for testing
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Product = ProductModel(sequelize);
    await Product.sync({ force: true }); // Create table for each test
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should define the Product model correctly', () => {
    expect(Product).toBeDefined();
    expect(Product.getAttributes().id).toBeDefined();
    expect(Product.getAttributes().name).toBeDefined();
    expect(Product.getAttributes().desc).toBeDefined();
    expect(Product.getAttributes().style).toBeDefined();
    expect(Product.getAttributes().price).toBeDefined();
    expect(Product.getAttributes().pic).toBeDefined();
  });

  it('should create a new product', async () => {
    const product = await Product.create({
      name: 'Test Product',
      desc: 'Test Description',
      style: 'Test Style',
      price: 100.00,
      pic: '/img/test.png',
    });
    expect(product.id).toBeDefined();
    expect(product.name).toBe('Test Product');
  });

  it('should not allow null for name', async () => {
    await expect(Product.create({
      desc: 'Test Description',
      style: 'Test Style',
      price: 100.00,
      pic: '/img/test.png',
    })).rejects.toThrow();
  });

  it('should have a default style of Unspecified', async () => {
    const product = await Product.create({
      name: 'Product with no style',
      desc: 'Test Description',
      price: 50.00,
      pic: '/img/nostyle.png',
    });
    expect(product.style).toBe('Unspecified');
  });

  it('should have a default price of 0', async () => {
    const product = await Product.create({
      name: 'Product with no price',
      desc: 'Test Description',
      pic: '/img/noprice.png',
    });
    expect(parseFloat(product.price)).toBe(0); // Sequelize returns string for DECIMAL
  });
});
