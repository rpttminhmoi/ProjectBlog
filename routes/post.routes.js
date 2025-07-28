const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controllers');

// GET all posts
router.get('/', postController.getAllPosts);

// GET post by ID
router.get('/:id', postController.getPostById);

// POST create a post
router.post('/', postController.createPost);

// PUT update post
router.put('/:id', postController.updatePost);

// DELETE post
router.delete('/:id', postController.deletePost);

module.exports = router;
