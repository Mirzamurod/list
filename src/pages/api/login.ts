import { NextApiRequest, NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { validationResult } from 'express-validator'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { userLoginField } from '@/middleware/checkFields'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Validatsiya qoidalarini ishlatish
    await Promise.all(userLoginField.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false })
    }

    await dbConnect()
    const { phone, password } = req.body

    await User.findOne({ phone }).then(async response => {
      if (response) {
        bcryptjs
          .compare(password, response.password)
          .then(resp => {
            if (resp)
              res.status(200).json({ data: { token: generateToken(response._id) }, success: true })
            else res.status(400).json({ success: false, message: 'phone_or_password_wrong' })
          })
          .catch(err => res.status(400).json({ success: false, message: err.message }))
      } else
        res
          .status(400)
          .json({ message: [{ msg: 'user_not_found', param: 'phone' }], success: false })
    })
  } else res.status(404).json('')
}

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '14d' })
