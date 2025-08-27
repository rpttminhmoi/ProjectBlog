<<<<<<< HEAD
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

=======

// Mock the database module
>>>>>>> 3829e9d2340f52090b1ef481d3f0c672b13d7429
jest.mock('../db', () => ({
  any: jest.fn(),
  one: jest.fn(),
  oneOrNone: jest.fn(),
  result: jest.fn(),
  none: jest.fn()
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});
