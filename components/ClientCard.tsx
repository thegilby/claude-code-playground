import { useState } from 'react'
import { User, Calendar, Target, Trash2, Edit, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'

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

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
  onDelete: (clientId: string) => void
  onViewDetails: (clientId: string) => void
}

export default function ClientCard({ client, onEdit, onDelete, onViewDetails }: ClientCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(client.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="card-interactive group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="icon-container icon-blue group-hover:scale-110 transition-transform duration-200">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{client.name}</h3>
            <p className="text-sm text-gray-500">
              Client since {format(new Date(client.createdAt), 'MMM yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onViewDetails(client.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Client"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Client"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {client.email && (
          <p className="text-sm text-gray-600">{client.email}</p>
        )}
        {client.phone && (
          <p className="text-sm text-gray-600">{client.phone}</p>
        )}
        {client.dateOfBirth && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} />
            <span>Born {format(new Date(client.dateOfBirth), 'MMM d, yyyy')}</span>
          </div>
        )}
        {client.goals && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Target size={14} className="mt-0.5" />
            <span className="line-clamp-2">{client.goals}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="text-center bg-blue-50 rounded-xl px-4 py-3 flex-1 mr-2">
          <p className="text-2xl font-bold text-blue-700">{client._count?.workouts || 0}</p>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Workouts</p>
        </div>
        <div className="text-center bg-purple-50 rounded-xl px-4 py-3 flex-1 ml-2">
          <p className="text-2xl font-bold text-purple-700">{client._count?.measurements || 0}</p>
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Measurements</p>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md bounce-in">
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-red">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Client</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete <strong>{client.name}</strong>? This will permanently remove 
                all their workouts and measurements. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="btn-danger flex-1"
                >
                  Delete Client
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}