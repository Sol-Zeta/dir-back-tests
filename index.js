// -------------------------------------------------------------------------------
// Node modules
// -------------------------------------------------------------------------------

const express = require('express')
const mongoose = require('mongoose')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')
const hash = require('hash.js')
require('dotenv').config()
const Users = require("./src/models/signUp")


// -------------------------------------------------------------------------------
// Servers configuration
// -------------------------------------------------------------------------------

const SERVER_URI = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const app = express(SERVER_URI)
const mongoOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    poolSize: 50
    // reconnectTries: 5000
}


// -------------------------------------------------------------------------------
// Frontend app
// -------------------------------------------------------------------------------

const staticFilesPath = express.static(__dirname + "../public")
app.use(staticFilesPath)
app.use(express.urlencoded({extended: false}))
app.use(express.json())


// -------------------------------------------------------------------------------
// Database
// -------------------------------------------------------------------------------

const connectToMongo = () => {

    mongoose
        .connect(MONGO_URI, mongoOptions)
        .then(console.log("connected to database"))
        .catch(err => console.log(`database connection error -> ${err}`))

}

const closeMongo = () => {

    mongoose.connection
        .close()
        .then(console.log("closed"))
        .catch(err => console.log(`database close error -> ${err}`))

}



// -------------------------------------------------------------------------------
// Endpoints
// -------------------------------------------------------------------------------

app.post("/signup", async (req, res) => {

    let token
    let result = await createUser(req.body.email, req.body.pass)
    if (result === "user created successfully") 
        token = await createJWT(req.body.email, req.body.pass)

    res.send(JSON.stringify({result: result, jwt: token}))

})

app.post("/login", async (req, res) => {

    let token
    let result = await loginUser(req.body.email, req.body.pass)
    await console.log(result)
    if (result) 
        token = await createJWT(req.body.email, req.body.pass)

    res.send(JSON.stringify({result: result, jwt: token}))

})

app.get("/profile", async (req, res) => {

    if (!req.headers.authorization)
        res.redirect("/login")

    token = req.headers.authorization.split(".")
    token[0] = token[0].substring(token[0].indexOf("\"") + 1)
    token[2] = token[2].substring(0, token[2].length-1)
    let result = await checkToken(token)
    res.send({result: result})

})


// -------------------------------------------------------------------------------
// Logic
// -------------------------------------------------------------------------------

// Register new user
const createUser = async (email, pass) => {

    let dbResponse
    const newUser = new Users({email: email, pass: md5(pass), secret: ""}) 
    await connectToMongo()
    await newUser
        .save()
        .then(response => dbResponse = response)
        .catch(response => dbResponse = response)
    closeMongo()

    return result = dbResponse.code === 11000 
        ? "user already exists"
        : "user created successfully"

}

// Check if login-user pass is in database
const loginUser = async (email, pass) => {

    await connectToMongo()
    let dbResponse = await Users.find({email: email})
    closeMongo()
    return result = md5(pass) === dbResponse[0].pass
        ? true
        : false

}

// Create JWT for users logged-in or signed-up
const createJWT = async email => {

    let secret = md5(Math.random(1, Date.now))
    // await connectToMongo()
    // await Users
    //      .updateOne({email: email}, {secret: secret})
    // closeMongo()
    return token = jwt.sign({email: email}, secret)

}

// Check token from an entry connection on a protected endpoint
const checkToken = async token => {

    let userSecret
    let header = JSON.parse(base64.decode(token[0]))
    let payload = JSON.parse(base64.decode(token[1]))
    // await connectToMongo()
    // let secretFromDB = await Users.find({email: payload.email}, {secret: 1})
    if (header.alg === "HS256")
        userSecret = hash.sha256().update(secretFromDB).digest()

    return result = userSecret === token[2]
        ? "Welcome Sir"
        : "You can not pass"
    

}


// -------------------------------------------------------------------------------
// Start server
// -------------------------------------------------------------------------------

app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))