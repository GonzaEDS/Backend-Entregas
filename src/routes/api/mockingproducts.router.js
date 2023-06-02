import { Router } from 'express'
import productsController from '../../controllers/products.controller.js'

const router = Router()

router.get('/', productsController.mockingProducts.bind(productsController))

export default router
