import express from "express";
import passport from "passport";
import path from "./path.js";
import cookieParser from "cookie-parser";
import { create } from "express-handlebars";
import initalizatePassport from "../config/passport.config.js";
import sessionRouter from "../routes/sessions.routes.js";
import cartRouter from "../routes/carts.routes.js";
import productRouter from "../routes/products.routes.js";
import MongoStore from "connect-mongo";
import {_dirname} from "../path.js";

const app = express()
const port = 8080
const hbs = create()

app.use(express.json())
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://nvherreramartinez:XG0HSzVpr5pgClJJ@cluster0.ymen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        mongoOptions: {},
        ttl: 15
    }),
    secret: 'XG0HSzVpr5pgClJJ',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
initalizatePassport()
app.use(passport.session());
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/sessions', sessionRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.get('/', (req,res) => {
    res.status(200).send("Bienvenido al inicio")
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})