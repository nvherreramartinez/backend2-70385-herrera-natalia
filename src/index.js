import 'dotenv/config.js';
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
import cors from "cors";


const app = express()
const PORT = 8080
const hbs = create()

app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGO,
        mongoOptions: {},
        ttl: 1500000000
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(process.env.URL_MONGO)
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