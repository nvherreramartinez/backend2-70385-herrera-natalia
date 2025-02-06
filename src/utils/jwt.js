import jwt from 'jsonwebtoken'

let secretKey = "coderCoder"

export const generateToken = (user) => {
    const token = jwt.sing({user}, secretKey, {expiresIn: '24h'})
    return token
}