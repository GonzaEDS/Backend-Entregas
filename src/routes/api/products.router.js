import { Router } from 'express'
import productsController from '../../controllers/products.controller.js'

const router = Router()

router.post('/', productsController.create.bind(productsController))

router.put('/:pid', productsController.updateById.bind(productsController))

router.delete('/:pid', productsController.deleteById.bind(productsController))

router.get('/', productsController.getAll.bind(productsController))

router.get('/:pid', productsController.getById.bind(productsController))

export default router
