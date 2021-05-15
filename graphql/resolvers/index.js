const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../../models/event')
require('../../models/user')
require('../../models/booking')

const Event = mongoose.model('Event')
const User = mongoose.model('User')
const Booking = mongoose.model('Booking')

const events = async (eventIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventIDs } })
    return events.map((event) => {
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

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return {
      ...event._doc,
      creator: user.bind(this, event.creator)
    }
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

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        }
      })
    } catch (err) {
      throw err
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        }
      })
    } catch (error) {
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
      if (!creator) {
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
      if (savedUser) {
        throw new Error('User already Exists')
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      })
      const result = await user.save()
      return {
        ...result._doc,
        password: null
      }
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findById({ _id: args.eventId })
      const booking = new Booking({
        user: '609f3c66096895042b10f2a4',
        event: fetchedEvent
      })
      const result = await booking.save()
      return {
        ...result._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString()
      }
    } catch (error) {
      throw err
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event')
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator)
      }
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (error) {
      throw err
    }
  }
}
