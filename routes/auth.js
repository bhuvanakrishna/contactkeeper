const express = require("express");
const router = express.Router();
const User = require("../models/User");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//getting middleware for authenticated routes access
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
//@route        GET    api/auth
//@desc         get logged in user
//@access       Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  res.send("get logged in user...");
});

//@route        POST    api/auth (though both end points are same, since they use diff methods - get and post - its ok)
//@desc         login a user
//@access       public
router.post(
  "/",
  [
    check("email", "Enter a valid Email..").isEmail(),
    check("password", "Enter a password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //remember syntax is model.fun()
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "Wrong Password/ Invalid Credentials" });
      }

      const payload = {
        //the user is from db
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          //1 hour
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error...");
    }

    //res.send("logged in user...");
  }
);

module.exports = router;
