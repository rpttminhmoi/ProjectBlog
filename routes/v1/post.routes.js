const express = require('express');
const router = express.Router();
const postController = require('../../controllers/v1/post.controller.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const validatePostCreate = require('../../middlewares/validatePostCreate.js');
const validatePostUpdate = require('../../middlewares/validatePostUpdate.js');

// POST create a new post (JWT + validate)
router.post('/', authMiddleware, validatePostCreate, postController.createPost);

// PUT update post by ID (JWT + validate)
router.put('/:id', authMiddleware, validatePostUpdate, postController.updatePost);

// GET all posts (không cần auth)
router.get('/', postController.getAllPosts);

// GET post by ID (không cần auth)
router.get('/:id', postController.getPostById);

// DELETE post (có auth)
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
