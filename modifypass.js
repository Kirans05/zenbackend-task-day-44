const bcryptjs = require("bcryptjs")
let saltRound = 10

const hashPassword = async (pwd) => {
    let salt = await bcryptjs.genSalt(saltRound)
    let hash = await bcryptjs.hash(pwd,salt)
    return hash
}


const comparePassword = async (pwd,dataPass) => {
    let result = await bcryptjs.compare(pwd,dataPass)
    console.log("result",result)
    return result
}

module.exports = {hashPassword,comparePassword}