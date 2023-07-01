import { Router } from 'express'
import usersController from '../../controllers/users.controller.js'
import passport from 'passport'

const router = Router()

router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  usersController.register.bind(usersController)
)

router.get('/failureregister', usersController.failureRegister)

router.get('/failurelogin', usersController.failureLogin)

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  usersController.login.bind(usersController)
)

router.get('/logout', usersController.logout.bind(usersController))

router.get(
  '/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] })
)

router.get(
  '/github-callback',
  passport.authenticate('github', { session: false }),
  usersController.githubCallback.bind(usersController)
)

router.get('/:userId', usersController.getUserById.bind(usersController))

router.post(
  '/password-recovery',
  usersController.requestPasswordReset.bind(usersController)
)

router.get(
  '/reset/:token',
  usersController.getUserByToken.bind(usersController)
)

router.post(
  '/reset-password',
  usersController.resetPassword.bind(usersController)
)

export default router
