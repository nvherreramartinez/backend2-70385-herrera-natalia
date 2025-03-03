import cartModel from '../models/cart.js'
import productModel from '../models/product.js'
import ticketModel from '../models/ticket.js'
import crypto from 'crypto'

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart)
            res.status(200).send(cart)
        else
            res.status(404).send("Carrito inexistente")
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const createCart = async (req, res) => {
    try {
        const rta = await cartModel.create({ products: [] })
        res.status(201).send(rta)
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if (indice != -1) {
                cart.products[indice].quantity = quantity
            } else {
                cart.products.push({ id_prod: productId, quantity: quantity })
            }
            const rta = await cartModel.findByIdAndUpdate(cartId, cart)
            return res.status(200).send(rta)
        } else {
            res.status(404).send("Carrito inexistente")
        }
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const updateProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const { newProduct } = req.body
        const cart = await cartModel.findOne({ _id: cartId })
        cart.products = newProduct
        cart.save()
        res.status(200).send(cart)
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const updateQuantityProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if (indice != -1) {
                cart.products[indice].quantity = quantity
                cart.save()
                res.status(200).send(cart)
            } else {
                res.status(404).send("Producto inexistente")
            }
        } else {
            res.status(404).send("Carrito inexistente")
        }
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if (indice != -1) {
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            } else {
                res.status(404).send("Producto inexistente")
            }
        } else {
            res.status(404).send("Carrito inexistente")
        }
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            cart.products = []
            cart.save()
            res.status(200).send(cart)
        } else {
            res.status(404).send("Carrito inexistente")
        }
    } catch (e) {
        res.status(500).render('templates/error', { e })
    }
}
export const checkoutCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        if (!cartId) {
            return res.status(400).send({ message: "ID de carrito no proporcionado" });
        }

        const cart = await cartModel.findById(cartId)
        if (!cart) {
            return res.status(404).send({ message: "Carrito inexistente" });
        }

        const prodStockNull = [];
        for (const prod of cart.products) {
            const producto = await productModel.findById(prod.id_product);
            if (!producto) {
                return res.status(404).send({ message: `Producto ${prod.id_product} no encontrado` });
            }
            if (producto.stock - prod.quantity < 0) {
                prodStockNull.push(producto.id);
            }
        }

        if (prodStockNull.length === 0) {
            let totalAmount = 0;
            for (const prod of cart.products) {
                const producto = await productModel.findById(prod.id_product);
                if (producto) {
                    producto.stock -= prod.quantity;
                    totalAmount += producto.price * prod.quantity;
                    await producto.save();
                }
            }

            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: totalAmount,
                products: cart.products
            });

            await cartModel.findByIdAndUpdate(cartId, { products: [] });
            return res.status(200).send(newTicket);
        } else {
            prodStockNull.forEach((prodId) => {
                cart.products = cart.products.filter(prod => prod.id_product !== prodId);
            });
            await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
            return res.status(400).render('templates/error', {
                message: "Algunos productos no tienen stock",
                productsWithoutStock: prodStockNull
            });
        }
    } catch (e) {
        console.error("Error en checkoutCart:", e);
        res.status(500).render('templates/error', { message: "Error en el checkout", error: e.message });
    }
};


