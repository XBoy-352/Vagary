const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// Update
router.put("/:id/update", async (req, res) => {
  const body = req.body;
  if (body.userId !== req.params.id) {
    return res.status(401).send("You can only update your account!");
  }

  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
  }
  const oldUsername = await User.findById(req.params.id);

  if (body.username != oldUsername.username) {
    try {
      let posts = await Post.find({ username: oldUsername.username });
      posts.forEach((post) => {
        Post.findByIdAndUpdate(
          post._id,
          { $set: { username: body.username } },
          { new: true },
          (err, data) => {}
        );
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
router.put("/:id/delete", async (req, res) => {
  const body = req.body;
  if (body.userId !== req.params.id) {
    return res.status(401).send("You can only delete your account!");
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get
router.get("/:id/get", (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data === null) {
        return res.status(404).json("User not found!");
      }
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
