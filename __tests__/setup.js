// Mock the database module
jest.mock('../db', () => ({
  any: jest.fn(),
  one: jest.fn(),
  oneOrNone: jest.fn(),
  result: jest.fn(),
  none: jest.fn()
}));
// Mock the database module
jest.mock('../db', () => ({
  any: jest.fn(),
  one: jest.fn(),
  oneOrNone: jest.fn(),
  result: jest.fn(),
  none: jest.fn()
}));

// Mock other dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Mock auth middleware
jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});
// Mock other dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Mock auth middleware
jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});