import 'dotenv/config';
import passport from "passport";
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { validatePassword, createHash } from "../utils/bcrypt.js";
import userModel from "../models/user.js";

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) =>{
    let token = null
    if(req && req.cookies) {
        token = req.cookies['coderCookie']
        console.log(req.cookies);
    }
    
    return token
}

export const passportCall = (strategy) => {
    return async(req,res,next) => {
        
        passport.authenticate(strategy, function(err,user, info) {
            if(err) return next(err)
            
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            }
            req.user = user
            next()
        } (req,res,next))
    }
}

const initializePassport = () => {

    passport.use('register', new localStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,username, password, done) => {
        try {
            const {first_name, last_name, email, password, age} = req.body

            const findUser = await userModel.findOne({email: email})
            
            
            if(!findUser) {
                const user = await userModel.create({
                    first_name : first_name,
                    last_name : last_name, 
                    email: email, 
                    password: createHash(password),
                    age: age
                })
                return done(null, user) 
            } else {
                return done(null, false) 
            }
    
        }catch (e) {
            console.log(e);
            return done(e)
        }
    }))

    passport.use('login', new localStrategy({usernameField:'email'}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }catch(e){
            return done(e)
        }

        
    
    }))

    passport.use('github', new GithubStrategy({
        clientID: "Ov23liHi8HwwYY1zNDc1",
        clientSecret: process.env.SECRET_GITHUB,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            
            let user = await userModel.findOne({email: profile._json.email}) 
            if(!user) {
                const user = await userModel.create({
                    first_name : profile._json.name,
                    last_name : " ",
                    email: profile._json.email, 
                    password: '1234', 
                    age: 18 
                })
                done(null, user)
            } else {
                done(null, user)
            }
        }catch(e) {
            console.log(e);
            return done(e)
        }
        
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_JWT,
    }, async (jwt_payload, done) => {
        try {
            console.log(jwt_payload);
            
            return done(null, jwt_payload.user)
        }catch(e) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport