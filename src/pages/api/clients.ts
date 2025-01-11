import { NextApiRequest, NextApiResponse } from 'next'
import { validationResult } from 'express-validator'
import dbConnect from '@/lib/db'
import Registry from '@/models/Registry'
import { clientAddField } from '@/middleware/checkFields'
import { admin, protect } from '@/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await Promise.all(clientAddField.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false })
    }

    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        await Registry.create({ ...req.body, userId: req.user?._id })
          .then(() => res.status(200).json({ success: true, message: 'client_added' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'GET') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        if (id) {
          await Registry.findById(id)
            .then(response => res.status(200).json({ data: response }))
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        } else {
          await Registry.find({ userId: req.user?._id })
            .then(response => res.status(200).json({ data: response }))
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        }
      })
    })
  } else res.status(404).json('')
}
