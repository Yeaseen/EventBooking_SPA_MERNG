const mongoose = require('mongoose')
require('../../models/booking')
require('../../models/event')
const Event = mongoose.model('Event')
const { transformedBooking, transformedEvent } = require('./merge')
const Booking = mongoose.model('Booking')

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    try {
      const bookings = await Booking.find({ user: req.userId })
      //console.log(bookings)
      return bookings.map((booking) => {
        return transformedBooking(booking)
      })
    } catch (error) {
      //console.log('Whats is going in bookings!')
      throw err
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    //console.log('Athentication barrier passed')
    try {
      //console.log(args.eventId)
      const fetchedEvent = await Event.findOne({ _id: args.eventId })
      //console.log(fetchedEvent)
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      })
      const result = await booking.save()
      //console.log(result)
      return transformedBooking(result)
    } catch (error) {
      throw err
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event')
      //console.log(booking)
      const event = transformedEvent(booking.event)
      //console.log(event)
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (error) {
      throw err
    }
  }
}
