let url = "mongodb+srv://kiran:IR3RqoMXag7XizyI@cluster0.lyjxp.mongodb.net/test?authSource=admin&replicaSet=atlas-ye2mlj-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
let MongoClient = require("mongodb").MongoClient
let databasename = "users"
let client = new MongoClient(url)

module.exports = {client,databasename}