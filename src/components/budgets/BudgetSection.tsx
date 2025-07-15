// File: src/components/budgets/BudgetSection.tsx

import React, { useEffect, useState } from 'react'
import { Wallet, Calendar, BarChart2, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface BudgetItem {
  id: string
  user_id: string
  category: string
  amount: number
}

export const BudgetSection: React.FC = () => {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState('')

  useEffect(() => {
    if (user?.id) fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)

    if (!error && data) setBudgets(data)
  }

  const handleAdd = async () => {
    if (!newCategory || !newAmount || !user?.id) return
    const { data, error } = await supabase.from('budgets').insert({
      user_id: user.id,
      category: newCategory,
      amount: parseFloat(newAmount)
    }).select()

    if (!error && data) {
      setBudgets([...budgets, data[0]])
      setNewCategory('')
      setNewAmount('')
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (!error) setBudgets(budgets.filter(b => b.id !== id))
  }

  const iconMap = [Wallet, Calendar, BarChart2]

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">🧾 Budget Management</h2>
        <p className="text-gray-600">Set monthly budgets by category.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const Icon = iconMap[index % iconMap.length]
          return (
            <div key={budget.id} className="bg-white rounded-2xl shadow p-6 border border-gray-100 relative hover:shadow-md transition">
              <button
                onClick={() => handleDelete(budget.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{budget.category}</p>
                  <p className="text-2xl font-bold text-green-600">Ksh {budget.amount.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white border border-green-100 rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">New Category</label>
          <input
            type="text"
            placeholder="e.g. Entertainment"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Amount (Ksh)</label>
          <input
            type="number"
            placeholder="e.g. 8000"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={18} /> Add Budget
        </button>
      </div>
    </div>
  )
}
