require("dotenv").config()
const jwt = require("jsonwebtoken")



const protect = async (req,res,next) => {
    let tocken = req.headers.authorization 
    if(!tocken){
        res.json({message:"No Tocken Has been Sent"})
        return ;
    }

        try{
            tocken = tocken.split(" ")[1]
            const decoded = await jwt.verify(tocken,process.env.Seceret_key)
            // req.user = await table.findOne({_id:decoded.id})
            req.userData = decoded
            next()
        }catch(error){
            res.json({message:"tocken Not Authorized"})
        }
        
    }







module.exports = {protect}
