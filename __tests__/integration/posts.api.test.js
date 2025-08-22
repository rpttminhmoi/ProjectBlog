const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

jest.mock('../../db');
jest.mock('../../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});

describe('Posts API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/posts', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      const mockCount = { count: 1 };
      
      db.any.mockResolvedValue(mockPosts);
      db.one.mockResolvedValue(mockCount);

      const response = await request(app)
        .get('/api/v1/posts?page=1&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        page: 1,
        limit: 5,
        totalPosts: 1,
        totalPages: 1,
        posts: mockPosts
      });
    });
  });

  describe('POST /api/v1/posts', () => {
  it('should create a new post', async () => {
    const mockPost = { id: 1, title: 'Test', content: 'Content' };
    db.one.mockResolvedValue(mockPost);

    const response = await request(app)
      .post('/api/v1/posts')
      .send({ 
        title: 'Test', 
        content: 'Content',
        username: 'testuser' // Add this if your validation requires it
      })
      .expect('Content-Type', /json/)
      .expect(201); // This should now pass

    expect(response.body).toEqual(mockPost);
    });
  });
});