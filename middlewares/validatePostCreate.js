const validatePostCreate = (req, res, next) => {
    const { title, content, username } = req.body;
  
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Tiêu đề không hợp lệ' });
    }
  
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Nội dung không hợp lệ' });
    }
  
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ error: 'Tên người dùng không hợp lệ' });
    }
  
    next();
  };
  
  module.exports = validatePostCreate;
  