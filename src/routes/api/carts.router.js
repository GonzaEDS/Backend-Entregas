import { Router } from 'express'
import passport from 'passport'
import cartController from '../../controllers/cart.controller.js'
import requireAuth from '../../middlewares/authMiddleware.js'

const router = Router()
const authMiddleware = passport.authenticate('jwt', { session: false })

router.post('/', cartController.create.bind(cartController))

router.get('/oneCart/:id', cartController.getById.bind(cartController))

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
  requireAuth,
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
  requireAuth,
  cartController.updateProductQuantity.bind(cartController)
)

export default router
