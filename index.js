// Node modules
const express = require('express')

const server = express()
const port = 8080
const staticFilesPath = express.static(__dirname + "/public")

server.use(staticFilesPath)
server.use(express.urlencoded({extended: false}))
server.use(express.json())

let arrayWords = []

server.get("/getWords", (req, res) => res.send(arrayWords))

server.post("/setWord", (req, res) => {

    arrayWords.push(req.body.word)
    console.log(arrayWords)
    res.send()

})

// Start server
server.listen(port, () => console.log(`Server started on port ${port}`))