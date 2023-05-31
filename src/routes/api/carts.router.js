import { Router } from 'express'
import passport from 'passport'
import cartController from '../../controllers/cart.controller.js'
import requireAuth from '../../middlewares/authMiddleware.js'
import ticketController from '../../controllers/ticket.controller.js'

const router = Router()
const authMiddleware = passport.authenticate('jwt', { session: false })

router.post('/', cartController.create.bind(cartController))

router.get('/oneCart/:id', cartController.getById.bind(cartController))

router.post(
  '/:cid/purchase',
  authMiddleware,
  ticketController.create.bind(ticketController)
)

router.get(
  '/:cid',
  authMiddleware,
  cartController.getByCid.bind(cartController)
)

router.post(
  '/:cid/product/:pid',
  cartController.addProduct.bind(cartController)
)

router.delete(
  '/',
  authMiddleware,
  cartController.deleteCart.bind(cartController)
)

router.delete(
  '/:cid/products/:id_product',
  authMiddleware,
  cartController.deleteProduct.bind(cartController)
)

router.put(
  '/',
  authMiddleware,
  cartController.validateProductArray.bind(cartController),
  cartController.updateCartProducts.bind(cartController)
)

router.put(
  '/products/:pid',
  authMiddleware,
  cartController.updateProductQuantity.bind(cartController)
)

export default router
