import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils/crypto.js'
import userManager from '../../src/dao/user.manager.js'

const LocalStrategy = local.Strategy

export function configurePassport() {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, email, password, done) => {
        try {
          const { username } = req.body
          console.log('passport.config.js req.body', req.body)
          const data = await userManager.registerUser(username, email, password)

          // If the registration failed (e.g. the user already exists)
          if (data.message) {
            return done(null, false, { message: data.message })
          }

          // If the registration was successful, return the registered user
          return done(null, data.user)
        } catch (error) {
          done(error)
        }
      }
    )
  )
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email: email })
          if (!user) {
            console.log('User did not exist in the login')
            return done(null, false)
          }
          if (!isValidPassword(password, user.password)) {
            console.log('invalid password')
            return done(null, false)
          }
          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, { userId: user._id, cartId: user.cartId })
  })

  passport.deserializeUser(async (data, done) => {
    try {
      const user = await userModel.findOne({ _id: data.userId })
      if (!user) {
        return done(new Error('User not found'))
      }
      user.cartId = data.cartId
      done(null, user)
    } catch (error) {
      console.error('Error in deserializeUser:', error)
      done(error)
    }
  })
}
