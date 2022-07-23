const router = require("express").Router();
const Post = require("../models/Post");

// Create
router.post("/create", (req, res) => {
  const newPost = new Post(req.body);
  newPost
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Update
router.put("/:id/update", async (req, res) => {
  const body = req.body;
  const post = await Post.findById(req.params.id);
  if (post === null) {
    return res.status(404).json("Post not found!");
  }
  if (post.username !== body.username) {
    return res.status(401).json("You cannot edit this post!");
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
router.put("/:id/delete", (req, res) => {
  const body = req.body;
  Post.findById(req.params.id, async (err, post) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (post === null) {
      return res.status(404).json("Post not found!");
    }
    if (post.username !== body.username) {
      return res.status(401).json("You cannot delete this post!");
    }
    try {
      await post.delete();
      return res.status(200).json("Post has been deleted!");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
});

// Get
router.get("/:id/get", (req, res) => {
  Post.findById(req.params.id, async (err, post) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (post === null) {
      return res.status(404).json("Post not found!");
    }
    return res.status(200).json(post);
  });
});

// Get All Posts
router.get("/get", async (req, res) => {
  const username = req.query.user;
  const category = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await Post.find({
        categories: {
          $in: [category],
        },
      });
    } else {
      posts = await Post.find({});
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
