import { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from 'bcryptjs'
import { validationResult } from 'express-validator'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { userAddField } from '@/middleware/checkFields'

const salt = await bcryptjs.genSalt(10)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Validatsiya qoidalarini ishlatish
    await Promise.all(userAddField.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false })
    }

    await dbConnect()
    const { phone, password } = req.body

    await User.findOne({ phone }).then(async response => {
      if (!response) {
        const hashedPassword = await bcryptjs.hash(password, salt)

        await User.create({ ...req.body, password: hashedPassword })
          .then(() => res.status(200).json({ message: 'user_added', success: true }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      } else
        res
          .status(400)
          .json({ message: [{ msg: 'user_already_exists', param: 'phone' }], success: false })
    })
  } else res.status(404).json('')
}
