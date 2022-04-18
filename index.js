const express = require("express")
let nodemailer = require("nodemailer")
var cors = require('cors')
let {hashPassword,comparePassword} = require("./modifypass")
const app = express()
app.use(express.json())
app.use(cors())
let {client,databasename} = require("./req")
const { ClientSession } = require("mongodb")
const port = process.env.PORT || 5000




app.post("/create",async (req,res)=>{
    console.log(req.body)
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let list = await table.find({email:req.body.email}).toArray()
    if(list.length>0){
        res.send("User Already Exists")
    }
    else{
        const modifiedPassword = await hashPassword(req.body.password)
        req.body.password = modifiedPassword
        let user = await table.insertOne(req.body)
        res.json({user})
    }
})


app.post("/login",async(req,res)=>{
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.find({email:req.body.email}).toArray()
    console.log(user)
    if(user.length>0){
        let compareResult = await comparePassword(req.body.password,user[0].password)
        if(compareResult){
            // let removeCode = await table.updateOne({email:user[0].email},{$unset:{}})
            res.send("login Successfull")
        }
        else{
            res.send("Incorrect Password")
        }
    }
    else{
        res.send("User Not Found")
    }
})


app.post("/forgotpassword",async (req,res)=> {
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.find({email:req.body.email}).toArray()
    if(user.length > 0){
        let modifiedpassword = await hashPassword(req.body.password)
        req.body.password = modifiedpassword
        let insertingData = await table.updateOne({password:user[0].password,email:req.body.email},{$set:{password:req.body.password}})
        res.json({
            insertingData,
            message:"Password Updated"
        })
    }else{
        res.json({
            message:"email does not exists"
        })
    }
})


app.post("/emailverification",async (req,res)=>{
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.find({email:req.body.email}).toArray()
    if(user.length > 0){
            let transport = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:"nodejspractice500@gmail.com",
                    pass:"kiran@7624"
                }
            })
            const randomenumber = (Math.random()*1000000.).toFixed(0)
            let insertcode = await table.updateOne({email:user[0].email},{$set:{code:randomenumber}})
            let mailoptions = {
                from:"nodejspractice500@gmail.com",
                to:`${req.body.email}`,
                subject:"Password Reset",
                text:`this is a mail to reset the password
                                please enter the code to reset the password - ${randomenumber}`
            }
            transport.sendMail(mailoptions,(err,info)=>{
                if(err){
                    console.log(err)
                    res.json({
                        err
                    })
                }
                else{
                    console.log(info)
                    res.json({

                        message:info.response,
                    })
                }
            })
    }else{
        res.send("Enter Proper Mail Id")
    }
})

app.post("/codeverification",async (req,res)=>{
    let result = await client.connect()
    let db = await result.db(databasename)
    let table = await db.collection("table")
    let user = await table.find({email:req.body.email}).toArray()
    if(user.length){
        if(user[0].code == req.body.code){
            let removeCode = await table.updateOne({email:user[0].email},{$unset:{code:req.body.code}})
            res.send("Correct OTP")
        }else{
            res.send("Incorrect Otp")
        }
    }else{
        res.send("Email does not exist")
    }
    
})
app.listen(port)