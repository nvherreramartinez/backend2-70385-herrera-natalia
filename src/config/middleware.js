export const authorization = (role) => {
    return async(req, res, next) => {
        if(!req.user) 
            return res.status(401).send("Usuario no logueado")
        if(req.user.role !== role) 
            return res.status(403).send("Usuario no autorizado")
        next()
    }
}