const {Server, Mongo, Main} = require("./src/server/webServerMongo")

const server = new Server()
const db = new Mongo()

Main.init(server, db)