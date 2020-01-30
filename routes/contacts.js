const express = require("express");

const router = express.Router();

//@route        GET    api/contacts
//@desc         get contacts of user
//@access       Private
router.get("/", (req, res) => {
  res.send("user contacts...");
});

//@route        POST    api/contacts
//@desc         add a new contact to the user
//@access       private
router.post("/", (req, res) => {
  res.send("added a contact to the user...");
});

//@route        PUT    api/contacts/:id
//@desc         update contact
//@access       private
router.put("/:id", (req, res) => {
  res.send("Update contact...");
});

//@route        DELETE    api/contacts/:id
//@desc         delete contact
//@access       private
router.delete("/:id", (req, res) => {
  res.send("Delete contact...");
});

module.exports = router;
