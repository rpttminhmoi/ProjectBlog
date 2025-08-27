const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jwt.sign.mockReturnValue('mocked-token');
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
        db.oneOrNone.mockResolvedValue(null);
        db.one.mockResolvedValue({ id: 1, username: 'newuser' });
        bcrypt.hash.mockResolvedValue('hashed_password');

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({ username: 'newuser', password: 'password123' })
            .expect(201);

        expect(response.body).toHaveProperty('message', 'User created');
        expect(response.body).toHaveProperty('token');

    });

    it('should reject duplicate username', async () => {
      db.oneOrNone.mockResolvedValue({ id: 1, username: 'existinguser' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: 'existinguser', password: 'password123' })
        .expect(409);

      expect(response.body.error).toBe('Username already taken');
    });
  });
});