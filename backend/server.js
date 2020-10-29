var express = require('express')
var app = express()
var { pool } = require('./dbConfig')
var { body, validationResult } = require('express-validator')
var session = require('express-session')
var bcrypt = require('bcrypt')
var passport = require('passport')

const PORT = process.env.PORT || 3000
const INITIALIZE_PASSPORT = require('./passportConfig')

INITIALIZE_PASSPORT(passport)

app.use(express.urlencoded( { extended: false }))
app.use(session( {
  secret: 'secret', resave: false, saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/signup', [
  body('email').isEmail().withMessage("Invalid email address"),
  body('password').isLength({ min: 6 }).withMessage("The password length must be 6 characters or longer").custom((value, { req, loc, path}) => {
    if (value !== req.body.confirmPassword) {
      throw new Error("Passwords don't match")
    } else {
      return value
    }
  }),
], async (req, res) => {
  var errors = validationResult(req).array()
  if (errors.length > 0) {
    console.log(errors)
  } else {
    let email = req.body.email
    let password = req.body.password
    let hashedPassword = await bcrypt.hash(password, 5)
    
    pool.query(
      `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log(results.rows)
        }
        if (results.rows.length > 0){
          console.log("An account using this email address already exists")
        } else {
          pool.query(
            `INSERT INTO users (email, password) 
            VALUES ($1, $2)
            RETURNING id, password`, [email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err
              } else {
                console.log(results.rows)
              }           
            }
          )
        }
      }
    )
  }
})

app.post('/login', passport.authenticate('local', (error, user, info) => {
  if (error) {
    console.log(error)
  } else if (user) {
    console.log(user)
  } else {
    console.log(info)
  }
}))

app.listen(3000, () => console.log(`App listening on port ${PORT}!`))
