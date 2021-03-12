const start = () => {

    console.log(document.querySelector("#setWordButton"))
    console.log(document.querySelector("#getWordsButton"))

    document
        .querySelector("#setWordButton")
        .addEventListener("click", sendWord)

    document
        .querySelector("#getWordsButton")
        .addEventListener("click", displayWords)

    document
        .querySelector("#text")
        .addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendWord()
        })

}

const sendWord = () => {

    console.log("send")

    let input = document.querySelector("#text")

    let post = {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            word: input.value
        })

    }

    input.value = ""

    fetch("/setWord", post)
        .then(response => response.json())

}

const displayWords = () => {

    deletePrevious()

    let display = document.querySelector(".display")

    fetch("/getWords")
        .then(response => response.json())
        .then(data => {

            data.map(word => {

                let div = document.createElement("div")
                let text = document.createTextNode(word)
                div.appendChild(text)
                display.appendChild(div)

            }) 

        })

}

const deletePrevious = () => {

    let nodes = [...document.querySelectorAll(".display > *")]
    if (nodes) nodes.map(el => el.remove())

}


window.addEventListener("load", start)
