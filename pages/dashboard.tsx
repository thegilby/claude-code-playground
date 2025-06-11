import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Calendar, BarChart3, Plus, Filter, TrendingUp, Users, Activity } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns'
import WorkoutForm from '@/components/WorkoutForm'
import MeasurementForm from '@/components/MeasurementForm'

interface Client {
  id: string
  name: string
}

interface Workout {
  id: string
  name?: string
  date: string
  type: string
  status: string
  totalVolume: number
  client: { name: string }
  exercises: Array<{
    exercise: { name: string; category: string }
    sets: number
    reps: number
    weight?: number
    volume: number
  }>
}

interface VolumeData {
  period: string
  volume: number
  workouts: number
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [showMeasurementForm, setShowMeasurementForm] = useState(false)
  const [workoutFormClient, setWorkoutFormClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchClients()
    fetchWorkouts()
  }, [selectedDate, view, selectedClient])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const fetchWorkouts = async () => {
    try {
      let startDate: Date
      
      switch (view) {
        case 'daily':
          startDate = new Date(selectedDate)
          break
        case 'weekly':
          startDate = startOfWeek(selectedDate)
          break
        case 'monthly':
          startDate = startOfMonth(selectedDate)
          break
      }

      const params = new URLSearchParams({
        date: startDate.toISOString()
      })
      
      if (selectedClient !== 'all') {
        params.append('clientId', selectedClient)
      }

      const response = await fetch(`/api/workouts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setWorkouts(data)
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error)
    }
  }

  const handleAddWorkout = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setWorkoutFormClient(client)
      setShowWorkoutForm(true)
    }
  }

  const handleAddMeasurement = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setWorkoutFormClient(client)
      setShowMeasurementForm(true)
    }
  }

  const handleWorkoutSubmit = async (workoutData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData)
      })
      
      if (response.ok) {
        await fetchWorkouts()
        setShowWorkoutForm(false)
        setWorkoutFormClient(null)
      }
    } catch (error) {
      console.error('Failed to add workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMeasurementSubmit = async (measurementData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurementData)
      })
      
      if (response.ok) {
        setShowMeasurementForm(false)
        setWorkoutFormClient(null)
      }
    } catch (error) {
      console.error('Failed to add measurement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVolumeComparison = (): VolumeData[] => {
    const currentPeriodVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0)
    const currentPeriodWorkouts = workouts.length

    let previousStartDate: Date
    let currentLabel: string
    let previousLabel: string

    switch (view) {
      case 'daily':
        previousStartDate = subDays(selectedDate, 1)
        currentLabel = format(selectedDate, 'MMM d')
        previousLabel = format(previousStartDate, 'MMM d')
        break
      case 'weekly':
        previousStartDate = subWeeks(startOfWeek(selectedDate), 1)
        currentLabel = `Week of ${format(startOfWeek(selectedDate), 'MMM d')}`
        previousLabel = `Week of ${format(previousStartDate, 'MMM d')}`
        break
      case 'monthly':
        previousStartDate = subMonths(startOfMonth(selectedDate), 1)
        currentLabel = format(selectedDate, 'MMMM yyyy')
        previousLabel = format(previousStartDate, 'MMMM yyyy')
        break
    }

    return [
      {
        period: previousLabel,
        volume: 0, // Would need to fetch previous period data
        workouts: 0
      },
      {
        period: currentLabel,
        volume: currentPeriodVolume,
        workouts: currentPeriodWorkouts
      }
    ]
  }

  const formatPeriodTitle = () => {
    switch (view) {
      case 'daily':
        return format(selectedDate, 'EEEE, MMMM d, yyyy')
      case 'weekly':
        return `Week of ${format(startOfWeek(selectedDate), 'MMMM d')} - ${format(endOfWeek(selectedDate), 'MMMM d, yyyy')}`
      case 'monthly':
        return format(selectedDate, 'MMMM yyyy')
    }
  }

  const totalVolume = workouts.reduce((sum, workout) => sum + workout.totalVolume, 0)
  const totalWorkouts = workouts.length
  const uniqueClients = new Set(workouts.map(w => w.client.name)).size

  return (
    <>
      <Head>
        <title>Workout Dashboard - Personal Trainer</title>
      </Head>

      <div className="page-container">
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="fade-in">
                <h1 className="text-4xl font-bold text-white mb-2">Workout Dashboard</h1>
                <p className="text-blue-100 text-lg">{formatPeriodTitle()}</p>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="select-field bg-white/20 border-white/30 text-white placeholder-blue-200"
                >
                  <option value="all">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id} className="text-gray-900">{client.name}</option>
                  ))}
                </select>
                
                <div className="flex bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl">
                  <button
                    onClick={() => setView('daily')}
                    className={`px-4 py-2 text-sm font-semibold rounded-l-xl transition-all ${
                      view === 'daily' 
                        ? 'bg-white text-blue-700 shadow-lg' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setView('weekly')}
                    className={`px-4 py-2 text-sm font-semibold transition-all ${
                      view === 'weekly' 
                        ? 'bg-white text-blue-700 shadow-lg' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setView('monthly')}
                    className={`px-4 py-2 text-sm font-semibold rounded-r-xl transition-all ${
                      view === 'monthly' 
                        ? 'bg-white text-blue-700 shadow-lg' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="grid-stats mb-8 slide-up">
            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-blue">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{totalVolume.toLocaleString()}</p>
                  <p className="text-label">Total Volume (lbs)</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-green">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{totalWorkouts}</p>
                  <p className="text-label">Workouts</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-purple">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{uniqueClients}</p>
                  <p className="text-label">Active Clients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Workouts</h3>
                  <div className="flex gap-2">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleAddWorkout(client.id)}
                        className="text-xs btn-primary"
                        title={`Add workout for ${client.name}`}
                      >
                        + {client.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {workouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No workouts for this period</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workouts.slice(0, 5).map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium">{workout.client.name}</p>
                          <p className="text-sm text-gray-600">
                            {workout.name || 'Workout'} - {format(new Date(workout.date), 'MMM d')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {workout.exercises.length} exercises
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">{workout.totalVolume.toLocaleString()} lbs</p>
                          <p className="text-xs text-gray-500 capitalize">{workout.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600">Add data for today</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddWorkout(client.id)}
                        className="text-xs btn-primary"
                      >
                        + Workout
                      </button>
                      <button
                        onClick={() => handleAddMeasurement(client.id)}
                        className="text-xs btn-secondary"
                      >
                        + Measurement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {showWorkoutForm && workoutFormClient && (
          <WorkoutForm
            clientId={workoutFormClient.id}
            clientName={workoutFormClient.name}
            onSubmit={handleWorkoutSubmit}
            onCancel={() => {
              setShowWorkoutForm(false)
              setWorkoutFormClient(null)
            }}
            isLoading={isLoading}
          />
        )}

        {showMeasurementForm && workoutFormClient && (
          <MeasurementForm
            clientId={workoutFormClient.id}
            clientName={workoutFormClient.name}
            onSubmit={handleMeasurementSubmit}
            onCancel={() => {
              setShowMeasurementForm(false)
              setWorkoutFormClient(null)
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  )
}