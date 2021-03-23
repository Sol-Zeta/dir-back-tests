// Node modules
const express = require('express')
const mongoose = require('mongoose')
const md5 = require('md5')
require('dotenv').config()
const userModel = require("./src/models/signUp")


// Server configuration
const SERVER_URI = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
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
app.post("/signup", async (req, res) => {

    let response, result
    let email = req.body.email
    let pass = req.body.pass
    response = await createUser(email, pass)
    result = validateUser(response)
    res.send(JSON.stringify({result: result}))

})

app.post("/login", async (req, res) => {

    let result
    let email = req.body.email
    let pass = req.body.pass
    result = await loginUser(email, pass)
    res.send(JSON.stringify({result: result}))

})


// Logic
const createUser = async (email, pass) => {

    let dbResponse
    const newUser = new userModel({email: email, pass: md5(pass)}) 
    await connectToMongo()
    await newUser.save()
        .then(response => dbResponse = response)
        .catch(response => dbResponse = response)
    closeMongo()
    return dbResponse

}

const validateUser = response => {

    return result = response.code === 11000 
        ? "user already exists"
        : "user created successfully"

}

const loginUser = async (email, pass) => {

    await connectToMongo()
    let dbResponse = await userModel.find({email: email})
    closeMongo()
    return result = md5(pass) === dbResponse[0].pass
        ? "Authorized user"
        : "You cannot pass"

}


// Start server
app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))