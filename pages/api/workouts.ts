import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { clientId, date } = req.query
        
        const where: any = {}
        if (clientId) where.clientId = clientId as string
        if (date) where.date = { gte: new Date(date as string) }

        const workouts = await prisma.workout.findMany({
          where,
          include: {
            client: { select: { name: true } },
            exercises: {
              include: {
                exercise: { select: { name: true, category: true } }
              }
            }
          },
          orderBy: { date: 'desc' }
        })
        
        res.status(200).json(workouts)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workouts' })
      }
      break

    case 'POST':
      try {
        const { clientId, name, date, type, notes, exercises } = req.body
        
        let totalVolume = 0
        
        const workout = await prisma.workout.create({
          data: {
            clientId,
            name,
            date: new Date(date),
            type,
            status: 'completed',
            notes,
            totalVolume: 0,
            trainerId: 'temp-trainer-id'
          }
        })

        if (exercises && exercises.length > 0) {
          for (const exercise of exercises) {
            const volume = (exercise.reps || 0) * (exercise.weight || 0)
            totalVolume += volume

            await prisma.workoutExercise.create({
              data: {
                workoutId: workout.id,
                exerciseId: exercise.exerciseId,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                duration: exercise.duration,
                distance: exercise.distance,
                restTime: exercise.restTime,
                notes: exercise.notes,
                volume
              }
            })
          }

          await prisma.workout.update({
            where: { id: workout.id },
            data: { totalVolume }
          })
        }

        const completeWorkout = await prisma.workout.findUnique({
          where: { id: workout.id },
          include: {
            exercises: {
              include: {
                exercise: { select: { name: true, category: true } }
              }
            }
          }
        })

        res.status(201).json(completeWorkout)
      } catch (error) {
        console.error('Create workout error:', error)
        res.status(500).json({ error: 'Failed to create workout' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}