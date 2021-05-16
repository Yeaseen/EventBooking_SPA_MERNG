const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  const authorization = req.get('Authorization')
  //authorization = Bearer hdjhsabdjh(generated token from jsonwebtoken)
  if (!authorization) {
    req.isAuth = false
    return next()
  }
  const token = authorization.replace('Bearer ', '')

  if (!token || token === '') {
    req.isAuth = false
    return next()
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    req.isAuth = false
    return next()
  }

  if (!decodedToken) {
    req.isAuth = false
    return next()
  }

  req.isAuth = true
  req.userId = decodedToken.userId
  next()
}
