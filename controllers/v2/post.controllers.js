const db = require('../../db');

exports.getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
  
    try {
      const posts = await db.any(
        'SELECT * FROM posts ORDER BY createdAt DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
  
      const count = await db.one('SELECT COUNT(*) FROM posts');
      const totalPosts = parseInt(count.count);
      const totalPages = Math.ceil(totalPosts / limit);
  
      res.status(200).json({
        page,
        limit,
        totalPosts,
        totalPages,
        posts
      });
    } catch (err) {
      console.error('❌ PAGINATION ERROR:', err.message);
      res.status(500).json({ error: 'Failed to fetch posts with pagination' });
    }
};
  
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const post = await db.oneOrNone('SELECT * FROM posts WHERE id = $1', [id]);
        if (!post) {
        return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error('❌ GET POST BY ID ERROR:', err.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

exports.createPost = async (req, res) => {
  const { title, content, username } = req.body;
  if (!title || !content || !username) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newPost = await db.one(
      'INSERT INTO posts(title, content, username, created_at) VALUES($1, $2, $3, NOW()) RETURNING *',
      [title, content, username]
    );
    res.status(201).json(newPost);
  } 
  catch (err) {
    console.error('❌ CREATE POST ERROR:', err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await db.result(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [title, content, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.result('DELETE FROM posts WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
