export * from "./fetchAPI"

const firebase = require("firebase/app");

let arrayAcceptedWords = ["people", "planets", "species"]

const start = () => {

    // Retrieve DOM nodes from HTML
    const acceptedWords = document.querySelector(".acceptedWords")
    const input = document.querySelector("#searchInput")
    const searchButton = document.querySelector("#searchButton")
    const resetButton = document.querySelector("#resetButton")

    // Create Dom nodes for accepted words
    arrayAcceptedWords.map(el => {
        let div = document.createElement("div")
        let text = document.createTextNode(el)
        div.appendChild(text)
        acceptedWords.appendChild(div)
    })

    // Events
    input.addEventListener("keypress", (e) => {if (e.key === "Enter") getMasterData(input.value.toLowerCase())})
    searchButton.addEventListener("click", () => getMasterData(input.value.toLowerCase()))
    resetButton.addEventListener("click", reset)

    // Start logic
    getSavedSearch()

}

const getMasterData = input => {

    fetch(`https://swapi.dev/api/${input}/`)
        .then(response => response.json())
        .then(data => displayMaster(data))

}

const displayMaster = (data) => {

    let results = data.results
    deletePreviousNodes()
    let nodes = [...createMasterNodes(results)]
    sortMasterNodes(nodes)
    saveSearch(data)

} 

const createMasterNodes = (results) => {

    // count for id
    let count = 1
    let nodes = []
    const input = document.querySelector("#searchInput")

    // data.results
    if (results) {

        results.map(el => {

            let resultsWrapper = document.createElement("div")
                resultsWrapper.setAttribute("class", "masterSearch")
            let resultDiv = document.createElement("div")
                resultDiv.setAttribute("class", "resultDiv")
                resultDiv.setAttribute("id", `${count}`)
                resultDiv.setAttribute("data-value", "0")
            let resultText = document.createTextNode(`${el.name} *** ${input.value}`)
            let favButton = document.createElement("input")
                favButton.setAttribute("type", "button")
                favButton.setAttribute("id", "favButton")
            resultDiv.appendChild(resultText)
            resultsWrapper.appendChild(resultDiv)
            resultsWrapper.appendChild(favButton)
            nodes.push(resultsWrapper)

            // Events for buttons
            resultDiv.addEventListener("click", () => getDetailsData(resultDiv))
            favButton.addEventListener("click", () => saveFavorite(el, favButton))
            count++

    })

    } else {

        // If there isn't data stored or from fetch, display "no data"
        let div = document.createElement("div")
        div.setAttribute("class", "masterSearch")
        let text = document.createTextNode("No data")
        div.appendChild(text)
        let results = document.querySelector(".results")
        results.appendChild(div)

    }

    return nodes

} 

const sortMasterNodes = (nodes) => {

    let favoritesFirebase = [], favorites = [], results = document.querySelector(".results")
    firebase.database().ref("favorites").on("value", data => favoritesFirebase.push(data.val()))
    for (let el in favoritesFirebase[0])
        favorites.push(el)

    nodes.map(node => {
        let name = node.firstChild.textContent.substring(0, node.firstChild.textContent.indexOf(" ")).trimEnd()
        favorites.map(favorite => {
            if (name === favorite) {
                node.lastChild.classList.add("favorite")
                results.appendChild(node)
                nodes.splice(nodes.indexOf(node), 1)
            }
        })
    })

    nodes.map(el => results.appendChild(el))

}

const getDetailsData = (selection) => {

    let selectionID = selection.getAttribute("id")
    let selectionType = selection.textContent
    selectionType = selectionType.substring(selectionType.lastIndexOf(" ")).trimStart()
    fetch(`https://swapi.dev/api/${selectionType}/${selectionID}/`)
        .then(response => response.json())
        .then(data => displayDetails(data))

}

const displayDetails = (data) => {

    deletePreviousNodes()

    let results = document.querySelector(".results")
    let div = document.createElement("div")
        div.setAttribute("class", "detailsSearch")
    let text = document.createTextNode(`${data.name} ***** Films: ${data.films.map(el => `  ${el}`)}`)
        div.appendChild(text)
    let button = document.createElement("input")
        button.setAttribute("id", "backButton")
        button.setAttribute("type", "button")
        button.setAttribute("value", "back")
        button.addEventListener("click", getSavedSearch)
    let favButton = document.createElement("input")
        favButton.setAttribute("type", "button")
        favButton.setAttribute("id", "favButtonDetails")
    results.appendChild(div)
    results.appendChild(button)
    results.appendChild(favButton)

}

const deletePreviousNodes = () => {

    let nodes = [...document.querySelectorAll(".masterSearch, .detailsSearch, #favButton, #favButtonDetails, #backButton")]
    nodes.map(el => el.remove())

}

const saveSearch = (data) => {

    localStorage.setItem("storedSearch", JSON.stringify(data))

}

const getSavedSearch = () => {

    const storedSearch = JSON.parse(localStorage.getItem("storedSearch")) || []
    displayMaster(storedSearch)

}

// If user has clicked on favButton, change bg-color and update array and firebase
const saveFavorite = (element, button) => {

    if (button.getAttribute("class")) {
        button.classList.remove("favorite")
        firebase.database().ref(`favorites/${element.name}`).remove()
    }
    else {
        button.classList.add("favorite")
        firebase.database().ref(`favorites/${element.name}`).update(element)
    }

}

const reset = () => {

    localStorage.clear()
    document.querySelector("#searchInput").value = ""
    deletePreviousNodes()

}


window.addEventListener("load", start)