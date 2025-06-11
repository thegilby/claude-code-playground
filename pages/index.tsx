import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Plus, Users, Calendar, BarChart3 } from 'lucide-react'
import ClientCard from '@/components/ClientCard'
import ClientForm from '@/components/ClientForm'

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  goals?: string
  notes?: string
  createdAt: string
  _count?: {
    workouts: number
    measurements: number
  }
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

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

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'createdAt' | '_count'>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      
      if (response.ok) {
        await fetchClients()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to add client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClient = async (clientData: Omit<Client, 'id' | 'createdAt' | '_count'>) => {
    if (!editingClient) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      
      if (response.ok) {
        await fetchClients()
        setEditingClient(null)
      }
    } catch (error) {
      console.error('Failed to update client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchClients()
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }

  const handleViewDetails = (clientId: string) => {
    console.log('View details for client:', clientId)
  }

  const totalWorkouts = clients.reduce((sum, client) => sum + (client._count?.workouts || 0), 0)
  const totalMeasurements = clients.reduce((sum, client) => sum + (client._count?.measurements || 0), 0)

  return (
    <>
      <Head>
        <title>Personal Trainer Dashboard</title>
        <meta name="description" content="Track your clients' workouts and progress" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-container">
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="fade-in">
                <h1 className="text-4xl font-bold text-white mb-2">Personal Trainer Dashboard</h1>
                <p className="text-blue-100">Manage your clients and track their progress</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                <Plus size={20} />
                Add Client
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="grid-stats mb-8 slide-up">
            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-blue">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{clients.length}</p>
                  <p className="text-label">Total Clients</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-green">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{totalWorkouts}</p>
                  <p className="text-label">Total Workouts</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-purple">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{totalMeasurements}</p>
                  <p className="text-label">Total Measurements</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-orange">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {clients.length > 0 ? Math.round((totalWorkouts + totalMeasurements) / clients.length) : 0}
                  </p>
                  <p className="text-label">Avg Sessions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-subheading mb-6">Your Clients</h2>
            {clients.length === 0 ? (
              <div className="text-center py-16 card">
                <div className="bounce-in">
                  <div className="icon-container icon-gray mx-auto mb-6 w-20 h-20">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No clients yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Start by adding your first client to track their progress and workouts
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary text-lg"
                  >
                    Add Your First Client
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid-responsive">
                {clients.map((client, index) => (
                  <div key={client.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ClientCard
                      client={client}
                      onEdit={setEditingClient}
                      onDelete={handleDeleteClient}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {showForm && (
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        )}

        {editingClient && (
          <ClientForm
            client={editingClient}
            onSubmit={handleEditClient}
            onCancel={() => setEditingClient(null)}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  )
}