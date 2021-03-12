// Node modules
const express = require('express')
const bodyParser = require('body-parser')

// Express server definition
const server = express()
const port = 8080

// Frontend app
const staticFilesPath = express.static(__dirname + "public")
server.use(staticFilesPath)

// JSON support
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

let arrayWords = []

server.get("/getWords", (req, res) => {

    res.send(arrayWords)

})

server.post("/setWord", (req, res) => {

    arrayWords.push()
    res.send()

})

// Start server
server.listen(port, () => console.log(`Server started on port ${port}`))