import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { clientId } = req.query
        
        const where: any = {}
        if (clientId) where.clientId = clientId as string

        const measurements = await prisma.measurement.findMany({
          where,
          include: {
            client: { select: { name: true } }
          },
          orderBy: { date: 'desc' }
        })
        
        res.status(200).json(measurements)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch measurements' })
      }
      break

    case 'POST':
      try {
        const {
          clientId,
          date,
          weight,
          bodyFatPercent,
          muscleMass,
          bmi,
          chest,
          waist,
          hips,
          leftArm,
          rightArm,
          leftThigh,
          rightThigh,
          neck,
          notes
        } = req.body
        
        const measurement = await prisma.measurement.create({
          data: {
            clientId,
            date: new Date(date),
            weight: weight ? parseFloat(weight) : null,
            bodyFatPercent: bodyFatPercent ? parseFloat(bodyFatPercent) : null,
            muscleMass: muscleMass ? parseFloat(muscleMass) : null,
            bmi: bmi ? parseFloat(bmi) : null,
            chest: chest ? parseFloat(chest) : null,
            waist: waist ? parseFloat(waist) : null,
            hips: hips ? parseFloat(hips) : null,
            leftArm: leftArm ? parseFloat(leftArm) : null,
            rightArm: rightArm ? parseFloat(rightArm) : null,
            leftThigh: leftThigh ? parseFloat(leftThigh) : null,
            rightThigh: rightThigh ? parseFloat(rightThigh) : null,
            neck: neck ? parseFloat(neck) : null,
            notes
          }
        })
        
        res.status(201).json(measurement)
      } catch (error) {
        console.error('Create measurement error:', error)
        res.status(500).json({ error: 'Failed to create measurement' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}