const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", (req, res) => {
  const body = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, (err, hash) => {
      const newUser = new User({
        username: body.username,
        email: body.email,
        password: hash,
        profilePic: body.profilePic,
      });

      newUser
        .save()
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });
  });
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json("Wrong username!");
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res.status(400).json("Wrong password!");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
