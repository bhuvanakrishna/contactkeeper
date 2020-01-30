const express = require("express");

const router = express.Router();

//@route        GET    api/auth
//@desc         get logged in user
//@access       Private
router.get("/", (req, res) => {
  res.send("get logged in user...");
});

//@route        POST    api/auth (though both end points are same, since they use diff methods - get and post - its ok)
//@desc         login a user
//@access       public
router.post("/", (req, res) => {
  res.send("logged in user...");
});

module.exports = router;
