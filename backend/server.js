var express = require('express')
var app = express()
var { pool } = require('./dbConfig')
var { body, validationResult } = require('express-validator')
var session = require('express-session')
var bcrypt = require('bcrypt')
var passport = require('passport')

const PORT = process.env.PORT || 3000
const initialize = require('./passportConfig')

initialize(passport)

app.use(express.urlencoded( { extended: false }))
app.use(express.json())
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

app.post('/login', (req, res) => {
  passport.authenticate('local', (error, user, info,) => {
    if (error) {
      console.log(error)
      res.sendStatus(500)
    } else if (user) {
      console.log(user)
      res.sendStatus(200)
    } else {
      console.log(info)
      res.sendStatus(500)
    }
  })(req, res)
})

app.get('/cards', (req, res) => {
  pool.query(
    `SELECT * FROM cards`, (err, results) => {
      if (err) {
        throw err
      } else if (results.rows.length > 0) {
        res.send(results.rows)
      } else {
        res.status(200).json({ response: "empty database" })
      }
    }
  )
  
})

app.post('/cards', (req, res) => {
  let id = req.body.id
  let title = req.body.title
  let content = req.body.content
  let tags = req.body.tag
  let alarmTime = req.body.date
  let star = req.body.priority
  let noCount = req.body.noCount
  pool.query(
    `INSERT INTO cards (id, title, content, tags, alarmTime, star, noCount)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, content, tags, alarmtime, star, nocount`, [id, title, content, tags, alarmTime, star, noCount],
    (err) => {
      if (err) {
        res.status(400).json({ test: "bad req yo"})
        throw err       
      } else {
        console.log("success")
        res.status(200).json({ response: "Card successfully uploaded to the database"})
      }
    }
  )
})

app.delete('/cards', (req, res) => {

})

app.listen(3000, () => console.log(`App listening on port ${PORT}!`))