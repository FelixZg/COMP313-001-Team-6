const LocalStrategy = require('passport-local').Strategy
var { pool } = require('./dbConfig')
var bcrypt = require('bcrypt')

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if (err) {
          throw err
        } else {
          if (results.rows.length > 0) {
            let user = results.rows[0]
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                throw err
              } else {
                if (isMatch) {
                  return done(null, user)
                } else {
                  return done(null, false, { message: "The given password is incorrect" })
                }
              }
            })
          } else {
            return done(null, false, { message: "No user account was found for the given email address" })
          }
        }
      }
    )
  }
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    pool.query(
      `SELECT * FROM users WHERE id = $1`,[id], (err, results) => {
        if (err) {
          throw err
        } else {
          return done(null, results.rows[0])
        }
      }
    )
  })
}

module.exports = initialize