// Node modules
const express = require('express')
const firebase = require('firebase')

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
    saveOnFirebase()
    res.send()

})

const saveOnFirebase = () => {

    

}

// Start server
server.listen(port, () => console.log(`Server started on port ${port}`))