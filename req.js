let url = "mongodb+srv://kiran:super@cluster0.zgq8i0e.mongodb.net/guvitask?authSource=admin&replicaSet=atlas-ni55y0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
let MongoClient = require("mongodb").MongoClient
let databasename = "guvitask"
let client = new MongoClient(url)

module.exports = {client,databasename}