const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// User details Schema
const UserInfo = require("../model/user")

// POST REQUEST --> LOGIN AUTHENTICATION
router.post('/', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    UserInfo.findOne({ email: email })
        .then(result => {
            if (result === null) {
                res.status(400).json({ msg: 'User does not exist' })
            } else {
                bcrypt.compare(password, result.password)
                    .then(passCompResult => {
                        if (passCompResult) {
                            const userDetails = {
                                userId: result._id,
                                username: result.username,
                                usertype: result.user_type
                            }
                            const jwt_token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
                            res.status(200).json({ msg: 'User Authenticated!', token: jwt_token })
                        } else {
                            res.status(400).json({ msg: 'User Authentication failed' })
                        }
                    })
                    .catch(err => res.status(500).json({ msg: 'Server encountered an error', error: err }))
            }
        })
        .catch(err => res.status(500).json({ msg: 'Server encountered an error', error: err }))
})

// PATCH REQUEST --> RESET PASSWORD
router.patch('/', (req, res) => {
    const oldPassword = req.body.password
    const newPassword = req.body.newPassword

    UserInfo.find({ email: req.body.email })
        .then(result => {
            if (result.length === 0) {
                res.status(400).json({ msg: "Email or password did not match, try again with a different email or password" })
            } else {
                bcrypt.compare(oldPassword, result[0].password)
                    .then(passCompResult => {
                        if (passCompResult) {
                            const saltRounds = 10
                            bcrypt.hash(newPassword, saltRounds)
                                .then(passHashResult => {
                                    const updatedUser = {
                                        _id: result[0]._id,
                                        email: result[0].email,
                                        password: passHashResult
                                    }
                                    UserInfo.findByIdAndUpdate(result[0]._id, updatedUser)
                                        .then(result => res.status(201).json({ msg: 'Password Changed', updatedUser: result }))
                                        .catch(err => res.status(500).json({ msg: 'Server encountered an error', error: err }))
                                })
                                .catch(err => res.status(500).json({ message: 'Server encountered an error', error: err }))
                        } else {
                            res.status(400).json({ msg: 'Email or password did not match, try again with a different email or password' })
                        }
                    })
                    .catch(err => res.status(500).json({ msg: 'Server encountered an error', error: err }))
            }
        })
        .catch(err => res.status(500).json({ msg: 'Server encountered an error', error: err }))
})

// DELETE REQUEST --> DELETE USER
router.delete('/', (req, res) => {
    UserInfo.find({ email: req.body.email })
        .then(result => {
            if (result.length === 0) {
                res.status(400).json({ msg: "Email doesn't exist" })
            } else {
                UserInfo.findByIdAndDelete(result[0]._id)
                    .then(result => res.status(200).json({ msg: 'User deleted successfully', deletedUser: result }))
                    .catch(err => res.status(500).json({ msg: 'Unable to delete user at the moment. Please try again', error: err }))
            }
        })
})

module.exports = router