const express = require('express');
const router = express.Router();
const postController = require('../../controllers/v1/post.controllers.js');
const validatePostCreate = require('../../middlewares/validatePostCreate.js');;
const validatePostUpdate = require('../../middlewares/validatePostUpdate.js');

// Create a new post
router.post('/', validatePostCreate, postController.createPost);

// Update post by ID
router.put('/:id', validatePostUpdate, postController.updatePost);

// GET all posts
router.get('/', postController.getAllPosts);

// GET post by ID
router.get('/:id', postController.getPostById);

// DELETE post
router.delete('/:id', postController.deletePost);

module.exports = router;
