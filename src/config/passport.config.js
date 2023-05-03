import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/users.model.js'
import { isValidPassword } from '../utils/crypto.js'
import userManager from '../../src/dao/user.manager.js'
import github from 'passport-github2'
import axios from 'axios'
import jwt from 'passport-jwt'

const LocalStrategy = local.Strategy
const GitHubStrategy = github.Strategy
const JWTStrategy = jwt.Strategy
export function configurePassport() {
  // passport.use(
  //   'register',
  //   new LocalStrategy(
  //     {
  //       passReqToCallback: true,
  //       usernameField: 'email'
  //     },
  //     async (req, email, password, done) => {
  //       try {
  //         const { username } = req.body
  //         console.log('passport.config.js req.body', req.body)
  //         const data = await userManager.registerUser(username, email, password)
  //         console.log('passport.config.js const data:', data)

  //         // If the registration failed (e.g. the user already exists)
  //         if (data.message) {
  //           return done(null, false, { message: data.message })
  //         }

  //         // If the registration was successful, return the registered user
  //         return done(null, data.user)
  //       } catch (error) {
  //         done(error)
  //       }
  //     }
  //   )
  // )
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
          const data = await userManager.registerUser(
            req.res,
            username,
            email,
            password
          ) // Pass req.res to the registerUser method
          console.log('passport.config.js const data:', data)

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
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, email, password, done) => {
        try {
          const data = await userManager.loginUser(req.res, email, password)

          // If the login failed (e.g. the email or password is incorrect)
          if (data && data.message) {
            return done(null, false, { message: data.message })
          }

          // If the login was successful, return the logged-in user
          if (data && data.user) {
            // If the login was successful, set the cookie and return the logged in user
            req.res.cookie('AUTH', data.token, data.cookieOptions)
            return done(null, data.user)
          }

          // In case the data object is undefined or has an unexpected structure
          return done(
            new Error('Unexpected response from userManager.loginUser')
          )
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/users/github-callback',
        scope: ['user:email'] // Request the user's email
      },
      async (accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        try {
          // create user using the GitHub profile
          let user = await userModel.findOne({ githubId: profile.id })

          if (!user) {
            const email =
              profile.emails && profile.emails[0] ? profile.emails[0].value : ''

            // check if email exists
            user = await userModel.findOne({ email: email })

            if (user) {
              user.githubId = profile.id
              await user.save()
            } else {
              // create a new cart
              const createdCart = await axios.post('/api/carts')
              const cartId = createdCart.data.id

              user = await userModel.create({
                username: profile.username,
                email,
                githubId: profile.id,
                cartId
              })
            }
          }

          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  // passport.use(
  //   'jwt',
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: jwt.ExtractJwt.fromExtractors([
  //         jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  //         cookieExtractor
  //       ]),
  //       secretOrKey: process.env.JWT_SECRET
  //     },
  //     async (payload, done) => {
  //       try {
  //         const user = await userModel.findOne({ _id: payload.userId })
  //         if (!user) {
  //           return done(null, false)
  //         }
  //         done(null, user)
  //       } catch (error) {
  //         return done(error)
  //       }
  //     }
  //   )
  // )
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await userModel.findOne({ _id: payload._id })
          if (!user) {
            return done(null, false)
          }
          user.cartId = payload.cartId //
          done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  //serialize and deserialize

  //   passport.serializeUser((user, done) => {
  //     done(null, { userId: user._id, cartId: user.cartId })
  //   })

  //   passport.deserializeUser(async (data, done) => {
  //     try {
  //       const user = await userModel.findOne({ _id: data.userId })
  //       if (!user) {
  //         return done(new Error('User not found'))
  //       }
  //       user.cartId = data.cartId
  //       done(null, user)
  //     } catch (error) {
  //       console.error('Error in deserializeUser:', error)
  //       done(error)
  //     }
  //   })
}

function cookieExtractor(req) {
  return req?.cookies?.['AUTH']
}
