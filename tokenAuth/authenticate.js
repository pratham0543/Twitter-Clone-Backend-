const jwt = require("jsonwebtoken")
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(" ")[1]
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (verifyUser) {
            req.id = verifyUser.userId
            req.username = verifyUser.username
            req.usertype = verifyUser.usertype
            next()
        } else {
            return res.status(403).json({ msg: 'Token expired. Please login again' })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = authenticate