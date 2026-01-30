const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../../models/User');

describe('User Model', () => {
  let sequelize;
  let User;

  beforeEach(async () => {
    // Use an in-memory SQLite database for testing
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User = UserModel(sequelize);
    await User.sync({ force: true }); // Create table for each test
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should define the User model correctly', () => {
    expect(User).toBeDefined();
    expect(User.getAttributes().id).toBeDefined();
    expect(User.getAttributes().name).toBeDefined();
    expect(User.getAttributes().email).toBeDefined();
    expect(User.getAttributes().password).toBeDefined();
    expect(User.getAttributes().rule).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      rule: 'user',
    });
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should not allow null for name', async () => {
    await expect(User.create({
      email: 'no_name@example.com',
      password: 'password',
    })).rejects.toThrow();
  });

  it('should not allow duplicate emails', async () => {
    await User.create({
      name: 'User One',
      email: 'duplicate@example.com',
      password: 'password1',
    });
    await expect(User.create({
      name: 'User Two',
      email: 'duplicate@example.com',
      password: 'password2',
    })).rejects.toThrow();
  });

  it('should have a default rule of user', async () => {
    const user = await User.create({
      name: 'Default Rule User',
      email: 'default@example.com',
      password: 'password',
    });
    expect(user.rule).toBe('user');
  });
});
