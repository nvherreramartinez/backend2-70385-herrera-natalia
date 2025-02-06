import { Router } from "express";
import { getCart, createCart, inserProductCart, updateProductCart, updateQuantityProductCart, deleteProductCard, deleteCart } from "../controllers/cartsController.js";
import { authorization } from "../config/middleware.js";

const cartRouter = Router()

cartRouter.get('/:cid', getCart )
cartRouter.post('/', createCart )
cartRouter.post('/:cid/products/:pid', insertProductCart)
cartRouter.put('/:cid', updateProductCart)
cartRouter.put('/:cid/products/:pid', updateQuantityProductCart )
cartRouter.delete('/:cid', deleteCart )
cartRouter.delete('/:cid/products/:pid', deleteProductCart )

export default cartRouter