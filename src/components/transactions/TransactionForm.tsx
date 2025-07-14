import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { X, Plus } from 'lucide-react'

interface TransactionFormProps {
  onClose: () => void
  onSuccess: () => void
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    source: 'manual' as 'manual' | 'mpesa' | 'bank'
  })
  const [loading, setLoading] = useState(false)

  const categories = {
    expense: ['Food & Drinks', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'],
    income: ['Salary', 'Business', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            type: formData.type,
            date: formData.date,
            source: formData.source
          }
        ])

      if (error) throw error

      toast.success('Transaction added successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Error adding transaction')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-100 text-red-700 border-2 border-red-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-100 text-green-700 border-2 border-green-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Ksh)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="What was this for?"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={20} className="mr-2" />
                Add Transaction
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}