import { Router } from "express";
import { getCart, createCart, insertProductCart, updateProductCart, updateQuantityProductCart, deleteProductCart, deleteCart, checkoutCart } from "../controllers/cartsController.js";
import { authorization } from "../config/middleware.js";

const cartRouter = Router()

cartRouter.get('/:cid', getCart )
cartRouter.post('/', authorization("Usuario"), createCart )
cartRouter.post('/:cid/products/:pid', authorization("Usuario"), insertProductCart)
cartRouter.post('/:cid/checkout', authorization("Usuario"), checkoutCart)
cartRouter.put('/:cid', authorization("Usuario"), updateProductCart)
cartRouter.put('/:cid/products/:pid', authorization("Usuario"), updateQuantityProductCart )
cartRouter.delete('/:cid', authorization("Usuario"), deleteCart )
cartRouter.delete('/:cid/products/:pid', authorization("Usuario"), deleteProductCart )


export default cartRouter