const start = () => {

    document
        .querySelector("#setWordButton")
        .addEventListener("click", sendWord)

    document
        .querySelector("#getWordsButton")
        .addEventListener("click", displayWords)

}

const sendWord = () => {

    console.log("send")

    let post = {

        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word: document.querySelector("#setWordButton").value
        })

    }

    fetch("localhost:8080/setWord", post)
        .then(response => response.json())

}

const displayWords = (arrayWords) => {

    fetch("localhost:8080/getWords")
        .then(response => response.json())
        .then(data => (data))

    let display = document.querySelector(".display")

    arrayWords.map(word => {

        let div = document.createElement("div")
        let text = document.createTextNode(word)
        div.appendChild(text)
        display.appendChild(div)

    })

}


document.addEventListener("load", start)