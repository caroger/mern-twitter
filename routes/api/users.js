const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//set up payload
bcrypt.compare(password, user.password).then((isMatch) => {
  if (isMatch) {
    const payload = { id: user.id, handle: user.handle };

    JsonWebTokenError.sign(
      payload,
      keys.secretOrKey,
      // key expires in one hour
      { expiresIn: 3600 },
      (err, token) => {
        res.json({
          sucess: true,
          token: "Bearer " + token,
        });
      }
    );
  } else {
    return res.status(400).json({ password: "Incorrect password" });
  }
});

const router = express.Router();
// registration route
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ handle: req.body.handle }).then((user) => {
    if (user) {
      // Throw a 400 error if the user already exists
      errors.handle = "User already exists";
      return res.status(400).json(errors);
    } else {
      // Otherwise create a new user
      const newUser = new User({
        handle: req.body.handle,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = { id: user.id, handle: user.handle };

              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    sucess: true,
                    token: "Bearer " + token,
                  });
                }
              );
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// login route
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "This user does not exist" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Incorrect password" });
      }
    });
  });
});

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

module.exports = router;
