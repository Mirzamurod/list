import { NextApiRequest, NextApiResponse } from 'next'
import { validationResult } from 'express-validator'
import dbConnect from '@/lib/db'
import Registry from '@/models/Registry'
import { clientAddField } from '@/middleware/checkFields'
import { admin, protect } from '@/middleware/auth'
import { SortOrder } from 'mongoose'
import { getCache, setCache, invalidateCacheByPrefix } from '@/lib/cache'

const getCachePrefix = (userId?: string) => `clients:${userId ?? 'anonymous'}`

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
          .then(response => {
            invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
            res.status(200).json({ success: true, message: 'client_added', data: response })
          })
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'GET') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id, limit = 20, page = 0, sortName, sortValue, search, searchName } = req.query
        const userId = req.user?._id?.toString()
        const cachePrefix = getCachePrefix(userId)

        if (id) {
          const cacheKey = `${cachePrefix}:detail:${id}`
          const cached = getCache(cacheKey)
          if (cached) return res.status(200).json(cached)

          await Registry.findById(id)
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
            : { name: { $regex: search ?? '', $options: 'i' } }

          const baseFilter = { userId: req.user?._id, ...searchFilter }
          const sortOptions: Record<string, SortOrder> = { updatedAt: -1 }
          if (sortName) {
            sortOptions[sortName as string] = (sortValue as SortOrder) ?? 1
          }

          if (useCursor) {
            const cursorFilter = cursor ? { ...baseFilter, _id: { $lt: cursor } } : baseFilter

            const clients = await Registry.find(cursorFilter)
              .sort(sortOptions)
              .limit(numericLimit + 1)
              .select('name phone year address comment userId updatedAt createdAt _id')
              .lean()

            const hasMore = clients.length > numericLimit
            const data = hasMore ? clients.slice(0, numericLimit) : clients
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
          })}`
          const cachedResponse = getCache(cacheKey)
          if (cachedResponse) return res.status(200).json(cachedResponse)

          const [clients, total] = await Promise.all([
            Registry.find(baseFilter)
              .sort(sortOptions)
              .limit(numericLimit)
              .skip(skip)
              .select('name phone year address comment userId updatedAt createdAt')
              .lean(),
            Registry.countDocuments(baseFilter),
          ])

          const payload = {
            data: clients,
            pageLists: Math.ceil(total / numericLimit) || 1,
            page: currentPage,
            count: clients.length,
          }

          setCache(cacheKey, payload)

          res.status(200).json(payload)
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
        await Registry.findByIdAndUpdate(id, req.body, { new: true })
          .then(response => {
            invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
            res.status(200).json({ success: true, message: 'client_updated', data: response })
          })
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else if (req.method === 'DELETE') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { id } = req.query
        await Registry.findByIdAndDelete(id)
          .then(() => {
            invalidateCacheByPrefix(getCachePrefix(req.user?._id?.toString()))
            res.status(200).json({ success: true, message: 'client_deleted' })
          })
          .catch(error => res.status(400).json({ success: false, message: error.message }))
      })
    })
  } else res.status(404).json('')
}
