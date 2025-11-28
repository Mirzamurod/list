import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import Checkup from '@/models/Checkup'
import { admin, protect } from '@/middleware/auth'
import { SortOrder } from 'mongoose'
import { getCache, setCache, invalidateCacheByPrefix } from '@/lib/cache'

const getCachePrefix = (userId?: string) => `checkup:${userId ?? 'anonymous'}`

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
            .then(response => {
              invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
              res.status(200).json({ success: true, message: 'checkup_added', data: response })
            })
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
        const userId = req.user?._id?.toString()
        const cachePrefix = getCachePrefix(userId)

        if (id) {
          const cacheKey = `${cachePrefix}:detail:${id}`
          const cached = getCache(cacheKey)
          if (cached) return res.status(200).json(cached)

          await Checkup.findById(id)
            .lean()
            .then(response => {
              if (response) setCache(cacheKey, { data: response })
              res.status(200).json({ data: response })
            })
            .catch(error => res.status(400).json({ success: false, message: error.message }))
        } else {
          const numericLimit = Number(limit) || 20
          const currentPage = Number(page) || 1
          const cursor = req.query.cursor as string | undefined
          const useCursor = cursor !== undefined

          const searchFilter = searchName
            ? { [searchName as string]: { $regex: search ?? '', $options: 'i' } }
            : { drugs: { $regex: search ?? '', $options: 'i' } }

          const baseFilter = {
            userId: req.user?._id,
            ...(clientId ? { clientId } : {}),
            ...searchFilter,
          }

          const sortOptions: Record<string, SortOrder> = { updatedAt: -1 }
          if (sortName) sortOptions[sortName as string] = (sortValue as SortOrder) ?? 1

          if (useCursor) {
            const cursorFilter = cursor ? { ...baseFilter, _id: { $lt: cursor } } : baseFilter

            const checkups = await Checkup.find(cursorFilter)
              .sort(sortOptions)
              .limit(numericLimit + 1)
              .select('device drugs xijoma createdOn clientId userId updatedAt _id')
              .lean()

            const hasMore = checkups.length > numericLimit
            const data = hasMore ? checkups.slice(0, numericLimit) : checkups
            const nextCursor = hasMore ? data[data.length - 1]?._id?.toString() : null

            return res.status(200).json({
              data,
              nextCursor,
              hasMore,
              count: data.length,
            })
          }

          const skip = numericLimit * (currentPage - 1)
          const cacheKey = `${cachePrefix}:list:${JSON.stringify({
            limit: numericLimit,
            page: currentPage,
            sortName,
            sortValue,
            search,
            searchName,
            clientId,
          })}`

          const cachedResponse = getCache(cacheKey)
          if (cachedResponse) return res.status(200).json(cachedResponse)

          const [checkups, total] = await Promise.all([
            Checkup.find(baseFilter)
              .sort(sortOptions)
              .limit(numericLimit)
              .skip(skip)
              .select('device drugs xijoma createdOn clientId userId updatedAt')
              .lean(),
            Checkup.countDocuments(baseFilter),
          ])

          const payload = {
            data: checkups,
            pageLists: Math.ceil(total / numericLimit) || 1,
            page: currentPage,
            count: checkups.length,
          }

          setCache(cacheKey, payload)

          res.status(200).json(payload)
        }
      })
    })
  } else if (req.method === 'PATCH') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndUpdate(id, req.body, { new: true })
          .then(response => {
            invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
            res.status(200).json({ success: true, message: 'checkup_updated', data: response })
          })
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'DELETE') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Checkup.findByIdAndDelete(id)
          .then(() => {
            invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
            res.status(200).json({ success: true, message: 'checkup_deleted' })
          })
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else res.status(404).json('')
}
