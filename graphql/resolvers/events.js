const mongoose = require('mongoose')
require('../../models/event')

const Event = mongoose.model('Event')
const { transformedEvent } = require('./merge')

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map((event) => {
        return transformedEvent(event)
      })
    } catch (err) {
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

      createdEvent = transformedEvent(result)
      const creator = await User.findById('609f61da4263fa0a88e0af1d')
      if (!creator) {
        throw new Error('Creator not FOUND!')
      }
      creator.createdEvents.push(event)
      await creator.save()
      return createdEvent
    } catch (err) {
      throw err
    }
  }
}
