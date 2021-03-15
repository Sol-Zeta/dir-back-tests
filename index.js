// Node modules
const express = require('express')
const firebase = require('firebase')

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEOiG7njJDxdgpnPIeB1mzkUce057ftQI",
    authDomain: "urban-creatures.firebaseapp.com",
    projectId: "urban-creatures",
    storageBucket: "urban-creatures.appspot.com",
    messagingSenderId: "1020004665251",
    appId: "1:1020004665251:web:0b61cf95d0148b559f7c16",
    databaseURL: "https://urban-creatures-default-rtdb.europe-west1.firebasedatabase.app/"
}

const server = express()
const port = 8080
const staticFilesPath = express.static(__dirname + "/public")
server.use(staticFilesPath)
server.use(express.urlencoded({extended: false}))
server.use(express.json())

// Start Firebase and server
const init = async () => {

    // Initialize Firebase
    await firebase.initializeApp(firebaseConfig)
    server.listen(port, () => console.log(`Server started on port ${port}`))

}

// Endpoint 
// server.route("/word")
//     .get(function(req, res) {

//     })
//     .post(function(req, res) {
        
//     })
//     .put(function(req, res) {
        
//     })
//     .delete(function(req, res) {
        
//     })

server.get("/getWords", (req, res) => {
    
    let array
    let words = readFromFirebase(array)
    console.log(words)
    res.send(JSON.stringify({results: words}))

})

server.post("/setWord", (req, res) => {

    saveOnFirebase(req.body.id, req.body.word)
    res.send()

})

server.put("/updateWord", (req, res) => {

    saveOnFirebase(req.body.id, req.body.word)
    res.send(JSON.stringify({message: "update successfull"}))

})

server.delete("/deleteWord", (req, res) => {

    firebase.database().ref(`/webServer/${req.body.id}`).remove()
    res.send(JSON.stringify({message: "delete successful"}))
    
})

const readFromFirebase = (words) => {

    firebase.database().ref("/webServer").on("value", data => words = data.val())
    console.log(words)
    return words

}

const saveOnFirebase = (id, word) => {

    wordObject = {
        id: id,
        word: word
    }
    firebase.database().ref(`/webServer/${id}`).update(wordObject)

}

init()