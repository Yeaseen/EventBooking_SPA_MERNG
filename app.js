const { query } = require('express')
const express = require('express')
require("dotenv").config()

const PORT = process.env.PORT || 5000
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()
const events = [] 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// mutation {
//     createEvent(eventInput: {title: "Why do u care?", description: "That's not true at all", price: 33.50, date: "2021-05-14T20:54:15.586Z"}) {
//       title
//       description
//     }
  
//   }

// query {
//     events {
//         _id
//         date
//     }
// }

app.use('/graphql', graphqlHTTP ({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!        
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return events
        },
        createEvent: (args) =>{
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event)
            //console.log(args)
            return event 
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



