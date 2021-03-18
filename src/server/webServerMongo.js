const express = require('express')
require('dotenv').config()
const {MongoClient} = require('mongodb')

class Server {

    constructor() {
        this.server = express()
        this.staticFilesPath = express.static(__dirname + "/public")
        this.server.use(this.staticFilesPath)
        this.server.use(express.urlencoded({extended: false}))
        this.server.use(express.json())
    }

    connectToServer() {

        this.server.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))

    }

    listenEndpoints(db) {

        this.server.post("/newuser", (req, res) => {

            db.getDB().db("foodtoyou").collection("users").insert({name: "otherUser3", mail: "otherMail3"})
            res.send(JSON.stringify({result: "ok"}))

        })

    }

}

class Mongo {

    constructor() {
        this.db = ""
    }

    getDB() {
        return this.db
    }

    connectToMongo() {

        const client = new MongoClient(process.env.MONGO_URI)
        client.connect((err, db) => {
            if (err) throw err
            console.log("connected")
            this.db = db
        }) 

    }

}

class Main {

    static async init(server, db) {

        await db.connectToMongo()
        await server.connectToServer()
        server.listenEndpoints(db)

    }

}

module.exports = {
    Server, Mongo, Main
}


