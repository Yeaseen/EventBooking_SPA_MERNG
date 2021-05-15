const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../../models/user')

const User = mongoose.model('User')

module.exports = {
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
  }
}
