import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    monthly_income: '',
    notifications: false
  })

  useEffect(() => {
    if (user) fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (!error && data) {
      setProfile(data)
      setForm({
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        monthly_income: '',
        notifications: false
      })
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone_number: form.phone_number,
        updated_at: new Date()
      })
      .eq('id', user?.id)

    if (!error) alert('Settings updated successfully!')
    else alert('Error updating settings.')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="mt-1 w-full px-4 py-2 bg-gray-100 border rounded-lg text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
          <input
            type="number"
            name="monthly_income"
            value={form.monthly_income}
            onChange={handleChange}
            placeholder="e.g., 50000"
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
            className="h-4 w-4 text-green-600"
          />
          <label className="text-sm text-gray-700">Enable Notifications</label>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
