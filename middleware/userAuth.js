import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../model/userModel.js'
dotenv.config()
const JWT = process.env.JWT

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please Authenticate' })
  }
}

export default auth