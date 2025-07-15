// // File: src/components/budgets/BudgetSection.tsx

// import React, { useEffect, useState } from 'react'
// import { Wallet, Calendar, BarChart2, Plus, Trash2 } from 'lucide-react'
// import { supabase } from '../../lib/supabase'
// import { useAuth } from '../../hooks/useAuth'

// interface BudgetItem {
//   id: string
//   user_id: string
//   category: string
//   amount: number
// }

// export const BudgetSection: React.FC = () => {
//   const { user } = useAuth()
//   const [budgets, setBudgets] = useState<BudgetItem[]>([])
//   const [newCategory, setNewCategory] = useState('')
//   const [newAmount, setNewAmount] = useState('')

//   useEffect(() => {
//     if (user?.id) fetchBudgets()
//   }, [user])

//   const fetchBudgets = async () => {
//     const { data, error } = await supabase
//       .from('budgets')
//       .select('*')
//       .eq('user_id', user?.id)

//     if (!error && data) setBudgets(data)
//   }

//   const handleAdd = async () => {
//     if (!newCategory || !newAmount || !user?.id) return
//     const { data, error } = await supabase.from('budgets').insert({
//       user_id: user.id,
//       category: newCategory,
//       amount: parseFloat(newAmount)
//     }).select()

//     if (!error && data) {
//       setBudgets([...budgets, data[0]])
//       setNewCategory('')
//       setNewAmount('')
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const { error } = await supabase.from('budgets').delete().eq('id', id)
//     if (!error) setBudgets(budgets.filter(b => b.id !== id))
//   }

//   const iconMap = [Wallet, Calendar, BarChart2]

//   return (
//     <div className="space-y-6 p-6">
//       <div className="mb-4">
//         <h2 className="text-3xl font-bold text-gray-900 mb-1">🧾 Budget Management</h2>
//         <p className="text-gray-600">Set monthly budgets by category.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {budgets.map((budget, index) => {
//           const Icon = iconMap[index % iconMap.length]
//           return (
//             <div key={budget.id} className="bg-white rounded-2xl shadow p-6 border border-gray-100 relative hover:shadow-md transition">
//               <button
//                 onClick={() => handleDelete(budget.id)}
//                 className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//               >
//                 <Trash2 size={16} />
//               </button>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">{budget.category}</p>
//                   <p className="text-2xl font-bold text-green-600">Ksh {budget.amount.toLocaleString()}</p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-full">
//                   <Icon className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       <div className="mt-8 bg-white border border-green-100 rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-end gap-4">
//         <div className="flex-1">
//           <label className="block text-sm text-gray-600 mb-1">New Category</label>
//           <input
//             type="text"
//             placeholder="e.g. Entertainment"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>
//         <div className="flex-1">
//           <label className="block text-sm text-gray-600 mb-1">Amount (Ksh)</label>
//           <input
//             type="number"
//             placeholder="e.g. 8000"
//             value={newAmount}
//             onChange={(e) => setNewAmount(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>
//         <button
//           onClick={handleAdd}
//           className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
//         >
//           <Plus size={18} /> Add Budget
//         </button>
//       </div>
//     </div>
//   )
// }

import React, { useEffect, useState } from 'react'
import { Wallet, Calendar, BarChart2, Plus, Trash2, TrendingUp, Target, DollarSign, ShoppingCart, Home, Car, Heart, Coffee, Gamepad2, BookOpen, Briefcase, Utensils } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface BudgetItem {
  id: string
  user_id: string
  category: string
  amount: number
  created_at?: string
}

export const BudgetSection: React.FC = () => {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingBudget, setIsAddingBudget] = useState(false)

  useEffect(() => {
    if (user?.id) fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error && data) setBudgets(data)
    setIsLoading(false)
  }

  const handleAdd = async () => {
    if (!newCategory.trim() || !newAmount || !user?.id) return
    
    setIsAddingBudget(true)
    const { data, error } = await supabase.from('budgets').insert({
      user_id: user.id,
      category: newCategory.trim(),
      amount: parseFloat(newAmount)
    }).select()

    if (!error && data) {
      setBudgets([data[0], ...budgets])
      setNewCategory('')
      setNewAmount('')
    }
    setIsAddingBudget(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (!error) setBudgets(budgets.filter(b => b.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('food') || categoryLower.includes('restaurant') || categoryLower.includes('dining')) return Utensils
    if (categoryLower.includes('transport') || categoryLower.includes('car') || categoryLower.includes('fuel')) return Car
    if (categoryLower.includes('home') || categoryLower.includes('rent') || categoryLower.includes('house')) return Home
    if (categoryLower.includes('shopping') || categoryLower.includes('clothes') || categoryLower.includes('fashion')) return ShoppingCart
    if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('fitness')) return Heart
    if (categoryLower.includes('entertainment') || categoryLower.includes('game') || categoryLower.includes('fun')) return Gamepad2
    if (categoryLower.includes('education') || categoryLower.includes('book') || categoryLower.includes('learn')) return BookOpen
    if (categoryLower.includes('work') || categoryLower.includes('business') || categoryLower.includes('office')) return Briefcase
    if (categoryLower.includes('coffee') || categoryLower.includes('drinks') || categoryLower.includes('beverage')) return Coffee
    if (categoryLower.includes('investment') || categoryLower.includes('saving')) return TrendingUp
    if (categoryLower.includes('target') || categoryLower.includes('goal')) return Target
    return Wallet
  }

  const getCardGradient = (index: number) => {
    const gradients = [
      'from-emerald-500 to-green-600', // Kenyan green
      'from-red-500 to-red-600', // Kenyan red  
      'from-amber-500 to-orange-600', // Kenyan gold/orange
      'from-slate-700 to-gray-800', // Kenyan black
      'from-green-600 to-emerald-700', // Deep green
      'from-red-600 to-rose-700', // Deep red
      'from-orange-500 to-amber-600', // Warm orange
      'from-emerald-600 to-teal-700', // Teal green
    ]
    return gradients[index % gradients.length]
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-green-100">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Take control of your finances with smart budgeting. Set monthly budgets by category and track your spending goals.
          </p>
        </div>

        {/* Summary Card */}
        {budgets.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Monthly Budget</p>
                <p className="text-4xl font-bold">Ksh {totalBudget.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-1">{budgets.length} budget categories</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Budget Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget, index) => {
              const Icon = getCategoryIcon(budget.category)
              const gradient = getCardGradient(index)
              
              return (
                <div key={budget.id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">{budget.category}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        Ksh {budget.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                      style={{ width: '60%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">60% of budget allocated</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-600">Start by creating your first budget category below.</p>
          </div>
        )}

        {/* Add New Budget Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Add New Budget</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Transportation, Food, Entertainment"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget (Ksh)
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAdd}
              disabled={isAddingBudget || !newCategory.trim() || !newAmount}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isAddingBudget ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              {isAddingBudget ? 'Adding...' : 'Add Budget'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}