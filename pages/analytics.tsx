import { useState, useEffect } from 'react'
import Head from 'next/head'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'

interface VolumeData {
  date: string
  volume: number
  workouts: number
}

interface ClientProgress {
  name: string
  totalVolume: number
  workouts: number
  avgVolume: number
}

export default function Analytics() {
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])
  const [clientProgress, setClientProgress] = useState<ClientProgress[]>([])
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    // Mock data for now - would fetch from API
    const mockVolumeData: VolumeData[] = [
      { date: '2025-01-01', volume: 12500, workouts: 8 },
      { date: '2025-01-02', volume: 15000, workouts: 10 },
      { date: '2025-01-03', volume: 8500, workouts: 6 },
      { date: '2025-01-04', volume: 18000, workouts: 12 },
      { date: '2025-01-05', volume: 16500, workouts: 11 },
      { date: '2025-01-06', volume: 13000, workouts: 9 },
      { date: '2025-01-07', volume: 20000, workouts: 14 }
    ]

    const mockClientProgress: ClientProgress[] = [
      { name: 'John Doe', totalVolume: 45000, workouts: 12, avgVolume: 3750 },
      { name: 'Jane Smith', totalVolume: 38000, workouts: 10, avgVolume: 3800 },
      { name: 'Mike Johnson', totalVolume: 52000, workouts: 15, avgVolume: 3467 },
      { name: 'Sarah Wilson', totalVolume: 41000, workouts: 11, avgVolume: 3727 }
    ]

    setVolumeData(mockVolumeData)
    setClientProgress(mockClientProgress)
  }

  const totalVolume = volumeData.reduce((sum, day) => sum + day.volume, 0)
  const totalWorkouts = volumeData.reduce((sum, day) => sum + day.workouts, 0)
  const avgDailyVolume = volumeData.length ? Math.round(totalVolume / volumeData.length) : 0
  const activeClients = clientProgress.length

  return (
    <>
      <Head>
        <title>Analytics - Personal Trainer</title>
      </Head>

      <div className="page-container">
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="fade-in">
                <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-blue-100">Track progress and performance over time</p>
              </div>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-2 text-sm font-medium ${
                    timeRange === 'week' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-2 text-sm font-medium ${
                    timeRange === 'month' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeRange('quarter')}
                  className={`px-3 py-2 text-sm font-medium ${
                    timeRange === 'quarter' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{totalVolume.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Volume</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{totalWorkouts}</p>
                  <p className="text-sm text-gray-600">Total Workouts</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{avgDailyVolume.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Avg Daily Volume</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{activeClients}</p>
                  <p className="text-sm text-gray-600">Active Clients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Volume Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [value.toLocaleString() + ' lbs', 'Volume']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Workouts Per Day</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [value, 'Workouts']}
                    />
                    <Bar dataKey="workouts" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Client Progress Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientProgress} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString() + ' lbs', 'Total Volume']} />
                  <Bar dataKey="totalVolume" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Client Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workouts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Volume/Workout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientProgress.map((client) => (
                    <tr key={client.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.totalVolume.toLocaleString()} lbs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.workouts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.avgVolume.toLocaleString()} lbs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}