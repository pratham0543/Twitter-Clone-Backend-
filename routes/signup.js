const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const { default: mongoose } = require("mongoose")
const joi = require("joi")

// User details Schema
const UserInfo = require("../model/user")

// VALIDATION USING JOI
const validate = joi.object({
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required().min(8),
    phone: joi.number().required(),
    dob: joi.date().required(),
    gender: joi.string(),
    location: joi.string()
})

// POST REQUEST --> CREATE A NEW USER
router.post('/', (req, res) => {
    UserInfo.findOne({ email: req.body.email })
        .then(findEmail => {
            if (findEmail !== null) {
                res.status(400).json({ msg: 'This email is already associated with an account. Use a different email or login' })
            } else {
                UserInfo.findOne({ username: req.body.username })
                    .then(findUname => {
                        if (findUname !== null) {
                            res.status(400).json({ msg: 'Username already taken. Please choose another' })
                        } else {
                            // JOI VALIDATION ERROR HANDLING
                            const error = validate.validate(req.body)
                            if (error.error) {
                                return res.status(400).send(error.error)
                            }

                            const saltRounds = 10
                            bcrypt.hash(req.body.password, saltRounds)
                                .then(passHashResult => {
                                    const User = new UserInfo({
                                        _id: new mongoose.Types.ObjectId(),
                                        name: req.body.name,
                                        username: req.body.username,
                                        email: req.body.email,
                                        password: passHashResult,
                                        user_type: "normal",
                                        phone: req.body.phone,
                                        dob: req.body.dob,
                                        gender: req.body.gender,
                                        location: req.body.location
                                    })
                                    User.save()
                                        .then(ans => res.status(201).json({ msg: 'User created successfully', createdUser: ans }))
                                        .catch(err => res.status(500).json({ msg: 'Unable to create user at the moment. Please try again later', error: err }))
                                })
                                .catch(err => res.status(500).json({ msg: 'Internal Server error', error: err }))
                        }
                    })
                    .catch(err => res.status(500).json({ msg: 'Internal Server Error', error: err }))
            }
        })
        .catch(err => res.status(500).json({ msg: 'Internal Server error', error: err }))
})

// PATCH REQUEST --> UPDATE DETAILS OF A USER
router.patch('/', (req, res) => {
    //user validation
    UserInfo.findOneAndUpdate({ email: req.body.email }, { $set: req.body })
        .then(result => res.status(201).json({ msg: 'Details updated successfully', updated: result }))
        .catch(err => res.status(500).json({ msg: 'Unable to update details at the moment', error: err }))
})

module.exports = router