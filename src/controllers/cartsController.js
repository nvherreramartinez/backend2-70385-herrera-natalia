import cartModel from '../models/cart.js'
import productModel from '../models/product.js'
import ticketModel from '../models/ticket.js'  
import crypto from 'crypto' 

export const getCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart)
            res.status(200).send(cart)
        else
            res.status(404).send("Carrito inexistente")
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const createCart = async (req, res) => {
    try{
        const rta = await cartModel.create({products: []})
        res.status(201).send(rta)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const insertProductCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1){
                cart.products[indice].quantity = quantity
            }else{
                cart.products.push({id_prod: productId, quantity: quantity})
            }
            const rta = await cartModel.findByIdAndUpdate(cartId, cart)
            return res.status(200).send(rta)
        }else{
            res.status(404).send("Carrito inexistente")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const updateProductCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const {newProduct} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        cart.products = newProduct
        cart.save()
        res.status(200).send(cart)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const updateQuantityProductCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1){
                cart.products[indice].quantity = quantity
                cart.save()
                res.status(200).send(cart)
            }else{
                res.status(404).send("Producto inexistente")
            }
        }else{
            res.status(404).send("Carrito inexistente")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const deleteProductCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1){
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            }else{
            res.status(404).send("Producto inexistente")
            }
        }else{
            res.status(404).send("Carrito inexistente")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const deleteCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            cart.products = []
            cart.save()
            res.status(200).send(cart)
        }else{
            res.status(404).send("Carrito inexistente")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const checkoutCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products.id_prod');

        if (!cart) {
            return res.status(404).render('templates/error', { message: "Carrito inexistente" });
        }
        let totalAmount = 0;
        const prodStockNull = [];

        for (const prod of cart.products) {
            const producto = prod.id_prod;
            if (!producto || producto.stock < prod.quantity) {
                prodStockNull.push(producto._id);
            }
        }

        if (prodStockNull.length === 0) {

            for (const prod of cart.products) {
                const producto = prod.id_prod;
                producto.stock -= prod.quantity;
                totalAmount += producto.price * prod.quantity;
                await producto.save();
            }

            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: totalAmount,
                products: cart.products
            });

            await cartModel.findByIdAndUpdate(cartId, { products: [] });

            return res.status(200).render('templates/ticket', { ticket: newTicket });
        } else {

            cart.products = cart.products.filter(prod => !prodStockNull.includes(prod.id_prod._id));

            await cartModel.findByIdAndUpdate(cartId, { products: cart.products });

            return res.status(400).render('templates/error', {
                message: "Algunos productos no tienen stock",
                productsWithoutStock: prodStockNull
            });
        }
    } catch (e) {
        res.status(500).render('templates/error', { message: "Error en el checkout", error: e.message });
    }
};