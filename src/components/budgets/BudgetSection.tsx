import React, { useEffect, useState } from 'react'
import { Wallet, Calendar, BarChart2, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
}

export const BudgetSection: React.FC = () => {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState('')

  useEffect(() => {
    if (user) fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)

    if (!error && data) setBudgets(data)
  }

  const handleAmountChange = async (id: string, amount: number) => {
    const { error } = await supabase
      .from('budgets')
      .update({ amount })
      .eq('id', id)

    if (!error) {
      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, amount } : b))
      )
    }
  }

  const handleAddBudget = async () => {
    if (!newCategory || !newAmount || isNaN(Number(newAmount))) return

    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: user?.id,
          category: newCategory,
          amount: Number(newAmount),
        },
      ])
      .select()

    if (!error && data) {
      setBudgets((prev) => [...prev, data[0]])
      setNewCategory('')
      setNewAmount('')
    }
  }

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return <Wallet className="w-6 h-6 text-green-600" />
      case 'transport':
        return <Calendar className="w-6 h-6 text-blue-600" />
      case 'savings':
        return <BarChart2 className="w-6 h-6 text-purple-600" />
      default:
        return <Wallet className="w-6 h-6 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🧾 Budget Management</h2>
        <p className="text-gray-600">Set your monthly and weekly spending targets by category to stay on track.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-600 capitalize">{budget.category}</p>
                <input
                  type="number"
                  value={budget.amount}
                  onChange={(e) => handleAmountChange(budget.id, Number(e.target.value))}
                  className="text-2xl font-bold text-green-600 bg-transparent outline-none w-32"
                />
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                {getIcon(budget.category)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Add New Budget Category</h3>
        <input
          type="text"
          placeholder="e.g. Entertainment"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleAddBudget}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Budget
        </button>
      </div>
    </div>
  )
}
