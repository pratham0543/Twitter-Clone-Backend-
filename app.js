const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const signup = require("./routes/signup")
const login = require('./routes/login')
const tweet = require('./routes/tweet')
const createAdmin = require('./routes/admin')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const url = process.env.URL

mongoose.set('strictQuery', true)
mongoose.connect(url)
    .then(console.log('DB Connection successful!'))
    .catch(err => console.log(err))

app.use('/signup', signup)
app.use('/login', login)
app.use('/tweet', tweet)
app.use('/createAdmin', createAdmin)

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Resource not found' })
})

module.exports = app