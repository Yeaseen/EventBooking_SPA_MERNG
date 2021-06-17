const DataLoader = require('dataloader')
const mongoose = require('mongoose')
const { dateToString } = require('../../helpers/date')
require('../../models/user')
require('../../models/event')

const User = mongoose.model('User')
const Event = mongoose.model('Event')

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } })
})

const events = async (eventIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventIDs } })
    //console.log(events, eventIDs)
    events.sort((a, b) => {
      return (
        eventIDs.indexOf(a._id.toString()) - eventIDs.indexOf(b._id.toString())
      )
    })
    //console.log(';===========================================================')
    //console.log(events, eventIDs)
    return events.map((event) => {
      return transformedEvent(event)
    })
  } catch (err) {
    //console.log('Whats is going in events!')
    throw err
  }
}

const singleEvent = async (eventId) => {
  try {
    // console.log('IN SINGLE EVENT FUNCTION', eventId)
    const event = await eventLoader.load(eventId.toString())
    //console.log('SingleEvent', event)
    return event
  } catch (error) {
    //console.log('Whats is going in Sigle Event!')
    throw err
  }
}

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    }
  } catch (err) {
    throw err
  }
}

const transformedEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  }
}

const transformedBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

exports.transformedEvent = transformedEvent
exports.transformedBooking = transformedBooking

//exports.user = user
//exports.singleEvent = singleEvent
//exports.events = events
