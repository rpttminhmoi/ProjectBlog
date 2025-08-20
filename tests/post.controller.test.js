const postController = require('../controllers/v1/post.controller');
const db = require('../db');

jest.mock('../db');

describe('Post Controller - getAllPosts (with pagination)', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // mặc định không có page/limit
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should return paginated posts when db query is successful', async () => {
    const fakePosts = [
      { id: 1, title: 'Hello', content: 'World', username: 'moi' },
      { id: 2, title: 'Second', content: 'Post', username: 'dev' }
    ];

    // Giả lập db.any và db.one
    db.any.mockResolvedValue(fakePosts);
    db.one.mockResolvedValue({ count: '2' });

    await postController.getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      page: 1,
      limit: 5,
      totalPosts: 2,
      totalPages: 1,
      posts: fakePosts
    });
  });

  test('should return 500 when db query fails', async () => {
    db.any.mockRejectedValue(new Error('DB error'));

    await postController.getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch posts with pagination'
    });
  });
});
describe('Post Controller - createPost', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { title: 'New post', content: 'Some content', username: 'moi' },
      user: { id: 123 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should create a new post when input is valid', async () => {
    const fakeNewPost = {
      id: 1,
      title: 'New post',
      content: 'Some content',
      username: 'moi',
      user_id: 123,
      created_at: new Date().toISOString()
    };

    db.one.mockResolvedValue(fakeNewPost);

    await postController.createPost(req, res);

    expect(db.one).toHaveBeenCalledWith(
      'INSERT INTO posts (title, content, username, user_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      ['New post', 'Some content', 'moi', 123]   
    );       

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeNewPost);
  });

  test('should return 400 if fields are missing', async () => {
    req.body = { title: '', content: '' };

    await postController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing fields' });
  });

  test('should return 500 when db insert fails', async () => {
    db.one.mockRejectedValue(new Error('DB insert error'));

    await postController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create post' });
  });
});
describe('Post Controller - getPostById', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should return post when found', async () => {
    const fakePost = { id: 1, title: 'Hello', content: 'World', username: 'moi' };

    db.oneOrNone.mockResolvedValue(fakePost);

    await postController.getPostById(req, res);

    expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM posts WHERE id = $1', ['1']);
    expect(res.json).toHaveBeenCalledWith(fakePost);
  });

  test('should return 404 if post not found', async () => {
    db.oneOrNone.mockResolvedValue(null);

    await postController.getPostById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
  });

  test('should return 500 on db error', async () => {
    db.oneOrNone.mockRejectedValue(new Error('DB error'));

    await postController.getPostById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch post' });
  });
});
describe('Post Controller - updatePost', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' }, body: { title: 'Updated', content: 'Content' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should update post when found', async () => {
    const fakeResult = { rowCount: 1 };

    db.result.mockResolvedValue(fakeResult);

    await postController.updatePost(req, res);

    expect(db.result).toHaveBeenCalledWith(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      ['Updated', 'Content', '1']
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Post updated' });
  });

  test('should return 404 if post not found', async () => {
    db.result.mockResolvedValue({ rowCount: 0 });

    await postController.updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
  });

  test('should return 500 on db error', async () => {
    db.result.mockRejectedValue(new Error('DB error'));

    await postController.updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
  });
}); 
describe('Post Controller - deletePost', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should delete post when found', async () => {
    const fakeResult = { rowCount: 1 };

    db.result.mockResolvedValue(fakeResult);

    await postController.deletePost(req, res);

    expect(db.result).toHaveBeenCalledWith('DELETE FROM posts WHERE id = $1', ['1']);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted' });
  });

  test('should return 404 if post not found', async () => {
    db.result.mockResolvedValue({ rowCount: 0 });

    await postController.deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
  });

  test('should return 500 on db error', async () => {
    db.result.mockRejectedValue(new Error('DB error'));

    await postController.deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
  });
});
