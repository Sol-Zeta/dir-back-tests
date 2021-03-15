let id = 0

const start = () => {

    document
        .querySelector("#setWordButton")
        .addEventListener("click", sendWord)

    document
        .querySelector("#getWordsButton")
        .addEventListener("click", displayWords)

    document
        .querySelector("#input")
        .addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendWord()
        })

}

const sendWord = () => {

    let input = document.querySelector("#input")

    let method = {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            word: input.value
        })

    }

    input.value = ""
    id++

    fetch("/setWord", method)
        // .then(response => response.json())
        // .catch(er => displayMessage(er))

}

const displayWords = () => {

    deletePrevious()

    let display = document.querySelector(".display")

    fetch("/getWords")
        .then(response => response.json())
        .then(data => {

            console.log(data)

            data.results.map(word => {

                let wrapper = document.createElement("div")
                    wrapper.classList.add("wordWrapper")

                let div = document.createElement("div")
                    div.classList.add("word")
                    div.setAttribute("data-value", word.id)
                let text = document.createTextNode(word.word)

                let modifyButton = document.createElement("input")
                    modifyButton.setAttribute("type", "button")
                    modifyButton.setAttribute("value", "Mod")
                    modifyButton.classList.add("taskButton")
                    modifyButton.addEventListener("click", () => displayUpdateInterface(div))

                let deleteButton = document.createElement("input")
                    deleteButton.setAttribute("type", "button")
                    deleteButton.setAttribute("value", "Del")
                    deleteButton.classList.add("taskButton")
                    deleteButton.addEventListener("click", () => deleteWord(div))

                div.appendChild(text)
                wrapper.appendChild(div)
                wrapper.appendChild(modifyButton)
                wrapper.appendChild(deleteButton)
                display.appendChild(wrapper)

            }) 

        })

}

const displayUpdateInterface = (div) => {

    let wordWrapper = document.querySelector(".wordWrapper")
    let id = div.getAttribute("data-value")
    let word = div.textContent
    div.remove()
    
    let input = document.createElement("input")
        input.classList.add("word")
        input.setAttribute("type", "text")
        input.setAttribute("value", word)
    wordWrapper.appendChild(input)

    let buttons = [...document.querySelectorAll(".taskButton")]
        buttons.map(el => el.remove())
    let acceptButton = document.createElement("input")
        acceptButton.classList.add("taskButton")
        acceptButton.setAttribute("type", "button")
        acceptButton.setAttribute("value", "Accept")
        acceptButton.addEventListener("click", () => updateWord(id, input.value))
    let cancelButton = document.createElement("input")
        cancelButton.classList.add("taskButton")
        cancelButton.setAttribute("type", "button")
        cancelButton.setAttribute("value", "Cancel")
        cancelButton.addEventListener("click", displayWords)

    wordWrapper.appendChild(acceptButton)
    wordWrapper.appendChild(cancelButton)


}

const updateWord = (id, value) => {

    let method = {

        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            word: value
        })

    }

    fetch("/updateWord", method)
        .then(response => response.json())
        .then(data => displayMessage(data))
        .catch(er => displayMessage(er))

}

const deleteWord = (div) => {


    let method = {

        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: div.getAttribute("data-value"),
            word: div.textContent
        })

    }

    fetch("/deleteWord", method)
        .then(response => response.json())
        .then(data => displayMessage(data))
        .catch(er => displayMessage(er))

}

const displayMessage = (message) => {

    let messageNode = document.createElement("div")
        messageNode.classList.add("message")
    let messageText = document.createTextNode(message.message)
    let okButton = document.createElement("input")
        okButton.classList.add("taskButton")
        okButton.setAttribute("type", "button")
        okButton.setAttribute("value", "OK")
        okButton.addEventListener("click", displayWords)
    messageNode.appendChild(messageText)
    messageNode.appendChild(okButton)
    document.querySelector("body").appendChild(messageNode)

}

const deletePrevious = () => {

    let nodes = [...document.querySelectorAll(".display > *, .message")]
    if (nodes) nodes.map(el => el.remove())

}


window.addEventListener("load", start)
