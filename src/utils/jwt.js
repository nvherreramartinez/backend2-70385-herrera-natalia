import jwt from 'jsonwebtoken'

let secretKey = "coderCoder"

export const generateToken = (user) => {
    const token = jwt.sign({ user }, secretKey, { expiresIn: '24h' })
    return token
}