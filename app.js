const { query } = require('express')
const express = require('express')
require('dotenv').config()
const isAuth = require('./middleware/requireLogin')
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
  console.log('Connected to mongodb !!')
})
mongoose.connection.on('error', (err) => {
  console.log('err connecting', err)
})

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: false
  })
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log('Server is running on', PORT)
})
