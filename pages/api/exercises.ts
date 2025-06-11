import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

const defaultExercises = [
  { name: 'Bench Press', category: 'Chest', muscleGroup: 'Chest' },
  { name: 'Squat', category: 'Legs', muscleGroup: 'Quadriceps' },
  { name: 'Deadlift', category: 'Back', muscleGroup: 'Hamstrings' },
  { name: 'Overhead Press', category: 'Shoulders', muscleGroup: 'Shoulders' },
  { name: 'Barbell Row', category: 'Back', muscleGroup: 'Lats' },
  { name: 'Pull-ups', category: 'Back', muscleGroup: 'Lats' },
  { name: 'Dips', category: 'Chest', muscleGroup: 'Triceps' },
  { name: 'Bicep Curls', category: 'Arms', muscleGroup: 'Biceps' },
  { name: 'Tricep Extensions', category: 'Arms', muscleGroup: 'Triceps' },
  { name: 'Lat Pulldown', category: 'Back', muscleGroup: 'Lats' },
  { name: 'Leg Press', category: 'Legs', muscleGroup: 'Quadriceps' },
  { name: 'Leg Curls', category: 'Legs', muscleGroup: 'Hamstrings' },
  { name: 'Calf Raises', category: 'Legs', muscleGroup: 'Calves' },
  { name: 'Plank', category: 'Core', muscleGroup: 'Abs' },
  { name: 'Russian Twists', category: 'Core', muscleGroup: 'Abs' },
  { name: 'Treadmill', category: 'Cardio', muscleGroup: 'Cardiovascular' },
  { name: 'Elliptical', category: 'Cardio', muscleGroup: 'Cardiovascular' },
  { name: 'Stationary Bike', category: 'Cardio', muscleGroup: 'Cardiovascular' }
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        let exercises = await prisma.exercise.findMany({
          orderBy: { name: 'asc' }
        })

        if (exercises.length === 0) {
          exercises = await prisma.exercise.createMany({
            data: defaultExercises
          }).then(() => 
            prisma.exercise.findMany({
              orderBy: { name: 'asc' }
            })
          )
        }

        res.status(200).json(exercises)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exercises' })
      }
      break

    case 'POST':
      try {
        const { name, category, muscleGroup, description, instructions } = req.body
        
        const exercise = await prisma.exercise.create({
          data: {
            name,
            category,
            muscleGroup,
            description,
            instructions
          }
        })
        
        res.status(201).json(exercise)
      } catch (error) {
        res.status(500).json({ error: 'Failed to create exercise' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}