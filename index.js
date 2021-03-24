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
// const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
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

const connectToMongo = (...params) => {

    return new Promise((resolve, reject) => {

        mongoose
            .connect(MONGO_URI, mongoOptions)
        resolve(params)

    })

}

const closeMongo = () => {

    return new Promise((resolve, reject) => {

        mongoose.connection
            .close()
        resolve()

    })

}



// -------------------------------------------------------------------------------
// Endpoints
// -------------------------------------------------------------------------------

app.post("/signup", async (req, res) => {

    let result = await createUser(req.body.email, req.body.pass)
    if (result === "user created successfully") 
        res.redirect("/login")
    res.send(JSON.stringify({result: result}))

})

app.post("/login", async (req, res) => {

    let token
    let result = await loginUser(req.body.email, req.body.pass)
    if (result) 
        token = await createJWT(req.body.email)

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

app.get("/logout", (req, res) => {

    console.log("logout")

})


// -------------------------------------------------------------------------------
// Logic
// -------------------------------------------------------------------------------

// Register new user
const createUser = async (email, pass) => {

    let dbResponse
    const newUser = new Users({email: email, pass: md5(pass), secret: ""}) 

    await connectToMongo(newUser)
        .then(async (params) => {
            let newUser = params[0]
            await newUser
                .save()
                .then(response => dbResponse = response)
                .catch(response => dbResponse = response)
        })
        .catch(err => console.log(`database find error -> ${err}`))

    await closeMongo()
        .then(() => console.log("database closed"))
        .catch(err => console.log(`database close error -> ${err}`))

    return result = dbResponse.code === 11000 
        ? "user already exists"
        : "user created successfully"

}

// Check if login-user pass is in database
const loginUser = async (email, pass) => {

    let dbResponse
    await connectToMongo(email)
        .then(async (params) => {
            let email = params[0]
            await Users
                .find({email: email})
                .then(response => {
                    dbResponse = response
                    console.log("user found in database!!")
                })
        })
        .catch(err => console.log(`database find error -> ${err}`))

    await closeMongo()
        .then(() => console.log("database closed"))
        .catch(err => console.log(`database close error -> ${err}`))
    
    return result = md5(pass) === dbResponse[0].pass
        ? true
        : false

}

// Create JWT for users logged-in or signed-up
const createJWT = async email => {

    let secret = md5(Math.random(1, Date.now))
    await connectToMongo(email)
        .then(async params => {
            let email = params[0]
            await Users
                .updateOne({email: email}, {$set: {secret: secret}})
                .then(() => console.log("updated"))
                .catch(err => console.log(`database update error -> ${err}`))
        })
        .catch(err => console.log(`database connection error -> ${err}`))

    await closeMongo()
        .then(() => console.log("database closed"))
        .catch(err => console.log(`database close error -> ${err}`))

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