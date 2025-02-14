import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import Checkup from '@/models/Checkup'
import { admin, protect } from '@/middleware/auth'
import { SortOrder } from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (
      req.body?.device?.length ||
      req.body?.drugs?.length ||
      req.body?.xijoma?.head?.length ||
      req.body?.xijoma?.frontOfBody?.length ||
      req.body?.xijoma?.backOfBody?.length ||
      req.body?.xijoma?.other?.length
    ) {
      await dbConnect()

      await protect(req, res, async () => {
        await admin(req, res, async () => {
          await Checkup.create({ ...req.body, userId: req.user?._id })
            .then(() => res.status(200).json({ success: true, message: 'checkup_added' }))
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        })
      })
    } else res.status(400).json({ success: false, message: 'must_one_item' })
  } else if (req.method === 'GET') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const {
          id,
          limit = 20,
          page = 0,
          sortName,
          sortValue,
          search,
          searchName,
          clientId,
        } = req.query

        if (id) {
          await Checkup.findById(id)
            .then(response => res.status(200).json({ data: response }))
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        } else {
          const checkups = await Checkup.find({
            userId: req.user?._id,
            clientId,
            ...(searchName
              ? { [searchName as string]: { $regex: search ?? '', $options: 'i' } }
              : { drugs: { $regex: search ?? '', $options: 'i' } }),
          })
            .sort({ updatedAt: -1, [sortName as string]: (sortValue as SortOrder) ?? 1 })
            .limit(+limit)
            .skip(+limit * (+page - 1))

          const pageLists = Math.ceil(
            (await Checkup.countDocuments({ userId: req.user?._id, clientId })) / +limit
          )

          res
            .status(200)
            .json({ data: checkups, pageLists: pageLists || 1, page, count: checkups.length })
        }
      })
    })
  } else if (req.method === 'PATCH') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndUpdate(id, req.body, { new: true })
          .then(() => res.status(200).json({ success: true, message: 'checkup_updated' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'DELETE') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndDelete(id)
          .then(() => res.status(200).json({ success: true, message: 'checkup_deleted' }))
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else res.status(404).json('')
}
