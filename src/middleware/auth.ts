import { NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { decode } from 'js-base64'
import User from '@/models/User'

// Middleware: Tokenni tekshirish va foydalanuvchini olish
export const protect = async (req: any, res: NextApiResponse, next: Function) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tokenni olish
      token = req.headers.authorization.split(' ')[1]

      // Tokenni tekshirish
      const decoded: any = jwt.verify(decode(token), process.env.ACCESS_TOKEN_SECRET as string)

      // Token ichidagi foydalanuvchini olish
      req.user = await User.findById(decoded.id).select('-password')

      next() // Keyingi middleware yoki handlerga o'tish
    } catch (error) {
      res.status(401).json({ success: false, message: 'not_authorized' })
    }
  }

  if (!token) res.status(401).json({ success: false, message: 'not_authorized_no_token' })
}

// Middleware: Admin rolini tekshirish
export const admin = async (req: any, res: NextApiResponse, next: Function) => {
  if (req.user && req.user.role === 'admin') next()
  else res.status(403).json({ success: false, message: 'not_authorized_as_an_admin' })
}
