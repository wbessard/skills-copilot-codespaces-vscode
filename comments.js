// Create web server

// 1. Import express
const express = require('express');
const bodyParser = require('body-parser');
const { Comment } = require('./models');
const { User } = require('../user/models');
const { Post } = require('../post/models');
const { authMiddleware } = require('../auth/middleware');

// 2. Create web server
const commentRouter = express();

// 3. Config web server
commentRouter.use(bodyParser.json());

// 4. Routing
// Create comment
commentRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, postId } = req.body;
    const { id } = req.user;

    const comment = await Comment.create({
      content,
      userId: id,
      postId,
    });

    const user = await User.findOne({ where: { id } });
    const post = await Post.findOne({ where: { id: postId } });

    res.send({
      ...comment.toJSON(),
      user,
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'There was a problem creating comment',
    });
  }
});

// Get comments
commentRouter.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [User, Post],
    });
    res.send(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'There was a problem getting comments',
    });
  }
});

// Get comment by id
commentRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({
      where: { id },
      include: [User, Post],
    });
    res.send(comment);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'There was a problem getting comment',
    });
  }
});

// Update comment by id
// commentRouter.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content } = req.body;

//     const comment = await Comment.findOne({ where: { id } });
//     if (!comment) {
//       return res.status(404).send({
//         message: 'Comment not found