import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const clients = await prisma.client.findMany({
          include: {
            _count: {
              select: { workouts: true, measurements: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        res.status(200).json(clients)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' })
      }
      break

    case 'POST':
      try {
        const { name, email, phone, dateOfBirth, goals, notes } = req.body
        const client = await prisma.client.create({
          data: {
            name,
            email,
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            goals,
            notes,
            trainerId: 'temp-trainer-id' // Replace with actual trainer ID from auth
          }
        })
        res.status(201).json(client)
      } catch (error) {
        res.status(500).json({ error: 'Failed to create client' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}