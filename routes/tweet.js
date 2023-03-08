const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const joi = require("joi")

// Tweet Schema
const Tweet = require("../model/tweet");

// JWT Authentication
const authenticate = require("../tokenAuth/authenticate")

// VALIDATION USING JOI
const validate = joi.object({
  username: joi.string().required(),
  content: joi.string().required().max(280)
})

// GET REQUEST --> RETRIEVE ALL TWEETS
router.get("/", (req, res) => {
  Tweet.find()
    .then((result) => res.status(200).json({ Tweets: result }))
    .catch((err) => res.status(500).json({ msg: "Internal Server error", error: err }))
})

// GET REQUEST --> RETRIEVE TWEETS OF A USER
router.get("/:username", (req, res) => {
  const username = req.params.username;
  Tweet.find({ username: username })
    .then(result => res.status(200).json({ Tweets: result }))
    .catch(err => res.status(500).json({ msg: "Internal Server error", error: err }))
})

// POST REQUEST --> POST A NEW TWEET
router.post("/", authenticate, (req, res) => {
  // JOI VALIDATION ERROR HANDLING
  const error = validate.validate(req.body)
  if (error.error) {
    return res.status(400).send(error.error)
  }
  const newTweet = new Tweet({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    content: req.body.content,
  });
  newTweet.save()
    .then(result => res.status(201).json({ msg: "Tweet posted successfully", Tweet: result }))
    .catch(err => res.status(500).json({ msg: "Unable to post tweet at the moment. Please try again later", error: err }))
  // }
})

// PATCH REQUEST --> UPDATE A TWEET
router.patch("/:id", authenticate, (req, res) => {
  const id = req.params.id
  Tweet.findById(id)
    .then(result => {
      if (result === null) {
        res.status(400).json({ msg: "Tweet does not exist" })
      } else {
        if (result.username === req.username) {
          Tweet.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
            .then(updateResult => res.status(200).json({ msg: "Updated successfully" }))
            .catch(err => res.status(500).json({ msg: "Internal Server error. Please try again", error: err }))
        }
        else {
          res.status(403).json({ msg: "You cannot edit this tweet" })
        }
      }
    })
    .catch(err => res.status(500).json({ msg: "Internal Server error. Please try again", error: err }))
})

// DELETE REQUEST --> DELETE A TWEET
router.delete("/:id", authenticate, (req, res) => {
  const id = req.params.id;
  Tweet.findById(id)
    .then(result => {
      if (result === null) {
        res.status(400).json({ msg: "Tweet does not exist" })
      } else {
        if (result.username === req.username || req.usertype === "admin") {
          Tweet.findByIdAndDelete(id)
            .then(deleteResult => res.status(200).json({ msg: "Tweet deleted successfully" }))
            .catch(err => res.status(500).json({ msg: "Server encountered and error", error: err }))
        } else {
          res.status(403).json({ msg: "Not Authorized" })
        }
      }
    })
    .catch(err => res.status(500).json({ msg: "Server encountered and error", error: err }))

})

module.exports = router;
