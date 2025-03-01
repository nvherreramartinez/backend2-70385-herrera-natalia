import e, { Router } from "express";
import productRouter from "./products.routes.js";
import sessionRouter from "./sessions.routes.js";
import cartRouter from "./carts.routes.js";
import path from 'path';
import { __dirname } from "../path.js";

const indexRouter = Router()

indexRouter.use('/api/products', productRouter)
indexRouter.use('/api/sessions', sessionRouter)
indexRouter.use('/api/carts', cartRouter)

export default indexRouter
