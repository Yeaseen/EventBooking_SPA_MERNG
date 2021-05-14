const express = require('express')
require("dotenv").config()

const PORT = process.env.PORT || 5000
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/graphql', graphqlHTTP ({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return ['No Country for Old Men', 'New York Gangs', 'There will be BLOOD']
        },
        createEvent: (args) =>{
            const eventName = args.name 
            return eventName
        }
    },
    graphiql: true
}))

app.get('/', (req, res, next) =>{
    res.send('Welcome to the NODE Server')
})

app.listen(PORT, () => {
	console.log("Server is running on", PORT)
})

