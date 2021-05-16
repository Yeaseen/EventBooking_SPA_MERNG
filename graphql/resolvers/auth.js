const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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
  },
  login: async ({ email, password }) => {
    //console.log(email)
    const savedUser = await User.findOne({ email: email })
    if (!savedUser) {
      throw new Error('Invalid Email or Password')
    }
    const isEqual = await bcrypt.compare(password, savedUser.password)
    if (isEqual) {
      throw new Error('Invalid Email or Password')
    }
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )
    return {
      userId: savedUser._id,
      token: token,
      tokenExpiration: 1
    }
  }
}
