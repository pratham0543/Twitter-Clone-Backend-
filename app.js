const express=require('express');
const app=express();
const cors=require('cors')
const bodyParser=require('body-parser')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
dotenv.config({path:'./.env'})
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
const url=process.env.URL
mongoose.set('strictQuery',true)
mongoose.connect(url)
    .then(console.log('DB Connection successful!'))
    .catch(err => console.log(err))






app.use('/',(req,res)=>res.status(200).json({msg:"Resource not found"}))



module.exports=app;



