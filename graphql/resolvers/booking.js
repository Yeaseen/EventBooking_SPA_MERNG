const mongoose = require('mongoose')
require('../../models/booking')

const { transformedBooking } = require('./merge')
const Booking = mongoose.model('Booking')

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    try {
      const bookings = await Booking.find()
      return bookings.map((booking) => {
        return transformedBooking(booking)
      })
    } catch (error) {
      throw err
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    try {
      const fetchedEvent = await Event.findById({ _id: args.eventId })
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      })
      const result = await booking.save()
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
      const event = transformedEvent(booking.event)
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (error) {
      throw err
    }
  }
}
