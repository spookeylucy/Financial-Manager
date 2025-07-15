import React, { useEffect, useState } from 'react'
import { Plus, Target, TrendingUp, TrendingDown, Clock4 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'

interface Goal {
  id: string
  title: string
  target_amount: number
  current_amount: number
  target_date: string
  category: string
  status: 'active' | 'completed' | 'paused'
}

export const GoalsSection: React.FC = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: '',
  })

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user?.id)
      .order('target_date', { ascending: true })

    if (!error && data) {
      setGoals(data)
    }
  }

  const handleAddGoal = async () => {
    const { title, target_amount, current_amount, target_date, category } = newGoal

    if (!title || !target_amount || !target_date || !category) return

    const { data, error } = await supabase
      .from('financial_goals')
      .insert([
        {
          user_id: user?.id,
          title,
          target_amount: Number(target_amount),
          current_amount: Number(current_amount) || 0,
          target_date,
          category,
          status: 'active',
        },
      ])
      .select()

    if (!error && data) {
      setGoals((prev) => [...prev, data[0]])
      setNewGoal({
        title: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        category: '',
      })
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'completed': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🎯 My Financial Goals</h2>
        <p className="text-gray-600">Track your savings, investments, and progress over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.current_amount / goal.target_amount) * 100

          return (
            <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Category: <span className="font-medium text-gray-800">{goal.category}</span>
              </p>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ksh {goal.current_amount.toLocaleString()}</span>
                <span>Ksh {goal.target_amount.toLocaleString()}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock4 className="w-4 h-4" />
                  <span>Target: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-xl mx-auto mt-10 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">➕ Add New Goal</h3>

        <input
          type="text"
          placeholder="Title (e.g., Buy a Laptop)"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Category (e.g., Education)"
          value={newGoal.category}
          onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Target Amount (e.g., 30000)"
          value={newGoal.target_amount}
          onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Current Amount (optional)"
          value={newGoal.current_amount}
          onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="date"
          value={newGoal.target_date}
          onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleAddGoal}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>
    </div>
  )
}
