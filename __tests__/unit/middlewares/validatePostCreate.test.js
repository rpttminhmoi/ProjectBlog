const validatePostCreate = require('../../../middlewares/validatePostCreate');

describe('validatePostCreate Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should pass validation with valid data', () => {
    mockReq.body = {
      title: 'Valid Title',
      content: 'Valid Content',
      username: 'testuser'
    };

    validatePostCreate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject invalid title', () => {
    mockReq.body = {
      title: '',
      content: 'Valid Content',
      username: 'testuser'
    };

    validatePostCreate(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Tiêu đề không hợp lệ' });
  });
});