const express = require("express")
let nodemailer = require("nodemailer")
var cors = require('cors')
let {hashPassword,comparePassword} = require("./modifypass")
const app = express()
app.use(express.json())
app.use(cors())
let {client,databasename} = require("./req")
const { ClientSession } = require("mongodb")
const { generateTocken } = require("./tocken")
const { protect } = require("./Authorization")
const port = process.env.PORT || 5000




app.get("/",async (req,res) => {
    res.send("app started")
})

app.post("/create",async (req,res)=>{
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let list = await table.find({email:req.body.email}).toArray()
    if(list.length>0){
        res.send({message:"User Already Exists"})
    }
    else{
        const modifiedPassword = await hashPassword(req.body.password)
        req.body.password = modifiedPassword
        let user = await table.insertOne(req.body)
        res.json({user,message:"Signup SuccessFull"})
    }
})


app.post("/login",async(req,res)=>{
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.findOne({email:req.body.email})
    if(user){
        let compareResult = await comparePassword(req.body.password,user.password)
        if(compareResult){
            let tocken = await generateTocken(user._id,user.email)
            res.status(200).json({message:"Login SuccessFull",tocken})
        }
        else{
            res.send({message:"Incorrect Password"})
        }
    }
    else{
        res.send({message:"User Not Found"})
    }
})


app.post("/update",protect,async (req,res) => {
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.findOne({email:req.userData.email})
    if(user){
        let finalData = await table.updateOne({email:user.email},{$set:req.body})
        res.json({message:"update",finalData})
    }
    else{
        res.send({message:"User Not Found"})
    }
})



app.get("/userData",protect,async (req,res) => {
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.findOne({email:req.userData.email})
    if(user){
        res.json({message:"success",user})
    }
    else{
        res.send({message:"User Not Found"})
    }
})




app.listen(port)