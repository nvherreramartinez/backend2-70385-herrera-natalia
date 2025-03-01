import express from "express";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from "express-session";
import path from 'path';
import { __dirname } from "./path.js";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.routes.js";
import { create } from "express-handlebars";


const app = express()
const PORT = 8080
const hbs = create()


app.use(express.json())
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://nvherreramartinez:@cluster0.ymen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        mongoOptions: {},
        ttl: 15
    }),
    secret: 'SessionSecret',
    resave: true,
    saveUninitialized: true
}))
mongoose.connect("mongodb+srv://nvherreramartinez:@cluster0.ymen3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB conectada"))
.catch((e) => console.log("Error de conexión a DB:", e))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})