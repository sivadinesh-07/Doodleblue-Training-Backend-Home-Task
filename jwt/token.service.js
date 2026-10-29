const jwt=require('jsonwebtoken')
const secret=process.env.JWT_SECRET
class TokenService{
    generateToken(payload)
    {
        return jwt.sign(payload,secret,{expiresIn:"1h"})
    }
}
module.exports = new TokenService();