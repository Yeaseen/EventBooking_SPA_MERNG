const { query } = require('express')
const express = require('express')
require("dotenv").config()
require('./models/event')
const PORT = process.env.PORT || 5000
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
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

const Event = mongoose.model("Event")

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
            return Event
                    .find()
                    .then(events =>{
                        return events.map(event =>{
                            return { ...event._doc }
                        })
                    })
                    .catch(err =>{
                        console.log(err)
                        throw err
                    })
        },
        createEvent: (args) =>{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })

            return event
                    .save()
                    .then(result =>{
                      //console.log(result)
                        return { ...result._doc }
                    })
                    .catch(err =>{
                       console.log(err)
                       throw err
                    })
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



