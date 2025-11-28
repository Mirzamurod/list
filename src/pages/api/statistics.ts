import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import Registry from '@/models/Registry'
import Checkup from '@/models/Checkup'
import { admin, protect } from '@/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await dbConnect()

    await protect(req, res, async () => {
      await admin(req, res, async () => {
        const { period = 'month', startDate, endDate } = req.query
        const userId = req.user?._id?.toString()

        const now = new Date()
        let dateFilter: { $gte: Date; $lte: Date } | undefined

        if (startDate && endDate) {
          dateFilter = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
          }
        } else {
          const start = new Date()
          switch (period) {
            case 'week':
              start.setDate(now.getDate() - 7)
              break
            case 'month':
              start.setMonth(now.getMonth() - 1)
              break
            case 'year':
              start.setFullYear(now.getFullYear() - 1)
              break
            default:
              start.setMonth(now.getMonth() - 1)
          }
          dateFilter = { $gte: start, $lte: now }
        }

        const baseFilter = { userId }

        const [totalClients, totalCheckups, periodClients, periodCheckups] = await Promise.all([
          Registry.countDocuments(baseFilter),
          Checkup.countDocuments(baseFilter),
          Registry.countDocuments({
            ...baseFilter,
            ...(dateFilter ? { createdAt: dateFilter } : {}),
          }),
          Checkup.countDocuments({
            ...baseFilter,
            ...(dateFilter ? { $or: [{ createdAt: dateFilter }, { createdOn: dateFilter }] } : {}),
          }),
        ])

        res.status(200).json({
          success: true,
          data: {
            totalClients,
            totalCheckups,
            periodClients,
            periodCheckups,
            period: period as string,
            dateRange: dateFilter
              ? {
                  start: dateFilter.$gte.toISOString(),
                  end: dateFilter.$lte.toISOString(),
                }
              : null,
          },
        })
      })
    })
  } else {
    res.status(404).json('')
  }
}
