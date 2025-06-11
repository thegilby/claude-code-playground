import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  category: string
  muscleGroup?: string
}

interface WorkoutExercise {
  exerciseId: string
  exerciseName?: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  distance?: number
  restTime?: number
  notes?: string
}

interface WorkoutFormProps {
  clientId: string
  clientName: string
  onSubmit: (workout: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function WorkoutForm({ clientId, clientName, onSubmit, onCancel, isLoading }: WorkoutFormProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workoutData, setWorkoutData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'in_person',
    notes: ''
  })
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([])

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
    }
  }

  const addExercise = () => {
    setWorkoutExercises(prev => [...prev, {
      exerciseId: '',
      sets: 1,
      reps: 1,
      weight: 0
    }])
  }

  const removeExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkoutExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validExercises = workoutExercises.filter(ex => ex.exerciseId && ex.sets > 0)
    
    if (validExercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    const workout = {
      clientId,
      ...workoutData,
      exercises: validExercises
    }

    onSubmit(workout)
  }

  const calculateTotalVolume = () => {
    return workoutExercises.reduce((total, ex) => {
      return total + (ex.sets * ex.reps * (ex.weight || 0))
    }, 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Add Workout</h2>
            <p className="text-gray-600">For {clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Workout Name
              </label>
              <input
                type="text"
                id="name"
                value={workoutData.name}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Upper Body Push"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={workoutData.date}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                value={workoutData.type}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="in_person">In Person</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Volume
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                {calculateTotalVolume().toLocaleString()} lbs
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={workoutData.notes}
              onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Workout notes..."
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Exercises</h3>
              <button
                type="button"
                onClick={addExercise}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {workoutExercises.map((workoutExercise, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Exercise {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Exercise
                      </label>
                      <select
                        value={workoutExercise.exerciseId}
                        onChange={(e) => {
                          const exercise = exercises.find(ex => ex.id === e.target.value)
                          updateExercise(index, 'exerciseId', e.target.value)
                          updateExercise(index, 'exerciseName', exercise?.name)
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select Exercise</option>
                        {exercises.map((exercise) => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={workoutExercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={workoutExercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={workoutExercise.weight || 0}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Volume
                      </label>
                      <div className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded text-gray-900">
                        {((workoutExercise.sets * workoutExercise.reps * (workoutExercise.weight || 0))).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={workoutExercise.notes || ''}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Exercise notes..."
                    />
                  </div>
                </div>
              ))}

              {workoutExercises.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No exercises added yet. Click "Add Exercise" to get started.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              type="submit"
              disabled={isLoading || workoutExercises.length === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Workout'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}