const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { pool } = require('./dbConfig')
const { body, validationResult } = require('express-validator')
const session = require('express-session')

app.use(express.urlencoded( { extended: false }))

app.get('/', (req, res) => {
  console.log("Got a GET request for the homepage")
  res.send('Hello GET')
})

app.post('/signup', [
  body('email').isEmail().withMessage("Invalid email address"),
  body('password').isLength({ min: 6 }).withMessage("The password length must be 6 characters or longer").custom((value, { req, loc, path}) => {
    if (value !== req.body.confirmPassword) {
      throw new Error("Passwords don't match")
    } else {
      return value
    }
  }),
], (req, res) => {
  var errors = validationResult(req).array()
  if (errors.length > 0) {
    console.log(errors)
  } else {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    console.log(email, password, confirmPassword)
  }
})

app.listen(3000, () => console.log(`App listening on port ${PORT}!`))