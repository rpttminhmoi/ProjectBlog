const db = require('../../../db');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../../../controllers/v1/post.controller');

jest.mock('../../../db');

describe('Post Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllPosts', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      const mockCount = { count: 1 };
      
      db.any.mockResolvedValue(mockPosts);
      db.one.mockResolvedValue(mockCount);

      mockReq.query = { page: 1, limit: 5 };

      await getAllPosts(mockReq, mockRes);

      expect(db.any).toHaveBeenCalledWith(
        'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [5, 0]
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        totalPosts: 1,
        totalPages: 1,
        posts: mockPosts
      });
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const mockPost = { id: 1, title: 'Test', content: 'Content' };
      db.one.mockResolvedValue(mockPost);

      mockReq.body = { title: 'Test', content: 'Content' };

      await createPost(mockReq, mockRes);

      expect(db.one).toHaveBeenCalledWith(
        'INSERT INTO posts(title, content, user_id) VALUES($1, $2, $3) RETURNING *',
        ['Test', 'Content', 1]
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });
  });

  // Add similar tests for other methods
});