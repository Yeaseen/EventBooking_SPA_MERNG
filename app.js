const { query } = require('express')
const express = require('express')
require("dotenv").config()

const PORT = process.env.PORT || 5000
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log("Connected to mongodb !!")
})
mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})



const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))


app.get('/', (req, res, next) => {
    res.send('Welcome to the NODE Server')
})

app.listen(PORT, () => {
    console.log("Server is running on", PORT)
})



