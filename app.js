const { query } = require('express')
const express = require('express')
require("dotenv").config()
const bcrypt = require('bcryptjs')

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


require('./models/event')
require('./models/user')
const Event = mongoose.model("Event")
const User = mongoose.model("User")

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
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
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event
                .find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc }
                    })
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '609f3c66096895042b10f2a4'
            })

            let createdEvent

            return event
                .save()
                .then(result => {
                    //console.log(result)
                    createdEvent = { ...result._doc }
                    return User.findById('609f3c66096895042b10f2a4')
                })
                .then(user =>{
                    if(!user){
                        throw new Error('User not FOUND!')
                    }
                    user.createdEvents.push(event)
                    return user.save()
                })
                .then(result =>{
                    return createdEvent
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },
        createUser: (args) => {

            return User.findOne({ email: args.userInput.email })
                .then(savedUser => {
                    if (savedUser) {
                        throw new Error('User already Exists')
                    }

                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save()
                })
                .then(result => {
                    //console.log(result)
                    return { ...result._doc, password: null }
                })
                .catch(err => {
                    throw err
                })

        }
    },
    graphiql: true
}))

app.get('/', (req, res, next) => {
    res.send('Welcome to the NODE Server')
})

app.listen(PORT, () => {
    console.log("Server is running on", PORT)
})



