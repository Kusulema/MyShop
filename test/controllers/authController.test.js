const authController = require('../../controllers/authController');

describe('authController', () => {
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // TODO: Add tests for getLogin, postLogin, postLogout methods
  // Example for postLogin:
  // it('should handle user login', async () => {
  //   const req = {
  //     body: { email: 'test@example.com', password: 'password123' },
  //     session: {},
  //   };
  //   const res = {
  //     redirect: jest.fn(),
  //     render: jest.fn(),
  //   };
  //   const next = jest.fn();

  //   // Mock User.findOne and bcrypt.compare
  //   const mockUser = { id: 1, email: 'test@example.com', rule: 'user' };
  //   jest.mock('../../models', () => ({
  //     getModels: () => ({
  //       User: {
  //         findOne: jest.fn(() => mockUser),
  //       },
  //     }),
  //   }));
  //   jest.mock('bcryptjs', () => ({
  //     compare: jest.fn(() => true), // Password matches
  //   }));

  //   await authController.postLogin(req, res, next);

  //   expect(req.session.user).toEqual({ id: 1, email: 'test@example.com', rule: 'user' });
  //   expect(res.redirect).toHaveBeenCalledWith('/');
  // });
});
