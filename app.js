const express = require('express')
const bodyParser = require('body-parser')
require("dotenv").config()
const app = express()

const PORT = process.env.PORT || 5000



app.use(bodyParser.json())

app.get('/', (req, res, next) =>{
    res.send('WELCOME TO THE WORLD OF NODE SERVER')
})
app.listen(PORT, () => {
	console.log("Server is running on", PORT)
})

