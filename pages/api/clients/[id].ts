import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  switch (method) {
    case 'GET':
      try {
        const client = await prisma.client.findUnique({
          where: { id: id as string },
          include: {
            workouts: {
              orderBy: { date: 'desc' },
              take: 10
            },
            measurements: {
              orderBy: { date: 'desc' },
              take: 5
            }
          }
        })
        if (!client) {
          return res.status(404).json({ error: 'Client not found' })
        }
        res.status(200).json(client)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch client' })
      }
      break

    case 'PUT':
      try {
        const { name, email, phone, dateOfBirth, goals, notes } = req.body
        const client = await prisma.client.update({
          where: { id: id as string },
          data: {
            name,
            email,
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            goals,
            notes
          }
        })
        res.status(200).json(client)
      } catch (error) {
        res.status(500).json({ error: 'Failed to update client' })
      }
      break

    case 'DELETE':
      try {
        await prisma.client.delete({
          where: { id: id as string }
        })
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}