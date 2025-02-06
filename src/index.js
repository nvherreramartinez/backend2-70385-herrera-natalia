import express from "express";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from "express-session";
//import sessionRouter from "./routes/sessions.routes.js";
//import cartRouter from "./routes/carts.routes.js";
//import productRouter from "./routes/products.routes.js";

const app = express()
const PORT = 8080

app.use(express.json())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://nvherreramartinez:XG0HSzVpr5pgClJJ@cluster0.ymen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        mongoOptions: {},
        ttl: 15
    }),
    secret: 'SessionSecret',
    resave: true,
    saveUninitialized: true
}))
mongoose.connect("mongodb+srv://nvherreramartinez:XG0HSzVpr5pgClJJ@cluster0.ymen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initializePassport()
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res) => {
    res.status(200).send("Bienvenido al inicio")
})

//app.use('/api/sessions', sessionRouter)
//app.use('/api/products', productRouter)
//app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})