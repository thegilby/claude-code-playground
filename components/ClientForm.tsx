import { useState } from 'react'
import { X, User } from 'lucide-react'

interface Client {
  id?: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  goals?: string
  notes?: string
}

interface ClientFormProps {
  client?: Client
  onSubmit: (client: Omit<Client, 'id'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    dateOfBirth: client?.dateOfBirth || '',
    goals: client?.goals || '',
    notes: client?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg slide-up">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="icon-container icon-blue">
              <User size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {client ? 'Edit Client' : 'Add New Client'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-label mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter client's full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="text-label mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-label mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="text-label mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="goals" className="text-label mb-2">
              Fitness Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows={4}
              className="textarea-field"
              placeholder="What are this client's fitness goals and objectives?"
            />
          </div>

          <div>
            <label htmlFor="notes" className="text-label mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="textarea-field"
              placeholder="Any special considerations, preferences, or notes about this client"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading || !formData.name}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
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