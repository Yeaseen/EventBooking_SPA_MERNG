const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../../models/event')
require('../../models/user')

const Event = mongoose.model("Event")
const User = mongoose.model("User")

const events = eventIDs => {
    return Event.find({ _id: {$in: eventIDs} })
                .then(events =>{
                    return events.map(event =>{
                        return {
                            ...event._doc,
                            date: new Date(event._doc.date).toISOString(),
                            creator: user.bind(this, event.creator)
                        }
                    })
                })
                .catch(err =>{
                    throw err
                })
}

const user = userId => {
    return User.findById(userId)
        .then(user =>{
            return { 
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents)
            }
        })
        .catch(err =>{
            throw err
        })
}



module.exports = {
    events: () => {
        return Event
            .find()
            .then(events => {
                return events.map(event => {
                    return { 
                        ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event.creator)
                    }
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
                createdEvent = { 
                    ...result._doc, 
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator) 
                }
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
}