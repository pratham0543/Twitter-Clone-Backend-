const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const joi = require("joi")

// User details Schema
const UserInfo = require('../model/user')

// JWT Authentication
const authenticate = require("../tokenAuth/authenticate")

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

router.post('/', authenticate, (req, res) => {
    if (req.usertype === "admin") {
        const email = req.body.email;
        UserInfo.findOne({ email: email })
            .then(result => {
                if (result !== null)
                    res.status(400).json({ msg: "This email is already associated with an account. Use a different email or login" })
                else {
                    UserInfo.findOne({ username: req.body.username })
                        .then(ans => {
                            if (ans !== null)
                                res.status(400).json({ msg: "Username already taken. Please choose another" })
                            else {
                                // JOI VALIDATION ERROR HANDLING
                                const error = validate.validate(req.body)
                                if (error.error) {
                                    return res.status(400).send(error.error)
                                }
                                
                                const saltRounds = 10;
                                bcrypt.hash(req.body.password, saltRounds)
                                    .then(passHashResult => {
                                        const newUser = new UserInfo(
                                            {
                                                _id: new mongoose.Types.ObjectId(),
                                                name: req.body.name,
                                                username: req.body.username,
                                                email: req.body.email,
                                                password: passHashResult,
                                                user_type: "admin",
                                                phone: req.body.phone,
                                                dob: req.body.dob,
                                                gender: req.body.gender,
                                                location: req.body.location
                                            })
                                        newUser.save()
                                            .then(result => res.status(201).json({ msg: "Admin User created Successfully", createdUser: result }))
                                            .catch(err => res.status(500).json({ msg: 'Unable to create user at the moment. Please try again later', error: err }))
                                    })
                                    .catch(err => res.status(500).json({ msg: 'Unable to create user at the moment. Please try again later', error: err }))
                            }
                        })
                        .catch(err => res.status(500).json({ msg: 'Unable to create user at the moment. Please try again later', error: err }))
                }
            }
            )
            .catch(err => res.status(500).json({ msg: 'Unable to create user at the moment. Please try again later', error: err }))
    } else {
        res.status(401).json({ msg: "Not allowed" })
    }
})

module.exports = router;