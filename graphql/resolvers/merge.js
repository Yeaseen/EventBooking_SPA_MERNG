const mongoose = require('mongoose')
const { dateToString } = require('../../helpers/date')
require('../../models/user')
require('../../models/event')

const User = mongoose.model('User')
const Event = mongoose.model('Event')

const events = async (eventIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventIDs } })
    return events.map((event) => {
      return transformedEvent(event)
    })
  } catch (err) {
    throw err
  }
}

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return transformedEvent(event)
  } catch (error) {
    throw err
  }
}

const user = async (userId) => {
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
