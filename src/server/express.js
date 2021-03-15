// Node modules
const express = require('express')
const bodyParser = require('body-parser')

// Express server definition
const server = express()
const port = 8080

// Frontend app
const staticFilesPath = express.static(__dirname + "../public")
server.use(staticFilesPath)

// JSON support
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

// API Rest
server.get("/loadImage", (req, res) => {

    // JSON response
    res.send({src: "img/atlasV.jpg"})

})

// Start server
server.listen(port, () => console.log(`Server started on ${port}`))

/*
    CRUD
        Create  -> POST
        Read    -> GET
        Update  -> PUT
        Delete  -> DELETE
*/

