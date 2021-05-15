const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

mongoose.model("Event",eventSchema)



//createEvent(eventInput: {title: "Why do u care?", description: "That's not true at all", price: 33.50, date: "2021-05-14T20:54:15.586Z"}) {
    //       title
    //       description
    //     }

    // mutation {
    //     createEvent(eventInput: {title: "What's this", description: "Simple matter", price: 13.50, date: "2021-04-14T20:54:15.586Z"}) {
    //         title
    //       creator {
    //         email
    //       }
    //     }
    //   }