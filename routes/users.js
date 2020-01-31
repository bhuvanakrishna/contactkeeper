const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

//validator import. see - https://express-validator.github.io/docs/
const { check, validationResult } = require("express-validator");

//including user model
const User = require("../models/User");

//@route        POST    api/users
//@desc         register a user
//@access       Public
router.post(
  "/",
  [
    check("name", "name is required")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "password should be more than 6 characters").isLength({
      min: 5
    })
  ],
  async (req, res) => {
    //in order to send req body, we need to add middleware to server.js
    // res.send(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //here the first 'errors' can be anything
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring contents of req.body
    const { name, email, password } = req.body;

    //now check if the email already exists
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "email already registered.." });
      }

      user = new User({
        name: name,
        email: email,
        password: password
      });

      //hashing password before storing in db
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // res.send("user saved in db");

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }

    // res.send("passed");
  }
);

module.exports = router;
