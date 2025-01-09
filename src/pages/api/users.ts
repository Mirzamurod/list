import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { admin, protect } from '@/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  await protect(req, res, async () => {
    await admin(req, res, async () => {
      if (req.method === 'GET') {
        if (!req.user) res.status(400).json({ success: false, message: 'user_not_found' })
        else res.status(200).json({ data: req.user })
      } else res.status(404).json('')
    })
  })
}
