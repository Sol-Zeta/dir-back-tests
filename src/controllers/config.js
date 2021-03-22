// Node modules
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


// Server configuration
const SERVER_URI = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${process.env.ENDPOINT_GENERAL}`
const MONGO_URI = `${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}`
const app = express(SERVER_URI)


// Frontend app
const staticFilesPath = express.static(__dirname + "../public")
server.use(staticFilesPath)
server.use(express.urlencoded({extended: false}))
server.use(express.json())


// Database
const connectToMongo = () => {

    mongoose
        .connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(console.log("connected to database"))
        .catch(console.log(err => `database connection error -> ${err}`))

}

const closeMongo = () => mongoose.connection.close()


// Start server
app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))