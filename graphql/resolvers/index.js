const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../../models/event')
require('../../models/user')

const Event = mongoose.model("Event")
const User = mongoose.model("User")


const events = async eventIDs => {

    try {
        const events = await Event.find({ _id: {$in: eventIDs} })
         return events.map(event =>{
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {
        throw err
    }
}

const user = async userId => {

    try {
        const user = await User.findById(userId)
            return { 
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents)
            }
    } catch (err) {
        throw err
    }
    
}



module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
                return events.map(event => {
                    return { 
                        ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event.creator)
                    }
                })
            
        }  catch (err) {
            throw err
        }
        
            
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '609f61da4263fa0a88e0af1d'
        })

        let createdEvent

        try {
            const result = await event.save()
            
            createdEvent = { 
                ...result._doc, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
            const creator = await User.findById('609f3c66096895042b10f2a4')
                if(!creator){
                    throw new Error('Creator not FOUND!')
                }
                creator.createdEvents.push(event)
                await creator.save()
                return createdEvent
        } catch (err) {
            throw err
        }
    },
    createUser: async (args) => {
        try {
            const savedUser = await User.findOne({ email: args.userInput.email })
            if(savedUser) {
                throw new Error('User already Exists')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return { ...result._doc, password: null }        
        } catch (err) {
            throw err
            
        }

    }
}