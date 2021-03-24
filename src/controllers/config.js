// -------------------------------------------------------------------------------
// Node modules
// -------------------------------------------------------------------------------

const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


// -------------------------------------------------------------------------------
// Servers configuration
// -------------------------------------------------------------------------------

const SERVER_URI = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
// const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${DB_USER}:${DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
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
server.use(staticFilesPath)
server.use(express.urlencoded({extended: false}))
server.use(express.json())


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
// Logic
// -------------------------------------------------------------------------------

// Register new user


// -------------------------------------------------------------------------------
// Start server
// -------------------------------------------------------------------------------

app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))