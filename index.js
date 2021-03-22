// Node modules
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userModel = require("./src/models/signUp")


// Server configuration
const SERVER_URI = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/users`
const app = express(SERVER_URI)


// Frontend app
const staticFilesPath = express.static(__dirname + "../public")
app.use(staticFilesPath)
app.use(express.urlencoded({extended: false}))
app.use(express.json())


// Database
const connectToMongo = () => {

    mongoose
        .connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(console.log("connected to database"))
        .catch(console.log(err => `database connection error -> ${err}`))

}

const closeMongo = () => mongoose.connection.close()


// Endpoints
app.post("/signup", (req, res) => {

    let email = req.body.email
    let pass = req.body.pass
    result = createUser(email, pass)
    res.send(JSON.stringify({result: result}))

})


// Logic
const createUser = async (email, pass) => {

    let result
    const newUser = new userModel({email: email, pass: pass}) 
    await connectToMongo()
    await newUser.save()
        .then(result = "ok")
        .catch(result = "ko")
    closeMongo()
    return result

}


// Start server
app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))