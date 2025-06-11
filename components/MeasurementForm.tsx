import { useState } from 'react'
import { X } from 'lucide-react'

interface MeasurementFormProps {
  clientId: string
  clientName: string
  onSubmit: (measurement: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function MeasurementForm({ clientId, clientName, onSubmit, onCancel, isLoading }: MeasurementFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFatPercent: '',
    muscleMass: '',
    bmi: '',
    chest: '',
    waist: '',
    hips: '',
    leftArm: '',
    rightArm: '',
    leftThigh: '',
    rightThigh: '',
    neck: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const measurementData = {
      clientId,
      ...formData
    }

    onSubmit(measurementData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const heightM = 1.75 // Default height, should come from client profile
    if (weight && heightM) {
      return (weight / (heightM * heightM)).toFixed(1)
    }
    return ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Add Measurements</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="bodyFatPercent" className="block text-sm font-medium text-gray-700 mb-1">
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                id="bodyFatPercent"
                name="bodyFatPercent"
                value={formData.bodyFatPercent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-1">
                Muscle Mass (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                id="muscleMass"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Body Circumferences (inches)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-1">
                  Chest
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="chest"
                  name="chest"
                  value={formData.chest}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
                  Waist
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="waist"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">
                  Hips
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="hips"
                  name="hips"
                  value={formData.hips}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="leftArm" className="block text-sm font-medium text-gray-700 mb-1">
                  Left Arm
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="leftArm"
                  name="leftArm"
                  value={formData.leftArm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="rightArm" className="block text-sm font-medium text-gray-700 mb-1">
                  Right Arm
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="rightArm"
                  name="rightArm"
                  value={formData.rightArm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="neck" className="block text-sm font-medium text-gray-700 mb-1">
                  Neck
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="neck"
                  name="neck"
                  value={formData.neck}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="leftThigh" className="block text-sm font-medium text-gray-700 mb-1">
                  Left Thigh
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="leftThigh"
                  name="leftThigh"
                  value={formData.leftThigh}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="rightThigh" className="block text-sm font-medium text-gray-700 mb-1">
                  Right Thigh
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="rightThigh"
                  name="rightThigh"
                  value={formData.rightThigh}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional notes about measurements..."
            />
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Measurements'}
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