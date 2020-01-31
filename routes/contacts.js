const express = require("express");
const auth = require("../middleware/auth");
const Contact = require("../models/Contact");
const User = require("../models/User");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//@route        GET    api/contacts
//@desc         get contacts of user
//@access       Private
router.get("/", auth, async (req, res) => {
  try {
    //date -1 orders most recent first
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route        POST    api/contacts
//@desc         add a new contact to the user
//@access       private
router.post(
  "/",
  [
    auth,
    [
      check("name", "name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//@route        PUT    api/contacts/:id
//@desc         update contact
//@access       private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //the id in the params is of the contact which we want to edit

  //build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) res.status(404).send("user not found");

    //make sure the user owns the contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).send("not authorized");
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route        DELETE    api/contacts/:id
//@desc         delete contact
//@access       private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) res.status(404).send("user not found");

    //make sure the user owns the contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).send("not authorized");
    }

    //dont use find by id and delete - its deprecated
    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
