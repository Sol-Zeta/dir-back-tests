const http = require('http')
const nodemailer = require('nodemailer')
const host = "localhost"
const port = 8080

const server = http.createServer((req, res) => {

    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(`<p> correcto </p>`)
    transporter()
    res.end()

})

async function transporter() {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "pruebas",
            pass: "pruebas"
        }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo" <foo@example.com>', // sender address
        to: "thirdsecond117@gmail.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    })

}

server.listen(port, host, () => console.log(`Server is running at ${host} port ${port}`))