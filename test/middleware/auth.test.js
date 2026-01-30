const { requireAuth, requireAdmin } = require('../../middleware/auth');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { session: {} };
    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allow chaining .status().send()
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('requireAuth', () => {
    it('should call next if user is authenticated', () => {
      mockReq.session.user = { id: 1 };
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to /login if user is not authenticated', () => {
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('requireAdmin', () => {
    it('should call next if user is admin', () => {
      mockReq.session.user = { id: 1, rule: 'admin' };
      requireAdmin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });

    it('should send 403 Forbidden if user is not authenticated', () => {
      requireAdmin(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith('Forbidden');
    });

    it('should send 403 Forbidden if user is authenticated but not admin', () => {
      mockReq.session.user = { id: 1, rule: 'user' };
      requireAdmin(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith('Forbidden');
    });
  });
});
