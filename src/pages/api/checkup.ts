import { NextApiRequest, NextApiResponse } from 'next'
import { validationResult } from 'express-validator'
import dbConnect from '@/lib/db'
import Checkup from '@/models/Checkup'
import { clientAddField } from '@/middleware/checkFields'
import { admin, protect } from '@/middleware/auth'
import { SortOrder } from 'mongoose'

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
        await Checkup.create({ ...req.body, userId: req.user?._id })
          .then(() => res.status(200).json({ success: true, message: 'client_added' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'GET') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id, limit = 20, page = 0, sortName, sortValue, search, searchName } = req.query

        if (id) {
          await Checkup.findById(id)
            .then(response => res.status(200).json({ data: response }))
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        } else {
          const clients = await Checkup.find({
            userId: req.user?._id,
            ...(searchName
              ? { [searchName as string]: { $regex: search ?? '', $options: 'i' } }
              : { name: { $regex: search ?? '', $options: 'i' } }),
          })
            .sort({ updatedAt: -1, [sortName as string]: (sortValue as SortOrder) ?? 1 })
            .limit(+limit)
            .skip(+limit * (+page - 1))

          const pageLists = Math.ceil(
            (await Checkup.find({ userId: req.user?._id })).length / +limit
          )

          res
            .status(200)
            .json({ data: clients, pageLists: pageLists || 1, page, count: clients.length })
          // .then(response => res.status(200).json({ data: response }))
          // .catch(error => res.status(400).json({ success: false, message: error.message }))
        }
      })
    })
  } else if (req.method === 'PATCH') {
    await Promise.all(clientAddField.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false })
    }

    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndUpdate(id, req.body, { new: true })
          .then(() => res.status(200).json({ success: true, message: 'client_updated' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'DELETE') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndDelete(id)
          .then(() => res.status(200).json({ success: true, message: 'client_deleted' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else res.status(404).json('')
}
